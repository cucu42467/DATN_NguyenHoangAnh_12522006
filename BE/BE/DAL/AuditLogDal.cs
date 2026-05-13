using Microsoft.EntityFrameworkCore;
using DAL.Interfaces;
using Common;
using DTO;
using Models.Data;
using Models;

namespace DAL;

public class AuditLogDal : IAuditLogDal
{
    private readonly AppDbContext _context;

    public AuditLogDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GhiLogAsync(TaoAuditLogDto dto, CancellationToken ct = default)
    {
        var log = new TblAuditLog
        {
            NguoiDungId = dto.NguoiDungId,
            TenBang = dto.TenBang,
            BanGhiId = dto.BanGhiId,
            HanhDong = dto.HanhDong,
            DuLieuCu = dto.DuLieuCu,
            DuLieuMoi = dto.DuLieuMoi,
            ThoiGian = TimeHelper.NowInVietnam(),
            IpAddress = dto.IpAddress
        };

        _context.TblAuditLogs.Add(log);
        await _context.SaveChangesAsync(ct);
        return log.Id;
    }

    public async Task<List<AuditLogDto>> LayLichSuAsync(string tenBang, int banGhiId, CancellationToken ct = default)
    {
        var logs = await _context.TblAuditLogs
            .AsNoTracking()
            .Where(x => x.TenBang == tenBang && x.BanGhiId == banGhiId)
            .OrderByDescending(x => x.ThoiGian)
            .ToListAsync(ct);

        return logs.Select(MapToDto).ToList();
    }

    public async Task<List<AuditLogDto>> LayLichSuTheoNguoiDungAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _context.TblAuditLogs
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId);

        var total = await query.CountAsync(ct);

        var logs = await query
            .OrderByDescending(x => x.ThoiGian)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return logs.Select(MapToDto).ToList();
    }

    public async Task<List<AdminAuditLogDto>> LayDanhSachAsync(int page, int pageSize, string? table = null, string? action = null, DateTime? from = null, DateTime? to = null, CancellationToken ct = default)
    {
        var query = _context.TblAuditLogs.AsNoTracking();

        if (!string.IsNullOrEmpty(table))
            query = query.Where(x => x.TenBang == table);
        if (!string.IsNullOrEmpty(action))
            query = query.Where(x => x.HanhDong == action);
        if (from.HasValue)
            query = query.Where(x => x.ThoiGian >= from.Value);
        if (to.HasValue)
            query = query.Where(x => x.ThoiGian <= to.Value);

        return await query
            .OrderByDescending(x => x.ThoiGian)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new AdminAuditLogDto
            {
                Id = x.Id,
                NguoiDungId = x.NguoiDungId,
                TenBang = x.TenBang,
                BanGhiId = x.BanGhiId,
                HanhDong = x.HanhDong,
                DuLieuCu = x.DuLieuCu,
                DuLieuMoi = x.DuLieuMoi,
                ThoiGian = x.ThoiGian ?? DateTime.Now,
                IpAddress = x.IpAddress
            })
            .ToListAsync(ct);
    }

    public async Task<List<AdminAuditLogDto>> LayGanNhatAsync(int count = 10, CancellationToken ct = default)
    {
        return await _context.TblAuditLogs
            .AsNoTracking()
            .OrderByDescending(x => x.ThoiGian)
            .Take(count)
            .Select(x => new AdminAuditLogDto
            {
                Id = x.Id,
                NguoiDungId = x.NguoiDungId,
                TenBang = x.TenBang,
                BanGhiId = x.BanGhiId,
                HanhDong = x.HanhDong,
                DuLieuCu = x.DuLieuCu,
                DuLieuMoi = x.DuLieuMoi,
                ThoiGian = x.ThoiGian ?? DateTime.Now,
                IpAddress = x.IpAddress
            })
            .ToListAsync(ct);
    }

    private AuditLogDto MapToDto(TblAuditLog x) => new()
    {
        Id = x.Id,
        NguoiDungId = x.NguoiDungId,
        TenBang = x.TenBang,
        BanGhiId = x.BanGhiId,
        HanhDong = x.HanhDong,
        DuLieuCu = x.DuLieuCu,
        DuLieuMoi = x.DuLieuMoi,
        ThoiGian = x.ThoiGian ?? DateTime.Now,
        IpAddress = x.IpAddress
    };

    // ============ Báo cáo audit ============

    public async Task<List<AuditLogTheoUserDto>> LayAuditLogTheoUserAsync(CancellationToken ct = default)
    {
        var result = await _context.TblAuditLogs
            .AsNoTracking()
            .GroupBy(x => x.NguoiDungId)
            .Select(g => new
            {
                NguoiDungId = g.Key,
                TongThaoTac = g.Count(),
                Insert = g.Count(x => x.HanhDong == "INSERT"),
                Update = g.Count(x => x.HanhDong == "UPDATE"),
                Delete = g.Count(x => x.HanhDong == "DELETE"),
                HanhDongGanNhat = g.OrderByDescending(x => x.ThoiGian).FirstOrDefault().HanhDong,
                ThoiGianGanNhat = g.OrderByDescending(x => x.ThoiGian).FirstOrDefault().ThoiGian
            })
            .OrderByDescending(x => x.TongThaoTac)
            .Take(20)
            .ToListAsync(ct);

        return result.Select(x => new AuditLogTheoUserDto
        {
            NguoiDungId = x.NguoiDungId ?? 0,
            HoTen = "User " + (x.NguoiDungId ?? 0),
            Email = "",
            TongThaoTac = x.TongThaoTac,
            Insert = x.Insert,
            Update = x.Update,
            Delete = x.Delete,
            HanhDongGanNhat = x.HanhDongGanNhat,
            ThoiGianGanNhat = x.ThoiGianGanNhat.HasValue ? x.ThoiGianGanNhat.Value.ToString("dd/MM/yyyy HH:mm") : null
        }).ToList();
    }
}
