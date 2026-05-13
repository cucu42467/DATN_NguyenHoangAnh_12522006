using DAL.Interfaces;
using DTO;

namespace BLL.Interfaces;

public interface IAiBll
{
    Task<DuDoanAIChartDto> LayDuDoanAsync(int nguoiDungId, int? thang, int? nam, CancellationToken ct = default);
    Task<List<LoiKhuyenAIDto>> LayGoiYAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauGoiYDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);

    Task<List<CanhBaoHeThongDto>> LayCanhBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauCanhBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);

    Task<GeminiPhanTichResponse> PhanTichChiTieuBangGeminiAsync(
        int nguoiDungId,
        DateTime? tuNgay,
        DateTime? denNgay,
        CancellationToken ct = default);

    Task<GeminiChatResponse> ChatVoiGeminiAsync(
        int nguoiDungId,
        string tinNhan,
        List<GeminiChatMessage>? lichSuTinNhan,
        string loaiYeuCau,
        CancellationToken ct = default);

    Task<GeminiChatDataDto> LayDuLieuChatAsync(
        int nguoiDungId,
        CancellationToken ct = default);

    // Thông báo
    Task<List<ThongBaoDto>> LayThongBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default);
    Task<bool> DanhDauThongBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default);
    Task<int> TaoThongBaoTuCanhBaoAsync(int nguoiDungId, CanhBaoHeThongDto canhBao, CancellationToken ct = default);
    Task<int> TaoThongBaoTuGoiYAsync(int nguoiDungId, LoiKhuyenAIDto goiY, CancellationToken ct = default);
    Task<int> TaoThongBaoTuDuDoanAsync(int nguoiDungId, string noiDung, CancellationToken ct = default);

    // AI Query - Truy vấn database bằng ngôn ngữ tự nhiên
    Task<GeminiChatResponse> TruyVanDuLieuBoiAiQueryAsync(
        int nguoiDungId,
        string cauHoi,
        List<GeminiChatMessage>? lichSuTinNhan = null,
        CancellationToken ct = default);

    // ================== ADMIN METHODS ==================
    
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
