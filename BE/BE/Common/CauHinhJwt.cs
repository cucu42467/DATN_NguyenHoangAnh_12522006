namespace Common;

/// <summary>
/// Cau hinh ky JWT doc tu appsettings (muc Jwt).
/// </summary>
public class CauHinhJwt
{
    public string KhoaBiMat { get; set; } = string.Empty;

    public string PhatHanh { get; set; } = "API_ND";

    public string KhanGia { get; set; } = string.Empty;

    public int ThoiGianHetHanPhut { get; set; } = 60;

    public int ThoiGianHetHanRefreshNgay { get; set; } = 7;
}
