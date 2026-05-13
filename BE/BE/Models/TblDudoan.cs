using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblDudoan
{
    [Key]
    public int DuDoanId { get; set; }

    public int NguoiDungId { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public decimal? DuDoanChiTieu { get; set; }

    public decimal? DuDoanThuNhap { get; set; }

    public float? DoChinhXac { get; set; }

    public DateTime? NgayDuDoan { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
