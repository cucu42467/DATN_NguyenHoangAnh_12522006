using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class VaiTroDal(AppDbContext context) : IVaiTroDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<VaiTroDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return await _context.TblVaitros.AsNoTracking()
            .OrderBy(x => x.VaiTroId)
            .Select(x => new VaiTroDto
            {
                VaiTroId = x.VaiTroId,
                TenVaiTro = x.TenVaiTro ?? "",
            })
            .ToListAsync(ct);
    }

    public async Task<VaiTroDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TblVaitros.AsNoTracking()
            .Where(x => x.VaiTroId == id)
            .Select(x => new VaiTroDto
            {
                VaiTroId = x.VaiTroId,
                TenVaiTro = x.TenVaiTro ?? "",
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<int> TaoMoiAsync(TaoVaiTroDto dto, CancellationToken ct = default)
    {
        var entity = new TblVaitro
        {
            TenVaiTro = dto.TenVaiTro,
        };
        _context.TblVaitros.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.VaiTroId;
    }

    public async Task<bool> CapNhatAsync(int id, VaiTroDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblVaitros.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        entity.TenVaiTro = dto.TenVaiTro;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblVaitros.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        // Check if any users have this role
        var coSuDung = await _context.TblNguoidungVaitros.AnyAsync(v => v.VaiTroId == id, ct);
        if (coSuDung) return false;

        _context.TblVaitros.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
