using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblCanhbao
{
    [Key]
    public int CanhBaoId { get; set; }

    public int NguoiDungId { get; set; }

    public sbyte? LoaiCanhBao { get; set; }

    public string NoiDung { get; set; } = null!;

    public DateTime? NgayTao { get; set; }

    public ulong? DaDoc { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
