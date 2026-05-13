namespace BLL;

public interface IXacThucTokenMangXaHoi
{
    Task<ThongTinNguoiMangXaHoi?> LayThongTinTuIdTokenAsync(
        string nhaCungCap,
        string idToken,
        CancellationToken huyBo = default);

    Task<ThongTinNguoiMangXaHoi?> LayThongTinTuAccessTokenAsync(
        string accessToken,
        CancellationToken huyBo = default);
}
