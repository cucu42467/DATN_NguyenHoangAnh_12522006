using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblDanhmuc
{
    [Key]
    public int DanhMucId { get; set; }

    public string TenDanhMuc { get; set; } = null!;

    public string? MoTa { get; set; }   // ← THÊM MỚI: mô tả danh mục

    public int LoaiDanhMucId { get; set; }

    public int? DanhMucChaId { get; set; }

    public int? NguoiDungId { get; set; }

    public string? Icon { get; set; }

    public string? MauSac { get; set; }

    public int? ThuTu { get; set; }

    public sbyte? TrangThai { get; set; }

    public sbyte? CapDo { get; set; }

    public string? DuongDan { get; set; }

    public ulong? DaXoa { get; set; }

    public virtual TblLoaiDanhmuc LoaiDanhMuc { get; set; } = null!;

    public virtual TblNguoidung? NguoiDung { get; set; }

    public virtual ICollection<TblChitietGiaodich> TblChitietGiaodiches { get; set; } = new List<TblChitietGiaodich>();

    public virtual ICollection<TblGiaodichDinhky> TblGiaodichDinhkies { get; set; } = new List<TblGiaodichDinhky>();

    public virtual ICollection<TblGiaodich> TblGiaodiches { get; set; } = new List<TblGiaodich>();

    public virtual ICollection<TblImportChitiet> TblImportChitiets { get; set; } = new List<TblImportChitiet>();

    public virtual ICollection<TblNgansach> TblNgansaches { get; set; } = new List<TblNgansach>();

    public virtual ICollection<TblTonghopDanhmuc> TblTonghopDanhmucs { get; set; } = new List<TblTonghopDanhmuc>();

    public virtual ICollection<TblTuKhoa> TblTuKhoas { get; set; } = new List<TblTuKhoa>();
}
