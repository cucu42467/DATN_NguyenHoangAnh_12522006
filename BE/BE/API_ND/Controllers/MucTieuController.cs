using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/muc-tieu")]
[Authorize]
public class MucTieuController : ControllerBase
{
    private readonly BLL.Interfaces.IMucTieuBll _mucTieuBll;

    public MucTieuController(BLL.Interfaces.IMucTieuBll mucTieuBll)
    {
        _mucTieuBll = mucTieuBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<MucTieuDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<MucTieuDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _mucTieuBll.LayDanhSachAsync(userId.Value, ct);
        return Ok(ApiResponse<List<MucTieuDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<MucTieuDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<MucTieuDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _mucTieuBll.LayChiTietAsync(userId.Value, id, ct);
        if (data == null)
            return NotFound(ApiResponse<MucTieuDto>.NotFound("Không tìm thấy mục tiêu"));

        return Ok(ApiResponse<MucTieuDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _mucTieuBll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo mục tiêu thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoMucTieuDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _mucTieuBll.CapNhatAsync(userId.Value, id, dto, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy mục tiêu"));

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

        var ok = await _mucTieuBll.XoaAsync(userId.Value, id, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy mục tiêu"));

        return Ok(ApiResponse.Ok("Ẩn mục tiêu thành công"));
    }

    [HttpDelete("{id:int}/xoa-vinh-vien")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> XoaVinhVien(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        try
        {
            var ok = await _mucTieuBll.XoaVinhVienAsync(userId.Value, id, ct);
            if (!ok)
                return NotFound(ApiResponse.Fail("Không tìm thấy mục tiêu"));

            return Ok(ApiResponse.Ok("Xóa mục tiêu và hoàn tiền thành công"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
    }

    [HttpGet("{id:int}/dong-gop")]
    [ProducesResponseType(typeof(ApiResponse<List<DongGopMucTieuDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<DongGopMucTieuDto>>>> LayDanhSachDongGop(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _mucTieuBll.LayDanhSachDongGopAsync(userId.Value, id, ct);
        return Ok(ApiResponse<List<DongGopMucTieuDto>>.Ok(data, "Lấy danh sách đóng góp thành công"));
    }

    [HttpPost("{id:int}/dong-gop")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> TaoDongGop(int id, [FromBody] TaoDongGopMucTieuDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var dongGopId = await _mucTieuBll.TaoDongGopAsync(userId.Value, id, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(dongGopId, "Tạo đóng góp thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
