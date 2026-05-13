using Models;

namespace DAL;

public interface ITokenDal
{
    Task<TblToken> LuuTokenAsync(TblToken token, CancellationToken huyBo = default);
    Task XoaTheoRefreshTokenAsync(string refreshToken, CancellationToken huyBo = default);
}
