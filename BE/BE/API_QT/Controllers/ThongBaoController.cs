using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/thong-bao")]
[Authorize(Roles = "admin")]
public class ThongBaoQtController : ControllerBase
{
    private readonly BLL.Interfaces.IThongBaoBll _bll;

    public ThongBaoQtController(BLL.Interfaces.IThongBaoBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ThongBaoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ThongBaoDto>>>> LayDanhSach(
        [FromQuery] int? nguoiDungId = null,
        [FromQuery] bool? daDoc = null,
        CancellationToken ct = default)
    {
        List<ThongBaoDto> data;
        if (nguoiDungId.HasValue)
        {
            data = await _bll.LayDanhSachAsync(nguoiDungId.Value, ct);
        }
        else
        {
            data = await _bll.LayDanhSachTatCaAsync(ct);
        }

        if (daDoc.HasValue)
        {
            data = data.Where(x => x.DaDoc == daDoc.Value).ToList();
        }

        return Ok(ApiResponse<List<ThongBaoDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ThongBaoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ThongBaoDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<ThongBaoDto>.NotFound("Không tìm thấy thông báo"));

        return Ok(ApiResponse<ThongBaoDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy thông báo"));

        return Ok(ApiResponse.Ok("Xóa thông báo thành công"));
    }
}
