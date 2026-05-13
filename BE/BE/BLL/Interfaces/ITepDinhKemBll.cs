using DTO;

namespace BLL.Interfaces;

public interface ITepDinhKemBll
{
    // User methods
    Task<List<TepDinhKemDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<TepDinhKemDto?> LayChiTietAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoTepDinhKemDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);

    // Admin methods
}
