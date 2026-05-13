using DTO;

namespace BLL.Interfaces;

public interface ITongQuanBll
{
    Task<TongQuanDto> LayTongQuanAsync(int nguoiDungId, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default);
}
