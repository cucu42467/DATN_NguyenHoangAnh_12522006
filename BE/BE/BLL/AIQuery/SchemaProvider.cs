using System.Text.Json;

namespace BLL.AIQuery;

/// <summary>
/// Cung cấp schema an toàn cho AI Query - WHITE-LIST ONLY
/// Ngăn AI truy cập bảng nhạy cảm hoặc cột không được phép
/// </summary>
public class SchemaProvider
{
    // BLACKLIST - Tuyệt đối cấm AI truy cập
    private static readonly HashSet<string> ForbiddenTables = new(StringComparer.OrdinalIgnoreCase)
    {
        "tbl_nguoidung",
        "tbl_audit_log",
        "tbl_lichsu_dangnhap",
        "tbl_token",
        "tbl_otp",
        "tbl_reset_token",
        "tbl_nguoidung_social",
        "tbl_nguoidung_vaitro",
        "tbl_vaitro",
        "tbl_caidat",
        "tbl_cauhinh_hethong",
        "tbl_tu_khoa",
        "tbl_tygia",
        "tbl_phantich_chitieu",
        "tbl_tonghop_danhmuc",
        "tbl_tonghop_thang",
        "tbl_hanhvi_nguoidung"
    };

    // WHITELIST - Chỉ những bảng này được AI truy vấn
    private static readonly Dictionary<string, TableSchema> AllowedTables = new(StringComparer.OrdinalIgnoreCase)
    {
        ["tbl_giaodich"] = new TableSchema
        {
            TableName = "tbl_giaodich",
            DisplayName = "giao dịch",
            Keywords = new[] { "giao dịch", "chi tiêu", "thu nhập", "tiền", "thanh toán", "mua", "bán", "chuyển khoản", "chuyển tiền", "thu", "chi" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["GiaoDichId"] = new ColumnSchema { Name = "GiaoDichId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["TaiKhoanId"] = new ColumnSchema { Name = "TaiKhoanId", DisplayName = "Tài khoản nguồn", DataType = "int", IsForeignKey = true },
                ["TaiKhoanDichId"] = new ColumnSchema { Name = "TaiKhoanDichId", DisplayName = "Tài khoản đích", DataType = "int", IsForeignKey = true },
                ["DanhMucId"] = new ColumnSchema { Name = "DanhMucId", DisplayName = "Danh mục", DataType = "int", IsForeignKey = true },
                ["LoaiGiaoDich"] = new ColumnSchema { Name = "LoaiGiaoDich", DisplayName = "Loại (1=Thu, 2=Chi, 3=Chuyển)", DataType = "tinyint" },
                ["SoTien"] = new ColumnSchema { Name = "SoTien", DisplayName = "Số tiền", DataType = "decimal", IsNumeric = true },
                ["NgayGiaoDich"] = new ColumnSchema { Name = "NgayGiaoDich", DisplayName = "Ngày giao dịch", DataType = "datetime", IsDateTime = true },
                ["MoTa"] = new ColumnSchema { Name = "MoTa", DisplayName = "Mô tả/Ghi chú", DataType = "varchar" }
            },
            MustIncludeUserId = true,
            DateColumn = "NgayGiaoDich",
            NumericColumn = "SoTien"
        },

        ["tbl_taikhoan"] = new TableSchema
        {
            TableName = "tbl_taikhoan",
            DisplayName = "tài khoản",
            Keywords = new[] { "tài khoản", "ví", "số dư", "ngân hàng", "tiền", "tiền mặt", "thẻ", "nguồn tiền" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["TaiKhoanId"] = new ColumnSchema { Name = "TaiKhoanId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["TenTaiKhoan"] = new ColumnSchema { Name = "TenTaiKhoan", DisplayName = "Tên tài khoản", DataType = "varchar" },
                ["SoDu"] = new ColumnSchema { Name = "SoDu", DisplayName = "Số dư", DataType = "decimal", IsNumeric = true },
                ["LoaiTaiKhoanId"] = new ColumnSchema { Name = "LoaiTaiKhoanId", DisplayName = "Loại tài khoản", DataType = "int", IsForeignKey = true },
                ["MoTa"] = new ColumnSchema { Name = "MoTa", DisplayName = "Mô tả", DataType = "varchar" }
            },
            MustIncludeUserId = true,
            NumericColumn = "SoDu"
        },

        ["tbl_danhmuc"] = new TableSchema
        {
            TableName = "tbl_danhmuc",
            DisplayName = "danh mục",
            Keywords = new[] { "danh mục", "loại chi", "hạng mục", "khoản mục", "phân loại" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["DanhMucId"] = new ColumnSchema { Name = "DanhMucId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["TenDanhMuc"] = new ColumnSchema { Name = "TenDanhMuc", DisplayName = "Tên danh mục", DataType = "varchar" },
                ["LoaiDanhMucId"] = new ColumnSchema { Name = "LoaiDanhMucId", DisplayName = "Loại danh mục (1=Thu, 2=Chi)", DataType = "int" },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["Icon"] = new ColumnSchema { Name = "Icon", DisplayName = "Icon", DataType = "varchar" },
                ["MauSac"] = new ColumnSchema { Name = "MauSac", DisplayName = "Màu sắc", DataType = "varchar" },
                ["TrangThai"] = new ColumnSchema { Name = "TrangThai", DisplayName = "Trạng thái", DataType = "tinyint" }
            },
            MustIncludeUserId = false // Có cả danh mục hệ thống
        },

        ["tbl_ngansach"] = new TableSchema
        {
            TableName = "tbl_ngansach",
            DisplayName = "ngân sách",
            Keywords = new[] { "ngân sách", "budget", "giới hạn", "tối đa", "cho phép", "vượt" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["NganSachId"] = new ColumnSchema { Name = "NganSachId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["DanhMucId"] = new ColumnSchema { Name = "DanhMucId", DisplayName = "Danh mục", DataType = "int", IsForeignKey = true },
                ["SoTienToiDa"] = new ColumnSchema { Name = "SoTienToiDa", DisplayName = "Số tiền tối đa", DataType = "decimal", IsNumeric = true },
                ["SoTienDaChi"] = new ColumnSchema { Name = "SoTienDaChi", DisplayName = "Số tiền đã chi", DataType = "decimal", IsNumeric = true },
                ["Thang"] = new ColumnSchema { Name = "Thang", DisplayName = "Tháng", DataType = "int" },
                ["Nam"] = new ColumnSchema { Name = "Nam", DisplayName = "Năm", DataType = "int" },
                ["TrangThai"] = new ColumnSchema { Name = "TrangThai", DisplayName = "Trạng thái", DataType = "tinyint" }
            },
            MustIncludeUserId = true,
            NumericColumn = "SoTienToiDa"
        },

        ["tbl_muctieu"] = new TableSchema
        {
            TableName = "tbl_muctieu",
            DisplayName = "mục tiêu",
            Keywords = new[] { "mục tiêu", "tiết kiệm", "tích lũy", "muốn mua", "muốn đạt", "kế hoạch", "tương lai" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["MucTieuId"] = new ColumnSchema { Name = "MucTieuId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["TenMucTieu"] = new ColumnSchema { Name = "TenMucTieu", DisplayName = "Tên mục tiêu", DataType = "varchar" },
                ["SoTienMongMuon"] = new ColumnSchema { Name = "SoTienMongMuon", DisplayName = "Số tiền mong muốn", DataType = "decimal", IsNumeric = true },
                ["SoTienHienTai"] = new ColumnSchema { Name = "SoTienHienTai", DisplayName = "Số tiền hiện tại", DataType = "decimal", IsNumeric = true },
                ["NgayBatDau"] = new ColumnSchema { Name = "NgayBatDau", DisplayName = "Ngày bắt đầu", DataType = "datetime", IsDateTime = true },
                ["NgayKetThuc"] = new ColumnSchema { Name = "NgayKetThuc", DisplayName = "Ngày kết thúc", DataType = "datetime", IsDateTime = true },
                ["TrangThai"] = new ColumnSchema { Name = "TrangThai", DisplayName = "Trạng thái (1=Đang theo dõi, 2=Hoàn thành)", DataType = "tinyint" }
            },
            MustIncludeUserId = true,
            NumericColumn = "SoTienMongMuon"
        },

        ["tbl_thongbao"] = new TableSchema
        {
            TableName = "tbl_thongbao",
            DisplayName = "thông báo",
            Keywords = new[] { "thông báo", "notification", "tin nhắn", "alerts", "cảnh báo", "nhắc nhở" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["ThongBaoId"] = new ColumnSchema { Name = "ThongBaoId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["TieuDe"] = new ColumnSchema { Name = "TieuDe", DisplayName = "Tiêu đề", DataType = "varchar" },
                ["NoiDung"] = new ColumnSchema { Name = "NoiDung", DisplayName = "Nội dung", DataType = "varchar" },
                ["LoaiThongBao"] = new ColumnSchema { Name = "LoaiThongBao", DisplayName = "Loại (1=Hệ thống, 2=Cảnh báo, 3=Gợi ý, 4=Dự đoán)", DataType = "tinyint" },
                ["NgayTao"] = new ColumnSchema { Name = "NgayTao", DisplayName = "Ngày tạo", DataType = "datetime", IsDateTime = true },
                ["DaDoc"] = new ColumnSchema { Name = "DaDoc", DisplayName = "Đã đọc", DataType = "bit" }
            },
            MustIncludeUserId = true,
            DateColumn = "NgayTao"
        },

        ["tbl_giaodich_dinhky"] = new TableSchema
        {
            TableName = "tbl_giaodich_dinhky",
            DisplayName = "giao dịch định kỳ",
            Keywords = new[] { "định kỳ", "tự động", "lặp lại", "hàng tháng", "hàng tuần", "subscription", "recurring" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["Id"] = new ColumnSchema { Name = "Id", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["TaiKhoanId"] = new ColumnSchema { Name = "TaiKhoanId", DisplayName = "Tài khoản", DataType = "int", IsForeignKey = true },
                ["DanhMucId"] = new ColumnSchema { Name = "DanhMucId", DisplayName = "Danh mục", DataType = "int", IsForeignKey = true },
                ["TenGiaoDich"] = new ColumnSchema { Name = "TenGiaoDich", DisplayName = "Tên giao dịch", DataType = "varchar" },
                ["LoaiGiaoDich"] = new ColumnSchema { Name = "LoaiGiaoDich", DisplayName = "Loại", DataType = "tinyint" },
                ["SoTien"] = new ColumnSchema { Name = "SoTien", DisplayName = "Số tiền", DataType = "decimal", IsNumeric = true },
                ["ChuKy"] = new ColumnSchema { Name = "ChuKy", DisplayName = "Chu kỳ (monthly, weekly, daily)", DataType = "varchar" },
                ["NgayBatDau"] = new ColumnSchema { Name = "NgayBatDau", DisplayName = "Ngày bắt đầu", DataType = "datetime", IsDateTime = true },
                ["NgayKetThuc"] = new ColumnSchema { Name = "NgayKetThuc", DisplayName = "Ngày kết thúc", DataType = "datetime", IsDateTime = true },
                ["LanTiepTheo"] = new ColumnSchema { Name = "LanTiepTheo", DisplayName = "Lần tiếp theo", DataType = "datetime", IsDateTime = true },
                ["TrangThai"] = new ColumnSchema { Name = "TrangThai", DisplayName = "Trạng thái", DataType = "tinyint" }
            },
            MustIncludeUserId = true,
            NumericColumn = "SoTien"
        },

        ["tbl_canhbao"] = new TableSchema
        {
            TableName = "tbl_canhbao",
            DisplayName = "cảnh báo",
            Keywords = new[] { "cảnh báo", "warning", "nguy hiểm", "vượt ngân sách", "thấp", "cao" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["CanhBaoId"] = new ColumnSchema { Name = "CanhBaoId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["LoaiCanhBao"] = new ColumnSchema { Name = "LoaiCanhBao", DisplayName = "Loại (1=Thấp, 2=Trung bình, 3=Cao)", DataType = "tinyint" },
                ["NoiDung"] = new ColumnSchema { Name = "NoiDung", DisplayName = "Nội dung", DataType = "varchar" },
                ["NgayTao"] = new ColumnSchema { Name = "NgayTao", DisplayName = "Ngày tạo", DataType = "datetime", IsDateTime = true },
                ["DaDoc"] = new ColumnSchema { Name = "DaDoc", DisplayName = "Đã đọc", DataType = "bit" }
            },
            MustIncludeUserId = true,
            DateColumn = "NgayTao"
        },

        ["tbl_goiy_ai"] = new TableSchema
        {
            TableName = "tbl_goiy_ai",
            DisplayName = "gợi ý AI",
            Keywords = new[] { "gợi ý", "recommendation", "AI", "advice", "tips" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["GoiYId"] = new ColumnSchema { Name = "GoiYId", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["NguoiDungId"] = new ColumnSchema { Name = "NguoiDungId", DisplayName = "Người dùng ID", DataType = "int", IsForeignKey = true },
                ["LoaiGoiY"] = new ColumnSchema { Name = "LoaiGoiY", DisplayName = "Loại", DataType = "tinyint" },
                ["NoiDung"] = new ColumnSchema { Name = "NoiDung", DisplayName = "Nội dung", DataType = "varchar" },
                ["NgayTao"] = new ColumnSchema { Name = "NgayTao", DisplayName = "Ngày tạo", DataType = "datetime", IsDateTime = true },
                ["DaDoc"] = new ColumnSchema { Name = "DaDoc", DisplayName = "Đã đọc", DataType = "bit" }
            },
            MustIncludeUserId = true,
            DateColumn = "NgayTao"
        },

        ["tbl_donggop_muctieu"] = new TableSchema
        {
            TableName = "tbl_donggop_muctieu",
            DisplayName = "đóng góp mục tiêu",
            Keywords = new[] { "đóng góp", "contribution", "góp", "thêm", "tiết kiệm" },
            Columns = new Dictionary<string, ColumnSchema>
            {
                ["Id"] = new ColumnSchema { Name = "Id", DisplayName = "ID", DataType = "int", IsPrimaryKey = true },
                ["MucTieuId"] = new ColumnSchema { Name = "MucTieuId", DisplayName = "Mục tiêu ID", DataType = "int", IsForeignKey = true },
                ["SoTien"] = new ColumnSchema { Name = "SoTien", DisplayName = "Số tiền", DataType = "decimal", IsNumeric = true },
                ["NgayDongGop"] = new ColumnSchema { Name = "NgayDongGop", DisplayName = "Ngày đóng góp", DataType = "datetime", IsDateTime = true },
                ["GhiChu"] = new ColumnSchema { Name = "GhiChu", DisplayName = "Ghi chú", DataType = "varchar" }
            },
            MustIncludeUserId = false // Cần JOIN với tbl_muctieu
        }
    };

    /// <summary>
    /// Kiểm tra bảng có được phép truy cập không
    /// </summary>
    public bool IsValidTable(string tableName)
    {
        if (ForbiddenTables.Contains(tableName))
            return false;

        return AllowedTables.ContainsKey(tableName);
    }

    /// <summary>
    /// Kiểm tra cột có được phép truy cập không
    /// </summary>
    public bool IsValidColumn(string tableName, string columnName)
    {
        if (!AllowedTables.TryGetValue(tableName, out var schema))
            return false;

        return schema.Columns.ContainsKey(columnName);
    }

    /// <summary>
    /// Lấy thông tin bảng
    /// </summary>
    public TableSchema? GetTableSchema(string tableName)
    {
        return AllowedTables.GetValueOrDefault(tableName);
    }

    /// <summary>
    /// Build prompt schema cho AI
    /// </summary>
    public string BuildSchemaPrompt()
    {
        var sb = new System.Text.StringBuilder();
        sb.AppendLine("## DATABASE SCHEMA (CHỈ ĐƯỢC DÙNG CÁC BẢNG SAU)");
        sb.AppendLine();

        foreach (var kvp in AllowedTables)
        {
            var schema = kvp.Value;
            sb.AppendLine($"### {schema.TableName} ({schema.DisplayName})");
            sb.AppendLine($"Từ khóa gợi ý: {string.Join(", ", schema.Keywords)}");

            // Chỉ hiển thị cột an toàn
            var safeColumns = schema.Columns
                .Where(c => !c.Key.Equals("NguoiDungId", StringComparison.OrdinalIgnoreCase))
                .ToList();

            sb.AppendLine("Các cột:");
            foreach (var col in safeColumns)
            {
                var colInfo = col.Value;
                var type = colInfo.IsNumeric ? "(số)" : colInfo.IsDateTime ? "(ngày)" : "(text)";
                sb.AppendLine($"- {col.Key}: {colInfo.DisplayName} {type}");
            }
            sb.AppendLine();
        }

        return sb.ToString();
    }

    /// <summary>
    /// Lấy tất cả bảng được phép
    /// </summary>
    public IReadOnlyDictionary<string, TableSchema> GetAllowedTables() => AllowedTables;

    /// <summary>
    /// Tìm bảng phù hợp với keywords
    /// </summary>
    public string? FindTableByKeyword(string keyword)
    {
        foreach (var kvp in AllowedTables)
        {
            if (kvp.Value.Keywords.Any(k =>
                keyword.Contains(k, StringComparison.OrdinalIgnoreCase) ||
                k.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            {
                return kvp.Key;
            }
        }
        return null;
    }

    /// <summary>
    /// Validate columns trong query
    /// </summary>
    public List<string> ValidateColumns(string tableName, List<string> columns)
    {
        var validColumns = new List<string>();
        if (!AllowedTables.TryGetValue(tableName, out var schema))
            return validColumns;

        foreach (var col in columns)
        {
            if (schema.Columns.ContainsKey(col))
                validColumns.Add(col);
        }

        return validColumns;
    }
}

/// <summary>
/// Schema cho một bảng
/// </summary>
public class TableSchema
{
    public string TableName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string[] Keywords { get; set; } = Array.Empty<string>();
    public Dictionary<string, ColumnSchema> Columns { get; set; } = new();
    public bool MustIncludeUserId { get; set; }
    public string? DateColumn { get; set; }
    public string? NumericColumn { get; set; }
}

/// <summary>
/// Schema cho một cột
/// </summary>
public class ColumnSchema
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
    public bool IsPrimaryKey { get; set; }
    public bool IsForeignKey { get; set; }
    public bool IsNumeric { get; set; }
    public bool IsDateTime { get; set; }
}
