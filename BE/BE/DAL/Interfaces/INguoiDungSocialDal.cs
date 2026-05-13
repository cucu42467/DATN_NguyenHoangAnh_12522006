using Models;

namespace DAL;

public interface INguoiDungSocialDal
{
    Task<TblNguoidungSocial?> LayTheoNhaCungCapVaProviderIdAsync(
        string nhaCungCap,
        string providerId,
        CancellationToken huyBo = default);

    Task<TblNguoidungSocial> ThemLienKetAsync(TblNguoidungSocial lienKet, CancellationToken huyBo = default);
}
