using BLL.Interfaces;
using Common;
using DTO;

namespace BLL;

/// <summary>
/// Business Logic Layer cho Tổng quan - sử dụng MemoryCache để tối ưu
/// TongQuanBll query nhiều bảng: GiaoDich, TaiKhoan, NganSach, MucTieu
/// </summary>
public class TongQuanBll : ITongQuanBll
{
    private readonly IGiaoDichBll _giaoDichBll;
    private readonly ITaiKhoanBll _taiKhoanBll;
    private readonly INganSachBll _nganSachBll;
    private readonly IMucTieuBll _mucTieuBll;
    private readonly ICacheService _cache;

    public TongQuanBll(
        IGiaoDichBll giaoDichBll, 
        ITaiKhoanBll taiKhoanBll,
        INganSachBll nganSachBll,
        IMucTieuBll mucTieuBll,
        ICacheService cache)
    {
        _giaoDichBll = giaoDichBll;
        _taiKhoanBll = taiKhoanBll;
        _nganSachBll = nganSachBll;
        _mucTieuBll = mucTieuBll;
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
    }

    public async Task<TongQuanDto> LayTongQuanAsync(int nguoiDungId, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        // Xác định khoảng thời gian
        var thangHienTai = tuNgay?.Month ?? DateTime.Now.Month;
        var namHienTai = tuNgay?.Year ?? DateTime.Now.Year;
        
        if (!tuNgay.HasValue)
            tuNgay = new DateTime(namHienTai, thangHienTai, 1);
        if (!denNgay.HasValue)
            denNgay = tuNgay.Value.AddMonths(1).AddDays(-1).Date.AddDays(1);

        // Tạo cache key duy nhất
        var cacheKey = $"app:tong-quan:{nguoiDungId}:{tuNgay.Value:yyyyMM}:{denNgay.Value:yyyyMM}";

        return await _cache.GetOrSetAsync(
            cacheKey,
            async () => await LayTongQuanDataAsync(nguoiDungId, tuNgay, denNgay, thangHienTai, namHienTai, ct),
            CacheExpirationOptions.ShortTerm  // 5 phút - dashboard thay đổi thường xuyên
        );
    }

    /// <summary>
    /// Lấy dữ liệu thực tế từ database (không cache)
    /// </summary>
    private async Task<TongQuanDto> LayTongQuanDataAsync(int nguoiDungId, DateTime? tuNgay, DateTime? denNgay, int thangHienTai, int namHienTai, CancellationToken ct)
    {
        var filterThang = new LocGiaoDichDto
        {
            TuNgay = tuNgay,
            DenNgay = denNgay,
            PageSize = 1000
        };

        var giaoDichsResponse = await _giaoDichBll.LayDanhSachAsync(nguoiDungId, filterThang, 1, 1000, ct);
        var giaoDichs = giaoDichsResponse.Items;

        decimal tongThu = 0, tongChi = 0;
        foreach (var gd in giaoDichs)
        {
            if (int.Parse(gd.LoaiGiaoDich) == 1)
                tongThu += gd.SoTien;
            else if (int.Parse(gd.LoaiGiaoDich) == 2)
                tongChi += gd.SoTien;
        }

        var taiKhoans = await _taiKhoanBll.LayDanhSachAsync(nguoiDungId, ct);
        decimal soDuThuan = taiKhoans.Sum(tk => tk.SoDu);

        // Biểu đồ theo tháng
        var bieuDo = new List<ThongKeThangDto>();
        var current = tuNgay!.Value;
        while (current <= denNgay!.Value)
        {
            var tuNgayThang = new DateTime(current.Year, current.Month, 1);
            var denNgayThang = tuNgayThang.AddMonths(1).AddSeconds(-1).Date.AddDays(1);

            var filterThangChart = new LocGiaoDichDto
            {
                TuNgay = tuNgayThang,
                DenNgay = denNgayThang,
                PageSize = 1000
            };

            var giaoDichThangResponse = await _giaoDichBll.LayDanhSachAsync(nguoiDungId, filterThangChart, 1, 1000, ct);
            var giaoDichThang = giaoDichThangResponse.Items;

            decimal thuThang = 0, chiThang = 0;
            foreach (var gd in giaoDichThang)
            {
                if (int.Parse(gd.LoaiGiaoDich) == 1)
                    thuThang += gd.SoTien;
                else if (int.Parse(gd.LoaiGiaoDich) == 2)
                    chiThang += gd.SoTien;
            }

            bieuDo.Add(new ThongKeThangDto
            {
                Thang = current.Month,
                Nam = current.Year,
                TongChi = chiThang,
                TongThu = thuThang
            });

            current = tuNgayThang.AddMonths(1);
        }

        // Biểu đồ danh mục
        var bieuDoDanhMuc = giaoDichs
            .Where(g => int.Parse(g.LoaiGiaoDich) == 2 && g.DanhMucId.HasValue && !string.IsNullOrEmpty(g.TenDanhMuc))
            .GroupBy(g => new { g.DanhMucId, g.TenDanhMuc })
            .Select(g => new ThongKeDanhMucDto
            {
                TenDanhMuc = g.Key.TenDanhMuc!,
                TongTien = g.Sum(x => x.SoTien)
            })
            .OrderByDescending(x => x.TongTien)
            .Take(5)
            .ToList();

        // Ngân sách
        var danhSachNganSach = await _nganSachBll.LayDanhSachAsync(nguoiDungId, thangHienTai, namHienTai, ct);
        var nganSachTomTat = danhSachNganSach.Select(ns => new NganSachTomTatDto
        {
            NganSachId = ns.NganSachId,
            TenDanhMuc = ns.TenDanhMuc,
            HanMuc = ns.HanMuc,
            DaDung = ns.DaDung,
            MauSac = ns.MauSac
        }).ToList();

        // Mục tiêu
        var danhSachMucTieu = await _mucTieuBll.LayDanhSachAsync(nguoiDungId, ct);
        var mucTieuTomTat = danhSachMucTieu
            .Where(m => m.TrangThai == 1 || m.TrangThai == null)
            .Select(m => new MucTieuTomTatDto
            {
                MucTieuId = m.MucTieuId,
                TenMucTieu = m.TenMucTieu,
                SoTienMucTieu = m.SoTienMucTieu,
                SoTienHienTai = m.SoTienHienTai,
                MauSac = m.MauSac
            }).ToList();

        return new TongQuanDto
        {
            TongThu = tongThu,
            TongChi = tongChi,
            SoDuThuan = soDuThuan,
            SoGiaoDich = giaoDichs.Count,
            BieuDoChiTieu = bieuDo,
            BieuDoDanhMuc = bieuDoDanhMuc,
            DanhSachNganSach = nganSachTomTat,
            DanhSachMucTieu = mucTieuTomTat
        };
    }

    /// <summary>
    /// Xóa cache tổng quan - gọi sau khi CRUD giao dịch/tài khoản
    /// </summary>
    public async Task InvalidateCacheAsync(int nguoiDungId)
    {
        // Xóa cache hiện tại và vài tháng gần đây
        var now = DateTime.Now;
        for (int i = -1; i <= 2; i++)
        {
            var d = now.AddMonths(i);
            var cacheKey = $"app:tong-quan:{nguoiDungId}:{d:yyyyMM01}:{d:yyyyMM28}";
            await _cache.RemoveAsync(cacheKey);
        }
    }
}
