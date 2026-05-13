using DTO;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using DAL.Interfaces;

namespace DAL;

public class CauHinhDal(AppDbContext context) : ICauHinhDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<CauHinhHeThongDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return await _context.TblCauhinhHethongs.AsNoTracking()
            .OrderBy(x => x.CauHinhId)
            .Select(x => new CauHinhHeThongDto
            {
                CauHinhId = x.CauHinhId,
                TenThamSo = x.TenThamSo ?? "",
                GiaTri = x.GiaTri ?? "",
                MoTa = x.MoTa,
                KieuDuLieu = x.KieuDuLieu
            })
            .ToListAsync(ct);
    }

    public async Task<CauHinhHeThongDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TblCauhinhHethongs.AsNoTracking()
            .Where(x => x.CauHinhId == id)
            .Select(x => new CauHinhHeThongDto
            {
                CauHinhId = x.CauHinhId,
                TenThamSo = x.TenThamSo ?? "",
                GiaTri = x.GiaTri ?? "",
                MoTa = x.MoTa,
                KieuDuLieu = x.KieuDuLieu
            })
            .FirstOrDefaultAsync(ct);
    }

    public async Task<bool> CapNhatAsync(int id, CauHinhHeThongDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblCauhinhHethongs.FirstOrDefaultAsync(x => x.CauHinhId == id, ct);
        if (entity == null) return false;

        entity.GiaTri = dto.GiaTri;
        entity.MoTa = dto.MoTa;
        entity.KieuDuLieu = dto.KieuDuLieu;
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
