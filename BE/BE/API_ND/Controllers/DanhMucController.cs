using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/danh-muc")]
[Authorize]
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
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var danhMucs = await _danhMucBll.LayDanhSachAsync(userId.Value, loaiDanhMucId, includeChildren, ct);
        return Ok(ApiResponse<List<DanhMucDto>>.Ok(danhMucs, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<DanhMucDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<DanhMucDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var danhMuc = await _danhMucBll.LayTheoIdAsync(id, userId.Value, ct);
        if (danhMuc == null)
            return NotFound(ApiResponse<DanhMucDto>.NotFound("Không tìm thấy danh mục"));

        return Ok(ApiResponse<DanhMucDto>.Ok(danhMuc, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi(
        [FromBody] TaoDanhMucDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        try
        {
            var id = await _danhMucBll.TaoMoiAsync(dto, userId.Value, ct);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<int>.Ok(id, "Tạo danh mục thành công. Danh mục đang chờ được xét duyệt."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(
        int id,
        [FromBody] TaoDanhMucDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _danhMucBll.CapNhatAsync(id, dto, userId.Value, ct);
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
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _danhMucBll.XoaAsync(id, userId.Value, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy danh mục"));

        return Ok(ApiResponse.Ok("Xóa danh mục thành công"));
    }

    [HttpPut("{id:int}/thu-tu")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse>> CapNhatThuTu(
        int id,
        [FromBody] CapNhatThuTuDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _danhMucBll.CapNhatThuTuAsync(id, dto.ThuTu, userId.Value, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không thể cập nhật thứ tự. Chỉ có thể sắp xếp danh mục cá nhân."));

        return Ok(ApiResponse.Ok("Cập nhật thứ tự thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
