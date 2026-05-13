using BLL.Interfaces;
using DAL.Interfaces;
using DTO;

namespace BLL;

public class TuKhoaBll : ITuKhoaBll
{
    private readonly ITuKhoaDal _dal;

    public TuKhoaBll(ITuKhoaDal dal)
    {
        _dal = dal;
    }

    public async Task<List<TuKhoaDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        return await _dal.LayDanhSachAsync(nguoiDungId, ct);
    }

    public async Task<TuKhoaDto?> LayChiTietAsync(int id, CancellationToken ct = default)
    {
        return await _dal.LayTheoIdAsync(id, ct);
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        return await _dal.TaoMoiAsync(nguoiDungId, dto, ct);
    }

    public async Task<bool> CapNhatAsync(int id, TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        return await _dal.CapNhatAsync(id, dto, ct);
    }

    public async Task<bool> XoaAsync(int id, CancellationToken ct = default)
    {
        return await _dal.XoaAsync(id, ct);
    }
}
