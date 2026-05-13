using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/canh-bao")]
[Authorize(Roles = "admin")]
public class CanhBaoQtController : ControllerBase
{
    private readonly BLL.Interfaces.ICanhBaoBll _bll;

    public CanhBaoQtController(BLL.Interfaces.ICanhBaoBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<CanhBaoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<CanhBaoDto>>>> LayDanhSach(
        [FromQuery] int? nguoiDungId = null,
        [FromQuery] bool? daDoc = null,
        CancellationToken ct = default)
    {
        var data = await _bll.LayDanhSachTatCaAsync(daDoc, ct);

        if (nguoiDungId.HasValue)
        {
            data = data.Where(x => x.NguoiDungId == nguoiDungId.Value).ToList();
        }

        return Ok(ApiResponse<List<CanhBaoDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<CanhBaoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CanhBaoDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAdminAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<CanhBaoDto>.NotFound("Không tìm thấy cảnh báo"));

        return Ok(ApiResponse<CanhBaoDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAdminAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy cảnh báo"));

        return Ok(ApiResponse.Ok("Xóa cảnh báo thành công"));
    }
}
