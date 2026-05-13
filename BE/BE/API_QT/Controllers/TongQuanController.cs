using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/tong-quan")]
[Authorize(Roles = "admin")]
public class TongQuanController : ControllerBase
{
    private readonly BLL.Interfaces.IBaoCaoBll _baoCaoBll;

    public TongQuanController(BLL.Interfaces.IBaoCaoBll baoCaoBll)
    {
        _baoCaoBll = baoCaoBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<AdminTongQuanDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<AdminTongQuanDto>>> LayTongQuan(CancellationToken ct = default)
    {
        var dto = await _baoCaoBll.LayTongQuanAdminAsync(ct);
        return Ok(ApiResponse<AdminTongQuanDto>.Ok(dto, "Lấy tổng quan thành công"));
    }

    [HttpGet("tang-truong-user")]
    [ProducesResponseType(typeof(ApiResponse<TangTruongUserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<TangTruongUserDto>>> LayTangTruongUser(
        [FromQuery] int? nam = null,
        [FromQuery] string? duration = null,
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        CancellationToken ct = default)
    {
        var dto = await _baoCaoBll.LayTangTruongUserAsync(nam, duration, tuNgay, denNgay, ct);
        return Ok(ApiResponse<TangTruongUserDto>.Ok(dto, "Lấy tăng trưởng user thành công"));
    }
}
