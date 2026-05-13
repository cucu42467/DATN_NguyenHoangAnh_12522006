using DTO;

namespace BLL.Interfaces;

/// <summary>
/// Interface cho GiaoDichService - xử lý thêm giao dịch đầy đủ với 10 bước
/// </summary>
public interface IGiaoDichService
{
    /// <summary>
    /// Thêm mới giao dịch đầy đủ với 10 bước trong 1 transaction
    /// </summary>
    /// <param name="request">Thông tin giao dịch cần tạo</param>
    /// <param name="nguoiDungId">ID người dùng thực hiện</param>
    /// <param name="ipAddress">Địa chỉ IP của client</param>
    /// <param name="ct">CancellationToken</param>
    /// <returns>Response chứa kết quả và các thông báo</returns>
    Task<ThemGiaoDichResponse> ThemGiaoDichDayDuAsync(
        ThemGiaoDichRequest request,
        int nguoiDungId,
        string? ipAddress = null,
        CancellationToken ct = default);

    /// <summary>
    /// Sửa giao dịch đầy đủ với 10 bước trong 1 transaction
    /// Luồng: hoàn tác ảnh hưởng cũ → áp dụng ảnh hưởng mới
    /// </summary>
    /// <param name="request">Thông tin giao dịch cần sửa</param>
    /// <param name="nguoiDungId">ID người dùng thực hiện</param>
    /// <param name="ipAddress">Địa chỉ IP của client</param>
    /// <param name="ct">CancellationToken</param>
    /// <returns>Response chứa kết quả và các thông báo</returns>
    Task<SuaGiaoDichResponse> SuaGiaoDichAsync(
        SuaGiaoDichRequest request,
        int nguoiDungId,
        string? ipAddress = null,
        CancellationToken ct = default);
}
