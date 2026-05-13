using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "admin")] // Chỉ admin mới được quản lý quyền
public class QuyenController : ControllerBase
{
    private readonly IQuyenBll _quyenBll;
    public QuyenController(IQuyenBll quyenBll) { _quyenBll = quyenBll; }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<QuyenDto>>>> Get()
    {
        var data = await _quyenBll.LayTatCaAsync();
        return Ok(new ApiResponse<List<QuyenDto>> { Success = true, Data = data });
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<int>>> Post([FromBody] QuyenDto dto)
    {
        var id = await _quyenBll.TaoMoiAsync(dto);
        return Ok(new ApiResponse<int> { Success = true, Data = id, Message = "Tạo quyền thành công" });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        var success = await _quyenBll.XoaAsync(id);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy quyền" });
        return Ok(new ApiResponse { Success = true, Message = "Xóa quyền thành công" });
    }
}
