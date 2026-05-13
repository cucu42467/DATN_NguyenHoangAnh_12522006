using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Text.Json;
using Common;
using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BLL;

public class XacThucTokenMangXaHoi : IXacThucTokenMangXaHoi
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOptions<CauHinhOAuthMangXaHoi> _oauth;
    private readonly ILogger<XacThucTokenMangXaHoi> _logger;

    public XacThucTokenMangXaHoi(
        IHttpClientFactory httpClientFactory,
        IOptions<CauHinhOAuthMangXaHoi> oauth,
        ILogger<XacThucTokenMangXaHoi> logger)
    {
        _httpClientFactory = httpClientFactory;
        _oauth = oauth;
        _logger = logger;
    }

    public async Task<ThongTinNguoiMangXaHoi?> LayThongTinTuIdTokenAsync(
        string nhaCungCap,
        string idToken,
        CancellationToken huyBo = default)
    {
        var nc = nhaCungCap.Trim().ToUpperInvariant();
        return nc switch
        {
            "GOOGLE" => await XacThucGoogleAsync(idToken, huyBo),
            "FACEBOOK" => XacThucFacebookThoSo(idToken),
            _ => null
        };
    }

    /// <summary>
    /// Lay thong tin tu OAuth access_token bang cach goi Google UserInfo API
    /// </summary>
    public async Task<ThongTinNguoiMangXaHoi?> LayThongTinTuAccessTokenAsync(
        string accessToken,
        CancellationToken huyBo = default)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(10);

            var response = await client.GetAsync(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                huyBo);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Google UserInfo API tra ve {StatusCode}", response.StatusCode);
                return null;
            }

            var json = await response.Content.ReadFromJsonAsync<JsonElement>(huyBo);

            var sub = json.TryGetProperty("sub", out var s) ? s.GetString() : null;
            var email = json.TryGetProperty("email", out var e) ? e.GetString() : null;
            var name = json.TryGetProperty("name", out var n) ? n.GetString() : null;

            if (string.IsNullOrEmpty(sub))
            {
                _logger.LogWarning("Google UserInfo khong co truong 'sub'");
                return null;
            }

            return new ThongTinNguoiMangXaHoi
            {
                ProviderId = sub,
                Email = email ?? string.Empty,
                HoTen = string.IsNullOrWhiteSpace(name) ? (email ?? "Nguoi dung") : name
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loi khi goi Google UserInfo API");
            return null;
        }
    }

    private async Task<ThongTinNguoiMangXaHoi?> XacThucGoogleAsync(string idToken, CancellationToken huyBo)
    {
        var clientId = _oauth.Value.GoogleClientId?.Trim();
        if (!string.IsNullOrEmpty(clientId))
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(
                    idToken,
                    new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { clientId } });

                return new ThongTinNguoiMangXaHoi
                {
                    ProviderId = payload.Subject,
                    Email = payload.Email ?? string.Empty,
                    HoTen = string.IsNullOrWhiteSpace(payload.Name) ? (payload.Email ?? "Nguoi dung") : payload.Name!
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Xac thuc Google id_token that bai.");
                return null;
            }
        }

        _logger.LogWarning(
            "GoogleClientId chua cau hinh: dang giai ma JWT khong xac thuc chu ky (chi dung cho dev).");
        return GiaiMaJwtKhongXacThuc(idToken);
    }

    /// <summary>
    /// Facebook thuong tra access_token, khong phai JWT. Neu client gui JWT (OpenID), co the giai ma tho so.
    /// </summary>
    private ThongTinNguoiMangXaHoi? XacThucFacebookThoSo(string token)
    {
        var appId = _oauth.Value.FacebookAppId?.Trim();
        if (string.IsNullOrEmpty(appId))
        {
            _logger.LogWarning(
                "Facebook: nen goi Graph API /debug_token hoac dung Limited Login JWT. Tam thoi thu giai ma JWT khong xac thuc.");
        }

        return GiaiMaJwtKhongXacThuc(token);
    }

    private static ThongTinNguoiMangXaHoi? GiaiMaJwtKhongXacThuc(string jwt)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(jwt))
                return null;

            var t = handler.ReadJwtToken(jwt);
            var sub = t.Subject ?? t.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            var email = t.Claims.FirstOrDefault(c => c.Type == "email")?.Value
                        ?? t.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value;
            var name = t.Claims.FirstOrDefault(c => c.Type == "name")?.Value;

            if (string.IsNullOrEmpty(sub))
                return null;

            return new ThongTinNguoiMangXaHoi
            {
                ProviderId = sub,
                Email = email ?? string.Empty,
                HoTen = string.IsNullOrWhiteSpace(name) ? (email ?? "Nguoi dung") : name!
            };
        }
        catch
        {
            return null;
        }
    }
}
