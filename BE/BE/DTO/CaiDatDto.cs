namespace DTO;

public class CaiDatDto
{
    public int CaiDatId { get; set; }
    public int NguoiDungId { get; set; }
    public string? NgonNgu { get; set; }
    public string? TienTe { get; set; }
    public bool CheDoToi { get; set; }
    public string? DinhDangNgay { get; set; }
    public bool NhanThongBao { get; set; }
    public string? ThongBaoJson { get; set; }
}

public class TaoCaiDatDto
{
    public string? NgonNgu { get; set; }
    public string? TienTe { get; set; }
    public bool CheDoToi { get; set; }
    public string? DinhDangNgay { get; set; }
    public bool NhanThongBao { get; set; }
    public string? ThongBaoJson { get; set; }
}

/* DTO riêng cho cài đặt thông báo chi tiết */
public class ThongBaoSettingsDto
{
    // Kênh nhận thông báo
    public bool NhanQuaApp { get; set; } = true;
    public bool NhanQuaEmail { get; set; } = false;
    public bool NhanQuaPush { get; set; } = true;

    // Loại thông báo
    public bool ThongBaoVuotNganSach { get; set; } = true;
    public bool ThongBaoSoDuThap { get; set; } = true;
    public bool ThongBaoGiaoDich { get; set; } = false;
    public bool ThongBaoNhacNho { get; set; } = true;
    public bool ThongBaoMucTieu { get; set; } = true;
    public bool ThongBaoAi { get; set; } = true;

    // Cài đặt nâng cao
    public bool ChiCanhBaoQuanTrong { get; set; } = false;
    public int NguongVuotNganSach { get; set; } = 80;
    public long NguongSoDuThap { get; set; } = 1000000;
}
