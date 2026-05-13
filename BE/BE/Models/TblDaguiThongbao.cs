using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_da_gui_thongbao")]
public class TblDaguiThongbao
{
    [Key]
    [Column("DaGuiId")]
    public int DaGuiId { get; set; }

    [Column("NguoiDungId")]
    public int NguoiDungId { get; set; }

    [Column("LoaiThongBao")]
    [MaxLength(50)]
    public string LoaiThongBao { get; set; } = string.Empty;
    // so_du_thap, nhac_lich, vuot_ngan_sach, muc_tieu

    [Column("ThamChieuId")]
    public int? ThamChieuId { get; set; }
    // ID của đối tượng liên quan (TaiKhoanId, LichId, etc)

    [Column("ThoiGianGui")]
    public DateTime ThoiGianGui { get; set; } = DateTime.Now;

    [Column("DaDoc")]
    public bool DaDoc { get; set; } = false;
}

/// <summary>
/// Các loại thông báo tự động
/// </summary>
public static class LoaiThongBaoTuDong
{
    public const string SoDuThap = "so_du_thap";
    public const string NhacLich = "nhac_lich";
    public const string VuotNganSach = "vuot_ngan_sach";
    public const string MucTieu = "muc_tieu";
}
