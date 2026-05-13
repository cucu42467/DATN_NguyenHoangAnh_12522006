using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class AiDal : IAiDal
{
    private readonly AppDbContext _context;

    public AiDal(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DuDoanAIChartDto> LayDuDoanAsync(int nguoiDungId, int? thang, int? nam, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        
        // Tìm 3 tháng có dữ liệu thực tế gần nhất
        var recentData = new List<(int Year, int Month, string Label)>();
        for (int i = 0; i < 12 && recentData.Count < 3; i++)
        {
            var d = now.AddMonths(-i);
            var start = new DateTime(d.Year, d.Month, 1);
            var end = start.AddMonths(1).AddSeconds(-1);
            
            var hasData = await _context.TblGiaodiches
                .AsNoTracking()
                .AnyAsync(x => x.NguoiDungId == nguoiDungId 
                    && x.LoaiGiaoDich == 2 
                    && x.NgayGiaoDich >= start 
                    && x.NgayGiaoDich <= end, ct);
            
            if (hasData)
            {
                recentData.Add((d.Year, d.Month, $"{d.Month:00}/{d.Year}"));
            }
        }
        
        // Nếu không đủ dữ liệu, lấy 3 tháng gần nhất bất kể
        if (recentData.Count < 3)
        {
            recentData = Enumerable.Range(0, 3)
                .Select(i => now.AddMonths(-i))
                .Select(d => (d.Year, d.Month, $"{d.Month:00}/{d.Year}"))
                .ToList();
        }
        
        // Sắp xếp theo thứ tự thời gian
        recentData = recentData.OrderBy(x => x.Year).ThenBy(x => x.Month).ToList();
        
        // Lấy tháng cuối cùng từ recentData
        var lastYear = recentData[recentData.Count - 1].Year;
        var lastMonth = recentData[recentData.Count - 1].Month;
        
        // Tạo 3 tháng dự đoán tiếp theo
        var forecastData = new List<(int Year, int Month, string Label)>();
        for (int i = 1; i <= 3; i++)
        {
            var dt = new DateTime(lastYear, lastMonth, 1).AddMonths(i);
            forecastData.Add((dt.Year, dt.Month, $"{dt.Month:00}/{dt.Year}"));
        }
        
        // Ghép tất cả tháng: thực tế + dự đoán
        var allData = recentData.Concat(forecastData).ToList();
        
        // Lấy dữ liệu thực tế
        var startDate = new DateTime(allData[0].Year, allData[0].Month, 1);
        var endDate = new DateTime(allData[allData.Count - 1].Year, allData[allData.Count - 1].Month, 1).AddMonths(1).AddSeconds(-1);
        
        var actualData = await _context.TblGiaodiches.AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId && x.LoaiGiaoDich == 2 && x.NgayGiaoDich >= startDate && x.NgayGiaoDich <= endDate)
            .GroupBy(x => new { x.NgayGiaoDich.Year, x.NgayGiaoDich.Month })
            .Select(g => new { g.Key.Year, g.Key.Month, Tong = g.Sum(x => x.SoTien) })
            .ToListAsync(ct);
        
        // Helper function
        decimal GetActual(int y, int m) => actualData.FirstOrDefault(x => x.Year == y && x.Month == m)?.Tong ?? 0m;
        
        // Tính trung bình từ dữ liệu thực tế
        var recentActuals = recentData.Select(m => GetActual(m.Year, m.Month)).Where(x => x > 0).ToList();
        decimal avgChi = recentActuals.Count > 0 ? recentActuals.Average() : 0;
        
        // Tính xu hướng
        decimal trend = 0;
        if (recentActuals.Count >= 2 && recentActuals[recentActuals.Count - 1] > 0)
        {
            var first = recentActuals[0];
            var last = recentActuals[recentActuals.Count - 1];
            if (first > 0)
            {
                trend = (last - first) / first;
            }
        }
        
        // Tạo kết quả
        var actualList = allData.Select(m => GetActual(m.Year, m.Month)).ToList();
        var forecastList = allData.Select((m, i) => 
        {
            if (i < recentData.Count) return 0m;
            var monthIndex = i - recentData.Count + 1;
            var predicted = avgChi * (1 + trend * monthIndex * 0.5m);
            // Làm tròn đến 10K, đảm bảo không âm
            var rounded = Math.Max(0, Math.Round(predicted / 10000) * 10000);
            return rounded;
        }).ToList();
        
        decimal mucDoChinhXac = recentData.Count >= 3 ? 0.75m : 0.5m;
        string ghiChu = recentData.Count >= 3 
            ? $"Dự đoán dựa trên xu hướng chi tiêu {recentData.Count} tháng gần nhất. Trung bình chi: {avgChi:N0} VND/tháng"
            : "Dự đoán dựa trên dữ liệu hiện có. Thêm nhiều giao dịch để cải thiện độ chính xác.";
        
        return new DuDoanAIChartDto
        {
            Months = allData.Select(x => x.Label).ToList(),
            Actual = actualList,
            Forecast = forecastList,
            MucDoChinhXac = mucDoChinhXac,
            GhiChu = ghiChu
        };
    }

    public async Task<List<LoiKhuyenAIDto>> LayGoiYAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 200) pageSize = 200;

        var query = _context.TblGoiyAis.AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId);

        if (daDoc.HasValue)
            query = query.Where(x => (x.DaDoc ?? 0UL) == (daDoc.Value ? 1UL : 0UL));

        var data = await query
            .OrderByDescending(x => x.NgayTao)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new LoiKhuyenAIDto
        {
            Id = x.GoiYid,
            TieuDe = "Gợi ý từ AI",
            NoiDung = x.NoiDung ?? string.Empty,
            Loai = (x.LoaiGoiY ?? 1) == 2 ? "GOI_Y" : "GOI_Y",
            NgayTao = x.NgayTao ?? DateTime.Now,
            DaDoc = (x.DaDoc ?? 0UL) == 1
        }).ToList();
    }

    public async Task<bool> DanhDauGoiYDaDocAsync(int nguoiDungId, int goiYId, CancellationToken ct = default)
    {
        var entity = await _context.TblGoiyAis.FirstOrDefaultAsync(x => x.GoiYid == goiYId && x.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;
        entity.DaDoc = 1UL;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<CanhBaoHeThongDto>> LayCanhBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 200) pageSize = 200;

        var query = _context.TblCanhbaos.AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId);

        if (daDoc.HasValue)
            query = query.Where(x => (x.DaDoc ?? 0UL) == (daDoc.Value ? 1UL : 0UL));

        var data = await query
            .OrderByDescending(x => x.NgayTao)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new CanhBaoHeThongDto
        {
            Id = x.CanhBaoId,
            NoiDung = x.NoiDung,
            MucDo = (x.LoaiCanhBao ?? 1) switch
            {
                1 => "TRUNG_BINH",
                2 => "THAP",
                3 => "CAO",
                _ => "TRUNG_BINH"
            },
            IsDaDoc = (x.DaDoc ?? 0UL) == 1UL,
            NgayTao = x.NgayTao ?? DateTime.Now
        }).ToList();
    }

    public async Task<bool> DanhDauCanhBaoDaDocAsync(int nguoiDungId, int canhBaoId, CancellationToken ct = default)
    {
        var entity = await _context.TblCanhbaos.FirstOrDefaultAsync(x => x.CanhBaoId == canhBaoId && x.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;
        entity.DaDoc = 1UL;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<(decimal TongThu, decimal TongChi, Dictionary<string, decimal> ChiTheoDanhMuc, string? NganSach)>
        LayDuLieuPhanTichAsync(int nguoiDungId, DateTime? tuNgay, DateTime? denNgay, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var start = tuNgay ?? new DateTime(now.Year, now.Month, 1);
        var end = denNgay ?? now;

        var giaoDich = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                     && x.NgayGiaoDich >= start
                     && x.NgayGiaoDich <= end)
            .Include(x => x.DanhMuc)
            .ToListAsync(ct);

        var tongThu = giaoDich.Where(x => x.LoaiGiaoDich == 1).Sum(x => x.SoTien);
        var tongChi = giaoDich.Where(x => x.LoaiGiaoDich == 2).Sum(x => x.SoTien);

        // Group by trong memory (LINQ to Objects) sau khi đã Include DanhMuc
        var chiTheoDanhMuc = giaoDich
            .Where(x => x.LoaiGiaoDich == 2 && x.DanhMuc != null)
            .GroupBy(x => x.DanhMuc!.TenDanhMuc)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.SoTien));

        var nganSach = await _context.TblNgansaches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                     && x.Thang == start.Month
                     && x.Nam == start.Year)
            .Select(x => x.SoTienToiDa.ToString())
            .FirstOrDefaultAsync(ct);

        return (tongThu, tongChi, chiTheoDanhMuc, nganSach);
    }

    public async Task<GeminiChatDataDto> LayDuLieuChatAsync(int nguoiDungId, CancellationToken ct = default)
    {
        var now = TimeHelper.NowInVietnam();
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        var giaoDich = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                     && x.NgayGiaoDich >= startOfMonth
                     && x.NgayGiaoDich <= now)
            .ToListAsync(ct);

        var tongThu = giaoDich.Where(x => x.LoaiGiaoDich == 1).Sum(x => x.SoTien);
        var tongChi = giaoDich.Where(x => x.LoaiGiaoDich == 2).Sum(x => x.SoTien);

        // Group by DanhMucId trước, sau đó lấy TenDanhMuc từ navigation
        var chiTheoDanhMuc = giaoDich
            .Where(x => x.LoaiGiaoDich == 2 && x.DanhMuc != null)
            .GroupBy(x => x.DanhMuc!.TenDanhMuc)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.SoTien));

        var soDu = await _context.TblTaikhoans
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId)
            .SumAsync(x => x.SoDu ?? 0, ct);

        var mucTieu = await _context.TblMuctieus
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId && x.TrangThai == 1)
            .Select(x => x.TenMucTieu)
            .Take(5)
            .ToListAsync(ct);

        var giaoDichChiTiet = await _context.TblGiaodiches
            .AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId
                     && x.NgayGiaoDich >= startOfMonth
                     && x.NgayGiaoDich <= now)
            .Include(x => x.DanhMuc)
            .Include(x => x.TaiKhoan)
            .Include(x => x.TaiKhoanDich)
            .OrderByDescending(x => x.NgayGiaoDich)
            .Take(100)
            .Select(x => new GiaoDichDto
            {
                GiaoDichId = x.GiaoDichId,
                SoTien = x.SoTien,
                LoaiGiaoDich = x.LoaiGiaoDich == 1 ? "THU" : x.LoaiGiaoDich == 2 ? "CHI" : x.LoaiGiaoDich == 3 ? "CHUYEN_KHOAN" : x.LoaiGiaoDich.ToString(),
                DanhMucId = x.DanhMucId,
                TenDanhMuc = x.DanhMuc != null ? x.DanhMuc.TenDanhMuc : null,
                TaiKhoanNguonId = x.TaiKhoanId,
                TenTaiKhoanNguon = x.TaiKhoan != null ? x.TaiKhoan.TenTaiKhoan : null,
                TaiKhoanDichId = x.TaiKhoanDichId,
                TenTaiKhoanDich = x.TaiKhoanDich != null ? x.TaiKhoanDich.TenTaiKhoan : null,
                NgayGiaoDich = x.NgayGiaoDich,
                GhiChu = x.MoTa
            })
            .ToListAsync(ct);

        return new GeminiChatDataDto
        {
            ThuNhap = tongThu,
            TongChi = tongChi,
            TongThu = tongThu,
            SoDu = soDu,
            ChiTheoDanhMuc = chiTheoDanhMuc,
            MucTieu = mucTieu,
            GiaoDichChiTiet = giaoDichChiTiet
        };
    }

    public async Task<List<ThongBaoDto>> LayThongBaoAsync(int nguoiDungId, int page = 1, int pageSize = 20, bool? daDoc = null, CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 200) pageSize = 200;

        var query = _context.TblThongbaos.AsNoTracking()
            .Where(x => x.NguoiDungId == nguoiDungId);

        if (daDoc.HasValue)
            query = query.Where(x => x.DaDoc == (daDoc.Value ? 1 : 0));

        var data = await query
            .OrderByDescending(x => x.NgayTao)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new ThongBaoDto
        {
            ThongBaoId = x.ThongBaoId,
            NguoiDungId = x.NguoiDungId,
            TieuDe = x.TieuDe,
            NoiDung = x.NoiDung,
            LoaiThongBao = (sbyte)x.LoaiThongBao,
            NgayTao = x.NgayTao,
            DaDoc = x.DaDoc == 1,
            // ← THÊM MỚI: 4 cột điều hướng
            LoaiDoiTuong = x.LoaiDoiTuong,
            DoiTuongId = x.DoiTuongId,
            DuongDanDieuHuong = x.DuongDanDieuHuong,
            NgayHetHan = x.NgayHetHan
        }).ToList();
    }

    public async Task<bool> DanhDauThongBaoDaDocAsync(int nguoiDungId, int id, CancellationToken ct = default)
    {
        var entity = await _context.TblThongbaos.FirstOrDefaultAsync(x => x.ThongBaoId == id && x.NguoiDungId == nguoiDungId, ct);
        if (entity == null) return false;
        entity.DaDoc = 1;
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int> TaoThongBaoAsync(TaoThongBaoDto thongBao, CancellationToken ct = default)
    {
        // Kiểm tra trùng lặp trong 24h
        var isDuplicate = await KiemTraTrungThongBaoAsync(thongBao.NguoiDungId, thongBao.NoiDung ?? string.Empty, ct);
        if (isDuplicate)
        {
            return -1; // Trả về -1 nếu trùng
        }

        var entity = new TblThongbao
        {
            NguoiDungId = thongBao.NguoiDungId,
            TieuDe = thongBao.TieuDe,
            NoiDung = thongBao.NoiDung,

            LoaiThongBao = thongBao.LoaiThongBao, // hoặc (int)

            NgayTao = TimeHelper.NowInVietnam(),

            DaDoc = 0, // hoặc false nếu bool

            LoaiDoiTuong = thongBao.LoaiDoiTuong,
            DoiTuongId = thongBao.DoiTuongId,
            DuongDanDieuHuong = thongBao.DuongDanDieuHuong,
            NgayHetHan = thongBao.NgayHetHan
        };

        _context.TblThongbaos.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.ThongBaoId;
    }

    public async Task<bool> KiemTraTrungThongBaoAsync(int nguoiDungId, string noiDung, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(noiDung))
            return false;

        var thoiGianBatDau = TimeHelper.NowInVietnam().AddHours(-24);

        return await _context.TblThongbaos
            .AsNoTracking()
            .AnyAsync(x => x.NguoiDungId == nguoiDungId
                      && x.NoiDung == noiDung
                      && x.NgayTao >= thoiGianBatDau, ct);
    }

    // Tạo thông báo từ dữ liệu AI (cảnh báo, gợi ý, dự đoán)
    public async Task<int> TaoThongBaoTuAIAsync(
        int nguoiDungId,
        List<GeminiGoiY>? danhSachGoiY,
        List<GeminiGoiY>? danhSachCanhBao,
        DuDoanAIChartDto? duDoan,
        CancellationToken ct = default)
    {
        int count = 0;

        // Tạo thông báo từ Cảnh báo (LoaiThongBao = 2)
        if (danhSachCanhBao != null)
        {
            foreach (var canhBao in danhSachCanhBao.Where(x => x.Loai == "CANH_BAO" || x.Loai == "KHICH_LE"))
            {
                var isDuplicate = await KiemTraTrungThongBaoAsync(nguoiDungId, canhBao.NoiDung, ct);
                if (!isDuplicate)
                {
                    var id = await TaoThongBaoAsync(new TaoThongBaoDto
                    {
                        NguoiDungId = nguoiDungId,
                        TieuDe = !string.IsNullOrEmpty(canhBao.TieuDe) ? canhBao.TieuDe : "Cảnh báo chi tiêu",
                        NoiDung = canhBao.NoiDung,
                        LoaiThongBao = 2 // CanhBao
                    }, ct);
                    if (id > 0) count++;
                }
            }
        }

        // Tạo thông báo từ Gợi ý (LoaiThongBao = 3)
        if (danhSachGoiY != null)
        {
            foreach (var goiY in danhSachGoiY.Where(x => x.Loai == "GOI_Y"))
            {
                var isDuplicate = await KiemTraTrungThongBaoAsync(nguoiDungId, goiY.NoiDung, ct);
                if (!isDuplicate)
                {
                    var id = await TaoThongBaoAsync(new TaoThongBaoDto
                    {
                        NguoiDungId = nguoiDungId,
                        TieuDe = !string.IsNullOrEmpty(goiY.TieuDe) ? goiY.TieuDe : "Gợi ý từ AI",
                        NoiDung = goiY.NoiDung,
                        LoaiThongBao = 3 // GoiY
                    }, ct);
                    if (id > 0) count++;
                }
            }
        }

        // Tạo thông báo từ Dự đoán (LoaiThongBao = 4)
        if (duDoan != null && duDoan.Forecast != null && duDoan.Forecast.Any(x => x > 0))
        {
            var forecastMonth = duDoan.Forecast.FirstOrDefault(x => x > 0);
            var noiDungDuDoan = $"Dự đoán chi tiêu tháng tới: {forecastMonth:N0} VND. {duDoan.GhiChu}";
            var isDuplicate = await KiemTraTrungThongBaoAsync(nguoiDungId, noiDungDuDoan, ct);
            if (!isDuplicate)
            {
                var id = await TaoThongBaoAsync(new TaoThongBaoDto
                {
                    NguoiDungId = nguoiDungId,
                    TieuDe = "Dự đoán chi tiêu tháng tới",
                    NoiDung = noiDungDuDoan,
                    LoaiThongBao = 4 // DuDoan
                }, ct);
                if (id > 0) count++;
            }
        }

        return count;
    }

    // ================== ADMIN IMPLEMENTATIONS ==================

    public async Task<List<LoiKhuyenAIDto>> LayDanhSachGoiYAdminAsync(
        int page = 1,
        int pageSize = 20,
        string? trangThai = null,
        string? loai = null,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        var query = _context.TblGoiyAis.AsNoTracking();

        if (!string.IsNullOrEmpty(trangThai))
        {
            var ts = trangThai switch
            {
                "CHO_DUYET" => (sbyte)0,
                "DA_DUYET" => (sbyte)1,
                "TU_CHOI" => (sbyte)2,
                _ => (sbyte?)null
            };
            if (ts.HasValue)
                query = query.Where(x => x.TrangThai == ts.Value);
        }

        if (!string.IsNullOrEmpty(loai))
        {
            var ls = loai switch
            {
                "CANH_BAO" => (sbyte)1,
                "GOI_Y" => (sbyte)2,
                "KHICH_LE" => (sbyte)3,
                _ => (sbyte?)null
            };
            if (ls.HasValue)
                query = query.Where(x => x.LoaiGoiY == ls.Value);
        }

        var data = await query
            .OrderByDescending(x => x.NgayTao)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return data.Select(x => new LoiKhuyenAIDto
        {
            Id = x.GoiYid,
            TieuDe = "Gợi ý từ AI",
            NoiDung = x.NoiDung ?? string.Empty,
            Loai = x.LoaiGoiY switch
            {
                1 => "CANH_BAO",
                2 => "GOI_Y",
                3 => "KHICH_LE",
                _ => "GOI_Y"
            },
            NgayTao = x.NgayTao ?? DateTime.Now,
            DaDoc = (x.DaDoc ?? 0UL) == 1UL
        }).ToList();
    }

    public async Task<bool> DuyetGoiYAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblGoiyAis.FirstOrDefaultAsync(x => x.GoiYid == id, ct);
        if (entity == null) return false;
        entity.TrangThai = 1; // Đã duyệt
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> TuChoiGoiYAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblGoiyAis.FirstOrDefaultAsync(x => x.GoiYid == id, ct);
        if (entity == null) return false;
        entity.TrangThai = 2; // Từ chối
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> XoaGoiYAsync(int id, CancellationToken ct = default)
    {
        var entity = await _context.TblGoiyAis.FirstOrDefaultAsync(x => x.GoiYid == id, ct);
        if (entity == null) return false;
        _context.TblGoiyAis.Remove(entity);
        await _context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int> TaoGoiYAdminAsync(LoiKhuyenAIDto dto, CancellationToken ct = default)
    {
        var loaiSo = dto.Loai switch
        {
            "CANH_BAO" => (sbyte)1,
            "GOI_Y" => (sbyte)2,
            "KHICH_LE" => (sbyte)3,
            _ => (sbyte)2
        };

        var entity = new TblGoiyAi
        {
            NoiDung = dto.NoiDung,
            LoaiGoiY = loaiSo,
            TrangThai = 1, // Đã duyệt
            NgayTao = TimeHelper.NowInVietnam(),
            DaDoc = 0UL,
            NguoiDungId = 0 // Admin tạo cho hệ thống
        };

        _context.TblGoiyAis.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity.GoiYid;
    }

    public async Task<ThongKeAIDto> LayThongKeAIAsync(CancellationToken ct = default)
    {
        var goiYStats = await _context.TblGoiyAis
            .AsNoTracking()
            .GroupBy(x => x.TrangThai)
            .Select(g => new { TrangThai = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var canhBaoCount = await _context.TblCanhbaos
            .AsNoTracking()
            .CountAsync(ct);

        return new ThongKeAIDto
        {
            TongGoiY = goiYStats.Sum(x => x.Count),
            DaDuyet = goiYStats.FirstOrDefault(x => x.TrangThai == 1)?.Count ?? 0,
            ChoDuyet = goiYStats.FirstOrDefault(x => x.TrangThai == 0)?.Count ?? 0,
            TuChoi = goiYStats.FirstOrDefault(x => x.TrangThai == 2)?.Count ?? 0,
            TongCanhBao = canhBaoCount
        };
    }
}

