using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class GiaoDichDinhKyDal : IGiaoDichDinhKyDal
{
    private readonly AppDbContext _context;

    public GiaoDichDinhKyDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GiaoDichDinhKyDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var data = await _context.TblGiaodichDinhkies
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId && x.TrangThai == 1)
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

        return data.Select(Map).ToList();
    }

    public async Task<GiaoDichDinhKyDto?> LayTheoIdAsync(int id, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblGiaodichDinhkies
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.NguoiDungId == nguoiDungId, ct);
        return entity == null ? null : Map(entity);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        var entity = new TblGiaodichDinhky
        {
            NguoiDungId = nguoiDungId,
            TaiKhoanId = dto.TaiKhoanId,
            DanhMucId = dto.DanhMucId,
            TenGiaoDich = dto.TenKhoanDinhKy,
            LoaiGiaoDich = ChuyenLoai(dto.LoaiGiaoDich),
            SoTien = dto.SoTien,
            ChuKy = dto.TanSuat,
            NgayBatDau = dto.NgayBatDau,
            NgayKetThuc = dto.NgayKetThuc,
            LanTiepTheo = TinhLanTiepTheo(dto.NgayBatDau, dto.TanSuat),
            TrangThai = (sbyte)(dto.TrangThai ? 1 : 0),
            MoTa = dto.MoTa   // ← THÊM MỚI
        };

        _context.TblGiaodichDinhkies.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.Id;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int id, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblGiaodichDinhkies.FirstOrDefaultAsync(
            x => x.Id == id && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        entity.TaiKhoanId = dto.TaiKhoanId;
        entity.DanhMucId = dto.DanhMucId;
        entity.TenGiaoDich = dto.TenKhoanDinhKy;
        entity.LoaiGiaoDich = ChuyenLoai(dto.LoaiGiaoDich);
        entity.SoTien = dto.SoTien;
        entity.ChuKy = dto.TanSuat;
        entity.NgayBatDau = dto.NgayBatDau;
        entity.NgayKetThuc = dto.NgayKetThuc;
        entity.TrangThai = (sbyte)(dto.TrangThai ? 1 : 0);
        entity.LanTiepTheo = TinhLanTiepTheo(dto.NgayBatDau, dto.TanSuat);
        entity.MoTa = dto.MoTa;   // ← THÊM MỚI

        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        var entity = await _context.TblGiaodichDinhkies.FirstOrDefaultAsync(
            x => x.Id == id && x.NguoiDungId == nguoiDungId,
            ct);
        if (entity == null) return false;

        _context.TblGiaodichDinhkies.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static GiaoDichDinhKyDto Map(TblGiaodichDinhky x) => new()
    {
        DinhKyId = x.Id,
        TenKhoanDinhKy = x.TenGiaoDich,
        SoTien = x.SoTien,
        LoaiGiaoDich = x.LoaiGiaoDich == 1 ? "THU" : "CHI",
        TanSuat = x.ChuKy,
        NgayBatDau = x.NgayBatDau,
        NgayKetThuc = x.NgayKetThuc,
        TrangThai = (x.TrangThai ?? 1) == 1,
        TaiKhoanId = x.TaiKhoanId,
        DanhMucId = x.DanhMucId,
        // ← THÊM MỚI: 3 trường mới
        MoTa = x.MoTa,
        SoLanDaThucHien = x.SoLanDaThucHien,
        LanThucHienCuoi = x.LanThucHienCuoi
    };

    private static sbyte ChuyenLoai(string loai)
        => loai.Equals("THU", StringComparison.OrdinalIgnoreCase) ? (sbyte)1 : (sbyte)2;

    private static DateTime? TinhLanTiepTheo(DateTime ngayBatDau, string tanSuat)
    {
        var v = tanSuat?.Trim().ToUpperInvariant();
        return v switch
        {
            "HANG_NGAY" => ngayBatDau.AddDays(1),
            "HANG_TUAN" => ngayBatDau.AddDays(7),
            "HANG_THANG" => ngayBatDau.AddMonths(1),
            "HANG_NAM" => ngayBatDau.AddYears(1),
            _ => ngayBatDau.AddMonths(1)
        };
    }

    public async Task<int> DemDangHoatDongAsync(CancellationToken ct)
    {
        return await _context.TblGiaodichDinhkies
            .CountAsync(x => x.TrangThai == 1, ct);
    }

    public async Task<int> DemNgungHoatDongAsync(CancellationToken ct)
    {
        return await _context.TblGiaodichDinhkies
            .CountAsync(x => x.TrangThai == 1, ct);
    }

    public async Task<int> DemNguoiDungSuDungAsync(CancellationToken ct)
    {
        return await _context.TblGiaodichDinhkies
            .CountAsync(x => x.TrangThai == 1, ct);
    }
}

