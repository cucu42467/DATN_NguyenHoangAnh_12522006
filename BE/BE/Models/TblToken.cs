using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblToken
{
    [Key]
    public int TokenId { get; set; }

    public int NguoiDungId { get; set; }

    public string? AccessToken { get; set; }

    public string? RefreshToken { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayHetHan { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
