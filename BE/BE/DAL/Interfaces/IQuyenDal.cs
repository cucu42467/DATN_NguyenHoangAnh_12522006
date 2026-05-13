using DTO;

namespace DAL.Interfaces;

public interface IQuyenDal
{
    Task<List<QuyenDto>> LayTatCaAsync();
    Task<QuyenDto?> LayTheoIdAsync(int id);
    Task<int> TaoMoiAsync(QuyenDto dto);
    Task<bool> XoaAsync(int id);
}
