using DTO;

namespace DAL.Interfaces;

public interface IDongGopMucTieuDal
{
    Task<List<DongGopMucTieuDto>> LayDanhSachAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, int mucTieuId, TaoDongGopMucTieuDto dto, CancellationToken ct = default);
}

