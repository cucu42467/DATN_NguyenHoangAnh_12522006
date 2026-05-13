using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class PhienBll : IPhienBll
{
    private readonly IPhienDal _phienDal;

    public PhienBll(IPhienDal phienDal)
    {
        _phienDal = phienDal;
    }

    public Task<List<SessionDto>> LayDanhSachAsync(int? userId, CancellationToken ct = default)
    {
        return _phienDal.LayDanhSachAsync(userId, ct);
    }

    public Task<bool> ThuHoiAsync(int sessionId, CancellationToken ct = default)
    {
        return _phienDal.ThuHoiAsync(sessionId, ct);
    }

    public Task ThuHoiTatCaAsync(int userId, CancellationToken ct = default)
    {
        return _phienDal.ThuHoiTatCaAsync(userId, ct);
    }

    public Task<bool> XoaAsync(int sessionId, CancellationToken ct = default)
    {
        return _phienDal.XoaAsync(sessionId, ct);
    }
}
