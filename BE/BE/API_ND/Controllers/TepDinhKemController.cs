using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/tep-dinh-kem")]
[Authorize]
public class TepDinhKemController : ControllerBase
{
    private readonly BLL.Interfaces.ITepDinhKemBll _bll;

    public TepDinhKemController(BLL.Interfaces.ITepDinhKemBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TepDinhKemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TepDinhKemDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<TepDinhKemDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<TepDinhKemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TepDinhKemDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<TepDinhKemDto>.NotFound("Không tìm thấy tệp"));

        return Ok(ApiResponse<TepDinhKemDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoTepDinhKemDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _bll.TaoMoiAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo tệp đính kèm thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy tệp"));

        return Ok(ApiResponse.Ok("Xóa tệp thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
