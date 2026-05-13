using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTepDinhkem
{
    [Key]
    public int TepId { get; set; }

    public string TenFile { get; set; } = null!;

    public string DuongDan { get; set; } = null!;

    public string? LoaiFile { get; set; }

    public int? KichThuoc { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<TblGiaodichTep> TblGiaodichTeps { get; set; } = new List<TblGiaodichTep>();
}
