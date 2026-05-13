namespace DTO;

public class LichSuDangNhapDto
{
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public string? HoTen { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? IpAddress { get; set; }

    public string? ThietBi { get; set; }

    public string? HeDieuHanh { get; set; }

    public string? ViTri { get; set; }

    public bool ThanhCong { get; set; }
}