using Common;
using DTO;

namespace DAL.Interfaces;

public interface IGiaoDichDal
{
    Task<PagedResponse<GiaoDichDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, LocGiaoDichDto? filter = null, int page = 1, int pageSize = 20, CancellationToken ct = default);
    Task<GiaoDichDto?> LayTheoIdAsync(int giaoDichId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int giaoDichId, TaoGiaoDichDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int giaoDichId, CancellationToken ct = default);

    Task<PagedResponse<AdminGiaoDichDto>> LayDanhSachAdminAsync(
        int page, int pageSize, int? userId, sbyte? loai,
        DateTime? tuNgay, DateTime? denNgay, string? q,
        CancellationToken ct = default);

    // Dashboard stats
    Task<int> DemTongGiaoDichHeThongAsync(CancellationToken ct = default);
    Task<decimal> DemTongThuThangHienTaiAsync(CancellationToken ct = default);
    Task<decimal> DemTongChiThangHienTaiAsync(CancellationToken ct = default);
    Task<List<ThongKeGiaoDichThangDto>> LayThongKe6ThangGanNhatAsync(CancellationToken ct = default);
    Task<List<ChiTieuTheoDanhMucDto>> LayChiTieuTheoDanhMucAsync(int top = 6, CancellationToken ct = default);

    // === Báo cáo thống kê mở rộng ===
    Task<int> DemGiaoDichThanhCongAsync(CancellationToken ct = default);
    Task<int> DemGiaoDichLoiAsync(CancellationToken ct = default);
    Task<int> DemGiaoDichTheoNguonAsync(string nguon, CancellationToken ct = default);
    Task<List<GiaoDichTheoDanhMucDto>> LayGiaoDichTheoDanhMucFullAsync(CancellationToken ct = default);
}
