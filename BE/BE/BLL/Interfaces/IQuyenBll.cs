using DTO;

namespace BLL.Interfaces;

public interface IQuyenBll
{
    Task<List<QuyenDto>> LayTatCaAsync();
    Task<QuyenDto?> LayTheoIdAsync(int id);
    Task<int> TaoMoiAsync(QuyenDto dto);
    Task<bool> XoaAsync(int id);
}
