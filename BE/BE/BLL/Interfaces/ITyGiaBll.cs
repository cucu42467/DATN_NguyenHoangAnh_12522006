using DTO;

namespace BLL.Interfaces;

public interface ITyGiaBll
{
    Task<List<TyGiaDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<TyGiaDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoTyGiaDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, TyGiaDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
