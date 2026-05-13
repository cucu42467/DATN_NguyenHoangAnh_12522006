using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/danh-muc")]
[Authorize(Roles = "admin")]
public class DanhMucController : ControllerBase
{
    private readonly BLL.Interfaces.IDanhMucBll _danhMucBll;

    public DanhMucController(BLL.Interfaces.IDanhMucBll danhMucBll)
    {
        _danhMucBll = danhMucBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<DanhMucDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<DanhMucDto>>>> LayDanhSach(
        [FromQuery] int? loaiDanhMucId = null,
        [FromQuery] bool includeChildren = false,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var data = await _danhMucBll.LayDanhSachAsync(userId, loaiDanhMucId, includeChildren, ct);
        return Ok(ApiResponse<List<DanhMucDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<DanhMucDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<DanhMucDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        var data = await _danhMucBll.LayTheoIdAsync(id, userId, ct);
        if (data == null)
            return NotFound(ApiResponse.Fail("Không tìm thấy danh mục"));

        return Ok(ApiResponse<DanhMucDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoDanhMucDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        var id = await _danhMucBll.TaoMoiAsync(dto, userId, ct);
        return Ok(ApiResponse<int>.Ok(id, "Tạo danh mục thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoDanhMucDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        var thanhCong = await _danhMucBll.CapNhatAsync(id, dto, userId, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy danh mục"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        var thanhCong = await _danhMucBll.XoaAsync(id, userId, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy danh mục"));

        return Ok(ApiResponse.Ok("Xóa danh mục thành công"));
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return 0;
    }
}
