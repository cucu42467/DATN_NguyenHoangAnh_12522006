using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/ai")]
[Authorize(Roles = "admin")]
public class AiController : ControllerBase
{
    private readonly BLL.Interfaces.IAiBll _aiBll;

    public AiController(BLL.Interfaces.IAiBll aiBll)
    {
        _aiBll = aiBll;
    }

    [HttpGet("goi-y")]
    [ProducesResponseType(typeof(ApiResponse<List<LoiKhuyenAIDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LoiKhuyenAIDto>>>> LayDanhSachGoiY(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? loai = null,
        CancellationToken ct = default)
    {
        var data = await _aiBll.LayDanhSachGoiYAdminAsync(page, pageSize, trangThai, loai, ct);
        return Ok(ApiResponse<List<LoiKhuyenAIDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpPut("goi-y/{id:int}/duyet")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> DuyetGoiY(int id, CancellationToken ct = default)
    {
        var thanhCong = await _aiBll.DuyetGoiYAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy gợi ý"));

        return Ok(ApiResponse.Ok("Duyệt thành công"));
    }

    [HttpPut("goi-y/{id:int}/tu-choi")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> TuChoiGoiY(int id, CancellationToken ct = default)
    {
        var thanhCong = await _aiBll.TuChoiGoiYAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy gợi ý"));

        return Ok(ApiResponse.Ok("Từ chối thành công"));
    }

    [HttpDelete("goi-y/{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> XoaGoiY(int id, CancellationToken ct = default)
    {
        var thanhCong = await _aiBll.XoaGoiYAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy gợi ý"));

        return Ok(ApiResponse.Ok("Xóa thành công"));
    }

    [HttpPost("goi-y")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoGoiY([FromBody] LoiKhuyenAIDto dto, CancellationToken ct = default)
    {
        var id = await _aiBll.TaoGoiYAdminAsync(dto, ct);
        return Ok(ApiResponse<int>.Ok(id, "Tạo gợi ý thành công"));
    }

    [HttpGet("thong-ke")]
    [ProducesResponseType(typeof(ApiResponse<ThongKeAIDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ThongKeAIDto>>> LayThongKe(CancellationToken ct = default)
    {
        var data = await _aiBll.LayThongKeAIAsync(ct);
        return Ok(ApiResponse<ThongKeAIDto>.Ok(data, "Lấy thống kê thành công"));
    }
}
