using System.Text;
using System.Text.RegularExpressions;

namespace BLL.AIQuery;

/// <summary>
/// Build SQL an toàn từ QuerySpec
/// Sử dụng parameterized queries để ngăn SQL injection
/// </summary>
public class SqlBuilder
{
    private readonly SchemaProvider _schemaProvider;

    public SqlBuilder(SchemaProvider schemaProvider)
    {
        _schemaProvider = schemaProvider;
    }

    /// <summary>
    /// Build SQL query từ QuerySpec
    /// </summary>
    /// <param name="spec">Query specification</param>
    /// <param name="userId">User ID cho security filter</param>
    /// <returns>Tuple of (SQL, Parameters)</returns>
    public (string Sql, Dictionary<string, object> Parameters) BuildSql(AiQuerySpec spec, int userId)
    {
        var schema = _schemaProvider.GetTableSchema(spec.TableName);
        if (schema == null)
            throw new ArgumentException($"Invalid table: {spec.TableName}");

        var sb = new StringBuilder();
        var parameters = new Dictionary<string, object>();
        var paramIndex = 0;

        // 1. SELECT
        sb.Append("SELECT ");
        sb.Append(string.Join(", ", spec.Columns.Select(c => EscapeIdentifier(c))));

        // 2. FROM
        sb.Append($" FROM {EscapeIdentifier(spec.TableName)}");

        // 3. WHERE - BẮT BUỘC userId
        sb.Append($" WHERE {EscapeIdentifier("NguoiDungId")} = @p{paramIndex}");
        parameters[$"@p{paramIndex}"] = userId;
        paramIndex++;

        // 4. Thêm các whereClauses từ AI
        foreach (var clause in spec.WhereClauses)
        {
            // Skip userId vì đã thêm ở trên
            if (clause.Column.Equals("NguoiDungId", StringComparison.OrdinalIgnoreCase))
                continue;

            sb.Append(" AND ");
            sb.Append(EscapeIdentifier(clause.Column));

            // Handle NULL checks
            if (clause.Operator.Equals("IS NULL", StringComparison.OrdinalIgnoreCase))
            {
                sb.Append(" IS NULL");
                continue;
            }
            if (clause.Operator.Equals("IS NOT NULL", StringComparison.OrdinalIgnoreCase))
            {
                sb.Append(" IS NOT NULL");
                continue;
            }

            sb.Append($" {clause.Operator} ");

            // Handle special operators
            if (clause.Operator.Equals("IN", StringComparison.OrdinalIgnoreCase) ||
                clause.Operator.Equals("NOT IN", StringComparison.OrdinalIgnoreCase))
            {
                // IN clause - expect comma-separated values
                var values = clause.Value.Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(v => v.Trim())
                    .ToList();

                if (values.Count > 0)
                {
                    var inParams = new List<string>();
                    foreach (var v in values)
                    {
                        var pName = $"@p{paramIndex}";
                        inParams.Add(pName);
                        parameters[pName] = ParseValue(v, spec.TableName, clause.Column);
                        paramIndex++;
                    }
                    sb.Append($"({string.Join(", ", inParams)})");
                }
                else
                {
                    sb.Append("(NULL)"); // Safe fallback
                }
            }
            else if (clause.Operator.Equals("BETWEEN", StringComparison.OrdinalIgnoreCase))
            {
                // BETWEEN clause
                var parts = clause.Value.Split(',', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 2)
                {
                    var p1Name = $"@p{paramIndex}";
                    parameters[p1Name] = ParseValue(parts[0].Trim(), spec.TableName, clause.Column);
                    paramIndex++;

                    var p2Name = $"@p{paramIndex}";
                    parameters[p2Name] = ParseValue(parts[1].Trim(), spec.TableName, clause.Column);
                    paramIndex++;

                    sb.Append($"{p1Name} AND {p2Name}");
                }
            }
            else if (clause.Operator.Equals("LIKE", StringComparison.OrdinalIgnoreCase) ||
                     clause.Operator.Equals("NOT LIKE", StringComparison.OrdinalIgnoreCase))
            {
                var pName = $"@p{paramIndex}";
                parameters[pName] = $"%{clause.Value}%";
                paramIndex++;
                sb.Append(pName);
            }
            else
            {
                var pName = $"@p{paramIndex}";
                parameters[pName] = ParseValue(clause.Value, spec.TableName, clause.Column);
                paramIndex++;
                sb.Append(pName);
            }
        }

        // 5. ORDER BY
        if (!string.IsNullOrWhiteSpace(spec.OrderBy))
        {
            sb.Append(" ORDER BY ");
            var orderParts = spec.OrderBy.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (orderParts.Length >= 1)
            {
                sb.Append(EscapeIdentifier(orderParts[0]));
                if (orderParts.Length >= 2)
                {
                    sb.Append(' ');
                    sb.Append(orderParts[1].ToUpperInvariant());
                }
            }
        }

        // 6. LIMIT
        sb.Append($" LIMIT {Math.Min(spec.Limit, 100)}");

        return (sb.ToString(), parameters);
    }

    /// <summary>
    /// Build SQL count query
    /// </summary>
    public (string Sql, Dictionary<string, object> Parameters) BuildCountSql(AiQuerySpec spec, int userId)
    {
        var schema = _schemaProvider.GetTableSchema(spec.TableName);
        if (schema == null)
            throw new ArgumentException($"Invalid table: {spec.TableName}");

        var sb = new StringBuilder();
        var parameters = new Dictionary<string, object>();
        var paramIndex = 0;

        // SELECT COUNT(*)
        sb.Append("SELECT COUNT(*) FROM ");
        sb.Append(EscapeIdentifier(spec.TableName));

        // WHERE userId BẮT BUỘC
        sb.Append($" WHERE {EscapeIdentifier("NguoiDungId")} = @p{paramIndex}");
        parameters[$"@p{paramIndex}"] = userId;
        paramIndex++;

        // Thêm các whereClauses
        foreach (var clause in spec.WhereClauses)
        {
            if (clause.Column.Equals("NguoiDungId", StringComparison.OrdinalIgnoreCase))
                continue;

            sb.Append(" AND ");
            sb.Append(EscapeIdentifier(clause.Column));

            if (clause.Operator.Equals("IS NULL", StringComparison.OrdinalIgnoreCase))
            {
                sb.Append(" IS NULL");
                continue;
            }
            if (clause.Operator.Equals("IS NOT NULL", StringComparison.OrdinalIgnoreCase))
            {
                sb.Append(" IS NOT NULL");
                continue;
            }

            sb.Append($" {clause.Operator} ");

            if (clause.Operator.Equals("IN", StringComparison.OrdinalIgnoreCase))
            {
                var values = clause.Value.Split(',', StringSplitOptions.RemoveEmptyEntries);
                var inParams = new List<string>();
                foreach (var v in values)
                {
                    var pName = $"@p{paramIndex}";
                    inParams.Add(pName);
                    parameters[pName] = ParseValue(v.Trim(), spec.TableName, clause.Column);
                    paramIndex++;
                }
                sb.Append($"({string.Join(", ", inParams)})");
            }
            else
            {
                var pName = $"@p{paramIndex}";
                parameters[pName] = ParseValue(clause.Value, spec.TableName, clause.Column);
                paramIndex++;
                sb.Append(pName);
            }
        }

        return (sb.ToString(), parameters);
    }

    /// <summary>
    /// Escape SQL identifier (column/table name)
    /// </summary>
    private string EscapeIdentifier(string name)
    {
        // Chỉ cho phép alphanumeric và underscore
        if (!Regex.IsMatch(name, @"^[a-zA-Z_][a-zA-Z0-9_]*$"))
        {
            throw new ArgumentException($"Invalid identifier: {name}");
        }
        return $"`{name}`";
    }

    /// <summary>
    /// Parse value theo kiểu dữ liệu của cột
    /// </summary>
    private object ParseValue(string value, string tableName, string columnName)
    {
        if (string.IsNullOrWhiteSpace(value))
            return DBNull.Value;

        var schema = _schemaProvider.GetTableSchema(tableName);
        if (schema == null)
            return value;

        if (!schema.Columns.TryGetValue(columnName, out var colSchema))
            return value;

        // Parse theo kiểu dữ liệu
        return colSchema.DataType.ToLowerInvariant() switch
        {
            "int" or "tinyint" or "smallint" or "bigint" => ParseInt(value),
            "decimal" or "float" or "double" or "real" => ParseDecimal(value),
            "bit" => ParseBool(value),
            "datetime" or "date" or "datetime2" => ParseDateTime(value),
            _ => value
        };
    }

    private int ParseInt(string value)
    {
        if (int.TryParse(value, out var result))
            return result;
        return 0;
    }

    private decimal ParseDecimal(string value)
    {
        // Remove currency symbols và formatting
        var cleaned = value
            .Replace("VND", "")
            .Replace("vnd", "")
            .Replace(".", "")
            .Replace(",", ".")
            .Replace(" ", "")
            .Trim();

        if (decimal.TryParse(cleaned, out var result))
            return result;
        return 0;
    }

    private bool ParseBool(string value)
    {
        var lower = value.ToLowerInvariant().Trim();
        return lower == "1" || lower == "true" || lower == "yes" || lower == "y" || lower == "đã đọc";
    }

    private DateTime ParseDateTime(string value)
    {
        if (DateTime.TryParse(value, out var result))
            return result;

        // Thử parse với format Việt Nam
        if (DateTime.TryParseExact(value, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out result))
            return result;

        if (DateTime.TryParseExact(value, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out result))
            return result;

        return DateTime.MinValue;
    }
}


