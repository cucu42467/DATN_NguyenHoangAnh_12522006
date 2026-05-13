using System.IdentityModel.Tokens.Jwt;
using BLL.Interfaces;
using DAL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiBll _bll;

    public AiController(IAiBll bll)
    {
        _bll = bll;
    }

    [HttpGet("dudoan")]
    public async Task<ActionResult<DuDoanAIChartDto>> DuDoan([FromQuery] int? thang = null, [FromQuery] int? nam = null, CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var data = await _bll.LayDuDoanAsync(userId, thang, nam, ct);
        return Ok(data);
    }

    [HttpGet("goi-y")]
    public async Task<ActionResult<List<LoiKhuyenAIDto>>> LayGoiY(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool? daDoc = null,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var data = await _bll.LayGoiYAsync(userId, page, pageSize, daDoc, ct);
        return Ok(data);
    }

    [HttpPut("goi-y/{id:int}/da-doc")]
    public async Task<IActionResult> DanhDauGoiYDaDoc(int id, CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var ok = await _bll.DanhDauGoiYDaDocAsync(userId, id, ct);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpGet("assistant/context")]
    public async Task<ActionResult<GeminiChatDataDto>> LayAssistantContext(CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var context = await _bll.LayDuLieuChatAsync(userId, ct);
        return Ok(context);
    }

    [HttpPost("assistant/chat")]
    public Task<ActionResult<GeminiChatResponse>> ChatAssistant(
        [FromBody] GeminiChatRequest request,
        CancellationToken ct = default)
        => ChatVoiGemini(request, ct);

    [HttpPost("gemini/phan-tich")]
    public async Task<ActionResult<GeminiPhanTichResponse>> PhanTichBangGemini(
        [FromBody] GeminiPhanTichRequest request,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var result = await _bll.PhanTichChiTieuBangGeminiAsync(
            userId,
            request.TuNgay,
            request.DenNgay,
            ct
        );

        return Ok(result);
    }

    [HttpPost("gemini/chat")]
    public async Task<ActionResult<GeminiChatResponse>> ChatVoiGemini(
        [FromBody] GeminiChatRequest request,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        if (string.IsNullOrWhiteSpace(request.TinNhan))
            return BadRequest("Tin nhan khong duoc trong");

        var result = await _bll.ChatVoiGeminiAsync(
            userId,
            request.TinNhan,
            request.LichSuTinNhan,
            request.LoaiYeuCau,
            ct
        );

        return Ok(result);
    }

    // Tạo dữ liệu AI và thông báo tự động
    [HttpPost("tao-du-lieu")]
    public async Task<ActionResult<object>> TaoDuLieuAI(CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        try
        {
            // 1. Lấy dự đoán
            var duDoan = await _bll.LayDuDoanAsync(userId, null, null, ct);

            // 2. Phân tích chi tiêu bằng AI
            var phanTich = await _bll.PhanTichChiTieuBangGeminiAsync(userId, null, null, ct);

            // 3. Tạo thông báo từ kết quả AI
            int soThongBao = 0;
            if (phanTich?.GoiY != null && phanTich.GoiY.Any())
            {
                // Tạo thông báo từ từng gợi ý/cảnh báo
                foreach (var goiY in phanTich.GoiY)
                {
                    if (goiY.Loai == "GOI_Y")
                    {
                        var loiKhuyen = new LoiKhuyenAIDto
                        {
                            Id = 0,
                            TieuDe = goiY.TieuDe,
                            NoiDung = goiY.NoiDung,
                            Loai = "GOI_Y",
                            NgayTao = DateTime.UtcNow,
                            DaDoc = false
                        };
                        var id = await _bll.TaoThongBaoTuGoiYAsync(userId, loiKhuyen, ct);
                        if (id > 0) soThongBao++;
                    }
                    else if (goiY.Loai == "CANH_BAO" || goiY.Loai == "KHICH_LE")
                    {
                        var canhBao = new CanhBaoHeThongDto
                        {
                            Id = 0,
                            NoiDung = goiY.NoiDung,
                            MucDo = "TRUNG_BINH",
                            IsDaDoc = false,
                            NgayTao = DateTime.UtcNow
                        };
                        var id = await _bll.TaoThongBaoTuCanhBaoAsync(userId, canhBao, ct);
                        if (id > 0) soThongBao++;
                    }
                }
            }

            // 4. Tạo thông báo dự đoán
            if (duDoan?.Forecast != null && duDoan.Forecast.Any(x => x > 0))
            {
                var forecastMonth = duDoan.Forecast.FirstOrDefault(x => x > 0);
                var noiDungDuDoan = $"Dự đoán chi tiêu tháng tới: {forecastMonth:N0} VND. {duDoan.GhiChu}";
                var id = await _bll.TaoThongBaoTuDuDoanAsync(userId, noiDungDuDoan, ct);
                if (id > 0) soThongBao++;
            }

            return Ok(new
            {
                success = true,
                message = $"Đã tạo {soThongBao} thông báo mới",
                duDoan = duDoan,
                phanTich = phanTich
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = $"Lỗi khi tạo dữ liệu AI: {ex.Message}" });
        }
    }
}

