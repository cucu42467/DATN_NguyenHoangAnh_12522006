namespace DTO;

public class LocNguoiDungFilter
{
    public string? Search { get; set; }
    public string? VaiTro { get; set; }
    public string? TrangThai { get; set; }
    public string? PhuongThucDangNhap { get; set; }
    public string? TuNgay { get; set; }
    public string? DenNgay { get; set; }
    public string? SortBy { get; set; }
    public string? SortDir { get; set; }
}

public class TaoNguoiDungAdminDto
{
    public string HoTen { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string MatKhau { get; set; } = null!;
    public int VaiTroId { get; set; }
    public sbyte TrangThai { get; set; } = 1;
}

public class CapNhatNguoiDungAdminDto
{
    public string? HoTen { get; set; }
    public string? SoDienThoai { get; set; }
    public int? VaiTroId { get; set; }
    public sbyte? TrangThai { get; set; }
}

public class CapNhatVaiTroDto
{
    public string VaiTro { get; set; } = null!;
}

public class KhoaTaiKhoanDto
{
    public string LyDo { get; set; } = null!;
}

public class KhoaNhieuDto
{
    public List<int> Ids { get; set; } = new();
    public string LyDo { get; set; } = null!;
}

public class ResetMatKhauDto
{
    public string Email { get; set; } = null!;
}
