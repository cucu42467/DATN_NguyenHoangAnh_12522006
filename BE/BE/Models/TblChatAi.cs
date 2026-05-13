using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public partial class TblChatAi
{
    [Key]
    public int ChatId { get; set; }

    public int NguoiDungId { get; set; }

    public string CauHoi { get; set; } = null!;

    public string? TraLoi { get; set; }

    public string? ModelAI { get; set; }

    public int? SoToken { get; set; }

    public decimal? ChiPhi { get; set; }

    public DateTime? ThoiGian { get; set; }

    public string? CuocHoiThoaiId { get; set; }   // ← THÊM MỚI: ID cuộc hội thoại (GUID)
    public string? TieuDe { get; set; }            // ← THÊM MỚI: tiêu đề cuộc hội thoại
    public string VaiTro { get; set; } = "user";   // ← THÊM MỚI: user | assistant
    public int ThuTu { get; set; } = 1;             // ← THÊM MỚI: thứ tự tin nhắn trong cuộc hội thoại

    public sbyte? TrangThai { get; set; }

    [ForeignKey("NguoiDungId")]
    public virtual TblNguoidung NguoiDung { get; set; } = null!;
}
