using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Models;

namespace BLL;

public class NhacNhoBll : INhacNhoBll
{
    private readonly INhacNhoDal _dal;
    private readonly IAuditLogDal _auditLogDal;

    public NhacNhoBll(INhacNhoDal dal, IAuditLogDal auditLogDal)
    {
        _dal = dal;
        _auditLogDal = auditLogDal;
    }

    private async Task GhiAuditLogAsync(int? nguoiDungId, int? banGhiId, string hanhDong, object? duLieuCu, object? duLieuMoi)
    {
        try
        {
            await _auditLogDal.GhiLogAsync(new TaoAuditLogDto
            {
                NguoiDungId = nguoiDungId,
                TenBang = "tbl_nhacnho",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { }
    }

    public async Task<List<NhacNhoDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var entities = await _dal.LayDanhSachAsync(nguoiDungId);
        return entities.Select(MapToDto).ToList();
    }

    public async Task<NhacNhoDto?> LayChiTietAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        var entity = await _dal.LayTheoIdAsync(id);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoNhacNhoDto dto, CancellationToken ct = default)
    {
        var entity = new TblNhacnho
        {
            NguoiDungId = nguoiDungId,
            TieuDe = dto.TieuDe,
            NoiDung = dto.NoiDung,
            NgayNhac = dto.NgayNhac,
            LapLai = dto.LapLai,

            // NEW FIELDS
            ChuKy = dto.ChuKy,
            LanNhacCuoi = dto.LanNhacCuoi,
            LanNhacTiep = dto.LanNhacTiep,

            TrangThai = 1,
            NgayTao = TimeHelper.NowInVietnam()
        };

        var id = await _dal.TaoMoiAsync(entity);
        await GhiAuditLogAsync(nguoiDungId, id, "INSERT", null, dto);

        return id;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int id, TaoNhacNhoDto dto, CancellationToken ct = default)
    {
        var current = await _dal.LayTheoIdAsync(id);

        var entity = new TblNhacnho
        {
            NhacNhoId = id,
            NguoiDungId = nguoiDungId,
            TieuDe = dto.TieuDe,
            NoiDung = dto.NoiDung,
            NgayNhac = dto.NgayNhac,
            LapLai = dto.LapLai,

            // NEW FIELDS
            ChuKy = dto.ChuKy,
            LanNhacCuoi = dto.LanNhacCuoi,
            LanNhacTiep = dto.LanNhacTiep
        };

        var result = await _dal.CapNhatAsync(entity);

        if (result && current != null)
            await GhiAuditLogAsync(nguoiDungId, id, "UPDATE", MapToDto(current), dto);

        return result;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        var current = await _dal.LayTheoIdAsync(id);
        var result = await _dal.XoaAsync(id);

        if (result && current != null)
            await GhiAuditLogAsync(nguoiDungId, id, "DELETE", MapToDto(current), null);

        return result;
    }

    public async Task<bool> CapNhatTrangThaiAsync(int nguoiDungId, int id, int trangThai, CancellationToken ct = default)
    {
        return await _dal.CapNhatTrangThaiAsync(id, trangThai);
    }

    // ===== ADMIN =====

    public async Task<List<NhacNhoDto>> LayDanhSachTatCaAsync(CancellationToken ct = default)
    {
        var entities = await _dal.LayDanhSachTatCaAsync(0);
        return entities.Select(MapToDto).ToList();
    }

    public async Task<NhacNhoDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default)
    {
        var entity = await _dal.LayTheoIdAdminAsync(id);
        return entity == null ? null : MapToDto(entity);
    }

    public async Task<bool> XoaAdminAsync(int id, CancellationToken ct = default)
    {
        return await _dal.XoaAdminAsync(id);
    }

    // ===== MAPPING =====

    private static NhacNhoDto MapToDto(TblNhacnho entity)
    {
        return new NhacNhoDto
        {
            NhacNhoId = entity.NhacNhoId,
            NguoiDungId = entity.NguoiDungId,
            TieuDe = entity.TieuDe,
            NoiDung = entity.NoiDung,
            NgayNhac = entity.NgayNhac,
            LapLai = entity.LapLai,
            TrangThai = entity.TrangThai,

            // NEW FIELDS
            ChuKy = entity.ChuKy,
            LanNhacCuoi = entity.LanNhacCuoi,
            LanNhacTiep = entity.LanNhacTiep
        };
    }
}