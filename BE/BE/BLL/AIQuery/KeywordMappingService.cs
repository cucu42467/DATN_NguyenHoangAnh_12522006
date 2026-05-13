namespace BLL.AIQuery;

/// <summary>
/// Service xác định bảng cần truy vấn dựa trên keyword từ câu hỏi user
/// </summary>
public class KeywordMappingService
{
    private readonly SchemaProvider _schemaProvider;

    // Mapping từ keyword tiếng Việt -> table name
    private static readonly Dictionary<string, string> KeywordToTable = new(StringComparer.OrdinalIgnoreCase)
    {
        // Giao dịch
        ["giao dịch"] = "tbl_giaodich",
        ["giao dich"] = "tbl_giaodich",
        ["transaction"] = "tbl_giaodich",
        ["transactions"] = "tbl_giaodich",
        ["chi tiêu"] = "tbl_giaodich",
        ["chi tieu"] = "tbl_giaodich",
        ["expense"] = "tbl_giaodich",
        ["expenses"] = "tbl_giaodich",
        ["thu nhập"] = "tbl_giaodich",
        ["thu nhap"] = "tbl_giaodich",
        ["income"] = "tbl_giaodich",
        ["tiền"] = "tbl_giaodich",
        ["tien"] = "tbl_giaodich",
        ["money"] = "tbl_giaodich",
        ["thanh toán"] = "tbl_giaodich",
        ["thanh toan"] = "tbl_giaodich",
        ["payment"] = "tbl_giaodich",
        ["mua"] = "tbl_giaodich",
        ["buy"] = "tbl_giaodich",
        ["bán"] = "tbl_giaodich",
        ["ban"] = "tbl_giaodich",
        ["sell"] = "tbl_giaodich",
        ["chuyển khoản"] = "tbl_giaodich",
        ["chuyen khoan"] = "tbl_giaodich",
        ["transfer"] = "tbl_giaodich",
        ["thu"] = "tbl_giaodich",
        ["chi"] = "tbl_giaodich",
        ["spend"] = "tbl_giaodich",
        ["tiêu"] = "tbl_giaodich",
        ["tieu"] = "tbl_giaodich",
        ["mua sắm"] = "tbl_giaodich",
        ["mua sam"] = "tbl_giaodich",
        ["shopping"] = "tbl_giaodich",

        // Tài khoản
        ["tài khoản"] = "tbl_taikhoan",
        ["tai khoan"] = "tbl_taikhoan",
        ["account"] = "tbl_taikhoan",
        ["accounts"] = "tbl_taikhoan",
        ["ví"] = "tbl_taikhoan",
        ["vi"] = "tbl_taikhoan",
        ["wallet"] = "tbl_taikhoan",
        ["số dư"] = "tbl_taikhoan",
        ["so du"] = "tbl_taikhoan",
        ["balance"] = "tbl_taikhoan",
        ["ngân hàng"] = "tbl_taikhoan",
        ["ngan hang"] = "tbl_taikhoan",
        ["bank"] = "tbl_taikhoan",
        ["tiền mặt"] = "tbl_taikhoan",
        ["tien mat"] = "tbl_taikhoan",
        ["cash"] = "tbl_taikhoan",
        ["thẻ"] = "tbl_taikhoan",
        ["the"] = "tbl_taikhoan",
        ["card"] = "tbl_taikhoan",

        // Danh mục
        ["danh mục"] = "tbl_danhmuc",
        ["danh muc"] = "tbl_danhmuc",
        ["category"] = "tbl_danhmuc",
        ["categories"] = "tbl_danhmuc",
        ["loại chi"] = "tbl_danhmuc",
        ["loai chi"] = "tbl_danhmuc",
        ["hạng mục"] = "tbl_danhmuc",
        ["hang muc"] = "tbl_danhmuc",
        ["phân loại"] = "tbl_danhmuc",
        ["phan loai"] = "tbl_danhmuc",
        ["ăn uống"] = "tbl_danhmuc",
        ["an uong"] = "tbl_danhmuc",
        ["food"] = "tbl_danhmuc",
        ["di chuyển"] = "tbl_danhmuc",
        ["di chuyen"] = "tbl_danhmuc",
        ["transport"] = "tbl_danhmuc",
        ["nhà ở"] = "tbl_danhmuc",
        ["nha o"] = "tbl_danhmuc",
        ["housing"] = "tbl_danhmuc",
        ["giải trí"] = "tbl_danhmuc",
        ["giai tri"] = "tbl_danhmuc",
        ["entertainment"] = "tbl_danhmuc",

        // Ngân sách
        ["ngân sách"] = "tbl_ngansach",
        ["ngan sach"] = "tbl_ngansach",
        ["budget"] = "tbl_ngansach",
        ["giới hạn"] = "tbl_ngansach",
        ["gioi han"] = "tbl_ngansach",
        ["limit"] = "tbl_ngansach",
        ["tối đa"] = "tbl_ngansach",
        ["toi da"] = "tbl_ngansach",
        ["maximum"] = "tbl_ngansach",

        // Mục tiêu
        ["mục tiêu"] = "tbl_muctieu",
        ["muc tieu"] = "tbl_muctieu",
        ["goal"] = "tbl_muctieu",
        ["goals"] = "tbl_muctieu",
        ["tiết kiệm"] = "tbl_muctieu",
        ["tiet kiem"] = "tbl_muctieu",
        ["saving"] = "tbl_muctieu",
        ["savings"] = "tbl_muctieu",
        ["tích lũy"] = "tbl_muctieu",
        ["tich luy"] = "tbl_muctieu",
        ["accumulate"] = "tbl_muctieu",
        ["muốn mua"] = "tbl_muctieu",
        ["muon mua"] = "tbl_muctieu",
        ["want to buy"] = "tbl_muctieu",
        ["kế hoạch"] = "tbl_muctieu",
        ["ke hoach"] = "tbl_muctieu",
        ["plan"] = "tbl_muctieu",

        // Thông báo
        ["thông báo"] = "tbl_thongbao",
        ["thong bao"] = "tbl_thongbao",
        ["notification"] = "tbl_thongbao",
        ["notifications"] = "tbl_thongbao",
        ["tin nhắn"] = "tbl_thongbao",
        ["tin nhan"] = "tbl_thongbao",
        ["message"] = "tbl_thongbao",
        ["messages"] = "tbl_thongbao",
        ["alerts"] = "tbl_thongbao",
        ["nhắc nhở"] = "tbl_thongbao",
        ["nhac nho"] = "tbl_thongbao",
        ["reminder"] = "tbl_thongbao",
        ["chưa đọc"] = "tbl_thongbao",
        ["chua doc"] = "tbl_thongbao",
        ["unread"] = "tbl_thongbao",

        // Giao dịch định kỳ
        ["định kỳ"] = "tbl_giaodich_dinhky",
        ["dinh ky"] = "tbl_giaodich_dinhky",
        ["periodic"] = "tbl_giaodich_dinhky",
        ["recurring"] = "tbl_giaodich_dinhky",
        ["tự động"] = "tbl_giaodich_dinhky",
        ["tu dong"] = "tbl_giaodich_dinhky",
        ["automatic"] = "tbl_giaodich_dinhky",
        ["subscription"] = "tbl_giaodich_dinhky",
        ["hàng tháng"] = "tbl_giaodich_dinhky",
        ["hang thang"] = "tbl_giaodich_dinhky",
        ["monthly"] = "tbl_giaodich_dinhky",
        ["hàng tuần"] = "tbl_giaodich_dinhky",
        ["hang tuan"] = "tbl_giaodich_dinhky",
        ["weekly"] = "tbl_giaodich_dinhky",

        // Cảnh báo
        ["cảnh báo"] = "tbl_canhbao",
        ["canh bao"] = "tbl_canhbao",
        ["warning"] = "tbl_canhbao",
        ["warnings"] = "tbl_canhbao",
        ["alert"] = "tbl_canhbao",
        ["nguy hiểm"] = "tbl_canhbao",
        ["nguy hiem"] = "tbl_canhbao",
        ["danger"] = "tbl_canhbao",
        ["vượt ngân sách"] = "tbl_canhbao",
        ["vuot ngan sach"] = "tbl_canhbao",
        ["over budget"] = "tbl_canhbao",

        // Gợi ý AI
        ["gợi ý"] = "tbl_goiy_ai",
        ["goi y"] = "tbl_goiy_ai",
        ["recommendation"] = "tbl_goiy_ai",
        ["recommendations"] = "tbl_goiy_ai",
        ["advice"] = "tbl_goiy_ai",
        ["tips"] = "tbl_goiy_ai",
        ["suggestion"] = "tbl_goiy_ai",

        // Đóng góp mục tiêu
        ["đóng góp"] = "tbl_donggop_muctieu",
        ["dong gop"] = "tbl_donggop_muctieu",
        ["contribution"] = "tbl_donggop_muctieu",
        ["góp"] = "tbl_donggop_muctieu",
        ["gop"] = "tbl_donggop_muctieu",
        ["thêm"] = "tbl_donggop_muctieu",
        ["them"] = "tbl_donggop_muctieu"
    };

    public KeywordMappingService(SchemaProvider schemaProvider)
    {
        _schemaProvider = schemaProvider;
    }

    /// <summary>
    /// Xác định bảng cần truy vấn từ câu hỏi user
    /// </summary>
    /// <param name="question">Câu hỏi của user</param>
    /// <returns>Danh sách table names được xác định</returns>
    public List<string> MapKeywordsToTables(string question)
    {
        var foundTables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var normalizedQuestion = NormalizeText(question);

        // Tìm kiếm từng keyword trong câu hỏi
        foreach (var kvp in KeywordToTable)
        {
            var keyword = NormalizeText(kvp.Key);
            if (normalizedQuestion.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            {
                if (_schemaProvider.IsValidTable(kvp.Value))
                {
                    foundTables.Add(kvp.Value);
                }
            }
        }

        // Nếu không tìm thấy, dùng SchemaProvider để tìm
        if (foundTables.Count == 0)
        {
            foreach (var word in normalizedQuestion.Split(' ', StringSplitOptions.RemoveEmptyEntries))
            {
                var table = _schemaProvider.FindTableByKeyword(word);
                if (table != null)
                {
                    foundTables.Add(table);
                }
            }
        }

        // Mặc định trả về giao dịch nếu không tìm được gì
        if (foundTables.Count == 0)
        {
            foundTables.Add("tbl_giaodich");
        }

        return foundTables.ToList();
    }

    /// <summary>
    /// Xác định bảng chính cho truy vấn (ưu tiên bảng cụ thể nhất)
    /// </summary>
    public string? DeterminePrimaryTable(string question)
    {
        var tables = MapKeywordsToTables(question);
        if (tables.Count == 0)
            return null;

        // Ưu tiên thứ tự: giao dịch > tài khoản > ngân sách > mục tiêu > thông báo > danh mục
        var priority = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            ["tbl_thongbao"] = 1,
            ["tbl_ngansach"] = 2,
            ["tbl_muctieu"] = 3,
            ["tbl_giaodich_dinhky"] = 4,
            ["tbl_taikhoan"] = 5,
            ["tbl_giaodich"] = 6,
            ["tbl_canhbao"] = 7,
            ["tbl_goiy_ai"] = 8,
            ["tbl_danhmuc"] = 9,
            ["tbl_donggop_muctieu"] = 10
        };

        return tables
            .Where(t => priority.ContainsKey(t))
            .OrderBy(t => priority[t])
            .FirstOrDefault() ?? tables.First();
    }

    /// <summary>
    /// Lấy display name của bảng
    /// </summary>
    public string GetTableDisplayName(string tableName)
    {
        var schema = _schemaProvider.GetTableSchema(tableName);
        return schema?.DisplayName ?? tableName;
    }

    /// <summary>
    /// Normalize text để so sánh
    /// </summary>
    private string NormalizeText(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Thay thế các ký tự đặc biệt
        var normalized = text
            .ToLowerInvariant()
            .Replace(".", " ")
            .Replace(",", " ")
            .Replace("!", " ")
            .Replace("?", " ")
            .Replace(":", " ")
            .Replace(";", " ")
            .Replace("  ", " ")
            .Trim();

        return normalized;
    }
}
