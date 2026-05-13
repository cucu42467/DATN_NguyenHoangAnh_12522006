using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class NhacNhoDal : INhacNhoDal
{
    private readonly AppDbContext _context;

    public NhacNhoDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TblNhacnho>> GetByNguoiDungIdAsync(int nguoiDungId)
    {
        return await _context.TblNhacnhos
            .Where(n => n.NguoiDungId == nguoiDungId && n.TrangThai == 1)
            .OrderByDescending(n => n.NgayNhac)
            .ToListAsync();
    }

    public async Task<List<TblNhacnho>> GetDenHanAsync(int nguoiDungId, int truocPhut)
    {
        var thoiGianHienTai = TimeHelper.NowInVietnam();
        var thoiGianBatDau = thoiGianHienTai;
        var thoiGianKetThuc = thoiGianHienTai.AddMinutes(truocPhut);

        // Lấy nhắc nhở có NgayNhac trong khoảng thời gian đến hạn
        var ds = await _context.TblNhacnhos
            .Where(n => n.NguoiDungId == nguoiDungId
                && n.TrangThai == 1
                && n.NgayNhac != null
                && n.NgayNhac >= thoiGianBatDau
                && n.NgayNhac <= thoiGianKetThuc)
            .ToListAsync();

        // Xử lý nhắc nhở lặp lại - tính lại NgayNhac cho phù hợp
        var ketQua = new List<TblNhacnho>();
        
        foreach (var nhac in ds)
        {
            // Kiểm tra nếu là nhắc lặp, tính lại ngày nhắc tiếp theo
            var ngayNhacTiepTheo = TinhNgayNhacTiepTheo(nhac);
            if (ngayNhacTiepTheo.HasValue)
            {
                nhac.NgayNhac = ngayNhacTiepTheo;
            }
            
            // Chỉ thêm vào kết quả nếu trong khoảng thời gian
            if (nhac.NgayNhac >= thoiGianBatDau && nhac.NgayNhac <= thoiGianKetThuc)
            {
                ketQua.Add(nhac);
            }
        }

        return ketQua;
    }

    public async Task<TblNhacnho?> GetByIdAsync(int nhacNhoId)
    {
        return await _context.TblNhacnhos.FindAsync(nhacNhoId);
    }

    public async Task<int> InsertAsync(TblNhacnho nhacNho)
    {
        _context.TblNhacnhos.Add(nhacNho);
        await _context.SaveChangesAsync();
        return nhacNho.NhacNhoId;
    }

    public async Task<bool> UpdateAsync(TblNhacnho nhacNho)
    {
        _context.TblNhacnhos.Update(nhacNho);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(int nhacNhoId)
    {
        var nhac = await _context.TblNhacnhos.FindAsync(nhacNhoId);
        if (nhac == null) return false;

        // Soft delete - chỉ cập nhật trạng thái
        nhac.TrangThai = 0;
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<TblNhacnho>> GetNhacLaiNgayAsync(int nguoiDungId)
    {
        return await _context.TblNhacnhos
            .Where(n => n.NguoiDungId == nguoiDungId
                && n.TrangThai == 1
                && n.LapLai > 0)
            .ToListAsync();
    }

    /// <summary>
    /// Tính ngày nhắc tiếp theo cho nhắc nhở lặp lại
    /// </summary>
    private DateTime? TinhNgayNhacTiepTheo(TblNhacnho nhac)
    {
        if (nhac.NgayNhac == null || nhac.LapLai == 0)
            return nhac.NgayNhac;

        var thoiGianHienTai = TimeHelper.NowInVietnam();
        var ngayNhac = nhac.NgayNhac.Value;

        // Nếu ngày nhắc đã qua, tính lại
        while (ngayNhac < thoiGianHienTai)
        {
            switch ((LoaiLapLai)nhac.LapLai)
            {
                case LoaiLapLai.HangNgay:
                    ngayNhac = ngayNhac.AddDays(1);
                    break;
                case LoaiLapLai.HangTuan:
                    ngayNhac = ngayNhac.AddDays(7);
                    break;
                case LoaiLapLai.HangThang:
                    ngayNhac = ngayNhac.AddMonths(1);
                    break;
                case LoaiLapLai.HangNam:
                    ngayNhac = ngayNhac.AddYears(1);
                    break;
                default:
                    return ngayNhac;
            }
        }

        return ngayNhac;
    }

    // Aliases for BLL compatibility
    public Task<List<TblNhacnho>> LayDanhSachAsync(int nguoiDungId) => GetByNguoiDungIdAsync(nguoiDungId);
    public Task<TblNhacnho?> LayTheoIdAsync(int nhacNhoId) => GetByIdAsync(nhacNhoId);
    public Task<int> TaoMoiAsync(TblNhacnho nhacNho) => InsertAsync(nhacNho);
    public Task<bool> CapNhatAsync(TblNhacnho nhacNho) => UpdateAsync(nhacNho);
    public Task<bool> XoaAsync(int nhacNhoId) => DeleteAsync(nhacNhoId);
    public async Task<bool> CapNhatTrangThaiAsync(int nhacNhoId, int trangThai)
    {
        var nhac = await GetByIdAsync(nhacNhoId);
        if (nhac == null) return false;
        nhac.TrangThai = trangThai;
        return await UpdateAsync(nhac);
    }
    public Task<List<TblNhacnho>> LayDanhSachTatCaAsync(int nguoiDungId) => GetByNguoiDungIdAsync(nguoiDungId);
    public Task<TblNhacnho?> LayTheoIdAdminAsync(int nhacNhoId) => GetByIdAsync(nhacNhoId);
    public Task<bool> XoaAdminAsync(int nhacNhoId) => DeleteAsync(nhacNhoId);
}
