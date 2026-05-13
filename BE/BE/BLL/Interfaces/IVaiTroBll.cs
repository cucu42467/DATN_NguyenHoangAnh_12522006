using DTO;

namespace BLL.Interfaces;

public interface IVaiTroBll
{
    Task<List<VaiTroDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<VaiTroDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoVaiTroDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, VaiTroDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
