using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models.Data;

namespace BLL;

/// <summary>
/// Implementation xử lý giao dịch định kỳ - 8 bước theo luồng
/// </summary>
public class GiaoDichDinhKyService : IGiaoDichDinhKyService
{
    private readonly AppDbContext _context;
    private readonly IGiaoDichDinhKyDal _giaoDichDinhKyDal;
    private readonly ITaiKhoanDal _taiKhoanDal;
    private readonly INganSachDal _nganSachDal;
    private readonly IThongBaoDal _thongBaoDal;
    private readonly IAuditLogDal _auditLogDal;
    private readonly ILogger<GiaoDichDinhKyService> _logger;

    public GiaoDichDinhKyService(
        AppDbContext context,
        IGiaoDichDinhKyDal giaoDichDinhKyDal,
        ITaiKhoanDal taiKhoanDal,
        INganSachDal nganSachDal,
        IThongBaoDal thongBaoDal,
        IAuditLogDal auditLogDal,
        ILogger<GiaoDichDinhKyService> logger)
    {
        _context = context;
        _giaoDichDinhKyDal = giaoDichDinhKyDal;
        _taiKhoanDal = taiKhoanDal;
        _nganSachDal = nganSachDal;
        _thongBaoDal = thongBaoDal;
        _auditLogDal = auditLogDal;
        _logger = logger;
    }

    public async Task<int> XuLyTatCaAsync(CancellationToken ct = default)
    {
        // Lấy danh sách giao dịch định kỳ cần xử lý
        var danhSachCanXuLy = await _context.TblGiaodichDinhkies
            .AsNoTracking()
            .Where(x => x.TrangThai == 1
                && x.LanTiepTheo != null
                && x.LanTiepTheo <= TimeHelper.NowInVietnam()
                && (x.NgayKetThuc == null || x.NgayKetThuc >= TimeHelper.NowInVietnam()))
            .ToListAsync(ct);

        if (danhSachCanXuLy.Count == 0)
        {
            _logger.LogDebug("Không có giao dịch định kỳ nào cần xử lý");
            return 0;
        }

        _logger.LogInformation("Tìm thấy {Count} giao dịch định kỳ cần xử lý", danhSachCanXuLy.Count);

        int daXuLy = 0;
        foreach (var gdk in danhSachCanXuLy)
        {
            try
            {
                var thanhCong = await XuLyMotGiaoDichDinhKyAsync(gdk, ct);
                if (thanhCong) daXuLy++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý giao dịch định kỳ ID={Id}", gdk.Id);
            }
        }

        return daXuLy;
    }

    private async Task<bool> XuLyMotGiaoDichDinhKyAsync(Models.TblGiaodichDinhky gdk, CancellationToken ct)
    {
        using var transaction = await _context.Database.BeginTransactionAsync(ct);

        try
        {
            var lanTiepTheo = gdk.LanTiepTheo!.Value;

            // ============================================================
            // BƯỚC 1: KIỂM TRA TRÙNG LẶP
            // ============================================================
            var daTonTai = await _context.TblGiaodiches
                .AnyAsync(x =>
                    x.NguoiDungId == gdk.NguoiDungId &&
                    x.TaiKhoanId == gdk.TaiKhoanId &&
                    x.MoTa != null && x.MoTa.Contains($"[DinhKy_Id_{gdk.Id}]") &&
                    x.NgayGiaoDich >= lanTiepTheo.Date &&
                    x.NgayGiaoDich < lanTiepTheo.Date.AddDays(1),
                    ct);

            if (daTonTai)
            {
                _logger.LogWarning("Giao dịch định kỳ ID={Id} đã được tạo trước đó, bỏ qua INSERT", gdk.Id);
                // Vẫn cập nhật LanTiepTheo
                await Buoc8_CapNhatLanTiepTheoAsync(gdk, ct);
                await transaction.CommitAsync(ct);
                return true;
            }

            // ============================================================
            // BƯỚC 2: INSERT GIAO DỊCH MỚI
            // ============================================================
            if (gdk.SoTien <= 0)
            {
                _logger.LogWarning("Giao dịch định kỳ ID={Id} có SoTien không hợp lệ", gdk.Id);
                await transaction.RollbackAsync(ct);
                return false;
            }

            var giaoDich = new Models.TblGiaodich
            {
                NguoiDungId = gdk.NguoiDungId,
                TaiKhoanId = gdk.TaiKhoanId,
                TaiKhoanDichId = null,
                DanhMucId = gdk.DanhMucId,
                LoaiGiaoDich = gdk.LoaiGiaoDich,
                SoTien = gdk.SoTien,
                TienTe = "VND",
                TyGiaQuyDoi = 1.000000m,
                NgayGiaoDich = lanTiepTheo,
                MoTa = $"{gdk.TenGiaoDich} [DinhKy_Id_{gdk.Id}]",
                TenGiaoDich = gdk.TenGiaoDich,   // ← THÊM MỚI
                LaTuDong = 1,
                DoTinCay = 1,
                NgayTao = TimeHelper.NowInVietnam(),
                TrangThai = 1,
                NguonTao = "system"
            };

            _context.TblGiaodiches.Add(giaoDich);
            await _context.SaveChangesAsync(ct);
            var newGiaoDichId = giaoDich.GiaoDichId;

            _logger.LogDebug("Đã tạo giao dịch ID={GiaoDichId} từ định kỳ ID={DinhKyId}", newGiaoDichId, gdk.Id);

            // ============================================================
            // BƯỚC 3: UPDATE SỐ DƯ TÀI KHOẢN
            // ============================================================
            var taiKhoan = await _context.TblTaikhoans
                .FirstOrDefaultAsync(x => x.TaiKhoanId == gdk.TaiKhoanId, ct);

            if (taiKhoan == null || taiKhoan.TrangThai != 1)
            {
                _logger.LogWarning("Tài khoản ID={TaiKhoanId} không hợp lệ", gdk.TaiKhoanId);
                await transaction.RollbackAsync(ct);
                return false;
            }

            // Kiểm tra số dư nếu là Chi tiêu
            if (gdk.LoaiGiaoDich == 2 && taiKhoan.SoDu < gdk.SoTien)
            {
                _logger.LogWarning("Số dư không đủ cho giao dịch định kỳ ID={Id}", gdk.Id);

                // Insert thông báo cảnh báo (không rollback)
                await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
                {
                    NguoiDungId = gdk.NguoiDungId,
                    TieuDe = "Số dư không đủ",
                    NoiDung = $"Giao dịch định kỳ \"{gdk.TenGiaoDich}\" không thể thực hiện do số dư tài khoản không đủ",
                    LoaiThongBao = 4 // Cảnh báo
                }, ct);

                // Vẫn cập nhật LanTiepTheo nhưng không tạo giao dịch
                await transaction.RollbackAsync(ct);
                await Buoc8_CapNhatLanTiepTheoAsync(gdk, ct);
                return true;
            }

            // Cập nhật số dư
            if (gdk.LoaiGiaoDich == 1)
                taiKhoan.SoDu += gdk.SoTien; // Thu: cộng tiền
            else
                taiKhoan.SoDu -= gdk.SoTien; // Chi: trừ tiền

            taiKhoan.NgayCapNhatSoDu = TimeHelper.NowInVietnam();

            // ============================================================
            // BƯỚC 4: UPDATE NGÂN SÁCH (chỉ khi Chi và có DanhMuc)
            // ============================================================
            if (gdk.LoaiGiaoDich == 2 && gdk.DanhMucId.HasValue)
            {
                await CapNhatNganSachAsync(gdk, ct);
            }

            // ============================================================
            // BƯỚC 5: UPDATE TỔNG HỢP THÁNG
            // ============================================================
            await CapNhatTongHopThangAsync(gdk, ct);

            // ============================================================
            // BƯỚC 6: INSERT THÔNG BÁO THÀNH CÔNG
            // ============================================================
            var loaiText = gdk.LoaiGiaoDich == 1 ? "Thu" : "Chi";
            await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
            {
                NguoiDungId = gdk.NguoiDungId,
                TieuDe = "Giao dịch định kỳ đã thực hiện",
                NoiDung = $"Giao dịch \"{gdk.TenGiaoDich}\" đã được tự động {loaiText} {gdk.SoTien:N0} VND vào ngày {lanTiepTheo:dd/MM/yyyy}",
                LoaiThongBao = 3 // Nhắc nhở
            }, ct);

            // Kiểm tra nếu LanTiepTheoMoi cách Now <= 3 ngày thì thêm thông báo sắp tới
            var lanTiepTheoMoi = TinhLanTiepTheoMoi(lanTiepTheo, gdk.ChuKy);
            if (lanTiepTheoMoi.HasValue && (lanTiepTheoMoi.Value - TimeHelper.NowInVietnam()).TotalDays <= 3)
            {
                await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
                {
                    NguoiDungId = gdk.NguoiDungId,
                    TieuDe = "Nhắc nhở giao dịch định kỳ sắp tới",
                    NoiDung = $"Giao dịch \"{gdk.TenGiaoDich}\" sẽ tự động thực hiện vào ngày {lanTiepTheoMoi.Value:dd/MM/yyyy}",
                    LoaiThongBao = 3 // Nhắc nhở
                }, ct);
            }

            // ============================================================
            // BƯỚC 7: INSERT AUDIT LOG
            // ============================================================
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = gdk.NguoiDungId,
                TenBang = "tbl_giaodich",
                BanGhiId = newGiaoDichId,
                HanhDong = "INSERT",
                DuLieuCu = null,
                DuLieuMoi = JsonSerializer.Serialize(new
                {
                    GiaoDichId = newGiaoDichId,
                    SoTien = gdk.SoTien,
                    LoaiGiaoDich = gdk.LoaiGiaoDich,
                    DanhMucId = gdk.DanhMucId,
                    TaiKhoanId = gdk.TaiKhoanId,
                    NgayGiaoDich = lanTiepTheo,
                    MoTa = $"{gdk.TenGiaoDich} [DinhKy_Id_{gdk.Id}]",
                    NguonTao = "system"
                }),
                ThoiGian = TimeHelper.NowInVietnam(),
                IpAddress = "SYSTEM"
            });

            // ============================================================
            // BƯỚC 8: UPDATE LẦN TIẾP THEO + SỐ LẦN THỰC HIỆN
            // ============================================================
            // Lấy lại entity trong transaction context để cập nhật SoLanDaThucHien và LanThucHienCuoi   // ← THÊM MỚI
            var gdkEntity = await _context.TblGiaodichDinhkies
                .FirstAsync(x => x.Id == gdk.Id, ct);
            gdkEntity.SoLanDaThucHien += 1;
            gdkEntity.LanThucHienCuoi = TimeHelper.NowInVietnam();

            await Buoc8_CapNhatLanTiepTheoAsync(gdk, ct);

            await _context.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            _logger.LogInformation("✅ Xử lý xong định kỳ ID={Id}", gdk.Id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Lỗi khi xử lý giao dịch định kỳ ID={Id}", gdk.Id);
            await transaction.RollbackAsync(ct);
            return false;
        }
    }

    /// <summary>
    /// Tính lần chạy tiếp theo dựa trên chu kỳ
    /// </summary>
    private DateTime? TinhLanTiepTheoMoi(DateTime lanHienTai, string chuKy)
    {
        return chuKy?.Trim().ToUpperInvariant() switch
        {
            "HANG_NGAY" => lanHienTai.AddDays(1),
            "HANG_TUAN" => lanHienTai.AddDays(7),
            "HANG_THANG" => lanHienTai.AddMonths(1),
            "HANG_NAM" => lanHienTai.AddYears(1),
            _ => lanHienTai.AddMonths(1)
        };
    }

    private async Task Buoc8_CapNhatLanTiepTheoAsync(Models.TblGiaodichDinhky gdk, CancellationToken ct)
    {
        var lanTiepTheoHienTai = gdk.LanTiepTheo!.Value;
        var lanTiepTheoMoi = TinhLanTiepTheoMoi(lanTiepTheoHienTai, gdk.ChuKy);

        if (!lanTiepTheoMoi.HasValue)
        {
            gdk.TrangThai = 0; // Dừng
            return;
        }

        // Kiểm tra nếu đã hết hạn
        if (gdk.NgayKetThuc.HasValue && lanTiepTheoMoi > gdk.NgayKetThuc.Value)
        {
            gdk.TrangThai = 0; // Dừng

            // Thông báo kết thúc
            await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
            {
                NguoiDungId = gdk.NguoiDungId,
                TieuDe = "Giao dịch định kỳ đã kết thúc",
                NoiDung = $"Giao dịch định kỳ \"{gdk.TenGiaoDich}\" đã hoàn thành chu kỳ và tự động dừng lại",
                LoaiThongBao = 1 // Hệ thống
            }, ct);

            _logger.LogInformation("Giao dịch định kỳ ID={Id} đã kết thúc", gdk.Id);
        }
        else
        {
            gdk.LanTiepTheo = lanTiepTheoMoi;
        }
    }

    private async Task CapNhatNganSachAsync(Models.TblGiaodichDinhky gdk, CancellationToken ct)
    {
        var thang = gdk.LanTiepTheo!.Value.Month;
        var nam = gdk.LanTiepTheo!.Value.Year;

        var nganSach = await _context.TblNgansaches
            .FirstOrDefaultAsync(x =>
                x.NguoiDungId == gdk.NguoiDungId &&
                x.DanhMucId == gdk.DanhMucId &&
                x.Thang == thang &&
                x.Nam == nam &&
                x.TrangThai == 1,
                ct);

        if (nganSach == null) return;

        nganSach.SoTienDaChi += gdk.SoTien;
        nganSach.PhanTramDaDung = nganSach.SoTienToiDa > 0
            ? (float)(nganSach.SoTienDaChi / nganSach.SoTienToiDa * 100)
            : 0;

        // Cảnh báo ngưỡng - dùng CanhBaoPhanTram từ ngân sách, mặc định 80%   // ← THÊM MỚI
        var canhBaoPhanTram = nganSach.CanhBaoPhanTram > 0 ? nganSach.CanhBaoPhanTram : 80f;

        if (nganSach.PhanTramDaDung >= 100)
        {
            await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
            {
                NguoiDungId = gdk.NguoiDungId,
                TieuDe = "Vượt ngân sách",
                NoiDung = $"Danh mục đã sử dụng {nganSach.PhanTramDaDung:N0}% ngân sách tháng {thang}/{nam}",
                LoaiThongBao = 4 // Cảnh báo
            }, ct);
        }
        else if (nganSach.PhanTramDaDung >= canhBaoPhanTram)   // ← SỬA: dùng biến thay vì hardcode 80
        {
            await _thongBaoDal.TaoMoiAsync(new TaoThongBaoDto
            {
                NguoiDungId = gdk.NguoiDungId,
                TieuDe = "Sắp đạt giới hạn ngân sách",
                NoiDung = $"Danh mục đã dùng {nganSach.PhanTramDaDung:N0}% ngân sách tháng {thang}/{nam}",
                LoaiThongBao = 3 // Nhắc nhở
            }, ct);
        }
    }

    private async Task CapNhatTongHopThangAsync(Models.TblGiaodichDinhky gdk, CancellationToken ct)
    {
        var thang = gdk.LanTiepTheo!.Value.Month;
        var nam = gdk.LanTiepTheo!.Value.Year;

        var tongHop = await _context.TblTonghopThangs
            .FirstOrDefaultAsync(x =>
                x.NguoiDungId == gdk.NguoiDungId &&
                x.Thang == thang &&
                x.Nam == nam,
                ct);

        if (tongHop == null)
        {
            // Tạo mới
            tongHop = new Models.TblTonghopThang
            {
                NguoiDungId = gdk.NguoiDungId,
                Thang = thang,
                Nam = nam,
                TongThu = gdk.LoaiGiaoDich == 1 ? gdk.SoTien : 0,
                TongChi = gdk.LoaiGiaoDich == 2 ? gdk.SoTien : 0,
                NgayCapNhat = TimeHelper.NowInVietnam()
            };
            _context.TblTonghopThangs.Add(tongHop);
        }
        else
        {
            // Cập nhật
            if (gdk.LoaiGiaoDich == 1)
                tongHop.TongThu += gdk.SoTien;
            else
                tongHop.TongChi += gdk.SoTien;
        }

        // Tính tiết kiệm
        tongHop.TietKiem = tongHop.TongThu - tongHop.TongChi;
        tongHop.TyLeTietKiem = tongHop.TongThu > 0
            ? (float)(tongHop.TietKiem / tongHop.TongThu * 100)
            : 0;
        tongHop.NgayCapNhat = TimeHelper.NowInVietnam();
    }
}
