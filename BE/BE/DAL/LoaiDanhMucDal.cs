using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models.Data;

namespace DAL;

public class LoaiDanhMucDal : ILoaiDanhMucDal
{
    private readonly AppDbContext _context;

    public LoaiDanhMucDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<LoaiDanhMucDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        var data = await _context.TblLoaiDanhmucs
            .OrderBy(x => x.LoaiDanhMucId)
            .Select(x => new LoaiDanhMucDto
            {
                LoaiDanhMucId = x.LoaiDanhMucId,
                TenLoai = x.TenLoai
            })
            .ToListAsync(ct);

        return data;
    }

    public async Task<LoaiDanhMucDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        var data = await _context.TblLoaiDanhmucs
            .AsNoTracking()
            .Where(x => x.LoaiDanhMucId == id)
            .Select(x => new LoaiDanhMucDto
            {
                LoaiDanhMucId = x.LoaiDanhMucId,
                TenLoai = x.TenLoai
            })
            .FirstOrDefaultAsync(ct);

        return data;
    }

    public async Task<LoaiDanhMucDto?> LayTheoDanhMucIdAsync(int danhMucId, CancellationToken ct = default)
    {
        var data = await _context.TblDanhmucs
            .AsNoTracking()
            .Include(x => x.LoaiDanhMuc)
            .Where(x => x.DanhMucId == danhMucId)
            .Select(x => new LoaiDanhMucDto
            {
                LoaiDanhMucId = x.LoaiDanhMuc.LoaiDanhMucId,
                TenLoai = x.LoaiDanhMuc.TenLoai
            })
            .FirstOrDefaultAsync(ct);

        return data;
    }

    public async Task<int> TaoMoiAsync(TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        var entity = new Models.TblLoaiDanhmuc
        {
            TenLoai = dto.TenLoai
        };
        _context.TblLoaiDanhmucs.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.LoaiDanhMucId;
    }

    public async Task<bool> CapNhatAsync(int id, TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblLoaiDanhmucs.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        entity.TenLoai = dto.TenLoai;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblLoaiDanhmucs.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        // Check if any categories use this type
        var coSuDung = await _context.TblDanhmucs.AnyAsync(d => d.LoaiDanhMucId == id, ct);
        if (coSuDung) return false;

        _context.TblLoaiDanhmucs.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}

