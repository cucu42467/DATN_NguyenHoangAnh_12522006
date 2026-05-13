using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;


namespace API_QT.Controllers;

[ApiController]
[Route("admin/tai-khoan")]
[Authorize(Roles = "admin")]
public class TaiKhoanController : ControllerBase
{
    private readonly BLL.Interfaces.ITaiKhoanBll _taiKhoanBll;
    private readonly BLL.Interfaces.IGiaoDichBll _giaoDichBll;

    public TaiKhoanController(BLL.Interfaces.ITaiKhoanBll taiKhoanBll, BLL.Interfaces.IGiaoDichBll giaoDichBll)
    {
        _taiKhoanBll = taiKhoanBll;
        _giaoDichBll = giaoDichBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TaiKhoanDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TaiKhoanDto>>>> LayDanhSach(CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ketQua = await _taiKhoanBll.LayDanhSachAsync(userId.Value, ct);
        return Ok(ApiResponse<List<TaiKhoanDto>>.Ok(ketQua, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<TaiKhoanDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaiKhoanDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ketQua = await _taiKhoanBll.LayChiTietAsync(id, userId.Value, ct);
        if (ketQua == null)
            return NotFound(ApiResponse<TaiKhoanDto>.NotFound("Không tìm thấy tài khoản"));

        return Ok(ApiResponse<TaiKhoanDto>.Ok(ketQua, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoTaiKhoanDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var id = await _taiKhoanBll.TaoMoiAsync(dto, userId.Value, ct);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(id, "Tạo tài khoản thành công"));
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] TaoTaiKhoanDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _taiKhoanBll.CapNhatAsync(id, dto, userId.Value, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy tài khoản"));

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

        var thanhCong = await _taiKhoanBll.XoaAsync(id, userId.Value, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy tài khoản"));

        return Ok(ApiResponse.Ok("Xóa tài khoản thành công"));
    }

    [HttpPost("chuyen-tien-noi-bo")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> ChuyenTienNoiBo([FromBody] ChuyenTienNoiBoDto dto, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var tkNguon = await _taiKhoanBll.LayChiTietAsync(dto.TaiKhoanNguonId, userId.Value, ct);
        var tkDich = await _taiKhoanBll.LayChiTietAsync(dto.TaiKhoanDichId, userId.Value, ct);
        if (tkNguon == null || tkDich == null)
            return BadRequest(ApiResponse.Fail("Tài khoản không hợp lệ"));
        if (tkNguon.SoDu < dto.SoTien)
            return BadRequest(ApiResponse.Fail("Số dư không đủ"));

        var giaoDichOut = new TaoGiaoDichDto
        {
            SoTien = dto.SoTien,
            LoaiGiaoDich = "3",
            TaiKhoanNguonId = dto.TaiKhoanNguonId,
            TaiKhoanDichId = dto.TaiKhoanDichId,
            GhiChu = $"Chuyển {dto.SoTien:N0} → {tkDich.TenTaiKhoan}: {dto.GhiChu ?? ""}",
            NgayGiaoDich = DateTime.Now
        };
        var giaoDichOutId = await _giaoDichBll.TaoMoiAsync(giaoDichOut, userId.Value, ct);

        var giaoDichIn = new TaoGiaoDichDto
        {
            SoTien = dto.SoTien,
            LoaiGiaoDich = "1",
            TaiKhoanNguonId = dto.TaiKhoanDichId,
            TaiKhoanDichId = dto.TaiKhoanNguonId,
            GhiChu = $"Nhận chuyển {dto.SoTien:N0} ← {tkNguon.TenTaiKhoan}: {dto.GhiChu ?? ""}",
            NgayGiaoDich = DateTime.Now
        };
        await _giaoDichBll.TaoMoiAsync(giaoDichIn, userId.Value, ct);

        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(giaoDichOutId, "Chuyển tiền thành công"));
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }
}

public class ChuyenTienNoiBoDto
{
    public int TaiKhoanNguonId { get; set; }
    public int TaiKhoanDichId { get; set; }
    public decimal SoTien { get; set; }
    public string? GhiChu { get; set; }
}
