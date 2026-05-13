using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class CaiDatDal(AppDbContext context) : ICaiDatDal
{
    private readonly AppDbContext _context = context;

    public async Task<CaiDatDto?> LayTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblCaidats
            .FirstOrDefaultAsync(c => c.NguoiDungId == nguoiDungId, ct);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var entity = new TblCaidat
        {
            NguoiDungId = nguoiDungId,
            NgonNgu = "vi",
            TienTe = "VND",
            CheDoToi = 0,
            DinhDangNgay = "dd/MM/yyyy",
            NhanThongBao = 1
        };
        _context.TblCaidats.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.CaiDatId;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, TaoCaiDatDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblCaidats
            .FirstOrDefaultAsync(c => c.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;

        entity.NgonNgu = dto.NgonNgu;
        entity.TienTe = dto.TienTe;
        entity.CheDoToi = dto.CheDoToi ? (ulong)1 : 0;
        entity.DinhDangNgay = dto.DinhDangNgay;
        entity.NhanThongBao = dto.NhanThongBao ? (ulong)1 : 0;
        entity.ThongBaoJson = dto.ThongBaoJson;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<CaiDatDto>> GetAllWithThongBaoBatAsync()
    {
        var entities = await _context.TblCaidats
            .Where(c => c.NhanThongBao == 1)
            .ToListAsync();
        return entities.Select(MapToDto).ToList();
    }

    private static CaiDatDto MapToDto(TblCaidat entity)
    {
        return new CaiDatDto
        {
            CaiDatId = entity.CaiDatId,
            NguoiDungId = entity.NguoiDungId,
            NgonNgu = entity.NgonNgu,
            TienTe = entity.TienTe,
            CheDoToi = entity.CheDoToi == 1,
            DinhDangNgay = entity.DinhDangNgay,
            NhanThongBao = entity.NhanThongBao == 1,
            ThongBaoJson = entity.ThongBaoJson
        };
    }
}
