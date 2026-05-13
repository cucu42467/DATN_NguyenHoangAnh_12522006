using System;

namespace DTO;



public class ThongBaoDemDto
{
    public int TongSo { get; set; }
    public int ChuaDoc { get; set; }
}


public class ThongBaoLocDto
{
    public int? LoaiThongBao { get; set; }
    public bool? DaDoc { get; set; }
    public DateTime? TuNgay { get; set; }
    public DateTime? DenNgay { get; set; }
    public string? TuKhoa { get; set; }
    public int Trang { get; set; } = 1;
    public int TongDong { get; set; } = 20;
}

public class ThongBaoDanhSachDto
{
    public List<ThongBaoDto> DanhSach { get; set; } = new();
    public int TongSo { get; set; }
    public int TrangHienTai { get; set; }
    public int TongTrang { get; set; }
}

/// <summary>
/// Cài đặt thông báo từ JSON trong tbl_caidat
/// </summary>
public class CaiDatThongBaoDto
{
    public bool HeThong { get; set; } = true;
    public bool Email { get; set; } = false;
    public CaiDatSoDuThap? SoDuThap { get; set; }
    public CaiDatNhacLich? NhacLich { get; set; }
    public CaiDatVuotNganSach? VuotNganSach { get; set; }
    public CaiDatMucTieu? MucTieu { get; set; }
}

public class CaiDatSoDuThap
{
    public bool Bat { get; set; } = false;
    public decimal Nguong { get; set; } = 1000000; // 1 triệu
}

public class CaiDatNhacLich
{
    public bool Bat { get; set; } = false;
    public int TruocPhut { get; set; } = 60; // Nhắc trước 1 tiếng
}

public class CaiDatVuotNganSach
{
    public bool Bat { get; set; } = false;
    public int PhanTram { get; set; } = 80; // 80% ngân sách
}

public class CaiDatMucTieu
{
    public bool Bat { get; set; } = false;
    public List<int> MocPhanTram { get; set; } = new() { 25, 50, 75, 100 };
}
