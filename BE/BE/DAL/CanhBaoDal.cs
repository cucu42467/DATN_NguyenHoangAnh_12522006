using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class CanhBaoDal(AppDbContext context) : ICanhBaoDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<CanhBaoDto>> LayDanhSachAsync(int nguoiDungId, bool? daDoc = null, CancellationToken ct = default)
    {
        var query = _context.TblCanhbaos.Where(c => c.NguoiDungId == nguoiDungId);

        if (daDoc.HasValue)
        {
            query = query.Where(c => (daDoc.Value ? c.DaDoc == 1 : c.DaDoc == 0) || c.DaDoc == null);
        }

        var data = await query.OrderByDescending(c => c.NgayTao).ToListAsync(ct);
        return data.Select(MapToDto).ToList();
    }

    public async Task<CanhBaoDto?> LayTheoIdAsync(int id, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos
            .FirstOrDefaultAsync(c => c.CanhBaoId == id && c.NguoiDungId == nguoiDungId, ct);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, CanhBaoDto dto, CancellationToken ct = default)
    {
        var entity = new TblCanhbao
        {
            NguoiDungId = nguoiDungId,
            LoaiCanhBao = dto.LoaiCanhBao.HasValue ? (sbyte)dto.LoaiCanhBao.Value : null,
            NoiDung = dto.NoiDung,
            NgayTao = DateTime.Now,
            DaDoc = 0
        };
        _context.TblCanhbaos.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.CanhBaoId;
    }

    public async Task<bool> XoaAsync(int id, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos
            .FirstOrDefaultAsync(c => c.CanhBaoId == id && c.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;

        _context.TblCanhbaos.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DanhDauDaDocAsync(int id, int nguoiDungId, bool daDoc, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos
            .FirstOrDefaultAsync(c => c.CanhBaoId == id && c.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;

        entity.DaDoc = daDoc ? (ulong)1 : 0;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _context.TblCanhbaos
            .CountAsync(c => c.NguoiDungId == nguoiDungId && (c.DaDoc == 0 || c.DaDoc == null), ct);
    }

    private static CanhBaoDto MapToDto(TblCanhbao entity)
    {
        return new CanhBaoDto
        {
            CanhBaoId = entity.CanhBaoId,
            NguoiDungId = entity.NguoiDungId,
            LoaiCanhBao = entity.LoaiCanhBao,
            NoiDung = entity.NoiDung ?? "",
            NgayTao = entity.NgayTao,
            DaDoc = entity.DaDoc == 1
        };
    }

    public async Task<List<CanhBaoDto>> LayDanhSachTatCaAsync(bool? daDoc = null, CancellationToken ct = default)
    {
        var query = _context.TblCanhbaos.AsQueryable();

        if (daDoc.HasValue)
        {
            query = query.Where(c =>
                (daDoc.Value ? c.DaDoc == 1 : c.DaDoc == 0) ||
                c.DaDoc == null);
        }

        var data = await query
            .OrderByDescending(c => c.NgayTao)
            .ToListAsync(ct);

        return data.Select(MapToDto).ToList();
    }

    public async Task<CanhBaoDto?> LayTheoIdAdminAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos
            .FirstOrDefaultAsync(c => c.CanhBaoId == id, ct);

        return entity == null ? null : MapToDto(entity);
    }

    public async Task<bool> XoaAdminAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos
            .FirstOrDefaultAsync(c => c.CanhBaoId == id, ct);

        if (entity == null)
            return false;

        _context.TblCanhbaos.Remove(entity);

        await _context.SaveChangesAsync(ct);

        return true;
    }
}
