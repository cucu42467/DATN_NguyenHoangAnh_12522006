using DTO;

namespace BLL.Interfaces;

public interface ICanhBaoBll
{
    // User methods
    Task<List<CanhBaoDto>> LayDanhSachAsync(int nguoiDungId, bool? daDoc = null, CancellationToken ct = default);
    Task<CanhBaoDto?> LayChiTietAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, CanhBaoDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<bool> DanhDauDaDocAsync(int nguoiDungId, int id, bool daDoc, CancellationToken ct = default);
    Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default);

    // Admin methods
    Task<List<CanhBaoDto>> LayDanhSachTatCaAsync(bool? daDoc = null, CancellationToken ct = default);
    Task<CanhBaoDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default);
    Task<bool> XoaAdminAsync(int id, CancellationToken ct = default);
}
