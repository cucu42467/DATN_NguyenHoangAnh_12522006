namespace DTO;

public class NhacNhoDto
{
    public int NhacNhoId { get; set; }
    public int NguoiDungId { get; set; }
    public string? TieuDe { get; set; }
    public string? NoiDung { get; set; }
    public DateTime? NgayNhac { get; set; }
    public int? LapLai { get; set; }
    public int TrangThai { get; set; }
    // ← THÊM MỚI: 3 field cho chu kỳ nhắc nhở
    public string? ChuKy { get; set; }              // none/daily/weekly/monthly/yearly
    public DateTime? LanNhacCuoi { get; set; }
    public DateTime? LanNhacTiep { get; set; }
}

public class TaoNhacNhoDto
{
    public string? TieuDe { get; set; }
    public string? NoiDung { get; set; }
    public DateTime? NgayNhac { get; set; }
    public int? LapLai { get; set; }
    // ← THÊM MỚI: 3 field cho chu kỳ
    public string? ChuKy { get; set; }              // none/daily/weekly/monthly/yearly
    public DateTime? LanNhacTiep { get; set; }
    public DateTime? LanNhacCuoi { get; set; }
}

public class CapNhatTrangThaiNhacNhoDto
{
    public int TrangThai { get; set; }
}
