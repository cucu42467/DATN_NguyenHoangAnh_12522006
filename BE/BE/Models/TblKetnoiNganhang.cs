using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblKetnoiNganhang
{
    [Key]
    public int KetNoiId { get; set; }

    public int NguoiDungId { get; set; }

    public string Provider { get; set; } = null!;

    public string? AccessToken { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? HetHan { get; set; }

    public sbyte? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    [ForeignKey("NguoiDungId")]
    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
