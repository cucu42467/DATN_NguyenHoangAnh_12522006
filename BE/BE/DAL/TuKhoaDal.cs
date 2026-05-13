using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class TuKhoaDal(AppDbContext context) : ITuKhoaDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<TuKhoaDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var data = await _context.TblTuKhoas
            .Include(t => t.DanhMuc)
            .Where(t => t.NguoiDungId == nguoiDungId)
            .OrderBy(t => t.DoUuTien)
            .ToListAsync(ct);
        return data.Select(MapToDto).ToList();
    }

    public async Task<TuKhoaDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblTuKhoas
            .Include(t => t.DanhMuc)
            .FirstOrDefaultAsync(t => t.TuKhoaId == id, ct);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        var entity = new TblTuKhoa
        {
            NguoiDungId = nguoiDungId,
            TuKhoa = dto.TuKhoa,
            DanhMucId = dto.DanhMucId,
            DoUuTien = dto.DoUuTien ?? 1
        };
        _context.TblTuKhoas.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.TuKhoaId;
    }

    public async Task<bool> CapNhatAsync(int id, TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblTuKhoas.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        entity.TuKhoa = dto.TuKhoa;
        entity.DanhMucId = dto.DanhMucId;
        entity.DoUuTien = dto.DoUuTien ?? 1;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblTuKhoas.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        _context.TblTuKhoas.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static TuKhoaDto MapToDto(TblTuKhoa entity)
    {
        return new TuKhoaDto
        {
            TuKhoaId = entity.TuKhoaId,
            NguoiDungId = entity.NguoiDungId,
            TuKhoa = entity.TuKhoa ?? "",
            DanhMucId = entity.DanhMucId,
            TenDanhMuc = entity.DanhMuc?.TenDanhMuc,
            DoUuTien = entity.DoUuTien
        };
    }
}
