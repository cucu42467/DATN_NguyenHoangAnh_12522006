using DTO;

namespace DAL.Interfaces;

public interface INganSachDal
{
    Task<List<NganSachDto>> LayDanhSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default);
    Task<NganSachDto?> LayTheoIdAsync(int nganSachId, int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, ThietLapNganSachDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, int nganSachId, ThietLapNganSachDto dto, CancellationToken ct = default);
    Task<bool> CapNhatHanMucAsync(int nguoiDungId, int nganSachId, decimal hanMucMoi, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default);

    // === Xử lý khi giao dịch thay đổi ===
    /// <summary>
    /// Tính lại SoTienDaChi cho ngân sách dựa trên tổng chi tiêu thực tế trong tháng
    /// </summary>
    Task TinhLaiSoTienDaChiAsync(int nguoiDungId, int danhMucId, int thang, int nam, CancellationToken ct = default);

    /// <summary>
    /// Tạo ngân sách mới nếu chưa có, với hạn mức mặc định = 0
    /// </summary>
    Task<int> TaoMoiNeuChuaCoAsync(int nguoiDungId, int danhMucId, int thang, int nam, CancellationToken ct = default);

    /// <summary>
    /// Cập nhật SoTienDaChi cho ngân sách (dùng cho giao dịch thay đổi)
    /// </summary>
    Task CapNhatSoTienDaChiAsync(int nguoiDungId, int danhMucId, int thang, int nam, decimal soTienDaChiMoi, CancellationToken ct = default);

    // Dashboard stats
    Task<List<CanhBaoNganSachAdminDto>> LayCanhBaoVuotMucAsync(CancellationToken ct = default);

    // Thông báo tự động
    Task<List<NganSachDto>> GetByNguoiDungIdAsync(int nguoiDungId);
    Task<decimal> TongChiTieuAsync(int nganSachId, DateTime tuNgay, DateTime denNgay);
}

