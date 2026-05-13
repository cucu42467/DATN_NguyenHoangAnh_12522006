using DTO;

namespace BLL.Interfaces;

public interface INhacNhoBll
{
    // User methods
    Task<List<NhacNhoDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<NhacNhoDto?> LayChiTietAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, TaoNhacNhoDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, int id, TaoNhacNhoDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<bool> CapNhatTrangThaiAsync(int nguoiDungId, int id, int trangThai, CancellationToken ct = default);

    // Admin methods
    Task<List<NhacNhoDto>> LayDanhSachTatCaAsync(CancellationToken ct = default);
    Task<NhacNhoDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default);
    Task<bool> XoaAdminAsync(int id, CancellationToken ct = default);
}
