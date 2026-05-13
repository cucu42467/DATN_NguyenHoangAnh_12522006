namespace BLL.Interfaces;

/// <summary>
/// Interface xử lý logic giao dịch định kỳ
/// </summary>
public interface IGiaoDichDinhKyService
{
    /// <summary>
    /// Xử lý tất cả giao dịch định kỳ đến hạn
    /// </summary>
    Task<int> XuLyTatCaAsync(CancellationToken ct = default);
}
