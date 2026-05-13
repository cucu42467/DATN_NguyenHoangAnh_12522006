using System.Text.Json;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class ThongBaoBll : IThongBaoBll
{
    private readonly IThongBaoDal _dal;
    private readonly IAuditLogDal _auditLogDal;

    public ThongBaoBll(IThongBaoDal dal, IAuditLogDal auditLogDal)
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
                TenBang = "tbl_thongbao",
                BanGhiId = banGhiId,
                HanhDong = hanhDong,
                DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
                DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
                ThoiGian = TimeHelper.NowInVietnam()
            });
        }
        catch { /* Không ảnh hưởng đến flow chính */ }
    }

    // User methods
    public async Task<List<ThongBaoDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.LayDanhSachAsync(nguoiDungId, ct);
    }

    public async Task<ThongBaoDto?> LayChiTietAsync(int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAsync(id, ct);
    }

    public async Task<bool> DanhDauDaDocAsync(int id, CancellationToken ct = default)
    {
        return await _dal.DanhDauDaDocAsync(id, ct);
    }

    public async Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.DemChuaDocAsync(nguoiDungId, ct);
    }

    public async Task<int> TaoMoiAsync(TaoThongBaoDto dto, CancellationToken ct = default)
    {
        var id = await _dal.TaoMoiAsync(dto, ct);
        await GhiAuditLogAsync(dto.NguoiDungId, id, "CREATE", null, dto);
        return id;
    }

    // Admin methods
    public async Task<List<ThongBaoDto>> LayDanhSachTatCaAsync(CancellationToken ct = default)
    {
        return await _dal.LayDanhSachTatCaAsync(ct);
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        var thongBao = await _dal.LayTheoIdAsync(id, ct);
        var result = await _dal.XoaAsync(id, ct);
        if (result && thongBao != null)
            await GhiAuditLogAsync(thongBao.NguoiDungId, id, "DELETE", thongBao, null);
        return result;
    }

    // ============ Báo cáo thống kê ============

    public async Task<ThongKeThongBaoDto> LayThongKeThongBaoAsync(CancellationToken ct = default)
    {
        var result = await _dal.LayThongKeThongBaoAsync(ct);
        return result ?? new ThongKeThongBaoDto();
    }
}
