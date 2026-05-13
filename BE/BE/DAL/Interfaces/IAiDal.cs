using DTO;

namespace DAL.Interfaces;

public partial interface IAiDal
{
    Task<DuDoanAIChartDto> LayDuDoanAsync(int nguoiDungId, int? thang, int? nam, CancellationToken ct = default);
    Task<List<LoiKhuyenAIDto>> LayGoiYAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauGoiYDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);

    Task<List<CanhBaoHeThongDto>> LayCanhBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauCanhBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);

    Task<(decimal TongThu, decimal TongChi, Dictionary<string, decimal> ChiTheoDanhMuc, string? NganSach)>
        LayDuLieuPhanTichAsync(int nguoiDungId, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default);

    Task<GeminiChatDataDto> LayDuLieuChatAsync(int nguoiDungId, CancellationToken ct = default);

    // Thông báo
    Task<List<ThongBaoDto>> LayThongBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauThongBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<int> TaoThongBaoAsync(TaoThongBaoDto thongBao, CancellationToken ct = default);
    Task<bool> KiemTraTrungThongBaoAsync(int nguoiDungId, string noiDung, CancellationToken ct = default);
    Task<int> TaoThongBaoTuAIAsync(int nguoiDungId, List<GeminiGoiY>? danhSachGoiY, List<GeminiGoiY>? danhSachCanhBao, DuDoanAIChartDto? duDoan, CancellationToken ct = default);
}

public class GeminiChatDataDto
{
    public decimal ThuNhap { get; set; }
    public decimal TongChi { get; set; }
    public decimal TongThu { get; set; }
    public decimal SoDu { get; set; }
    public Dictionary<string, decimal> ChiTheoDanhMuc { get; set; } = new();
    public List<string> MucTieu { get; set; } = new();
    public List<GiaoDichDto> GiaoDichChiTiet { get; set; } = new();
}

// ================== ADMIN DAL METHODS ==================

public partial interface IAiDal
{
    /// <summary>
    /// Lấy tất cả gợi ý AI toàn hệ thống (Admin)
    /// </summary>
    Task<List<LoiKhuyenAIDto>> LayDanhSachGoiYAdminAsync(
        int page = 1,
        int pageSize = 20,
        string? trangThai = null,
        string? loai = null,
        CancellationToken ct = default);

    /// <summary>
    /// Duyệt gợi ý AI (Admin)
    /// </summary>
    Task<bool> DuyetGoiYAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Từ chối gợi ý AI (Admin)
    /// </summary>
    Task<bool> TuChoiGoiYAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Xóa gợi ý AI (Admin)
    /// </summary>
    Task<bool> XoaGoiYAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Tạo gợi ý AI mới (Admin)
    /// </summary>
    Task<int> TaoGoiYAdminAsync(LoiKhuyenAIDto dto, CancellationToken ct = default);

    /// <summary>
    /// Lấy thống kê AI hệ thống (Admin)
    /// </summary>
    Task<ThongKeAIDto> LayThongKeAIAsync(CancellationToken ct = default);
}
