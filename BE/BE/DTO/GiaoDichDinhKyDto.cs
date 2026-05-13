using System.ComponentModel.DataAnnotations;

namespace DTO;

public class GiaoDichDinhKyDto
{
    public int DinhKyId { get; set; }
    public string TenKhoanDinhKy { get; set; } = null!;
    public decimal SoTien { get; set; }
    public string LoaiGiaoDich { get; set; } = null!; // "THU"|"CHI"
    public string TanSuat { get; set; } = null!; // HANG_NGAY|HANG_TUAN|HANG_THANG|HANG_NAM
    public DateTime NgayBatDau { get; set; }
    public DateTime? NgayKetThuc { get; set; }
    public bool TrangThai { get; set; }

    public int TaiKhoanId { get; set; }
    public int? DanhMucId { get; set; }

    // ← THÊM MỚI: 3 trường mới
    public string? MoTa { get; set; }
    public int SoLanDaThucHien { get; set; }
    public DateTime? LanThucHienCuoi { get; set; }
}

public class TaoGiaoDichDinhKyDto
{
    [Required]
    public string TenKhoanDinhKy { get; set; } = null!;

    [Required]
    public decimal SoTien { get; set; }

    [Required]
    public string LoaiGiaoDich { get; set; } = null!;

    [Required]
    public string TanSuat { get; set; } = null!;

    [Required]
    public DateTime NgayBatDau { get; set; }

    public DateTime? NgayKetThuc { get; set; }

    [Required]
    public int TaiKhoanId { get; set; }

    public int? DanhMucId { get; set; }

    public bool TrangThai { get; set; } = true;

    // ← THÊM MỚI: MoTa
    public string? MoTa { get; set; }
}

