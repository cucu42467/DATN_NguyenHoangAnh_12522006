using System.ComponentModel.DataAnnotations;

namespace DTO;

public class YeuCauDangNhapDto
{
    /// <summary>
    /// Email hoac so dien thoai.
    /// </summary>
    [Required(ErrorMessage = "Ten dang nhap bat buoc.")]
    public string TenDangNhap { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mat khau bat buoc.")]
    public string MatKhau { get; set; } = string.Empty;

    public bool GhiNho { get; set; }

    public string? HeDieuHanh { get; set; }
    public string? ViTri { get; set; }
}
