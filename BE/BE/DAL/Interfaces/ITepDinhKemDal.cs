using DTO;

namespace DAL.Interfaces;

public interface ITepDinhKemDal
{
    Task<List<TepDinhKemDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<TepDinhKemDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoTepDinhKemDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
