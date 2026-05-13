using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/nhac-nho")]
[Authorize]
public class NhacNhoController : ControllerBase
{
    private readonly BLL.Interfaces.INhacNhoBll _bll;

    public NhacNhoController(BLL.Interfaces.INhacNhoBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NhacNhoDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<NhacNhoDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayDanhSachAsync(userId.Value, ct);
        return Ok(ApiResponse<List<NhacNhoDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<NhacNhoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NhacNhoDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _bll.LayChiTietAsync(userId.Value, id, ct);
        if (data == null)
            return NotFound(ApiResponse<NhacNhoDto>.NotFound("Không tìm thấy nhắc nhở"));

        return Ok(ApiResponse<NhacNhoDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoNhacNhoDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _bll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo nhắc nhở thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoNhacNhoDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _bll.CapNhatAsync(userId.Value, id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy nhắc nhở"));

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

        var thanhCong = await _bll.XoaAsync(userId.Value, id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy nhắc nhở"));

        return Ok(ApiResponse.Ok("Xóa nhắc nhở thành công"));
    }

    [HttpPut("{id:int}/trang-thai")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhatTrangThai(int id, [FromBody] CapNhatTrangThaiNhacNhoDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _bll.CapNhatTrangThaiAsync(userId.Value, id, dto.TrangThai, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy nhắc nhở"));

        return Ok(ApiResponse.Ok("Cập nhật trạng thái thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
