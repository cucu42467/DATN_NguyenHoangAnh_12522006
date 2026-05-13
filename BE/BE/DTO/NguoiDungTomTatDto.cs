namespace DTO;

public class NguoiDungTomTatDto
{
    public int NguoiDungId { get; set; }

    public string HoTen { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }

    public string? AnhDaiDien { get; set; }

    public IReadOnlyList<string> VaiTro { get; set; } = Array.Empty<string>();
}
