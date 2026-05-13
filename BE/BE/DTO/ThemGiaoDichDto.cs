using System.ComponentModel.DataAnnotations;

namespace DTO;

/// <summary>
/// Request DTO cho việc thêm mới giao dịch đầy đủ với validation attributes
/// Áp dụng đầy đủ luồng 10 bước theo yêu cầu
/// </summary>
public class ThemGiaoDichRequest
{
    #region === THÔNG TIN BẮT BUỘC ===

    /// <summary>
    /// ID tài khoản nguồn (bắt buộc)
    /// </summary>
    [Required(ErrorMessage = "Tài khoản nguồn không được để trống")]
    public int TaiKhoanId { get; set; }

    /// <summary>
    /// Số tiền giao dịch (bắt buộc, phải > 0)
    /// </summary>
    [Required(ErrorMessage = "Số tiền không được để trống")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn 0")]
    public decimal SoTien { get; set; }

    /// <summary>
    /// Loại giao dịch: 1=Thu, 2=Chi, 3=Chuyển khoản (bắt buộc)
    /// </summary>
    [Required(ErrorMessage = "Loại giao dịch không được để trống")]
    [Range(1, 3, ErrorMessage = "Loại giao dịch không hợp lệ. Chỉ chấp nhận: 1 (Thu), 2 (Chi), 3 (Chuyển khoản)")]
    public sbyte LoaiGiaoDich { get; set; }

    /// <summary>
    /// Ngày giao dịch (bắt buộc)
    /// </summary>
    [Required(ErrorMessage = "Ngày giao dịch không được để trống")]
    public DateTime NgayGiaoDich { get; set; }

    #endregion

    #region === THÔNG TIN TÙY CHỌN ===

    /// <summary>
    /// ID tài khoản đích (bắt buộc khi LoaiGiaoDich = 3 - Chuyển khoản)
    /// </summary>
    public int? TaiKhoanDichId { get; set; }

    /// <summary>
    /// ID danh mục (tùy chọn, nhưng phải khớp với loại giao dịch)
    /// </summary>
    public int? DanhMucId { get; set; }

    /// <summary>
    /// Mô tả/Ghi chú giao dịch (tùy chọn)
    /// </summary>
    [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
    public string? MoTa { get; set; }

    /// <summary>
    /// Tên giao dịch hiển thị (tùy chọn, ưu tiên hơn MoTa)
    /// </summary>
    [StringLength(255, ErrorMessage = "Tên giao dịch không được vượt quá 255 ký tự")]
    public string? TenGiaoDich { get; set; }   // ← THÊM MỚI

    /// <summary>
    /// Tiền tệ (mặc định: VND)
    /// </summary>
    [StringLength(10, ErrorMessage = "Tiền tệ không được vượt quá 10 ký tự")]
    public string? TienTe { get; set; } = "VND";

    /// <summary>
    /// Tỷ giá quy đổi (mặc định: 1)
    /// </summary>
    public decimal? TyGiaQuyDoi { get; set; } = 1m;

    /// <summary>
    /// Vị trí (GPS) khi tạo giao dịch (tùy chọn)
    /// </summary>
    [StringLength(255, ErrorMessage = "Vị trí không được vượt quá 255 ký tự")]
    public string? ViTri { get; set; }

    /// <summary>
    /// Nguồn tạo: 'web', 'mobile', 'ai', 'system' (mặc định: 'web')
    /// </summary>
    [StringLength(20, ErrorMessage = "Nguồn tạo không được vượt quá 20 ký tự")]
    public string? NguonTao { get; set; } = "web";

    /// <summary>
    /// Mã giao dịch ngoài (đồng bộ từ ngân hàng, tùy chọn)
    /// </summary>
    [StringLength(255, ErrorMessage = "Mã giao dịch ngoài không được vượt quá 255 ký tự")]
    public string? MaGiaoDichNgoai { get; set; }

    /// <summary>
    /// Độ tin cậy AI (0-1, mặc định: 1)
    /// </summary>
    [Range(0, 1, ErrorMessage = "Độ tin cậy phải từ 0 đến 1")]
    public float? DoTinCay { get; set; } = 1f;

    /// <summary>
    /// Có phải giao dịch tự động không (mặc định: false)
    /// </summary>
    public bool LaTuDong { get; set; } = false;

    #endregion

    #region === NGÂN SÁCH ===

    /// <summary>
    /// Flag xác nhận tạo ngân sách tự động nếu chưa có
    /// Khi LoaiGiaoDich = 2 (Chi) và DanhMucId có giá trị nhưng chưa có ngân sách tháng
    /// Nếu = true: tự động tạo ngân sách mới với hạn mức = 0
    /// Nếu = false: bỏ qua bước cập nhật ngân sách
    /// </summary>
    public bool XacNhanTaoNganSach { get; set; } = false;

    #endregion

    #region === CHI TIẾT GIAO DỊCH (Nhiều danh mục) ===

    /// <summary>
    /// Danh sách chi tiết giao dịch khi 1 giao dịch có nhiều danh mục
    /// Tổng SoTien của các item phải bằng SoTien chính
    /// </summary>
    public List<ChiTietGiaoDichItem>? ChiTietList { get; set; }

    #endregion

    #region === FILE ĐÍNH KÈM ===

    /// <summary>
    /// Danh sách file đính kèm (hóa đơn, ảnh chụp,...)
    /// Chỉ chấp nhận: jpg, jpeg, png, pdf
    /// </summary>
    public List<TepDinhKemItem>? TepDinhKemList { get; set; }

    #endregion
}

/// <summary>
/// Item chi tiết cho giao dịch có nhiều danh mục
/// </summary>
public class ChiTietGiaoDichItem
{
    /// <summary>
    /// ID danh mục (bắt buộc)
    /// </summary>
    [Required(ErrorMessage = "Danh mục không được để trống")]
    public int DanhMucId { get; set; }

    /// <summary>
    /// Số tiền cho danh mục này (bắt buộc, phải > 0)
    /// </summary>
    [Required(ErrorMessage = "Số tiền không được để trống")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn 0")]
    public decimal SoTien { get; set; }

    /// <summary>
    /// Mô tả cho chi tiết này (tùy chọn)
    /// </summary>
    [StringLength(255, ErrorMessage = "Mô tả không được vượt quá 255 ký tự")]
    public string? MoTa { get; set; }
}

/// <summary>
/// Item file đính kèm
/// </summary>
public class TepDinhKemItem
{
    /// <summary>
    /// Tên file gốc
    /// </summary>
    [Required(ErrorMessage = "Tên file không được để trống")]
    public string TenFile { get; set; } = null!;

    /// <summary>
    /// Đường dẫn lưu trên server sau khi upload
    /// </summary>
    [Required(ErrorMessage = "Đường dẫn file không được để trống")]
    public string DuongDan { get; set; } = null!;

    /// <summary>
    /// Loại file (Content-Type): image/jpeg, image/png, application/pdf
    /// </summary>
    [StringLength(50, ErrorMessage = "Loại file không được vượt quá 50 ký tự")]
    public string? LoaiFile { get; set; }

    /// <summary>
    /// Kích thước file (bytes)
    /// </summary>
    public int? KichThuoc { get; set; }
}

/// <summary>
/// Các cảnh báo trả về sau khi tạo giao dịch
/// </summary>
public class CanhBaoGiaoDich
{
    /// <summary>
    /// Cảnh báo số dư thấp
    /// </summary>
    public bool CoCanhBaoSoDuThap { get; set; }

    /// <summary>
    /// Nội dung cảnh báo số dư thấp
    /// </summary>
    public string? NoiDungCanhBaoSoDu { get; set; }

    /// <summary>
    /// Cảnh báo vượt ngân sách
    /// </summary>
    public bool CoCanhBaoVuotNganSach { get; set; }

    /// <summary>
    /// Nội dung cảnh báo vượt ngân sách
    /// </summary>
    public string? NoiDungCanhBaoVuotNganSach { get; set; }

    /// <summary>
    /// Cảnh báo gần đạt ngân sách (>= 80%)
    /// </summary>
    public bool CoCanhBaoGanNganSach { get; set; }

    /// <summary>
    /// Nội dung cảnh báo gần ngân sách
    /// </summary>
    public string? NoiDungCanhBaoGanNganSach { get; set; }

    /// <summary>
    /// Ngân sách mới được tạo tự động
    /// </summary>
    public bool LaNganSachMoi { get; set; }

    /// <summary>
    /// Nội dung thông báo ngân sách mới
    /// </summary>
    public string? NoiDungNganSachMoi { get; set; }

    /// <summary>
    /// Phần trăm ngân sách đã sử dụng (nếu có)
    /// </summary>
    public float? PhanTramNganSach { get; set; }
}

#region === RESPONSE DTO ===

/// <summary>
/// Response DTO cho việc thêm mới giao dịch đầy đủ
/// Chứa đầy đủ thông tin sau khi tạo giao dịch thành công
/// </summary>
public class ThemGiaoDichResponse
{
    /// <summary>
    /// ID giao dịch vừa tạo
    /// </summary>
    public int GiaoDichId { get; set; }

    /// <summary>
    /// Số dư tài khoản sau giao dịch
    /// </summary>
    public decimal SoDuSauGiaoDich { get; set; }

    /// <summary>
    /// Danh sách các thông báo đã tạo
    /// </summary>
    public List<ThongBaoItem> CacThongBao { get; set; } = new();

    /// <summary>
    /// Các cảnh báo (nếu có)
    /// </summary>
    public CanhBaoGiaoDich? CanhBao { get; set; }

    /// <summary>
    /// Thông báo chung
    /// </summary>
    public string? ThongBao { get; set; }

    /// <summary>
    /// Trạng thái thành công
    /// </summary>
    public bool ThanhCong { get; set; }

    /// <summary>
    /// Mã lỗi (nếu có)
    /// </summary>
    public string? MaLoi { get; set; }
}

/// <summary>
/// Item thông báo trong response
/// </summary>
public class ThongBaoItem
{
    /// <summary>
    /// ID thông báo
    /// </summary>
    public int ThongBaoId { get; set; }

    /// <summary>
    /// Tiêu đề thông báo
    /// </summary>
    public string TieuDe { get; set; } = null!;

    /// <summary>
    /// Nội dung thông báo
    /// </summary>
    public string? NoiDung { get; set; }

    /// <summary>
    /// Loại thông báo: 1=Hệ thống, 2=Gợi ý AI, 3=Nhắc nhở, 4=Cảnh báo
    /// </summary>
    public sbyte LoaiThongBao { get; set; }
}

#endregion
