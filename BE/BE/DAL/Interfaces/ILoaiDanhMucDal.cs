using DTO;

namespace DAL.Interfaces;

public interface ILoaiDanhMucDal
{
    Task<List<LoaiDanhMucDto>> LayDanhSachAsync(CancellationToken ct = default);
    Task<LoaiDanhMucDto?> LayTheoIdAsync(int id, CancellationToken ct = default);
    Task<LoaiDanhMucDto?> LayTheoDanhMucIdAsync(int danhMucId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(TaoLoaiDanhMucDto dto, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int id, TaoLoaiDanhMucDto dto, CancellationToken ct = default);
    Task<bool> XoaAsync(int id, CancellationToken ct = default);
}

