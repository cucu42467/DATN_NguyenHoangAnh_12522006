using System;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblPromptTemplate
{
    [Key]
    public int PromptId { get; set; }

    public string TenPrompt { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    public string? LoaiPrompt { get; set; }

    public sbyte? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }
}
