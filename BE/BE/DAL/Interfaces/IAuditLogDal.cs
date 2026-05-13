using DTO;

namespace DAL.Interfaces;

public interface IAuditLogDal
{
    Task<int> GhiLogAsync(TaoAuditLogDto dto, CancellationToken ct = default);
    Task<List<AuditLogDto>> LayLichSuAsync(string tenBang, int banGhiId, CancellationToken ct = default);
    Task<List<AuditLogDto>> LayLichSuTheoNguoiDungAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default);
    Task<List<AdminAuditLogDto>> LayDanhSachAsync(int page, int pageSize, string? table = null, string? action = null, DateTime? from = null, DateTime? to = null, CancellationToken ct = default);
    Task<List<AdminAuditLogDto>> LayGanNhatAsync(int count = 10, CancellationToken ct = default);

    // === Báo cáo audit ===
    Task<List<AuditLogTheoUserDto>> LayAuditLogTheoUserAsync(CancellationToken ct = default);
}
