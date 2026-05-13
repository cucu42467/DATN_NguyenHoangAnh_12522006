using System.Text.Json.Serialization;

namespace DTO;

// Request
public class GeminiPhanTichRequest
{
    [JsonPropertyName("nguoiDungId")]
    public int NguoiDungId { get; set; }

    [JsonPropertyName("tuNgay")]
    public DateTime? TuNgay { get; set; }

    [JsonPropertyName("denNgay")]
    public DateTime? DenNgay { get; set; }
}

// Request cho Chat AI
public class GeminiChatRequest
{
    [JsonPropertyName("tinNhan")]
    public string TinNhan { get; set; } = string.Empty;

    [JsonPropertyName("lichSuTinNhan")]
    public List<GeminiChatMessage>? LichSuTinNhan { get; set; }

    [JsonPropertyName("loaiYeuCau")]
    public string LoaiYeuCau { get; set; } = "TU_DO"; // TU_DO | PHAN_TICH_CHI_TIEU | GOI_Y_TIET_KIEM | LAP_KHOACH_TAI_CHINH | TRA_LOI_CAU_HOI
}

// Tin nhắn trong chat
public class GeminiChatMessage
{
    [JsonPropertyName("vaiTro")]
    public string VaiTro { get; set; } = "user"; // user | model

    [JsonPropertyName("noiDung")]
    public string NoiDung { get; set; } = string.Empty;

    [JsonPropertyName("thoiGian")]
    public DateTime? ThoiGian { get; set; }
}

// Response cho Chat AI
public class GeminiChatResponse
{
    [JsonPropertyName("phanHoi")]
    public string PhanHoi { get; set; } = string.Empty;

    [JsonPropertyName("loaiPhanHoi")]
    public string LoaiPhanHoi { get; set; } = "TEXT"; // TEXT | SUGGESTION | ACTION | WARNING | LIST

    [JsonPropertyName("goiYHanhDong")]
    public List<GeminiGoiYHanDong>? GoiYHanDong { get; set; }

    [JsonPropertyName("duLieuBieuDo")]
    public GeminiDuLieuBieuDo? DuLieuBieuDo { get; set; }

    [JsonPropertyName("duLieuDanhSach")]
    public GeminiDuLieuDanhSach? DuLieuDanhSach { get; set; }
}

// Gợi ý hành động cụ thể
public class GeminiGoiYHanDong
{
    [JsonPropertyName("hanhDong")]
    public string HanhDong { get; set; } = string.Empty;

    [JsonPropertyName("noiDung")]
    public string NoiDung { get; set; } = string.Empty;

    [JsonPropertyName("thamSo")]
    public Dictionary<string, string>? ThamSo { get; set; }
}

// Dữ liệu cho biểu đồ (nếu cần)
public class GeminiDuLieuBieuDo
{
    [JsonPropertyName("loaiBieuDo")]
    public string LoaiBieuDo { get; set; } = "PIE"; // PIE | LINE | BAR

    [JsonPropertyName("nhan")]
    public List<string> Nhan { get; set; } = new();

    [JsonPropertyName("giaTri")]
    public List<decimal> GiaTri { get; set; } = new();

    [JsonPropertyName("moTa")]
    public string? MoTa { get; set; }
}

// Dữ liệu cho danh sách (hiển thị đẹp)
public class GeminiDuLieuDanhSach
{
    [JsonPropertyName("tieuDe")]
    public string TieuDe { get; set; } = "";

    [JsonPropertyName("loai")]
    public string Loai { get; set; } = "THONG_BAO"; // THONG_BAO | GIAO_DICH | TAI_KHOAN | NGAN_SACH | MUC_TIEU | CANH_BAO | GOI_Y

    [JsonPropertyName("cacMuc")]
    public List<GeminiMucDanhSach> CacMuc { get; set; } = new();
}

public class GeminiMucDanhSach
{
    [JsonPropertyName("tieuDe")]
    public string TieuDe { get; set; } = "";

    [JsonPropertyName("moTa")]
    public string? MoTa { get; set; }

    [JsonPropertyName("giaTri")]
    public string? GiaTri { get; set; }

    [JsonPropertyName("ngay")]
    public string? Ngay { get; set; }

    [JsonPropertyName("trangThai")]
    public string? TrangThai { get; set; }

    [JsonPropertyName("icon")]
    public string? Icon { get; set; }

    [JsonPropertyName("mauSac")]
    public string? MauSac { get; set; }
}

// Lời khuyên AI (mở rộng)
public class GeminiLoiKhuyen
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("tieuDe")]
    public string TieuDe { get; set; } = string.Empty;

    [JsonPropertyName("noiDung")]
    public string NoiDung { get; set; } = string.Empty;

    [JsonPropertyName("loai")]
    public string Loai { get; set; } = "GOI_Y"; // CANH_BAO | GOI_Y | KHICH_LE | LENH_KHICH

    [JsonPropertyName("mucDo")]
    public int MucDo { get; set; } = 1; // 1-5

    [JsonPropertyName("hanhDongNgay")]
    public string? HanhDongNgay { get; set; }

    [JsonPropertyName("soTienGoiY")]
    public decimal? SoTienGoiY { get; set; }

    [JsonPropertyName("danhMucApDung")]
    public string? DanhMucApDung { get; set; }

    [JsonPropertyName("ngayTao")]
    public DateTime? NgayTao { get; set; }
}

// Kế hoạch tài chính chi tiết
public class GeminiKeHoachTaiChinh
{
    [JsonPropertyName("mucTieu")]
    public string MucTieu { get; set; } = string.Empty;

    [JsonPropertyName("thuNhapHienTai")]
    public decimal ThuNhapHienTai { get; set; }

    [JsonPropertyName("chiTieuHienTai")]
    public decimal ChiTieuHienTai { get; set; }

    [JsonPropertyName("mucTieuTietKiem")]
    public decimal MucTieuTietKiem { get; set; }

    [JsonPropertyName("thoiGianDuKien")]
    public int ThoiGianDuKien { get; set; } // tháng

    [JsonPropertyName("buocThucHien")]
    public List<GeminiBuocKeHoach> BuocThucHien { get; set; } = new();

    [JsonPropertyName("loiIch")]
    public string? LoiIch { get; set; }

    [JsonPropertyName("ruiRo")]
    public string? RuiRo { get; set; }
}

public class GeminiBuocKeHoach
{
    [JsonPropertyName("buoc")]
    public int Buoc { get; set; }

    [JsonPropertyName("hanhDong")]
    public string HanhDong { get; set; } = string.Empty;

    [JsonPropertyName("moTa")]
    public string MoTa { get; set; } = string.Empty;

    [JsonPropertyName("soTien")]
    public decimal? SoTien { get; set; }

    [JsonPropertyName("thoiGian")]
    public string? ThoiGian { get; set; }
}

// Phân tích xu hướng
public class GeminiXuHuong
{
    [JsonPropertyName("loaiXuHuong")]
    public string LoaiXuHuong { get; set; } = "TANG"; // TANG | GIAM | ON_DINH

    [JsonPropertyName("phanTramThayDoi")]
    public decimal PhanTramThayDoi { get; set; }

    [JsonPropertyName("danhMuc")]
    public string? DanhMuc { get; set; }

    [JsonPropertyName("soSanhVoiThangTruoc")]
    public decimal SoSanhVoiThangTruoc { get; set; }

    [JsonPropertyName("duDoanThangToi")]
    public decimal? DuDoanThangToi { get; set; }
}

// Response chính
public class GeminiPhanTichResponse
{
    [JsonPropertyName("goiY")]
    public List<GeminiGoiY> GoiY { get; set; } = new();

    [JsonPropertyName("phanTich")]
    public GeminiPhanTichKetQua PhanTich { get; set; } = new();
}

public class GeminiGoiY
{
    [JsonPropertyName("loai")]
    public string Loai { get; set; } = "GOI_Y"; // CANH_BAO|GOI_Y|KHICH_LE

    [JsonPropertyName("tieuDe")]
    public string TieuDe { get; set; } = string.Empty;

    [JsonPropertyName("noiDung")]
    public string NoiDung { get; set; } = string.Empty;
}

public class GeminiPhanTichKetQua
{
    [JsonPropertyName("tongThu")]
    public decimal TongThu { get; set; }

    [JsonPropertyName("tongChi")]
    public decimal TongChi { get; set; }

    [JsonPropertyName("tyLeTietKiem")]
    public string TyLeTietKiem { get; set; } = "0%";

    [JsonPropertyName("danhMucNhieuNhat")]
    public string DanhMucNhieuNhat { get; set; } = string.Empty;

    [JsonPropertyName("soSanhThangTruoc")]
    public GeminiSoSanh SoSanhThangTruoc { get; set; } = new();
}

public class GeminiSoSanh
{
    [JsonPropertyName("tang")]
    public decimal Tang { get; set; } // phần trăm

    [JsonPropertyName("giam")]
    public decimal Giam { get; set; } // phần trăm
}
