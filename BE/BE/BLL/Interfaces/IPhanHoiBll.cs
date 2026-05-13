using DTO;

namespace BLL.Interfaces;

public interface IPhanHoiBll
{
    Task<List<PhanHoiDto>> LayTatCaAsync(int? nguoiDungId = null);
    Task<PhanHoiDto?> LayTheoIdAsync(int id);
    Task<int> TaoMoiAsync(PhanHoiDto dto);
    Task<bool> CapNhatAsync(int id, PhanHoiDto dto);
    Task<bool> XoaAsync(int id);
    Task<bool> CapNhatTrangThaiAsync(int id, sbyte trangThai);
    Task<int> DemPhanHoiChoXuLyAsync();

    // === Báo cáo thống kê ===
    Task<ThongKePhanHoiDto> LayThongKePhanHoiAsync(CancellationToken ct = default);
}
