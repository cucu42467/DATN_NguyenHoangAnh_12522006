using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblQuyen
{
    [Key]
    public int QuyenId { get; set; }

    public string TenQuyen { get; set; } = null!;

    public string? MoTa { get; set; }

    public virtual ICollection<TblVaitroQuyen> TblVaitroQuyens { get; set; } = new List<TblVaitroQuyen>();
}
