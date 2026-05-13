using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using DTO;

namespace DAL;

public class NguoiDungVaitroDal : INguoiDungVaitroDal
{
    private readonly AppDbContext _db;

    public NguoiDungVaitroDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task GanVaiTroAsync(int nguoiDungId, int vaiTroId, CancellationToken huyBo = default)
    {
        // Xóa vai trò cũ
        var roles = await _db.TblNguoidungVaitros
            .Where(x => x.NguoiDungId == nguoiDungId)
            .ToListAsync(huyBo);
        _db.TblNguoidungVaitros.RemoveRange(roles);

        // Thêm vai trò mới
        _db.TblNguoidungVaitros.Add(new TblNguoidungVaitro
        {
            NguoiDungId = nguoiDungId,
            VaiTroId = vaiTroId
        });

        await _db.SaveChangesAsync(huyBo);
    }

    public async Task<VaiTroDto?> LayTheoTenAsync(string tenVaiTro, CancellationToken huyBo = default)
    {
        var entity = await _db.TblVaitros
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenVaiTro == tenVaiTro, huyBo);

        if (entity == null) return null;

        return new VaiTroDto
        {
            VaiTroId = entity.VaiTroId,
            TenVaiTro = entity.TenVaiTro ?? ""
        };
    }
}
