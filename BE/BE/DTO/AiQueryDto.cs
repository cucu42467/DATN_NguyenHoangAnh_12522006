namespace DTO.AIQuery;

// Request cho AI Query
public class AiQueryRequest
{
    /// <summary>
    /// Câu hỏi của user (VD: "3 giao dịch gần nhất", "chi tiêu tháng này")
    /// </summary>
    public string Question { get; set; } = string.Empty;

    /// <summary>
    /// Lịch sử chat (optional)
    /// </summary>
    public List<ChatMessageDto>? ChatHistory { get; set; }
}

public class ChatMessageDto
{
    public string Role { get; set; } = "user";
    public string Content { get; set; } = string.Empty;
}

// Response từ AI Query
public class AiQueryResponseDto
{
    /// <summary>
    /// Trạng thái thành công
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// Tên các cột trong kết quả
    /// </summary>
    public List<string> Columns { get; set; } = new();

    /// <summary>
    /// Các bản ghi kết quả
    /// </summary>
    public List<Dictionary<string, object?>> Rows { get; set; } = new();

    /// <summary>
    /// Tóm tắt kết quả
    /// </summary>
    public string? Summary { get; set; }

    /// <summary>
    /// Tên bảng đã truy vấn
    /// </summary>
    public string? TableName { get; set; }

    /// <summary>
    /// Tên hiển thị của bảng
    /// </summary>
    public string? TableDisplayName { get; set; }

    /// <summary>
    /// Thời gian thực thi (ms)
    /// </summary>
    public long ExecutionTimeMs { get; set; }

    /// <summary>
    /// Thông điệp
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// Loại hiển thị đề xuất (TABLE, CHART, SUMMARY)
    /// </summary>
    public string SuggestedDisplayType { get; set; } = "TABLE";
}

// Kết quả query từ DAL
public class AiQueryResult
{
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object?>> Rows { get; set; } = new();
}
