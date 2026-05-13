using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/nhac-nho")]
[Authorize(Roles = "admin")]
public class NhacNhoQtController : ControllerBase
{
    private readonly BLL.Interfaces.INhacNhoBll _bll;

    public NhacNhoQtController(BLL.Interfaces.INhacNhoBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NhacNhoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<NhacNhoDto>>>> LayDanhSach(
        [FromQuery] int? nguoiDungId = null,
        [FromQuery] sbyte? trangThai = null,
        CancellationToken ct = default)
    {
        List<NhacNhoDto> data;
        if (nguoiDungId.HasValue)
        {
            data = await _bll.LayDanhSachAsync(nguoiDungId.Value, ct);
        }
        else
        {
            data = await _bll.LayDanhSachTatCaAsync(ct);
        }

        if (trangThai.HasValue)
        {
            data = data.Where(x => x.TrangThai == trangThai.Value).ToList();
        }

        return Ok(ApiResponse<List<NhacNhoDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<NhacNhoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NhacNhoDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAdminAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<NhacNhoDto>.NotFound("Không tìm thấy nhắc nhở"));

        return Ok(ApiResponse<NhacNhoDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAdminAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy nhắc nhở"));

        return Ok(ApiResponse.Ok("Xóa nhắc nhở thành công"));
    }
}
