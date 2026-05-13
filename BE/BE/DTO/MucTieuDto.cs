using System.ComponentModel.DataAnnotations;

namespace DTO;

public class MucTieuDto
{
    public int MucTieuId { get; set; }
    public int NguoiDungId { get; set; }
    public string TenMucTieu { get; set; } = null!;
    // ← THÊM MỚI: MoTa, UuTien
    public string? MoTa { get; set; }
    public byte UuTien { get; set; } = 2;   // 1=Cao, 2=Trung bình, 3=Thấp
    public decimal SoTienMucTieu { get; set; }
    public decimal SoTienHienTai { get; set; }
    public decimal SoTienDaDat { get; set; }
    public double PhanTramHoanThanh { get; set; }
    public DateTime? NgayBatDau { get; set; }
    public DateTime? NgayKetThuc { get; set; }
    public string? Icon { get; set; }
    public string? MauSac { get; set; }
    public int? TaiKhoanId { get; set; }
    public sbyte? TrangThai { get; set; }
    public string? Anh { get; set; }
}

public class TaoMucTieuDto
{
    [Required]
    public string TenMucTieu { get; set; } = null!;

    [Required]
    public decimal SoTienMucTieu { get; set; }
    // ← THÊM MỚI: MoTa, UuTien
    public string? MoTa { get; set; }
    public byte? UuTien { get; set; }  // 1=Cao, 2=Trung bình, 3=Thấp

    public decimal? SoTienHienTai { get; set; }
    public DateTime? NgayBatDau { get; set; }
    public DateTime? NgayKetThuc { get; set; }
    public string? Icon { get; set; }
    public string? MauSac { get; set; }
    public int? TaiKhoanId { get; set; }
    public sbyte? TrangThai { get; set; }
    public string? Anh { get; set; }
}

public class DongGopMucTieuDto
{
    public int Id { get; set; }
    public int MucTieuId { get; set; }
    public decimal SoTien { get; set; }
    public DateTime? NgayDongGop { get; set; }
    public string? GhiChu { get; set; }
    public int? TaiKhoanId { get; set; }
}

public class TaoDongGopMucTieuDto
{
    [Required]
    public decimal SoTien { get; set; }

    public DateTime? NgayDongGop { get; set; }
    public string? GhiChu { get; set; }
}

