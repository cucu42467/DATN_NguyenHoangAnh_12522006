using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/bao-cao")]
[Authorize]
public class BaoCaoController : ControllerBase
{
    private readonly BLL.Interfaces.IBaoCaoBll _bll;

    public BaoCaoController(BLL.Interfaces.IBaoCaoBll bll)
    {
        _bll = bll;
    }

    [HttpGet("tong-hop")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoTongHopChiSoDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoTongHopChiSoDto>>> TongHop(
        [FromQuery] string duration = "month",
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        // Parse date strings to DateTime (yyyy-MM-dd format)
        DateTime? fromDate = null;
        DateTime? toDate = null;
        
        if (!string.IsNullOrEmpty(tuNgay) && DateTime.TryParse(tuNgay, out var parsedTuNgay))
        {
            // Start of day in Vietnam time, then convert to UTC
            var localStart = new DateTime(parsedTuNgay.Year, parsedTuNgay.Month, parsedTuNgay.Day, 0, 0, 0);
            fromDate = localStart.ToVietnamTime().ToUtc();
        }
        
        if (!string.IsNullOrEmpty(denNgay) && DateTime.TryParse(denNgay, out var parsedDenNgay))
        {
            // End of day in Vietnam time, then convert to UTC
            var localEnd = new DateTime(parsedDenNgay.Year, parsedDenNgay.Month, parsedDenNgay.Day, 23, 59, 59);
            toDate = localEnd.ToVietnamTime().ToUtc();
        }

        var data = await _bll.LayTongHopChiSoAsync(userId.Value, duration, thang, nam, fromDate, toDate, ct);
        return Ok(ApiResponse<BaoCaoTongHopChiSoDto>.Ok(data, "Lấy tổng hợp thành công"));
    }

    [HttpGet("bieu-do")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoTongQuanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoTongQuanDto>>> BieuDo(
        [FromQuery] string duration = "month",
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayBieuDoTongQuanAsync(userId.Value, duration, thang, nam, tuNgay, denNgay, ct);
        return Ok(ApiResponse<BaoCaoTongQuanDto>.Ok(data, "Lấy biểu đồ thành công"));
    }

    [HttpGet("phan-bo-danh-muc")]
    [ProducesResponseType(typeof(ApiResponse<PhanBoDanhMucDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PhanBoDanhMucDto>>> PhanBoDanhMuc(
        [FromQuery] string duration = "month",
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        [FromQuery] string loai = "CHI",
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayPhanBoDanhMucAsync(userId.Value, duration, thang, nam, loai, tuNgay, denNgay, ct);
        return Ok(ApiResponse<PhanBoDanhMucDto>.Ok(data, "Lấy phân bổ thành công"));
    }

    /// <summary>
    /// Kiểm tra và trả về thông tin lệch giữa ngân sách và giao dịch
    /// </summary>
    [HttpGet("kiem-tra-lech")]
    [ProducesResponseType(typeof(ApiResponse<DongBoKetQuaDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<DongBoKetQuaDto>>> KiemTraLech(
        [FromQuery] int thang,
        [FromQuery] int nam,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.KiemTraLechAsync(userId.Value, thang, nam, ct);
        return Ok(ApiResponse<DongBoKetQuaDto>.Ok(data, data.ThongBao));
    }

    /// <summary>
    /// Đồng bộ lại SoTienDaChi cho tbl_ngansach từ tbl_giaodich
    /// </summary>
    [HttpPost("dong-bo-ngan-sach")]
    [ProducesResponseType(typeof(ApiResponse<DongBoKetQuaDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<DongBoKetQuaDto>>> DongBoNganSach(
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.DongBoNganSachAsync(userId, thang, nam, ct);
        return Ok(ApiResponse<DongBoKetQuaDto>.Ok(data, data.ThongBao));
    }

    /// <summary>
    /// Đồng bộ lại TongChi/TongThu cho tbl_tonghop_thang từ tbl_giaodich
    /// </summary>
    [HttpPost("dong-bo-tong-hop-thang")]
    [ProducesResponseType(typeof(ApiResponse<DongBoKetQuaDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<DongBoKetQuaDto>>> DongBoTongHopThang(
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.DongBoTongHopThangAsync(userId, thang, nam, ct);
        return Ok(ApiResponse<DongBoKetQuaDto>.Ok(data, data.ThongBao));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }

    // ============== CÁC API BÁO CÁO MỚI ==============

    /// <summary>
    /// Báo cáo tổng quan tài khoản: tổng tài sản, phân bổ theo loại, biến động số dư
    /// </summary>
    [HttpGet("tai-khoan")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoTaiKhoanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoTaiKhoanDto>>> BaoCaoTaiKhoan(
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayBaoCaoTaiKhoanAsync(userId.Value, thang, nam, ct);
        return Ok(ApiResponse<BaoCaoTaiKhoanDto>.Ok(data, "Lấy báo cáo tài khoản thành công"));
    }

    /// <summary>
    /// Báo cáo chi tiêu theo danh mục: top danh mục, so sánh tháng trước, drill-down cha-con
    /// </summary>
    [HttpGet("danh-muc")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoDanhMucDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoDanhMucDto>>> BaoCaoDanhMuc(
        [FromQuery] int? thang = null,
        [FromQuery] int? nam = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayBaoCaoDanhMucAsync(userId.Value, thang, nam, ct);
        return Ok(ApiResponse<BaoCaoDanhMucDto>.Ok(data, "Lấy báo cáo danh mục thành công"));
    }

    /// <summary>
    /// Báo cáo ngân sách: tiến độ, cảnh báo vượt, lịch sử thực hiện, tỷ lệ tuân thủ
    /// </summary>
    [HttpGet("ngan-sach")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoNganSachDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoNganSachDto>>> BaoCaoNganSach(
        [FromQuery] int thang,
        [FromQuery] int nam,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayBaoCaoNganSachAsync(userId.Value, thang, nam, ct);
        return Ok(ApiResponse<BaoCaoNganSachDto>.Ok(data, "Lấy báo cáo ngân sách thành công"));
    }

    /// <summary>
    /// Báo cáo mục tiêu tiết kiệm: tiến độ, tốc độ đóng góp, lịch sử, so sánh kế hoạch vs thực tế
    /// </summary>
    [HttpGet("muc-tieu")]
    [ProducesResponseType(typeof(ApiResponse<BaoCaoMucTieuDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BaoCaoMucTieuDto>>> BaoCaoMucTieu(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayBaoCaoMucTieuAsync(userId.Value, ct);
        return Ok(ApiResponse<BaoCaoMucTieuDto>.Ok(data, "Lấy báo cáo mục tiêu thành công"));
    }
}
