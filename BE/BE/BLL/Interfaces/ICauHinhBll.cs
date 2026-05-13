using DTO;

namespace BLL.Interfaces;

public interface ICauHinhBll
{
    Task<List<CauHinhHeThongDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<CauHinhHeThongDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, CauHinhHeThongDto dto, CancellationToken ct = default);
}
