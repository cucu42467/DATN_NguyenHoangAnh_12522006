using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTheodoiNgansach
{
    [Key]
    public int Id { get; set; }

    public int NganSachId { get; set; }

    public decimal? SoTienDaChi { get; set; }

    public float? PhanTramDaDung { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual TblNgansach NganSach { get; set; } = null!;
}
