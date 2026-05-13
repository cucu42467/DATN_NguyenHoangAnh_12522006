using DTO;

namespace BLL.Interfaces;

public interface ITaiKhoanBll
{
    // User methods
    Task<List<TaiKhoanDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<TaiKhoanDto?> LayChiTietAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int taiKhoanId, TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default);
    Task<bool> XoaAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatTrangThaiAsync(int taiKhoanId, int nguoiDungId, int trangThai, CancellationToken ct = default);
}


