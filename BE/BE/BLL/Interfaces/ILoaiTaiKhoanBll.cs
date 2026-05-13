using DTO;

namespace BLL.Interfaces;

public interface ILoaiTaiKhoanBll
{
    Task<List<LoaiTaiKhoanDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<LoaiTaiKhoanDto?> LayChiTietAsync(int id, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoLoaiTaiKhoanDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, TaoLoaiTaiKhoanDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}
