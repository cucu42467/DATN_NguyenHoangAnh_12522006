using DTO;

namespace BLL.Interfaces;

public interface IThongBaoBll
{
    // User methods
    Task<List<ThongBaoDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<ThongBaoDto?> LayChiTietAsync(int id, CancellationToken ct = default);
    Task<bool> DanhDauDaDocAsync(int id, CancellationToken ct = default);
    Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoThongBaoDto dto, CancellationToken ct = default);

    // Admin methods
    Task<List<ThongBaoDto>> LayDanhSachTatCaAsync(CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);

    // === Báo cáo thống kê ===
    Task<ThongKeThongBaoDto> LayThongKeThongBaoAsync(CancellationToken ct = default);
}
