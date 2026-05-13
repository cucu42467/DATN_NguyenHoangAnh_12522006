using System.Text.Json;
using DAL.Interfaces;
using DTO;
using Common;
using BLL.Interfaces;

namespace BLL;

public class AuditLogBll : IAuditLogBll
{
    private readonly IAuditLogDal _auditLogDal;

    public AuditLogBll(IAuditLogDal auditLogDal)
    {
        _auditLogDal = auditLogDal;
    }

    public async Task GhiLogAsync(int? nguoiDungId, string tenBang, int? banGhiId, 
        string hanhDong, object? duLieuCu, object? duLieuMoi, string? ipAddress, CancellationToken ct = default)
    {
        var dto = new TaoAuditLogDto
        {
            NguoiDungId = nguoiDungId,
            TenBang = tenBang,
            BanGhiId = banGhiId,
            HanhDong = hanhDong,
            DuLieuCu = duLieuCu != null ? JsonSerializer.Serialize(duLieuCu) : null,
            DuLieuMoi = duLieuMoi != null ? JsonSerializer.Serialize(duLieuMoi) : null,
            IpAddress = ipAddress,
            ThoiGian = TimeHelper.NowInVietnam()
        };

        await _auditLogDal.GhiLogAsync(dto, ct);
    }

    public async Task<List<AuditLogDto>> LayLichSuAsync(string tenBang, int banGhiId, CancellationToken ct = default)
    {
        return await _auditLogDal.LayLichSuAsync(tenBang, banGhiId, ct);
    }

    public async Task<List<AuditLogDto>> LayLichSuTheoNguoiDungAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default)
    {
        return await _auditLogDal.LayLichSuTheoNguoiDungAsync(nguoiDungId, page, pageSize, ct);
    }

    public async Task<List<AdminAuditLogDto>> LayDanhSachAsync(int page, int pageSize, string? table = null, string? action = null, DateTime? from = null, DateTime? to = null, CancellationToken ct = default)
    {
        var logs = await _auditLogDal.LayDanhSachAsync(page, pageSize, table, action, from, to, ct);
        return logs;
    }

    public async Task<List<AdminAuditLogDto>> LayGanNhatAsync(int count = 10, CancellationToken ct = default)
    {
        return await _auditLogDal.LayGanNhatAsync(count, ct);
    }

    // ============ Báo cáo audit ============

    public async Task<List<AuditLogTheoUserDto>> LayAuditLogTheoUserAsync(CancellationToken ct = default)
    {
        return await _auditLogDal.LayAuditLogTheoUserAsync(ct);
    }
}
