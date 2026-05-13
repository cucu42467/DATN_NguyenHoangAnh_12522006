using System.ComponentModel.DataAnnotations;

namespace DTO;

public class YeuCauDangKyDto
{
    [Required(ErrorMessage = "Họ tên là bắt buộc")]
    [MinLength(2, ErrorMessage = "Họ tên phải từ 2 ký tự")]
    public string HoTen { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email là bắt buộc")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    [MinLength(10, ErrorMessage = "Số điện thoại phải từ 10 ký tự")]
    public string? SoDienThoai { get; set; }

    [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
    [MinLength(8, ErrorMessage = "Mật khẩu phải từ 8 ký tự")]
    public string MatKhau { get; set; } = string.Empty;

    [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
    [Compare(nameof(MatKhau), ErrorMessage = "Mật khẩu không trùng khớp")]
    public string XacNhanMatKhau { get; set; } = string.Empty;
}

