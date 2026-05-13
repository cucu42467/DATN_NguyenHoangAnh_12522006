using System.ComponentModel.DataAnnotations;

namespace DTO;

public class YeuCauGuiOtpDto
{
    [Required(ErrorMessage = "Email bat buoc.")]
    [EmailAddress(ErrorMessage = "Email khong hop le.")]
    public string Email { get; set; } = string.Empty;
}

public class YeuCauXacThucOtpDto
{
    [Required(ErrorMessage = "Email bat buoc.")]
    [EmailAddress(ErrorMessage = "Email khong hop le.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Ma OTP bat buoc.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Ma OTP phai co 6 ky tu.")]
    public string Otp { get; set; } = string.Empty;
}

public class YeuCauDatLaiMatKhauDto
{
    [Required(ErrorMessage = "Email bat buoc.")]
    [EmailAddress(ErrorMessage = "Email khong hop le.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Token reset bat buoc.")]
    public string ResetToken { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mat khau moi bat buoc.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Mat khau phai tu 6 den 100 ky tu.")]
    public string MatKhauMoi { get; set; } = string.Empty;

    [Required(ErrorMessage = "Xac nhan mat khau moi bat buoc.")]
    [Compare("MatKhauMoi", ErrorMessage = "Mat khau moi khong khop.")]
    public string XacNhanMatKhauMoi { get; set; } = string.Empty;
}

public class PhanHoiGuiOtpDto
{
    public bool ThanhCong { get; set; }
    public string? ThongDiep { get; set; }
    public string? OtpId { get; set; }
}

public class PhanHoiXacThucOtpDto
{
    public bool ThanhCong { get; set; }
    public string? ThongDiep { get; set; }
    public string? ResetToken { get; set; }
}

public class PhanHoiDatLaiMatKhauDto
{
    public bool ThanhCong { get; set; }
    public string? ThongDiep { get; set; }
}
