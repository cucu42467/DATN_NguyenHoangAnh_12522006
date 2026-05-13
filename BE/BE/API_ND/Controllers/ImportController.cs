using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/import")]
[Authorize]
public class ImportController : ControllerBase
{
    private readonly BLL.Interfaces.IImportBll _importBll;

    public ImportController(BLL.Interfaces.IImportBll importBll)
    {
        _importBll = importBll;
    }

    [HttpPost("tep")]
    [RequestSizeLimit(25_000_000)]
    [ApiExplorerSettings(IgnoreApi = true)]
    [ProducesResponseType(typeof(ApiResponse<TaoImportPhanHoiDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TaoImportPhanHoiDto>>> TaiLen(
        [FromForm] int taiKhoanId,
        [FromForm] IFormFile file,
        [FromForm] string? dinhDang,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var res = await _importBll.TaiLenAsync(userId.Value, taiKhoanId, file, dinhDang, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<TaoImportPhanHoiDto>.Ok(res, "Tải lên thành công"));
    }

    [HttpGet("{importId:int}")]
    [ProducesResponseType(typeof(ApiResponse<ImportFileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ImportFileDto>>> LayImport(int importId, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _importBll.LayImportAsync(userId.Value, importId, ct);
        if (data == null)
            return NotFound(ApiResponse<ImportFileDto>.NotFound("Không tìm thấy import"));

        return Ok(ApiResponse<ImportFileDto>.Ok(data, "Lấy thông tin thành công"));
    }

    [HttpGet("{importId:int}/chi-tiet")]
    [ProducesResponseType(typeof(ApiResponse<List<ImportChiTietDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ImportChiTietDto>>>> LayChiTiet(
        int importId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] sbyte? trangThaiXuLy = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _importBll.LayChiTietAsync(userId.Value, importId, new LocImportChiTietDto
        {
            Page = page,
            PageSize = pageSize,
            TrangThaiXuLy = trangThaiXuLy
        }, ct);

        return Ok(ApiResponse<List<ImportChiTietDto>>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost("{importId:int}/xac-nhan")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> XacNhan(int importId, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _importBll.XacNhanAsync(userId.Value, importId, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy import"));

        return Ok(ApiResponse.Ok("Xác nhận thành công"));
    }

    [HttpPost("{importId:int}/huy")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Huy(int importId, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _importBll.HuyAsync(userId.Value, importId, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy import"));

        return Ok(ApiResponse.Ok("Hủy thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
