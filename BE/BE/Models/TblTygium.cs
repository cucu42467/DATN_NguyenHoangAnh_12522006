using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTygium
{
    [Key]
    public int TyGiaId { get; set; }

    public string TuTienTe { get; set; } = null!;

    public string SangTienTe { get; set; } = null!;

    public decimal TyGia { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
