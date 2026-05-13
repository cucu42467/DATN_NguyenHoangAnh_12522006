using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblLichsuDangnhap
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? IpAddress { get; set; }

    public string? ThietBi { get; set; }

    public sbyte? KetQua { get; set; }

    public string? HeDieuHanh { get; set; }

    public string? ViTri { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
