using DTO;

namespace BLL.Interfaces;

public interface IPhienBll
{
    Task<List<SessionDto>> LayDanhSachAsync(int? userId, CancellationToken ct = default);
    Task<bool> ThuHoiAsync(int sessionId, CancellationToken ct = default);
    Task ThuHoiTatCaAsync(int userId, CancellationToken ct = default);
    Task<bool> XoaAsync(int sessionId, CancellationToken ct = default);
}
