using System;

namespace DTO;

// Audit Log DTO
public class AuditLogDto
{
    public int Id { get; set; }
    public int? NguoiDungId { get; set; }
    public string? TenNguoiDung { get; set; }
    public string TenBang { get; set; } = null!;
    public int? BanGhiId { get; set; }
    public string HanhDong { get; set; } = null!; // INSERT, UPDATE, DELETE
    public string? DuLieuCu { get; set; } // JSON
    public string? DuLieuMoi { get; set; } // JSON
    public DateTime ThoiGian { get; set; }
    public string? IpAddress { get; set; }
}

public class TaoAuditLogDto
{
    public int? NguoiDungId { get; set; }
    public string TenBang { get; set; } = null!;
    public int? BanGhiId { get; set; }
    public string HanhDong { get; set; } = null!;
    public string? DuLieuCu { get; set; }
    public string? DuLieuMoi { get; set; }
    public DateTime? ThoiGian { get; set; }
    public string? IpAddress { get; set; }
}

public class ThongBaoHeThongDto
{
    public int ThongBaoHeThongId { get; set; }
    public string TieuDe { get; set; } = null!;
    public string? NoiDung { get; set; }
    public string? Loai { get; set; }
    public int? NguoiTao { get; set; }
    public DateTime? NgayGui { get; set; }
    public DateTime? NgayHetHan { get; set; }
}

public class ChatAiDto
{
    public int ChatId { get; set; }
    public int NguoiDungId { get; set; }
    public string CauHoi { get; set; } = null!;
    public string? TraLoi { get; set; }
    public string? ModelAI { get; set; }
    public int? SoToken { get; set; }
    public decimal? ChiPhi { get; set; }
    public DateTime? ThoiGian { get; set; }
    public sbyte? TrangThai { get; set; }

    // ← THÊM MỚI: 4 trường cho cuộc hội thoại
    public string? CuocHoiThoaiId { get; set; }   // GUID - null = tin đầu tiên, tạo mới
    public string? TieuDe { get; set; }            // Tiêu đề cuộc hội thoại
    public string VaiTro { get; set; } = "user";  // user | assistant
    public int ThuTu { get; set; } = 1;           // Thứ tự tin nhắn trong cuộc hội thoại
}

public class AiModelDto
{
    public int ModelId { get; set; }
    public string TenModel { get; set; } = null!;
    public string? MucDich { get; set; }
    public string? Provider { get; set; }
    public string? ApiUrl { get; set; }
    public string? ApiKey { get; set; }
    public sbyte? TrangThai { get; set; }
}

public class PromptTemplateDto
{
    public int PromptId { get; set; }
    public string TenPrompt { get; set; } = null!;
    public string NoiDung { get; set; } = null!;
    public string? LoaiPrompt { get; set; }
    public sbyte? TrangThai { get; set; }
}

public class OcrKetquaDto
{
    public int OcrId { get; set; }
    public int TepId { get; set; }
    public string? NoiDungOCR { get; set; }
    public string? JsonRaw { get; set; }
    public float? DoTinCay { get; set; }
    public DateTime? NgayXuLy { get; set; }
}

public class QuyenDto
{
    public int QuyenId { get; set; }
    public string TenQuyen { get; set; } = null!;
    public string? MoTa { get; set; }
}

public class PhanHoiDto
{
    public int PhanHoiId { get; set; }
    public int NguoiDungId { get; set; }
    public string? TenNguoiDung { get; set; }
    public string TieuDe { get; set; } = null!;
    public string NoiDung { get; set; } = null!;
    public sbyte? TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
    public DateTime? NgayTao { get; set; }
    public int SoCauTraLoi { get; set; }
    public int SoCauTraLoiChuaDoc { get; set; }
}

public class PhanHoiTraloiDto
{
    public int TraLoiId { get; set; }
    public int PhanHoiId { get; set; }
    public int NguoiGuiId { get; set; }
    public string? TenNguoiGui { get; set; }
    public bool LaAdmin { get; set; }
    public string NoiDung { get; set; } = null!;
    public DateTime? NgayGui { get; set; }
    public bool DaDoc { get; set; } // 0=Chưa đọc, 1=Đã đọc
}
