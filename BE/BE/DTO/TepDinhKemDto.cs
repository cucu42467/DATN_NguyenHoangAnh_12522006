namespace DTO;

public class TepDinhKemDto
{
    public int TepId { get; set; }
    public string TenFile { get; set; } = null!;
    public string DuongDan { get; set; } = null!;
    public string? LoaiFile { get; set; }
    public int? KichThuoc { get; set; }
    public DateTime? NgayTao { get; set; }
}

public class TaoTepDinhKemDto
{
    public string TenFile { get; set; } = null!;
    public string DuongDan { get; set; } = null!;
    public string? LoaiFile { get; set; }
    public int? KichThuoc { get; set; }
}
