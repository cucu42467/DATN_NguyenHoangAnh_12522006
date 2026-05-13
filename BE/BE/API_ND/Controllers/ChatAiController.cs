using BLL.Interfaces;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BLL;
using Common;


namespace API_ND.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ChatAiController : ControllerBase
{
    private readonly IChatAiBll _chatAiBll;
    public ChatAiController(IChatAiBll chatAiBll) { _chatAiBll = chatAiBll; }

    [HttpGet("history")]
    public async Task<ActionResult<ApiResponse<List<ChatAiDto>>>> GetHistory()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var data = await _chatAiBll.LayLichSuAsync(userId);
        return Ok(new ApiResponse<List<ChatAiDto>> { Success = true, Data = data });
    }

    [HttpPost("save")]
    public async Task<ActionResult<ApiResponse<int>>> SaveChat([FromBody] ChatAiDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        dto.NguoiDungId = userId;
        var id = await _chatAiBll.LuuChatAsync(dto);
        return Ok(new ApiResponse<int> { Success = true, Data = id });
    }

    [HttpDelete("clear")]
    public async Task<ActionResult<ApiResponse>> ClearHistory()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _chatAiBll.XoaLichSuAsync(userId);
        return Ok(new ApiResponse { Success = true, Message = "Đã xóa lịch sử trò chuyện" });
    }
}
