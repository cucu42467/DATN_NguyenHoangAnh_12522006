using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

[Table("tbl_phanhoi")]
public class TblPhanhoi
{
    [Key]
    [Column("PhanHoiId")]
    public int PhanHoiId { get; set; }

    [Required]
    [Column("NguoiDungId")]
    public int NguoiDungId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("TieuDe")]
    public string TieuDe { get; set; } = string.Empty;

    [Required]
    [Column("NoiDung")]
    public string NoiDung { get; set; } = string.Empty;

    [Column("TrangThai")]
    public sbyte TrangThai { get; set; } = 0; // 0=Chờ xử lý, 1=Đang xử lý, 2=Đã giải quyết, 3=Từ chối

    [Column("NgayTao")]
    public DateTime NgayTao { get; set; } = DateTime.Now;

    // Navigation
    public TblNguoidung? NguoiDung { get; set; }
    public ICollection<TblPhanhoiTraloi> TblPhanhoiTralois { get; set; } = new List<TblPhanhoiTraloi>();
}
