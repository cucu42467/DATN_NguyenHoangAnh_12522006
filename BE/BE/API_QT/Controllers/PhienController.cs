using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/phien")]
[Authorize(Roles = "admin")]
public class PhienController : ControllerBase
{
    private readonly BLL.Interfaces.IPhienBll _phienBll;

    public PhienController(BLL.Interfaces.IPhienBll phienBll)
    {
        _phienBll = phienBll;
    }

    [HttpGet("danh-sach")]
    public async Task<ActionResult<ApiResponse<List<SessionDto>>>> LayDanhSach(
    [FromQuery] int? userId = null,
    CancellationToken ct = default)
    {
        var data = await _phienBll.LayDanhSachAsync(userId, ct);

        return Ok(ApiResponse<List<SessionDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpDelete("{tokenId:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Revoke(int tokenId, CancellationToken ct = default)
    {
        var thanhCong = await _phienBll.XoaAsync(tokenId, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy phiên"));

        return Ok(ApiResponse.Ok("Hủy phiên thành công"));
    }
}
