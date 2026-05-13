using Microsoft.EntityFrameworkCore;
using Models;
using Models.Data;

namespace DAL;

public class NguoiDungSocialDal : INguoiDungSocialDal
{
    private readonly AppDbContext _db;

    public NguoiDungSocialDal(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TblNguoidungSocial?> LayTheoNhaCungCapVaProviderIdAsync(
        string nhaCungCap,
        string providerId,
        CancellationToken huyBo = default)
    {
        return await _db.TblNguoidungSocials
            .AsNoTracking()
            .FirstOrDefaultAsync(
                s => s.Provider == nhaCungCap && s.ProviderId == providerId,
                huyBo);
    }

    public async Task<TblNguoidungSocial> ThemLienKetAsync(
        TblNguoidungSocial lienKet,
        CancellationToken huyBo = default)
    {
        // 🔥 1. Check trùng trước (QUAN TRỌNG)
        var daTonTai = await _db.TblNguoidungSocials
            .FirstOrDefaultAsync(
                s => s.Provider == lienKet.Provider &&
                     s.ProviderId == lienKet.ProviderId,
                huyBo);

        if (daTonTai != null)
        {
            return daTonTai; // đã có thì trả về luôn
        }

        // 🔥 2. KHÔNG set Id → để DB tự tăng
        // (đảm bảo bạn không gán lienKet.Id ở đâu đó)

        await _db.TblNguoidungSocials.AddAsync(lienKet, huyBo);

        try
        {
            await _db.SaveChangesAsync(huyBo);
        }
        catch (DbUpdateException ex)
        {
            // 🔥 3. Backup chống race condition (2 request cùng lúc)
            var tonTai = await _db.TblNguoidungSocials
                .FirstOrDefaultAsync(
                    s => s.Provider == lienKet.Provider &&
                         s.ProviderId == lienKet.ProviderId,
                    huyBo);

            if (tonTai != null)
                return tonTai;

            throw; // lỗi khác thì ném tiếp
        }

        return lienKet;
    }
}