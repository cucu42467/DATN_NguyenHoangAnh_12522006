using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/caidat")]
[Authorize]
public class CaiDatController : ControllerBase
{
    private readonly BLL.Interfaces.ICaiDatBll _bll;

    public CaiDatController(BLL.Interfaces.ICaiDatBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<CaiDatDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<CaiDatDto>>> LayCaiDat(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayTheoNguoiDungAsync(userId.Value, ct);
        if (data == null)
        {
            // Auto create if not exists
            await _bll.TaoMoiAsync(userId.Value, ct);
            data = await _bll.LayTheoNguoiDungAsync(userId.Value, ct);
        }

        return Ok(ApiResponse<CaiDatDto>.Ok(data!, "Lấy cài đặt thành công"));
    }

    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat([FromBody] TaoCaiDatDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _bll.CapNhatAsync(userId.Value, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy cài đặt"));

        return Ok(ApiResponse.Ok("Cập nhật cài đặt thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
