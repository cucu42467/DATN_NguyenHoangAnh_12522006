using System.ComponentModel.DataAnnotations;

namespace DTO;

public class YeuCauDangNhapMangXaHoiDto
{
    /// <summary>
    /// GOOGLE hoac FACEBOOK.
    /// </summary>
    [Required]
    public string NhaCungCap { get; set; } = string.Empty;

    /// <summary>
    /// id_token tu SDK phia client (One Tap / FedCM).
    /// </summary>
    public string? IdToken { get; set; }

    /// <summary>
    /// OAuth access_token (tu OAuth popup flow).
    /// </summary>
    public string? AccessToken { get; set; }
}
