using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class AiModelDal : IAiModelDal
{
    private readonly AppDbContext _context;
    public AiModelDal(AppDbContext context) { _context = context; }

    public async Task<List<AiModelDto>> LayTatCaAsync()
    {
        return await _context.TblAiModels.AsNoTracking().Select(x => new AiModelDto
        {
            ModelId = x.ModelId,
            TenModel = x.TenModel,
            MucDich = x.MucDich,
            Provider = x.Provider,
            ApiUrl = x.ApiUrl,
            ApiKey = x.ApiKey,
            TrangThai = x.TrangThai
        }).ToListAsync();
    }

    public async Task<AiModelDto?> LayTheoIdAsync(int id)
    {
        var x = await _context.TblAiModels.AsNoTracking().FirstOrDefaultAsync(m => m.ModelId == id);
        return x == null ? null : new AiModelDto
        {
            ModelId = x.ModelId,
            TenModel = x.TenModel,
            MucDich = x.MucDich,
            Provider = x.Provider,
            ApiUrl = x.ApiUrl,
            ApiKey = x.ApiKey,
            TrangThai = x.TrangThai
        };
    }

    public async Task<AiModelDto?> LayModelTheoMucDichAsync(string mucDich)
    {
        var x = await _context.TblAiModels
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.MucDich == mucDich && m.TrangThai == 1);
        return x == null ? null : new AiModelDto
        {
            ModelId = x.ModelId,
            TenModel = x.TenModel,
            MucDich = x.MucDich,
            Provider = x.Provider,
            ApiUrl = x.ApiUrl,
            ApiKey = x.ApiKey,
            TrangThai = x.TrangThai
        };
    }

    public async Task<int> TaoMoiAsync(AiModelDto dto)
    {
        var entity = new TblAiModel
        {
            TenModel = dto.TenModel,
            MucDich = dto.MucDich,
            Provider = dto.Provider,
            ApiUrl = dto.ApiUrl,
            ApiKey = dto.ApiKey,
            TrangThai = dto.TrangThai ?? 1,
            NgayTao = DateTime.Now
        };
        _context.TblAiModels.Add(entity);
        await _context.SaveChangesAsync();
        return entity.ModelId;
    }

    public async Task<bool> CapNhatAsync(int id, AiModelDto dto)
    {
        var entity = await _context.TblAiModels.FindAsync(id);
        if (entity == null) return false;

        entity.TenModel = dto.TenModel;
        entity.MucDich = dto.MucDich;
        entity.Provider = dto.Provider;
        entity.ApiUrl = dto.ApiUrl;
        entity.ApiKey = dto.ApiKey;
        entity.TrangThai = dto.TrangThai;

        _context.TblAiModels.Update(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> XoaAsync(int id)
    {
        var entity = await _context.TblAiModels.FindAsync(id);
        if (entity == null) return false;
        _context.TblAiModels.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
