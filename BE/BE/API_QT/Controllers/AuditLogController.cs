using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/audit-log")]
[Authorize(Roles = "admin")]
public class AuditLogController : ControllerBase
{
    private readonly BLL.Interfaces.IAuditLogBll _auditLogBll;

    public AuditLogController(BLL.Interfaces.IAuditLogBll auditLogBll)
    {
        _auditLogBll = auditLogBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<AdminAuditLogDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<AdminAuditLogDto>>>> LayDanhSach(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? tenBang = null,
        [FromQuery] string? hanhDong = null,
        [FromQuery] DateTime? tuNgay = null,
        [FromQuery] DateTime? denNgay = null,
        CancellationToken ct = default)
    {
        var data = await _auditLogBll.LayDanhSachAsync(page, pageSize, tenBang, hanhDong, tuNgay, denNgay, ct);
        return Ok(ApiResponse<List<AdminAuditLogDto>>.Ok(data, "Lấy danh sách thành công"));
    }
}
