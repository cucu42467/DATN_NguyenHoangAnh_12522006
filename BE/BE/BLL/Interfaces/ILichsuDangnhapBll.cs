using DTO;

namespace BLL.Interfaces;

public interface ILichsuDangnhapBll
{
    Task<List<LichSuDangNhapDto>> LayTatCaAsync(
        CancellationToken huyBo = default);

    Task<List<LichSuDangNhapDto>> LayTheoNguoiDungAsync(
        int nguoiDungId,
        CancellationToken huyBo = default);

    Task<LichSuDangNhapDto?> LayTheoIdAsync(
        int id,
        CancellationToken huyBo = default);

    Task<List<LichSuDangNhapDto>> LayPhanTrangAsync(
        int page,
        int pageSize,
        CancellationToken huyBo = default);

    Task<List<LichSuDangNhapDto>> LayTheoNguoiDungPhanTrangAsync(
        int nguoiDungId,
        int page,
        int pageSize,
        CancellationToken huyBo = default);

    // === Báo cáo bảo mật ===
    Task<List<DangNhapThatBaiDto>> LayDangNhapThatBaiAsync(int gioiHan, CancellationToken ct = default);
    Task<List<HoatDongBatThuongDto>> LayHoatDongBatThuongAsync(CancellationToken ct = default);
}