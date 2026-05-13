using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblNguoidung
{
    [Key]
    public int NguoiDungId { get; set; }

    public string HoTen { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public string? MatKhau { get; set; }

    public string? AnhDaiDien { get; set; }

    public DateTime? NgayTao { get; set; }

    public sbyte? TrangThai { get; set; }

    public sbyte? EmailDaXacThuc { get; set; }

    public sbyte? SoDienThoaiDaXacThuc { get; set; }

    public sbyte? Dang2FA { get; set; }

    public DateTime? LanDangNhapCuoi { get; set; }

    public sbyte? DaXoa { get; set; }

    public virtual TblCaidat? TblCaidat { get; set; }

    public virtual ICollection<TblCanhbao> TblCanhbaos { get; set; } = new List<TblCanhbao>();

    public virtual ICollection<TblDanhmuc> TblDanhmucs { get; set; } = new List<TblDanhmuc>();

    public virtual ICollection<TblDudoan> TblDudoans { get; set; } = new List<TblDudoan>();

    public virtual ICollection<TblGiaodichDinhky> TblGiaodichDinhkies { get; set; } = new List<TblGiaodichDinhky>();

    public virtual ICollection<TblGiaodich> TblGiaodiches { get; set; } = new List<TblGiaodich>();

    public virtual ICollection<TblGoiyAi> TblGoiyAis { get; set; } = new List<TblGoiyAi>();

    public virtual ICollection<TblHanhviNguoidung> TblHanhviNguoidungs { get; set; } = new List<TblHanhviNguoidung>();

    public virtual ICollection<TblImportFile> TblImportFiles { get; set; } = new List<TblImportFile>();

    public virtual ICollection<TblLichsuDangnhap> TblLichsuDangnhaps { get; set; } = new List<TblLichsuDangnhap>();

    public virtual ICollection<TblMuctieu> TblMuctieus { get; set; } = new List<TblMuctieu>();

    public virtual ICollection<TblNgansach> TblNgansaches { get; set; } = new List<TblNgansach>();

    public virtual ICollection<TblNguoidungSocial> TblNguoidungSocials { get; set; } = new List<TblNguoidungSocial>();

    public virtual ICollection<TblNguoidungVaitro> TblNguoidungVaitros { get; set; } = new List<TblNguoidungVaitro>();

    public virtual ICollection<TblNhacnho> TblNhacnhos { get; set; } = new List<TblNhacnho>();

    public virtual ICollection<TblPhantichChitieu> TblPhantichChitieus { get; set; } = new List<TblPhantichChitieu>();

    public virtual ICollection<TblTaikhoan> TblTaikhoans { get; set; } = new List<TblTaikhoan>();

    public virtual ICollection<TblThongbao> TblThongbaos { get; set; } = new List<TblThongbao>();

    public virtual ICollection<TblToken> TblTokens { get; set; } = new List<TblToken>();

    public virtual ICollection<TblTonghopDanhmuc> TblTonghopDanhmucs { get; set; } = new List<TblTonghopDanhmuc>();

    public virtual ICollection<TblTonghopThang> TblTonghopThangs { get; set; } = new List<TblTonghopThang>();

    public virtual ICollection<TblTuKhoa> TblTuKhoas { get; set; } = new List<TblTuKhoa>();
}
