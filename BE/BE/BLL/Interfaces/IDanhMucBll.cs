using DTO;

namespace BLL.Interfaces;

public interface IDanhMucBll
{
    Task<List<DanhMucDto>> LayDanhSachAsync(int nguoiDungId, int? loaiDanhMucId = null, bool includeChildren = false, CancellationToken ct = default);
    Task<DanhMucDto?> LayTheoIdAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int danhMucId, TaoDanhMucDto dto, int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatThuTuAsync(int danhMucId, int thuTuMoi, int nguoiDungId, CancellationToken ct = default);
    Task<bool> XoaAsync(int danhMucId, int nguoiDungId, CancellationToken ct = default);
}

