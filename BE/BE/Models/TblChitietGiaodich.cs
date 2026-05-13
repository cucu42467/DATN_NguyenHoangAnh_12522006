using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblChitietGiaodich
{
    [Key]
    public int Id { get; set; }

    public int GiaoDichId { get; set; }

    public int DanhMucId { get; set; }

    public decimal SoTien { get; set; }

    public string? MoTa { get; set; }

    public virtual TblDanhmuc DanhMuc { get; set; } = null!;

    public virtual TblGiaodich GiaoDich { get; set; } = null!;
}
