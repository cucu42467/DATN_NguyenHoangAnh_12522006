using DTO;

namespace BLL.Interfaces;

public interface ITuKhoaBll
{
    Task<List<TuKhoaDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<TuKhoaDto?> LayChiTietAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, TaoTuKhoaDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, TaoTuKhoaDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
