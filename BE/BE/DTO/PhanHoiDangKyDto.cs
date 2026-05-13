using System.Text.Json.Serialization;

namespace DTO;

public class PhanHoiDangKyDto
{
    public bool ThanhCong { get; set; }
    
    public string? ThongDiep { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PhanHoiDangNhapDto? PhienDangNhap { get; set; } // Auto-login sau đăng ký
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NguoiDungTomTatDto? NguoiDung { get; set; }
}

