using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Models;

public partial class TblImportFile
{
    [Key]
    public int ImportId { get; set; }

    public int NguoiDungId { get; set; }

    public int TaiKhoanId { get; set; }

    public string? TenFile { get; set; }

    public DateTime? NgayImport { get; set; }

    public int? TongDong { get; set; }

    public int? SoDongThanhCong { get; set; }

    public int? SoDongLoi { get; set; }

    public sbyte? TrangThai { get; set; }

    public virtual TblNguoidung NguoiDung { get; set; } = null!;

    public virtual TblTaikhoan TaiKhoan { get; set; } = null!;

    public virtual ICollection<TblImportChitiet> TblImportChitiets { get; set; } = new List<TblImportChitiet>();
}
