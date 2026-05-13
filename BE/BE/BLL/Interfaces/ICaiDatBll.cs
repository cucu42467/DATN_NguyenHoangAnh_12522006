using DTO;

namespace BLL.Interfaces;

public interface ICaiDatBll
{
    // User methods
    Task<CaiDatDto?> LayTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, TaoCaiDatDto dto, CancellationToken ct = default);
}
