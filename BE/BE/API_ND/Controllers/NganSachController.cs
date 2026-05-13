using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/ngan-sach")]
[Authorize]
public class NganSachController : ControllerBase
{
    private readonly BLL.Interfaces.INganSachBll _nganSachBll;

    public NganSachController(BLL.Interfaces.INganSachBll nganSachBll)
    {
        _nganSachBll = nganSachBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NganSachDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<List<NganSachDto>>>> LayDanhSach(
        [FromQuery] int thang,
        [FromQuery] int nam,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        if (thang is < 1 or > 12)
            return BadRequest(ApiResponse.Fail("Tháng không hợp lệ"));
        if (nam < 2000)
            return BadRequest(ApiResponse.Fail("Năm không hợp lệ"));

        var data = await _nganSachBll.LayDanhSachAsync(userId.Value, thang, nam, ct);
        return Ok(ApiResponse<List<NganSachDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _nganSachBll.TaoMoiAsync(userId.Value, dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo ngân sách thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] ThietLapNganSachDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ok = await _nganSachBll.CapNhatAsync(userId.Value, id, dto, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy ngân sách"));

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

        var ok = await _nganSachBll.XoaAsync(userId.Value, id, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy ngân sách"));

        return Ok(ApiResponse.Ok("Xóa ngân sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<NganSachDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NganSachDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _nganSachBll.LayChiTietAsync(userId.Value, id, ct);
        if (data == null)
            return NotFound(ApiResponse<NganSachDto>.NotFound("Không tìm thấy ngân sách"));

        return Ok(ApiResponse<NganSachDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpGet("{id:int}/giao-dich")]
    [ProducesResponseType(typeof(ApiResponse<List<GiaoDichDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<GiaoDichDto>>>> LayGiaoDichTheoNganSach(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var data = await _nganSachBll.LayGiaoDichTheoNganSachAsync(userId.Value, id, ct);
        return Ok(ApiResponse<List<GiaoDichDto>>.Ok(data, "Lấy danh sách giao dịch thành công"));
    }

    [HttpPut("{id:int}/han-muc")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhatHanMuc(int id, [FromBody] CapNhatHanMucDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        if (dto.HanMuc < 0)
            return BadRequest(ApiResponse.Fail("Hạn mức không hợp lệ"));

        var ok = await _nganSachBll.CapNhatHanMucAsync(userId.Value, id, dto.HanMuc, ct);
        if (!ok)
            return NotFound(ApiResponse.Fail("Không tìm thấy ngân sách"));

        return Ok(ApiResponse.Ok("Cập nhật hạn mức thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}
