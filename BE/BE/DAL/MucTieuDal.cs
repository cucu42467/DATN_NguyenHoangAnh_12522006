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
/// Implement IMucTieuDal - CRUD đầy đủ cho bảng mục tiêu
/// </summary>
public class MucTieuDal : IMucTieuDal
{
    private readonly AppDbContext _context;

    public MucTieuDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MucTieuDto>> LayDanhSachAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var entities = await _context.TblMuctieus
            .Where(m => m.NguoiDungId == nguoiDungId && m.TrangThai == 1)
            .OrderByDescending(m => m.UuTien)
            .ThenBy(m => m.NgayKetThuc)
            .ToListAsync(ct);

        return entities.Select(MapToDto).ToList();
    }

    public async Task<MucTieuDto?> LayChiTietAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var entity = await _context.TblMuctieus
            .FirstOrDefaultAsync(m => m.MucTieuId == mucTieuId && m.NguoiDungId == nguoiDungId && m.TrangThai == 1, ct);

        return entity != null ? MapToDto(entity) : null;
    }

    public async Task<int> TaoMoiAsync(int nguoiDungId, TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var entity = new TblMuctieu
        {
            NguoiDungId = nguoiDungId,
            TenMucTieu = dto.TenMucTieu,
            MoTa = dto.MoTa,
            UuTien = dto.UuTien ?? 2,
            SoTienMucTieu = dto.SoTienMucTieu,
            SoTienHienTai = 0,
            NgayBatDau = dto.NgayBatDau ?? TimeHelper.NowInVietnam(),
            NgayKetThuc = dto.NgayKetThuc,
            Icon = dto.Icon,
            MauSac = dto.MauSac,
            TrangThai = 1,
            TaiKhoanId = dto.TaiKhoanId
        };

        _context.TblMuctieus.Add(entity);
        await _context.SaveChangesAsync(ct);

        return entity.MucTieuId;
    }

    public async Task<bool> CapNhatAsync(int nguoiDungId, int mucTieuId, TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var entity = await _context.TblMuctieus
            .FirstOrDefaultAsync(m => m.MucTieuId == mucTieuId && m.NguoiDungId == nguoiDungId && m.TrangThai == 1, ct);

        if (entity == null) return false;

        entity.TenMucTieu = dto.TenMucTieu;
        entity.MoTa = dto.MoTa;
        entity.UuTien = dto.UuTien ?? 2;
        entity.SoTienMucTieu = dto.SoTienMucTieu;
        entity.NgayBatDau = dto.NgayBatDau ?? entity.NgayBatDau;
        entity.NgayKetThuc = dto.NgayKetThuc;
        entity.Icon = dto.Icon;
        entity.MauSac = dto.MauSac;
        entity.TaiKhoanId = dto.TaiKhoanId;

        return await _context.SaveChangesAsync(ct) > 0;
    }

    public async Task<bool> XoaAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var entity = await _context.TblMuctieus
            .FirstOrDefaultAsync(m => m.MucTieuId == mucTieuId && m.NguoiDungId == nguoiDungId && m.TrangThai == 1, ct);

        if (entity == null) return false;

        entity.TrangThai = 0; // Soft delete
        return await _context.SaveChangesAsync(ct) > 0;
    }

    public async Task<bool> XoaVinhVienAsync(int nguoiDungId, int mucTieuId, CancellationToken ct = default)
    {
        var entity = await _context.TblMuctieus
            .FirstOrDefaultAsync(m => m.MucTieuId == mucTieuId && m.NguoiDungId == nguoiDungId, ct);

        if (entity == null) return false;

        _context.TblMuctieus.Remove(entity);
        return await _context.SaveChangesAsync(ct) > 0;
    }

    public async Task<List<MucTieuDto>> GetByNguoiDungIdAsync(int nguoiDungId)
    {
        // Alias cho LayDanhSachAsync - dùng cho thông báo
        return await LayDanhSachAsync(nguoiDungId);
    }

    private MucTieuDto MapToDto(TblMuctieu m)
    {
        var soTienHienTai = m.SoTienHienTai ?? 0;
        return new MucTieuDto
        {
            MucTieuId = m.MucTieuId,
            NguoiDungId = m.NguoiDungId,
            TenMucTieu = m.TenMucTieu,
            MoTa = m.MoTa,
            UuTien = m.UuTien,
            SoTienMucTieu = m.SoTienMucTieu,
            SoTienHienTai = soTienHienTai,
            SoTienDaDat = soTienHienTai,
            NgayBatDau = m.NgayBatDau,
            NgayKetThuc = m.NgayKetThuc,
            Icon = m.Icon,
            MauSac = m.MauSac,
            TrangThai = m.TrangThai,
            TaiKhoanId = m.TaiKhoanId,
            Anh = m.Anh,
            PhanTramHoanThanh = m.SoTienMucTieu > 0
                ? Math.Round((double)(soTienHienTai / m.SoTienMucTieu) * 100, 1)
                : 0
        };
    }
}
