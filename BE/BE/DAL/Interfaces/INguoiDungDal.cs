using DTO;
using Common;

namespace DAL;

public interface INguoiDungDal
{
    Task<NguoiDungDto?> LayTheoEmailHoacSoDienThoaiAsync(string tenDangNhap, CancellationToken huyBo = default);
    Task<NguoiDungDto?> LayTheoIdAsync(int nguoiDungId, CancellationToken huyBo = default);
    Task<NguoiDungDto?> LayTheoEmailAsync(string email, CancellationToken huyBo = default);
    Task<NguoiDungDto?> LayTheoSoDienThoaiAsync(string soDienThoai, CancellationToken huyBo = default);
    Task<NguoiDungDto> ThemMoiAsync(NguoiDungDto nguoiDung, CancellationToken huyBo = default);
    Task<NguoiDungDto> DangKyNguoiDungAsync(YeuCauDangKyDto yeuCau, CancellationToken huyBo = default);


    // Admin
    Task<(List<NguoiDungDto> Items, int TotalCount)> LayDanhSachAdminAsync(
        int page,
        int pageSize,
        LocNguoiDungFilter? filter = null,
        CancellationToken ct = default);
    Task<NguoiDungChiTietDto?> LayChiTietAdminFullAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAdminAsync(TaoNguoiDungAdminDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAdminAsync(int id, CapNhatNguoiDungAdminDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, CancellationToken huyBo = default);

    // Lịch sử đăng nhập
    Task<PagedResponse<LichSuDangNhapDto>> LayLichSuDangNhapAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default);

    // System
    Task<bool> CapNhatTrangThaiAsync(int nguoiDungId, sbyte trangThai, CancellationToken huyBo = default);
    Task<bool> CapNhatMatKhauAsync(int nguoiDungId, string matKhauMoi, CancellationToken huyBo = default);

    // Me
    Task<NguoiDungMeDto?> LayMeAsync(int nguoiDungId, CancellationToken huyBo = default);
    Task<bool> CapNhatMeAsync(int nguoiDungId, CapNhatNguoiDungMeDto dto, CancellationToken huyBo = default);
    Task<bool> DoiMatKhauAsync(int nguoiDungId, DoiMatKhauDto dto, CancellationToken huyBo = default);

    // Vai trò multi-role support
    Task<List<string>> LayVaiTroTheoNguoiDungIdAsync(int nguoiDungId, CancellationToken huyBo = default);
    Task<NguoiDungLoginDto?> LayDangNhapAsync(string key, CancellationToken ct = default);

    // Dashboard stats
    Task<int> DemNguoiDungHoatDongAsync(CancellationToken ct = default);
    Task<int> DemNguoiDungMoi7NgayAsync(CancellationToken ct = default);
    Task<int> DemNguoiDungBiVoHieuHoaAsync(CancellationToken ct = default);
    Task<ThongKeNguoiDungDto> LayThongKeTangTruongNguoiDungAsync(int nam, CancellationToken ct = default);
    Task<ThongKeTongQuanNguoiDungDto> LayThongKeTongQuanAsync(CancellationToken ct = default);
    Task<ThongKeTongQuanNguoiDungDto> LayThongKeTheoLocAsync(LocNguoiDungFilter filter, CancellationToken ct = default);
    Task<byte[]> XuatExcelAsync(LocNguoiDungFilter? filter, CancellationToken ct = default);

    // === Báo cáo thống kê mở rộng ===
    Task<int> DemTongNguoiDungAsync(CancellationToken ct = default);
    Task<int> DemNguoiDungDaXoaAsync(CancellationToken ct = default);
    Task<int> DemEmailDaXacThucAsync(CancellationToken ct = default);
    Task<int> DemSDTDaXacThucAsync(CancellationToken ct = default);
    Task<int> DemDang2FAAsync(CancellationToken ct = default);
    Task<int> DemSocialProviderAsync(string provider, CancellationToken ct = default);
    Task<int> DemNguoiDungMoiTheoNgayAsync(DateTime date, CancellationToken ct = default);
    Task<int> DemNguoiDungMoiTheoTuanAsync(DateTime weekStart, CancellationToken ct = default);
    Task<int> DemNguoiDungMoiTheoThangAsync(int month, int year, CancellationToken ct = default);
    Task<List<NguoiDungDto>> LayNguoiDungKhongHoatDongAsync(DateTime cutoffDate, CancellationToken ct = default);
}
