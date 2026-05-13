// using Models; - sẽ ref project
using System.ComponentModel.DataAnnotations;

namespace DTO;

    public class GiaoDichDto
    {
        public int GiaoDichId { get; set; }
        public decimal SoTien { get; set; }
        public string LoaiGiaoDich { get; set; } = null!; // "THU", "CHI", "CHUYEN_KHOAN"
        public int? DanhMucId { get; set; }
        public string? TenDanhMuc { get; set; }
        public int? LoaiDanhMucId { get; set; } // 1 = Thu nhập, 2 = Chi tiêu
        public string? TenLoaiDanhMuc { get; set; } // "Thu nhập" hoặc "Chi tiêu"
        public int? TaiKhoanNguonId { get; set; }
        public string? TenTaiKhoanNguon { get; set; }
        public int? TaiKhoanDichId { get; set; }
        public string? TenTaiKhoanDich { get; set; }
        public DateTime NgayGiaoDich { get; set; }
        public string? GhiChu { get; set; }
        public int NguoiDungId { get; set; }
        public int? DoTinCayAI { get; set; }
        public string? TepDinhKem { get; set; } // Path file upload
        public sbyte? TrangThai { get; set; }
        public string? NguonTao { get; set; }
        public string? ViTri { get; set; }
        // Các trường bổ sung từ CSDL
        public string? TienTe { get; set; }
        public decimal? TyGiaQuyDoi { get; set; }
        public bool? LaTuDong { get; set; }
        public string? MaGiaoDichNgoai { get; set; }
        // ← THÊM MỚI
        public string? TenGiaoDich { get; set; }
    }

public class TaoGiaoDichDto
{
    [Required]
    public decimal SoTien { get; set; }
    [Required]
    public string LoaiGiaoDich { get; set; } = null!;
    public int? DanhMucId { get; set; }
    [Required]
    public int TaiKhoanNguonId { get; set; }
    public int? TaiKhoanDichId { get; set; }
    public DateTime? NgayGiaoDich { get; set; }
    public string? GhiChu { get; set; }
    public string? TepDinhKem { get; set; } // Tên file đã upload
    public sbyte? TrangThai { get; set; }
    public sbyte? HienThi { get; set; }
    public string? NguonTao { get; set; }
    public string? ViTri { get; set; }
    // Các trường bổ sung từ CSDL
    public string? TienTe { get; set; } // Tiền tệ (default: VND)
    public decimal? TyGiaQuyDoi { get; set; } // Tỷ giá quy đổi (default: 1)
    public bool? LaTuDong { get; set; } // Giao dịch tự động
    public float? DoTinCay { get; set; } // Độ tin cậy AI (default: 1)
    public string? MaGiaoDichNgoai { get; set; } // Mã giao dịch đồng bộ từ ngân hàng
    // Flag xác nhận tạo ngân sách tự động nếu chưa có
    public bool? XacNhanTaoNganSach { get; set; }
}

public class LocGiaoDichDto
{
    public DateTime? TuNgay { get; set; }
    public DateTime? DenNgay { get; set; }
    public int? DanhMucId { get; set; }
    public string? TenLoaiDanhMuc { get; set; } // "Chi tiêu" hoặc "Thu nhập"
    public decimal? SoTienTu { get; set; }
    public decimal? SoTienDen { get; set; }
    public string? GhiChu { get; set; } // Tìm kiếm tổng hợp: ghi chú, danh mục, tài khoản, số tiền
    public int? TaiKhoanNguonId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public string? SortDir { get; set; } = "desc";
}

public class XuatExcelDto
{
    public List<int>? GiaoDichIds { get; set; }
    public LocGiaoDichDto? Filter { get; set; }
}

public class PreviewCapNhatGiaoDichDto
{
    public int GiaoDichId { get; set; }
    public decimal SoTienHienTai { get; set; }
    public string LoaiGiaoDichHienTai { get; set; } = null!;
    public string? TenTaiKhoanNguonHienTai { get; set; }
    public decimal SoDuTaiKhoanNguonHienTai { get; set; }

    public decimal SoTienMoi { get; set; }
    public string LoaiGiaoDichMoi { get; set; } = null!;
    public string? TenTaiKhoanNguonMoi { get; set; }
    public decimal SoDuSauKhiHoanLai { get; set; }
    public decimal SoDuSauKhiCapNhat { get; set; }

    public bool CoLoi { get; set; }
    public string? ThongBao { get; set; }
    public string? CanhBao { get; set; }
}


