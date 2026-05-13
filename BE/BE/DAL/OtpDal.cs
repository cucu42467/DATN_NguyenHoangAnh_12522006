using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;
using DAL.Interfaces;

namespace DAL;

public class OtpDal : IOtpDal
{
    private readonly AppDbContext _db;

    public OtpDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TblOtp?> LayTheoEmailVaLoaiAsync(string email, string loai, CancellationToken huyBo = default)
    {
        return await _db.TblOtps
            .Where(o => o.Email == email && o.Loai == loai && !o.DaSuDung)
            .OrderByDescending(o => o.NgayTao)
            .FirstOrDefaultAsync(huyBo);
    }

    public async Task<TblOtp?> LayTheoIdAsync(int otpId, CancellationToken huyBo = default)
    {
        return await _db.TblOtps.FindAsync(new object[] { otpId }, huyBo);
    }

    public async Task<TblOtp> TaoMoiAsync(TblOtp otp, CancellationToken huyBo = default)
    {
        _db.TblOtps.Add(otp);
        await _db.SaveChangesAsync(huyBo);
        return otp;
    }

    public async Task CapNhatAsync(TblOtp otp, CancellationToken huyBo = default)
    {
        _db.TblOtps.Update(otp);
        await _db.SaveChangesAsync(huyBo);
    }

    public async Task VoHieuHoaTheoEmailAsync(string email, string loai, CancellationToken huyBo = default)
    {
        var otps = await _db.TblOtps
            .Where(o => o.Email == email && o.Loai == loai && !o.DaSuDung)
            .ToListAsync(huyBo);

        foreach (var otp in otps)
        {
            otp.DaSuDung = true;
        }

        await _db.SaveChangesAsync(huyBo);
    }
}
