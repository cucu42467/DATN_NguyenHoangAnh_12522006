namespace DTO;

public class DuDoanAIChartDto
{
    public List<string> Months { get; set; } = new();
    public List<decimal> Actual { get; set; } = new();
    public List<decimal> Forecast { get; set; } = new();
    public decimal? MucDoChinhXac { get; set; }
    public string? GhiChu { get; set; }
}

public class LoiKhuyenAIDto
{
    public int Id { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string Loai { get; set; } = "GOI_Y"; // CANH_BAO|GOI_Y|KHICH_LE
    public DateTime NgayTao { get; set; }
    public bool DaDoc { get; set; }
}

public class CanhBaoHeThongDto
{
    public int Id { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string MucDo { get; set; } = "TRUNG_BINH"; // CAO|TRUNG_BINH|THAP
    public bool IsDaDoc { get; set; }
    public DateTime NgayTao { get; set; }
}

// DTO cho thông báo (tbl_thongbao)
public class ThongBaoDto
{
    public int ThongBaoId { get; set; }
    public int NguoiDungId { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string? NoiDung { get; set; }
    public int LoaiThongBao { get; set; } // 1: HeThong, 2: CanhBao, 3: NhacNho, 4: ThanhCong
    public DateTime NgayTao { get; set; }
    public bool DaDoc { get; set; }

    // ← THÊM MỚI: 4 cột mới
    public string? LoaiDoiTuong { get; set; }
    public int? DoiTuongId { get; set; }
    public string? DuongDanDieuHuong { get; set; }
    public DateTime? NgayHetHan { get; set; }

    public string LoaiThongBaoText => LoaiThongBao switch
    {
        1 => "Hệ thống",
        2 => "Cảnh báo",
        3 => "Nhắc nhở",
        4 => "Thành công",
        _ => "Không xác định"
    };

    public string MauSac => LoaiThongBao switch
    {
        1 => "text-primary",
        2 => "text-warning",
        3 => "text-info",
        4 => "text-success",
        _ => "text-secondary"
    };

    public string IconClass => LoaiThongBao switch
    {
        1 => "bi bi-bell",
        2 => "bi bi-exclamation-triangle",
        3 => "bi bi-calendar-event",
        4 => "bi bi-check-circle",
        _ => "bi bi-bell"
    };
}

// DTO tạo thông báo từ AI
public class TaoThongBaoDto
{
    public int NguoiDungId { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string? NoiDung { get; set; }
    public sbyte LoaiThongBao { get; set; } // 2: CanhBao, 3: NhacNho, 4: ThanhCong
    // ← THÊM MỚI: 4 cột điều hướng
    public string? LoaiDoiTuong { get; set; }
    public int? DoiTuongId { get; set; }
    public string? DuongDanDieuHuong { get; set; }
    public DateTime? NgayHetHan { get; set; }
}

// DTO cảnh báo ngân sách
public class CanhBaoNganSachDto
{
    public bool CoCanhBao { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public int? DanhMucId { get; set; }
    public string? TenDanhMuc { get; set; }
    public int Thang { get; set; }
    public int Nam { get; set; }
}

// DTO response khi tạo giao dịch
public class TaoGiaoDichResponseDto
{
    public bool ThanhCong { get; set; }
    public string? ThongBaoLoi { get; set; }
    public int? GiaoDichId { get; set; }
    public CanhBaoNganSachDto? CanhBaoNganSach { get; set; }
}

// DTO thống kê AI cho Admin
public class ThongKeAIDto
{
    public int TongGoiY { get; set; }
    public int DaDuyet { get; set; }
    public int ChoDuyet { get; set; }
    public int TuChoi { get; set; }
    public int TongCanhBao { get; set; }
    public int CanhBaoCao { get; set; }
    public int CanhBaoTrungBinh { get; set; }
    public int CanhBaoThap { get; set; }
}

