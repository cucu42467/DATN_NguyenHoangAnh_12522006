using DTO;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using DAL.Interfaces;

namespace DAL;

public class PhienDal : IPhienDal
{
    private readonly AppDbContext _db;

    public PhienDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SessionDto>> LayDanhSachAsync(int? userId, CancellationToken ct = default)
    {
        var query = _db.TblPhienDangnhaps.AsNoTracking().AsQueryable();
        if (userId.HasValue) query = query.Where(x => x.NguoiDungId == userId.Value);

        return await query
            .OrderByDescending(x => x.NgayTao)
            .Select(x => new SessionDto
            {
                SessionId = x.SessionId,
                NguoiDungId = x.NguoiDungId,
                RefreshToken = x.RefreshToken,
                IpAddress = x.IpAddress,
                ThietBi = x.ThietBi,
                HeDieuHanh = x.HeDieuHanh,
                HetHan = x.HetHan,
                TrangThai = x.TrangThai,
                NgayTao = x.NgayTao
            })
            .ToListAsync(ct);
    }

    public async Task<bool> ThuHoiAsync(int sessionId, CancellationToken ct = default)
    {
        var entity = await _db.TblPhienDangnhaps.FindAsync(sessionId);
        if (entity == null) return false;

        entity.TrangThai = 0; // 0 = Inactive/Revoked
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task ThuHoiTatCaAsync(int userId, CancellationToken ct = default)
    {
        var sessions = await _db.TblPhienDangnhaps.Where(x => x.NguoiDungId == userId && x.TrangThai == 1).ToListAsync(ct);
        foreach (var s in sessions) s.TrangThai = 0;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<bool> XoaAsync(int sessionId, CancellationToken ct = default)
    {
        var entity = await _db.TblPhienDangnhaps.FindAsync(sessionId);
        if (entity == null) return false;

        _db.TblPhienDangnhaps.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
