using System;
using System.ComponentModel.DataAnnotations;

namespace DTO;

public class NguoiDungMeDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
    public DateTime? NgayTao { get; set; }
    public sbyte? TrangThai { get; set; }
    public sbyte? EmailDaXacThuc { get; set; }
    public sbyte? SoDienThoaiDaXacThuc { get; set; }
    public sbyte? Dang2FA { get; set; }
    public DateTime? LanDangNhapCuoi { get; set; }
    public sbyte? DaXoa { get; set; }
}

public class CapNhatNguoiDungMeDto
{
    [Required]
    public string HoTen { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
}

