using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "admin")]
public class AuditLogController : ControllerBase
{
    private readonly IAuditLogBll _auditLogBll;

    public AuditLogController(IAuditLogBll auditLogBll)
    {
        _auditLogBll = auditLogBll;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<AdminAuditLogDto>>>> Get(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? table = null,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var data = await _auditLogBll.LayDanhSachAsync(page, pageSize, table, action, from, to);
        return Ok(new ApiResponse<List<AdminAuditLogDto>> { Success = true, Data = data });
    }
}
