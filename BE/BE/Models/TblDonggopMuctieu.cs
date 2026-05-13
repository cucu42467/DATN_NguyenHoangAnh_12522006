using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblDonggopMuctieu
{
    [Key]
    public int Id { get; set; }

    public int MucTieuId { get; set; }

    public decimal SoTien { get; set; }

    public DateTime? NgayDongGop { get; set; }

    public string? GhiChu { get; set; }

    public virtual TblMuctieu MucTieu { get; set; } = null!;
}
