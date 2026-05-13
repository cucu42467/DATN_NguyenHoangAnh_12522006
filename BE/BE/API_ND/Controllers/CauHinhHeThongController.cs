using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "admin")]
public class CauHinhHeThongController : ControllerBase
{
    private readonly ICauHinhBll _cauHinhBll;

    public CauHinhHeThongController(ICauHinhBll cauHinhBll)
    {
        _cauHinhBll = cauHinhBll;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CauHinhHeThongDto>>>> Get()
    {
        var data = await _cauHinhBll.LayDanhSachAsync();
        return Ok(new ApiResponse<List<CauHinhHeThongDto>> { Success = true, Data = data });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CauHinhHeThongDto>>> GetById(int id)
    {
        var data = await _cauHinhBll.LayTheoIdAsync(id);
        if (data == null) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy cấu hình" });
        return Ok(new ApiResponse<CauHinhHeThongDto> { Success = true, Data = data });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse>> Put(int id, [FromBody] CauHinhHeThongDto dto)
    {
        var success = await _cauHinhBll.CapNhatAsync(id, dto);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy cấu hình" });
        return Ok(new ApiResponse { Success = true, Message = "Cập nhật cấu hình thành công" });
    }
}
