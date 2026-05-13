using Models;

namespace DAL.Interfaces;

public interface IResetTokenDal
{
    Task<TblResetToken?> LayTheoTokenAsync(string token, CancellationToken huyBo = default);
    Task<TblResetToken> TaoMoiAsync(TblResetToken resetToken, CancellationToken huyBo = default);
    Task CapNhatAsync(TblResetToken resetToken, CancellationToken huyBo = default);
    Task VoHieuHoaTheoEmailAsync(string email, CancellationToken huyBo = default);
    Task VoHieuHoaTheoNguoiDungIdAsync(int nguoiDungId, CancellationToken huyBo = default);
}
