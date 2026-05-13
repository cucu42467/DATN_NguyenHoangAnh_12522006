using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO;
using Models;

namespace DAL.Interfaces;

/// <summary>
/// DAL interface cho bảng nhắc nhở (tbl_nhacnho)
/// </summary>
public interface INhacNhoDal
{
    /// <summary>
    /// Lấy danh sách nhắc nhở của người dùng
    /// </summary>
    Task<List<TblNhacnho>> GetByNguoiDungIdAsync(int nguoiDungId);

    /// <summary>
    /// Lấy nhắc nhở đến hạn trong N phút tới (cho thông báo tự động)
    /// </summary>
    Task<List<TblNhacnho>> GetDenHanAsync(int nguoiDungId, int truocPhut);

    /// <summary>
    /// Lấy chi tiết một nhắc nhở
    /// </summary>
    Task<TblNhacnho?> GetByIdAsync(int nhacNhoId);

    /// <summary>
    /// Tạo mới nhắc nhở
    /// </summary>
    Task<int> InsertAsync(TblNhacnho nhacNho);

    /// <summary>
    /// Cập nhật nhắc nhở
    /// </summary>
    Task<bool> UpdateAsync(TblNhacnho nhacNho);

    /// <summary>
    /// Xóa nhắc nhở
    /// </summary>
    Task<bool> DeleteAsync(int nhacNhoId);

    /// <summary>
    /// Lấy nhắc nhở lặp lại hàng ngày (cần tính lại NgayNhac)
    /// </summary>
    Task<List<TblNhacnho>> GetNhacLaiNgayAsync(int nguoiDungId);

    // Aliases for BLL compatibility
    Task<List<TblNhacnho>> LayDanhSachAsync(int nguoiDungId);
    Task<TblNhacnho?> LayTheoIdAsync(int nhacNhoId);
    Task<int> TaoMoiAsync(TblNhacnho nhacNho);
    Task<bool> CapNhatAsync(TblNhacnho nhacNho);
    Task<bool> XoaAsync(int nhacNhoId);
    Task<bool> CapNhatTrangThaiAsync(int nhacNhoId, int trangThai);
    Task<List<TblNhacnho>> LayDanhSachTatCaAsync(int nguoiDungId);
    Task<TblNhacnho?> LayTheoIdAdminAsync(int nhacNhoId);
    Task<bool> XoaAdminAsync(int nhacNhoId);
}
