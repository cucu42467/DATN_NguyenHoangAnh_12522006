using DTO;

namespace BLL.Interfaces;

public interface INganSachBll
{
    // User methods
    Task<List<NganSachDto>> LayDanhSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, ThietLapNganSachDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, int nganSachId, ThietLapNganSachDto dto, CancellationToken ct = default);
    Task<bool> CapNhatHanMucAsync(int nguoiDungId, int nganSachId, decimal hanMucMoi, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default);
    Task<NganSachDto?> LayChiTietAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default);
    Task<List<GiaoDichDto>> LayGiaoDichTheoNganSachAsync(int nguoiDungId, int nganSachId, CancellationToken ct = default);

    // Dashboard stats
    Task<List<CanhBaoNganSachAdminDto>> LayCanhBaoVuotMucAsync(CancellationToken ct = default);
}

