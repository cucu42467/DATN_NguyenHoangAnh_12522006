using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "admin")]
public class AiModelController : ControllerBase
{
    private readonly IAiModelBll _aiModelBll;
    public AiModelController(IAiModelBll aiModelBll) { _aiModelBll = aiModelBll; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<AiModelDto>>>> Get()
    {
        var data = await _aiModelBll.LayTatCaAsync();
        return Ok(new ApiResponse<List<AiModelDto>> { Success = true, Data = data });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AiModelDto>>> GetById(int id)
    {
        var data = await _aiModelBll.LayTheoIdAsync(id);
        if (data == null) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy model" });
        return Ok(new ApiResponse<AiModelDto> { Success = true, Data = data });
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> Post([FromBody] AiModelDto dto)
    {
        var id = await _aiModelBll.TaoMoiAsync(dto);
        return Ok(new ApiResponse<int> { Success = true, Data = id, Message = "Tạo model thành công" });
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse>> Put(int id, [FromBody] AiModelDto dto)
    {
        var success = await _aiModelBll.CapNhatAsync(id, dto);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy model" });
        return Ok(new ApiResponse { Success = true, Message = "Cập nhật thành công" });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        var success = await _aiModelBll.XoaAsync(id);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy model" });
        return Ok(new ApiResponse { Success = true, Message = "Xóa thành công" });
    }
}
