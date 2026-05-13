using Common;
using DTO;
using BLL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.Interfaces;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/lich-su-dang-nhap")]
[Authorize(Roles = "admin")]
public class LichSuDangNhapController : ControllerBase
{
    private readonly ILichsuDangnhapBll _bll;

    public LichSuDangNhapController(
        ILichsuDangnhapBll bll)
    {
        _bll = bll;
    }

    /// <summary>
    /// Lấy toàn bộ lịch sử đăng nhập
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<LichSuDangNhapDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LichSuDangNhapDto>>>> LayDanhSach(
        CancellationToken ct = default)
    {
        var data = await _bll.LayTatCaAsync(ct);

        return Ok(
            ApiResponse<List<LichSuDangNhapDto>>.Ok(
                data,
                "Lấy danh sách lịch sử đăng nhập thành công"));
    }

    /// <summary>
    /// Lấy chi tiết lịch sử đăng nhập
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<LichSuDangNhapDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<LichSuDangNhapDto>>> LayChiTiet(
        int id,
        CancellationToken ct = default)
    {
        var data = await _bll.LayTheoIdAsync(id, ct);

        if (data == null)
        {
            return NotFound(
                ApiResponse<LichSuDangNhapDto>.NotFound(
                    "Không tìm thấy lịch sử đăng nhập"));
        }

        return Ok(
            ApiResponse<LichSuDangNhapDto>.Ok(
                data,
                "Lấy chi tiết thành công"));
    }

    /// <summary>
    /// Lấy lịch sử đăng nhập theo người dùng
    /// </summary>
    [HttpGet("nguoi-dung/{nguoiDungId:int}")]
    [ProducesResponseType(typeof(ApiResponse<List<LichSuDangNhapDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LichSuDangNhapDto>>>> LayTheoNguoiDung(
        int nguoiDungId,
        CancellationToken ct = default)
    {
        var data = await _bll.LayTheoNguoiDungAsync(
            nguoiDungId,
            ct);

        return Ok(
            ApiResponse<List<LichSuDangNhapDto>>.Ok(
                data,
                "Lấy lịch sử đăng nhập theo người dùng thành công"));
    }

    /// <summary>
    /// Lấy danh sách lịch sử đăng nhập phân trang
    /// </summary>
    [HttpGet("phan-trang")]
    [ProducesResponseType(typeof(ApiResponse<List<LichSuDangNhapDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LichSuDangNhapDto>>>> LayPhanTrang(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var data = await _bll.LayPhanTrangAsync(
            page,
            pageSize,
            ct);

        return Ok(
            ApiResponse<List<LichSuDangNhapDto>>.Ok(
                data,
                "Lấy danh sách phân trang thành công"));
    }

    /// <summary>
    /// Lấy lịch sử đăng nhập theo người dùng có phân trang
    /// </summary>
    [HttpGet("nguoi-dung/{nguoiDungId:int}/phan-trang")]
    [ProducesResponseType(typeof(ApiResponse<List<LichSuDangNhapDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<LichSuDangNhapDto>>>> LayTheoNguoiDungPhanTrang(
        int nguoiDungId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var data = await _bll.LayTheoNguoiDungPhanTrangAsync(
            nguoiDungId,
            page,
            pageSize,
            ct);

        return Ok(
            ApiResponse<List<LichSuDangNhapDto>>.Ok(
                data,
                "Lấy lịch sử đăng nhập phân trang thành công"));
    }
}