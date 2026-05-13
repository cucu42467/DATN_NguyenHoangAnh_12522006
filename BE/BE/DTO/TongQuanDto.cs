using System.ComponentModel.DataAnnotations;

namespace DTO;

public class TongQuanDto
{
    public decimal TongThu { get; set; }
    public decimal TongChi { get; set; }
    public decimal SoDuThuan { get; set; }
    public int SoGiaoDich { get; set; }
    
    // Charts data
    public List<ThongKeThangDto> BieuDoChiTieu { get; set; } = new();
    public List<ThongKeDanhMucDto> BieuDoDanhMuc { get; set; } = new();
    
    // Ngân sách và Mục tiêu cho TrangChu
    public List<NganSachTomTatDto> DanhSachNganSach { get; set; } = new();
    public List<MucTieuTomTatDto> DanhSachMucTieu { get; set; } = new();
}

public class NganSachTomTatDto
{
    public int NganSachId { get; set; }
    public string TenDanhMuc { get; set; } = null!;
    public decimal HanMuc { get; set; }
    public decimal DaDung { get; set; }
    public string? MauSac { get; set; }
}

public class MucTieuTomTatDto
{
    public int MucTieuId { get; set; }
    public string TenMucTieu { get; set; } = null!;
    public decimal SoTienMucTieu { get; set; }
    public decimal SoTienHienTai { get; set; }
    public string? MauSac { get; set; }
}

public class ThongKeThangDto
{
    public int Thang { get; set; }
    public int Nam { get; set; }
    public decimal TongChi { get; set; }
    public decimal TongThu { get; set; }
}

public class ThongKeDanhMucDto
{
    public string TenDanhMuc { get; set; } = null!;
    public string MauSac { get; set; } = null!;
    public decimal TongTien { get; set; }
}

