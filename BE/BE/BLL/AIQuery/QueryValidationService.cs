using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Logging;

namespace BLL.AIQuery;

/// <summary>
/// Validate output từ AI - Đảm bảo JSON hợp lệ và an toàn
/// </summary>
public class QueryValidationService
{
    private readonly SchemaProvider _schemaProvider;
    private readonly ILogger<QueryValidationService> _logger;

    // SQL Injection patterns cần block
    private static readonly string[] DangerousPatterns = new[]
    {
        @";\s*DROP\s",
        @";\s*DELETE\s",
        @";\s*UPDATE\s",
        @";\s*INSERT\s",
        @";\s*TRUNCATE\s",
        @";\s*ALTER\s",
        @";\s*CREATE\s",
        @";\s*GRANT\s",
        @";\s*REVOKE\s",
        @"\bUNION\s+SELECT\b",
        @"\bEXEC\s*\(",
        @"\bEXECUTE\s*\(",
        @"\bxp_cmdshell\b",
        @"\bsp_executesql\b",
        @"\bDROP\s+TABLE\b",
        @"\bDROP\s+DATABASE\b",
        @"--\s*$",
        @"/\*.*\*/",
        @"\bOR\s+1\s*=\s*1\b",
        @"\bAND\s+1\s*=\s*1\b"
    };

    public QueryValidationService(SchemaProvider schemaProvider, ILogger<QueryValidationService> logger)
    {
        _schemaProvider = schemaProvider;
        _logger = logger;
    }

    /// <summary>
    /// Validate và parse JSON output từ AI
    /// </summary>
    public (bool IsValid, AiQuerySpec? QuerySpec, string? ErrorMessage) ValidateAndParse(string aiOutput, string tableName)
    {
        try
        {
            // 1. Clean JSON string
            var cleanJson = CleanJsonString(aiOutput);

            // 2. Parse JSON
            JsonElement root;
            try
            {
                root = JsonDocument.Parse(cleanJson).RootElement;
            }
            catch (JsonException ex)
            {
                _logger.LogWarning("Invalid JSON from AI: {Error}", ex.Message);
                return (false, null, $"Invalid JSON format: {ex.Message}");
            }

            // 3. Extract và validate columns
            if (!root.TryGetProperty("columns", out var columnsElement) ||
                columnsElement.ValueKind != JsonValueKind.Array)
            {
                return (false, null, "Missing or invalid 'columns' property");
            }

            var columns = new List<string>();
            foreach (var col in columnsElement.EnumerateArray())
            {
                var colName = col.GetString();
                if (string.IsNullOrWhiteSpace(colName))
                    continue;

                // Validate column exists in table
                if (!_schemaProvider.IsValidColumn(tableName, colName))
                {
                    _logger.LogWarning("Invalid column from AI: {Column} for table {Table}", colName, tableName);
                    continue; // Skip invalid columns instead of failing
                }

                columns.Add(colName);
            }

            if (columns.Count == 0)
            {
                return (false, null, "No valid columns specified");
            }

            // 4. Extract orderBy
            var orderBy = "NgayTao DESC"; // Default
            if (root.TryGetProperty("orderBy", out var orderByElement) &&
                orderByElement.ValueKind == JsonValueKind.String)
            {
                orderBy = orderByElement.GetString() ?? orderBy;

                // Validate orderBy không chứa SQL injection
                if (!ValidateOrderBy(orderBy, tableName))
                {
                    orderBy = "NgayTao DESC"; // Reset to safe default
                }
            }

            // 5. Extract limit
            var limit = 10; // Default
            if (root.TryGetProperty("limit", out var limitElement))
            {
                if (limitElement.ValueKind == JsonValueKind.Number)
                {
                    limit = limitElement.GetInt32();
                }
                else if (limitElement.ValueKind == JsonValueKind.String &&
                         int.TryParse(limitElement.GetString(), out var parsedLimit))
                {
                    limit = parsedLimit;
                }
            }

            // Enforce limit constraints
            if (limit < 1) limit = 1;
            if (limit > 100) limit = 100; // Hard cap

            // 6. Extract whereClauses
            var whereClauses = new List<WhereClause>();
            if (root.TryGetProperty("whereClauses", out var whereElement) &&
                whereElement.ValueKind == JsonValueKind.Array)
            {
                foreach (var clause in whereElement.EnumerateArray())
                {
                    if (clause.ValueKind != JsonValueKind.Object)
                        continue;

                    var column = clause.TryGetProperty("column", out var colEl) ? colEl.GetString() : null;
                    var op = clause.TryGetProperty("operator", out var opEl) ? opEl.GetString() : null;
                    var value = clause.TryGetProperty("value", out var valEl) ? valEl.GetString() : null;

                    if (string.IsNullOrWhiteSpace(column) || string.IsNullOrWhiteSpace(op))
                        continue;

                    // Validate column
                    if (!_schemaProvider.IsValidColumn(tableName, column))
                    {
                        _logger.LogWarning("Invalid column in whereClause: {Column}", column);
                        continue;
                    }

                    // Validate operator
                    if (!IsValidOperator(op))
                    {
                        _logger.LogWarning("Invalid operator in whereClause: {Operator}", op);
                        continue;
                    }

                    // Validate value không chứa injection
                    if (ContainsSqlInjection(value ?? ""))
                    {
                        _logger.LogWarning("SQL injection detected in whereClause value: {Value}", value);
                        continue;
                    }

                    whereClauses.Add(new WhereClause
                    {
                        Column = column,
                        Operator = op,
                        Value = value ?? ""
                    });
                }
            }

            var querySpec = new AiQuerySpec
            {
                TableName = tableName,
                Columns = columns,
                OrderBy = orderBy,
                Limit = limit,
                WhereClauses = whereClauses
            };

            return (true, querySpec, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating AI output");
            return (false, null, $"Validation error: {ex.Message}");
        }
    }

    /// <summary>
    /// Clean JSON string - remove markdown, extra whitespace
    /// </summary>
    private string CleanJsonString(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "{}";

        var output = input.Trim();

        // Remove markdown code blocks
        if (output.StartsWith("```json"))
        {
            output = output.Substring(7);
        }
        else if (output.StartsWith("```"))
        {
            output = output.Substring(3);
        }

        if (output.EndsWith("```"))
        {
            output = output.Substring(0, output.Length - 3);
        }

        // Remove any text before first {
        var firstBrace = output.IndexOf('{');
        if (firstBrace > 0)
        {
            output = output.Substring(firstBrace);
        }

        // Remove any text after last }
        var lastBrace = output.LastIndexOf('}');
        if (lastBrace > 0 && lastBrace < output.Length - 1)
        {
            output = output.Substring(0, lastBrace + 1);
        }

        return output.Trim();
    }

    /// <summary>
    /// Validate orderBy clause
    /// </summary>
    private bool ValidateOrderBy(string orderBy, string tableName)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
            return false;

        // Chỉ cho phép: columnName ASC|DESC
        var pattern = @"^(\w+)\s+(ASC|DESC)$";
        if (!Regex.IsMatch(orderBy, pattern, RegexOptions.IgnoreCase))
            return false;

        // Extract column name
        var parts = orderBy.Split(' ');
        var columnName = parts[0];

        return _schemaProvider.IsValidColumn(tableName, columnName);
    }

    /// <summary>
    /// Check operator có được phép không
    /// </summary>
    private bool IsValidOperator(string op)
    {
        var allowedOperators = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "=", "==", "!=", "<>", "<", ">", "<=", ">=",
            "LIKE", "NOT LIKE",
            "IN", "NOT IN",
            "IS NULL", "IS NOT NULL",
            "BETWEEN"
        };

        return allowedOperators.Contains(op);
    }

    /// <summary>
    /// Kiểm tra SQL injection trong value
    /// </summary>
    private bool ContainsSqlInjection(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        foreach (var pattern in DangerousPatterns)
        {
            if (Regex.IsMatch(value, pattern, RegexOptions.IgnoreCase))
            {
                _logger.LogWarning("Dangerous pattern detected: {Pattern} in value: {Value}", pattern, value);
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Validate query spec trước khi execute
    /// </summary>
    public (bool IsValid, string? ErrorMessage) ValidateQuerySpec(AiQuerySpec spec)
    {
        // Check table
        if (!_schemaProvider.IsValidTable(spec.TableName))
        {
            return (false, $"Invalid table: {spec.TableName}");
        }

        // Check columns
        if (spec.Columns == null || spec.Columns.Count == 0)
        {
            return (false, "No columns specified");
        }

        foreach (var col in spec.Columns)
        {
            if (!_schemaProvider.IsValidColumn(spec.TableName, col))
            {
                return (false, $"Invalid column: {col}");
            }
        }

        // Check limit
        if (spec.Limit < 1 || spec.Limit > 100)
        {
            return (false, $"Invalid limit: {spec.Limit}. Must be 1-100");
        }

        // Check orderBy format
        if (!string.IsNullOrWhiteSpace(spec.OrderBy))
        {
            if (!ValidateOrderBy(spec.OrderBy, spec.TableName))
            {
                return (false, $"Invalid orderBy: {spec.OrderBy}");
            }
        }

        return (true, null);
    }
}

/// <summary>
/// Kết quả query từ AI
/// </summary>
public class AiQuerySpec
{
    public string TableName { get; set; } = string.Empty;
    public List<string> Columns { get; set; } = new();
    public string OrderBy { get; set; } = string.Empty;
    public int Limit { get; set; } = 10;
    public List<WhereClause> WhereClauses { get; set; } = new();
}

/// <summary>
/// Where clause cho query
/// </summary>
public class WhereClause
{
    public string Column { get; set; } = string.Empty;
    public string Operator { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}
