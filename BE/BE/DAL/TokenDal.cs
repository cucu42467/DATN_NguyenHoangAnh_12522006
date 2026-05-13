using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class TokenDal : ITokenDal
{
    private readonly AppDbContext _db;

    public TokenDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TblToken> LuuTokenAsync(TblToken token, CancellationToken huyBo = default)
    {
        _db.TblTokens.Add(token);
        await _db.SaveChangesAsync(huyBo);
        return token;
    }

    public async Task XoaTheoRefreshTokenAsync(string refreshToken, CancellationToken huyBo = default)
    {
        var token = await _db.TblTokens
            .FirstOrDefaultAsync(t => t.RefreshToken == refreshToken, huyBo);

        if (token != null)
        {
            _db.TblTokens.Remove(token);
            await _db.SaveChangesAsync(huyBo);
        }
    }
}