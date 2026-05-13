using System.Net;
using BLL;
using DTO;
using Microsoft.AspNetCore.Mvc;
using BLL.Interfaces;

namespace API_ND.Controllers;

[ApiController]
[Route("api/lich-su-dang-nhap")]
public class LichSuDangNhapController : ControllerBase
{
    private readonly ILichsuDangnhapBll _lichSuBll;

    public LichSuDangNhapController(
        ILichsuDangnhapBll lichSuBll)
    {
        _lichSuBll = lichSuBll;
    }

    /// <summary>
    /// Lấy toàn bộ lịch sử đăng nhập
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<LichSuDangNhapDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> LayTatCa(
        CancellationToken huyBo)
    {
        var ds = await _lichSuBll.LayTatCaAsync(huyBo);

        return Ok(ds);
    }

    /// <summary>
    /// Lấy lịch sử đăng nhập theo id
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(LichSuDangNhapDto), (int)HttpStatusCode.OK)]
    [ProducesResponseType((int)HttpStatusCode.NotFound)]
    public async Task<IActionResult> LayTheoId(
        int id,
        CancellationToken huyBo)
    {
        var item = await _lichSuBll.LayTheoIdAsync(
            id,
            huyBo);

        if (item == null)
            return NotFound(new
            {
                thongDiep = "Khong tim thay lich su dang nhap."
            });

        return Ok(item);
    }

    /// <summary>
    /// Lấy lịch sử đăng nhập theo người dùng
    /// </summary>
    [HttpGet("nguoi-dung/{nguoiDungId:int}")]
    [ProducesResponseType(typeof(List<LichSuDangNhapDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> LayTheoNguoiDung(
        int nguoiDungId,
        CancellationToken huyBo)
    {
        var ds = await _lichSuBll.LayTheoNguoiDungAsync(
            nguoiDungId,
            huyBo);

        return Ok(ds);
    }

    /// <summary>
    /// Lấy danh sách lịch sử đăng nhập phân trang
    /// </summary>
    [HttpGet("phan-trang")]
    [ProducesResponseType(typeof(List<LichSuDangNhapDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> LayPhanTrang(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken huyBo = default)
    {
        var ds = await _lichSuBll.LayPhanTrangAsync(
            page,
            pageSize,
            huyBo);

        return Ok(ds);
    }

    /// <summary>
    /// Lấy lịch sử đăng nhập theo người dùng có phân trang
    /// </summary>
    [HttpGet("nguoi-dung/{nguoiDungId:int}/phan-trang")]
    [ProducesResponseType(typeof(List<LichSuDangNhapDto>), (int)HttpStatusCode.OK)]
    public async Task<IActionResult> LayTheoNguoiDungPhanTrang(
        int nguoiDungId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken huyBo = default)
    {
        var ds = await _lichSuBll.LayTheoNguoiDungPhanTrangAsync(
            nguoiDungId,
            page,
            pageSize,
            huyBo);

        return Ok(ds);
    }
}