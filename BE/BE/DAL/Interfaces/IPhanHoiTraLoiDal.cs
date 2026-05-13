using DTO;

namespace DAL.Interfaces;

public interface IPhanHoiTraLoiDal
{
    Task<List<PhanHoiTraloiDto>> LayDanhSachTheoPhanHoiIdAsync(int phanHoiId, CancellationToken ct = default);
    Task<int> TaoTraLoiAsync(int phanHoiId, int nguoiGuiId, string noiDung, CancellationToken ct = default);
    Task<int> DemTraLoiChuaDocAsync(int nguoiDungId, CancellationToken ct = default);
    Task<List<PhanHoiDto>> LayDanhSachPhanHoiCuaToiAsync(int nguoiDungId, CancellationToken ct = default);
    Task<bool> DanhDauDaDocAsync(int phanHoiId, int nguoiDungId, CancellationToken ct = default);
    Task<bool> DanhDauTatCaDaDocAsync(int nguoiDungId, CancellationToken ct = default);
}
