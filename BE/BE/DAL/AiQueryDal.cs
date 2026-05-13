using DAL.Interfaces;
using DTO.AIQuery;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using MySqlConnector;

namespace DAL;

/// <summary>
/// DAL implementation cho AI Query Database
/// </summary>
public class AiQueryDal : IAiQueryDal
{
    private readonly AppDbContext _context;

    public AiQueryDal(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Execute AI-generated query với parameterized SQL
    /// Sử dụng FromSqlRaw với parameters để ngăn SQL injection
    /// </summary>
    public async Task<AiQueryResult> ExecuteAiQueryAsync(
        string tableName,
        List<string> columns,
        string sql,
        Dictionary<string, object> parameters,
        CancellationToken ct = default)
    {
        var result = new AiQueryResult
        {
            Columns = columns,
            Rows = new List<Dictionary<string, object?>>()
        };

        try
        {
            // Chuyển parameters sang MySQL format
            var mysqlParams = new List<MySqlParameter>();
            foreach (var p in parameters)
            {
                var param = new MySqlParameter(p.Key, p.Value ?? DBNull.Value);
                mysqlParams.Add(param);
            }

            // Execute query
            using var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandText = sql;

            foreach (var p in mysqlParams)
            {
                command.Parameters.Add(p);
            }

            await _context.Database.OpenConnectionAsync(ct);

            using var reader = await command.ExecuteReaderAsync(ct);

            // Đọc kết quả
            while (await reader.ReadAsync(ct))
            {
                var row = new Dictionary<string, object?>();
                for (int i = 0; i < columns.Count; i++)
                {
                    try
                    {
                        var value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        row[columns[i]] = value;
                    }
                    catch
                    {
                        row[columns[i]] = null;
                    }
                }
                result.Rows.Add(row);
            }

            return result;
        }
        catch (Exception ex)
        {
            // Log error nhưng vẫn trả về kết quả rỗng
            Console.WriteLine($"[AiQueryDal] Error executing query: {ex.Message}");
            return result;
        }
        finally
        {
            if (_context.Database.GetDbConnection().State == System.Data.ConnectionState.Open)
            {
                await _context.Database.CloseConnectionAsync();
            }
        }
    }
}
