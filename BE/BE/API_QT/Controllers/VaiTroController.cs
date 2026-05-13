using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/vai-tro")]
[Authorize(Roles = "admin")]
public class VaiTroController : ControllerBase
{
    private readonly BLL.Interfaces.IVaiTroBll _bll;

    public VaiTroController(BLL.Interfaces.IVaiTroBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<VaiTroDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<VaiTroDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var data = await _bll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<VaiTroDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<VaiTroDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<VaiTroDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayTheoIdAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<VaiTroDto>.NotFound("Không tìm thấy vai trò"));

        return Ok(ApiResponse<VaiTroDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoVaiTroDto dto, CancellationToken ct = default)
    {
        var id = await _bll.TaoMoiAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo vai trò thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] VaiTroDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _bll.CapNhatAsync(id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy vai trò"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _bll.XoaAsync(id, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không thể xóa vai trò đang được sử dụng"));

        return Ok(ApiResponse.Ok("Xóa vai trò thành công"));
    }
}
