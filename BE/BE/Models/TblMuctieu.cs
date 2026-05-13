using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblMuctieu
{
    [Key]
    public int MucTieuId { get; set; }

    public int NguoiDungId { get; set; }

    public int? TaiKhoanId { get; set; }

    public string TenMucTieu { get; set; } = null!;

    public string? MoTa { get; set; }          // ← THÊM MỚI: mô tả mục tiêu
    public byte UuTien { get; set; } = 2;     // ← THÊM MỚI: ưu tiên (1=Cao, 2=TB, 3=Thấp)

    public decimal SoTienMucTieu { get; set; }

    public decimal? SoTienHienTai { get; set; }

    public DateTime? NgayBatDau { get; set; }

    public DateTime? NgayKetThuc { get; set; }

    public string? Icon { get; set; }

    public string? MauSac { get; set; }

    public sbyte? TrangThai { get; set; }

    public string? Anh { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual TblTaikhoan? TaiKhoan { get; set; }

    public virtual ICollection<TblDonggopMuctieu> TblDonggopMuctieus { get; set; } = new List<TblDonggopMuctieu>();
}
