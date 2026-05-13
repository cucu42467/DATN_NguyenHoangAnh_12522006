namespace DTO;

public class TuKhoaDto
{
    public int TuKhoaId { get; set; }
    public int? NguoiDungId { get; set; }
    public string TuKhoa { get; set; } = null!;
    public int DanhMucId { get; set; }
    public string? TenDanhMuc { get; set; }
    public int? DoUuTien { get; set; }
}

public class TaoTuKhoaDto
{
    public string TuKhoa { get; set; } = null!;
    public int DanhMucId { get; set; }
    public int? DoUuTien { get; set; }
}
