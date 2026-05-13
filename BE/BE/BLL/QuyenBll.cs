using DAL.Interfaces;
using DTO;
using DAL;

using BLL.Interfaces;

namespace BLL;

public class QuyenBll : IQuyenBll
{
    private readonly IQuyenDal _quyenDal;
    public QuyenBll(IQuyenDal quyenDal) { _quyenDal = quyenDal; }
    public Task<List<QuyenDto>> LayTatCaAsync() => _quyenDal.LayTatCaAsync();
    public Task<QuyenDto?> LayTheoIdAsync(int id) => _quyenDal.LayTheoIdAsync(id);
    public Task<int> TaoMoiAsync(QuyenDto dto) => _quyenDal.TaoMoiAsync(dto);
    public Task<bool> XoaAsync(int id) => _quyenDal.XoaAsync(id);
}
