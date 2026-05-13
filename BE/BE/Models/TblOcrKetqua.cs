using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblOcrKetqua
{
    [Key]
    public int OcrId { get; set; }

    public int TepId { get; set; }

    public string? NoiDungOCR { get; set; }

    public string? JsonRaw { get; set; }

    public float? DoTinCay { get; set; }

    public DateTime? NgayXuLy { get; set; }

    [ForeignKey("TepId")]
    public virtual TblTepDinhkem Tep { get; set; } = null!;
}
