// using Models; - ProjectReference
using System.ComponentModel.DataAnnotations;

namespace DTO;

public class DanhMucDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = null!;
    // ← THÊM MỚI: MoTa
    public string? MoTa { get; set; }
    public string? MauSac { get; set; } // #FF6B6B for CHI
    public string LoaiDanhMuc { get; set; } = null!; // "CHI", "THU"
    public int LoaiDanhMucId { get; set; } // 1=Thu nhập, 2=Chi tiêu
    public int? ChaId { get; set; } // Sub-category
    public string? Icon { get; set; }
    public bool LaHeThong { get; set; } // Admin only
    public int? CapDo { get; set; }
    public string? DuongDan { get; set; }
    public int ThuTu { get; set; } = 0; // Thứ tự hiển thị
}

public class TaoDanhMucDto
{
    [Required]
    public string TenDanhMuc { get; set; } = null!;
    public string? MoTa { get; set; }  // ← THÊM MỚI
    public string? MauSac { get; set; }
    [Required]
    public string LoaiDanhMuc { get; set; } = null!;
    public int LoaiDanhMucId { get; set; }
    public int? ChaId { get; set; }
    public string? Icon { get; set; }
    public int? CapDo { get; set; }
    public string? DuongDan { get; set; }
}

public class CapNhatThuTuDto
{
    [Required]
    public int ThuTu { get; set; }
}

