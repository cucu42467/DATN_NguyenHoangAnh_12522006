using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SessionController : ControllerBase
{
    private readonly IPhienBll _phienBll;

    public SessionController(IPhienBll phienBll)
    {
        _phienBll = phienBll;
    }

    [HttpGet("my-sessions")]
    public async Task<ActionResult<ApiResponse<List<PhienDangnhapDto>>>> GetMySessions()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        // Giả sử có hàm lấy danh sách phiên của user
        // Vì hiện tại IPhienBll chưa có hàm này, tôi sẽ tập trung vào CRUD cơ bản theo yêu cầu
        return Ok(new ApiResponse { Success = true, Message = "Lấy danh sách phiên thành công (Mock)" });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> RevokeSession(int id)
    {
        var success = await _phienBll.ThuHoiAsync(id);
        if (!success) return NotFound(new ApiResponse { Success = false, Message = "Không tìm thấy phiên" });
        return Ok(new ApiResponse { Success = true, Message = "Đã thu hồi phiên đăng nhập" });
    }

    [HttpDelete("revoke-all")]
    public async Task<ActionResult<ApiResponse>> RevokeAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _phienBll.ThuHoiTatCaAsync(userId);
        return Ok(new ApiResponse { Success = true, Message = "Đã đăng xuất khỏi tất cả thiết bị" });
    }
}
