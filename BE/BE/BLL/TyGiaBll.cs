using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class TyGiaBll : ITyGiaBll
{
    private readonly ITyGiaDal _tyGiaDal;

    public TyGiaBll(ITyGiaDal tyGiaDal)
    {
        _tyGiaDal = tyGiaDal;
    }

    public Task<List<TyGiaDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return _tyGiaDal.LayDanhSachAsync(ct);
    }

    public Task<TyGiaDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return _tyGiaDal.LayTheoIdAsync(id, ct);
    }

    public Task<int> TaoMoiAsync(TaoTyGiaDto dto, CancellationToken ct = default)
    {
        return _tyGiaDal.TaoMoiAsync(dto, ct);
    }

    public Task<bool> CapNhatAsync(int id, TyGiaDto dto, CancellationToken ct = default)
    {
        return _tyGiaDal.CapNhatAsync(id, dto, ct);
    }

    public Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        return _tyGiaDal.XoaAsync(id, ct);
    }
}
