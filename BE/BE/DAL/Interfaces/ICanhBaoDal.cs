using DTO;

namespace DAL.Interfaces;

public interface ICanhBaoDal
{
    // User methods
    Task<List<CanhBaoDto>> LayDanhSachAsync(int nguoiDungId, bool? daDoc = null, CancellationToken ct = default);
    Task<CanhBaoDto?> LayTheoIdAsync(int id, int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, CanhBaoDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, int nguoiDungId, CancellationToken ct = default);
    Task<bool> DanhDauDaDocAsync(int id, int nguoiDungId, bool daDoc, CancellationToken ct = default);
    Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default);

    // Admin methods
    Task<List<CanhBaoDto>> LayDanhSachTatCaAsync(bool? daDoc = null, CancellationToken ct = default);
    Task<CanhBaoDto?> LayTheoIdAdminAsync(int id, CancellationToken ct = default);
    Task<bool> XoaAdminAsync(int id, CancellationToken ct = default);
}
