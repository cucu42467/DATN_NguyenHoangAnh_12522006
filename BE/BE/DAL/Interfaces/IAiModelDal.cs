using DTO;

namespace DAL.Interfaces;

public interface IAiModelDal
{
    Task<List<AiModelDto>> LayTatCaAsync();
    Task<AiModelDto?> LayTheoIdAsync(int id);
    Task<AiModelDto?> LayModelTheoMucDichAsync(string mucDich);
    Task<int> TaoMoiAsync(AiModelDto dto);
    Task<bool> CapNhatAsync(int id, AiModelDto dto);
    Task<bool> XoaAsync(int id);
}
