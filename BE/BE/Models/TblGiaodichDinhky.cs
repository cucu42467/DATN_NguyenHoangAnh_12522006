using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblGiaodichDinhky
{
    [Key]
    public int Id { get; set; }

    public int NguoiDungId { get; set; }

    public int TaiKhoanId { get; set; }

    public int? DanhMucId { get; set; }

    public string TenGiaoDich { get; set; } = null!;

    public string? MoTa { get; set; }                    // ← THÊM MỚI: mô tả giao dịch định kỳ
    public int SoLanDaThucHien { get; set; }             // ← THÊM MỚI: số lần đã thực hiện
    public DateTime? LanThucHienCuoi { get; set; }       // ← THÊM MỚI: lần thực hiện cuối

    public sbyte LoaiGiaoDich { get; set; }

    public decimal SoTien { get; set; }

    public string ChuKy { get; set; } = null!;

    public DateTime NgayBatDau { get; set; }

    public DateTime? NgayKetThuc { get; set; }

    public DateTime? LanTiepTheo { get; set; }

    public sbyte? TrangThai { get; set; }

    public virtual TblDanhmuc? DanhMuc { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual TblTaikhoan TaiKhoan { get; set; } = null!;
}
