using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblCauhinhHethong
{
    [Key]
    public int CauHinhId { get; set; }

    public string TenThamSo { get; set; } = null!;

    public string GiaTri { get; set; } = null!;

    public string? MoTa { get; set; }

    public string? KieuDuLieu { get; set; }
}
