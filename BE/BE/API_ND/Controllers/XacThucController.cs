using System.Net;
using BLL;
using DTO;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[ApiController]
[Route("api/xacthuc")]
public class XacThucController : ControllerBase
{
    private readonly IXacThucBll _xacThucBll;

    public XacThucController(IXacThucBll xacThucBll)
    {
        _xacThucBll = xacThucBll;
    }

    /// <summary>
    /// Dang nhap bang email/so dien thoai va mat khau.
    /// </summary>
    [HttpPost("dang-nhap")]
    [ProducesResponseType(typeof(PhanHoiDangNhapDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> DangNhap(
        [FromBody] YeuCauDangNhapDto yeuCau,
        CancellationToken huyBo)
    {
        var ip = LayDiaChiIp();
        var thietBi = Request.Headers.UserAgent.ToString();

        var (thanhCong, thongDiep, duLieu) =
            await _xacThucBll.DangNhapAsync(
                yeuCau,
                ip,
                string.IsNullOrEmpty(thietBi) ? null : thietBi,
                yeuCau.HeDieuHanh,
                yeuCau.ViTri,
                huyBo);

        if (!thanhCong)
            return Unauthorized(new { thongDiep });

        return Ok(duLieu);
    }

    /// <summary>
    /// Đăng ký tài khoản mới
    /// </summary>
    [HttpPost("dang-ky")]
    [ProducesResponseType(typeof(PhanHoiDangKyDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    public async Task<IActionResult> DangKy(
        [FromBody] YeuCauDangKyDto yeuCau,
        CancellationToken huyBo)
    {
        var ip = LayDiaChiIp();
        var thietBi = Request.Headers.UserAgent.ToString();
        var (thanhCong, thongDiep, duLieu) =
    await _xacThucBll.DangKyAsync(
        yeuCau,
        ip,
        string.IsNullOrEmpty(thietBi) ? null : thietBi,
        huyBo: huyBo);

        if (!thanhCong)
            return BadRequest(new { thongDiep });

        return Ok(duLieu);
    }

    /// <summary>
    /// Dang nhap bang Google/Facebook id_token (theo luong frontend SDK).
    /// </summary>
    [HttpPost("dang-nhap-mang-xa-hoi")]
    [ProducesResponseType(typeof(PhanHoiDangNhapDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.BadRequest)]
    [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
    public async Task<IActionResult> DangNhapMangXaHoi(
        [FromBody] YeuCauDangNhapMangXaHoiDto yeuCau,
        CancellationToken huyBo)
    {
        var ip = LayDiaChiIp();
        var thietBi = Request.Headers.UserAgent.ToString();
        var (thanhCong, thongDiep, duLieu) =
    await _xacThucBll.DangNhapMangXaHoiAsync(
        yeuCau,
        ip,
        string.IsNullOrEmpty(thietBi) ? null : thietBi,
        huyBo: huyBo);

        if (!thanhCong)
        {
            if (thongDiep?.Contains("khong hop le", StringComparison.OrdinalIgnoreCase) == true)
                return BadRequest(new { thongDiep });
            return Unauthorized(new { thongDiep });
        }

        return Ok(duLieu);
    }

    /// <summary>
    /// Làm mới token bằng refresh token
    /// </summary>
    [HttpPost("lam-moi-token")]
    [ProducesResponseType(typeof(PhanHoiDangNhapDto), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> LamMoiToken([FromBody] YeuCauLamMoiTokenDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep, duLieu) = await _xacThucBll.LamMoiTokenAsync(yeuCau.RefreshToken, huyBo);
        if (!thanhCong)
            return Unauthorized(new { thongDiep });

        return Ok(duLieu);
    }

    /// <summary>
    /// Đăng xuất (revoke refresh token)
    /// </summary>
    [HttpPost("dang-xuat")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> DangXuat([FromBody] YeuCauDangXuatDto yeuCau, CancellationToken huyBo)
    {
        await _xacThucBll.DangXuatAsync(yeuCau.RefreshToken, huyBo);
        return NoContent();
    }

    /// <summary>
    /// Gui OTP reset qua email (version moi - tra ve phienOtpId)
    /// </summary>
    [HttpPost("gui-otp")]
    [ProducesResponseType(typeof(PhanHoiGuiOtpDto), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> GuiOtp([FromBody] YeuCauGuiOtpDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep) = await _xacThucBll.GuiOtpEmailAsync(yeuCau.Email, huyBo);
        if (!thanhCong)
            return BadRequest(new { thongDiep });

        return Ok(new PhanHoiGuiOtpDto
        {
            ThanhCong = true,
            ThongDiep = thongDiep
        });
    }

    /// <summary>
    /// Gửi OTP reset qua email
    /// </summary>
    [HttpPost("quen-mat-khau/email")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<IActionResult> QuenMatKhauEmail([FromBody] YeuCauQuenMatKhauDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep) = await _xacThucBll.QuenMatKhauEmailAsync(yeuCau.Email, huyBo);
        if (!thanhCong)
            return BadRequest(new { thongDiep });

        return Ok(new { thongDiep = "Da gui email reset neu tai khoan ton tai" });
    }

    /// <summary>
    /// Gửi OTP reset qua SĐT
    /// </summary>
    [HttpPost("quen-mat-khau/sdt")]
    [ProducesResponseType((int)HttpStatusCode.OK)]
    public async Task<IActionResult> QuenMatKhauSdt([FromBody] YeuCauQuenMatKhauDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep, phienId) = await _xacThucBll.QuenMatKhauSdtAsync(yeuCau.SoDienThoai ?? "", huyBo);
        if (!thanhCong)
            return BadRequest(new { thongDiep });

        return Ok(new { phienOtpId = phienId, thongDiep = "Da gui OTP" });
    }

    /// <summary>
    /// Xác thực OTP (version moi - su dung email thay vi phienOtpId)
    /// </summary>
    [HttpPost("xac-thuc-otp")]
    [ProducesResponseType(typeof(PhanHoiXacThucOtpDto), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> XacThucOtp([FromBody] YeuCauXacThucOtpDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep, resetToken) = await _xacThucBll.XacThucOtpAsync(yeuCau.Email, yeuCau.Otp, huyBo);
        if (!thanhCong)
            return BadRequest(new { thongDiep });

        return Ok(new PhanHoiXacThucOtpDto
        {
            ThanhCong = true,
            ThongDiep = thongDiep,
            ResetToken = resetToken
        });
    }

    /// <summary>
    /// Đặt lại mật khẩu (version moi - yeu cau email)
    /// </summary>
    [HttpPost("dat-lai-mat-khau")]
    [ProducesResponseType(typeof(PhanHoiDatLaiMatKhauDto), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> DatLaiMatKhau([FromBody] YeuCauDatLaiMatKhauDto yeuCau, CancellationToken huyBo)
    {
        var (thanhCong, thongDiep) = await _xacThucBll.DatLaiMatKhauAsync(yeuCau.Email, yeuCau.ResetToken, yeuCau.MatKhauMoi, huyBo);
        if (!thanhCong)
            return BadRequest(new PhanHoiDatLaiMatKhauDto { ThanhCong = false, ThongDiep = thongDiep });

        return Ok(new PhanHoiDatLaiMatKhauDto { ThanhCong = true, ThongDiep = thongDiep });
    }

    private string? LayDiaChiIp()
    {
        var fwd = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(fwd))
            return fwd.Split(',')[0].Trim();

        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}

public class YeuCauLamMoiTokenDto
{
    public string RefreshToken { get; set; } = null!;
}

public class YeuCauDangXuatDto
{
    public string RefreshToken { get; set; } = null!;
}

public class YeuCauQuenMatKhauDto
{
    public string Email { get; set; } = null!;
    public string? SoDienThoai { get; set; }
}

public class YeuCauXacThucOtpDto
{
    public string Email { get; set; } = null!;
    public string Otp { get; set; } = null!;
}

public class YeuCauDatLaiMatKhauDto
{
    public string Email { get; set; } = null!;
    public string ResetToken { get; set; } = null!;
    public string MatKhauMoi { get; set; } = null!;
    public string XacNhanMatKhauMoi { get; set; } = null!;
}

