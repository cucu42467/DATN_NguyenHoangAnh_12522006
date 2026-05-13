using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblAuditLog
{
    [Key]
    public int Id { get; set; }

    public int? NguoiDungId { get; set; }

    public string TenBang { get; set; } = null!;

    public int? BanGhiId { get; set; }

    public string HanhDong { get; set; } = null!;

    public string? DuLieuCu { get; set; }

    public string? DuLieuMoi { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? IpAddress { get; set; }
}
