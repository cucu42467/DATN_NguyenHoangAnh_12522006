using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;
using Models.Data;

namespace BLL.Services;

/// <summary>
/// Service xử lý thêm giao dịch đầy đủ với 10 bước trong 1 transaction
/// Áp dụng đầy đủ luồng xử lý nghiệp vụ theo yêu cầu
/// </summary>
public class GiaoDichService : IGiaoDichService
{
    // === DEPENDENCIES ===

    private readonly AppDbContext _context;
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly INganSachDal _nganSachDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ILogger<GiaoDichService> _logger;


    // === CONSTANTS ===

    private static readonly HashSet<string> AllowedFileExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".pdf"
    };

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "application/pdf"
    };

    private const int DefaultMaxUploadSizeMB = 10;


    // === CONSTRUCTOR ===

    public GiaoDichService(
        AppDbContext context,
        ITaiKhoanDal taiKhoanDal,
        INganSachDal nganSachDal,
        IAuditLogDal auditLogDal,
        ILogger<GiaoDichService> logger)
    {
        _context = context;
        _taiKhoanDal = taiKhoanDal;
        _nganSachDal = nganSachDal;
        _auditLogDal = auditLogDal;
        _logger = logger;
    }


    // === PUBLIC METHOD ===

    /// <summary>
    /// Thêm mới giao dịch đầy đủ với 10 bước trong 1 transaction
    /// 
    /// LUỒNG XỬ LÝ:
    /// - Bước 0: Validate đầu vào (trước transaction)
    /// - Bước 1: INSERT giao dịch (tbl_giaodich)
    /// - Bước 2: UPDATE số dư tài khoản (tbl_taikhoan)
    /// - Bước 3: UPSERT ngân sách (tbl_ngansach)
    /// - Bước 4: INSERT theo dõi ngân sách (tbl_theodoi_ngansach)
    /// - Bước 5: UPSERT tổng hợp tháng (tbl_tonghop_thang)
    /// - Bước 6: INSERT chi tiết giao dịch (tbl_chitiet_giaodich)
    /// - Bước 7: Xử lý file đính kèm (tbl_tep_dinhkem + tbl_giaodich_tep)
    /// - Bước 8: INSERT thông báo (tbl_thongbao)
    /// - Bước 9: INSERT audit log (tbl_audit_log)
    /// - Bước 10: INSERT hành vi người dùng (tbl_hanhvi_nguoidung) - NGOÀI transaction
    /// </summary>
    /// <param name="request">Thông tin giao dịch cần tạo</param>
    /// <param name="nguoiDungId">ID người dùng thực hiện</param>
    /// <param name="ipAddress">Địa chỉ IP của client</param>
    /// <param name="ct">CancellationToken</param>
    /// <returns>Response chứa kết quả và các thông báo</returns>
    public async Task<ThemGiaoDichResponse> ThemGiaoDichDayDuAsync(
        ThemGiaoDichRequest request,
        int nguoiDungId,
        string? ipAddress = null,
        CancellationToken ct = default)
    {
        // BƯỚC 0: VALIDATE ĐẦU VÀO
        
        _logger.LogInformation("[Bước 0] Bắt đầu validate đầu vào cho người dùng {NguoiDungId}", nguoiDungId);

        // Validate 1: Kiểm tra người dùng tồn tại và hợp lệ
        var nguoiDung = await _context.TblNguoidungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId && x.TrangThai == 1, ct);

        if (nguoiDung == null)
        {
            _logger.LogWarning("[Bước 0] Người dùng {NguoiDungId} không hợp lệ", nguoiDungId);
            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "NGUOI_DUNG_KHONG_HOP_LE",
                ThongBao = "Người dùng không hợp lệ"
            };
        }

        // Validate 2: Kiểm tra tài khoản nguồn tồn tại, thuộc người dùng và đang hoạt động
        var taiKhoanNguon = await _context.TblTaikhoans
            .AsNoTracking()
            .FirstOrDefaultAsync(x => 
                x.TaiKhoanId == request.TaiKhoanId && 
                x.NguoiDungId == nguoiDungId && 
                x.TrangThai == 1, ct);

        if (taiKhoanNguon == null)
        {
            _logger.LogWarning("[Bước 0] Tài khoản nguồn {TaiKhoanId} không hợp lệ", request.TaiKhoanId);
            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "TAI_KHOAN_KHONG_HOP_LE",
                ThongBao = "Tài khoản nguồn không hợp lệ hoặc không thuộc về bạn"
            };
        }

        var soDuHienTai = taiKhoanNguon.SoDu ?? 0m;

        // Validate 3: Kiểm tra số tiền > 0 (đã có trong attribute, nhưng kiểm tra lại)
        if (request.SoTien <= 0)
        {
            _logger.LogWarning("[Bước 0] Số tiền không hợp lệ: {SoTien}", request.SoTien);
            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "SO_TIEN_KHONG_HOP_LE",
                ThongBao = "Số tiền phải lớn hơn 0"
            };
        }

        // Validate 4: Kiểm tra loại giao dịch hợp lệ
        if (request.LoaiGiaoDich < 1 || request.LoaiGiaoDich > 3)
        {
            _logger.LogWarning("[Bước 0] Loại giao dịch không hợp lệ: {LoaiGiaoDich}", request.LoaiGiaoDich);
            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "LOAI_GIAO_DICH_KHONG_HOP_LE",
                ThongBao = "Loại giao dịch không hợp lệ. Chỉ chấp nhận: 1 (Thu), 2 (Chi), 3 (Chuyển khoản)"
            };
        }

        // Validate 5: Kiểm tra ngày giao dịch không để trống (đã có trong attribute)
        if (request.NgayGiaoDich == default)
        {
            _logger.LogWarning("[Bước 0] Ngày giao dịch không hợp lệ");
            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "NGAY_GIAO_DICH_KHONG_HOP_LE",
                ThongBao = "Ngày giao dịch không được để trống"
            };
        }

        // Validate 6: Kiểm tra danh mục nếu có giá trị
        int? loaiDanhMucId = null;
        string? tenDanhMuc = null;

        if (request.DanhMucId.HasValue)
        {
            var danhMuc = await _context.TblDanhmucs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => 
                    x.DanhMucId == request.DanhMucId.Value &&
                    x.TrangThai == 1 &&
                    x.DaXoa == 0 &&
                    (x.NguoiDungId == null || x.NguoiDungId == nguoiDungId), ct);

            if (danhMuc == null)
            {
                _logger.LogWarning("[Bước 0] Danh mục {DanhMucId} không hợp lệ", request.DanhMucId);
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "DANH_MUC_KHONG_HOP_LE",
                    ThongBao = "Danh mục không hợp lệ"
                };
            }

            loaiDanhMucId = danhMuc.LoaiDanhMucId;
            tenDanhMuc = danhMuc.TenDanhMuc;

            // Validate 7: Kiểm tra chéo loại giao dịch vs loại danh mục
            // LoaiGiaoDich = 1 (Thu) thì LoaiDanhMucId phải = 1 (Thu nhập)
            // LoaiGiaoDich = 2 (Chi) thì LoaiDanhMucId phải = 2 (Chi tiêu)
            var isThu = request.LoaiGiaoDich == 1;
            var isChi = request.LoaiGiaoDich == 2;
            var loaiDanhMucHopLe = isThu && loaiDanhMucId == 1 ||
                                   isChi && loaiDanhMucId == 2 ||
                                   request.LoaiGiaoDich == 3; // Chuyển khoản không cần danh mục

            if (!loaiDanhMucHopLe)
            {
                _logger.LogWarning("[Bước 0] Danh mục không phù hợp loại giao dịch. LoaiGiaoDich={Loai}, LoaiDanhMucId={LoaiDM}",
                    request.LoaiGiaoDich, loaiDanhMucId);
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "DANH_MUC_KHONG_PHU_HOP",
                    ThongBao = "Danh mục không phù hợp với loại giao dịch. Danh mục thu nhập chỉ dùng cho giao dịch Thu, danh mục chi tiêu chỉ dùng cho giao dịch Chi"
                };
            }
        }

        // Validate 8: Kiểm tra chuyển khoản
        if (request.LoaiGiaoDich == 3) // Chuyển khoản
        {
            if (!request.TaiKhoanDichId.HasValue)
            {
                _logger.LogWarning("[Bước 0] Chuyển khoản nhưng không có tài khoản đích");
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "CHUYEN_KHOAN_THIEU_TAI_KHOAN_DICH",
                    ThongBao = "Tài khoản đích là bắt buộc khi thực hiện chuyển khoản"
                };
            }

            if (request.TaiKhoanDichId.Value == request.TaiKhoanId)
            {
                _logger.LogWarning("[Bước 0] Tài khoản nguồn và đích trùng nhau");
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TAI_KHOAN_TRUNG_NHAU",
                    ThongBao = "Tài khoản nguồn và tài khoản đích không được trùng nhau"
                };
            }

            var taiKhoanDich = await _context.TblTaikhoans
                .AsNoTracking()
                .FirstOrDefaultAsync(x => 
                    x.TaiKhoanId == request.TaiKhoanDichId.Value && 
                    x.NguoiDungId == nguoiDungId && 
                    x.TrangThai == 1, ct);

            if (taiKhoanDich == null)
            {
                _logger.LogWarning("[Bước 0] Tài khoản đích {TaiKhoanDichId} không hợp lệ", request.TaiKhoanDichId);
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TAI_KHOAN_DICH_KHONG_HOP_LE",
                    ThongBao = "Tài khoản đích không hợp lệ hoặc không thuộc về bạn"
                };
            }
        }

        // Validate 9: Kiểm tra chi tiêu vượt số dư - KHÔNG rollback, chỉ cảnh báo
        bool canhBaoSoDuThap = false;
        if (request.LoaiGiaoDich == 2 && soDuHienTai < request.SoTien)
        {
            canhBaoSoDuThap = true;
            _logger.LogInformation("[Bước 0] Phát hiện số dư thấp. SoDu={SoDu}, SoTien={SoTien}", soDuHienTai, request.SoTien);
        }

        // Validate chi tiết giao dịch nếu có
        if (request.ChiTietList != null && request.ChiTietList.Any())
        {
            var tongChiTiet = request.ChiTietList.Sum(x => x.SoTien);
            if (tongChiTiet != request.SoTien)
            {
                _logger.LogWarning("[Bước 0] Tổng chi tiết {TongChiTiet} không khớp với SoTien {SoTien}",
                    tongChiTiet, request.SoTien);
                return new ThemGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TONGS_CHI_TIET_KHONG_KHOP",
                    ThongBao = $"Tổng chi tiết ({tongChiTiet:N0}) không khớp với số tiền giao dịch ({request.SoTien:N0})"
                };
            }

            // Validate từng chi tiết
            foreach (var chiTiet in request.ChiTietList)
            {
                var dm = await _context.TblDanhmucs
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => 
                        x.DanhMucId == chiTiet.DanhMucId &&
                        x.TrangThai == 1 &&
                        x.DaXoa == 0 &&
                        (x.NguoiDungId == null || x.NguoiDungId == nguoiDungId), ct);

                if (dm == null)
                {
                    return new ThemGiaoDichResponse
                    {
                        ThanhCong = false,
                        MaLoi = "CHI_TIET_DANH_MUC_KHONG_HOP_LE",
                        ThongBao = $"Danh mục ID {chiTiet.DanhMucId} trong chi tiết không hợp lệ"
                    };
                }
            }
        }

        // Validate file đính kèm nếu có
        if (request.TepDinhKemList != null && request.TepDinhKemList.Any())
        {
            // Lấy kích thước upload tối đa từ cấu hình
            var maxUploadSize = await LayKichThuocUploadToiDaAsync(ct);

            foreach (var file in request.TepDinhKemList)
            {
                // Kiểm tra định dạng file
                var extension = Path.GetExtension(file.TenFile);
                if (!AllowedFileExtensions.Contains(extension))
                {
                    return new ThemGiaoDichResponse
                    {
                        ThanhCong = false,
                        MaLoi = "DINH_DANG_FILE_KHONG_HOP_LE",
                        ThongBao = $"File '{file.TenFile}' có định dạng không được hỗ trợ. Chỉ chấp nhận: jpg, jpeg, png, pdf"
                    };
                }

                // Kiểm tra kích thước file
                if (file.KichThuoc.HasValue && file.KichThuoc.Value > maxUploadSize * 1024 * 1024)
                {
                    return new ThemGiaoDichResponse
                    {
                        ThanhCong = false,
                        MaLoi = "KICH_THUOC_FILE_QUA_LON",
                        ThongBao = $"File '{file.TenFile}' có kích thước vượt quá giới hạn ({maxUploadSize}MB)"
                    };
                }
            }
        }

        _logger.LogInformation("[Bước 0] Validate đầu vào hoàn tất. Bắt đầu transaction");


        // BẮT ĐẦU TRANSACTION - BƯỚC 1-9

        // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        try
        {
            var thongBaoList = new List<ThongBaoItem>();
            var canhBao = new CanhBaoGiaoDich();
            int? nganSachId = null;
            int newGiaoDichId = 0;
            decimal soDuSauGiaoDich = soDuHienTai;

            #region ========================================
            #region BƯỚC 1: INSERT GIAO DỊCH
            #endregion ========================================

            _logger.LogInformation("[Bước 1] Tạo giao dịch mới");

            var giaoDich = new TblGiaodich
            {
                NguoiDungId = nguoiDungId,
                TaiKhoanId = request.TaiKhoanId,
                TaiKhoanDichId = request.TaiKhoanDichId,
                DanhMucId = request.DanhMucId,
                LoaiGiaoDich = request.LoaiGiaoDich,
                SoTien = request.SoTien,
                TienTe = request.TienTe ?? "VND",
                TyGiaQuyDoi = request.TyGiaQuyDoi ?? 1m,
                NgayGiaoDich = request.NgayGiaoDich,
                MoTa = request.MoTa,
                TenGiaoDich = request.TenGiaoDich ?? (request.MoTa?.Length > 50 ? request.MoTa[..50] : request.MoTa),   // ← THÊM MỚI
                NguonDuLieu = 0,
                LaTuDong = request.LaTuDong ? 1 : (ulong)0,
                DoTinCay = request.DoTinCay ?? 1f,
                NgayTao = TimeHelper.NowInVietnam(),
                TrangThai = 1,
                NguonTao = request.NguonTao ?? "web",
                ViTri = request.ViTri,
                MaGiaoDichNgoai = request.MaGiaoDichNgoai
            };

            _context.TblGiaodiches.Add(giaoDich);
            await _context.SaveChangesAsync(ct);
            newGiaoDichId = giaoDich.GiaoDichId;

            _logger.LogInformation("[Bước 1] Đã tạo giao dịch với ID: {GiaoDichId}", newGiaoDichId);

            // BƯỚC 2: CẬP NHẬT SỐ DƯ TÀI KHOẢN

            _logger.LogInformation("[Bước 2] Cập nhật số dư tài khoản nguồn");

            if (request.LoaiGiaoDich == 1) // Thu
            {
                soDuSauGiaoDich = soDuHienTai + request.SoTien;
                await _context.TblTaikhoans
                    .Where(x => x.TaiKhoanId == request.TaiKhoanId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.SoDu, soDuSauGiaoDich)
                        .SetProperty(x => x.NgayCapNhatSoDu, TimeHelper.NowInVietnam()), ct);
            }
            else if (request.LoaiGiaoDich == 2) // Chi
            {
                soDuSauGiaoDich = soDuHienTai - request.SoTien;
                await _context.TblTaikhoans
                    .Where(x => x.TaiKhoanId == request.TaiKhoanId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.SoDu, soDuSauGiaoDich)
                        .SetProperty(x => x.NgayCapNhatSoDu, TimeHelper.NowInVietnam()), ct);
            }
            else if (request.LoaiGiaoDich == 3) // Chuyển khoản
            {
                // Trừ tài khoản nguồn
                soDuSauGiaoDich = soDuHienTai - request.SoTien;
                await _context.TblTaikhoans
                    .Where(x => x.TaiKhoanId == request.TaiKhoanId)
                    .ExecuteUpdateAsync(setters => setters
                        .SetProperty(x => x.SoDu, soDuSauGiaoDich)
                        .SetProperty(x => x.NgayCapNhatSoDu, TimeHelper.NowInVietnam()), ct);

                // Cộng tài khoản đích
                var taiKhoanDichHienTai = await _context.TblTaikhoans
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.TaiKhoanId == request.TaiKhoanDichId!.Value, ct);

                if (taiKhoanDichHienTai != null)
                {
                    var soDuDichMoi = (taiKhoanDichHienTai.SoDu ?? 0m) + request.SoTien;
                    await _context.TblTaikhoans
                        .Where(x => x.TaiKhoanId == request.TaiKhoanDichId!.Value)
                        .ExecuteUpdateAsync(setters => setters
                            .SetProperty(x => x.SoDu, soDuDichMoi)
                            .SetProperty(x => x.NgayCapNhatSoDu, TimeHelper.NowInVietnam()), ct);
                }
            }

            _logger.LogInformation("[Bước 2] Số dư sau giao dịch: {SoDu}", soDuSauGiaoDich);

            // Cập nhật cảnh báo số dư thấp
            if (canhBaoSoDuThap)
            {
                canhBao.CoCanhBaoSoDuThap = true;
                canhBao.NoiDungCanhBaoSoDu = $"Số dư tài khoản \"{taiKhoanNguon.TenTaiKhoan}\" đang ở mức thấp ({soDuSauGiaoDich:N0}đ) sau giao dịch này";
            }

            // BƯỚC 2: CẬP NHẬT SỐ DƯ TÀI KHOẢN

            if (request.LoaiGiaoDich == 2 && request.DanhMucId.HasValue) // Chi tiêu có danh mục
            {
                _logger.LogInformation("[Bước 3] Xử lý ngân sách");

                var thang = request.NgayGiaoDich.Month;
                var nam = request.NgayGiaoDich.Year;

                var nganSach = await _context.TblNgansaches
                    .FirstOrDefaultAsync(x => 
                        x.NguoiDungId == nguoiDungId &&
                        x.DanhMucId == request.DanhMucId.Value &&
                        x.Thang == thang &&
                        x.Nam == nam &&
                        x.TrangThai == 1, ct);

                bool laNganSachMoi = false;
                decimal soTienDaChiMoi = request.SoTien;
                float phanTramMoi = 0;

                if (nganSach == null)
                {
                    // Chưa có ngân sách - tạo mới nếu được xác nhận
                    if (request.XacNhanTaoNganSach)
                    {
                        _logger.LogInformation("[Bước 3] Tạo ngân sách mới cho danh mục {DanhMucId}", request.DanhMucId);

                        nganSach = new TblNgansach
                        {
                            NguoiDungId = nguoiDungId,
                            DanhMucId = request.DanhMucId.Value,
                            SoTienToiDa = 0m, // Chưa đặt hạn mức
                            Thang = thang,
                            Nam = nam,
                            SoTienDaChi = request.SoTien,
                            PhanTramDaDung = 0, // Chưa có hạn mức thì = 0
                            TrangThai = 1
                        };

                        _context.TblNgansaches.Add(nganSach);
                        await _context.SaveChangesAsync(ct);

                        nganSachId = nganSach.NganSachId;
                        laNganSachMoi = true;

                        canhBao.LaNganSachMoi = true;
                        canhBao.NoiDungNganSachMoi = $"Hệ thống đã tạo ngân sách mặc định cho danh mục \"{tenDanhMuc}\" tháng {thang}/{nam}. Bạn có thể chỉnh sửa hạn mức tại trang Ngân sách.";
                    }
                }
                else
                {
                    nganSachId = nganSach.NganSachId;
                    soTienDaChiMoi = (nganSach.SoTienDaChi ?? 0m) + request.SoTien;
                    phanTramMoi = nganSach.SoTienToiDa > 0 
                        ? (float)(soTienDaChiMoi / nganSach.SoTienToiDa * 100m) 
                        : 0;

                    // Cập nhật ngân sách hiện tại
                    await _context.TblNgansaches
                        .Where(x => x.NganSachId == nganSach.NganSachId)
                        .ExecuteUpdateAsync(setters => setters
                            .SetProperty(x => x.SoTienDaChi, soTienDaChiMoi)
                            .SetProperty(x => x.PhanTramDaDung, phanTramMoi), ct);
                }

                // Cập nhật cảnh báo
                canhBao.PhanTramNganSach = phanTramMoi;

                // Đọc ngưỡng cảnh báo từ ngân sách, mặc định 80%
                var canhBaoPhanTram = nganSach?.CanhBaoPhanTram ?? 80f;   // ← THÊM MỚI

                if (phanTramMoi >= 100)
                {
                    canhBao.CoCanhBaoVuotNganSach = true;
                    canhBao.NoiDungCanhBaoVuotNganSach = $"Danh mục \"{tenDanhMuc}\" đã vượt {phanTramMoi:F1}% ngân sách tháng {thang}/{nam}";
                }
                else if (phanTramMoi >= canhBaoPhanTram)   // ← SỬA: dùng biến thay vì hardcode 80
                {
                    canhBao.CoCanhBaoGanNganSach = true;
                    canhBao.NoiDungCanhBaoGanNganSach = $"Danh mục \"{tenDanhMuc}\" đã dùng {phanTramMoi:F1}% ngân sách tháng {thang}/{nam}";
                }

                _logger.LogInformation("[Bước 3] Ngân sách: SoTienDaChi={SoTienDaChi}, PhanTram={PhanTram}%", 
                    soTienDaChiMoi, phanTramMoi);
            }

            #endregion

            // BƯỚC 4: INSERT THEO DÕI NGÂN SÁCH

            if (nganSachId.HasValue)
            {
                _logger.LogInformation("[Bước 4] Tạo bản ghi theo dõi ngân sách");

                var nganSach = await _context.TblNgansaches
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.NganSachId == nganSachId.Value, ct);

                if (nganSach != null)
                {
                    // Lưu lại SoTienDaChi đã được cập nhật ở Bước 3
                    // KHÔNG cộng thêm request.SoTien vì đã cập nhật ở Bước 3 rồi
                    var theoDoi = new TblTheodoiNgansach
                    {
                        NganSachId = nganSachId.Value,
                        SoTienDaChi = nganSach.SoTienDaChi ?? 0m,
                        PhanTramDaDung = nganSach.PhanTramDaDung,
                        NgayCapNhat = TimeHelper.NowInVietnam()
                    };

                    _context.TblTheodoiNgansaches.Add(theoDoi);
                    await _context.SaveChangesAsync(ct);

                    _logger.LogInformation("[Bước 4] Đã tạo bản ghi theo dõi ngân sách ID: {Id}", theoDoi.Id);
                }
            }

            // BƯỚC 5: UPSERT TỔNG HỢP THÁNG


            if (request.LoaiGiaoDich == 1 || request.LoaiGiaoDich == 2) // Thu hoặc Chi
            {
                _logger.LogInformation("[Bước 5] Xử lý tổng hợp tháng");

                var thang = request.NgayGiaoDich.Month;
                var nam = request.NgayGiaoDich.Year;

                var tongHop = await _context.TblTonghopThangs
                    .FirstOrDefaultAsync(x => 
                        x.NguoiDungId == nguoiDungId &&
                        x.Thang == thang &&
                        x.Nam == nam, ct);

                if (tongHop == null)
                {
                    // Tạo mới
                    tongHop = new TblTonghopThang
                    {
                        NguoiDungId = nguoiDungId,
                        Thang = thang,
                        Nam = nam,
                        TongThu = request.LoaiGiaoDich == 1 ? request.SoTien : 0m,
                        TongChi = request.LoaiGiaoDich == 2 ? request.SoTien : 0m,
                        TietKiem = request.LoaiGiaoDich == 1 ? request.SoTien : -request.SoTien,
                        TyLeTietKiem = request.LoaiGiaoDich == 1 && request.SoTien > 0 ? 100f : 0f,
                        NgayCapNhat = TimeHelper.NowInVietnam()
                    };

                    _context.TblTonghopThangs.Add(tongHop);
                }
                else
                {
                    // Cập nhật
                    var tongThuMoi = tongHop.TongThu ?? 0m;
                    var tongChiMoi = tongHop.TongChi ?? 0m;

                    if (request.LoaiGiaoDich == 1)
                        tongThuMoi += request.SoTien;
                    else
                        tongChiMoi += request.SoTien;

                    var tietKiemMoi = tongThuMoi - tongChiMoi;
                    var tyLeTietKiemMoi = tongThuMoi > 0 
                        ? (float)(tietKiemMoi / tongThuMoi * 100m) 
                        : 0f;

                    await _context.TblTonghopThangs
                        .Where(x => x.Id == tongHop.Id)
                        .ExecuteUpdateAsync(setters => setters
                            .SetProperty(x => x.TongThu, tongThuMoi)
                            .SetProperty(x => x.TongChi, tongChiMoi)
                            .SetProperty(x => x.TietKiem, tietKiemMoi)
                            .SetProperty(x => x.TyLeTietKiem, tyLeTietKiemMoi)
                            .SetProperty(x => x.NgayCapNhat, TimeHelper.NowInVietnam()), ct);
                }

                await _context.SaveChangesAsync(ct);
                _logger.LogInformation("[Bước 5] Đã cập nhật tổng hợp tháng");
            }


            // BƯỚC 6: INSERT CHI TIẾT GIAO DỊCH
            #region BƯỚC 6: INSERT CHI TIẾT GIAO DỊCH

            if (request.ChiTietList != null && request.ChiTietList.Any())
            {
                _logger.LogInformation("[Bước 6] Tạo chi tiết giao dịch");

                foreach (var chiTiet in request.ChiTietList)
                {
                    var chiTietEntity = new TblChitietGiaodich
                    {
                        GiaoDichId = newGiaoDichId,
                        DanhMucId = chiTiet.DanhMucId,
                        SoTien = chiTiet.SoTien,
                        MoTa = chiTiet.MoTa
                    };

                    _context.TblChitietGiaodiches.Add(chiTietEntity);
                }

                await _context.SaveChangesAsync(ct);
                _logger.LogInformation("[Bước 6] Đã tạo {Count} chi tiết giao dịch", request.ChiTietList.Count);
            }

            #endregion

            // BƯỚC 7: XỬ LÝ FILE ĐÍNH KÈM

            if (request.TepDinhKemList != null && request.TepDinhKemList.Any())
            {
                _logger.LogInformation("[Bước 7] Xử lý {Count} file đính kèm", request.TepDinhKemList.Count);

                foreach (var file in request.TepDinhKemList)
                {
                    var tepEntity = new TblTepDinhkem
                    {
                        TenFile = file.TenFile,
                        DuongDan = file.DuongDan,
                        LoaiFile = file.LoaiFile,
                        KichThuoc = file.KichThuoc,
                        NgayTao = TimeHelper.NowInVietnam()
                    };

                    _context.TblTepDinhkems.Add(tepEntity);
                    await _context.SaveChangesAsync(ct);

                    var giaoDichTep = new TblGiaodichTep
                    {
                        GiaoDichId = newGiaoDichId,
                        TepId = tepEntity.TepId
                    };

                    _context.TblGiaodichTeps.Add(giaoDichTep);
                }

                await _context.SaveChangesAsync(ct);
                _logger.LogInformation("[Bước 7] Đã lưu {Count} file đính kèm", request.TepDinhKemList.Count);
            }


            // BƯỚC 8: INSERT THÔNG BÁO

            _logger.LogInformation("[Bước 8] Tạo thông báo");

            // Thông báo xác nhận giao dịch
            var loaiGiaoDichText = request.LoaiGiaoDich switch
            {
                1 => "Thu",
                2 => "Chi",
                3 => "Chuyển khoản",
                _ => "Giao dịch"
            };

            var thongBaoXacNhan = new TblThongbao
            {
                NguoiDungId = nguoiDungId,
                TieuDe = "Giao dịch đã được ghi nhận",
                NoiDung = $"{loaiGiaoDichText} {request.SoTien:N0} {request.TienTe ?? "VND"} - {tenDanhMuc ?? "Không phân loại"} vào lúc {request.NgayGiaoDich:dd/MM/yyyy HH:mm}",
                LoaiThongBao = 1, // Hệ thống
                DaDoc = 0,
                NgayTao = TimeHelper.NowInVietnam(),
                // ← THÊM MỚI: 4 cột điều hướng
                LoaiDoiTuong = "giaodich",
                DoiTuongId = newGiaoDichId,
                DuongDanDieuHuong = $"/giaodich/{newGiaoDichId}",
                NgayHetHan = null
            };

            _context.TblThongbaos.Add(thongBaoXacNhan);
            thongBaoList.Add(new ThongBaoItem
            {
                ThongBaoId = 0, // Sẽ được cập nhật sau
                TieuDe = thongBaoXacNhan.TieuDe,
                NoiDung = thongBaoXacNhan.NoiDung,
                LoaiThongBao = 1
            });

            // Thông báo số dư thấp
            if (canhBao.CoCanhBaoSoDuThap)
            {
                var thongBaoSoDu = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Cảnh báo số dư thấp",
                    NoiDung = canhBao.NoiDungCanhBaoSoDu,
                    LoaiThongBao = 4, // Cảnh báo
                    DaDoc = 0,
                    NgayTao = TimeHelper.NowInVietnam(),
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "taikhoan",
                    DoiTuongId = request.TaiKhoanId,
                    DuongDanDieuHuong = $"/taikhoan/{request.TaiKhoanId}",
                    NgayHetHan = null
                };

                _context.TblThongbaos.Add(thongBaoSoDu);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoSoDu.TieuDe,
                    NoiDung = thongBaoSoDu.NoiDung,
                    LoaiThongBao = 4
                });
            }

            // Thông báo vượt ngân sách
            if (canhBao.CoCanhBaoVuotNganSach)
            {
                var thongBaoVuot = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Vượt ngân sách",
                    NoiDung = canhBao.NoiDungCanhBaoVuotNganSach,
                    LoaiThongBao = 4, // Cảnh báo
                    DaDoc = 0,
                    NgayTao = TimeHelper.NowInVietnam(),
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "ngansach",
                    DoiTuongId = nganSachId,
                    DuongDanDieuHuong = $"/ngansach/{nganSachId}",
                    NgayHetHan = null
                };

                _context.TblThongbaos.Add(thongBaoVuot);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoVuot.TieuDe,
                    NoiDung = thongBaoVuot.NoiDung,
                    LoaiThongBao = 4
                });
            }

            // Thông báo gần ngân sách
            if (canhBao.CoCanhBaoGanNganSach)
            {
                var thongBaoGan = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Sắp đạt giới hạn ngân sách",
                    NoiDung = canhBao.NoiDungCanhBaoGanNganSach,
                    LoaiThongBao = 3, // Nhắc nhở
                    DaDoc = 0,
                    NgayTao = TimeHelper.NowInVietnam(),
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "ngansach",
                    DoiTuongId = nganSachId,
                    DuongDanDieuHuong = $"/ngansach/{nganSachId}",
                    NgayHetHan = null
                };

                _context.TblThongbaos.Add(thongBaoGan);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoGan.TieuDe,
                    NoiDung = thongBaoGan.NoiDung,
                    LoaiThongBao = 3
                });
            }

            // Thông báo ngân sách mới
            if (canhBao.LaNganSachMoi)
            {
                var thongBaoNganSachMoi = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Ngân sách mới được tạo tự động",
                    NoiDung = canhBao.NoiDungNganSachMoi,
                    LoaiThongBao = 1, // Hệ thống
                    DaDoc = 0,
                    NgayTao = TimeHelper.NowInVietnam(),
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "ngansach",
                    DoiTuongId = nganSachId,
                    DuongDanDieuHuong = $"/ngansach/{nganSachId}",
                    NgayHetHan = null
                };

                _context.TblThongbaos.Add(thongBaoNganSachMoi);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoNganSachMoi.TieuDe,
                    NoiDung = thongBaoNganSachMoi.NoiDung,
                    LoaiThongBao = 1
                });
            }

            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("[Bước 8] Đã tạo {Count} thông báo", thongBaoList.Count);


            // BƯỚC 9: INSERT AUDIT LOG

            _logger.LogInformation("[Bước 9] Ghi audit log");

            var auditData = new
            {
                GiaoDichId = newGiaoDichId,
                request.SoTien,
                request.LoaiGiaoDich,
                request.DanhMucId,
                request.TaiKhoanId,
                request.NgayGiaoDich,
                request.MoTa,
                request.NguonTao
            };

            var auditLog = new TblAuditLog
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_giaodich",
                BanGhiId = newGiaoDichId,
                HanhDong = "INSERT",
                DuLieuCu = null,
                DuLieuMoi = JsonSerializer.Serialize(auditData),
                ThoiGian = TimeHelper.NowInVietnam(),
                IpAddress = ipAddress
            };

            _context.TblAuditLogs.Add(auditLog);
            await _context.SaveChangesAsync(ct);

            _logger.LogInformation("[Bước 9] Đã ghi audit log ID: {Id}", auditLog.Id);


            // COMMIT TRANSACTION
            await transaction.CommitAsync(ct);
            _logger.LogInformation("[TRANSACTION] Commit thành công cho giao dịch ID: {GiaoDichId}", newGiaoDichId);

            // BƯỚC 10: INSERT HÀNH VI NGƯỜI DÙNG (NGOÀI TRANSACTION)

            // Bước này thực hiện NGOÀI transaction, lỗi không ảnh hưởng kết quả
            try
            {
                _logger.LogInformation("[Bước 10] Ghi hành vi người dùng");

                var hanhViData = new
                {
                    GiaoDichId = newGiaoDichId,
                    request.LoaiGiaoDich,
                    request.SoTien,
                    request.DanhMucId
                };

                var hanhVi = new TblHanhviNguoidung
                {
                    NguoiDungId = nguoiDungId,
                    HanhDong = "Thêm giao dịch",
                    DoiTuong = "tbl_giaodich",
                    ThoiGian = TimeHelper.NowInVietnam(),
                    IpAddress = ipAddress,
                    ChiTietThayDoi = JsonSerializer.Serialize(hanhViData)
                };

                _context.TblHanhviNguoidungs.Add(hanhVi);
                await _context.SaveChangesAsync(ct);

                _logger.LogInformation("[Bước 10] Đã ghi hành vi người dùng ID: {Id}", hanhVi.Id);
            }
            catch (Exception ex)
            {
                // Chỉ log warning, không ảnh hưởng kết quả
                _logger.LogWarning(ex, "[Bước 10] Lỗi khi ghi hành vi người dùng - không ảnh hưởng giao dịch");
            }


            // TRẢ VỀ KẾT QUẢ

            _logger.LogInformation("[HOAN TAT] Giao dịch {GiaoDichId} đã được tạo thành công", newGiaoDichId);

            return new ThemGiaoDichResponse
            {
                ThanhCong = true,
                GiaoDichId = newGiaoDichId,
                SoDuSauGiaoDich = soDuSauGiaoDich,
                CacThongBao = thongBaoList,
                CanhBao = canhBao,
                ThongBao = "Tạo giao dịch thành công"
            };
        }
        catch (Exception ex)
        {
            // ROLLBACK
            await transaction.RollbackAsync(ct);
            _logger.LogError(ex, "[LOI] Lỗi khi tạo giao dịch. Đã rollback.");

            return new ThemGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "LOI_HE_THONG",
                ThongBao = "Đã xảy ra lỗi khi tạo giao dịch. Vui lòng thử lại."
            };
        }

    }



    /// <summary>
    /// Lấy kích thước upload tối đa từ cấu hình hệ thống
    /// </summary>
    private async Task<int> LayKichThuocUploadToiDaAsync(CancellationToken ct)
    {
        try
        {
            var cauHinh = await _context.TblCauhinhHethongs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.TenThamSo == "Max_Upload_Size_MB", ct);

            if (cauHinh != null && int.TryParse(cauHinh.GiaTri, out var size))
                return size;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Không thể đọc cấu hình Max_Upload_Size_MB, sử dụng mặc định");
        }

        return DefaultMaxUploadSizeMB;
    }


    // ============================================================
    // SUA GIAO DICH - 10 BUOC
    // ============================================================

    /// <summary>
    /// Sửa giao dịch đầy đủ với 10 bước trong 1 transaction
    /// 
    /// LUỒNG XỬ LÝ:
    /// - Bước 0: Validate đầu vào (trước transaction)
    /// - Bước 1: UPDATE giao dịch (tbl_giaodich)
    /// - Bước 2: Hoàn tác số dư cũ + Áp dụng số dư mới (tbl_taikhoan)
    /// - Bước 3: Hoàn tác ngân sách cũ (tbl_ngansach)
    /// - Bước 4: Áp dụng ngân sách mới (tbl_ngansach)
    /// - Bước 5: Hoàn tác tổng hợp tháng cũ (tbl_tonghop_thang)
    /// - Bước 6: Áp dụng tổng hợp tháng mới (tbl_tonghop_thang)
    /// - Bước 7: Xử lý file đính kèm (tbl_tep_dinhkem + tbl_giaodich_tep)
    /// - Bước 8: INSERT thông báo (tbl_thongbao)
    /// - Bước 9: INSERT audit log (tbl_audit_log)
    /// - Bước 10: INSERT hành vi người dùng (tbl_hanhvi_nguoidung) - NGOÀI transaction
    /// </summary>
    public async Task<SuaGiaoDichResponse> SuaGiaoDichAsync(
        SuaGiaoDichRequest request,
        int nguoiDungId,
        string? ipAddress = null,
        CancellationToken ct = default)
    {
        // BƯỚC 0: VALIDATE ĐẦU VÀO (trước transaction)

        _logger.LogInformation("[SỬA - Bước 0] Bắt đầu validate đầu vào cho giao dịch {GiaoDichId}", request.GiaoDichId);

        // Validate 1: Kiểm tra giao dịch tồn tại và thuộc về người dùng
        var giaoDichCu = await _context.TblGiaodiches
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.GiaoDichId == request.GiaoDichId && x.NguoiDungId == nguoiDungId && x.TrangThai == 1, ct);

        if (giaoDichCu == null)
        {
            _logger.LogWarning("[SỬA - Bước 0] Giao dịch {GiaoDichId} không tồn tại hoặc không thuộc người dùng {NguoiDungId}", request.GiaoDichId, nguoiDungId);
            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "KHONG_TIM_THAY",
                ThongBao = "Không tìm thấy giao dịch"
            };
        }

        // Validate 2: Kiểm tra giao dịch tự động không được sửa
        if (giaoDichCu.LaTuDong.HasValue && giaoDichCu.LaTuDong != 0)
        {
            _logger.LogWarning("[SỬA - Bước 0] Giao dịch {GiaoDichId} là giao dịch tự động, không thể sửa", request.GiaoDichId);
            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "GIAO_DICH_TU_DONG",
                ThongBao = "Không thể sửa giao dịch tự động"
            };
        }

        // Validate 3: SoTien > 0
        if (request.SoTien <= 0)
        {
            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "SO_TIEN_KHONG_HOP_LE",
                ThongBao = "Số tiền phải lớn hơn 0"
            };
        }

        // Validate 4: LoaiGiaoDich thuộc [1, 2, 3]
        if (request.LoaiGiaoDich < 1 || request.LoaiGiaoDich > 3)
        {
            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "LOAI_KHONG_HOP_LE",
                ThongBao = "Loại giao dịch không hợp lệ"
            };
        }

        // Validate 5: Kiểm tra tài khoản nguồn mới
        var taiKhoanNguon = await _context.TblTaikhoans
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TaiKhoanId == request.TaiKhoanId && x.NguoiDungId == nguoiDungId && x.TrangThai == 1, ct);

        if (taiKhoanNguon == null)
        {
            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "TAI_KHOAN_KHONG_HOP_LE",
                ThongBao = "Tài khoản nguồn không hợp lệ"
            };
        }

        // Validate 6: Kiểm tra tài khoản đích nếu là chuyển khoản
        if (request.LoaiGiaoDich == 3) // Chuyển khoản
        {
            if (!request.TaiKhoanDichId.HasValue)
            {
                return new SuaGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TAI_KHOAN_DICH_THIEU",
                    ThongBao = "Tài khoản đích là bắt buộc khi chuyển khoản"
                };
            }

            if (request.TaiKhoanDichId.Value == request.TaiKhoanId)
            {
                return new SuaGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TAI_KHOAN_TRUNG_NHAU",
                    ThongBao = "Tài khoản nguồn và đích không được trùng nhau"
                };
            }

            var taiKhoanDich = await _context.TblTaikhoans
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.TaiKhoanId == request.TaiKhoanDichId.Value && x.NguoiDungId == nguoiDungId && x.TrangThai == 1, ct);

            if (taiKhoanDich == null)
            {
                return new SuaGiaoDichResponse
                {
                    ThanhCong = false,
                    MaLoi = "TAI_KHOAN_DICH_KHONG_HOP_LE",
                    ThongBao = "Tài khoản đích không hợp lệ"
                };
            }
        }

        // Xác định các flags thay đổi
        var doiLoaiGiaoDich = request.LoaiGiaoDich != giaoDichCu.LoaiGiaoDich;
        var doiSoTien = request.SoTien != giaoDichCu.SoTien;
        var doiTaiKhoan = request.TaiKhoanId != giaoDichCu.TaiKhoanId;
        var doiDanhMuc = request.DanhMucId != giaoDichCu.DanhMucId;
        var doiThang = request.NgayGiaoDich.Month != giaoDichCu.NgayGiaoDich.Month
                    || request.NgayGiaoDich.Year != giaoDichCu.NgayGiaoDich.Year;
        var canCapNhatSoDu = doiLoaiGiaoDich || doiSoTien || doiTaiKhoan;
        var canCapNhatNganSach = doiLoaiGiaoDich || doiSoTien || doiDanhMuc || doiThang;

        _logger.LogInformation("[SỬA - Bước 0] Validate thành công. Thay đổi: Loai={DoiLoai}, Tien={DoiTien}, TK={DoiTK}, DM={DoiDM}, Thang={DoiThang}",
            doiLoaiGiaoDich, doiSoTien, doiTaiKhoan, doiDanhMuc, doiThang);

        // Lưu dữ liệu cũ cho audit
        var duLieuCu = new GiaoDichCuData
        {
            GiaoDichId = giaoDichCu.GiaoDichId,
            TaiKhoanId = giaoDichCu.TaiKhoanId,
            TaiKhoanDichId = giaoDichCu.TaiKhoanDichId,
            DanhMucId = giaoDichCu.DanhMucId,
            LoaiGiaoDich = (byte)giaoDichCu.LoaiGiaoDich,
            SoTien = giaoDichCu.SoTien,
            TienTe = giaoDichCu.TienTe,
            TyGiaQuyDoi = giaoDichCu.TyGiaQuyDoi,
            NgayGiaoDich = giaoDichCu.NgayGiaoDich,
            MoTa = giaoDichCu.MoTa,
            LaTuDong = giaoDichCu.LaTuDong,
            DoTinCay = giaoDichCu.DoTinCay,
            TrangThai = giaoDichCu.TrangThai ?? 1,
            NguonTao = giaoDichCu.NguonTao,
            ViTri = giaoDichCu.ViTri,
            MaGiaoDichNgoai = giaoDichCu.MaGiaoDichNgoai
        };

        // Bắt đầu transaction
        await using var transaction = await _context.Database.BeginTransactionAsync(ct);

        try
        {
            // BƯỚC 1: UPDATE GIAO DỊCH

            _logger.LogInformation("[SỬA - Bước 1] Cập nhật giao dịch {GiaoDichId}", request.GiaoDichId);

            var giaoDichEntity = await _context.TblGiaodiches
                .FirstAsync(x => x.GiaoDichId == request.GiaoDichId, ct);

            giaoDichEntity.TaiKhoanId = request.TaiKhoanId;
            giaoDichEntity.TaiKhoanDichId = request.TaiKhoanDichId;
            giaoDichEntity.DanhMucId = request.DanhMucId;
            giaoDichEntity.LoaiGiaoDich = request.LoaiGiaoDich;
            giaoDichEntity.SoTien = request.SoTien;
            giaoDichEntity.TienTe = request.TienTe ?? "VND";
            giaoDichEntity.TyGiaQuyDoi = request.TyGiaQuyDoi ?? 1m;
            giaoDichEntity.NgayGiaoDich = request.NgayGiaoDich;
            giaoDichEntity.MoTa = request.MoTa;
            giaoDichEntity.ViTri = request.ViTri;

            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("[SỬA - Bước 1] Đã cập nhật giao dịch");

            // BƯỚC 2: HOÀN TÁC SỐ DƯ CŨ + ÁP DỤNG SỐ DƯ MỚI

            _logger.LogInformation("[SỬA - Bước 2] Xử lý số dư tài khoản. CanCapNhatSoDu={CanCapNhat}", canCapNhatSoDu);

            var soDuSauCapNhats = new List<SoDuSauCapNhat>();
            var canhBaoSoDuThap = false;
            string? noiDungCanhBaoSoDu = null;

            if (canCapNhatSoDu)
            {
                // Lấy thông tin tài khoản hiện tại (sau hoàn tác)
                var taiKhoanNguonHienTai = await _context.TblTaikhoans
                    .FirstAsync(x => x.TaiKhoanId == request.TaiKhoanId, ct);

                // --- HOÀN TÁC GIAO DỊCH CŨ ---
                if (giaoDichCu.LoaiGiaoDich == 1) // Thu cũ - trừ đi
                {
                    taiKhoanNguonHienTai.SoDu -= giaoDichCu.SoTien;
                    _logger.LogInformation("[SỬA - Bước 2] Hoàn tác Thu cũ: -{SoTien}", giaoDichCu.SoTien);
                }
                else if (giaoDichCu.LoaiGiaoDich == 2) // Chi cũ - cộng lại
                {
                    taiKhoanNguonHienTai.SoDu += giaoDichCu.SoTien;
                    _logger.LogInformation("[SỬA - Bước 2] Hoàn tác Chi cũ: +{SoTien}", giaoDichCu.SoTien);
                }
                else if (giaoDichCu.LoaiGiaoDich == 3) // Chuyển khoản cũ
                {
                    // Hoàn tác tài khoản nguồn cũ
                    var taiKhoanNguonCu = await _context.TblTaikhoans
                        .FirstAsync(x => x.TaiKhoanId == giaoDichCu.TaiKhoanId, ct);
                    taiKhoanNguonCu.SoDu += giaoDichCu.SoTien;

                    // Hoàn tác tài khoản đích cũ
                    if (giaoDichCu.TaiKhoanDichId.HasValue)
                    {
                        var taiKhoanDichCu = await _context.TblTaikhoans
                            .FirstAsync(x => x.TaiKhoanId == giaoDichCu.TaiKhoanDichId.Value, ct);
                        taiKhoanDichCu.SoDu -= giaoDichCu.SoTien;
                    }
                    _logger.LogInformation("[SỬA - Bước 2] Hoàn tác Chuyển khoản cũ: TK nguồn +{SoTien}, TK đích -{SoTien}", giaoDichCu.SoTien);
                }

                // --- ÁP DỤNG GIAO DỊCH MỚI ---
                if (request.LoaiGiaoDich == 1) // Thu mới - cộng vào
                {
                    taiKhoanNguonHienTai.SoDu += request.SoTien;
                    _logger.LogInformation("[SỬA - Bước 2] Áp dụng Thu mới: +{SoTien}", request.SoTien);
                }
                else if (request.LoaiGiaoDich == 2) // Chi mới - trừ đi
                {
                    // Kiểm tra số dư trước khi trừ
                    if (taiKhoanNguonHienTai.SoDu < request.SoTien)
                    {
                        canhBaoSoDuThap = true;
                        noiDungCanhBaoSoDu = $"Số dư tài khoản \"{taiKhoanNguonHienTai.TenTaiKhoan}\" không đủ chi. Số dư: {taiKhoanNguonHienTai.SoDu:N0}đ";
                    }
                    taiKhoanNguonHienTai.SoDu -= request.SoTien;
                    _logger.LogInformation("[SỬA - Bước 2] Áp dụng Chi mới: -{SoTien}", request.SoTien);
                }
                else if (request.LoaiGiaoDich == 3) // Chuyển khoản mới
                {
                    // Trừ tài khoản nguồn mới
                    taiKhoanNguonHienTai.SoDu -= request.SoTien;

                    // Cộng tài khoản đích mới
                    if (request.TaiKhoanDichId.HasValue)
                    {
                        var taiKhoanDichMoi = await _context.TblTaikhoans
                            .FirstAsync(x => x.TaiKhoanId == request.TaiKhoanDichId.Value, ct);
                        taiKhoanDichMoi.SoDu += request.SoTien;
                        taiKhoanDichMoi.NgayCapNhatSoDu = TimeHelper.NowInVietnam();

                        soDuSauCapNhats.Add(new SoDuSauCapNhat
                        {
                            TaiKhoanId = taiKhoanDichMoi.TaiKhoanId,
                            TenTaiKhoan = taiKhoanDichMoi.TenTaiKhoan,
                            SoDu = taiKhoanDichMoi.SoDu ?? 0
                        });
                    }
                    _logger.LogInformation("[SỬA - Bước 2] Áp dụng Chuyển khoản mới: TK nguồn -{SoTien}, TK đích +{SoTien}", request.SoTien);
                }

                // Cập nhật thời gian
                taiKhoanNguonHienTai.NgayCapNhatSoDu = TimeHelper.NowInVietnam();

                soDuSauCapNhats.Add(new SoDuSauCapNhat
                {
                    TaiKhoanId = taiKhoanNguonHienTai.TaiKhoanId,
                    TenTaiKhoan = taiKhoanNguonHienTai.TenTaiKhoan,
                    SoDu = taiKhoanNguonHienTai.SoDu ?? 0
                });

                await _context.SaveChangesAsync(ct);
            }
            else
            {
                // Không cần cập nhật số dư, chỉ lấy thông tin
                soDuSauCapNhats.Add(new SoDuSauCapNhat
                {
                    TaiKhoanId = taiKhoanNguon.TaiKhoanId,
                    TenTaiKhoan = taiKhoanNguon.TenTaiKhoan,
                    SoDu = taiKhoanNguon.SoDu ?? 0
                });
            }

            _logger.LogInformation("[SỬA - Bước 2] Hoàn tất xử lý số dư");

            // BƯỚC 3: HOÀN TÁC NGÂN SÁCH CŨ

            _logger.LogInformation("[SỬA - Bước 3] Hoàn tác ngân sách cũ. CanCapNhatNganSach={Can}, LoaiCu={LoaiCu}, DanhMucCu={DanhMucCu}",
                canCapNhatNganSach, giaoDichCu.LoaiGiaoDich, giaoDichCu.DanhMucId);

            if (canCapNhatNganSach && giaoDichCu.LoaiGiaoDich == 2 && giaoDichCu.DanhMucId.HasValue)
            {
                var nganSachCu = await _context.TblNgansaches
                    .FirstOrDefaultAsync(x =>
                        x.NguoiDungId == nguoiDungId &&
                        x.DanhMucId == giaoDichCu.DanhMucId.Value &&
                        x.Thang == giaoDichCu.NgayGiaoDich.Month &&
                        x.Nam == giaoDichCu.NgayGiaoDich.Year &&
                        x.TrangThai == 1, ct);

                if (nganSachCu != null)
                {
                    var soTienCu = nganSachCu.SoTienDaChi ?? 0;
                    var soTienDaChiHoanTac = soTienCu - giaoDichCu.SoTien;
                    soTienDaChiHoanTac = Math.Max(0, soTienDaChiHoanTac); // Không âm
                    var soTienToiDa = nganSachCu.SoTienToiDa > 0 ? nganSachCu.SoTienToiDa : 1;
                    var phanTramHoanTac = (float)((soTienDaChiHoanTac / soTienToiDa) * 100);

                    nganSachCu.SoTienDaChi = soTienDaChiHoanTac;
                    nganSachCu.PhanTramDaDung = phanTramHoanTac;

                    // Ghi lịch sử hoàn tác
                    var theoDoiCu = new TblTheodoiNgansach
                    {
                        NganSachId = nganSachCu.NganSachId,
                        SoTienDaChi = soTienDaChiHoanTac,
                        PhanTramDaDung = phanTramHoanTac,
                        NgayCapNhat = TimeHelper.NowInVietnam()
                    };
                    _context.TblTheodoiNgansaches.Add(theoDoiCu);

                    await _context.SaveChangesAsync(ct);
                    _logger.LogInformation("[SỬA - Bước 3] Hoàn tác ngân sách cũ: SoTienDaChi={SoTienDaChi}, PhanTram={PhanTram}%",
                        soTienDaChiHoanTac, phanTramHoanTac);
                }
            }

            // BƯỚC 4: ÁP DỤNG NGÂN SÁCH MỚI

            _logger.LogInformation("[SỬA - Bước 4] Áp dụng ngân sách mới. LoaiMoi={LoaiMoi}, DanhMucMoi={DanhMucMoi}",
                request.LoaiGiaoDich, request.DanhMucId);

            float? phanTramNganSachMoi = null;
            var canhBaoVuotNganSach = false;
            var canhBaoGanNganSach = false;
            string? noiDungCanhBaoVuotNganSach = null;
            string? noiDungCanhBaoGanNganSach = null;

            if (request.LoaiGiaoDich == 2 && request.DanhMucId.HasValue)
            {
                var nganSachMoi = await _context.TblNgansaches
                    .FirstOrDefaultAsync(x =>
                        x.NguoiDungId == nguoiDungId &&
                        x.DanhMucId == request.DanhMucId.Value &&
                        x.Thang == request.NgayGiaoDich.Month &&
                        x.Nam == request.NgayGiaoDich.Year &&
                        x.TrangThai == 1, ct);

                if (nganSachMoi != null)
                {
                    var soTienDaChiMoi = nganSachMoi.SoTienDaChi + request.SoTien;
                    var phanTramMoi = nganSachMoi.SoTienToiDa > 0
                        ? (float)((soTienDaChiMoi / nganSachMoi.SoTienToiDa) * 100)
                        : 0f;

                    nganSachMoi.SoTienDaChi = soTienDaChiMoi;
                    nganSachMoi.PhanTramDaDung = phanTramMoi;
                    phanTramNganSachMoi = phanTramMoi;

                    // Ghi lịch sử áp dụng mới
                    var theoDoiMoi = new TblTheodoiNgansach
                    {
                        NganSachId = nganSachMoi.NganSachId,
                        SoTienDaChi = soTienDaChiMoi,
                        PhanTramDaDung = phanTramMoi,
                        NgayCapNhat = TimeHelper.NowInVietnam()
                    };
                    _context.TblTheodoiNgansaches.Add(theoDoiMoi);

                    // Đọc ngưỡng cảnh báo từ ngân sách, mặc định 80%
                    var canhBaoPhanTram = nganSachMoi.CanhBaoPhanTram > 0 ? nganSachMoi.CanhBaoPhanTram : 80f;   // ← THÊM MỚI

                    // Cảnh báo
                    if (phanTramMoi >= 100)
                    {
                        canhBaoVuotNganSach = true;
                        noiDungCanhBaoVuotNganSach = $"Danh mục đã vượt ngân sách tháng {request.NgayGiaoDich.Month}/{request.NgayGiaoDich.Year} ({phanTramMoi:F1}%)";
                    }
                    else if (phanTramMoi >= canhBaoPhanTram)   // ← SỬA: dùng biến thay vì hardcode 80
                    {
                        canhBaoGanNganSach = true;
                        noiDungCanhBaoGanNganSach = $"Danh mục đã dùng {phanTramMoi:F1}% ngân sách tháng {request.NgayGiaoDich.Month}/{request.NgayGiaoDich.Year}";
                    }

                    await _context.SaveChangesAsync(ct);
                    _logger.LogInformation("[SỬA - Bước 4] Áp dụng ngân sách mới: SoTienDaChi={SoTienDaChi}, PhanTram={PhanTram}%",
                        soTienDaChiMoi, phanTramMoi);
                }
            }

            // BƯỚC 5: HOÀN TÁC TỔNG HỢP THÁNG CŨ

            _logger.LogInformation("[SỬA - Bước 5] Hoàn tác tổng hợp tháng cũ");

            if (giaoDichCu.LoaiGiaoDich == 1 || giaoDichCu.LoaiGiaoDich == 2)
            {
                var tongHopCu = await _context.TblTonghopThangs
                    .FirstOrDefaultAsync(x =>
                        x.NguoiDungId == nguoiDungId &&
                        x.Thang == giaoDichCu.NgayGiaoDich.Month &&
                        x.Nam == giaoDichCu.NgayGiaoDich.Year, ct);

                if (tongHopCu != null)
                {
                    var tongThuCu = tongHopCu.TongThu ?? 0;
                    var tongChiCu = tongHopCu.TongChi ?? 0;

                    if (giaoDichCu.LoaiGiaoDich == 1) // Thu cũ
                    {
                        tongHopCu.TongThu = Math.Max(0, tongThuCu - giaoDichCu.SoTien);
                    }
                    else // Chi cũ
                    {
                        tongHopCu.TongChi = Math.Max(0, tongChiCu - giaoDichCu.SoTien);
                    }

                    tongHopCu.TietKiem = (tongHopCu.TongThu ?? 0) - (tongHopCu.TongChi ?? 0);
                    tongHopCu.TyLeTietKiem = (tongHopCu.TongThu ?? 0) > 0
                        ? (float)((tongHopCu.TietKiem / (tongHopCu.TongThu ?? 1)) * 100)
                        : 0f;
                    tongHopCu.NgayCapNhat = TimeHelper.NowInVietnam();

                    await _context.SaveChangesAsync(ct);
                    _logger.LogInformation("[SỬA - Bước 5] Hoàn tác tổng hợp cũ: TongThu={TongThu}, TongChi={TongChi}",
                        tongHopCu.TongThu, tongHopCu.TongChi);
                }
            }

            // BƯỚC 6: ÁP DỤNG TỔNG HỢP THÁNG MỚI

            _logger.LogInformation("[SỬA - Bước 6] Áp dụng tổng hợp tháng mới");

            if (request.LoaiGiaoDich == 1 || request.LoaiGiaoDich == 2)
            {
                var tongHopMoi = await _context.TblTonghopThangs
                    .FirstOrDefaultAsync(x =>
                        x.NguoiDungId == nguoiDungId &&
                        x.Thang == request.NgayGiaoDich.Month &&
                        x.Nam == request.NgayGiaoDich.Year, ct);

                if (tongHopMoi == null)
                {
                    // Tạo mới
                    tongHopMoi = new TblTonghopThang
                    {
                        NguoiDungId = nguoiDungId,
                        Thang = request.NgayGiaoDich.Month,
                        Nam = request.NgayGiaoDich.Year,
                        TongThu = request.LoaiGiaoDich == 1 ? request.SoTien : 0,
                        TongChi = request.LoaiGiaoDich == 2 ? request.SoTien : 0,
                        TietKiem = 0,
                        TyLeTietKiem = 0,
                        NgayCapNhat = TimeHelper.NowInVietnam()
                    };
                    tongHopMoi.TietKiem = tongHopMoi.TongThu - tongHopMoi.TongChi;
                    tongHopMoi.TyLeTietKiem = tongHopMoi.TongThu > 0
                        ? (float)((tongHopMoi.TietKiem / tongHopMoi.TongThu) * 100)
                        : 0f;

                    _context.TblTonghopThangs.Add(tongHopMoi);
                }
                else
                {
                    // Cập nhật
                    if (request.LoaiGiaoDich == 1)
                    {
                        tongHopMoi.TongThu += request.SoTien;
                    }
                    else
                    {
                        tongHopMoi.TongChi += request.SoTien;
                    }
                    tongHopMoi.TietKiem = tongHopMoi.TongThu - tongHopMoi.TongChi;
                    tongHopMoi.TyLeTietKiem = tongHopMoi.TongThu > 0
                        ? (float)((tongHopMoi.TietKiem / tongHopMoi.TongThu) * 100)
                        : 0f;
                    tongHopMoi.NgayCapNhat = TimeHelper.NowInVietnam();
                }

                await _context.SaveChangesAsync(ct);
                _logger.LogInformation("[SỬA - Bước 6] Áp dụng tổng hợp mới: TongThu={TongThu}, TongChi={TongChi}",
                    tongHopMoi.TongThu, tongHopMoi.TongChi);
            }

            // BƯỚC 7: XỬ LÝ FILE ĐÍNH KÈM

            _logger.LogInformation("[SỬA - Bước 7] Xử lý file đính kèm");

            // Xóa file cũ (chỉ xóa liên kết)
            if (request.TepDinhKemXoa?.Any() == true)
            {
                var giaoDichTepXoa = await _context.TblGiaodichTeps
                    .Where(x => x.GiaoDichId == request.GiaoDichId && request.TepDinhKemXoa.Contains(x.TepId))
                    .ToListAsync(ct);

                _context.TblGiaodichTeps.RemoveRange(giaoDichTepXoa);
                await _context.SaveChangesAsync(ct);
                _logger.LogInformation("[SỬA - Bước 7] Đã xóa {Count} file đính kèm", giaoDichTepXoa.Count);
            }

            // Thêm file mới
            if (request.TepDinhKemThemMoi?.Any() == true)
            {
                var maxSizeMB = await LayKichThuocUploadToiDaAsync(ct);

                foreach (var file in request.TepDinhKemThemMoi)
                {
                    // Validate file
                    var extension = Path.GetExtension(file.TenFile);
                    if (!AllowedFileExtensions.Contains(extension))
                    {
                        throw new InvalidOperationException($"Định dạng file không hợp lệ: {extension}. Chỉ chấp nhận: jpg, jpeg, png, pdf");
                    }

                    if (file.KichThuoc.HasValue && file.KichThuoc.Value > maxSizeMB * 1024 * 1024)
                    {
                        throw new InvalidOperationException($"Kích thước file vượt quá giới hạn: {maxSizeMB}MB");
                    }

                    var tepMoi = new TblTepDinhkem
                    {
                        TenFile = file.TenFile,
                        DuongDan = file.DuongDan,
                        LoaiFile = file.LoaiFile,
                        KichThuoc = file.KichThuoc,
                        NgayTao = TimeHelper.NowInVietnam()
                    };
                    _context.TblTepDinhkems.Add(tepMoi);
                    await _context.SaveChangesAsync(ct);

                    var giaoDichTep = new TblGiaodichTep
                    {
                        GiaoDichId = request.GiaoDichId,
                        TepId = tepMoi.TepId
                    };
                    _context.TblGiaodichTeps.Add(giaoDichTep);
                    await _context.SaveChangesAsync(ct);
                }
                _logger.LogInformation("[SỬA - Bước 7] Đã thêm {Count} file đính kèm", request.TepDinhKemThemMoi.Count);
            }

            // BƯỚC 8: INSERT THÔNG BÁO

            _logger.LogInformation("[SỬA - Bước 8] Tạo thông báo");
            var thongBaoList = new List<ThongBaoItem>();

            // Thông báo sửa thành công
            var thongBaoChinh = new TblThongbao
            {
                NguoiDungId = nguoiDungId,
                TieuDe = "Giao dịch đã được cập nhật",
                NoiDung = $"Giao dịch {request.MoTa ?? ""} đã được cập nhật thành công",
                LoaiThongBao = 1,
                NgayTao = TimeHelper.NowInVietnam(),
                DaDoc = 0,
                // ← THÊM MỚI: 4 cột điều hướng
                LoaiDoiTuong = "giaodich",
                DoiTuongId = request.GiaoDichId,
                DuongDanDieuHuong = $"/giaodich/{request.GiaoDichId}",
                NgayHetHan = null
            };
            _context.TblThongbaos.Add(thongBaoChinh);
            thongBaoList.Add(new ThongBaoItem
            {
                ThongBaoId = 0,
                TieuDe = thongBaoChinh.TieuDe,
                NoiDung = thongBaoChinh.NoiDung,
                LoaiThongBao = 1
            });

            // Thông báo đổi loại giao dịch
            if (doiLoaiGiaoDich)
            {
                var tenLoaiCu = giaoDichCu.LoaiGiaoDich == 1 ? "Thu" : giaoDichCu.LoaiGiaoDich == 2 ? "Chi" : "Chuyển khoản";
                var tenLoaiMoi = request.LoaiGiaoDich == 1 ? "Thu" : request.LoaiGiaoDich == 2 ? "Chi" : "Chuyển khoản";

                var thongBaoLoai = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Loại giao dịch đã thay đổi",
                    NoiDung = $"Giao dịch đã được đổi từ {tenLoaiCu} sang {tenLoaiMoi}",
                    LoaiThongBao = 1,
                    NgayTao = TimeHelper.NowInVietnam(),
                    DaDoc = 0,
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "giaodich",
                    DoiTuongId = request.GiaoDichId,
                    DuongDanDieuHuong = $"/giaodich/{request.GiaoDichId}",
                    NgayHetHan = null
                };
                _context.TblThongbaos.Add(thongBaoLoai);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoLoai.TieuDe,
                    NoiDung = thongBaoLoai.NoiDung,
                    LoaiThongBao = 1
                });
            }

            // Thông báo cảnh báo số dư thấp
            if (canhBaoSoDuThap)
            {
                var thongBaoSoDu = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Cảnh báo số dư thấp",
                    NoiDung = noiDungCanhBaoSoDu,
                    LoaiThongBao = 4,
                    NgayTao = TimeHelper.NowInVietnam(),
                    DaDoc = 0,
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "taikhoan",
                    DoiTuongId = request.TaiKhoanId,
                    DuongDanDieuHuong = $"/taikhoan/{request.TaiKhoanId}",
                    NgayHetHan = null
                };
                _context.TblThongbaos.Add(thongBaoSoDu);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoSoDu.TieuDe,
                    NoiDung = thongBaoSoDu.NoiDung,
                    LoaiThongBao = 4
                });
            }

            // Thông báo vượt ngân sách
            if (canhBaoVuotNganSach)
            {
                var thongBaoVuotNS = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Vượt ngân sách",
                    NoiDung = noiDungCanhBaoVuotNganSach,
                    LoaiThongBao = 4,
                    NgayTao = TimeHelper.NowInVietnam(),
                    DaDoc = 0,
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "ngansach",
                    DoiTuongId = null,
                    DuongDanDieuHuong = "/ngansach",
                    NgayHetHan = null
                };
                _context.TblThongbaos.Add(thongBaoVuotNS);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoVuotNS.TieuDe,
                    NoiDung = thongBaoVuotNS.NoiDung,
                    LoaiThongBao = 4
                });
            }

            // Thông báo gần ngân sách
            if (canhBaoGanNganSach)
            {
                var thongBaoGanNS = new TblThongbao
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Sắp đạt giới hạn ngân sách",
                    NoiDung = noiDungCanhBaoGanNganSach,
                    LoaiThongBao = 3,
                    NgayTao = TimeHelper.NowInVietnam(),
                    DaDoc = 0,
                    // ← THÊM MỚI: 4 cột điều hướng
                    LoaiDoiTuong = "ngansach",
                    DoiTuongId = null,
                    DuongDanDieuHuong = "/ngansach",
                    NgayHetHan = null
                };
                _context.TblThongbaos.Add(thongBaoGanNS);
                thongBaoList.Add(new ThongBaoItem
                {
                    ThongBaoId = 0,
                    TieuDe = thongBaoGanNS.TieuDe,
                    NoiDung = thongBaoGanNS.NoiDung,
                    LoaiThongBao = 3
                });
            }

            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("[SỬA - Bước 8] Đã tạo {Count} thông báo", thongBaoList.Count);

            // BƯỚC 9: INSERT AUDIT LOG

            _logger.LogInformation("[SỬA - Bước 9] Ghi audit log");

            var duLieuMoi = new
            {
                GiaoDichId = request.GiaoDichId,
                SoTien = request.SoTien,
                LoaiGiaoDich = request.LoaiGiaoDich,
                DanhMucId = request.DanhMucId,
                TaiKhoanId = request.TaiKhoanId,
                NgayGiaoDich = request.NgayGiaoDich,
                MoTa = request.MoTa
            };

            var auditLog = new TblAuditLog
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_giaodich",
                BanGhiId = request.GiaoDichId,
                HanhDong = "UPDATE",
                DuLieuCu = JsonSerializer.Serialize(duLieuCu),
                DuLieuMoi = JsonSerializer.Serialize(duLieuMoi),
                ThoiGian = TimeHelper.NowInVietnam(),
                IpAddress = ipAddress
            };

            _context.TblAuditLogs.Add(auditLog);
            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("[SỬA - Bước 9] Đã ghi audit log ID: {Id}", auditLog.Id);

            // COMMIT TRANSACTION
            await transaction.CommitAsync(ct);
            _logger.LogInformation("[TRANSACTION] Commit thành công cho giao dịch ID: {GiaoDichId}", request.GiaoDichId);

            // BƯỚC 10: INSERT HÀNH VI NGƯỜI DÙNG (NGOÀI TRANSACTION)

            try
            {
                _logger.LogInformation("[SỬA - Bước 10] Ghi hành vi người dùng");

                var chiTietThayDoi = new
                {
                    GiaoDichId = request.GiaoDichId,
                    ThayDoiLoai = doiLoaiGiaoDich,
                    LoaiCu = giaoDichCu.LoaiGiaoDich,
                    LoaiMoi = request.LoaiGiaoDich,
                    SoTienCu = giaoDichCu.SoTien,
                    SoTienMoi = request.SoTien,
                    TaiKhoanCu = giaoDichCu.TaiKhoanId,
                    TaiKhoanMoi = request.TaiKhoanId,
                    DanhMucCu = giaoDichCu.DanhMucId,
                    DanhMucMoi = request.DanhMucId,
                    NgayGiaoDichCu = giaoDichCu.NgayGiaoDich,
                    NgayGiaoDichMoi = request.NgayGiaoDich
                };

                var hanhVi = new TblHanhviNguoidung
                {
                    NguoiDungId = nguoiDungId,
                    HanhDong = "Sửa giao dịch",
                    DoiTuong = "tbl_giaodich",
                    ThoiGian = TimeHelper.NowInVietnam(),
                    IpAddress = ipAddress,
                    ChiTietThayDoi = JsonSerializer.Serialize(chiTietThayDoi)
                };

                _context.TblHanhviNguoidungs.Add(hanhVi);
                await _context.SaveChangesAsync(ct);

                _logger.LogInformation("[SỬA - Bước 10] Đã ghi hành vi người dùng ID: {Id}", hanhVi.Id);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[SỬA - Bước 10] Lỗi khi ghi hành vi người dùng - không ảnh hưởng giao dịch");
            }

            // Build danh sách thay đổi
            var cacThayDoi = new List<string>();
            if (doiLoaiGiaoDich) cacThayDoi.Add("Loại giao dịch");
            if (doiSoTien) cacThayDoi.Add("Số tiền");
            if (doiTaiKhoan) cacThayDoi.Add("Tài khoản");
            if (doiDanhMuc) cacThayDoi.Add("Danh mục");
            if (doiThang) cacThayDoi.Add("Ngày giao dịch");

            // TRẢ VỀ KẾT QUẢ
            _logger.LogInformation("[SỬA - HOÀN TẤT] Giao dịch {GiaoDichId} đã được sửa thành công", request.GiaoDichId);

            return new SuaGiaoDichResponse
            {
                ThanhCong = true,
                GiaoDichId = request.GiaoDichId,
                SoDuSauCapNhats = soDuSauCapNhats,
                DanhSachThongBao = thongBaoList,
                CanhBao = new CanhBaoSuaGiaoDich
                {
                    CoThayDoiLoai = doiLoaiGiaoDich,
                    LoaiCu = giaoDichCu.LoaiGiaoDich,
                    LoaiMoi = request.LoaiGiaoDich,
                    CoCanhBaoSoDuThap = canhBaoSoDuThap,
                    NoiDungCanhBaoSoDu = noiDungCanhBaoSoDu,
                    CoCanhBaoVuotNganSach = canhBaoVuotNganSach,
                    NoiDungCanhBaoVuotNganSach = noiDungCanhBaoVuotNganSach,
                    CoCanhBaoGanNganSach = canhBaoGanNganSach,
                    NoiDungCanhBaoGanNganSach = noiDungCanhBaoGanNganSach,
                    PhanTramNganSach = phanTramNganSachMoi
                },
                CacThayDoi = cacThayDoi,
                ThongBao = "Sửa giao dịch thành công"
            };
        }
        catch (Exception ex)
        {
            // ROLLBACK
            await transaction.RollbackAsync(ct);
            _logger.LogError(ex, "[SỬA - LỖI] Lỗi khi sửa giao dịch. Đã rollback.");

            return new SuaGiaoDichResponse
            {
                ThanhCong = false,
                MaLoi = "LOI_HE_THONG",
                ThongBao = "Đã xảy ra lỗi khi sửa giao dịch. Vui lòng thử lại."
            };
        }
    }

}
