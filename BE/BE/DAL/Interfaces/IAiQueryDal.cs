using DTO.AIQuery;

namespace DAL.Interfaces;

/// <summary>
/// Interface cho AI Query Database operations
/// </summary>
public interface IAiQueryDal
{
    /// <summary>
    /// Execute AI-generated query với parameterized SQL
    /// </summary>
    /// <param name="tableName">Tên bảng</param>
    /// <param name="columns">Danh sách cột</param>
    /// <param name="sql">SQL query</param>
    /// <param name="parameters">Parameters cho query</param>
    Task<AiQueryResult> ExecuteAiQueryAsync(
        string tableName,
        List<string> columns,
        string sql,
        Dictionary<string, object> parameters,
        CancellationToken ct = default);
}
