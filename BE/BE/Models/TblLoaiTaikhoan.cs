using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblLoaiTaikhoan
{
    [Key]
    public int LoaiTaiKhoanId { get; set; }

    public string TenLoai { get; set; } = null!;

    public virtual ICollection<TblTaikhoan> TblTaikhoans { get; set; } = new List<TblTaikhoan>();
}
