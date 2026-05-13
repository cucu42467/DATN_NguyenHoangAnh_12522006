using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/tong-quan")]
[Authorize]
public class TongQuanController : ControllerBase
{
    private readonly BLL.Interfaces.ITongQuanBll _tongQuanBll;

    public TongQuanController(BLL.Interfaces.ITongQuanBll tongQuanBll)
    {
        _tongQuanBll = tongQuanBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<TongQuanDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TongQuanDto>>> LayTongQuan(
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var result = await _tongQuanBll.LayTongQuanAsync(userId.Value, tuNgay, denNgay, ct);
        return Ok(ApiResponse<TongQuanDto>.Ok(result, "Lấy tổng quan thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
