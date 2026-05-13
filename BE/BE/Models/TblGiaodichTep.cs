using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblGiaodichTep
{
    [Key]
    public int Id { get; set; }

    public int GiaoDichId { get; set; }

    public int TepId { get; set; }

    public virtual TblGiaodich GiaoDich { get; set; } = null!;

    public virtual TblTepDinhkem Tep { get; set; } = null!;
}
