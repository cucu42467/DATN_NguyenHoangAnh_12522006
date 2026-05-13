using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblImportChitiet
{
    [Key]
    public int Id { get; set; }

    public int? GiaoDichId { get; set; }

    public int ImportId { get; set; }

    public DateTime? NgayGiaoDich { get; set; }

    public string? MoTa { get; set; }

    public decimal? SoTien { get; set; }

    public int? DanhMucGoiY { get; set; }

    public float? DoTinCay { get; set; }

    public sbyte? TrangThaiXuLy { get; set; }

    public string? GhiChuLoi { get; set; }

    public DateTime? CapNhatLuc { get; set; }

    public virtual TblDanhmuc? DanhMucGoiYNavigation { get; set; }

    public virtual TblImportFile Import { get; set; } = null!;
}
