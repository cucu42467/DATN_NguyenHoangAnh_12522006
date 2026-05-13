using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblNguoidungSocial
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public string Provider { get; set; } = null!;

    public string ProviderId { get; set; } = null!;

    public string? EmailSocial { get; set; }

    public DateTime? NgayLienKet { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
