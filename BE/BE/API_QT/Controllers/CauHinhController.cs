using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/cau-hinh")]
[Authorize(Roles = "admin")]
public class CauHinhController : ControllerBase
{
    private readonly BLL.Interfaces.ICauHinhBll _cauHinhBll;

    public CauHinhController(BLL.Interfaces.ICauHinhBll cauHinhBll)
    {
        _cauHinhBll = cauHinhBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<CauHinhHeThongDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<CauHinhHeThongDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var data = await _cauHinhBll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<CauHinhHeThongDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<CauHinhHeThongDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CauHinhHeThongDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _cauHinhBll.LayTheoIdAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<CauHinhHeThongDto>.NotFound("Không tìm thấy cấu hình"));

        return Ok(ApiResponse<CauHinhHeThongDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] CauHinhHeThongDto dto, CancellationToken ct = default)
    {
        var ok = await _cauHinhBll.CapNhatAsync(id, dto, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy cấu hình"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }
}
