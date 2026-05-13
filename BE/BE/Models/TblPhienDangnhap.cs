using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblPhienDangnhap
{
    [Key]
    public int SessionId { get; set; }

    public int NguoiDungId { get; set; }

    public string RefreshToken { get; set; } = null!;

    public string? IpAddress { get; set; }

    public string? ThietBi { get; set; }

    public string? HeDieuHanh { get; set; }

    public DateTime? HetHan { get; set; }

    public sbyte? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    [ForeignKey("NguoiDungId")]
    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
