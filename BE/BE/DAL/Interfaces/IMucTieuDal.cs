using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DTO;

namespace DAL.Interfaces;

/// <summary>
/// Interface cho bảng mục tiêu (tbl_muctieu)
/// </summary>
public interface IMucTieuDal
{
    /// <summary>
    /// Lấy danh sách mục tiêu của người dùng
    /// </summary>
    Task<List<MucTieuDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default);

    /// <summary>
    /// Lấy chi tiết một mục tiêu
    /// </summary>
    Task<MucTieuDto?> LayChiTietAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);

    /// <summary>
    /// Tạo mới mục tiêu
    /// </summary>
    Task<int> TaoMoiAsync(int nguoiDungId, TaoMucTieuDto dto, CancellationToken ct = default);

    /// <summary>
    /// Cập nhật mục tiêu
    /// </summary>
    Task<bool> CapNhatAsync(int nguoiDungId, int mucTieuId, TaoMucTieuDto dto, CancellationToken ct = default);

    /// <summary>
    /// Xóa mục tiêu (soft delete)
    /// </summary>
    Task<bool> XoaAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);

    /// <summary>
    /// Xóa vĩnh viễn mục tiêu
    /// </summary>
    Task<bool> XoaVinhVienAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default);

    /// <summary>
    /// Lấy danh sách mục tiêu của người dùng (cho thông báo)
    /// </summary>
    Task<List<MucTieuDto>> GetByNguoiDungIdAsync(int nguoiDungId);
}
