using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/canh-bao")]
[Authorize]
public class CanhBaoController : ControllerBase
{
    private readonly BLL.Interfaces.ICanhBaoBll _bll;

    public CanhBaoController(BLL.Interfaces.ICanhBaoBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<CanhBaoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<CanhBaoDto>>>> LayDanhSach(
        [FromQuery] bool? daDoc = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayDanhSachAsync(userId.Value, daDoc, ct);
        return Ok(ApiResponse<List<CanhBaoDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<CanhBaoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CanhBaoDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayChiTietAsync(userId.Value, id, ct);
        if (data == null)
            return NotFound(ApiResponse<CanhBaoDto>.NotFound("Không tìm thấy cảnh báo"));

        return Ok(ApiResponse<CanhBaoDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] CanhBaoDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _bll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo cảnh báo thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _bll.XoaAsync(userId.Value, id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy cảnh báo"));

        return Ok(ApiResponse.Ok("Xóa cảnh báo thành công"));
    }

    [HttpPut("{id:int}/da-doc")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> DanhDauDaDoc(int id, [FromBody] DanhDauDaDocDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _bll.DanhDauDaDocAsync(userId.Value, id, dto.DaDoc, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy cảnh báo"));

        return Ok(ApiResponse.Ok("Đánh dấu đã đọc thành công"));
    }

    [HttpGet("dem-chua-doc")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<int>>> DemChuaDoc(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var count = await _bll.DemChuaDocAsync(userId.Value, ct);
        return Ok(ApiResponse<int>.Ok(count, ""));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
