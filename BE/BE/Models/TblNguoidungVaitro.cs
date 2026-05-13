using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblNguoidungVaitro
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public int VaiTroId { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual TblVaitro VaiTro { get; set; } = null!;
}
