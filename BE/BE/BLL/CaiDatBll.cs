using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class CaiDatBll : ICaiDatBll
{
    private readonly ICaiDatDal _dal;
    private readonly IAuditLogDal _auditLogDal;

    public CaiDatBll(ICaiDatDal dal, IAuditLogDal auditLogDal)
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
                TenBang = "tbl_caidat",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    public async Task<CaiDatDto?> LayTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.LayTheoNguoiDungAsync(nguoiDungId, ct);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.TaoMoiAsync(nguoiDungId, ct);
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, TaoCaiDatDto dto, CancellationToken ct = default)
    {
        var caiDatHienTai = await _dal.LayTheoNguoiDungAsync(nguoiDungId, ct);
        var result = await _dal.CapNhatAsync(nguoiDungId, dto, ct);
        if (result && caiDatHienTai != null)
            await GhiAuditLogAsync(nguoiDungId, caiDatHienTai.CaiDatId, "UPDATE", caiDatHienTai, dto);
        return result;
    }

}
