using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTonghopThang
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public decimal? TongThu { get; set; }

    public decimal? TongChi { get; set; }

    public decimal? TietKiem { get; set; }

    public float? TyLeTietKiem { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
