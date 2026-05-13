using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/import")]
[Authorize(Roles = "admin")]
public class ImportController : ControllerBase
{
    private readonly BLL.Interfaces.IImportBll _importBll;

    public ImportController(BLL.Interfaces.IImportBll importBll)
    {
        _importBll = importBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ImportFileDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ImportFileDto>>>> LayDanhSach(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] sbyte? trangThai = null,
        CancellationToken ct = default)
    {
        var data = await _importBll.LayDanhSachAdminAsync(page, pageSize, trangThai, ct);
        return Ok(ApiResponse<List<ImportFileDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{importId:int}/chi-tiet")]
    [ProducesResponseType(typeof(ApiResponse<List<ImportChiTietDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ImportChiTietDto>>>> LayChiTiet(
        int importId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var data = await _importBll.LayChiTietAdminAsync(importId, page, pageSize, ct);
        return Ok(ApiResponse<List<ImportChiTietDto>>.Ok(data, "Lấy chi tiết thành công"));
    }
}
