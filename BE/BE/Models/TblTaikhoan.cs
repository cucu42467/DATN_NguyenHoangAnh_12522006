using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblTaikhoan
{
    [Key]
    public int TaiKhoanId { get; set; }

    public int NguoiDungId { get; set; }

    public int LoaiTaiKhoanId { get; set; }

    public string TenTaiKhoan { get; set; } = null!;

    public decimal? SoDu { get; set; }

    public decimal? SoDuBanDau { get; set; }

    public string? TienTe { get; set; }

    public string? MauSac { get; set; }

    public string? Icon { get; set; }

    public DateTime? NgayTao { get; set; }

    public sbyte? TrangThai { get; set; }

    public string? TenNganHang { get; set; }

    public string? SoTaiKhoan { get; set; }

    public decimal? HanMucTinDung { get; set; }

    public string? MoTa { get; set; }          // ← THÊM MỚI: mô tả tài khoản
    public bool LaMacDinh { get; set; }        // ← THÊM MỚI: tài khoản mặc định

    public DateTime? NgayCapNhatSoDu { get; set; }

    public virtual TblLoaiTaikhoan LoaiTaiKhoan { get; set; } = null!;

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual ICollection<TblGiaodichDinhky> TblGiaodichDinhkies { get; set; } = new List<TblGiaodichDinhky>();

    public virtual ICollection<TblGiaodich> TblGiaodichTaiKhoanDiches { get; set; } = new List<TblGiaodich>();

    public virtual ICollection<TblGiaodich> TblGiaodichTaiKhoans { get; set; } = new List<TblGiaodich>();

    public virtual ICollection<TblImportFile> TblImportFiles { get; set; } = new List<TblImportFile>();

    public virtual ICollection<TblMuctieu> TblMuctieus { get; set; } = new List<TblMuctieu>();
}
