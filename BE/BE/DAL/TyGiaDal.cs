using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class TyGiaDal(AppDbContext context) : ITyGiaDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<TyGiaDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return await _context.TblTygia.AsNoTracking()
            .OrderByDescending(x => x.NgayCapNhat)
            .Select(x => new TyGiaDto
            {
                TyGiaId = x.TyGiaId,
                TuTienTe = x.TuTienTe ?? "",
                SangTienTe = x.SangTienTe ?? "",
                TyGia = x.TyGia,
                NgayCapNhat = x.NgayCapNhat
            })
            .ToListAsync(ct);
    }

    public async Task<TyGiaDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TblTygia.AsNoTracking()
            .Where(x => x.TyGiaId == id)
            .Select(x => new TyGiaDto
            {
                TyGiaId = x.TyGiaId,
                TuTienTe = x.TuTienTe ?? "",
                SangTienTe = x.SangTienTe ?? "",
                TyGia = x.TyGia,
                NgayCapNhat = x.NgayCapNhat
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<int> TaoMoiAsync(TaoTyGiaDto dto, CancellationToken ct = default)
    {
        var entity = new TblTygium
        {
            TuTienTe = dto.TuTienTe,
            SangTienTe = dto.SangTienTe,
            TyGia = dto.TyGia,
            NgayCapNhat = DateTime.Now
        };
        _context.TblTygia.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.TyGiaId;
    }

    public async Task<bool> CapNhatAsync(int id, TyGiaDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblTygia.FirstOrDefaultAsync(x => x.TyGiaId == id, ct);
        if (entity == null) return false;

        entity.TyGia = dto.TyGia;
        entity.NgayCapNhat = DateTime.Now;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblTygia.FirstOrDefaultAsync(x => x.TyGiaId == id, ct);
        if (entity == null) return false;

        _context.TblTygia.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
