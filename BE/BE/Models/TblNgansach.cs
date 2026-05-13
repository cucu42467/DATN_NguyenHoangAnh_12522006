using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblNgansach
{
    [Key]
    public int NganSachId { get; set; }

    public int NguoiDungId { get; set; }

    public int DanhMucId { get; set; }

    public decimal SoTienToiDa { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public decimal? SoTienDaChi { get; set; }

    public float? PhanTramDaDung { get; set; }

    public string? GhiChu { get; set; }              // ← THÊM MỚI: ghi chú ngân sách
    public float CanhBaoPhanTram { get; set; } = 80f;  // ← THÊM MỚI: ngưỡng cảnh báo %

    public sbyte? TrangThai { get; set; }

    public virtual TblDanhmuc DanhMuc { get; set; } = null!;

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual ICollection<TblTheodoiNgansach> TblTheodoiNgansaches { get; set; } = new List<TblTheodoiNgansach>();
}
