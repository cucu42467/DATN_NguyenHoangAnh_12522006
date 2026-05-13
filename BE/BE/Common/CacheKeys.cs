namespace Common;

/// <summary>
/// Class chứa các hằng số cache key - tránh hardcode string trong code
/// </summary>
public static class CacheKeys
{
    // Tiền tố cho các cache key
    private const string PREFIX = "app";
    
    // === NGƯỜI DÙNG ===
    public static string NguoiDung(int id) => $"{PREFIX}:user:{id}";
    public static string NguoiDungAll => $"{PREFIX}:users:all";
    public static string NguoiDungByEmail(string email) => $"{PREFIX}:user:email:{email}";
    
    // === TÀI KHOẢN ===
    public static string TaiKhoan(int id) => $"{PREFIX}:account:{id}";
    public static string TaiKhoanAll(int nguoiDungId) => $"{PREFIX}:account:user:{nguoiDungId}:all";
    public static string TaiKhoanLoaiAll => $"{PREFIX}:account-type:all";
    
    // === DANH MỤC ===
    public static string DanhMuc(int id) => $"{PREFIX}:category:{id}";
    public static string DanhMucAll(int? nguoiDungId = null) 
        => nguoiDungId.HasValue 
            ? $"{PREFIX}:category:user:{nguoiDungId}:all" 
            : $"{PREFIX}:category:system:all";
    public static string DanhMucLoaiAll => $"{PREFIX}:category-type:all";
    
    // === GIAO DỊCH ===
    public static string GiaoDich(int id) => $"{PREFIX}:transaction:{id}";
    public static string GiaoDichByNguoiDung(int nguoiDungId) => $"{PREFIX}:transaction:user:{nguoiDungId}";
    public static string GiaoDichByTaiKhoan(int taiKhoanId) => $"{PREFIX}:transaction:account:{taiKhoanId}";
    
    // === NGÂN SÁCH ===
    public static string NganSach(int nguoiDungId, int thang, int nam) 
        => $"{PREFIX}:budget:user:{nguoiDungId}:{thang}:{nam}";
    public static string NganSachAll(int nguoiDungId) => $"{PREFIX}:budget:user:{nguoiDungId}:all";
    
    // === MỤC TIÊU ===
    public static string MucTieu(int id) => $"{PREFIX}:goal:{id}";
    public static string MucTieuAll(int nguoiDungId) => $"{PREFIX}:goal:user:{nguoiDungId}:all";
    public static string DongGopMucTieu(int mucTieuId) => $"{PREFIX}:contribution:goal:{mucTieuId}";
    
    // === BÁO CÁO ===
    public static string BaoCaoTongHop(int nguoiDungId, string duration, int? thang, int? nam) 
        => $"{PREFIX}:report:summary:{nguoiDungId}:{duration}:{thang}:{nam}";
    public static string BaoCaoTaiKhoan(int nguoiDungId, int? thang, int? nam) 
        => $"{PREFIX}:report:account:{nguoiDungId}:{thang}:{nam}";
    public static string BaoCaoDanhMuc(int nguoiDungId, int? thang, int? nam) 
        => $"{PREFIX}:report:category:{nguoiDungId}:{thang}:{nam}";
    public static string BaoCaoNganSach(int nguoiDungId, int thang, int nam) 
        => $"{PREFIX}:report:budget:{nguoiDungId}:{thang}:{nam}";
    public static string BaoCaoMucTieu(int nguoiDungId) 
        => $"{PREFIX}:report:goal:{nguoiDungId}";
    
    // === CẤU HÌNH HỆ THỐNG ===
    public static string CauHinhAll => $"{PREFIX}:settings:all";
    public static string CauHinh(string key) => $"{PREFIX}:settings:{key}";
    
    // === SƠ ĐỒ DATABASE (AI Query) ===
    public static string SchemaInfo(int nguoiDungId) => $"{PREFIX}:schema:user:{nguoiDungId}";
    
    /// <summary>
    /// Tạo key với timestamp - hữu ích khi cần cache theo thời gian
    /// </summary>
    public static string WithTimestamp(string baseKey) => $"{baseKey}:generated:{DateTime.UtcNow:yyyyMMddHHmm}";
}
