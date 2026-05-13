using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblThongbaoHeThong
{
    [Key]
    public int ThongBaoHeThongId { get; set; }

    public string TieuDe { get; set; } = null!;

    public string? NoiDung { get; set; }

    public string? Loai { get; set; }

    public int? NguoiTao { get; set; }

    public DateTime? NgayGui { get; set; }

    public DateTime? NgayHetHan { get; set; }

    [ForeignKey("NguoiTao")]
    public virtual TblNguoidung? NguoiTaoNavigation { get; set; }
}
