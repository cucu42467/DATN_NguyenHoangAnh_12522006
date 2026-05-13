using System;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblFeatureFlag
{
    [Key]
    public int FeatureId { get; set; }

    public string TenFeature { get; set; } = null!;

    public ulong? BatTat { get; set; }

    public string? MoTa { get; set; }
}
