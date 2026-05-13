using System;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblAiModel
{
    [Key]
    public int ModelId { get; set; }

    public string TenModel { get; set; } = null!;

    public string? Provider { get; set; }

    public string? ApiUrl { get; set; }

    public string? ApiKey { get; set; }

    public sbyte? TrangThai { get; set; }

    public string? MucDich { get; set; }
    public DateTime? NgayTao { get; set; }
}
