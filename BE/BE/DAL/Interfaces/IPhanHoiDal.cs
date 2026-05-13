using DTO;

namespace DAL.Interfaces;

public interface IPhanHoiDal
{
    Task<int> TaoPhanHoiAsync(int nguoiDungId, string tieuDe, string noiDung, CancellationToken ct = default);
    Task<List<PhanHoiDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default);
    Task<PhanHoiDto?> LayTheoIdAsync(int phanHoiId, CancellationToken ct = default);
    Task<bool> CapNhatTrangThaiAsync(int phanHoiId, sbyte trangThaiMoi, CancellationToken ct = default);
    Task<int> DemPhanHoiChoXuLyAsync(CancellationToken ct = default);

    // === Báo cáo thống kê ===
    Task<ThongKePhanHoiDto?> LayThongKePhanHoiAsync(CancellationToken ct = default);
}
