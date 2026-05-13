using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

/// <summary>
/// Implement ITaiKhoanDal - lấy danh sách tài khoản của người dùng
/// </summary>
public class TaiKhoanDal : ITaiKhoanDal
{
    private readonly AppDbContext _context;

    public TaiKhoanDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaiKhoanDto>> GetByNguoiDungIdAsync(int nguoiDungId)
    {
        return await LayDanhSachTheoNguoiDungAsync(nguoiDungId);
    }

    public async Task<List<TaiKhoanDto>> LayDanhSachTheoNguoiDungAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var entities = await _context.TblTaikhoans
            .Where(t => t.NguoiDungId == nguoiDungId && t.TrangThai == 1)
            .ToListAsync(ct);

        return entities.Select(t => new TaiKhoanDto
        {
            TaiKhoanId = t.TaiKhoanId,
            NguoiDungId = t.NguoiDungId,
            TenTaiKhoan = t.TenTaiKhoan,
            SoDu = t.SoDu ?? 0,
            LoaiTaiKhoan = t.LoaiTaiKhoanId.ToString(),
            TienTe = t.TienTe ?? "VND",
            MauSac = t.MauSac,
            Icon = t.Icon,
            LaMacDinh = t.LaMacDinh,
            MoTa = t.MoTa,
            TenNganHang = t.TenNganHang,
            SoTaiKhoan = t.SoTaiKhoan,
            HanMucTinDung = t.HanMucTinDung,
            NgayCapNhatSoDu = t.NgayCapNhatSoDu
        }).ToList();
    }

    public async Task<TaiKhoanDto?> LayTheoIdAsync(int taiKhoanId, CancellationToken ct = default)
    {
        var t = await _context.TblTaikhoans.FindAsync(new object[] { taiKhoanId }, ct);
        if (t == null) return null;

        return new TaiKhoanDto
        {
            TaiKhoanId = t.TaiKhoanId,
            NguoiDungId = t.NguoiDungId,
            TenTaiKhoan = t.TenTaiKhoan,
            SoDu = t.SoDu ?? 0,
            LoaiTaiKhoan = t.LoaiTaiKhoanId.ToString(),
            TienTe = t.TienTe ?? "VND",
            MauSac = t.MauSac,
            Icon = t.Icon,
            LaMacDinh = t.LaMacDinh,
            MoTa = t.MoTa,
            TenNganHang = t.TenNganHang,
            SoTaiKhoan = t.SoTaiKhoan,
            HanMucTinDung = t.HanMucTinDung,
            NgayCapNhatSoDu = t.NgayCapNhatSoDu
        };
    }

    public async Task<int> TaoMoiAsync(
        TaoTaiKhoanDto dto,
        int nguoiDungId,
        CancellationToken ct = default)
    {
        var entity = new TblTaikhoan
        {
            NguoiDungId = nguoiDungId,

            // ===== THÔNG TIN CƠ BẢN =====
            TenTaiKhoan = dto.TenTaiKhoan,
            LoaiTaiKhoanId = dto.LoaiTaiKhoanId,

            // ===== SỐ DƯ =====
            SoDu = dto.SoDu,
            SoDuBanDau = dto.SoDuBanDau,

            // ===== HIỂN THỊ =====
            TienTe = dto.TienTe ?? "VND",
            MauSac = dto.MauSac,
            Icon = dto.Icon,

            // ===== THÔNG TIN KHÁC =====
            MoTa = dto.MoTa,
            TenNganHang = dto.TenNganHang,
            SoTaiKhoan = dto.SoTaiKhoan,
            HanMucTinDung = dto.HanMucTinDung,

            // ===== TRẠNG THÁI =====
            LaMacDinh = dto.LaMacDinh,
            TrangThai = dto.TrangThai ? (sbyte)1 : (sbyte)0,
            // ===== THỜI GIAN =====
            NgayTao = dto.NgayTao == default
                ? TimeHelper.NowInVietnam()
                : dto.NgayTao,

            NgayCapNhatSoDu = dto.NgayCapNhatSoDu
                ?? TimeHelper.NowInVietnam()
        };

        _context.TblTaikhoans.Add(entity);

        await _context.SaveChangesAsync(ct);

        return entity.TaiKhoanId;
    }
    public async Task<bool> CapNhatAsync(
        int taiKhoanId,
        TaoTaiKhoanDto dto,
        int nguoiDungId,
        CancellationToken ct = default)
    {
        var entity = await _context.TblTaikhoans.FindAsync(
            new object[] { taiKhoanId },
            ct);

        if (entity == null || entity.NguoiDungId != nguoiDungId)
            return false;

        // ===== THÔNG TIN CƠ BẢN =====
        entity.TenTaiKhoan = dto.TenTaiKhoan;
        entity.LoaiTaiKhoanId = dto.LoaiTaiKhoanId;

        // ===== SỐ DƯ =====
        entity.SoDu = dto.SoDu;
        entity.SoDuBanDau = dto.SoDuBanDau;

        // ===== HIỂN THỊ =====
        entity.TienTe = dto.TienTe ?? entity.TienTe;
        entity.MauSac = dto.MauSac;
        entity.Icon = dto.Icon;

        // ===== THÔNG TIN KHÁC =====
        entity.MoTa = dto.MoTa;
        entity.TenNganHang = dto.TenNganHang;
        entity.SoTaiKhoan = dto.SoTaiKhoan;
        entity.HanMucTinDung = dto.HanMucTinDung;

        // ===== TRẠNG THÁI =====
        entity.LaMacDinh = dto.LaMacDinh;

        entity.TrangThai = dto.TrangThai
            ? (sbyte)1
            : (sbyte)0;

        // ===== THỜI GIAN =====
        entity.NgayCapNhatSoDu = TimeHelper.NowInVietnam();

        await _context.SaveChangesAsync(ct);

        return true;
    }

    public async Task<bool> XoaAsync(int taiKhoanId, int nguoiDungId, CancellationToken ct = default)
    {
        var entity = await _context.TblTaikhoans.FindAsync(new object[] { taiKhoanId }, ct);
        if (entity == null || entity.NguoiDungId != nguoiDungId) return false;

        entity.TrangThai = 0;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CapNhatTrangThaiAsync(int taiKhoanId, int nguoiDungId, int trangThai, CancellationToken ct = default)
    {
        var entity = await _context.TblTaikhoans.FindAsync(new object[] { taiKhoanId }, ct);
        if (entity == null || entity.NguoiDungId != nguoiDungId) return false;

        entity.TrangThai = (sbyte)trangThai;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> CapNhatSoDuAsync(int taiKhoanId, decimal soDuMoi, CancellationToken ct = default)
    {
        var entity = await _context.TblTaikhoans.FindAsync(new object[] { taiKhoanId }, ct);
        if (entity == null) return false;

        entity.SoDu = soDuMoi;
        entity.NgayCapNhatSoDu = TimeHelper.NowInVietnam();
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
