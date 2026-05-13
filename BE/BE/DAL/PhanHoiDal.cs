using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class PhanHoiDal : IPhanHoiDal
{
    private readonly AppDbContext _context;

    public PhanHoiDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> TaoPhanHoiAsync(int nguoiDungId, string tieuDe, string noiDung, CancellationToken ct = default)
    {
        var phanHoi = new TblPhanhoi
        {
            NguoiDungId = nguoiDungId,
            TieuDe = tieuDe.Trim(),
            NoiDung = noiDung.Trim(),
            TrangThai = 0, // Chờ xử lý
            NgayTao = TimeHelper.NowInVietnam()
        };

        _context.TblPhanhois.Add(phanHoi);
        await _context.SaveChangesAsync(ct);
        return phanHoi.PhanHoiId;
    }

    public async Task<List<PhanHoiDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var list = await _context.TblPhanhois
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.NgayTao)
            .ToListAsync(ct);

        return list.Select(MapToDto).ToList();
    }

    public async Task<PhanHoiDto?> LayTheoIdAsync(int phanHoiId, CancellationToken ct = default)
    {
        var entity = await _context.TblPhanhois
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .FirstOrDefaultAsync(x => x.PhanHoiId == phanHoiId, ct);

        return entity == null ? null : MapToDto(entity);
    }

    public async Task<bool> CapNhatTrangThaiAsync(int phanHoiId, sbyte trangThaiMoi, CancellationToken ct = default)
    {
        var affected = await _context.TblPhanhois
            .Where(x => x.PhanHoiId == phanHoiId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.TrangThai, trangThaiMoi),
                ct);
        return affected > 0;
    }

    private static PhanHoiDto MapToDto(TblPhanhoi entity)
    {
        return new PhanHoiDto
        {
            PhanHoiId = entity.PhanHoiId,
            NguoiDungId = entity.NguoiDungId,
            TenNguoiDung = entity.NguoiDung?.HoTen,
            TieuDe = entity.TieuDe,
            NoiDung = entity.NoiDung,
            TrangThai = entity.TrangThai,
            TrangThaiText = entity.TrangThai switch
            {
                0 => "Chờ xử lý",
                1 => "Đang xử lý",
                2 => "Đã giải quyết",
                3 => "Từ chối",
                _ => "Không xác định"
            },
            NgayTao = entity.NgayTao
        };
    }

    // ============ Dashboard Stats ============

    public async Task<int> DemPhanHoiChoXuLyAsync(CancellationToken ct = default)
    {
        return await _context.TblPhanhois
            .AsNoTracking()
            .Where(x => x.TrangThai == 0) // Chờ xử lý
            .CountAsync(ct);
    }

    // ============ Báo cáo thống kê ============

    public async Task<ThongKePhanHoiDto?> LayThongKePhanHoiAsync(CancellationToken ct = default)
    {
        var all = await _context.TblPhanhois.AsNoTracking().ToListAsync(ct);

        var tongSo = all.Count;
        var choXuLy = all.Count(x => x.TrangThai == 0);
        var dangXuLy = all.Count(x => x.TrangThai == 1);
        var daGiaiQuyet = all.Count(x => x.TrangThai == 2);
        var tuChoi = all.Count(x => x.TrangThai == 3);

        // Tính thời gian xử lý trung bình (từ tạo đến giải quyết)
        var daGiaiQuyetList = all.Where(x => x.TrangThai == 2 && x.NgayTao != DateTime.MinValue).ToList();
        double thoiGianTrungBinh = 0;
        if (daGiaiQuyetList.Any())
        {
            var tongThoiGian = daGiaiQuyetList.Sum(x => (DateTime.Now - x.NgayTao).TotalHours);
            thoiGianTrungBinh = Math.Round(tongThoiGian / daGiaiQuyetList.Count, 1);
        }

        return new ThongKePhanHoiDto
        {
            TongSo = tongSo,
            ChoXuLy = choXuLy,
            DangXuLy = dangXuLy,
            DaGiaiQuyet = daGiaiQuyet,
            TuChoi = tuChoi,
            ThoiGianXuLyTrungBinh = thoiGianTrungBinh
        };
    }
}
