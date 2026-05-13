using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class CauHinhBll : ICauHinhBll
{
    private readonly ICauHinhDal _cauHinhDal;

    public CauHinhBll(ICauHinhDal cauHinhDal)
    {
        _cauHinhDal = cauHinhDal;
    }

    public Task<List<CauHinhHeThongDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return _cauHinhDal.LayDanhSachAsync(ct);
    }

    public Task<CauHinhHeThongDto?> LayTheoIdAsync(int id, CancellationToken ct = default)
    {
        return _cauHinhDal.LayTheoIdAsync(id, ct);
    }

    public Task<bool> CapNhatAsync(int id, CauHinhHeThongDto dto, CancellationToken ct = default)
    {
        return _cauHinhDal.CapNhatAsync(id, dto, ct);
    }
}
