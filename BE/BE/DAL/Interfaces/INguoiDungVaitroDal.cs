using DTO;
using Models;
using Common;

namespace DAL;

public interface INguoiDungVaitroDal
{
    Task GanVaiTroAsync(int nguoiDungId, int vaiTroId, CancellationToken huyBo = default);
    Task<VaiTroDto?> LayTheoTenAsync(string tenVaiTro, CancellationToken huyBo = default);
}
