using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class TepDinhKemBll : ITepDinhKemBll
{
    private readonly ITepDinhKemDal _dal;

    public TepDinhKemBll(ITepDinhKemDal dal)
    {
        _dal = dal;
    }

    public async Task<List<TepDinhKemDto>> LayDanhSachAsync(CancellationToken ct = default)
    {
        return await _dal.LayDanhSachAsync(ct);
    }

    public async Task<TepDinhKemDto?> LayChiTietAsync(int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAsync(id, ct);
    }

    public async Task<int> TaoMoiAsync(TaoTepDinhKemDto dto, CancellationToken ct = default)
    {
        return await _dal.TaoMoiAsync(dto, ct);
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        return await _dal.XoaAsync(id, ct);
    }

}
