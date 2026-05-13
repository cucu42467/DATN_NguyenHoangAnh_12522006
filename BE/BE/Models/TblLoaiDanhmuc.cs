using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblLoaiDanhmuc
{
    [Key]
    public int LoaiDanhMucId { get; set; }

    public string TenLoai { get; set; } = null!;

    public virtual ICollection<TblDanhmuc> TblDanhmucs { get; set; } = new List<TblDanhmuc>();
}
