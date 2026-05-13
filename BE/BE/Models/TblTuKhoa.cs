using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTuKhoa
{
    [Key]
    public int TuKhoaId { get; set; }

    public int? NguoiDungId { get; set; }

    public string TuKhoa { get; set; } = null!;

    public int DanhMucId { get; set; }

    public int? DoUuTien { get; set; }

    public virtual TblDanhmuc DanhMuc { get; set; } = null!;

    public virtual TblNguoidung? NguoiDung { get; set; }
}
