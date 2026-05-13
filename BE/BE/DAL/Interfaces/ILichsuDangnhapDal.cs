using Models;
using DTO;

namespace DAL.Interfaces;

public interface ILichsuDangnhapDal
{
    Task GhiLaiAsync(TblLichsuDangnhap dong, CancellationToken huyBo = default);

    Task<List<TblLichsuDangnhap>> LayTatCaAsync(
        CancellationToken huyBo = default);

    Task<List<TblLichsuDangnhap>> LayTheoNguoiDungAsync(
        int nguoiDungId,
        CancellationToken huyBo = default);

    Task<TblLichsuDangnhap?> LayTheoIdAsync(
        int id,
        CancellationToken huyBo = default);

    Task<List<TblLichsuDangnhap>> LayPhanTrangAsync(
        int page,
        int pageSize,
        CancellationToken huyBo = default);

    Task<List<TblLichsuDangnhap>> LayTheoNguoiDungPhanTrangAsync(
        int nguoiDungId,
        int page,
        int pageSize,
        CancellationToken huyBo = default);

    Task<int> DemDangNhapHomNayAsync(CancellationToken ct = default);

    // === Báo cáo bảo mật ===
    Task<int> DemTongDangNhapAsync(CancellationToken ct = default);
    Task<int> DemDangNhapThanhCongAsync(CancellationToken ct = default);
    Task<int> DemDangNhapThatBaiAsync(CancellationToken ct = default);
    Task<int> DemDangNhapThangAsync(DateTime startOfMonth, CancellationToken ct = default);
    Task<List<DangNhapThatBaiDto>> LayDangNhapThatBaiAsync(int gioiHan, CancellationToken ct = default);
    Task<List<HoatDongBatThuongDto>> LayHoatDongBatThuongAsync(CancellationToken ct = default);
}