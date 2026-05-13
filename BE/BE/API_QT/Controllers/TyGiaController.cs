using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/ty-gia")]
[Authorize(Roles = "admin")]
public class TyGiaController : ControllerBase
{
    private readonly BLL.Interfaces.ITyGiaBll _tyGiaBll;

    public TyGiaController(BLL.Interfaces.ITyGiaBll tyGiaBll)
    {
        _tyGiaBll = tyGiaBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TyGiaDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TyGiaDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var data = await _tyGiaBll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<TyGiaDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<TyGiaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TyGiaDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _tyGiaBll.LayTheoIdAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<TyGiaDto>.NotFound("Không tìm thấy tỷ giá"));

        return Ok(ApiResponse<TyGiaDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoTyGiaDto dto, CancellationToken ct = default)
    {
        var id = await _tyGiaBll.TaoMoiAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo tỷ giá thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TyGiaDto dto, CancellationToken ct = default)
    {
        var result = await _tyGiaBll.CapNhatAsync(id, dto, ct);
        if (!result)
            return NotFound(ApiResponse.Fail("Không tìm thấy tỷ giá"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var result = await _tyGiaBll.XoaAsync(id, ct);
        if (!result)
            return NotFound(ApiResponse.Fail("Không tìm thấy tỷ giá"));

        return Ok(ApiResponse.Ok("Xóa tỷ giá thành công"));
    }
}
