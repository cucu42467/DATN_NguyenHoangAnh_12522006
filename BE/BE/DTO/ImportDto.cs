using System.ComponentModel.DataAnnotations;

namespace DTO;

public class ImportFileDto
{
    public int ImportId { get; set; }
    public int TaiKhoanId { get; set; }
    public string? TenFile { get; set; }
    public DateTime? NgayImport { get; set; }
    public int TongDong { get; set; }
    public int SoDongThanhCong { get; set; }
    public int SoDongLoi { get; set; }
    public sbyte TrangThai { get; set; }
}

public class TaoImportPhanHoiDto
{
    public int ImportId { get; set; }
    public sbyte TrangThai { get; set; }
}

public class ImportChiTietDto
{
    public int Id { get; set; }
    public int ImportId { get; set; }
    public DateTime? NgayGiaoDich { get; set; }
    public string? MoTa { get; set; }
    public decimal? SoTien { get; set; }
    public int? DanhMucGoiY { get; set; }
    public float? DoTinCay { get; set; }
    public sbyte TrangThaiXuLy { get; set; }
    public string? GhiChuLoi { get; set; }
    public DateTime? CapNhatLuc { get; set; }
}

public class LocImportChiTietDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public sbyte? TrangThaiXuLy { get; set; }
}

