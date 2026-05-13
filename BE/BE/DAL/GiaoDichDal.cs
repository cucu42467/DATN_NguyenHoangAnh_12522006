using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class GiaoDichDal : IGiaoDichDal
{
    private readonly AppDbContext _context;
    private readonly INganSachDal _nganSachDal;

    public GiaoDichDal(AppDbContext context, INganSachDal nganSachDal)
    {
        _context = context;
        _nganSachDal = nganSachDal;
    }

    public async Task<PagedResponse<GiaoDichDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, LocGiaoDichDto? filter = null, int page = 1, int pageSize = 20, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = _context.TblGiaodiches
            .AsNoTracking()
            .Include(g => g.DanhMuc)
                .ThenInclude(d => d!.LoaiDanhMuc)
            .Include(g => g.TaiKhoan)
            .Include(g => g.TaiKhoanDich)
            .Include(g => g.Import)
            .Include(g => g.TblGiaodichTeps)
                .ThenInclude(t => t.Tep)
            .Where(g => g.NguoiDungId == nguoiDungId)
            .Where(g => g.TrangThai == 1); // Chỉ lấy giao dịch hiển thị

        if (filter?.TuNgay.HasValue == true) query = query.Where(g => g.NgayGiaoDich >= filter.TuNgay.Value);
        if (filter?.DenNgay.HasValue == true) query = query.Where(g => g.NgayGiaoDich <= filter.DenNgay.Value);
        if (filter?.DanhMucId.HasValue == true) query = query.Where(g => g.DanhMucId == filter.DanhMucId.Value);
        if (filter?.TaiKhoanNguonId.HasValue == true) query = query.Where(g => g.TaiKhoanId == filter.TaiKhoanNguonId.Value);
        if (filter?.SoTienTu.HasValue == true) query = query.Where(g => g.SoTien >= filter.SoTienTu.Value);
        if (filter?.SoTienDen.HasValue == true) query = query.Where(g => g.SoTien <= filter.SoTienDen.Value);
        if (!string.IsNullOrWhiteSpace(filter?.GhiChu)) {
            var searchTerm = filter.GhiChu.ToLower().Trim();
            
            // Parse số tiền nếu người dùng nhập số
            decimal? searchAmount = null;
            if (decimal.TryParse(searchTerm.Replace(".", "").Replace(",", ""), out var parsedAmount)) {
                searchAmount = parsedAmount;
            }

            query = query.Where(g =>
                (g.MoTa != null && g.MoTa.ToLower().Contains(searchTerm)) ||
                (g.DanhMuc != null && g.DanhMuc.TenDanhMuc.ToLower().Contains(searchTerm)) ||
                (g.TaiKhoan != null && g.TaiKhoan.TenTaiKhoan.ToLower().Contains(searchTerm)) ||
                (searchAmount.HasValue && g.SoTien == searchAmount.Value)
            );
        }
        
        if (!string.IsNullOrWhiteSpace(filter?.TenLoaiDanhMuc)) query = query.Where(g => g.DanhMuc != null && g.DanhMuc.LoaiDanhMuc.TenLoai == filter.TenLoaiDanhMuc);

        var totalCount = await query.CountAsync(ct);

        // Sorting
        IOrderedQueryable<Models.TblGiaodich> orderedQuery;

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            switch (filter.SortBy.ToLower())
            {
                case "sotien":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.SoTien)
                        : query.OrderByDescending(g => g.SoTien);
                    break;

                case "giaodichid":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.GiaoDichId)
                        : query.OrderByDescending(g => g.GiaoDichId);
                    break;

                case "ghichu":
                case "mota":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.MoTa == null ? 1 : 0).ThenBy(g => g.MoTa ?? "")
                        : query.OrderByDescending(g => g.MoTa == null ? 1 : 0).ThenByDescending(g => g.MoTa ?? "");
                    break;

                case "loai":
                case "loaigiaodich":
                case "loaidanhmuc":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.DanhMuc != null ? g.DanhMuc.LoaiDanhMuc.TenLoai : "")
                        : query.OrderByDescending(g => g.DanhMuc != null ? g.DanhMuc.LoaiDanhMuc.TenLoai : "");
                    break;

                case "danhmuc":
                case "tendanhmuc":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.DanhMuc != null ? g.DanhMuc.TenDanhMuc : "")
                        : query.OrderByDescending(g => g.DanhMuc != null ? g.DanhMuc.TenDanhMuc : "");
                    break;

                case "taikhoan":
                case "tentaikhoan":
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.TaiKhoan != null ? g.TaiKhoan.TenTaiKhoan : "")
                        : query.OrderByDescending(g => g.TaiKhoan != null ? g.TaiKhoan.TenTaiKhoan : "");
                    break;

                case "ngay":
                case "ngaygiaodich":
                default:
                    orderedQuery = filter.SortDir?.ToLower() == "asc"
                        ? query.OrderBy(g => g.NgayGiaoDich)
                        : query.OrderByDescending(g => g.NgayGiaoDich);
                    break;
            }
        }
        else
        {
            orderedQuery = query.OrderByDescending(g => g.NgayGiaoDich);
        }

        var data = await orderedQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResponse<GiaoDichDto>
        {
            Items = MapToDto(data),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<GiaoDichDto?> LayTheoIdAsync(int giaoDichId, CancellationToken ct = default)
    {
        var giaoDich = await _context.TblGiaodiches
            .Include(g => g.DanhMuc)
                .ThenInclude(d => d!.LoaiDanhMuc)
            .Include(g => g.TaiKhoan)
            .Include(g => g.TaiKhoanDich)
            .Include(g => g.Import)
            .Include(g => g.TblGiaodichTeps)
                .ThenInclude(t => t.Tep)
            .FirstOrDefaultAsync(g => g.GiaoDichId == giaoDichId, ct);

        return giaoDich == null ? null : MapToDto(giaoDich);
    }

    public async Task<int> TaoMoiAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
    {
        var giaoDich = new TblGiaodich
        {
            SoTien = dto.SoTien,
            LoaiGiaoDich = (sbyte)byte.Parse(dto.LoaiGiaoDich),
            DanhMucId = dto.DanhMucId,
            TaiKhoanId = dto.TaiKhoanNguonId,
            TaiKhoanDichId = dto.TaiKhoanDichId,
            NgayGiaoDich = dto.NgayGiaoDich.HasValue 
                ? TimeHelper.SetTimeToNowInVietnam(dto.NgayGiaoDich.Value)  // Giữ nguyên ngày, set giờ:phút hiện tại
                : TimeHelper.NowInVietnam(),  // Không có ngày thì dùng thời điểm hiện tại
            MoTa = dto.GhiChu,
            NguoiDungId = nguoiDungId,
            NgayTao = TimeHelper.NowInVietnam(),
            NguonDuLieu = 0, // Thủ công
            TrangThai = dto.TrangThai ?? 1, // Mặc định hiển thị
            NguonTao = dto.NguonTao ?? "web",
            ViTri = dto.ViTri,
            // Các trường bổ sung
            TienTe = dto.TienTe ?? "VND",
            TyGiaQuyDoi = dto.TyGiaQuyDoi ?? 1m,
            LaTuDong = (dto.LaTuDong ?? false) ? (ulong)1 : (ulong)0,
            DoTinCay = dto.DoTinCay ?? 1f,
            MaGiaoDichNgoai = dto.MaGiaoDichNgoai,
            TenGiaoDich = dto.GhiChu   // ← THÊM MỚI
        };

        _context.TblGiaodiches.Add(giaoDich);
        await _context.SaveChangesAsync(ct);

        // === Cập nhật ngân sách nếu là giao dịch CHI ===
        if (giaoDich.LoaiGiaoDich == 2 && dto.DanhMucId.HasValue)
        {
            var thang = giaoDich.NgayGiaoDich.Month;
            var nam = giaoDich.NgayGiaoDich.Year;
            await _nganSachDal.TinhLaiSoTienDaChiAsync(nguoiDungId, dto.DanhMucId.Value, thang, nam, ct);
        }

        if (!string.IsNullOrEmpty(dto.TepDinhKem))
        {
            // Cách 1: Lưu qua TblImportFile (theo yêu cầu mới)
            var importFile = new TblImportFile
            {
                NguoiDungId = nguoiDungId,
                TaiKhoanId = dto.TaiKhoanNguonId,
                TenFile = dto.TepDinhKem,
                NgayImport = TimeHelper.NowInVietnam(),
                TrangThai = 1,
                TongDong = 1,
                SoDongThanhCong = 1
            };
            _context.TblImportFiles.Add(importFile);
            await _context.SaveChangesAsync(ct);

            // Gán ImportId cho giao dịch
            giaoDich.ImportId = importFile.ImportId;
            await _context.SaveChangesAsync(ct);

            // Cách 2: Lưu qua TblGiaodichTep (giữ song song để đảm bảo tính tương thích)
            var tep = new TblTepDinhkem
            {
                TenFile = dto.TepDinhKem,
                DuongDan = dto.TepDinhKem,
                NgayTao = DateTime.Now
            };
            _context.TblTepDinhkems.Add(tep);
            await _context.SaveChangesAsync(ct);

            var giaoDichTep = new TblGiaodichTep
            {
                GiaoDichId = giaoDich.GiaoDichId,
                TepId = tep.TepId
            };
            _context.TblGiaodichTeps.Add(giaoDichTep);
            await _context.SaveChangesAsync(ct);
        }

        return giaoDich.GiaoDichId;
    }

    public async Task<bool> CapNhatAsync(int giaoDichId, TaoGiaoDichDto dto, CancellationToken ct = default)
    {
        // Lưu lại giá trị cũ trước khi cập nhật
        var giaoDichCu = await _context.TblGiaodiches
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.GiaoDichId == giaoDichId, ct);

        if (giaoDichCu == null) return false;

        var nguoiDungId = giaoDichCu.NguoiDungId;
        var danhMucCu = giaoDichCu.DanhMucId;
        var loaiCu = giaoDichCu.LoaiGiaoDich;
        var thangCu = giaoDichCu.NgayGiaoDich.Month;
        var namCu = giaoDichCu.NgayGiaoDich.Year;

        // Cập nhật các trường
        var giaoDich = await _context.TblGiaodiches
            .FirstOrDefaultAsync(x => x.GiaoDichId == giaoDichId, ct);

        if (giaoDich == null) return false;

        giaoDich.SoTien = dto.SoTien;
        giaoDich.LoaiGiaoDich = (sbyte)byte.Parse(dto.LoaiGiaoDich);
        giaoDich.DanhMucId = dto.DanhMucId;
        giaoDich.TaiKhoanId = dto.TaiKhoanNguonId;
        giaoDich.TaiKhoanDichId = dto.TaiKhoanDichId;
        giaoDich.MoTa = dto.GhiChu;
        giaoDich.NgayGiaoDich = dto.NgayGiaoDich.HasValue
            ? TimeHelper.SetTimeToNowInVietnam(dto.NgayGiaoDich.Value)
            : TimeHelper.NowInVietnam();
        if (dto.TrangThai.HasValue)
            giaoDich.TrangThai = dto.TrangThai;
        if (dto.NguonTao != null)
            giaoDich.NguonTao = dto.NguonTao;
        if (dto.ViTri != null)
            giaoDich.ViTri = dto.ViTri;
        if (dto.TienTe != null)
            giaoDich.TienTe = dto.TienTe;
        if (dto.TyGiaQuyDoi.HasValue)
            giaoDich.TyGiaQuyDoi = dto.TyGiaQuyDoi.Value;
        if (dto.LaTuDong.HasValue)
            giaoDich.LaTuDong = dto.LaTuDong.Value ? (ulong)1 : (ulong)0;
        if (dto.DoTinCay.HasValue)
            giaoDich.DoTinCay = dto.DoTinCay.Value;
        if (dto.MaGiaoDichNgoai != null)
            giaoDich.MaGiaoDichNgoai = dto.MaGiaoDichNgoai;
        giaoDich.TenGiaoDich = dto.GhiChu;   // ← THÊM MỚI

        if (!string.IsNullOrEmpty(dto.TepDinhKem))
        {
            var importFile = new TblImportFile
            {
                NguoiDungId = giaoDich.NguoiDungId,
                TaiKhoanId = dto.TaiKhoanNguonId,
                TenFile = dto.TepDinhKem,
                NgayImport = TimeHelper.NowInVietnam(),
                TrangThai = 1,
                TongDong = 1,
                SoDongThanhCong = 1
            };
            _context.TblImportFiles.Add(importFile);
            await _context.SaveChangesAsync(ct);
            giaoDich.ImportId = importFile.ImportId;
        }

        _context.TblGiaodiches.Update(giaoDich);
        await _context.SaveChangesAsync(ct);

        // === Xử lý ngân sách ===
        var loaiMoi = giaoDich.LoaiGiaoDich;
        var danhMucMoi = dto.DanhMucId;
        var thangMoi = giaoDich.NgayGiaoDich.Month;
        var namMoi = giaoDich.NgayGiaoDich.Year;

        // 1. Nếu giao dịch cũ là CHI: hoàn tác lại ngân sách cũ
        if (loaiCu == 2 && danhMucCu.HasValue)
        {
            await _nganSachDal.TinhLaiSoTienDaChiAsync(nguoiDungId, danhMucCu.Value, thangCu, namCu, ct);
        }

        // 2. Nếu giao dịch mới là CHI: cập nhật ngân sách mới
        if (loaiMoi == 2 && danhMucMoi.HasValue)
        {
            await _nganSachDal.TinhLaiSoTienDaChiAsync(nguoiDungId, danhMucMoi.Value, thangMoi, namMoi, ct);
        }

        return true;
    }

    public async Task<bool> XoaAsync(int giaoDichId, CancellationToken ct = default)
    {
        var giaoDich = await _context.TblGiaodiches.FindAsync(giaoDichId);
        if (giaoDich == null) return false;

        // Xóa mềm: cập nhật TrangThai = 0
        giaoDich.TrangThai = 0;
        _context.TblGiaodiches.Update(giaoDich);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private List<GiaoDichDto> MapToDto(List<TblGiaodich> entities)
    {
        return entities.Select(e => new GiaoDichDto
        {
            GiaoDichId = e.GiaoDichId,
            SoTien = e.SoTien,
            LoaiGiaoDich = e.LoaiGiaoDich.ToString(),
            DanhMucId = e.DanhMucId,
            TenDanhMuc = e.DanhMuc?.TenDanhMuc,
            LoaiDanhMucId = e.DanhMuc?.LoaiDanhMucId,
            TenLoaiDanhMuc = e.DanhMuc?.LoaiDanhMuc?.TenLoai,
            TaiKhoanNguonId = e.TaiKhoanId,
            TenTaiKhoanNguon = e.TaiKhoan?.TenTaiKhoan,
            TaiKhoanDichId = e.TaiKhoanDichId,
            TenTaiKhoanDich = e.TaiKhoanDich?.TenTaiKhoan,
            NgayGiaoDich = e.NgayGiaoDich,
            GhiChu = e.MoTa,
            NguoiDungId = e.NguoiDungId,
            DoTinCayAI = (int?)(e.DoTinCay * 100),
            TepDinhKem = e.Import?.TenFile ?? e.TblGiaodichTeps.FirstOrDefault()?.Tep?.DuongDan,
            TrangThai = e.TrangThai,
            NguonTao = e.NguonTao,
            ViTri = e.ViTri,
            // Các trường bổ sung
            TienTe = e.TienTe,
            TyGiaQuyDoi = e.TyGiaQuyDoi,
            LaTuDong = e.LaTuDong.HasValue && e.LaTuDong.Value == 1,
            MaGiaoDichNgoai = e.MaGiaoDichNgoai,
            TenGiaoDich = e.TenGiaoDich   // ← THÊM MỚI
        }).ToList();
    }

    private GiaoDichDto MapToDto(TblGiaodich entity)
    {
        return new GiaoDichDto
        {
            GiaoDichId = entity.GiaoDichId,
            SoTien = entity.SoTien,
            LoaiGiaoDich = entity.LoaiGiaoDich.ToString(),
            DanhMucId = entity.DanhMucId,
            TenDanhMuc = entity.DanhMuc?.TenDanhMuc,
            LoaiDanhMucId = entity.DanhMuc?.LoaiDanhMucId,
            TenLoaiDanhMuc = entity.DanhMuc?.LoaiDanhMuc?.TenLoai,
            TaiKhoanNguonId = entity.TaiKhoanId,
            TenTaiKhoanNguon = entity.TaiKhoan?.TenTaiKhoan,
            TaiKhoanDichId = entity.TaiKhoanDichId,
            TenTaiKhoanDich = entity.TaiKhoanDich?.TenTaiKhoan,
            NgayGiaoDich = entity.NgayGiaoDich,
            GhiChu = entity.MoTa,
            NguoiDungId = entity.NguoiDungId,
            DoTinCayAI = (int?)(entity.DoTinCay * 100),
            TepDinhKem = entity.Import?.TenFile ?? entity.TblGiaodichTeps.FirstOrDefault()?.Tep?.DuongDan,
            TrangThai = entity.TrangThai,
            NguonTao = entity.NguonTao,
            ViTri = entity.ViTri,
            // Các trường bổ sung
            TienTe = entity.TienTe,
            TyGiaQuyDoi = entity.TyGiaQuyDoi,
            LaTuDong = entity.LaTuDong.HasValue && entity.LaTuDong.Value == 1,
            MaGiaoDichNgoai = entity.MaGiaoDichNgoai,
            TenGiaoDich = entity.TenGiaoDich   // ← THÊM MỚI
        };
    }

    public async Task<PagedResponse<AdminGiaoDichDto>> LayDanhSachAdminAsync(
        int page, int pageSize, int? userId, sbyte? loai,
        DateTime? tuNgay, DateTime? denNgay, string? q,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 200) pageSize = 200;

        var query = _context.TblGiaodiches.AsNoTracking()
            .Include(x => x.NguoiDung)
            .Include(x => x.DanhMuc)
            .Include(x => x.TaiKhoan)
            .AsQueryable();

        if (userId.HasValue) query = query.Where(x => x.NguoiDungId == userId.Value);
        if (loai.HasValue) query = query.Where(x => x.LoaiGiaoDich == loai.Value);
        if (tuNgay.HasValue) query = query.Where(x => x.NgayGiaoDich >= tuNgay.Value);
        if (denNgay.HasValue) query = query.Where(x => x.NgayGiaoDich <= denNgay.Value);
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(x => (x.MoTa ?? "").Contains(q));

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(x => x.NgayGiaoDich)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminGiaoDichDto
            {
                GiaoDichId = x.GiaoDichId,
                NguoiDungId = x.NguoiDungId,
                HoTen = x.NguoiDung.HoTen,
                SoTien = x.SoTien,
                LoaiGiaoDich = x.LoaiGiaoDich,
                NgayGiaoDich = x.NgayGiaoDich,
                MoTa = x.MoTa,
                TenDanhMuc = x.DanhMuc != null ? x.DanhMuc.TenDanhMuc : null,
                TenTaiKhoan = x.TaiKhoan.TenTaiKhoan
            })
            .ToListAsync(ct);

        return new PagedResponse<AdminGiaoDichDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    // ============ Dashboard Stats ============

    public async Task<int> DemTongGiaoDichHeThongAsync(CancellationToken ct = default)
    {
        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.TrangThai == 1)
            .CountAsync(ct);
    }

    public async Task<decimal> DemTongThuThangHienTaiAsync(CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var dauThang = new DateTime(now.Year, now.Month, 1);
        var cuoiThang = dauThang.AddMonths(1).AddDays(-1);

        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NgayGiaoDich >= dauThang && x.NgayGiaoDich <= cuoiThang && x.TrangThai == 1)
            .Where(x => x.LoaiGiaoDich == 1) // THU
            .SumAsync(x => x.SoTien, ct);
    }

    public async Task<decimal> DemTongChiThangHienTaiAsync(CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var dauThang = new DateTime(now.Year, now.Month, 1);
        var cuoiThang = dauThang.AddMonths(1).AddDays(-1);

        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NgayGiaoDich >= dauThang && x.NgayGiaoDich <= cuoiThang && x.TrangThai == 1)
            .Where(x => x.LoaiGiaoDich == 2) // CHI
            .SumAsync(x => x.SoTien, ct);
    }

    public async Task<List<ThongKeGiaoDichThangDto>> LayThongKe6ThangGanNhatAsync(CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var result = new List<ThongKeGiaoDichThangDto>();

        for (int i = 5; i >= 0; i--)
        {
            var targetDate = now.AddMonths(-i);
            var dauThang = new DateTime(targetDate.Year, targetDate.Month, 1);
            var cuoiThang = dauThang.AddMonths(1).AddDays(-1);

            var tongThu = await _context.TblGiaodiches
                .AsNoTracking()
                .Where(x => x.NgayGiaoDich >= dauThang && x.NgayGiaoDich <= cuoiThang && x.TrangThai == 1)
                .Where(x => x.LoaiGiaoDich == 1)
                .SumAsync(x => x.SoTien, ct);

            var tongChi = await _context.TblGiaodiches
                .AsNoTracking()
                .Where(x => x.NgayGiaoDich >= dauThang && x.NgayGiaoDich <= cuoiThang && x.TrangThai == 1)
                .Where(x => x.LoaiGiaoDich == 2)
                .SumAsync(x => x.SoTien, ct);

            result.Add(new ThongKeGiaoDichThangDto
            {
                Thang = $"T{targetDate.Month}",
                TongThu = tongThu,
                TongChi = tongChi
            });
        }

        return result;
    }

    public async Task<List<ChiTieuTheoDanhMucDto>> LayChiTieuTheoDanhMucAsync(int top = 6, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var dauThang = new DateTime(now.Year, now.Month, 1);
        var cuoiThang = dauThang.AddMonths(1).AddDays(-1);

        var data = await _context.TblGiaodiches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NgayGiaoDich >= dauThang && x.NgayGiaoDich <= cuoiThang && x.TrangThai == 1)
            .Where(x => x.LoaiGiaoDich == 2) // CHI
            .GroupBy(x => x.DanhMuc != null ? x.DanhMuc.TenDanhMuc : "Khác")
            .Select(g => new { TenDanhMuc = g.Key, TongTien = g.Sum(x => x.SoTien) })
            .OrderByDescending(x => x.TongTien)
            .Take(top)
            .ToListAsync(ct);

        var tongTien = data.Sum(x => x.TongTien);

        return data.Select(x => new ChiTieuTheoDanhMucDto
        {
            TenDanhMuc = x.TenDanhMuc ?? "Khác",
            TongTien = x.TongTien,
            PhanTram = tongTien > 0 ? (double)x.TongTien / (double)tongTien * 100 : 0
        }).ToList();
    }

    // ============ Báo cáo thống kê mở rộng ============

    public async Task<int> DemGiaoDichThanhCongAsync(CancellationToken ct = default)
    {
        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.TrangThai == 1)
            .CountAsync(ct);
    }

    public async Task<int> DemGiaoDichLoiAsync(CancellationToken ct = default)
    {
        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.TrangThai != 1)
            .CountAsync(ct);
    }

    public async Task<int> DemGiaoDichTheoNguonAsync(string nguon, CancellationToken ct = default)
    {
        var nguonLower = nguon.ToLower();
        return await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguonTao != null && x.NguonTao.ToLower() == nguonLower)
            .CountAsync(ct);
    }

    public async Task<List<GiaoDichTheoDanhMucDto>> LayGiaoDichTheoDanhMucFullAsync(CancellationToken ct = default)
    {
        var data = await _context.TblGiaodiches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.TrangThai == 1)
            .GroupBy(x => new { x.DanhMucId, TenDanhMuc = x.DanhMuc != null ? x.DanhMuc.TenDanhMuc : "Khác" })
            .Select(g => new { g.Key.DanhMucId, g.Key.TenDanhMuc, SoLuong = g.Count(), TongTien = g.Sum(x => x.SoTien) })
            .OrderByDescending(x => x.SoLuong)
            .Take(10)
            .ToListAsync(ct);

        var total = data.Sum(x => x.SoLuong);

        return data.Select(x => new GiaoDichTheoDanhMucDto
        {
            DanhMucId = x.DanhMucId ?? 0,
            TenDanhMuc = x.TenDanhMuc ?? "Khác",
            SoLuong = x.SoLuong,
            TongTien = x.TongTien,
            PhanTram = total > 0 ? (double)x.SoLuong / total * 100 : 0
        }).ToList();
    }
}
