namespace BLL.AIQuery;

/// <summary>
/// Build prompt cho AI Query Service
/// Chịu trách nhiệm tạo prompt an toàn, rõ ràng để AI sinh JSON query
/// </summary>
public class AiPromptBuilder
{
    private readonly SchemaProvider _schemaProvider;
    private readonly KeywordMappingService _keywordMapper;

    public AiPromptBuilder(SchemaProvider schemaProvider, KeywordMappingService keywordMapper)
    {
        _schemaProvider = schemaProvider;
        _keywordMapper = keywordMapper;
    }

    /// <summary>
    /// Build prompt hoàn chỉnh cho AI
    /// </summary>
    /// <param name="userQuestion">Câu hỏi của user</param>
    /// <param name="tableName">Tên bảng đã xác định</param>
    /// <returns>Prompt hoàn chỉnh</returns>
    public string BuildPrompt(string userQuestion, string tableName)
    {
        var schema = _schemaProvider.GetTableSchema(tableName);
        if (schema == null)
            throw new ArgumentException($"Invalid table: {tableName}");

        var sb = new System.Text.StringBuilder();

        // Header
        sb.AppendLine("Bạn là AI chuyên phân tích câu hỏi và sinh truy vấn dữ liệu JSON.");
        sb.AppendLine("Nhiệm vụ: Chuyển câu hỏi của user thành JSON query structure.");
        sb.AppendLine();
        sb.AppendLine("=" .Repeat(50));
        sb.AppendLine();

        // Schema
        sb.AppendLine("## DATABASE SCHEMA (CHỈ ĐƯỢC DÙNG CÁC BẢNG/CỘT SAU)");
        sb.AppendLine($"Bảng được chọn: {schema.TableName} ({schema.DisplayName})");
        sb.AppendLine();
        sb.AppendLine("Các cột:");
        foreach (var col in schema.Columns)
        {
            var info = col.Value;
            var type = info.IsNumeric ? " [SỐ]" : info.IsDateTime ? " [NGÀY]" : " [TEXT]";
            var flags = info.IsPrimaryKey ? " [PK]" : info.IsForeignKey ? " [FK]" : "";
            sb.AppendLine($"  - {col.Key}: {info.DisplayName}{type}{flags}");
        }
        sb.AppendLine();

        // RULES
        sb.AppendLine("## QUY TẮC BẮT BUỘC");
        sb.AppendLine("1. CHỈ dùng bảng và cột được liệt kê ở trên");
        sb.AppendLine("2. KHÔNG viết SQL - CHỈ trả về JSON");
        sb.AppendLine("3. KHÔNG thêm markdown code block ```json");
        sb.AppendLine("4. KHÔNG giải thích - CHỈ trả JSON thuần");
        sb.AppendLine("5. LUÔN thêm điều kiện userId trong where clause");
        sb.AppendLine("6. Nếu câu hỏi về thời gian, dùng NgayTao hoặc NgayGiaoDich làm cột ngày");
        sb.AppendLine("7. Nếu câu hỏi về số tiền, dùng SoTien làm cột số");
        sb.AppendLine("8. Giới hạn tối đa 100 bản ghi");
        sb.AppendLine();

        // OUTPUT FORMAT
        sb.AppendLine("## FORMAT OUTPUT");
        sb.AppendLine("Trả về JSON thuần túy (KHÔNG có ```json):");
        sb.AppendLine();
        sb.AppendLine("{");
        sb.AppendLine("  \"columns\": [\"column1\", \"column2\"],");
        sb.AppendLine("  \"orderBy\": \"column ASC|DESC\",");
        sb.AppendLine("  \"limit\": number,");
        sb.AppendLine("  \"whereClauses\": [");
        sb.AppendLine("    {\"column\": \"columnName\", \"operator\": \"=\", \"value\": \"value\"}");
        sb.AppendLine("  ]");
        sb.AppendLine("}");
        sb.AppendLine();

        // EXAMPLES
        sb.AppendLine("## VÍ DỤ");
        sb.AppendLine();

        // Ví dụ 1: Giao dịch gần nhất
        sb.AppendLine("Ví dụ 1: User hỏi \"3 giao dịch gần nhất\"");
        sb.AppendLine("Output:");
        sb.AppendLine(@"{""columns"":[""SoTien"",""NgayGiaoDich"",""MoTa""],""orderBy"":""NgayGiaoDich DESC"",""limit"":3,""whereClauses"":[]}");
        sb.AppendLine();

        // Ví dụ 2: Chi tiêu tháng này
        sb.AppendLine("Ví dụ 2: User hỏi \"chi tiêu tháng này\"");
        sb.AppendLine("Output:");
        sb.AppendLine(@"{""columns"":[""SoTien"",""NgayGiaoDich"",""MoTa"",""LoaiGiaoDich""],""orderBy"":""NgayGiaoDich DESC"",""limit"":100,""whereClauses"":[{""column"":""LoaiGiaoDich"",""operator"":""="",""value"":""2""},{""column"":""NgayGiaoDich"",""operator"":"">="",""value"":""2026-05-01""}]}");
        sb.AppendLine();

        // Ví dụ 3: Thông báo chưa đọc
        sb.AppendLine("Ví dụ 3: User hỏi \"thông báo chưa đọc\"");
        sb.AppendLine("Output:");
        sb.AppendLine(@"{""columns"":[""TieuDe"",""NoiDung"",""NgayTao"",""LoaiThongBao""],""orderBy"":""NgayTao DESC"",""limit"":20,""whereClauses"":[{""column"":""DaDoc"",""operator"":""="",""value"":""0""}]}");
        sb.AppendLine();

        // Ví dụ 4: Tài khoản
        sb.AppendLine("Ví dụ 4: User hỏi \"tài khoản của tôi\"");
        sb.AppendLine("Output:");
        sb.AppendLine(@"{""columns"":[""TenTaiKhoan"",""SoDu"",""MoTa""],""orderBy"":""TenTaiKhoan ASC"",""limit"":50,""whereClauses"":[]}");

        sb.AppendLine();
        sb.AppendLine("=" .Repeat(50));
        sb.AppendLine();

        // USER INPUT
        sb.AppendLine("## USER INPUT");
        sb.AppendLine($"Câu hỏi: \"{userQuestion}\"");
        sb.AppendLine();
        sb.AppendLine("Trả về JSON thuần túy (KHÔNG markdown, KHÔNG giải thích):");

        return sb.ToString();
    }

    /// <summary>
    /// Build prompt đơn giản cho các truy vấn nhanh
    /// </summary>
    public string BuildSimplePrompt(string userQuestion, string tableName)
    {
        var schema = _schemaProvider.GetTableSchema(tableName);
        if (schema == null)
            throw new ArgumentException($"Invalid table: {tableName}");

        var columns = string.Join(", ", schema.Columns.Keys);
        var dateCol = schema.DateColumn ?? "NgayTao";
        var numericCol = schema.NumericColumn ?? "SoTien";

        return $@"Bạng là AI chuyển câu hỏi thành JSON query.

Schema: {tableName}
Columns: {columns}
DateColumn: {dateCol}
NumericColumn: {numericCol}

QUY TẮC:
- Chỉ dùng bảng và cột trên
- Không viết SQL
- Chỉ trả JSON thuần
- Không markdown, không giải thích

Format:
{{""columns"":[""col1"",""col2""],""orderBy"":""col ASC|DESC"",""limit"":number,""whereClauses"":[{{""column"":""col"",""operator"":""="",""value"":""val""}}]}}

Ví dụ: ""3 giao dịch gần nhất""
→ {{""columns"":[""SoTien"",""NgayGiaoDich"",""MoTa""],""orderBy"":""NgayGiaoDich DESC"",""limit"":3,""whereClauses"":[]}}

Câu hỏi: ""{userQuestion}""

JSON:";
    }
}

/// <summary>
/// Extension method for string repeat
/// </summary>
public static class StringExtensions
{
    public static string Repeat(this string str, int count)
    {
        return string.Concat(Enumerable.Repeat(str, count));
    }
}
