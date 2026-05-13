using BLL.Interfaces;
using Common;
using DAL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/dashboard")]
// [Authorize(Roles = "admin")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly INguoiDungBll _nguoiDungBll;
    private readonly IGiaoDichBll _giaoDichBll;
    private readonly INganSachBll _nganSachBll;
    private readonly IAuditLogBll _auditLogBll;
    private readonly IPhanHoiBll _phanHoiBll;
    private readonly ILichsuDangnhapDal _lichSuDangNhapDal;

    public DashboardController(
        INguoiDungBll nguoiDungBll,
        IGiaoDichBll giaoDichBll,
        INganSachBll nganSachBll,
        IAuditLogBll auditLogBll,
        IPhanHoiBll phanHoiBll,
        ILichsuDangnhapDal lichSuDangNhapDal)
    {
        _nguoiDungBll = nguoiDungBll;
        _giaoDichBll = giaoDichBll;
        _nganSachBll = nganSachBll;
        _auditLogBll = auditLogBll;
        _phanHoiBll = phanHoiBll;
        _lichSuDangNhapDal = lichSuDangNhapDal;
    }

    [HttpGet("tong-hop")]
    [ProducesResponseType(typeof(ApiResponse<DashboardTongHopDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<DashboardTongHopDto>>> GetTongHop(CancellationToken ct)
    {
        try
        {
            var currentYear = TimeHelper.NowInVietnam().Year;

            // Thống kê người dùng
            var tongNguoiDungHoatDong = await _nguoiDungBll.DemNguoiDungHoatDongAsync(ct);
            var nguoiDungMoi7Ngay = await _nguoiDungBll.DemNguoiDungMoi7NgayAsync(ct);
            var nguoiDungBiVoHieuHoa = await _nguoiDungBll.DemNguoiDungBiVoHieuHoaAsync(ct);

            // Đếm đăng nhập hôm nay từ bảng lich su dang nhap
            var nguoiDungDangNhapHomNay = await _lichSuDangNhapDal.DemDangNhapHomNayAsync(ct);

            // Thống kê giao dịch
            var tongGiaoDichHeThong = await _giaoDichBll.DemTongGiaoDichHeThongAsync(ct);
            var tongThuThangHienTai = await _giaoDichBll.DemTongThuThangHienTaiAsync(ct);
            var tongChiThangHienTai = await _giaoDichBll.DemTongChiThangHienTaiAsync(ct);

            // Phản hồi chờ xử lý
            var phanHoiChoXuLy = await _phanHoiBll.DemPhanHoiChoXuLyAsync();

            // Tổng quan
            var tongQuan = new DashboardTongQuanDto
            {
                TongNguoiDungHoatDong = tongNguoiDungHoatDong,
                NguoiDungMoi7Ngay = nguoiDungMoi7Ngay,
                NguoiDungDangNhapHomNay = nguoiDungDangNhapHomNay,
                TongNguoiDungBiVoHieuHoa = nguoiDungBiVoHieuHoa,
                TongGiaoDichHeThong = tongGiaoDichHeThong,
                TongThuThangHienTai = tongThuThangHienTai,
                TongChiThangHienTai = tongChiThangHienTai,
                PhanHoiChoXuLy = phanHoiChoXuLy
            };

            // Tăng trưởng người dùng theo tháng trong năm hiện tại
            var tangTruongNguoiDung = await _nguoiDungBll.LayThongKeTangTruongNguoiDungAsync(currentYear, ct);

            // Thống kê giao dịch 6 tháng gần nhất
            var giaoDich6Thang = await _giaoDichBll.LayThongKe6ThangGanNhatAsync(ct);

            // Chi tiêu theo danh mục (top 6)
            var chiTieuDanhMuc = await _giaoDichBll.LayChiTieuTheoDanhMucAsync(6, ct);

            // Cảnh báo ngân sách vượt mức
            var canhBaoNganSach = await _nganSachBll.LayCanhBaoVuotMucAsync(ct);

            // Hoạt động gần đây (audit log)
            var hoatDongGanDay = await _auditLogBll.LayGanNhatAsync(10, ct);

            var result = new DashboardTongHopDto
            {
                TongQuan = tongQuan,
                TangTruongNguoiDung = new ThongKeNguoiDungDto
                {
                    Labels = tangTruongNguoiDung.Labels,
                    Data = tangTruongNguoiDung.Data
                },
                GiaoDich6Thang = giaoDich6Thang,
                ChiTieuDanhMuc = chiTieuDanhMuc,
                CanhBaoNganSach = canhBaoNganSach,
                HoatDongGanDay = hoatDongGanDay
            };

            return Ok(ApiResponse<DashboardTongHopDto>.Ok(result, "Lấy tổng hợp dashboard thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi khi lấy dữ liệu dashboard: {ex.Message}"));
        }
    }

    [HttpGet("thong-ke-nguoi-dung")]
    [ProducesResponseType(typeof(ApiResponse<ThongKeNguoiDungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ThongKeNguoiDungDto>>> GetThongKeNguoiDung(
        [FromQuery] int? nam = null,
        CancellationToken ct = default)
    {
        try
        {
            var year = nam ?? TimeHelper.NowInVietnam().Year;
            var data = await _nguoiDungBll.LayThongKeTangTruongNguoiDungAsync(year, ct);
            return Ok(ApiResponse<ThongKeNguoiDungDto>.Ok(data));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    [HttpGet("thong-ke-giao-dich-6-thang")]
    [ProducesResponseType(typeof(ApiResponse<List<ThongKeGiaoDichThangDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ThongKeGiaoDichThangDto>>>> GetThongKeGiaoDich6Thang(CancellationToken ct)
    {
        try
        {
            var data = await _giaoDichBll.LayThongKe6ThangGanNhatAsync(ct);
            return Ok(ApiResponse<List<ThongKeGiaoDichThangDto>>.Ok(data));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    [HttpGet("chi-tieu-danh-muc")]
    [ProducesResponseType(typeof(ApiResponse<List<ChiTieuTheoDanhMucDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ChiTieuTheoDanhMucDto>>>> GetChiTieuDanhMuc(
        [FromQuery] int top = 6,
        CancellationToken ct = default)
    {
        try
        {
            var data = await _giaoDichBll.LayChiTieuTheoDanhMucAsync(top, ct);
            return Ok(ApiResponse<List<ChiTieuTheoDanhMucDto>>.Ok(data));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    [HttpGet("canh-bao-ngan-sach")]
    [ProducesResponseType(typeof(ApiResponse<List<CanhBaoNganSachAdminDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<CanhBaoNganSachAdminDto>>>> GetCanhBaoNganSach(CancellationToken ct)
    {
        try
        {
            var data = await _nganSachBll.LayCanhBaoVuotMucAsync(ct);
            return Ok(ApiResponse<List<CanhBaoNganSachAdminDto>>.Ok(data));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    [HttpGet("hoat-dong-gan-day")]
    [ProducesResponseType(typeof(ApiResponse<List<AdminAuditLogDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<AdminAuditLogDto>>>> GetHoatDongGanDay(
        [FromQuery] int count = 10,
        CancellationToken ct = default)
    {
        try
        {
            var data = await _auditLogBll.LayGanNhatAsync(count, ct);
            return Ok(ApiResponse<List<AdminAuditLogDto>>.Ok(data));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }
}
