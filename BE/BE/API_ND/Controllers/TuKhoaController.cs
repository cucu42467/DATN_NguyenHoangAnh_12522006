using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/tu-khoa")]
[Authorize]
public class TuKhoaController : ControllerBase
{
    private readonly BLL.Interfaces.ITuKhoaBll _bll;

    public TuKhoaController(BLL.Interfaces.ITuKhoaBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TuKhoaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TuKhoaDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayDanhSachAsync(userId.Value, ct);
        return Ok(ApiResponse<List<TuKhoaDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<TuKhoaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TuKhoaDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<TuKhoaDto>.NotFound("Không tìm thấy từ khóa"));

        return Ok(ApiResponse<TuKhoaDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _bll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo từ khóa thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoTuKhoaDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _bll.CapNhatAsync(id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy từ khóa"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy từ khóa"));

        return Ok(ApiResponse.Ok("Xóa từ khóa thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
