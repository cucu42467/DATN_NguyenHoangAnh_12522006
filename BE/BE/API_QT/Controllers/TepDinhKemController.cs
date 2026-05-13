using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/tep-dinh-kem")]
[Authorize(Roles = "admin")]
public class TepDinhKemQtController : ControllerBase
{
    private readonly BLL.Interfaces.ITepDinhKemBll _bll;

    public TepDinhKemQtController(BLL.Interfaces.ITepDinhKemBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TepDinhKemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TepDinhKemDto>>>> LayDanhSach(CancellationToken ct = default)
    {
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
}
