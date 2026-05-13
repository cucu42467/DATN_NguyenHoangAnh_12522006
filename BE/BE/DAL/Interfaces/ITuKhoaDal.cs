using DTO;

namespace DAL.Interfaces;

public interface ITuKhoaDal
{
    Task<List<TuKhoaDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<TuKhoaDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, TaoTuKhoaDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, TaoTuKhoaDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
