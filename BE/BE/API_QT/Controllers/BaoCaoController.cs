using BLL;
using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/dashboard")]
[Authorize]
public class BaoCaoController : ControllerBase
{
    private readonly INguoiDungBll _nguoiDungBll;
    private readonly IGiaoDichBll _giaoDichBll;
    private readonly IAuditLogBll _auditLogBll;
    private readonly ILichsuDangnhapDal _lichSuDangNhapDal;
    private readonly ILichsuDangnhapBll _lichSuDangNhapBll;
    private readonly IThongBaoBll _thongBaoBll;
    private readonly IPhanHoiBll _phanHoiBll;
    private readonly IGiaoDichDinhKyBll _giaoDichDinhKyBll;

    public BaoCaoController(
        INguoiDungBll nguoiDungBll,
        IGiaoDichBll giaoDichBll,
        IAuditLogBll auditLogBll,
        ILichsuDangnhapDal lichSuDangNhapDal,
        ILichsuDangnhapBll lichSuDangNhapBll,
        IThongBaoBll thongBaoBll,
        IPhanHoiBll phanHoiBll,
        IGiaoDichDinhKyBll giaoDichDinhKyBll)
    {
        _nguoiDungBll = nguoiDungBll;
        _giaoDichBll = giaoDichBll;
        _auditLogBll = auditLogBll;
        _lichSuDangNhapDal = lichSuDangNhapDal;
        _lichSuDangNhapBll = lichSuDangNhapBll;
        _thongBaoBll = thongBaoBll;
        _phanHoiBll = phanHoiBll;
        _giaoDichDinhKyBll = giaoDichDinhKyBll;
    }

    // ==================== 1. THỐNG KÊ NGƯỜI DÙNG ====================

    /// <summary>
    /// Lấy thống kê người dùng đầy đủ
    /// </summary>
    [HttpGet("thong-ke-nguoi-dung-full")]
    public async Task<ActionResult<ApiResponse<ThongKeNguoiDungFullDto>>> GetThongKeNguoiDungFull(CancellationToken ct)
    {
        try
        {
            var tong = await _nguoiDungBll.DemTongNguoiDungAsync(ct);
            var hoatDong = await _nguoiDungBll.DemNguoiDungHoatDongAsync(ct);
            var biKhoa = await _nguoiDungBll.DemNguoiDungBiVoHieuHoaAsync(ct);
            var daXoa = await _nguoiDungBll.DemNguoiDungDaXoaAsync(ct);
            var emailXacThuc = await _nguoiDungBll.DemEmailDaXacThucAsync(ct);
            var sdtXacThuc = await _nguoiDungBll.DemSDTDaXacThucAsync(ct);
            var dang2FA = await _nguoiDungBll.DemDang2FAAsync(ct);
            var google = await _nguoiDungBll.DemSocialProviderAsync("GOOGLE", ct);
            var facebook = await _nguoiDungBll.DemSocialProviderAsync("FACEBOOK", ct);

            var result = new ThongKeNguoiDungFullDto
            {
                TongNguoiDung = tong,
                DangHoatDong = hoatDong,
                BiKhoa = biKhoa,
                DaXoa = daXoa,
                EmailDaXacThuc = emailXacThuc,
                SDTDaXacThuc = sdtXacThuc,
                Dang2FA = dang2FA,
                TongSocial = google + facebook,
                Google = google,
                Facebook = facebook
            };

            return Ok(ApiResponse<ThongKeNguoiDungFullDto>.Ok(result, "Lấy thống kê người dùng thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy người dùng mới theo thời gian
    /// </summary>
    [HttpGet("nguoi-dung-moi")]
    public async Task<ActionResult<ApiResponse<List<NguoiDungMoiTheoThoiGianDto>>>> GetNguoiDungMoi(
        [FromQuery] string loai = "thang",
        CancellationToken ct = default)
    {
        try
        {
            var now = TimeHelper.NowInVietnam();
            List<NguoiDungMoiTheoThoiGianDto> result = new();

            if (loai == "ngay")
            {
                // Theo ngày trong 30 ngày gần nhất
                for (int i = 29; i >= 0; i--)
                {
                    var date = now.Date.AddDays(-i);
                    var count = await _nguoiDungBll.DemNguoiDungMoiTheoNgayAsync(date, ct);
                    result.Add(new NguoiDungMoiTheoThoiGianDto
                    {
                        Ngay = date.ToString("dd/MM"),
                        SoLuong = count
                    });
                }
            }
            else if (loai == "tuan")
            {
                // Theo tuần trong 12 tuần gần nhất
                for (int i = 11; i >= 0; i--)
                {
                    var weekStart = now.Date.AddDays(-(int)now.DayOfWeek - (i * 7));
                    var count = await _nguoiDungBll.DemNguoiDungMoiTheoTuanAsync(weekStart, ct);
                    result.Add(new NguoiDungMoiTheoThoiGianDto
                    {
                        Tuan = $"Tuần {12 - i}",
                        SoLuong = count
                    });
                }
            }
            else
            {
                // Theo tháng trong năm hiện tại
                var year = now.Year;
                for (int month = 1; month <= now.Month; month++)
                {
                    var count = await _nguoiDungBll.DemNguoiDungMoiTheoThangAsync(month, year, ct);
                    result.Add(new NguoiDungMoiTheoThoiGianDto
                    {
                        Thang = $"T{month}",
                        SoLuong = count
                    });
                }
            }

            return Ok(ApiResponse<List<NguoiDungMoiTheoThoiGianDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy thống kê thiết bị & hệ điều hành
    /// </summary>
    [HttpGet("thiet-bi")]
    public async Task<ActionResult<ApiResponse<List<ThietBiHeDieuHanhDto>>>> GetThietBi(CancellationToken ct)
    {
        try
        {
            var loginHistory = await _lichSuDangNhapDal.LayTatCaAsync(ct);
            var total = loginHistory.Count;

            // Phân tích thiết bị từ UserAgent
            var deviceStats = loginHistory
                .Where(x => !string.IsNullOrEmpty(x.ThietBi))
                .GroupBy(x => ParseDevice(x.ThietBi ?? ""))
                .Select(g => new ThietBiHeDieuHanhDto
                {
                    Ten = g.Key,
                    SoLuong = g.Count(),
                    PhanTram = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
                })
                .OrderByDescending(x => x.SoLuong)
                .ToList();

            // Thêm "Không xác định" nếu có
            var unknownCount = loginHistory.Count(x => string.IsNullOrEmpty(x.ThietBi));
            if (unknownCount > 0)
            {
                deviceStats.Add(new ThietBiHeDieuHanhDto
                {
                    Ten = "Không xác định",
                    SoLuong = unknownCount,
                    PhanTram = total > 0 ? Math.Round((double)unknownCount / total * 100, 1) : 0
                });
            }

            return Ok(ApiResponse<List<ThietBiHeDieuHanhDto>>.Ok(deviceStats));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy DAU/MAU
    /// </summary>
    [HttpGet("dau-mau")]
    public async Task<ActionResult<ApiResponse<DAUMAUDto>>> GetDAUMAU(CancellationToken ct)
    {
        try
        {
            var now = TimeHelper.NowInVietnam();
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            // DAU - đếm user đăng nhập hôm nay
            var dau = await _lichSuDangNhapDal.DemDangNhapHomNayAsync(ct);

            // MAU - đếm user đăng nhập trong tháng
            var mau = await _lichSuDangNhapDal.DemDangNhapThangAsync(startOfMonth, ct);

            var result = new DAUMAUDto
            {
                DAU = dau,
                MAU = mau,
                TyLe = mau > 0 ? Math.Round((double)dau / mau * 100, 1) : 0
            };

            return Ok(ApiResponse<DAUMAUDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy người dùng không hoạt động
    /// </summary>
    [HttpGet("nguoi-dung-khong-hoat-dong")]
    public async Task<ActionResult<ApiResponse<List<NguoiDungKhongHoatDongDto>>>> GetNguoiDungKhongHoatDong(
        [FromQuery] int soNgay = 30,
        CancellationToken ct = default)
    {
        try
        {
            var cutoffDate = TimeHelper.NowInVietnam().AddDays(-soNgay);
            var users = await _nguoiDungBll.LayNguoiDungKhongHoatDongAsync(cutoffDate, ct);

            var result = users.Select(u => new NguoiDungKhongHoatDongDto
            {
                NguoiDungId = u.NguoiDungId,
                HoTen = u.HoTen,
                Email = u.Email,
                LanDangNhapCuoi = u.LanDangNhapCuoi?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa đăng nhập",
                SoNgayKhongHoatDong = u.LanDangNhapCuoi.HasValue
                    ? (int)(TimeHelper.NowInVietnam() - u.LanDangNhapCuoi.Value).TotalDays
                    : 999
            }).ToList();

            return Ok(ApiResponse<List<NguoiDungKhongHoatDongDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    // ==================== 2. THỐNG KÊ GIAO DỊCH ====================

    /// <summary>
    /// Lấy thống kê giao dịch đầy đủ
    /// </summary>
    [HttpGet("thong-ke-giao-dich-full")]
    public async Task<ActionResult<ApiResponse<ThongKeGiaoDichFullDto>>> GetThongKeGiaoDichFull(CancellationToken ct)
    {
        try
        {
            var tong = await _giaoDichBll.DemTongGiaoDichHeThongAsync(ct);
            var thanhCong = await _giaoDichBll.DemGiaoDichThanhCongAsync(ct);
            var loi = await _giaoDichBll.DemGiaoDichLoiAsync(ct);
            var tongThu = await _giaoDichBll.DemTongThuThangHienTaiAsync(ct);
            var tongChi = await _giaoDichBll.DemTongChiThangHienTaiAsync(ct);

            // Theo nguồn tạo
            var web = await _giaoDichBll.DemGiaoDichTheoNguonAsync("web", ct);
            var mobile = await _giaoDichBll.DemGiaoDichTheoNguonAsync("mobile", ct);
            var ai = await _giaoDichBll.DemGiaoDichTheoNguonAsync("ai", ct);
            var importCount = await _giaoDichBll.DemGiaoDichTheoNguonAsync("import", ct);

            var result = new ThongKeGiaoDichFullDto
            {
                TongGiaoDich = tong,
                GiaoDichThanhCong = thanhCong,
                GiaoDichLoi = loi,
                TongThu = tongThu,
                TongChi = tongChi,
                Web = web,
                Mobile = mobile,
                AI = ai,
                Import = importCount
            };

            return Ok(ApiResponse<ThongKeGiaoDichFullDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy giao dịch theo danh mục
    /// </summary>
    [HttpGet("giao-dich-theo-danh-muc")]
    public async Task<ActionResult<ApiResponse<List<GiaoDichTheoDanhMucDto>>>> GetGiaoDichTheoDanhMuc(CancellationToken ct)
    {
        try
        {
            var result = await _giaoDichBll.LayGiaoDichTheoDanhMucFullAsync(ct);
            return Ok(ApiResponse<List<GiaoDichTheoDanhMucDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy thống kê giao dịch định kỳ
    /// </summary>
    [HttpGet("giao-dich-dinh-ky-thong-ke")]
    public async Task<ActionResult<ApiResponse<GiaoDichDinhKyThongKeDto>>> GetGiaoDichDinhKyThongKe(CancellationToken ct)
    {
        try
        {
            var dangHoatDong = await _giaoDichDinhKyBll.DemDangHoatDongAsync(ct);
            var ngungHoatDong = await _giaoDichDinhKyBll.DemNgungHoatDongAsync(ct);
            var nguoiDungSuDung = await _giaoDichDinhKyBll.DemNguoiDungSuDungAsync(ct);

            var result = new GiaoDichDinhKyThongKeDto
            {
                TongDangHoatDong = dangHoatDong,
                TongNgungHoatDong = ngungHoatDong,
                TongNguoiDungSuDung = nguoiDungSuDung
            };

            return Ok(ApiResponse<GiaoDichDinhKyThongKeDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    // ==================== 3. THỐNG KÊ THÔNG BÁO & PHẢN HỒI ====================

    /// <summary>
    /// Lấy thống kê thông báo
    /// </summary>
    [HttpGet("thong-ke-thong-bao")]
    public async Task<ActionResult<ApiResponse<ThongKeThongBaoDto>>> GetThongKeThongBao(CancellationToken ct)
    {
        try
        {
            var result = await _thongBaoBll.LayThongKeThongBaoAsync(ct);
            return Ok(ApiResponse<ThongKeThongBaoDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy thống kê phản hồi
    /// </summary>
    [HttpGet("thong-ke-phan-hoi")]
    public async Task<ActionResult<ApiResponse<ThongKePhanHoiDto>>> GetThongKePhanHoi(CancellationToken ct)
    {
        try
        {
            var result = await _phanHoiBll.LayThongKePhanHoiAsync(ct);
            return Ok(ApiResponse<ThongKePhanHoiDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    // ==================== 4. BẢO MẬT & AUDIT ====================

    /// <summary>
    /// Lấy thống kê bảo mật
    /// </summary>
    [HttpGet("thong-ke-bao-mat")]
    public async Task<ActionResult<ApiResponse<ThongKeBaoMatDto>>> GetThongKeBaoMat(CancellationToken ct)
    {
        try
        {
            var tong = await _lichSuDangNhapDal.DemTongDangNhapAsync(ct);
            var thanhCong = await _lichSuDangNhapDal.DemDangNhapThanhCongAsync(ct);
            var thatBai = await _lichSuDangNhapDal.DemDangNhapThatBaiAsync(ct);

            var result = new ThongKeBaoMatDto
            {
                TongDangNhap = tong,
                ThanhCong = thanhCong,
                ThatBai = thatBai,
                TyLeThatBai = tong > 0 ? Math.Round((double)thatBai / tong * 100, 1) : 0
            };

            return Ok(ApiResponse<ThongKeBaoMatDto>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy đăng nhập thất bại gần đây
    /// </summary>
    [HttpGet("dang-nhap-that-bai")]
    public async Task<ActionResult<ApiResponse<List<DangNhapThatBaiDto>>>> GetDangNhapThatBai(
        [FromQuery] int gioiHan = 50,
        CancellationToken ct = default)
    {
        try
        {
            var result = await _lichSuDangNhapBll.LayDangNhapThatBaiAsync(gioiHan, ct);
            return Ok(ApiResponse<List<DangNhapThatBaiDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy audit log theo user
    /// </summary>
    [HttpGet("audit-log-theo-user")]
    public async Task<ActionResult<ApiResponse<List<AuditLogTheoUserDto>>>> GetAuditLogTheoUser(CancellationToken ct)
    {
        try
        {
            var result = await _auditLogBll.LayAuditLogTheoUserAsync(ct);
            return Ok(ApiResponse<List<AuditLogTheoUserDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Lấy hoạt động bất thường (đăng nhập từ nhiều IP khác nhau)
    /// </summary>
    [HttpGet("hoat-dong-bat-thuong")]
    public async Task<ActionResult<ApiResponse<List<HoatDongBatThuongDto>>>> GetHoatDongBatThuong(CancellationToken ct)
    {
        try
        {
            var result = await _lichSuDangNhapBll.LayHoatDongBatThuongAsync(ct);
            return Ok(ApiResponse<List<HoatDongBatThuongDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    // ==================== HELPER METHODS ====================

    private string ParseDevice(string userAgent)
    {
        if (string.IsNullOrEmpty(userAgent)) return "Không xác định";

        if (userAgent.Contains("Android")) return "Android";
        if (userAgent.Contains("iPhone") || userAgent.Contains("iPad") || userAgent.Contains("iOS")) return "iOS";
        if (userAgent.Contains("Windows")) return "Windows";
        if (userAgent.Contains("Macintosh") || userAgent.Contains("Mac OS")) return "MacOS";
        if (userAgent.Contains("Linux")) return "Linux";

        return "Khác";
    }
}

// ==================== DTOs for BaoCao ====================

public class ThongKeNguoiDungFullDto
{
    public int TongNguoiDung { get; set; }
    public int DangHoatDong { get; set; }
    public int BiKhoa { get; set; }
    public int DaXoa { get; set; }
    public int EmailDaXacThuc { get; set; }
    public int SDTDaXacThuc { get; set; }
    public int Dang2FA { get; set; }
    public int TongSocial { get; set; }
    public int Google { get; set; }
    public int Facebook { get; set; }
}

public class NguoiDungMoiTheoThoiGianDto
{
    public string? Ngay { get; set; }
    public string? Tuan { get; set; }
    public string? Thang { get; set; }
    public int SoLuong { get; set; }
}

public class ThietBiHeDieuHanhDto
{
    public string Ten { get; set; } = "";
    public int SoLuong { get; set; }
    public double PhanTram { get; set; }
}

public class DAUMAUDto
{
    public int DAU { get; set; }
    public int MAU { get; set; }
    public double TyLe { get; set; }
}

public class NguoiDungKhongHoatDongDto
{
    public int NguoiDungId { get; set; }
    public string HoTen { get; set; } = "";
    public string Email { get; set; } = "";
    public string LanDangNhapCuoi { get; set; } = "";
    public int SoNgayKhongHoatDong { get; set; }
}

public class ThongKeGiaoDichFullDto
{
    public int TongGiaoDich { get; set; }
    public int GiaoDichThanhCong { get; set; }
    public int GiaoDichLoi { get; set; }
    public decimal TongThu { get; set; }
    public decimal TongChi { get; set; }
    public int Web { get; set; }
    public int Mobile { get; set; }
    public int AI { get; set; }
    public int Import { get; set; }
}


public class GiaoDichDinhKyThongKeDto
{
    public int TongDangHoatDong { get; set; }
    public int TongNgungHoatDong { get; set; }
    public int TongNguoiDungSuDung { get; set; }
}


public class ThongBaoTheoLoaiDto
{
    public string Loai { get; set; } = "";
    public int TongSo { get; set; }
    public int DaDoc { get; set; }
    public double TyLeDoc { get; set; }
}



public class ThongKeBaoMatDto
{
    public int TongDangNhap { get; set; }
    public int ThanhCong { get; set; }
    public int ThatBai { get; set; }
    public double TyLeThatBai { get; set; }
}



