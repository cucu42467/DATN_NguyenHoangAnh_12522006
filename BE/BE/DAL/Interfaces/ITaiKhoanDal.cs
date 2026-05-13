using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using DTO;
using Models;

namespace DAL.Interfaces;

/// <summary>
/// Interface cho bảng tài khoản (tbl_taikhoan)
/// </summary>
public interface ITaiKhoanDal
{
    /// <summary>
    /// Lấy danh sách tài khoản của người dùng
    /// </summary>
    Task<List<TaiKhoanDto>> GetByNguoiDungIdAsync(int nguoiDungId);

    Task<List<TaiKhoanDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default);

    Task<TaiKhoanDto?> LayTheoIdAsync(int taiKhoanId, CancellationToken ct = default);

    Task<int> TaoMoiAsync(TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default);

    Task<bool> CapNhatAsync(int taiKhoanId, TaoTaiKhoanDto dto, int nguoiDungId, CancellationToken ct = default);

    Task<bool> XoaAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default);

    Task<bool> CapNhatTrangThaiAsync(int taiKhoanId, int nguoiDungId, int trangThai, CancellationToken ct = default);

    Task<bool> CapNhatSoDuAsync(int taiKhoanId, decimal soDuMoi, CancellationToken ct = default);
}
