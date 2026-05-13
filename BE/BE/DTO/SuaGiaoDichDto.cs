using System.ComponentModel.DataAnnotations;

namespace DTO;

#region === REQUEST DTO ===

/// <summary>
/// Request DTO cho việc SỬA giao dịch đầy đủ với validation attributes
/// Áp dụng đầy đủ luồng 10 bước: hoàn tác cũ → áp dụng mới
/// </summary>
public class SuaGiaoDichRequest
{
    #region === THÔNG TIN BẮT BUỘC ===

    /// <summary>
    /// ID giao dịch cần sửa (từ route)
    /// </summary>
    public int GiaoDichId { get; set; }

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
    /// Tên giao dịch hiển thị (tùy chọn)
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
    /// Vị trí (GPS) khi sửa giao dịch (tùy chọn)
    /// </summary>
    [StringLength(255, ErrorMessage = "Vị trí không được vượt quá 255 ký tự")]
    public string? ViTri { get; set; }

    #endregion

    #region === FILE ĐÍNH KÈM ===

    /// <summary>
    /// Danh sách file cần THÊM mới (hóa đơn, ảnh chụp,...)
    /// Chỉ chấp nhận: jpg, jpeg, png, pdf
    /// </summary>
    public List<TepDinhKemItem>? TepDinhKemThemMoi { get; set; }

    /// <summary>
    /// Danh sách ID file cần XÓA (chỉ xóa liên kết, giữ lại file)
    /// </summary>
    public List<int>? TepDinhKemXoa { get; set; }

    #endregion
}

#endregion

#region === RESPONSE DTO ===

/// <summary>
/// Response DTO cho việc sửa giao dịch đầy đủ
/// Chứa đầy đủ thông tin sau khi sửa giao dịch thành công
/// </summary>
public class SuaGiaoDichResponse
{
    /// <summary>
    /// ID giao dịch vừa sửa
    /// </summary>
    public int GiaoDichId { get; set; }

    /// <summary>
    /// Số dư tài khoản sau khi sửa
    /// </summary>
    public List<SoDuSauCapNhat> SoDuSauCapNhats { get; set; } = new();

    /// <summary>
    /// Danh sách các thông báo đã tạo
    /// </summary>
    public List<ThongBaoItem> DanhSachThongBao { get; set; } = new();

    /// <summary>
    /// Các cảnh báo (nếu có)
    /// </summary>
    public CanhBaoSuaGiaoDich? CanhBao { get; set; }

    /// <summary>
    /// Các thay đổi đã thực hiện
    /// </summary>
    public List<string> CacThayDoi { get; set; } = new();

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
/// Thông tin số dư tài khoản sau khi cập nhật
/// </summary>
public class SoDuSauCapNhat
{
    /// <summary>
    /// ID tài khoản
    /// </summary>
    public int TaiKhoanId { get; set; }

    /// <summary>
    /// Tên tài khoản
    /// </summary>
    public string TenTaiKhoan { get; set; } = null!;

    /// <summary>
    /// Số dư sau cập nhật
    /// </summary>
    public decimal SoDu { get; set; }
}

/// <summary>
/// Các cảnh báo khi sửa giao dịch
/// </summary>
public class CanhBaoSuaGiaoDich
{
    /// <summary>
    /// Cảnh báo đổi loại giao dịch
    /// </summary>
    public bool CoThayDoiLoai { get; set; }

    /// <summary>
    /// Loại cũ
    /// </summary>
    public sbyte? LoaiCu { get; set; }

    /// <summary>
    /// Loại mới
    /// </summary>
    public sbyte? LoaiMoi { get; set; }

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
    /// Phần trăm ngân sách đã sử dụng
    /// </summary>
    public float? PhanTramNganSach { get; set; }
}

#endregion

#region === AUDIT TRAIL DTO ===

/// <summary>
/// DTO lưu trữ dữ liệu giao dịch cũ để audit
/// </summary>
public class GiaoDichCuData
{
    public int GiaoDichId { get; set; }
    public int? TaiKhoanId { get; set; }
    public int? TaiKhoanDichId { get; set; }
    public int? DanhMucId { get; set; }
    public byte? LoaiGiaoDich { get; set; }
    public decimal SoTien { get; set; }
    public string? TienTe { get; set; }
    public decimal? TyGiaQuyDoi { get; set; }
    public DateTime NgayGiaoDich { get; set; }
    public string? MoTa { get; set; }
    public ulong? LaTuDong { get; set; }
    public float? DoTinCay { get; set; }
    public int TrangThai { get; set; }
    public string? NguonTao { get; set; }
    public string? ViTri { get; set; }
    public string? MaGiaoDichNgoai { get; set; }
}

/// <summary>
/// Các flags xác định thay đổi
/// </summary>
public class FlagsThayDoi
{
    public bool DoiLoaiGiaoDich { get; set; }
    public bool DoiSoTien { get; set; }
    public bool DoiTaiKhoan { get; set; }
    public bool DoiDanhMuc { get; set; }
    public bool DoiThang { get; set; }
    public bool CanCapNhatSoDu { get; set; }
    public bool CanCapNhatNganSach { get; set; }
}

#endregion
