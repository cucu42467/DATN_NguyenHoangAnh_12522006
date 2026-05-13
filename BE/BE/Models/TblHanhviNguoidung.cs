using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblHanhviNguoidung
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public string HanhDong { get; set; } = null!;

    public string? DoiTuong { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? IpAddress { get; set; }

    public string? ChiTietThayDoi { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
