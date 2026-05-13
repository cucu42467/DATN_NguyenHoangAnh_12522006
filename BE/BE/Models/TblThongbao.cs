using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_thongbao")]
public class TblThongbao
{
    [Key]
    [Column("ThongBaoId")]
    public int ThongBaoId { get; set; }

    [Column("NguoiDungId")]
    public int NguoiDungId { get; set; }

    [Column("TieuDe")]
    [MaxLength(255)]
    public string TieuDe { get; set; } = string.Empty;

    [Column("NoiDung")]
    [MaxLength(1000)]
    public string? NoiDung { get; set; }

    [Column("LoaiThongBao")]
    public int LoaiThongBao { get; set; } = 1;
    // 1: Hệ thống, 2: Cảnh báo, 3: Nhắc nhở, 4: Thành công

    [Column("LoaiDoiTuong")]
    [MaxLength(50)]
    public string? LoaiDoiTuong { get; set; }
    // giaodich, ngansach, muctieu, taikhoan, lich

    [Column("DoiTuongId")]
    public int? DoiTuongId { get; set; }

    [Column("DuongDanDieuHuong")]
    [MaxLength(500)]
    public string? DuongDanDieuHuong { get; set; }

    [Column("NgayTao")]
    public DateTime NgayTao { get; set; } = DateTime.Now;

    [Column("DaDoc")]
    public int DaDoc { get; set; } = 0;

    [Column("NgayHetHan")]
    public DateTime? NgayHetHan { get; set; }

    // Navigation
    [ForeignKey("NguoiDungId")]
    public virtual TblNguoidung? NguoiDung { get; set; }
}

/// <summary>
/// Enum loại thông báo
/// </summary>
public enum LoaiThongBaoEnum
{
    HeThong = 1,
    CanhBao = 2,
    NhacNho = 3,
    ThanhCong = 4
}

/// <summary>
/// Enum loại đối tượng liên quan
/// </summary>
public enum LoaiDoiTuongThongBao
{
    GiaoDich = 1,
    NganSach = 2,
    MucTieu = 3,
    TaiKhoan = 4,
    Lich = 5
}
