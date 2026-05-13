using DTO;

namespace DAL.Interfaces;

public interface ICaiDatDal
{
    Task<CaiDatDto?> LayTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default);
    Task<int> TaoMoiAsync(int nguoiDungId, CancellationToken ct = default);
    Task<bool> CapNhatAsync(int nguoiDungId, TaoCaiDatDto dto, CancellationToken ct = default);
    
    // Thông báo - lấy tất cả user có bật thông báo
    Task<List<CaiDatDto>> GetAllWithThongBaoBatAsync();
}
