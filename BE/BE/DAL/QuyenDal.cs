using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

using DAL.Interfaces;

namespace DAL;

public class QuyenDal : IQuyenDal
{
    private readonly AppDbContext _context;
    public QuyenDal(AppDbContext context) { _context = context; }

    public async Task<List<QuyenDto>> LayTatCaAsync()
    {
        return await _context.TblQuyens.AsNoTracking().Select(x => new QuyenDto
        {
            QuyenId = x.QuyenId,
            TenQuyen = x.TenQuyen,
            MoTa = x.MoTa
        }).ToListAsync();
    }

    public async Task<QuyenDto?> LayTheoIdAsync(int id)
    {
        var x = await _context.TblQuyens.AsNoTracking().FirstOrDefaultAsync(q => q.QuyenId == id);
        return x == null ? null : new QuyenDto { QuyenId = x.QuyenId, TenQuyen = x.TenQuyen, MoTa = x.MoTa };
    }

    public async Task<int> TaoMoiAsync(QuyenDto dto)
    {
        var entity = new TblQuyen { TenQuyen = dto.TenQuyen, MoTa = dto.MoTa };
        _context.TblQuyens.Add(entity);
        await _context.SaveChangesAsync();
        return entity.QuyenId;
    }

    public async Task<bool> XoaAsync(int id)
    {
        var entity = await _context.TblQuyens.FindAsync(id);
        if (entity == null) return false;
        _context.TblQuyens.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
