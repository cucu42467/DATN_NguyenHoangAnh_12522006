using DTO;

namespace BLL.Interfaces;

public interface IDichVuJwt
{
    string TaoAccessToken(NguoiDungDto nguoiDung, DateTime hetHanUtc);

    string TaoRefreshToken();

    DateTime TinhHetHanAccessUtc();

    DateTime TinhHetHanRefreshUtc();
}
