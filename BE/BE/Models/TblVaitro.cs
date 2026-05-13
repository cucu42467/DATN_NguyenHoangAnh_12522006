using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblVaitro
{
    [Key]
    public int VaiTroId { get; set; }

    public string TenVaiTro { get; set; } = null!;

    public virtual ICollection<TblNguoidungVaitro> TblNguoidungVaitros { get; set; } = new List<TblNguoidungVaitro>();
}
