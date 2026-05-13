namespace DTO;

public class PhanHoiDangNhapDto
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public DateTime HetHanAccessUtc { get; set; }

    public DateTime HetHanRefreshUtc { get; set; }

    public NguoiDungTomTatDto NguoiDung { get; set; } = null!;
}
