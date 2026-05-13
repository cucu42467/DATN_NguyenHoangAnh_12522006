using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class ThongBaoDal : IThongBaoDal
{
    private readonly AppDbContext _context;

    public ThongBaoDal(AppDbContext context)
    {
        _context = context;
    }

    #region CRUD Thông báo


    public async Task<List<TblThongbao>> GetDanhSachAsync(
    int nguoiDungId,
    ThongBaoLocDto? loc = null)
    {
        try
        {
            // =========================
            // Khởi tạo query
            // =========================
            var query = _context.TblThongbaos
                .AsNoTracking()
                .Where(t => t.NguoiDungId == nguoiDungId)
                .AsQueryable();

            // =========================
            // Giá trị mặc định phân trang
            // =========================
            int trang = Math.Max(loc?.Trang ?? 1, 1);
            int tongDong = Math.Max(loc?.TongDong ?? 20, 1);

            // =========================
            // Điều kiện lọc
            // =========================
            if (loc != null)
            {
                // Lọc theo loại thông báo
                if (loc.LoaiThongBao.HasValue)
                {
                    query = query.Where(t =>
                        t.LoaiThongBao == loc.LoaiThongBao.Value);
                }

                // Lọc đã đọc / chưa đọc
                if (loc.DaDoc.HasValue)
                {
                    query = query.Where(t =>
                        t.DaDoc == (loc.DaDoc.Value ? 1 : 0));
                }

                // Lọc từ ngày
                if (loc.TuNgay.HasValue)
                {
                    query = query.Where(t =>
                        t.NgayTao >= loc.TuNgay.Value);
                }

                // Lọc đến ngày
                if (loc.DenNgay.HasValue)
                {
                    query = query.Where(t =>
                        t.NgayTao <= loc.DenNgay.Value);
                }

                // Tìm kiếm tiêu đề / nội dung
                if (!string.IsNullOrWhiteSpace(loc.TuKhoa))
                {
                    string tuKhoa = loc.TuKhoa.Trim().ToLower();

                    query = query.Where(t =>
                        t.TieuDe.ToLower().Contains(tuKhoa) ||
                        t.NoiDung.ToLower().Contains(tuKhoa));
                }
            }

            // =========================
            // Chỉ lấy thông báo còn hạn
            // =========================
            query = query.Where(t =>
                t.NgayHetHan == null ||
                t.NgayHetHan > DateTime.Now);

            // =========================
            // Sắp xếp + phân trang
            // =========================
            var data = await query
                .OrderByDescending(t => t.NgayTao)
                .Skip((trang - 1) * tongDong)
                .Take(tongDong)
                .ToListAsync();

            return data;
        }
        catch (Exception ex)
        {
            throw new Exception(
                $"Lỗi lấy danh sách thông báo: {ex.Message}",
                ex);
        }
    }

    public async Task<TblThongbao?> GetByIdAsync(int id)
    {
        return await _context.TblThongbaos.FindAsync(id);
    }

    public async Task<int> InsertAsync(TblThongbao thongBao)
    {
        thongBao.NgayTao = TimeHelper.NowInVietnam();
        _context.TblThongbaos.Add(thongBao);
        await _context.SaveChangesAsync();
        return thongBao.ThongBaoId;
    }

    public async Task UpdateAsync(TblThongbao thongBao)
    {
        _context.TblThongbaos.Update(thongBao);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var tb = await _context.TblThongbaos.FindAsync(id);
        if (tb != null)
        {
            _context.TblThongbaos.Remove(tb);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> DemChuaDocAsync(int nguoiDungId)
    {
        return await _context.TblThongbaos
            .CountAsync(t =>
                t.NguoiDungId == nguoiDungId
                && t.DaDoc == 0
                && (t.NgayHetHan == null || t.NgayHetHan > DateTime.Now));
    }

    public async Task MarkDaDocAsync(int thongBaoId)
    {
        var tb = await _context.TblThongbaos.FindAsync(thongBaoId);

        if (tb != null)
        {
            tb.DaDoc = 1;

            await _context.SaveChangesAsync();
        }
    }

    public async Task MarkAllDaDocAsync(int nguoiDungId)
    {
        var danhSach = await _context.TblThongbaos
            .Where(t =>
                t.NguoiDungId == nguoiDungId &&
                t.DaDoc == 0)
            .ToListAsync();

        foreach (var tb in danhSach)
        {
            tb.DaDoc = 1;
        }

        await _context.SaveChangesAsync();
    }

    #endregion

    #region Theo dõi đã gửi (tránh trùng)

    public async Task<bool> DaGuiGanDayAsync(int nguoiDungId, string loaiThongBao, int? thamChieuId, TimeSpan khoangThoiGian)
    {
        var thoiGianToiThieu = TimeHelper.NowInVietnam().Subtract(khoangThoiGian);

        var query = _context.TblDaguiThongbaos
            .Where(d => d.NguoiDungId == nguoiDungId
                && d.LoaiThongBao == loaiThongBao
                && d.ThoiGianGui >= thoiGianToiThieu);

        // Nếu có tham chiếu cụ thể (VD: TaiKhoanId cụ thể)
        if (thamChieuId.HasValue)
        {
            query = query.Where(d => d.ThamChieuId == thamChieuId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task InsertDaGuiAsync(TblDaguiThongbao daGui)
    {
        daGui.ThoiGianGui = TimeHelper.NowInVietnam();
        _context.TblDaguiThongbaos.Add(daGui);
        await _context.SaveChangesAsync();
    }

    public async Task<List<TblDaguiThongbao>> GetDaGuiAsync(int nguoiDungId, string loaiThongBao)
    {
        return await _context.TblDaguiThongbaos
            .Where(d => d.NguoiDungId == nguoiDungId && d.LoaiThongBao == loaiThongBao)
            .OrderByDescending(d => d.ThoiGianGui)
            .ToListAsync();
    }

    #endregion

    #region Thông báo hệ thống

    public async Task<List<TblThongbaoHeThong>> GetThongBaoHeThongAsync()
    {
        return await _context.TblThongbaoHeThongs
            .Where(t => t.NgayHetHan == null || t.NgayHetHan > DateTime.Now)
            .OrderByDescending(t => t.NgayGui)
            .ToListAsync();
    }

    #endregion

    #region Aliases for BLL compatibility

    public Task<List<TblThongbao>> LayDanhSachAsync(int nguoiDungId, ThongBaoLocDto? loc = null)
        => GetDanhSachAsync(nguoiDungId, loc);

    public Task<TblThongbao?> LayTheoIdAsync(int id) => GetByIdAsync(id);

    public async Task<int> TaoMoiAsync(TaoThongBaoDto taoThongBaoDto, CancellationToken ct = default)
    {
        var thongBao = new TblThongbao
        {
            NguoiDungId = taoThongBaoDto.NguoiDungId,
            TieuDe = taoThongBaoDto.TieuDe,
            NoiDung = taoThongBaoDto.NoiDung,
            LoaiThongBao = taoThongBaoDto.LoaiThongBao,
            NgayHetHan = taoThongBaoDto.NgayHetHan,
            DaDoc = 0
        };

        thongBao.NgayTao = TimeHelper.NowInVietnam();

        _context.TblThongbaos.Add(thongBao);
        await _context.SaveChangesAsync(ct);

        return thongBao.ThongBaoId;
    }

    public async Task<bool> DanhDauDaDocAsync(int thongBaoId)
    {
        var tb = await _context.TblThongbaos.FindAsync(thongBaoId);

        if (tb == null)
            return false;

        tb.DaDoc = 1;

        await _context.SaveChangesAsync();

        return true;
    }

    public Task<int> DemChuaDocAsync(int nguoiDungId, int? thang = null, int? nam = null)
        => DemChuaDocAsync(nguoiDungId);

    public Task<bool> XoaAsync(int id)
    {
        var tb = _context.TblThongbaos.Find(id);
        if (tb != null)
        {
            _context.TblThongbaos.Remove(tb);
            _context.SaveChanges();
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public async Task<List<TblThongbao>> LayDanhSachTatCaAsync(ThongBaoLocDto? loc = null)
    {
        return await _context.TblThongbaos
            .AsNoTracking()
            .OrderByDescending(t => t.NgayTao)
            .Take(1000)
            .ToListAsync();
    }

    public Task<TblThongbao?> LayTheoIdAdminAsync(int id) => GetByIdAsync(id);

    public Task<object> LayThongKeThongBaoAsync()
    {
        var total = _context.TblThongbaos.Count();

        var daDoc = _context.TblThongbaos
            .Count(t => t.DaDoc == 1);

        return Task.FromResult<object>(new
        {
            TongSo = total,
            DaDoc = daDoc,
            ChuaDoc = total - daDoc
        });
    }
    #endregion
}
