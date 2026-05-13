namespace DTO;

public class AdminTongQuanDto
{
    public int TongNguoiDung { get; set; }
    public int TongGiaoDich { get; set; }
    public int TongImport { get; set; }
}

public class AdminGiaoDichDto
{
    public int GiaoDichId { get; set; }
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public decimal SoTien { get; set; }
    public sbyte LoaiGiaoDich { get; set; }
    public DateTime NgayGiaoDich { get; set; }
    public string? MoTa { get; set; }
    public string? TenDanhMuc { get; set; }
    public string? TenTaiKhoan { get; set; }
}

public class AdminTokenDto
{
    public int TokenId { get; set; }

    public int NguoiDungId { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayHetHan { get; set; }

    // Lich su dang nhap gan nhat
    public DateTime? LanDangNhapGanNhat { get; set; }

    public string? IpAddress { get; set; }

    public string? ThietBi { get; set; }

    public sbyte? KetQuaDangNhap { get; set; }
}

public class AdminAuditLogDto
{
    public int Id { get; set; }
    public int? NguoiDungId { get; set; }
    public string TenBang { get; set; } = string.Empty;
    public int? BanGhiId { get; set; }
    public string HanhDong { get; set; } = string.Empty;
    public string? DuLieuCu { get; set; }
    public string? DuLieuMoi { get; set; }
    public DateTime? ThoiGian { get; set; }
    public string? IpAddress { get; set; }
}

public class CauHinhHeThongDto
{
    public int CauHinhId { get; set; }
    public string TenThamSo { get; set; } = string.Empty;
    public string GiaTri { get; set; } = string.Empty;
    public string? MoTa { get; set; }
    public string? KieuDuLieu { get; set; }
}

public class TyGiaDto
{
    public int TyGiaId { get; set; }
    public string TuTienTe { get; set; } = string.Empty;
    public string SangTienTe { get; set; } = string.Empty;
    public decimal TyGia { get; set; }
    public DateTime? NgayCapNhat { get; set; }
}

public class TaoTyGiaDto
{
    public string TuTienTe { get; set; } = string.Empty;
    public string SangTienTe { get; set; } = string.Empty;
    public decimal TyGia { get; set; }
}

public class SerieDto
{
    public string Name { get; set; } = string.Empty;
    public List<decimal> Data { get; set; } = new();
}

public class TangTruongUserDto
{
    public List<string> Labels { get; set; } = new();
    public List<SerieDto> Series { get; set; } = new();
}

// ============ Dashboard Admin Stats ============

public class DashboardTongQuanDto
{
    // Thống kê người dùng
    public int TongNguoiDungHoatDong { get; set; }
    public int NguoiDungMoi7Ngay { get; set; }
    public int NguoiDungDangNhapHomNay { get; set; }
    public int TongNguoiDungBiVoHieuHoa { get; set; }

    // Thống kê giao dịch tháng hiện tại
    public int TongGiaoDichHeThong { get; set; }
    public decimal TongThuThangHienTai { get; set; }
    public decimal TongChiThangHienTai { get; set; }

    // Phản hồi chờ xử lý
    public int PhanHoiChoXuLy { get; set; }
}

public class ThongKeNguoiDungDto
{
    public List<string> Labels { get; set; } = new();
    public List<decimal> Data { get; set; } = new();
}

public class ThongKeGiaoDichThangDto
{
    public string Thang { get; set; } = string.Empty;
    public decimal TongThu { get; set; }
    public decimal TongChi { get; set; }
}

public class ChiTieuTheoDanhMucDto
{
    public string TenDanhMuc { get; set; } = string.Empty;
    public decimal TongTien { get; set; }
    public double PhanTram { get; set; }
}

public class CanhBaoNganSachAdminDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string TenDanhMuc { get; set; } = string.Empty;
    public double PhanTramDaDung { get; set; }
    public string ThangNam { get; set; } = string.Empty;
}

public class DashboardTongHopDto
{
    public DashboardTongQuanDto TongQuan { get; set; } = new();
    public ThongKeNguoiDungDto TangTruongNguoiDung { get; set; } = new();
    public List<ThongKeGiaoDichThangDto> GiaoDich6Thang { get; set; } = new();
    public List<ChiTieuTheoDanhMucDto> ChiTieuDanhMuc { get; set; } = new();
    public List<CanhBaoNganSachAdminDto> CanhBaoNganSach { get; set; } = new();
    public List<AdminAuditLogDto> HoatDongGanDay { get; set; } = new();
}

// ============ BaoCao Stats ============

public class ThongKeNguoiDungFullDto
{
    public int TongNguoiDung { get; set; }
    public int DangHoatDong { get; set; }
    public int BiKhoa { get; set; }
    public int DaXoa { get; set; }
    public int EmailDaXacThuc { get; set; }
    public int SDTDaXacThuc { get; set; }
    public int Dang2FA { get; set; }
    public int TongSocial { get; set; }
    public int Google { get; set; }
    public int Facebook { get; set; }
}

public class NguoiDungMoiTheoThoiGianDto
{
    public string? Ngay { get; set; }
    public string? Tuan { get; set; }
    public string? Thang { get; set; }
    public int SoLuong { get; set; }
}

public class ThietBiHeDieuHanhDto
{
    public string Ten { get; set; } = "";
    public int SoLuong { get; set; }
    public double PhanTram { get; set; }
}

public class DAUMAUDto
{
    public int DAU { get; set; }
    public int MAU { get; set; }
    public double TyLe { get; set; }
}

public class NguoiDungKhongHoatDongDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = "";
    public string Email { get; set; } = "";
    public string LanDangNhapCuoi { get; set; } = "";
    public int SoNgayKhongHoatDong { get; set; }
}

public class ThongKeGiaoDichFullDto
{
    public int TongGiaoDich { get; set; }
    public int GiaoDichThanhCong { get; set; }
    public int GiaoDichLoi { get; set; }
    public decimal TongThu { get; set; }
    public decimal TongChi { get; set; }
    public int Web { get; set; }
    public int Mobile { get; set; }
    public int AI { get; set; }
    public int Import { get; set; }
}

public class GiaoDichTheoDanhMucDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public int SoLuong { get; set; }
    public decimal TongTien { get; set; }
    public double PhanTram { get; set; }
}

public class GiaoDichDinhKyThongKeDto
{
    public int TongDangHoatDong { get; set; }
    public int TongNgungHoatDong { get; set; }
    public int TongNguoiDungSuDung { get; set; }
}

public class ThongKeThongBaoDto
{
    public int TongThongBao { get; set; }
    public int DaDoc { get; set; }
    public int ChuaDoc { get; set; }
    public double TyLeDoc { get; set; }
    public List<ThongBaoTheoLoaiDto> TheoLoai { get; set; } = new();
}

public class ThongBaoTheoLoaiDto
{
    public string Loai { get; set; } = "";
    public int TongSo { get; set; }
    public int DaDoc { get; set; }
    public double TyLeDoc { get; set; }
}

public class ThongKePhanHoiDto
{
    public int TongSo { get; set; }
    public int ChoXuLy { get; set; }
    public int DangXuLy { get; set; }
    public int DaGiaiQuyet { get; set; }
    public int TuChoi { get; set; }
    public double ThoiGianXuLyTrungBinh { get; set; }
}

public class ThongKeBaoMatDto
{
    public int TongDangNhap { get; set; }
    public int ThanhCong { get; set; }
    public int ThatBai { get; set; }
    public double TyLeThatBai { get; set; }
}

public class DangNhapThatBaiDto
{
    public int Id { get; set; }
    public int? NguoiDungId { get; set; }
    public string? HoTen { get; set; }
    public string? Email { get; set; }
    public string ThoiGian { get; set; } = "";
    public string? IpAddress { get; set; }
    public string? ThietBi { get; set; }
}

public class AuditLogTheoUserDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = "";
    public string Email { get; set; } = "";
    public int TongThaoTac { get; set; }
    public int Insert { get; set; }
    public int Update { get; set; }
    public int Delete { get; set; }
    public string? HanhDongGanNhat { get; set; }
    public string? ThoiGianGanNhat { get; set; }
}

public class HoatDongBatThuongDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = "";
    public string Email { get; set; } = "";
    public int SoIPKhacNhau { get; set; }
    public List<string> DanhSachIP { get; set; } = new();
    public int SoDangNhapTrongNgay { get; set; }
}

