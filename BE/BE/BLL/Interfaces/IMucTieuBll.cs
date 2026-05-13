using DTO;

namespace BLL.Interfaces;

public interface IMucTieuBll
{
    // User methods
    Task<List<MucTieuDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<MucTieuDto?> LayChiTietAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, TaoMucTieuDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, int mucTieuId, TaoMucTieuDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);
    Task<bool> XoaVinhVienAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);

    Task<List<DongGopMucTieuDto>> LayDanhSachDongGopAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);
    Task<int> TaoDongGopAsync(int nguoiDungId, int mucTieuId, TaoDongGopMucTieuDto dto, CancellationToken ct = default);

}

