namespace DTO;


public class BaoCaoTongQuanDto
{
    public List<string> Labels { get; set; } = new();
    public List<SerieDto> Series { get; set; } = new();
}

public class PhanBoDanhMucDto
{
    public List<string> Labels { get; set; } = new();
    public List<decimal> Series { get; set; } = new();
}

public class BaoCaoTongHopChiSoDto
{
    public decimal TongThu { get; set; }
    public decimal TongChi { get; set; }
    public decimal SoDuThuan => TongThu - TongChi;
    public int SoGiaoDich { get; set; }
}

/// <summary>
/// Kết quả đồng bộ dữ liệu
/// </summary>
public class DongBoKetQuaDto
{
    /// <summary>Số bản ghi đã đồng bộ thành công</summary>
    public int SoBanGhiDongBo { get; set; }

    /// <summary>Tổng số bản ghi cần đồng bộ</summary>
    public int TongSoBanGhi { get; set; }

    /// <summary>Danh sách các bản ghi bị lệch (nếu chỉ kiểm tra)</summary>
    public List<LechNganSachDto> CacBanGhiLech { get; set; } = new();

    /// <summary>Tổng chênh lệch tiền</summary>
    public decimal TongChenhLech { get; set; }

    /// <summary>Thông báo kết quả</summary>
    public string ThongBao { get; set; } = "";
}

/// <summary>
/// Thông tin một bản ghi bị lệch
/// </summary>
public class LechNganSachDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public int Thang { get; set; }
    public int Nam { get; set; }
    public decimal SoTienTuGiaoDich { get; set; }
    public decimal SoTienTuNganSach { get; set; }
    public decimal ChenhLech => SoTienTuGiaoDich - SoTienTuNganSach;
}

// ============== BÁO CÁO TÀI KHOẢN ==============

public class BaoCaoTaiKhoanDto
{
    /// <summary>Tổng số dư tất cả tài khoản (quy đổi VND)</summary>
    public decimal TongTaiSan { get; set; }

    /// <summary>Phân bổ theo loại tài khoản</summary>
    public List<LoaiTaiKhoanPhanBoDto> PhanBoTheoLoai { get; set; } = new();

    /// <summary>Danh sách tài khoản với biến động số dư</summary>
    public List<TaiKhoanBaoCaoDto> DanhSachTaiKhoan { get; set; } = new();

    /// <summary>Biến động số dư theo tháng (12 tháng gần nhất)</summary>
    public BaoCaoTongQuanDto BienDongSoDu { get; set; } = new();
}

public class LoaiTaiKhoanPhanBoDto
{
    public int LoaiTaiKhoanId { get; set; }
    public string TenLoai { get; set; } = "";
    public decimal TongSoDu { get; set; }
    public decimal TyLe { get; set; } // % tổng tài sản
    public int SoLuongTaiKhoan { get; set; }
}

public class TaiKhoanBaoCaoDto
{
    public int TaiKhoanId { get; set; }
    public string TenTaiKhoan { get; set; } = "";
    public string TenLoaiTaiKhoan { get; set; } = "";
    public decimal SoDuHienTai { get; set; }
    public decimal SoDuDauThang { get; set; }
    public decimal SoDuCuoiThang { get; set; }
    public decimal BienDong => SoDuCuoiThang - SoDuDauThang;
    public decimal? HanMuc { get; set; }
    public decimal? DaSuDung { get; set; }
    public float? TyLeSuDung { get; set; }
}

// ============== BÁO CÁO DANH MỤC CHI TIÊU ==============

public class BaoCaoDanhMucDto
{
    /// <summary>Tổng chi tiêu trong kỳ</summary>
    public decimal TongChiTieu { get; set; }

    /// <summary>Số giao dịch</summary>
    public int SoGiaoDich { get; set; }

    /// <summary>Chi tiêu theo từng danh mục</summary>
    public List<DanhMucChiTieuDto> ChiTieuTheoDanhMuc { get; set; } = new();

    /// <summary>So sánh với tháng trước</summary>
    public List<DanhMucSoSanhDto> SoSanhThangTruoc { get; set; } = new();

    /// <summary>Danh mục cha với chi tiết con</summary>
    public List<DanhMucChaDto> DanhMucCha { get; set; } = new();

    /// <summary>Top danh mục chi nhiều nhất</summary>
    public List<TopDanhMucDto> TopDanhMuc { get; set; } = new();
}

public class DanhMucChiTieuDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public int? DanhMucChaId { get; set; }
    public decimal TongTien { get; set; }
    public int SoGiaoDich { get; set; }
    public decimal TyLe { get; set; } // % tổng chi tiêu
}

public class DanhMucSoSanhDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal TienThangNay { get; set; }
    public decimal TienThangTruoc { get; set; }
    public decimal ChenhLech { get; set; }
    public float TyLeThayDoi { get; set; } // % tăng/giảm
}

public class DanhMucChaDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal TongTien { get; set; }
    public int SoGiaoDich { get; set; }
    public List<DanhMucConDto> DanhMucCon { get; set; } = new();
}

public class DanhMucConDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal TongTien { get; set; }
    public int SoGiaoDich { get; set; }
}

public class TopDanhMucDto
{
    public int Rank { get; set; }
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal TongTien { get; set; }
    public int SoGiaoDich { get; set; }
    public decimal TyLe { get; set; }
}

// ============== BÁO CÁO NGÂN SÁCH ==============

public class BaoCaoNganSachDto
{
    /// <summary>Tổng hạn mức ngân sách tháng</summary>
    public decimal TongHanMuc { get; set; }

    /// <summary>Tổng đã sử dụng</summary>
    public decimal TongDaSuDung { get; set; }

    /// <summary>Tổng còn lại</summary>
    public decimal TongConLai => TongHanMuc - TongDaSuDung;

    /// <summary>Tỷ lệ sử dụng trung bình</summary>
    public float TyLeSuDungTrungBinh { get; set; }

    /// <summary>Chi tiết ngân sách theo danh mục</summary>
    public List<NganSachChiTietDto> ChiTietNganSach { get; set; } = new();

    /// <summary>Danh sách danh mục vượt hoặc gần vượt ngân sách</summary>
    public List<NganSachCanhBaoDto> CanhBao { get; set; } = new();

    /// <summary>Lịch sử thực hiện ngân sách 6 tháng</summary>
    public List<NganSachLichSuDto> LichSuThucHien { get; set; } = new();

    /// <summary>Tỷ lệ tuân thủ ngân sách</summary>
    public float TyLeTuanThu { get; set; }
}

public class NganSachChiTietDto
{
    public int NganSachId { get; set; }
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal HanMuc { get; set; }
    public decimal DaSuDung { get; set; }
    public decimal ConLai => HanMuc - DaSuDung;
    public float TyLeSuDung { get; set; }
    public bool LaVuot => DaSuDung > HanMuc;
}

public class NganSachCanhBaoDto
{
    public int DanhMucId { get; set; }
    public string TenDanhMuc { get; set; } = "";
    public decimal HanMuc { get; set; }
    public decimal DaSuDung { get; set; }
    public float TyLeSuDung { get; set; }
    public string MucDo { get; set; } = ""; // "VUOT", "GAN_VUOT", "BINH_THUONG"
}

public class NganSachLichSuDto
{
    public int Thang { get; set; }
    public int Nam { get; set; }
    public decimal TongHanMuc { get; set; }
    public decimal TongDaSuDung { get; set; }
    public bool CoVuot { get; set; }
    public float TyLeSuDung { get; set; }
}

// ============== BÁO CÁO MỤC TIÊU TIẾT KIỆM ==============

public class BaoCaoMucTieuDto
{
    /// <summary>Số mục tiêu đang theo dõi</summary>
    public int TongMucTieu { get; set; }

    /// <summary>Số mục tiêu đã hoàn thành</summary>
    public int MucTieuHoanThanh { get; set; }

    /// <summary>Tổng số tiền đã tiết kiệm được</summary>
    public decimal TongDaTietKiem { get; set; }

    /// <summary>Danh sách mục tiêu chi tiết</summary>
    public List<MucTieuBaoCaoDto> DanhSachMucTieu { get; set; } = new();
}

public class MucTieuBaoCaoDto
{
    public int MucTieuId { get; set; }
    public string TenMucTieu { get; set; } = "";
    public string? MoTa { get; set; }
    public decimal MucTieu { get; set; }
    public decimal DaDat { get; set; }
    public decimal ConLai => MucTieu - DaDat;
    public float TyLeHoanThanh { get; set; }
    public decimal TrungBinhThang { get; set; }
    public DateTime? NgayDuKien { get; set; }
    public DateTime? HanChot { get; set; }
    public bool DaHoanThanh => DaDat >= MucTieu;
    public List<DongGopDto> LichSuDongGop { get; set; } = new();
}

public class DongGopDto
{
    public int DongGopId { get; set; }
    public decimal SoTien { get; set; }
    public DateTime NgayTao { get; set; }
    public string? GhiChu { get; set; }
}

