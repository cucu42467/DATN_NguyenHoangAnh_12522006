using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class CanhBaoBll : ICanhBaoBll
{
    private readonly ICanhBaoDal _dal;

    public CanhBaoBll(ICanhBaoDal dal)
    {
        _dal = dal;
    }

    public async Task<List<CanhBaoDto>> LayDanhSachAsync(int nguoiDungId, bool? daDoc = null, CancellationToken ct = default)
    {
        return await _dal.LayDanhSachAsync(nguoiDungId, daDoc, ct);
    }

    public async Task<CanhBaoDto?> LayChiTietAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAsync(id, nguoiDungId, ct);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, CanhBaoDto dto, CancellationToken ct = default)
    {
        return await _dal.TaoMoiAsync(nguoiDungId, dto, ct);
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        return await _dal.XoaAsync(id, nguoiDungId, ct);
    }

    public async Task<bool> DanhDauDaDocAsync(int nguoiDungId, int id, bool daDoc, CancellationToken ct = default)
    {
        return await _dal.DanhDauDaDocAsync(id, nguoiDungId, daDoc, ct);
    }

    public async Task<int> DemChuaDocAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.DemChuaDocAsync(nguoiDungId, ct);
    }

    // Admin methods
    public async Task<List<CanhBaoDto>> LayDanhSachTatCaAsync(bool? daDoc = null, CancellationToken ct = default)
    {
        return await _dal.LayDanhSachTatCaAsync(daDoc, ct);
    }

    public async Task<CanhBaoDto?> LayChiTietAdminAsync(int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAdminAsync(id, ct);
    }

    public async Task<bool> XoaAdminAsync(int id, CancellationToken ct = default)
    {
        return await _dal.XoaAdminAsync(id, ct);
    }
}
