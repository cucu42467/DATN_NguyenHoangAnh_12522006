using Common;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using DAL.Interfaces;

namespace DAL;

public class LichsuDangnhapDal : ILichsuDangnhapDal
{
    private readonly AppDbContext _db;

    public LichsuDangnhapDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task GhiLaiAsync(
        TblLichsuDangnhap dong,
        CancellationToken huyBo = default)
    {
        dong.ThoiGian = TimeHelper.NowInVietnam();

        if (dong.Id == 0)
        {
            var max = await _db.TblLichsuDangnhaps
                .MaxAsync(x => (int?)x.Id, huyBo) ?? 0;

            dong.Id = max + 1;
        }

        _db.TblLichsuDangnhaps.Add(dong);

        await _db.SaveChangesAsync(huyBo);
    }

    public async Task<List<TblLichsuDangnhap>> LayTatCaAsync(
        CancellationToken huyBo = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .OrderByDescending(x => x.ThoiGian)
            .ToListAsync(huyBo);
    }

    public async Task<List<TblLichsuDangnhap>> LayTheoNguoiDungAsync(
        int nguoiDungId,
        CancellationToken huyBo = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.ThoiGian)
            .ToListAsync(huyBo);
    }

    public async Task<TblLichsuDangnhap?> LayTheoIdAsync(
        int id,
        CancellationToken huyBo = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .FirstOrDefaultAsync(x => x.Id == id, huyBo);
    }

    public async Task<List<TblLichsuDangnhap>> LayPhanTrangAsync(
        int page,
        int pageSize,
        CancellationToken huyBo = default)
    {
        if (page <= 0)
            page = 1;

        if (pageSize <= 0)
            pageSize = 10;

        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .OrderByDescending(x => x.ThoiGian)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(huyBo);
    }

    public async Task<List<TblLichsuDangnhap>> LayTheoNguoiDungPhanTrangAsync(
        int nguoiDungId,
        int page,
        int pageSize,
        CancellationToken huyBo = default)
    {
        if (page <= 0)
            page = 1;

        if (pageSize <= 0)
            pageSize = 10;

        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .OrderByDescending(x => x.ThoiGian)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(huyBo);
    }

    public async Task<int> DemDangNhapHomNayAsync(CancellationToken ct = default)
    {
        var today = TimeHelper.NowInVietnam().Date;
        var tomorrow = today.AddDays(1);

        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.ThoiGian >= today && x.ThoiGian < tomorrow)
            .CountAsync(ct);
    }

    // ============ Báo cáo bảo mật ============

    public async Task<int> DemTongDangNhapAsync(CancellationToken ct = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .CountAsync(ct);
    }

    public async Task<int> DemDangNhapThanhCongAsync(CancellationToken ct = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.KetQua == 1)
            .CountAsync(ct);
    }

    public async Task<int> DemDangNhapThatBaiAsync(CancellationToken ct = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.KetQua != 1)
            .CountAsync(ct);
    }

    public async Task<int> DemDangNhapThangAsync(DateTime startOfMonth, CancellationToken ct = default)
    {
        return await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.ThoiGian >= startOfMonth)
            .Select(x => x.NguoiDungId)
            .Distinct()
            .CountAsync(ct);
    }

    public async Task<List<DTO.DangNhapThatBaiDto>> LayDangNhapThatBaiAsync(int gioiHan, CancellationToken ct = default)
    {
        var result = await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Include(x => x.NguoiDung)
            .Where(x => x.KetQua != 1)
            .OrderByDescending(x => x.ThoiGian)
            .Take(gioiHan)
            .Select(x => new DTO.DangNhapThatBaiDto
            {
                Id = x.Id,
                NguoiDungId = x.NguoiDungId,
                HoTen = x.NguoiDung != null ? x.NguoiDung.HoTen : null,
                Email = x.NguoiDung != null ? x.NguoiDung.Email : null,
                ThoiGian = x.ThoiGian.HasValue ? x.ThoiGian.Value.ToString("dd/MM/yyyy HH:mm") : "",
                IpAddress = x.IpAddress,
                ThietBi = x.ThietBi
            })
            .ToListAsync(ct);

        return result;
    }

    public async Task<List<DTO.HoatDongBatThuongDto>> LayHoatDongBatThuongAsync(CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var startOfDay = now.Date;

        // Lấy user có nhiều IP khác nhau trong ngày
        var batThuong = await _db.TblLichsuDangnhaps
            .AsNoTracking()
            .Where(x => x.ThoiGian >= startOfDay)
            .GroupBy(x => x.NguoiDungId)
            .Where(g => g.Select(x => x.IpAddress).Distinct().Count() > 1 || g.Count() > 3)
            .Select(g => new
            {
                NguoiDungId = g.Key,
                SoIPKhacNhau = g.Select(x => x.IpAddress).Distinct().Count(),
                DanhSachIP = g.Select(x => x.IpAddress ?? "").Distinct().ToList(),
                SoDangNhapTrongNgay = g.Count()
            })
            .OrderByDescending(x => x.SoIPKhacNhau)
            .Take(20)
            .ToListAsync(ct);

        return batThuong.Select(x => new DTO.HoatDongBatThuongDto
        {
            NguoiDungId = x.NguoiDungId,
            HoTen = "User " + x.NguoiDungId,
            Email = "",
            SoIPKhacNhau = x.SoIPKhacNhau,
            DanhSachIP = x.DanhSachIP.Where(ip => !string.IsNullOrEmpty(ip)).ToList(),
            SoDangNhapTrongNgay = x.SoDangNhapTrongNgay
        }).ToList();
    }
}