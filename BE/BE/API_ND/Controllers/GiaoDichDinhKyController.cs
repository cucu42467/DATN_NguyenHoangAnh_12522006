using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/giao-dich-dinh-ky")]
[Authorize]
public class GiaoDichDinhKyController : ControllerBase
{
    private readonly BLL.Interfaces.IGiaoDichDinhKyBll _bll;

    public GiaoDichDinhKyController(BLL.Interfaces.IGiaoDichDinhKyBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<GiaoDichDinhKyDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<GiaoDichDinhKyDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayDanhSachAsync(userId.Value, ct);
        return Ok(ApiResponse<List<GiaoDichDinhKyDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _bll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo giao dịch định kỳ thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoGiaoDichDinhKyDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _bll.CapNhatAsync(userId.Value, id, dto, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy giao dịch định kỳ"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _bll.XoaAsync(userId.Value, id, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy giao dịch định kỳ"));

        return Ok(ApiResponse.Ok("Xóa giao dịch định kỳ thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
