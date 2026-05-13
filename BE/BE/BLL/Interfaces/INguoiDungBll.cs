using Common;
using DTO;

namespace BLL.Interfaces;

public interface INguoiDungBll
{
    // === USER PROFILE (API_ND) ===
    Task<NguoiDungMeDto?> LayMeAsync(int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatMeAsync(int nguoiDungId, CapNhatNguoiDungMeDto dto, CancellationToken ct = default);
    Task<bool> DoiMatKhauAsync(int nguoiDungId, DoiMatKhauDto dto, CancellationToken ct = default);

    // === ADMIN (API_QT) ===
    Task<PagedResponse<NguoiDungDto>> LayDanhSachAdminAsync(
        int page = 1,
        int pageSize = 10,
        LocNguoiDungFilter? filter = null,
        CancellationToken ct = default);

    Task<NguoiDungDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default);
    Task<NguoiDungChiTietDto?> LayChiTietAdminFullAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoNguoiDungAdminDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAdminAsync(int id, CapNhatNguoiDungAdminDto dto, CancellationToken ct = default);
    Task<bool> CapNhatVaiTroAsync(int id, string vaiTro, CancellationToken ct = default);
    Task<bool> KhoaTaiKhoanAsync(int id, bool khoa, string? lyDo = null, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
    Task<int> KhoaNhieuAsync(List<int> ids, string lyDo, CancellationToken ct = default);
    Task<int> MoKhoaNhieuAsync(List<int> ids, CancellationToken ct = default);
    Task<bool> GuiEmailResetMatKhauAsync(string email, CancellationToken ct = default);
    Task<PagedResponse<LichSuDangNhapDto>> LayLichSuDangNhapAsync(int nguoiDungId, int page, int pageSize, CancellationToken ct = default);

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
