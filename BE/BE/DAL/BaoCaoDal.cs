using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models.Data;

namespace DAL;

public class BaoCaoDal : IBaoCaoDal
{
    private readonly AppDbContext _context;

    public BaoCaoDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BaoCaoTongHopChiSoDto> LayTongHopChiSoAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        var (fromDate, toDate) = TinhKhoangThoiGian(duration, thang, nam, tuNgay, denNgay);

        var query = _context.TblGiaodiches.AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId && x.NgayGiaoDich >= fromDate && x.NgayGiaoDich <= toDate && x.TrangThai == 1);

        // LoaiGiaoDich: 1=THU, 2=CHI, 3=CHUYEN_KHOAN
        var tongThu = await query.Where(x => x.LoaiGiaoDich == 1).SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;
        var tongChi = await query.Where(x => x.LoaiGiaoDich == 2).SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;
        var soGd = await query.CountAsync(ct);

        return new BaoCaoTongHopChiSoDto
        {
            TongThu = tongThu,
            TongChi = tongChi,
            SoGiaoDich = soGd
        };
    }

    public async Task<BaoCaoTongQuanDto> LayBieuDoTongQuanAsync(int nguoiDungId, string duration, int? thang, int? nam, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        var (fromDate, toDate) = TinhKhoangThoiGian(duration, thang, nam, tuNgay, denNgay);
        
        var d = duration?.Trim().ToLowerInvariant();
        var totalDays = (toDate - fromDate).TotalDays;
        
        // Xác định labels và data points dựa trên khoảng cách ngày
        List<string> labels;
        List<(int year, int month, int day)> timePoints;
        
        if (totalDays <= 14 || d == "week")
        {
            // Hiển thị theo ngày
            labels = new List<string>();
            timePoints = new List<(int, int, int)>();
            var current = fromDate.Date;
            while (current <= toDate.Date)
            {
                labels.Add(current.ToString("dd/MM"));
                timePoints.Add((current.Year, current.Month, current.Day));
                current = current.AddDays(1);
            }
        }
        else if (totalDays > 180 || d == "year")
        {
            // Hiển thị theo tháng
            labels = new List<string>();
            timePoints = new List<(int, int, int)>();
            var current = new DateTime(fromDate.Year, fromDate.Month, 1);
            var endMonth = new DateTime(toDate.Year, toDate.Month, 1);
            while (current <= endMonth)
            {
                labels.Add($"{current.Month:00}/{current.Year}");
                timePoints.Add((current.Year, current.Month, 1));
                current = current.AddMonths(1);
            }
        }
        else
        {
            // Hiển thị theo tuần (2-6 tháng)
            labels = new List<string>();
            timePoints = new List<(int, int, int)>();
            var current = fromDate.Date;
            int weekNum = 1;
            while (current <= toDate.Date)
            {
                labels.Add($"Tuần {weekNum}");
                timePoints.Add((current.Year, current.Month, current.Day));
                current = current.AddDays(7);
                weekNum++;
            }
        }

        // Query dữ liệu
        List<(int year, int month, int day, sbyte loai, decimal tong)> data;
        
        if (totalDays <= 14 || d == "week")
        {
            // Group theo ngày
            var rawData = await _context.TblGiaodiches.AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId 
                         && x.NgayGiaoDich >= fromDate 
                         && x.NgayGiaoDich <= toDate
                         && x.TrangThai == 1)
                .GroupBy(x => new { x.NgayGiaoDich.Year, x.NgayGiaoDich.Month, x.NgayGiaoDich.Day, x.LoaiGiaoDich })
                .Select(g => new { g.Key.Year, g.Key.Month, g.Key.Day, g.Key.LoaiGiaoDich, Tong = g.Sum(x => x.SoTien) })
                .ToListAsync(ct);
            
            data = rawData.Select(x => (x.Year, x.Month, x.Day, x.LoaiGiaoDich, x.Tong)).ToList();
        }
        else if (totalDays > 180 || d == "year")
        {
            // Group theo tháng
            var rawData = await _context.TblGiaodiches.AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId 
                         && x.NgayGiaoDich >= fromDate 
                         && x.NgayGiaoDich <= toDate
                         && x.TrangThai == 1)
                .GroupBy(x => new { x.NgayGiaoDich.Year, x.NgayGiaoDich.Month, x.LoaiGiaoDich })
                .Select(g => new { g.Key.Year, g.Key.Month, g.Key.LoaiGiaoDich, Tong = g.Sum(x => x.SoTien) })
                .ToListAsync(ct);
            
            data = rawData.Select(x => (x.Year, x.Month, x.Month, x.LoaiGiaoDich, x.Tong)).ToList();
        }
        else
        {
            // Group theo tuần
            var allGiaoDich = await _context.TblGiaodiches.AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId 
                         && x.NgayGiaoDich >= fromDate 
                         && x.NgayGiaoDich <= toDate
                         && x.TrangThai == 1)
                .ToListAsync(ct);
            
            data = allGiaoDich
                .GroupBy(x => new { 
                    WeekNum = (int)((x.NgayGiaoDich.Date - fromDate.Date).TotalDays / 7),
                    x.LoaiGiaoDich 
                })
                .Select(g => (fromDate.Year, fromDate.Month, g.Key.WeekNum, g.Key.LoaiGiaoDich, g.Sum(x => x.SoTien)))
                .ToList();
        }

        // Tính tổng cho từng label
        decimal GetValue(int index, sbyte loai)
        {
            if (totalDays <= 14 || d == "week")
            {
                var tp = timePoints[index];

                var item = data.FirstOrDefault(x =>
                    x.year == tp.Item1 &&
                    x.month == tp.Item2 &&
                    x.day == tp.Item3 &&
                    x.loai == loai);

                return item.tong;
            }
            else if (totalDays > 180 || d == "year")
            {
                var tp = timePoints[index];

                var item = data.FirstOrDefault(x =>
                    x.year == tp.Item1 &&
                    x.month == tp.Item2 &&
                    x.loai == loai);

                return item.tong;
            }
            else
            {
                return data
                    .Where(x => x.day == index && x.loai == loai)
                    .Sum(x => x.tong);
            }
        }

        var seriesThu = new SerieDto { Name = "Thu", Data = Enumerable.Range(0, timePoints.Count).Select(i => GetValue(i, 1)).ToList() };
        var seriesChi = new SerieDto { Name = "Chi", Data = Enumerable.Range(0, timePoints.Count).Select(i => GetValue(i, 2)).ToList() };

        return new BaoCaoTongQuanDto
        {
            Labels = labels,
            Series = new List<SerieDto> { seriesThu, seriesChi }
        };
    }

    public async Task<PhanBoDanhMucDto> LayPhanBoDanhMucAsync(int nguoiDungId, string duration, int? thang, int? nam, string loai, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        var (fromDate, toDate) = TinhKhoangThoiGian(duration, thang, nam, tuNgay, denNgay);
        var loaiId = loai.Equals("THU", StringComparison.OrdinalIgnoreCase) ? (sbyte)1 : (sbyte)2;

        // Lấy tất cả giao dịch theo loại (có và không có danh mục)
        var data = await _context.TblGiaodiches.AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.NgayGiaoDich >= fromDate
                        && x.NgayGiaoDich <= toDate
                        && x.LoaiGiaoDich == loaiId
                        && x.TrangThai == 1) // Chỉ lấy giao dịch hiển thị
            .ToListAsync(ct);

        // Nhóm theo danh mục, giao dịch không có danh mục hiển thị là "Khác"
        var grouped = data
            .GroupBy(x => string.IsNullOrEmpty(x.DanhMuc?.TenDanhMuc) ? "Khác" : x.DanhMuc.TenDanhMuc)
            .Select(g => new { TenDanhMuc = g.Key, Tong = g.Sum(x => x.SoTien) })
            .OrderByDescending(x => x.Tong)
            .Take(10)
            .ToList();

        return new PhanBoDanhMucDto
        {
            Labels = grouped.Select(x => x.TenDanhMuc).ToList(),
            Series = grouped.Select(x => x.Tong).ToList()
        };
    }

    public async Task<AdminTongQuanDto> LayTongQuanAdminAsync(CancellationToken ct = default)
    {
        return new AdminTongQuanDto
        {
            TongNguoiDung = await _context.TblNguoidungs.CountAsync(ct),
            TongGiaoDich = await _context.TblGiaodiches.CountAsync(ct),
            TongImport = await _context.TblImportFiles.CountAsync(ct)
        };
    }

    public async Task<TangTruongUserDto> LayTangTruongUserAsync(int? nam = null, string? duration = null, DateTime? tuNgay = null, DateTime? denNgay = null, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var d = duration?.Trim().ToLowerInvariant();
        
        // Tính khoảng thời gian
        DateTime fromDate, toDate;
        
        if (tuNgay.HasValue && denNgay.HasValue)
        {
            // Sử dụng khoảng thời gian tùy chỉnh
            fromDate = tuNgay.Value.Date;
            toDate = denNgay.Value.Date.AddDays(1).AddSeconds(-1);
        }
        else
        {
            // Xác định khoảng thời gian dựa trên duration
            var y = nam ?? now.Year;
            
            switch (d)
            {
                case "day":
                    // 7 ngày gần nhất
                    fromDate = now.Date.AddDays(-6);
                    toDate = now.Date.AddDays(1).AddSeconds(-1);
                    break;
                case "week":
                    // 30 ngày gần nhất
                    fromDate = now.Date.AddDays(-29);
                    toDate = now.Date.AddDays(1).AddSeconds(-1);
                    break;
                case "month":
                    // 90 ngày gần nhất
                    fromDate = now.Date.AddDays(-89);
                    toDate = now.Date.AddDays(1).AddSeconds(-1);
                    break;
                case "year":
                    // Cả năm
                    fromDate = new DateTime(y, 1, 1);
                    toDate = new DateTime(y, 12, 31, 23, 59, 59);
                    break;
                default:
                    // Mặc định 90 ngày
                    fromDate = now.Date.AddDays(-89);
                    toDate = now.Date.AddDays(1).AddSeconds(-1);
                    break;
            }
        }
        
        // Tính số ngày
        var totalDays = (toDate - fromDate).TotalDays;
        
        // Xác định labels và cách group dữ liệu
        List<string> labels;
        List<DateTime> timePoints;
        
        if (totalDays <= 14)
        {
            // Hiển thị theo ngày
            labels = new List<string>();
            timePoints = new List<DateTime>();
            var current = fromDate.Date;
            while (current <= toDate.Date)
            {
                labels.Add(current.ToString("dd/MM"));
                timePoints.Add(current);
                current = current.AddDays(1);
            }
        }
        else if (totalDays > 180 || d == "year")
        {
            // Hiển thị theo tháng
            labels = new List<string>();
            timePoints = new List<DateTime>();
            var current = new DateTime(fromDate.Year, fromDate.Month, 1);
            var endMonth = new DateTime(toDate.Year, toDate.Month, 1);
            while (current <= endMonth)
            {
                labels.Add($"Th{current.Month}");
                timePoints.Add(current);
                current = current.AddMonths(1);
            }
        }
        else
        {
            // Hiển thị theo tuần
            labels = new List<string>();
            timePoints = new List<DateTime>();
            var current = fromDate.Date;
            int weekNum = 1;
            while (current <= toDate.Date)
            {
                labels.Add($"Tuần {weekNum}");
                timePoints.Add(current);
                current = current.AddDays(7);
                weekNum++;
            }
        }
        
        // Query dữ liệu user theo ngày tạo
        var userStats = await _context.TblNguoidungs
            .AsNoTracking()
            .Where(x => x.NgayTao != null && x.NgayTao >= fromDate && x.NgayTao <= toDate)
            .GroupBy(x => new { x.NgayTao!.Value.Year, x.NgayTao!.Value.Month, x.NgayTao!.Value.Day })
            .Select(g => new { g.Key.Year, g.Key.Month, g.Key.Day, Count = g.Count() })
            .ToListAsync(ct);
        
        // Tính tổng user cho từng label
        decimal[] dataPoints;
        
        if (totalDays <= 14)
        {
            // Group theo ngày
            dataPoints = timePoints.Select(tp =>
            {
                var stat = userStats.FirstOrDefault(s => s.Year == tp.Year && s.Month == tp.Month && s.Day == tp.Day);
                return (decimal)(stat?.Count ?? 0);
            }).ToArray();
        }
        else if (totalDays > 180 || d == "year")
        {
            // Group theo tháng
            dataPoints = timePoints.Select(tp =>
            {
                var count = userStats.Where(s => s.Year == tp.Year && s.Month == tp.Month).Sum(s => s.Count);
                return (decimal)count;
            }).ToArray();
        }
        else
        {
            // Group theo tuần
            dataPoints = timePoints.Select((tp, idx) =>
            {
                var weekEnd = idx < timePoints.Count - 1 ? timePoints[idx + 1].AddDays(-1) : toDate.Date;
                var count = userStats.Where(s =>
                {
                    var d = new DateTime(s.Year, s.Month, s.Day);
                    return d >= tp && d <= weekEnd;
                }).Sum(s => s.Count);
                return (decimal)count;
            }).ToArray();
        }
        
        var yearLabel = d == "year" ? nam?.ToString() ?? now.Year.ToString() : now.Year.ToString();
        
        return new TangTruongUserDto
        {
            Labels = labels,
            Series = new List<SerieDto>
            {
                new SerieDto
                {
                    Name = $"Người dùng mới {yearLabel}",
                    Data = dataPoints.ToList()
                }
            }
        };
    }

    private static (DateTime tuNgay, DateTime denNgay) TinhKhoangThoiGian(string duration, int? thang, int? nam, DateTime? tuNgay, DateTime? denNgay)
    {
        var now = TimeHelper.NowInVietnam();
        var d = duration?.Trim().ToLowerInvariant();

        // Ưu tiên FE truyền tuNgay/denNgay cụ thể
        if (tuNgay.HasValue && denNgay.HasValue)
        {
            return (tuNgay.Value, denNgay.Value);
        }

        // Nếu chỉ có tuNgay, tính denNgay từ duration
        if (tuNgay.HasValue)
        {
            var from = tuNgay.Value;
            DateTime to;
            switch (d)
            {
                case "year":
                    to = new DateTime(from.Year, 12, 31, 23, 59, 59);
                    break;
                case "quarter":
                    var q = ((from.Month) - 1) / 3 + 1;
                    var startMonth = (q - 1) * 3 + 1;
                    var quarterStart = new DateTime(from.Year, startMonth, 1);
                    to = quarterStart.AddMonths(3).AddSeconds(-1);
                    break;
                case "week":
                    var daysUntilSunday = (7 - (int)from.DayOfWeek) % 7;
                    to = from.Date.AddDays(daysUntilSunday).AddDays(1).AddSeconds(-1);
                    if (to > now) to = now;
                    break;
                default: // month
                    to = from.AddMonths(1).AddSeconds(-1);
                    break;
            }
            return (from, to);
        }

        if (d == "year")
        {
            var y = nam ?? now.Year;
            var tu = new DateTime(y, 1, 1);
            var den = new DateTime(y, 12, 31, 23, 59, 59);
            return (tu, den);
        }

        if (d == "quarter")
        {
            var y = nam ?? now.Year;
            var q = ((thang ?? now.Month) - 1) / 3 + 1;
            var startMonth = (q - 1) * 3 + 1;
            var tu = new DateTime(y, startMonth, 1);
            var den = tu.AddMonths(3).AddSeconds(-1);
            return (tu, den);
        }

        if (d == "week")
        {
            var daysSinceMonday = (int)now.DayOfWeek == 0 ? 6 : (int)now.DayOfWeek - 1;
            var tu = now.Date.AddDays(-daysSinceMonday);
            var den = tu.AddDays(6).AddDays(1).AddSeconds(-1);
            return (tu, den);
        }

        // month default
        {
            var y = nam ?? now.Year;
            var m = thang ?? now.Month;
            var tu = new DateTime(y, m, 1);
            var den = tu.AddMonths(1).AddSeconds(-1);
            return (tu, den);
        }
    }

    public async Task<DongBoKetQuaDto> DongBoNganSachAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        var result = new DongBoKetQuaDto();

        // Lấy danh sách tháng cần đồng bộ
        var now = TimeHelper.NowInVietnam();
        var thangDongBo = new List<(int thang, int nam)>();

        if (thang.HasValue && nam.HasValue)
        {
            thangDongBo.Add((thang.Value, nam.Value));
        }
        else
        {
            // Đồng bộ 12 tháng gần nhất
            for (int i = 0; i < 12; i++)
            {
                var d = now.AddMonths(-i);
                thangDongBo.Add((d.Month, d.Year));
            }
        }

        // Lấy danh sách người dùng
        var nguoiDungQuery = _context.TblNguoidungs.AsQueryable();
        if (nguoiDungId.HasValue)
            nguoiDungQuery = nguoiDungQuery.Where(x => x.NguoiDungId == nguoiDungId.Value);

        var danhSachNguoiDung = await nguoiDungQuery.Select(x => x.NguoiDungId).ToListAsync(ct);

        foreach (var userId in danhSachNguoiDung)
        {
            foreach (var (t, n) in thangDongBo)
            {
                var tuNgay = new DateTime(n, t, 1);
                var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

                // Tính tổng chi tiêu theo từng danh mục từ giao dịch
                var chiTieuTheoDanhMuc = await _context.TblGiaodiches
                    .AsNoTracking()
                    .Where(x => x.NguoiDungId == userId
                                && x.NgayGiaoDich >= tuNgay
                                && x.NgayGiaoDich <= denNgay
                                && x.LoaiGiaoDich == 2  // Chi
                                && x.DanhMucId.HasValue
                                && x.TrangThai == 1)
                    .GroupBy(x => x.DanhMucId!.Value)
                    .Select(g => new { DanhMucId = g.Key, Tong = g.Sum(x => x.SoTien) })
                    .ToListAsync(ct);

                foreach (var item in chiTieuTheoDanhMuc)
                {
                    var nganSach = await _context.TblNgansaches
                        .FirstOrDefaultAsync(x => x.NguoiDungId == userId
                                                  && x.DanhMucId == item.DanhMucId
                                                  && x.Thang == t
                                                  && x.Nam == n, ct);

                    if (nganSach != null)
                    {
                        var chenhLech = item.Tong - (nganSach.SoTienDaChi ?? 0);
                        if (chenhLech != 0)
                        {
                            // Cập nhật nếu có chênh lệch
                            nganSach.SoTienDaChi = item.Tong;
                            if (nganSach.SoTienToiDa > 0)
                            {
                                nganSach.PhanTramDaDung = (float)((double)item.Tong / (double)nganSach.SoTienToiDa * 100.0);
                            }
                            result.SoBanGhiDongBo++;
                        }
                        result.TongSoBanGhi++;
                    }
                    else if (item.Tong > 0)
                    {
                        // Tạo bản ghi ngân sách mới nếu có chi tiêu
                        var danhMuc = await _context.TblDanhmucs.AsNoTracking().FirstOrDefaultAsync(x => x.DanhMucId == item.DanhMucId, ct);
                        if (danhMuc != null)
                        {
                            _context.TblNgansaches.Add(new Models.TblNgansach
                            {
                                NguoiDungId = userId,
                                DanhMucId = item.DanhMucId,
                                SoTienToiDa = 0,
                                Thang = t,
                                Nam = n,
                                SoTienDaChi = item.Tong,
                                PhanTramDaDung = 0,
                                TrangThai = 1
                            });
                            result.SoBanGhiDongBo++;
                            result.TongSoBanGhi++;
                        }
                    }
                }
            }
        }

        await _context.SaveChangesAsync(ct);
        result.ThongBao = $"Đã đồng bộ {result.SoBanGhiDongBo}/{result.TongSoBanGhi} bản ghi ngân sách.";
        return result;
    }

    public async Task<DongBoKetQuaDto> DongBoTongHopThangAsync(int? nguoiDungId = null, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        var result = new DongBoKetQuaDto();

        // Lấy danh sách tháng cần đồng bộ
        var now = TimeHelper.NowInVietnam();
        var thangDongBo = new List<(int thang, int nam)>();

        if (thang.HasValue && nam.HasValue)
        {
            thangDongBo.Add((thang.Value, nam.Value));
        }
        else
        {
            // Đồng bộ 12 tháng gần nhất
            for (int i = 0; i < 12; i++)
            {
                var d = now.AddMonths(-i);
                thangDongBo.Add((d.Month, d.Year));
            }
        }

        // Lấy danh sách người dùng
        var nguoiDungQuery = _context.TblNguoidungs.AsQueryable();
        if (nguoiDungId.HasValue)
            nguoiDungQuery = nguoiDungQuery.Where(x => x.NguoiDungId == nguoiDungId.Value);

        var danhSachNguoiDung = await nguoiDungQuery.Select(x => x.NguoiDungId).ToListAsync(ct);

        foreach (var userId in danhSachNguoiDung)
        {
            foreach (var (t, n) in thangDongBo)
            {
                var tuNgay = new DateTime(n, t, 1);
                var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

                // Tính tổng từ giao dịch
                var tongThu = await _context.TblGiaodiches
                    .AsNoTracking()
                    .Where(x => x.NguoiDungId == userId
                                && x.NgayGiaoDich >= tuNgay
                                && x.NgayGiaoDich <= denNgay
                                && x.LoaiGiaoDich == 1  // Thu
                                && x.TrangThai == 1)
                    .SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;

                var tongChi = await _context.TblGiaodiches
                    .AsNoTracking()
                    .Where(x => x.NguoiDungId == userId
                                && x.NgayGiaoDich >= tuNgay
                                && x.NgayGiaoDich <= denNgay
                                && x.LoaiGiaoDich == 2  // Chi
                                && x.TrangThai == 1)
                    .SumAsync(x => (decimal?)x.SoTien, ct) ?? 0m;

                var tongHop = await _context.TblTonghopThangs
                    .FirstOrDefaultAsync(x => x.NguoiDungId == userId && x.Thang == t && x.Nam == n, ct);

                if (tongHop != null)
                {
                    var chenhLech = (tongHop.TongThu ?? 0) - tongThu + (tongHop.TongChi ?? 0) - tongChi;
                    if (chenhLech != 0)
                    {
                        tongHop.TongThu = tongThu;
                        tongHop.TongChi = tongChi;
                        tongHop.TietKiem = tongThu - tongChi;
                        tongHop.TyLeTietKiem = tongThu > 0 ? (float)((double)(tongThu - tongChi) / (double)tongThu * 100.0) : 0;
                        tongHop.NgayCapNhat = now;
                        result.SoBanGhiDongBo++;
                    }
                    result.TongSoBanGhi++;
                }
                else
                {
                    // Tạo mới nếu chưa có
                    _context.TblTonghopThangs.Add(new Models.TblTonghopThang
                    {
                        NguoiDungId = userId,
                        Thang = t,
                        Nam = n,
                        TongThu = tongThu,
                        TongChi = tongChi,
                        TietKiem = tongThu - tongChi,
                        TyLeTietKiem = tongThu > 0 ? (float)((double)(tongThu - tongChi) / (double)tongThu * 100.0) : 0,
                        NgayCapNhat = now
                    });
                    result.SoBanGhiDongBo++;
                    result.TongSoBanGhi++;
                }
            }
        }

        await _context.SaveChangesAsync(ct);
        result.ThongBao = $"Đã đồng bộ {result.SoBanGhiDongBo}/{result.TongSoBanGhi} bản ghi tổng hợp tháng.";
        return result;
    }

    public async Task<DongBoKetQuaDto> KiemTraLechAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        var result = new DongBoKetQuaDto();

        var tuNgay = new DateTime(nam, thang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        // Lấy tổng chi từ giao dịch theo từng danh mục
        var chiTieuTheoDanhMuc = await _context.TblGiaodiches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2  // Chi
                        && x.DanhMucId.HasValue
                        && x.TrangThai == 1)
            .GroupBy(x => new { x.DanhMucId, TenDanhMuc = x.DanhMuc != null ? x.DanhMuc.TenDanhMuc : "" })
            .Select(g => new { g.Key.DanhMucId, g.Key.TenDanhMuc, Tong = g.Sum(x => x.SoTien) })
            .ToListAsync(ct);

        foreach (var item in chiTieuTheoDanhMuc)
        {
            var nganSach = await _context.TblNgansaches
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.NguoiDungId == nguoiDungId
                                          && x.DanhMucId == item.DanhMucId
                                          && x.Thang == thang
                                          && x.Nam == nam, ct);

            var soTienNganSach = nganSach?.SoTienDaChi ?? 0;
            var chenhLech = item.Tong - soTienNganSach;

            if (chenhLech != 0)
            {
                result.TongChenhLech += Math.Abs(chenhLech);
                result.CacBanGhiLech.Add(new LechNganSachDto
                {
                    DanhMucId = item.DanhMucId ?? 0,
                    TenDanhMuc = item.TenDanhMuc,
                    Thang = thang,
                    Nam = nam,
                    SoTienTuGiaoDich = item.Tong,
                    SoTienTuNganSach = soTienNganSach
                });
                result.TongSoBanGhi++;
            }
        }

        // Đánh dấu tháng bị lệch
        if (result.TongSoBanGhi > 0)
        {
            result.ThongBao = $"Phát hiện {result.TongSoBanGhi} danh mục bị lệch trong tháng {thang}/{nam}. Tổng chênh lệch: {result.TongChenhLech:N0}đ";
        }
        else
        {
            result.ThongBao = $"Dữ liệu ngân sách tháng {thang}/{nam} đã đồng bộ.";
        }

        return result;
    }

    // ============== BÁO CÁO TÀI KHOẢN ==============

    public async Task<BaoCaoTaiKhoanDto> LayBaoCaoTaiKhoanAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var targetThang = thang ?? now.Month;
        var targetNam = nam ?? now.Year;

        // Lấy tất cả tài khoản của user
        var taiKhoans = await _context.TblTaikhoans
            .AsNoTracking()
            .Include(x => x.LoaiTaiKhoan)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .ToListAsync(ct);

        // Tính tổng tài sản
        var tongTaiSan = taiKhoans.Sum(x => x.SoDu ?? 0);

        // Phân bổ theo loại tài khoản
        var phanBoTheoLoai = taiKhoans
            .GroupBy(x => new { x.LoaiTaiKhoanId, TenLoai = x.LoaiTaiKhoan?.TenLoai ?? "Khác" })
            .Select(g => new LoaiTaiKhoanPhanBoDto
            {
                LoaiTaiKhoanId = g.Key.LoaiTaiKhoanId,
                TenLoai = g.Key.TenLoai,
                TongSoDu = g.Sum(x => x.SoDu ?? 0),
                TyLe = tongTaiSan > 0 ? (decimal)((double)g.Sum(x => x.SoDu ?? 0) / (double)tongTaiSan * 100) : 0,
                SoLuongTaiKhoan = g.Count()
            })
            .OrderByDescending(x => x.TongSoDu)
            .ToList();

        // Chi tiết từng tài khoản
        var danhSachTaiKhoan = taiKhoans.Select(tk => new TaiKhoanBaoCaoDto
        {
            TaiKhoanId = tk.TaiKhoanId,
            TenTaiKhoan = tk.TenTaiKhoan,
            TenLoaiTaiKhoan = tk.LoaiTaiKhoan?.TenLoai ?? "Khác",
            SoDuHienTai = tk.SoDu ?? 0,
            SoDuDauThang = tk.SoDuBanDau ?? tk.SoDu ?? 0,
            SoDuCuoiThang = tk.SoDu ?? 0,
            HanMuc = tk.HanMucTinDung,
            DaSuDung = tk.HanMucTinDung.HasValue && tk.SoDu.HasValue ? (tk.HanMucTinDung - tk.SoDu) : null,
            TyLeSuDung = tk.HanMucTinDung.HasValue && tk.HanMucTinDung > 0 
                ? (float)(((tk.HanMucTinDung - (tk.SoDu ?? 0)) / (decimal)tk.HanMucTinDung) * 100) 
                : null
        }).ToList();

        // Biến động số dư 12 tháng gần nhất
        var labels = new List<string>();
        var dataPoints = new List<decimal>();
        for (int i = 11; i >= 0; i--)
        {
            var d = now.AddMonths(-i);
            labels.Add($"Th{d.Month}");
            
            // Tính tổng số dư của tất cả tài khoản tại thời điểm đầu tháng đó
            var soDuDauThang = taiKhoans.Sum(x => x.SoDuBanDau ?? 0);
            // Giả lập: sử dụng số dư hiện tại với điều chỉnh
            dataPoints.Add(soDuDauThang + (tongTaiSan - soDuDauThang) * (12 - i) / 12);
        }

        return new BaoCaoTaiKhoanDto
        {
            TongTaiSan = tongTaiSan,
            PhanBoTheoLoai = phanBoTheoLoai,
            DanhSachTaiKhoan = danhSachTaiKhoan,
            BienDongSoDu = new BaoCaoTongQuanDto
            {
                Labels = labels,
                Series = new List<SerieDto>
                {
                    new SerieDto { Name = "Tổng tài sản", Data = dataPoints }
                }
            }
        };
    }

    // ============== BÁO CÁO DANH MỤC CHI TIÊU ==============

    public async Task<BaoCaoDanhMucDto> LayBaoCaoDanhMucAsync(int nguoiDungId, int? thang = null, int? nam = null, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var targetThang = thang ?? now.Month;
        var targetNam = nam ?? now.Year;

        var tuNgay = new DateTime(targetNam, targetThang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        // Tháng trước
        var thangTruoc = targetThang == 1 ? 12 : targetThang - 1;
        var namTruoc = targetThang == 1 ? targetNam - 1 : targetNam;
        var tuNgayTruoc = new DateTime(namTruoc, thangTruoc, 1);
        var denNgayTruoc = tuNgayTruoc.AddMonths(1).AddSeconds(-1);

        // Lấy tất cả giao dịch chi của tháng hiện tại (chỉ giao dịch hiển thị)
        var giaoDichHienTai = await _context.TblGiaodiches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.NgayGiaoDich >= tuNgay
                        && x.NgayGiaoDich <= denNgay
                        && x.LoaiGiaoDich == 2 // Chi
                        && x.TrangThai == 1) // Chỉ lấy giao dịch hiển thị
            .ToListAsync(ct);

        // Lấy giao dịch tháng trước (chỉ giao dịch hiển thị)
        var giaoDichTruoc = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                        && x.NgayGiaoDich >= tuNgayTruoc
                        && x.NgayGiaoDich <= denNgayTruoc
                        && x.LoaiGiaoDich == 2 // Chi
                        && x.TrangThai == 1) // Chỉ lấy giao dịch hiển thị
            .GroupBy(x => x.DanhMucId)
            .Select(g => new { DanhMucId = g.Key, Tong = g.Sum(x => x.SoTien) })
            .ToDictionaryAsync(x => x.DanhMucId ?? 0, x => x.Tong, ct);

        var tongChiTieu = giaoDichHienTai.Sum(x => x.SoTien);

        // Chi tiêu theo danh mục
        var chiTieuTheoDanhMuc = giaoDichHienTai
            .GroupBy(x => new { x.DanhMucId, TenDanhMuc = x.DanhMuc?.TenDanhMuc ?? "Khác", x.DanhMuc?.DanhMucChaId })
            .Select(g => new DanhMucChiTieuDto
            {
                DanhMucId = g.Key.DanhMucId ?? 0,
                TenDanhMuc = g.Key.TenDanhMuc,
                DanhMucChaId = g.Key.DanhMucChaId,
                TongTien = g.Sum(x => x.SoTien),
                SoGiaoDich = g.Count(),
                TyLe = tongChiTieu > 0 ? (decimal)((double)g.Sum(x => x.SoTien) / (double)tongChiTieu * 100) : 0
            })
            .OrderByDescending(x => x.TongTien)
            .ToList();

        // So sánh với tháng trước
        var soSanhThangTruoc = chiTieuTheoDanhMuc.Select(x =>
        {
            var tienTruoc = giaoDichTruoc.GetValueOrDefault(x.DanhMucId, 0);
            return new DanhMucSoSanhDto
            {
                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.TenDanhMuc,
                TienThangNay = x.TongTien,
                TienThangTruoc = tienTruoc,
                ChenhLech = x.TongTien - tienTruoc,
                TyLeThayDoi = tienTruoc > 0 ? (float)((double)(x.TongTien - tienTruoc) / (double)tienTruoc * 100) : 0
            };
        }).ToList();

        // Danh mục cha và con
        var danhMucs = await _context.TblDanhmucs
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId || x.NguoiDungId == null)
            .ToListAsync(ct);

        var danhMucCha = danhMucs
            .Where(x => x.DanhMucChaId == null)
            .Select(dm =>
            {
                var conIds = danhMucs.Where(x => x.DanhMucChaId == dm.DanhMucId).Select(x => x.DanhMucId).ToHashSet();
                conIds.Add(dm.DanhMucId);
                var tien = giaoDichHienTai.Where(x => conIds.Contains(x.DanhMucId ?? 0)).Sum(x => x.SoTien);
                var dsCon = danhMucs.Where(x => x.DanhMucChaId == dm.DanhMucId)
                    .Select(con => new DanhMucConDto
                    {
                        DanhMucId = con.DanhMucId,
                        TenDanhMuc = con.TenDanhMuc ?? "",
                        TongTien = giaoDichHienTai.Where(x => x.DanhMucId == con.DanhMucId).Sum(x => x.SoTien),
                        SoGiaoDich = giaoDichHienTai.Count(x => x.DanhMucId == con.DanhMucId)
                    }).ToList();

                return new DanhMucChaDto
                {
                    DanhMucId = dm.DanhMucId,
                    TenDanhMuc = dm.TenDanhMuc ?? "",
                    TongTien = tien,
                    SoGiaoDich = giaoDichHienTai.Count(x => conIds.Contains(x.DanhMucId ?? 0)),
                    DanhMucCon = dsCon
                };
            })
            .Where(x => x.TongTien > 0 || x.DanhMucCon.Any())
            .OrderByDescending(x => x.TongTien)
            .Take(10)
            .ToList();

        // Top danh mục
        var topDanhMuc = chiTieuTheoDanhMuc.Take(10)
            .Select((x, i) => new TopDanhMucDto
            {
                Rank = i + 1,
                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.TenDanhMuc,
                TongTien = x.TongTien,
                SoGiaoDich = x.SoGiaoDich,
                TyLe = x.TyLe
            })
            .ToList();

        return new BaoCaoDanhMucDto
        {
            TongChiTieu = tongChiTieu,
            SoGiaoDich = giaoDichHienTai.Count,
            ChiTieuTheoDanhMuc = chiTieuTheoDanhMuc,
            SoSanhThangTruoc = soSanhThangTruoc,
            DanhMucCha = danhMucCha,
            TopDanhMuc = topDanhMuc
        };
    }

    // ============== BÁO CÁO NGÂN SÁCH ==============

    public async Task<BaoCaoNganSachDto> LayBaoCaoNganSachAsync(int nguoiDungId, int thang, int nam, CancellationToken ct = default)
    {
        var tuNgay = new DateTime(nam, thang, 1);
        var denNgay = tuNgay.AddMonths(1).AddSeconds(-1);

        // Lấy ngân sách tháng
        var nganSachs = await _context.TblNgansaches
            .AsNoTracking()
            .Include(x => x.DanhMuc)
            .Where(x => x.NguoiDungId == nguoiDungId && x.Thang == thang && x.Nam == nam)
            .ToListAsync(ct);

        var tongHanMuc = nganSachs.Sum(x => x.SoTienToiDa);
        var tongDaSuDung = nganSachs.Sum(x => x.SoTienDaChi ?? 0);
        var tyLeTrungBinh = tongHanMuc > 0 ? (float)((double)tongDaSuDung / (double)tongHanMuc * 100) : 0;

        // Chi tiết ngân sách
        var chiTietNganSach = nganSachs.Select(ns => new NganSachChiTietDto
        {
            NganSachId = ns.NganSachId,
            DanhMucId = ns.DanhMucId,
            TenDanhMuc = ns.DanhMuc?.TenDanhMuc ?? "Khác",
            HanMuc = ns.SoTienToiDa,
            DaSuDung = ns.SoTienDaChi ?? 0,
            TyLeSuDung = ns.SoTienToiDa > 0 ? (float)((double)(ns.SoTienDaChi ?? 0) / (double)ns.SoTienToiDa * 100) : 0
        }).ToList();

        // Cảnh báo
        var canhBao = chiTietNganSach
            .Where(x => x.TyLeSuDung >= 80)
            .Select(x => new NganSachCanhBaoDto
            {
                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.TenDanhMuc,
                HanMuc = x.HanMuc,
                DaSuDung = x.DaSuDung,
                TyLeSuDung = x.TyLeSuDung,
                MucDo = x.LaVuot ? "VUOT" : x.TyLeSuDung >= 95 ? "GAN_VUOT" : "CANH_BAO"
            })
            .OrderByDescending(x => x.TyLeSuDung)
            .ToList();

        // Lịch sử 6 tháng
        var lichSuThucHien = new List<NganSachLichSuDto>();
        for (int i = 5; i >= 0; i--)
        {
            var d = tuNgay.AddMonths(-i);
            var nsThang = await _context.TblNgansaches
                .AsNoTracking()
                .Where(x => x.NguoiDungId == nguoiDungId && x.Thang == d.Month && x.Nam == d.Year)
                .ToListAsync(ct);

            var tongHM = nsThang.Sum(x => x.SoTienToiDa);
            var tongDa = nsThang.Sum(x => x.SoTienDaChi ?? 0);

            lichSuThucHien.Add(new NganSachLichSuDto
            {
                Thang = d.Month,
                Nam = d.Year,
                TongHanMuc = tongHM,
                TongDaSuDung = tongDa,
                CoVuot = tongDa > tongHM && tongHM > 0,
                TyLeSuDung = tongHM > 0 ? (float)((double)tongDa / (double)tongHM * 100) : 0
            });
        }

        // Tỷ lệ tuân thủ
        var thangKhongVuot = lichSuThucHien.Count(x => !x.CoVuot);
        var tyLeTuanThu = lichSuThucHien.Count > 0 ? (float)((double)thangKhongVuot / lichSuThucHien.Count * 100) : 0;

        return new BaoCaoNganSachDto
        {
            TongHanMuc = tongHanMuc,
            TongDaSuDung = tongDaSuDung,
            TyLeSuDungTrungBinh = tyLeTrungBinh,
            ChiTietNganSach = chiTietNganSach,
            CanhBao = canhBao,
            LichSuThucHien = lichSuThucHien,
            TyLeTuanThu = tyLeTuanThu
        };
    }

    // ============== BÁO CÁO MỤC TIÊU TIẾT KIỆM ==============

    public async Task<BaoCaoMucTieuDto> LayBaoCaoMucTieuAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var mucTieus = await _context.TblMuctieus
            .AsNoTracking()
            .Include(x => x.TblDonggopMuctieus)
            .Where(x => x.NguoiDungId == nguoiDungId)
            .ToListAsync(ct);

        var danhSachMucTieu = mucTieus.Select(mt =>
        {
            var daDat = mt.TblDonggopMuctieus?.Sum(x => x.SoTien) ?? 0;
            var thangDaTietKiem = mt.NgayBatDau.HasValue
                ? Math.Max(1, (int)((TimeHelper.NowInVietnam() - mt.NgayBatDau.Value).TotalDays / 30))
                : 1;
            var trungBinhThang = thangDaTietKiem > 0 ? daDat / thangDaTietKiem : 0;
            var conLai = mt.SoTienMucTieu - daDat;
            var ngayDuKien = trungBinhThang > 0 && conLai > 0
                ? TimeHelper.NowInVietnam().AddDays((double)(conLai / trungBinhThang * 30))
                : (DateTime?)null;

            return new MucTieuBaoCaoDto
            {
                MucTieuId = mt.MucTieuId,
                TenMucTieu = mt.TenMucTieu ?? "",
                MucTieu = mt.SoTienMucTieu,
                DaDat = daDat,
                TyLeHoanThanh = mt.SoTienMucTieu > 0 ? (float)((double)daDat / (double)mt.SoTienMucTieu * 100) : 0,
                TrungBinhThang = trungBinhThang,
                NgayDuKien = ngayDuKien,
                HanChot = mt.NgayKetThuc,
                LichSuDongGop = mt.TblDonggopMuctieus?
                    .OrderByDescending(x => x.NgayDongGop)
                    .Take(10)
                    .Select(x => new DongGopDto
                    {
                        DongGopId = x.Id,
                        SoTien = x.SoTien,
                        NgayTao = x.NgayDongGop ?? DateTime.Now,
                        GhiChu = x.GhiChu
                    })
                    .ToList() ?? new List<DongGopDto>()
            };
        }).ToList();

        return new BaoCaoMucTieuDto
        {
            TongMucTieu = mucTieus.Count,
            MucTieuHoanThanh = danhSachMucTieu.Count(x => x.DaHoanThanh),
            TongDaTietKiem = danhSachMucTieu.Sum(x => x.DaDat),
            DanhSachMucTieu = danhSachMucTieu
        };
    }
}
