using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class VaiTroBll : IVaiTroBll
{
    private readonly IVaiTroDal _dal;

    public VaiTroBll(IVaiTroDal dal)
    {
        _dal = dal;
    }

    public Task<List<VaiTroDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return _dal.LayDanhSachAsync(ct);
    }

    public Task<VaiTroDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return _dal.LayTheoIdAsync(id, ct);
    }

    public Task<int> TaoMoiAsync(TaoVaiTroDto dto, CancellationToken ct = default)
    {
        return _dal.TaoMoiAsync(dto, ct);
    }

    public Task<bool> CapNhatAsync(int id, VaiTroDto dto, CancellationToken ct = default)
    {
        return _dal.CapNhatAsync(id, dto, ct);
    }

    public Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        return _dal.XoaAsync(id, ct);
    }
}
