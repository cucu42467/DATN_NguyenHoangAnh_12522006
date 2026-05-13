using DTO;
using Common;

namespace BLL;

public interface IXacThucBll
{
    Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> DangNhapAsync(
        YeuCauDangNhapDto yeuCau,
        string? diaChiIp,
        string? thietBi,
        string? heDieuHanh = null,
        string? viTri = null,
        CancellationToken huyBo = default);

    Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> DangNhapMangXaHoiAsync(
        YeuCauDangNhapMangXaHoiDto yeuCau,
        string? diaChiIp,
        string? thietBi,
        string? heDieuHanh = null,
        string? viTri = null,
        CancellationToken huyBo = default);

    Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangKyDto? DuLieu)> DangKyAsync(
        YeuCauDangKyDto yeuCau,
        string? diaChiIp,
        string? thietBi,
        string? heDieuHanh = null,
        string? viTri = null,
        CancellationToken huyBo = default);

    Task<bool> KhoaTaiKhoanAsync(int nguoiDungId, bool khoa, CancellationToken huyBo = default);

    Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> LamMoiTokenAsync(
        string refreshToken,
        CancellationToken ct = default);

    Task DangXuatAsync(string refreshToken, CancellationToken ct = default);

    Task<(bool ThanhCong, string? ThongDiep)> QuenMatKhauEmailAsync(
        string email,
        CancellationToken ct = default);

    Task<(bool ThanhCong, string? ThongDiep, string? phienId)> QuenMatKhauSdtAsync(
        string sdt,
        CancellationToken ct = default);

    Task<(bool ThanhCong, string? ThongDiep, string? resetToken)> XacThucOtpAsync(
        string email,
        string otp,
        CancellationToken ct = default);

    Task<(bool ThanhCong, string? ThongDiep)> DatLaiMatKhauAsync(
        string email,
        string resetToken,
        string matKhauMoi,
        CancellationToken ct = default);

    Task<(bool ThanhCong, string? ThongDiep)> GuiOtpEmailAsync(
        string email,
        CancellationToken ct = default);

    Task GuiEmailDatLaiMatKhauAsync(string email, CancellationToken ct = default);
}



