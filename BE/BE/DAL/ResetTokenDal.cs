using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using DAL.Interfaces;

namespace DAL;

public class ResetTokenDal : IResetTokenDal
{
    private readonly AppDbContext _db;

    public ResetTokenDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TblResetToken?> LayTheoTokenAsync(string token, CancellationToken huyBo = default)
    {
        return await _db.TblResetTokens
            .Where(r => r.ResetToken == token && !r.DaSuDung)
            .FirstOrDefaultAsync(huyBo);
    }

    public async Task<TblResetToken> TaoMoiAsync(TblResetToken resetToken, CancellationToken huyBo = default)
    {
        _db.TblResetTokens.Add(resetToken);
        await _db.SaveChangesAsync(huyBo);
        return resetToken;
    }

    public async Task CapNhatAsync(TblResetToken resetToken, CancellationToken huyBo = default)
    {
        _db.TblResetTokens.Update(resetToken);
        await _db.SaveChangesAsync(huyBo);
    }

    public async Task VoHieuHoaTheoEmailAsync(string email, CancellationToken huyBo = default)
    {
        var tokens = await _db.TblResetTokens
            .Where(r => r.Email == email && !r.DaSuDung)
            .ToListAsync(huyBo);

        foreach (var token in tokens)
        {
            token.DaSuDung = true;
        }

        await _db.SaveChangesAsync(huyBo);
    }

    public async Task VoHieuHoaTheoNguoiDungIdAsync(int nguoiDungId, CancellationToken huyBo = default)
    {
        var tokens = await _db.TblResetTokens
            .Where(r => r.NguoiDungId == nguoiDungId && !r.DaSuDung)
            .ToListAsync(huyBo);

        foreach (var token in tokens)
        {
            token.DaSuDung = true;
        }

        await _db.SaveChangesAsync(huyBo);
    }
}
