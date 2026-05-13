using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblCaidat
{
    [Key]
    public int CaiDatId { get; set; }

    public int NguoiDungId { get; set; }

    public string? NgonNgu { get; set; }

    public string? TienTe { get; set; }

    public ulong? CheDoToi { get; set; }

    public string? DinhDangNgay { get; set; }

    public ulong? NhanThongBao { get; set; }

    public string? ThongBaoJson { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
