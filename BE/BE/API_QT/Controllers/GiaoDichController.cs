using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/giao-dich")]
[Authorize(Roles = "admin")]
public class GiaoDichController : ControllerBase
{
    private readonly BLL.Interfaces.IGiaoDichBll _giaoDichBll;

    public GiaoDichController(BLL.Interfaces.IGiaoDichBll giaoDichBll)
    {
        _giaoDichBll = giaoDichBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<AdminGiaoDichDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PagedResponse<AdminGiaoDichDto>>>> LayDanhSach(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] int? userId = null,
        [FromQuery] sbyte? loai = null,
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        [FromQuery] string? q = null,
        CancellationToken ct = default)
    {
        var data = await _giaoDichBll.LayDanhSachAdminAsync(page, pageSize, userId, loai, tuNgay, denNgay, q, ct);
        return Ok(ApiResponse<PagedResponse<AdminGiaoDichDto>>.Ok(data, "Lấy danh sách thành công"));
    }
}
