using BLL.Interfaces;
using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PhanHoiController : ControllerBase
{
    private readonly IPhanHoiBll _phanHoiBll;
    private readonly IPhanHoiTraLoiBll _phanHoiTraLoiBll;

    public PhanHoiController(IPhanHoiBll phanHoiBll, IPhanHoiTraLoiBll phanHoiTraLoiBll)
    {
        _phanHoiBll = phanHoiBll;
        _phanHoiTraLoiBll = phanHoiTraLoiBll;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PhanHoiDto>>>> Get([FromQuery] int? nguoiDungId = null)
    {
        var data = await _phanHoiBll.LayTatCaAsync(nguoiDungId);
        return Ok(new ApiResponse<List<PhanHoiDto>> { Success = true, Data = data });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PhanHoiDto>>> GetById(int id)
    {
        var data = await _phanHoiBll.LayTheoIdAsync(id);
        if (data == null) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy phản hồi" });
        return Ok(new ApiResponse<PhanHoiDto> { Success = true, Data = data });
    }

    [HttpGet("{phanHoiId}/tra-loi")]
    public async Task<ActionResult<ApiResponse<List<PhanHoiTraloiDto>>>> GetTraLoi(int phanHoiId)
    {
        var data = await _phanHoiTraLoiBll.LayDanhSachTheoPhanHoiIdAsync(phanHoiId);
        return Ok(new ApiResponse<List<PhanHoiTraloiDto>> { Success = true, Data = data });
    }

    [HttpPost("{phanHoiId}/tra-loi")]
    public async Task<ActionResult<ApiResponse<int>>> TraLoi(int phanHoiId, [FromBody] TraLoiDto dto)
    {
        try
        {
            var id = await _phanHoiTraLoiBll.TaoTraLoiAsync(phanHoiId, dto.NguoiGuiId, dto.NoiDung);
            return Ok(new ApiResponse<int> { Success = true, Data = id, Message = "Gửi trả lời thành công" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
        }
    }

    [HttpPut("{phanHoiId}/trang-thai")]
    public async Task<ActionResult<ApiResponse>> CapNhatTrangThai(int phanHoiId, [FromBody] CapNhatTrangThaiDto dto)
    {
        var success = await _phanHoiBll.CapNhatTrangThaiAsync(phanHoiId, dto.TrangThai);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy phản hồi" });
        return Ok(new ApiResponse { Success = true, Message = "Cập nhật trạng thái thành công" });
    }
}

public class TraLoiDto
{
    public int NguoiGuiId { get; set; }
    public string NoiDung { get; set; } = null!;
}

public class CapNhatTrangThaiDto
{
    public sbyte TrangThai { get; set; }
}
