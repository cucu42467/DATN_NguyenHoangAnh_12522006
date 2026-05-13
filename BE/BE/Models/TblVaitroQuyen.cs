using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblVaitroQuyen
{
    [Key]
    public int Id { get; set; }

    public int VaiTroId { get; set; }

    public int QuyenId { get; set; }

    [ForeignKey("VaiTroId")]
    public virtual TblVaitro VaiTro { get; set; } = null!;

    [ForeignKey("QuyenId")]
    public virtual TblQuyen Quyen { get; set; } = null!;
}
