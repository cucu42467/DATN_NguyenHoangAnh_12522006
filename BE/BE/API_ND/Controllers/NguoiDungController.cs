using System.IdentityModel.Tokens.Jwt;
using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[ApiController]
[Route("api/nguoidung")]
[Authorize]
public class NguoiDungController : ControllerBase
{
    private readonly BLL.Interfaces.INguoiDungBll _nguoiDungBll;

    public NguoiDungController(BLL.Interfaces.INguoiDungBll nguoiDungBll)
    {
        _nguoiDungBll = nguoiDungBll;
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<NguoiDungMeDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NguoiDungMeDto>>> LayMe(CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _nguoiDungBll.LayMeAsync(userId, ct);
        if (data == null)
            return NotFound(ApiResponse<NguoiDungMeDto>.NotFound("Không tìm thấy người dùng"));

        return Ok(ApiResponse<NguoiDungMeDto>.Ok(data, "Lấy thông tin thành công"));
    }

    [HttpPut("me")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhatMe(
        [FromBody] CapNhatNguoiDungMeDto dto,
        CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ", ModelState));

        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _nguoiDungBll.CapNhatMeAsync(userId, dto, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpPost("doi-mat-khau")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse>> DoiMatKhau(
        [FromBody] DoiMatKhauDto dto,
        CancellationToken ct = default)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ", ModelState));

        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var result = await _nguoiDungBll.DoiMatKhauAsync(userId, dto, ct);
        if (!result)
            return BadRequest(ApiResponse.Fail("Mật khẩu cũ không đúng hoặc có lỗi xảy ra"));

        return Ok(ApiResponse.Ok("Đổi mật khẩu thành công"));
    }
}

