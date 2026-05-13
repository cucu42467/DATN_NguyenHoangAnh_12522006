using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class TepDinhKemDal(AppDbContext context) : ITepDinhKemDal
{
    private readonly AppDbContext _context = context;

    public async Task<List<TepDinhKemDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        var data = await _context.TblTepDinhkems
            .OrderByDescending(t => t.NgayTao)
            .ToListAsync(ct);
        return data.Select(MapToDto).ToList();
    }

    public async Task<TepDinhKemDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblTepDinhkems.FindAsync(new object[] { id }, ct);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(TaoTepDinhKemDto dto, CancellationToken ct = default)
    {
        var entity = new TblTepDinhkem
        {
            TenFile = dto.TenFile,
            DuongDan = dto.DuongDan,
            LoaiFile = dto.LoaiFile,
            KichThuoc = dto.KichThuoc,
            NgayTao = DateTime.Now
        };
        _context.TblTepDinhkems.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.TepId;
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblTepDinhkems.FindAsync(new object[] { id }, ct);
        if (entity == null) return false;

        // Delete physical file if exists
        if (File.Exists(entity.DuongDan))
        {
            File.Delete(entity.DuongDan);
        }

        _context.TblTepDinhkems.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    private static TepDinhKemDto MapToDto(TblTepDinhkem entity)
    {
        return new TepDinhKemDto
        {
            TepId = entity.TepId,
            TenFile = entity.TenFile ?? "",
            DuongDan = entity.DuongDan ?? "",
            LoaiFile = entity.LoaiFile,
            KichThuoc = entity.KichThuoc,
            NgayTao = entity.NgayTao
        };
    }
}
