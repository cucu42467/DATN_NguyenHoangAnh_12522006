using DAL.Interfaces;
using DTO;

using BLL.Interfaces;

namespace BLL;

public class AiModelBll : IAiModelBll
{
    private readonly IAiModelDal _aiModelDal;
    public AiModelBll(IAiModelDal aiModelDal) { _aiModelDal = aiModelDal; }
    public Task<List<AiModelDto>> LayTatCaAsync() => _aiModelDal.LayTatCaAsync();
    public Task<AiModelDto?> LayTheoIdAsync(int id) => _aiModelDal.LayTheoIdAsync(id);
    public Task<AiModelDto?> LayModelTheoMucDichAsync(string mucDich) => _aiModelDal.LayModelTheoMucDichAsync(mucDich);
    public Task<int> TaoMoiAsync(AiModelDto dto) => _aiModelDal.TaoMoiAsync(dto);
    public Task<bool> CapNhatAsync(int id, AiModelDto dto) => _aiModelDal.CapNhatAsync(id, dto);
    public Task<bool> XoaAsync(int id) => _aiModelDal.XoaAsync(id);
}
