using DTO;

namespace DAL.Interfaces;

public interface IImportDal
{
    Task<int> TaoImportAsync(int nguoiDungId, int taiKhoanId, string? tenFile, int tongDong, CancellationToken ct = default);
    Task<ImportFileDto?> LayImportAsync(int nguoiDungId, int importId, CancellationToken ct = default);
    Task<List<ImportChiTietDto>> LayChiTietAsync(int nguoiDungId, int importId, LocImportChiTietDto loc, CancellationToken ct = default);
    Task<int> ThemChiTietAsync(int nguoiDungId, int importId, IEnumerable<ImportChiTietDto> chiTiet, CancellationToken ct = default);
    Task<bool> CapNhatTrangThaiImportAsync(int nguoiDungId, int importId, sbyte trangThai, CancellationToken ct = default);
    Task<bool> DanhDauChiTietDaXuLyAsync(int nguoiDungId, int importId, sbyte trangThaiXuLy, CancellationToken ct = default);

    Task<List<ImportFileDto>> LayDanhSachAdminAsync(int page, int pageSize, sbyte? trangThai, CancellationToken ct = default);
    Task<List<ImportChiTietDto>> LayChiTietAdminAsync(int importId, int page, int pageSize, CancellationToken ct = default);
}
