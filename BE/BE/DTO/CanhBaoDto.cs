namespace DTO;

public class CanhBaoDto
{
    public int CanhBaoId { get; set; }
    public int NguoiDungId { get; set; }
    public int? LoaiCanhBao { get; set; }
    public string NoiDung { get; set; } = null!;
    public DateTime? NgayTao { get; set; }
    public bool DaDoc { get; set; }
}

public class DanhDauDaDocDto
{
    public bool DaDoc { get; set; }
}
