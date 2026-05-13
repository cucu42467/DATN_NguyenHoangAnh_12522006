using System;
using System.Threading.Tasks;
using BLL.Interfaces;
using Models;
using Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using BLL;

namespace API_ND.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThongBaoController : ControllerBase
    // TODO: Kế thừa base controller để lấy UserId
{
    private readonly IThongBaoService _service;
    private readonly ILogger<ThongBaoController> _logger;

    public ThongBaoController(
        IThongBaoService service,
        ILogger<ThongBaoController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // GET: api/ThongBao
    /// <summary>
    /// Lấy danh sách thông báo của người dùng
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetDanhSach(
        [FromQuery] int? loaiThongBao,
        [FromQuery] bool? daDoc,
        [FromQuery] DateTime? tuNgay,
        [FromQuery] DateTime? denNgay,
        [FromQuery] int trang = 1,
        [FromQuery] int tongDong = 20)
    {
        try
        {
            var nguoiDungId = GetNguoiDungId();
            if (nguoiDungId <= 0)
                return Unauthorized();

            var loc = new DTO.ThongBaoLocDto
            {
                LoaiThongBao = loaiThongBao,
                DaDoc = daDoc,
                TuNgay = tuNgay,
                DenNgay = denNgay,
                Trang = trang,
                TongDong = tongDong
            };

            var result = await _service.GetDanhSachAsync(nguoiDungId, loc);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy danh sách thông báo");
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // GET: api/ThongBao/dem
    /// <summary>
    /// Đếm số thông báo chưa đọc
    /// </summary>
    [HttpGet("dem")]
    public async Task<IActionResult> DemThongBao()
    {
        try
        {
            var nguoiDungId = GetNguoiDungId();
            if (nguoiDungId <= 0)
                return Unauthorized();

            var result = await _service.DemThongBaoAsync(nguoiDungId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi đếm thông báo");
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // GET: api/ThongBao/he-thong
    /// <summary>
    /// Lấy thông báo hệ thống (broadcast)
    /// </summary>
    [HttpGet("he-thong")]
    public async Task<IActionResult> GetThongBaoHeThong()
    {
        try
        {
            var result = await _service.GetThongBaoHeThongAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông báo hệ thống");
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // GET: api/ThongBao/{id}
    /// <summary>
    /// Lấy chi tiết một thông báo
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Không tìm thấy thông báo" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi lấy thông báo {Id}", id);
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // PUT: api/ThongBao/{id}/doc
    /// <summary>
    /// Đánh dấu thông báo đã đọc
    /// </summary>
    [HttpPut("{id}/doc")]
    public async Task<IActionResult> MarkDaDoc(int id)
    {
        try
        {
            await _service.MarkDaDocAsync(id);
            return Ok(new { message = "Đã đánh dấu đã đọc" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi đánh dấu đã đọc {Id}", id);
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // PUT: api/ThongBao/doc-tat-ca
    /// <summary>
    /// Đánh dấu tất cả thông báo đã đọc
    /// </summary>
    [HttpPut("doc-tat-ca")]
    public async Task<IActionResult> MarkAllDaDoc()
    {
        try
        {
            var nguoiDungId = GetNguoiDungId();
            if (nguoiDungId <= 0)
                return Unauthorized();

            await _service.MarkAllDaDocAsync(nguoiDungId);
            return Ok(new { message = "Đã đánh dấu tất cả đã đọc" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi đánh dấu tất cả đã đọc");
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // DELETE: api/ThongBao/{id}
    /// <summary>
    /// Xóa thông báo
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.XoaThongBaoAsync(id);
            return Ok(new { message = "Đã xóa thông báo" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi xóa thông báo {Id}", id);
            return StatusCode(500, new { message = "Lỗi server" });
        }
    }

    // Lấy UserId từ Claims (cần implement theo auth của bạn)
    private int GetNguoiDungId()
    {
        var userIdClaim = User.FindFirst("NguoiDungId")?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (int.TryParse(userIdClaim, out var userId))
            return userId;

        return 0;
    }
}
