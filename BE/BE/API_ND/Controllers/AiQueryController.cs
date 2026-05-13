using System.IdentityModel.Tokens.Jwt;
using BLL.Interfaces;
using DAL.Interfaces;
using DTO;
using DTO.AIQuery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BLL.AIQuery;

namespace API_ND.Controllers;

[ApiController]
[Route("api/ai-query")]
[Authorize]
public class AiQueryController : ControllerBase
{
    private readonly AiQueryService _aiQueryService;
    private readonly ILogger<AiQueryController> _logger;

    public AiQueryController(
    AiQueryService aiQueryService,
    ILogger<AiQueryController> logger)
    {
        _aiQueryService = aiQueryService;
        _logger = logger;
    }

    /// <summary>
    /// Execute AI Query - Cho phép user hỏi bằng ngôn ngữ tự nhiên
    /// VD: "3 giao dịch gần nhất", "chi tiêu tháng này", "thông báo chưa đọc"
    /// </summary>
    [HttpPost("query")]
    public async Task<ActionResult<AiQueryResponseDto>> ExecuteQuery(
        [FromBody] AiQueryRequest request,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Câu hỏi không được trống");

        try
        {
            // Convert chat history
            var chatHistory = request.ChatHistory?.Select(m => new GeminiChatMessage
            {
                VaiTro = m.Role,
                NoiDung = m.Content
            }).ToList();

            var result = await _aiQueryService.ExecuteQueryAsync(
                userId,
                request.Question,
                chatHistory,
                ct);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing AI query for user {UserId}", userId);
            return StatusCode(500, new AiQueryResponseDto
            {
                Success = false,
                Message = $"Lỗi hệ thống: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Execute Simple Query - Không cần AI, dùng direct keyword mapping
    /// Tốt cho các câu hỏi đơn giản, nhanh
    /// </summary>
    [HttpPost("simple-query")]
    public async Task<ActionResult<AiQueryResponseDto>> ExecuteSimpleQuery(
        [FromBody] AiQueryRequest request,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Câu hỏi không được trống");

        try
        {
            var result = await _aiQueryService.ExecuteSimpleQueryAsync(
                userId,
                request.Question,
                ct);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing simple query for user {UserId}", userId);
            return StatusCode(500, new AiQueryResponseDto
            {
                Success = false,
                Message = $"Lỗi hệ thống: {ex.Message}"
            });
        }
    }

    /// <summary>
    /// Quick query - predefined queries
    /// </summary>
    [HttpGet("quick/{queryType}")]
    public async Task<ActionResult<AiQueryResponseDto>> QuickQuery(
        string queryType,
        CancellationToken ct = default)
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized("Invalid token");

        var question = queryType.ToLowerInvariant() switch
        {
            "recent-transactions" => "3 giao dịch gần nhất",
            "monthly-expenses" => "chi tiêu tháng này",
            "unread-notifications" => "thông báo chưa đọc",
            "accounts" => "tài khoản của tôi",
            "budgets" => "ngân sách",
            "goals" => "mục tiêu tiết kiệm",
            "alerts" => "cảnh báo",
            "recommendations" => "gợi ý AI",
            "recurring" => "giao dịch định kỳ",
            _ => throw new ArgumentException($"Unknown query type: {queryType}")
        };

        try
        {
            var result = await _aiQueryService.ExecuteSimpleQueryAsync(userId, question, ct);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in quick query {QueryType} for user {UserId}", queryType, userId);
            return StatusCode(500, new AiQueryResponseDto
            {
                Success = false,
                Message = $"Lỗi: {ex.Message}"
            });
        }
    }
}
