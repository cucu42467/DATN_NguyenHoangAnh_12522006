using BLL.Interfaces;
using DAL.Interfaces;
using DTO;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace BLL.AIQuery;

/// <summary>
/// Service chính xử lý AI Query Database
/// Flow: Keyword Mapping -> AI Prompt -> Validate -> SQL Build -> Execute -> Response
/// </summary>
public class AiQueryService
{
    private readonly SchemaProvider _schemaProvider;
    private readonly KeywordMappingService _keywordMapper;
    private readonly AiPromptBuilder _promptBuilder;
    private readonly QueryValidationService _queryValidator;
    private readonly SqlBuilder _sqlBuilder;
    private readonly AiService _aiService;
    private readonly IAiDal _aiDal;
    private readonly IAiQueryDal _aiQueryDal;
    private readonly ILogger<AiQueryService> _logger;

    private const int MaxHistoryMessages = 10;

    public AiQueryService(
        SchemaProvider schemaProvider,
        KeywordMappingService keywordMapper,
        AiPromptBuilder promptBuilder,
        QueryValidationService queryValidator,
        SqlBuilder sqlBuilder,
        AiService aiService,
        IAiDal aiDal,
        ILogger<AiQueryService> logger,
        IAiQueryDal aiQueryDal)
    {
        _schemaProvider = schemaProvider;
        _keywordMapper = keywordMapper;
        _promptBuilder = promptBuilder;
        _queryValidator = queryValidator;
        _sqlBuilder = sqlBuilder;
        _aiService = aiService;
        _aiDal = aiDal;
        _logger = logger;
        _aiQueryDal = aiQueryDal;
    }

    /// <summary>
    /// Xử lý câu hỏi user và trả về kết quả query
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="question">Câu hỏi của user</param>
    /// <param name="chatHistory">Lịch sử chat (optional)</param>
    /// <param name="ct">Cancellation token</param>
    /// <returns>Kết quả query</returns>
    public async Task<AiQueryResponse> ExecuteQueryAsync(
        int userId,
        string question,
        List<GeminiChatMessage>? chatHistory = null,
        CancellationToken ct = default)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            // Bước 1: Keyword Mapping - Xác định bảng
            var tableName = _keywordMapper.DeterminePrimaryTable(question);
            if (tableName == null)
            {
                return CreateErrorResponse("Không xác định được bảng cần truy vấn", startTime);
            }

            _logger.LogInformation("[AIQuery] User {UserId} querying table {Table} with question: {Question}",
                userId, tableName, question);

            // Bước 2: Build Prompt
            var prompt = _promptBuilder.BuildPrompt(question, tableName);

            // Bước 3: Gọi AI để sinh JSON query
            var aiOutput = await _aiService.CallAiAsync(prompt, chatHistory?.Take(MaxHistoryMessages).ToList(), "chat", ct);

            if (string.IsNullOrWhiteSpace(aiOutput))
            {
                return CreateErrorResponse("AI không trả về kết quả", startTime);
            }

            // Bước 4: Validate output AI
            var (isValid, querySpec, errorMessage) = _queryValidator.ValidateAndParse(aiOutput, tableName);

            if (!isValid || querySpec == null)
            {
                _logger.LogWarning("[AIQuery] Invalid AI output: {AiOutput}", aiOutput);
                return CreateErrorResponse("Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.", startTime);
            }

            // Validate query spec lần cuối
            var (specValid, specError) = _queryValidator.ValidateQuerySpec(querySpec);
            if (!specValid)
            {
                _logger.LogWarning("[AIQuery] Query spec validation failed: {Error}", specError);
                return CreateErrorResponse("Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.", startTime);
            }

            // Bước 5: Build SQL
            var (sql, parameters) = _sqlBuilder.BuildSql(querySpec, userId);

            _logger.LogDebug("[AIQuery] Generated SQL: {Sql} with params: {Params}",
                sql, JsonSerializer.Serialize(parameters));

            // Bước 6: Execute query
            var result = await ExecuteRawQueryAsync(tableName, querySpec.Columns, sql, parameters, ct);

            // Bước 7: Build response
            var elapsed = DateTime.UtcNow - startTime;
            return new AiQueryResponse
            {
                Success = true,
                Columns = result.Columns,
                Rows = result.Rows,
                Summary = BuildSummary(question, querySpec, result.Rows.Count),
                TableName = tableName,
                TableDisplayName = _keywordMapper.GetTableDisplayName(tableName),
                QuerySpec = querySpec,
                ExecutionTimeMs = (long)elapsed.TotalMilliseconds,
                Message = $"Tìm thấy {result.Rows.Count} kết quả"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AIQuery] Error processing query for user {UserId}", userId);
            return CreateErrorResponse("Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau ít phút.", startTime);
        }
    }

    /// <summary>
    /// Xử lý câu hỏi đơn giản (không cần AI - dùng direct mapping)
    /// </summary>
    public async Task<AiQueryResponse> ExecuteSimpleQueryAsync(
        int userId,
        string question,
        CancellationToken ct = default)
    {
        var startTime = DateTime.UtcNow;

        try
        {
            var tableName = _keywordMapper.DeterminePrimaryTable(question);
            if (tableName == null)
            {
                return CreateErrorResponse("Không xác định được bảng cần truy vấn", startTime);
            }

            // Tạo query spec đơn giản
            var querySpec = CreateSimpleQuerySpec(question, tableName);
            var (sql, parameters) = _sqlBuilder.BuildSql(querySpec, userId);

            var result = await ExecuteRawQueryAsync(tableName, querySpec.Columns, sql, parameters, ct);

            var elapsed = DateTime.UtcNow - startTime;
            return new AiQueryResponse
            {
                Success = true,
                Columns = result.Columns,
                Rows = result.Rows,
                Summary = BuildSummary(question, querySpec, result.Rows.Count),
                TableName = tableName,
                TableDisplayName = _keywordMapper.GetTableDisplayName(tableName),
                QuerySpec = querySpec,
                ExecutionTimeMs = (long)elapsed.TotalMilliseconds,
                Message = $"Tìm thấy {result.Rows.Count} kết quả"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AIQuery] Error in simple query for user {UserId}", userId);
            return CreateErrorResponse($"Lỗi: {ex.Message}", startTime);
        }
    }

    /// <summary>
    /// Tạo query spec đơn giản từ keyword
    /// </summary>
    private AiQuerySpec CreateSimpleQuerySpec(string question, string tableName)
    {
        var schema = _schemaProvider.GetTableSchema(tableName);
        var normalizedQuestion = question.ToLowerInvariant();

        var spec = new AiQuerySpec
        {
            TableName = tableName,
            Columns = GetDefaultColumns(tableName),
            OrderBy = GetDefaultOrderBy(tableName),
            Limit = 10,
            WhereClauses = new List<WhereClause>()
        };

        // Thêm điều kiện dựa trên keyword
        if (normalizedQuestion.Contains("gần nhất") || normalizedQuestion.Contains("gan nhat") ||
            normalizedQuestion.Contains("mới nhất") || normalizedQuestion.Contains("moi nhat") ||
            normalizedQuestion.Contains("recent"))
        {
            spec.Limit = 3;
        }
        else if (normalizedQuestion.Contains("tháng này") || normalizedQuestion.Contains("thang nay"))
        {
            spec.Limit = 100;
            spec.WhereClauses.Add(new WhereClause
            {
                Column = schema?.DateColumn ?? "NgayTao",
                Operator = ">=",
                Value = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).ToString("yyyy-MM-dd")
            });
        }
        else if (normalizedQuestion.Contains("chưa đọc") || normalizedQuestion.Contains("chua doc"))
        {
            spec.Limit = 20;
            spec.WhereClauses.Add(new WhereClause
            {
                Column = "DaDoc",
                Operator = "=",
                Value = "0"
            });
        }

        return spec;
    }

    /// <summary>
    /// Get default columns cho bảng
    /// </summary>
    private List<string> GetDefaultColumns(string tableName)
    {
        return tableName.ToLowerInvariant() switch
        {
            "tbl_giaodich" => new List<string> { "SoTien", "NgayGiaoDich", "MoTa", "LoaiGiaoDich" },
            "tbl_taikhoan" => new List<string> { "TenTaiKhoan", "SoDu", "MoTa" },
            "tbl_ngansach" => new List<string> { "SoTienToiDa", "SoTienDaChi", "Thang", "Nam" },
            "tbl_muctieu" => new List<string> { "TenMucTieu", "SoTienMongMuon", "SoTienHienTai", "TrangThai" },
            "tbl_thongbao" => new List<string> { "TieuDe", "NoiDung", "NgayTao", "DaDoc" },
            "tbl_canhbao" => new List<string> { "NoiDung", "LoaiCanhBao", "NgayTao", "DaDoc" },
            "tbl_goiy_ai" => new List<string> { "NoiDung", "LoaiGoiY", "NgayTao", "DaDoc" },
            "tbl_giaodich_dinhky" => new List<string> { "TenGiaoDich", "SoTien", "ChuKy", "LanTiepTheo", "TrangThai" },
            "tbl_danhmuc" => new List<string> { "TenDanhMuc", "LoaiDanhMucId" },
            "tbl_donggop_muctieu" => new List<string> { "SoTien", "NgayDongGop", "GhiChu" },
            _ => new List<string> { "*" }
        };
    }

    /// <summary>
    /// Get default ORDER BY cho bảng
    /// </summary>
    private string GetDefaultOrderBy(string tableName)
    {
        return tableName.ToLowerInvariant() switch
        {
            "tbl_giaodich" => "NgayGiaoDich DESC",
            "tbl_taikhoan" => "TenTaiKhoan ASC",
            "tbl_ngansach" => "Thang DESC, Nam DESC",
            "tbl_muctieu" => "NgayKetThuc ASC",
            "tbl_thongbao" => "NgayTao DESC",
            "tbl_canhbao" => "NgayTao DESC",
            "tbl_goiy_ai" => "NgayTao DESC",
            "tbl_giaodich_dinhky" => "LanTiepTheo ASC",
            "tbl_donggop_muctieu" => "NgayDongGop DESC",
            _ => "NgayTao DESC"
        };
    }

    /// <summary>
    /// Execute raw query và trả về kết quả
    /// </summary>
    private async Task<(List<string> Columns, List<Dictionary<string, object?>> Rows)> ExecuteRawQueryAsync(
        string tableName,
        List<string> columns,
        string sql,
        Dictionary<string, object> parameters,
        CancellationToken ct)
    {
        var result = await _aiQueryDal.ExecuteAiQueryAsync(tableName, columns, sql, parameters, ct);
        return (result.Columns, result.Rows);
    }

    /// <summary>
    /// Build summary text
    /// </summary>
    private string BuildSummary(string question, AiQuerySpec spec, int rowCount)
    {
        var tableDisplay = _keywordMapper.GetTableDisplayName(spec.TableName);

        if (rowCount == 0)
        {
            return $"Không tìm thấy {tableDisplay} nào phù hợp với yêu cầu của bạn.";
        }

        return $"Tìm thấy {rowCount} {tableDisplay} cho câu hỏi \"{question}\".";
    }

    /// <summary>
    /// Create error response
    /// </summary>
    private AiQueryResponse CreateErrorResponse(string message, DateTime startTime)
    {
        var elapsed = DateTime.UtcNow - startTime;
        return new AiQueryResponse
        {
            Success = false,
            Columns = new List<string>(),
            Rows = new List<Dictionary<string, object?>>(),
            Message = message,
            ExecutionTimeMs = (long)elapsed.TotalMilliseconds
        };
    }
}

/// <summary>
/// Response từ AI Query Service
/// </summary>
public class AiQueryResponse
{
    public bool Success { get; set; }
    public List<string> Columns { get; set; } = new();
    public List<Dictionary<string, object?>> Rows { get; set; } = new();
    public string? Summary { get; set; }
    public string? TableName { get; set; }
    public string? TableDisplayName { get; set; }
    public AiQuerySpec? QuerySpec { get; set; }
    public long ExecutionTimeMs { get; set; }
    public string? Message { get; set; }
}
