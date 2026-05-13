using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTonghopDanhmuc
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public int DanhMucId { get; set; }

    public decimal? TongTien { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual TblDanhmuc DanhMuc { get; set; } = null!;

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
