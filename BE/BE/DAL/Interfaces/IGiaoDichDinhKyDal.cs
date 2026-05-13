using DTO;

namespace DAL.Interfaces;

public interface IGiaoDichDinhKyDal
{
    Task<List<GiaoDichDinhKyDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);
    Task<GiaoDichDinhKyDto?> LayTheoIdAsync(int id, int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, int id, TaoGiaoDichDinhKyDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int nguoiDungId, int id, CancellationToken ct = default);

    Task<int> DemDangHoatDongAsync(CancellationToken ct);
    Task<int> DemNgungHoatDongAsync(CancellationToken ct);
    Task<int> DemNguoiDungSuDungAsync(CancellationToken ct);
}

