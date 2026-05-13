using System.Text.Json.Serialization;

namespace DTO;

public class NguoiDungDto
{
    public int NguoiDungId { get; set; }

    public string HoTen { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    // [JsonIgnore] - KHÔNG BAO GIỜ trả password ra ngoài
    [JsonIgnore]
    public string? MatKhau { get; set; }

    public string? AnhDaiDien { get; set; }

    public DateTime? NgayTao { get; set; }

    public sbyte? TrangThai { get; set; }
    public bool EmailDaXacThuc { get; set; }
    public bool Dang2FA { get; set; }
    public sbyte? DaXoa { get; set; }
    public DateTime? LanDangNhapCuoi { get; set; }
    public string? PhuongThucDangNhap { get; set; }

    public List<string> VaiTro { get; set; } = new();
}

public class DoiMatKhauDto
{
    public string MatKhauCu { get; set; } = null!;
    public string MatKhauMoi { get; set; } = null!;
}

// Chi tiết người dùng đầy đủ cho Admin
public class NguoiDungChiTietDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? SoDienThoai { get; set; }
    public string? AnhDaiDien { get; set; }
    public DateTime? NgayTao { get; set; }
    public sbyte TrangThai { get; set; }
    public sbyte DaXoa { get; set; }
    public bool EmailDaXacThuc { get; set; }
    public bool SoDienThoaiDaXacThuc { get; set; }
    public DateTime? LanDangNhapCuoi { get; set; }
    public List<string> VaiTro { get; set; } = new();

    // Thông tin tài chính
    public List<TaiKhoanThongKeDto> TaiKhoan { get; set; } = new();
    public GiaoDichThongKeDto GiaoDich { get; set; } = new();

    // Liên kết mạng xã hội
    public List<SocialLoginDto> SocialLogins { get; set; } = new();

    // Cài đặt
    public CaiDatThongKeDto? CaiDat { get; set; }
}

// Thông tin tài khoản ngân hàng
public class TaiKhoanThongKeDto
{
    public int TaiKhoanId { get; set; }
    public string TenTaiKhoan { get; set; } = null!;
    public string LoaiTaiKhoan { get; set; } = null!;
    public decimal SoDu { get; set; }
    public string? Icon { get; set; }
    public string? MauSac { get; set; }
}

// Thống kê giao dịch
public class GiaoDichThongKeDto
{
    public int TongGiaoDich { get; set; }
    public decimal TongThuThang { get; set; }
    public decimal TongChiThang { get; set; }
}

// Liên kết mạng xã hội
public class SocialLoginDto
{
    public int Id { get; set; }
    public string Provider { get; set; } = null!;
    public string? EmailSocial { get; set; }
    public DateTime NgayLienKet { get; set; }
}

// Cài đặt thống kê
public class CaiDatThongKeDto
{
    public string? NgonNgu { get; set; }
    public string? TienTe { get; set; }
    public bool CheDoToi { get; set; }
    public string? DinhDangNgay { get; set; }
    public bool NhanThongBao { get; set; }
}

// Thống kê tổng quan người dùng
public class ThongKeTongQuanNguoiDungDto
{
    public int TongNguoiDung { get; set; }
    public int DangHoatDong { get; set; }
    public int BiKhoa { get; set; }
    public int DangKyThangNay { get; set; }
}

