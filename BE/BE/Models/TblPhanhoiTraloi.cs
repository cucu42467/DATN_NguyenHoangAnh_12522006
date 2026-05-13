using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblPhanhoiTraloi
{
    [Key]
    public int TraLoiId { get; set; }

    public int PhanHoiId { get; set; }

    public int NguoiGuiId { get; set; }

    public string NoiDung { get; set; } = null!;

    public DateTime? NgayGui { get; set; }

    public bool DaDoc { get; set; } = false; // 0=Chưa đọc, 1=Đã đọc

    [ForeignKey("NguoiGuiId")]
    public virtual TblNguoidung NguoiGui { get; set; } = null!;

    [ForeignKey("PhanHoiId")]
    public virtual TblPhanhoi PhanHoi { get; set; } = null!;
}
