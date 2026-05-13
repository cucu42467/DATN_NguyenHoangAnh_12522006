namespace DTO;

public class LoaiTaiKhoanDto
{
    public int LoaiTaiKhoanId { get; set; }
    public string TenLoai { get; set; } = null!;
}

public class TaoLoaiTaiKhoanDto
{
    public string TenLoai { get; set; } = null!;
}
