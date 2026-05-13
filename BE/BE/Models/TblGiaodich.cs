using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblGiaodich
{
    [Key]
    public int GiaoDichId { get; set; }

    [ForeignKey("NguoiDungId")]
    public int NguoiDungId { get; set; }

    [ForeignKey("TaiKhoanId")]
    public int TaiKhoanId { get; set; }

    [ForeignKey("TaiKhoanDichId")]
    public int? TaiKhoanDichId { get; set; }

    [ForeignKey("DanhMucId")]
    public int? DanhMucId { get; set; }

    public sbyte LoaiGiaoDich { get; set; }

    public decimal SoTien { get; set; }

    public string? TienTe { get; set; }

    public decimal? TyGiaQuyDoi { get; set; }

    public DateTime NgayGiaoDich { get; set; }

    public string? MoTa { get; set; }

    public sbyte? NguonDuLieu { get; set; }

    public ulong? LaTuDong { get; set; }

    public float? DoTinCay { get; set; }

    public int? ImportId { get; set; }

    public DateTime? NgayTao { get; set; }

    public sbyte? TrangThai { get; set; }

    public string? NguonTao { get; set; }

    public string? ViTri { get; set; }

    public string? MaGiaoDichNgoai { get; set; }

    public string? TenGiaoDich { get; set; }   // ← THÊM MỚI: tên giao dịch

    public virtual TblDanhmuc? DanhMuc { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual TblTaikhoan TaiKhoan { get; set; } = null!;

    public virtual TblTaikhoan? TaiKhoanDich { get; set; }

    public virtual ICollection<TblChitietGiaodich> TblChitietGiaodiches { get; set; } = new List<TblChitietGiaodich>();

    public virtual ICollection<TblGiaodichTep> TblGiaodichTeps { get; set; } = new List<TblGiaodichTep>();

    [ForeignKey("ImportId")]
    public virtual TblImportFile? Import { get; set; }
}
