using DTO;
using Microsoft.AspNetCore.Http;

namespace BLL.Interfaces;

public interface IImportBll
{
    Task<TaoImportPhanHoiDto> TaiLenAsync(int nguoiDungId, int taiKhoanId, IFormFile file, string? dinhDang, CancellationToken ct = default);
    Task<ImportFileDto?> LayImportAsync(int nguoiDungId, int importId, CancellationToken ct = default);
    Task<List<ImportChiTietDto>> LayChiTietAsync(int nguoiDungId, int importId, LocImportChiTietDto loc, CancellationToken ct = default);
    Task<bool> XacNhanAsync(int nguoiDungId, int importId, CancellationToken ct = default);
    Task<bool> HuyAsync(int nguoiDungId, int importId, CancellationToken ct = default);

    Task<List<ImportFileDto>> LayDanhSachAdminAsync(int page, int pageSize, sbyte? trangThai, CancellationToken ct = default);
    Task<List<ImportChiTietDto>> LayChiTietAdminAsync(int importId, int page, int pageSize, CancellationToken ct = default);
}
