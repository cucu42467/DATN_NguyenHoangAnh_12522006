using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO;

public class TaiKhoanDto
{
    public int TaiKhoanId { get; set; }
    public string TenTaiKhoan { get; set; } = null!;
    public string LoaiTaiKhoan { get; set; } = null!;
    public decimal SoDu { get; set; }
    public decimal? SoDuBanDau { get; set; }
    public string? TienTe { get; set; }
    public string? MauSac { get; set; }
    public string? Icon { get; set; }
    public int NguoiDungId { get; set; }
    public bool LaMacDinh { get; set; }
    // ← THÊM MỚI: MoTa tài khoản
    public string? MoTa { get; set; }
    public string? TenNganHang { get; set; }
    public string? SoTaiKhoan { get; set; }
    public decimal? HanMucTinDung { get; set; }
    public DateTime? NgayCapNhatSoDu { get; set; }
}

// DTO gửi lên để tạo/cập nhật tài khoản - khớp với bảng tbl_taikhoan
public class TaoTaiKhoanDto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TaiKhoanId { get; set; }


    // =====================================================
    // ID NGƯỜI DÙNG
    // =====================================================
    [Required]
    public int NguoiDungId { get; set; }


    // =====================================================
    // ID LOẠI TÀI KHOẢN
    // =====================================================
    [Required]
    public int LoaiTaiKhoanId { get; set; }


    // =====================================================
    // TÊN TÀI KHOẢN
    // =====================================================
    [Required]
    [StringLength(255)]
    public string TenTaiKhoan { get; set; } = null!;


    // =====================================================
    // SỐ DƯ HIỆN TẠI
    // =====================================================
    [Column(TypeName = "decimal(18,2)")]
    public decimal SoDu { get; set; } = 0;


    // =====================================================
    // SỐ DƯ BAN ĐẦU
    // =====================================================
    [Column(TypeName = "decimal(18,2)")]
    public decimal SoDuBanDau { get; set; } = 0;


    // =====================================================
    // TIỀN TỆ
    // Ví dụ: VND, USD
    // =====================================================
    [StringLength(10)]
    public string TienTe { get; set; } = "VND";


    // =====================================================
    // MÀU SẮC HIỂN THỊ
    // =====================================================
    [StringLength(50)]
    public string? MauSac { get; set; }


    // =====================================================
    // ICON HIỂN THỊ
    // =====================================================
    [StringLength(100)]
    public string? Icon { get; set; }


    // =====================================================
    // NGÀY TẠO
    // =====================================================
    public DateTime NgayTao { get; set; } = DateTime.Now;


    // =====================================================
    // TRẠNG THÁI
    // 1 = hoạt động
    // 0 = khóa
    // =====================================================
    public bool TrangThai { get; set; } = true;


    // =====================================================
    // TÊN NGÂN HÀNG
    // =====================================================
    [StringLength(255)]
    public string? TenNganHang { get; set; }


    // =====================================================
    // SỐ TÀI KHOẢN NGÂN HÀNG
    // =====================================================
    [StringLength(50)]
    public string? SoTaiKhoan { get; set; }


    // =====================================================
    // HẠN MỨC TÍN DỤNG
    // =====================================================
    [Column(TypeName = "decimal(18,2)")]
    public decimal? HanMucTinDung { get; set; }


    // =====================================================
    // MÔ TẢ / GHI CHÚ
    // =====================================================
    [StringLength(500)]
    public string? MoTa { get; set; }


    // =====================================================
    // TÀI KHOẢN MẶC ĐỊNH
    // =====================================================
    public bool LaMacDinh { get; set; } = false;


    // =====================================================
    // NGÀY CẬP NHẬT SỐ DƯ
    // =====================================================
    public DateTime? NgayCapNhatSoDu { get; set; }

}
