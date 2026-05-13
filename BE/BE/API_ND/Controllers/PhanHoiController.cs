using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PhanHoiController : ControllerBase
{
    private readonly IPhanHoiBll _phanHoiBll;

    public PhanHoiController(IPhanHoiBll phanHoiBll)
    {
        _phanHoiBll = phanHoiBll;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<PhanHoiDto>>>> Get([FromQuery] int? nguoiDungId)
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

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> Post([FromBody] PhanHoiDto dto)
    {
        var id = await _phanHoiBll.TaoMoiAsync(dto);
        return Ok(new ApiResponse<int> { Success = true, Data = id, Message = "Gửi phản hồi thành công" });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse>> Put(int id, [FromBody] PhanHoiDto dto)
    {
        var success = await _phanHoiBll.CapNhatAsync(id, dto);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy phản hồi để cập nhật" });
        return Ok(new ApiResponse { Success = true, Message = "Cập nhật phản hồi thành công" });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        var success = await _phanHoiBll.XoaAsync(id);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy phản hồi để xóa" });
        return Ok(new ApiResponse { Success = true, Message = "Xóa phản hồi thành công" });
    }
}
