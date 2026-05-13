using System.ComponentModel.DataAnnotations;

namespace DTO;

public class NganSachDto
{
    public int NganSachId { get; set; }
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = null!;
    public decimal HanMuc { get; set; }
    public decimal DaDung { get; set; }
    public int Thang { get; set; }
    public int Nam { get; set; }
    public string? Icon { get; set; }
    public string? MauSac { get; set; }
    // ← THÊM MỚI: GhiChu, CanhBaoPhanTram
    public string? GhiChu { get; set; }
    public float CanhBaoPhanTram { get; set; } = 80f;
}

public class ThietLapNganSachDto
{
    [Required]
    public int DanhMucId { get; set; }

    [Required]
    public decimal HanMuc { get; set; }

    [Required]
    [Range(1, 12)]
    public int Thang { get; set; }

    [Required]
    public int Nam { get; set; }
}

public class CapNhatHanMucDto
{
    [Required]
    [Range(0, (double)decimal.MaxValue)]
    public decimal HanMuc { get; set; }
}

