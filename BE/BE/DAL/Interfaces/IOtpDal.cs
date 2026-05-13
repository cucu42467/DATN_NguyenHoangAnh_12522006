using Models;

namespace DAL.Interfaces;

public interface IOtpDal
{
    Task<TblOtp?> LayTheoEmailVaLoaiAsync(string email, string loai, CancellationToken huyBo = default);
    Task<TblOtp?> LayTheoIdAsync(int otpId, CancellationToken huyBo = default);
    Task<TblOtp> TaoMoiAsync(TblOtp otp, CancellationToken huyBo = default);
    Task CapNhatAsync(TblOtp otp, CancellationToken huyBo = default);
    Task VoHieuHoaTheoEmailAsync(string email, string loai, CancellationToken huyBo = default);
}
