using Common;
using DTO;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

[ApiController]
[Route("api/loai-danh-muc")]
public class LoaiDanhMucController : ControllerBase
{
    private readonly BLL.Interfaces.ILoaiDanhMucBll _loaiDanhMucBll;

    public LoaiDanhMucController(BLL.Interfaces.ILoaiDanhMucBll loaiDanhMucBll)
    {
        _loaiDanhMucBll = loaiDanhMucBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<LoaiDanhMucDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LoaiDanhMucDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var data = await _loaiDanhMucBll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<LoaiDanhMucDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<LoaiDanhMucDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<LoaiDanhMucDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _loaiDanhMucBll.LayTheoIdAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<LoaiDanhMucDto>.NotFound("Không tìm thấy loại danh mục"));

        return Ok(ApiResponse<LoaiDanhMucDto>.Ok(data, "Lấy thông tin thành công"));
    }

    [HttpGet("theo-danh-muc/{danhMucId:int}")]
    [ProducesResponseType(typeof(ApiResponse<LoaiDanhMucDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<LoaiDanhMucDto>>> LayTheoDanhMucId(int danhMucId, CancellationToken ct = default)
    {
        var data = await _loaiDanhMucBll.LayTheoDanhMucIdAsync(danhMucId, ct);
        if (data == null)
            return NotFound(ApiResponse<LoaiDanhMucDto>.NotFound("Không tìm thấy loại danh mục cho danh mục này"));

        return Ok(ApiResponse<LoaiDanhMucDto>.Ok(data, "Lấy thông tin thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        var id = await _loaiDanhMucBll.TaoMoiAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo loại danh mục thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoLoaiDanhMucDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _loaiDanhMucBll.CapNhatAsync(id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy loại danh mục"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var thanhCong = await _loaiDanhMucBll.XoaAsync(id, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không thể xóa loại danh mục đang được sử dụng"));

        return Ok(ApiResponse.Ok("Xóa loại danh mục thành công"));
    }
}
