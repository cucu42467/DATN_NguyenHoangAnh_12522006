using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_nhacnho")]
public class TblNhacnho
{
    [Key]
    [Column("NhacNhoId")]
    public int NhacNhoId { get; set; }

    [Column("NguoiDungId")]
    public int NguoiDungId { get; set; }

    [Column("TieuDe")]
    [MaxLength(255)]
    public string? TieuDe { get; set; }

    [Column("NoiDung")]
    [MaxLength(500)]
    public string? NoiDung { get; set; }

    [Column("NgayNhac")]
    public DateTime? NgayNhac { get; set; }

    [Column("LapLai")]
    public int LapLai { get; set; } = 0;

    [Column("TrangThai")]
    public int TrangThai { get; set; } = 1;

    [ForeignKey("NguoiDungId")]
    public virtual TblNguoidung? NguoiDung { get; set; }

    public string? ChuKy { get; set; }           // none/daily/weekly/monthly/yearly
    public DateTime? LanNhacCuoi { get; set; }
    public DateTime? LanNhacTiep { get; set; }
}

public enum LoaiLapLai
{
    KhongLap = 0,
    HangNgay = 1,
    HangTuan = 2,
    HangThang = 3,
    HangNam = 4
}
