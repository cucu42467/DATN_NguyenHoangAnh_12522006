using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class LoaiTaiKhoanDal(AppDbContext context) : ILoaiTaiKhoanDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<LoaiTaiKhoanDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        var data = await _context.TblLoaiTaikhoans.ToListAsync(ct);
        return data.Select(MapToDto).ToList();
    }

    public async Task<LoaiTaiKhoanDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblLoaiTaikhoans.FindAsync(new object[] { id }, ct);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var entity = new TblLoaiTaikhoan
        {
            TenLoai = dto.TenLoai
        };
        _context.TblLoaiTaikhoans.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.LoaiTaiKhoanId;
    }

    public async Task<bool> CapNhatAsync(int id, TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblLoaiTaikhoans.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        entity.TenLoai = dto.TenLoai;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblLoaiTaikhoans.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        // Check if any accounts use this type
        var coSuDung = await _context.TblTaikhoans.AnyAsync(t => t.LoaiTaiKhoanId == id, ct);
        if (coSuDung) return false;

        _context.TblLoaiTaikhoans.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static LoaiTaiKhoanDto MapToDto(TblLoaiTaikhoan entity)
    {
        return new LoaiTaiKhoanDto
        {
            LoaiTaiKhoanId = entity.LoaiTaiKhoanId,
            TenLoai = entity.TenLoai ?? ""
        };
    }
}
