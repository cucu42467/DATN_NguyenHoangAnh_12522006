using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/loai-tai-khoan")]
[Authorize]
public class LoaiTaiKhoanController : ControllerBase
{
    private readonly BLL.Interfaces.ILoaiTaiKhoanBll _bll;

    public LoaiTaiKhoanController(BLL.Interfaces.ILoaiTaiKhoanBll bll)
    {
        _bll = bll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<LoaiTaiKhoanDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LoaiTaiKhoanDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var data = await _bll.LayDanhSachAsync(ct);
        return Ok(ApiResponse<List<LoaiTaiKhoanDto>>.Ok(data, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<LoaiTaiKhoanDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<LoaiTaiKhoanDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var data = await _bll.LayChiTietAsync(id, ct);
        if (data == null)
            return NotFound(ApiResponse<LoaiTaiKhoanDto>.NotFound("Không tìm thấy loại tài khoản"));

        return Ok(ApiResponse<LoaiTaiKhoanDto>.Ok(data, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var id = await _bll.TaoMoiAsync(dto, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo loại tài khoản thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoLoaiTaiKhoanDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _bll.CapNhatAsync(id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy loại tài khoản"));

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
            return BadRequest(ApiResponse.Fail("Không thể xóa loại tài khoản đang được sử dụng"));

        return Ok(ApiResponse.Ok("Xóa loại tài khoản thành công"));
    }
}
