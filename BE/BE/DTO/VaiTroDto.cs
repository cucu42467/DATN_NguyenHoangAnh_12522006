namespace DTO;

public class VaiTroDto
{
    public int VaiTroId { get; set; }
    public string TenVaiTro { get; set; } = null!;
    public string? MoTa { get; set; }
}

public class TaoVaiTroDto
{
    public string TenVaiTro { get; set; } = null!;
    public string? MoTa { get; set; }
}
