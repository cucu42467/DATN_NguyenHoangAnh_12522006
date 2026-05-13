using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BLL.Interfaces;
using Common;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using DTO;


namespace BLL;

public class DichVuJwt : IDichVuJwt
{
    private readonly CauHinhJwt _cfg;
    private readonly JwtSecurityTokenHandler _handler = new();

    public DichVuJwt(IOptions<CauHinhJwt> cfg)
    {
        _cfg = cfg.Value;
    }

    public string TaoAccessToken(NguoiDungDto nguoiDung, DateTime hetHanUtc)
    {
        var secret = _cfg.KhoaBiMat ?? throw new InvalidOperationException("Jwt.KhoaBiMat is not configured.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, nguoiDung.NguoiDungId.ToString()),
            new(JwtRegisteredClaimNames.Email, nguoiDung.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var r in nguoiDung.VaiTro)
            claims.Add(new Claim(ClaimTypes.Role, r));


        var token = new JwtSecurityToken(
            issuer: _cfg.PhatHanh,
            audience: string.IsNullOrWhiteSpace(_cfg.KhanGia) ? null : _cfg.KhanGia,
            claims: claims,
            notBefore: DateTime.UtcNow.AddSeconds(-30),
            expires: hetHanUtc,
            signingCredentials: creds);

        return _handler.WriteToken(token);
    }

    public string TaoRefreshToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes);
    }

    public DateTime TinhHetHanAccessUtc() => DateTime.UtcNow.AddMinutes(Math.Max(1, _cfg.ThoiGianHetHanPhut));

    public DateTime TinhHetHanRefreshUtc() =>
        DateTime.UtcNow.AddDays(Math.Max(1, _cfg.ThoiGianHetHanRefreshNgay));
}
