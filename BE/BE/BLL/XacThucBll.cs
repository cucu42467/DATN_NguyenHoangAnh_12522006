using Common;
using DAL;
using DTO;
using Models;
using BLL.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using DAL.Interfaces;

namespace BLL;

public class XacThucBll : IXacThucBll
{
    public const int VaiTroNguoiDungMacDinh = 2;
    private const int OTP_VALID_MINUTES = 5;
    private const int MAX_OTP_ATTEMPTS = 5;

    private readonly INguoiDungDal _nguoiDungDal;
    private readonly INguoiDungSocialDal _socialDal;
    private readonly INguoiDungVaitroDal _vaiTroDal;
    private readonly ITokenDal _tokenDal;
    private readonly ILichsuDangnhapDal _lichsuDal;
    private readonly IDichVuJwt _jwt;
    private readonly IXacThucTokenMangXaHoi _oauth;
    private readonly IOtpDal _otpDal;
    private readonly IResetTokenDal _resetTokenDal;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;
    private readonly Random _random = new();

    public XacThucBll(
        INguoiDungDal nguoiDungDal,
        INguoiDungSocialDal socialDal,
        INguoiDungVaitroDal vaiTroDal,
        ITokenDal tokenDal,
        ILichsuDangnhapDal lichsuDal,
        IDichVuJwt jwt,
        IXacThucTokenMangXaHoi oauth,
        IOtpDal otpDal,
        IResetTokenDal resetTokenDal,
        IEmailService emailService,
        IConfiguration configuration)
    {
        _nguoiDungDal = nguoiDungDal;
        _socialDal = socialDal;
        _vaiTroDal = vaiTroDal;
        _tokenDal = tokenDal;
        _lichsuDal = lichsuDal;
        _jwt = jwt;
        _oauth = oauth;
        _otpDal = otpDal;
        _resetTokenDal = resetTokenDal;
        _emailService = emailService;
        _configuration = configuration;
    }

    public async Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangKyDto? DuLieu)> DangKyAsync(
        YeuCauDangKyDto yeuCau,
        string? diaChiIp,
        string? thietBi,
        string? heDieuHanh = null,
        string? viTri = null,
        CancellationToken huyBo = default)
    {
        try
        {
            var nd = await _nguoiDungDal.DangKyNguoiDungAsync(yeuCau, huyBo);

            await _vaiTroDal.GanVaiTroAsync(nd.NguoiDungId, VaiTroNguoiDungMacDinh, huyBo);

            nd = await _nguoiDungDal.LayTheoIdAsync(nd.NguoiDungId, huyBo);
            if (nd == null)
                return (false, "Lỗi tạo tài khoản.", null);

            await GhiLichsuAsync(nd.NguoiDungId, diaChiIp, thietBi, heDieuHanh, viTri, ketQua: 1, huyBo);
            var phien = await HoanThanhDangNhapAsync(nd, huyBo);

            return (true, "Đăng ký thành công!", new PhanHoiDangKyDto
            {
                ThanhCong = true,
                PhienDangNhap = phien,
                NguoiDung = phien.NguoiDung
            });
        }
        catch (InvalidOperationException ex)
        {
            return (false, ex.Message, null);
        }
        catch
        {
            return (false, "Lỗi hệ thống khi đăng ký.", null);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> DangNhapAsync(
    YeuCauDangNhapDto yeuCau,
    string? diaChiIp,
    string? thietBi,
    string? heDieuHanh = null,
    string? viTri = null,
    CancellationToken huyBo = default)
    {
        try
        {
            // 1. LẤY USER CHO LOGIN (CÓ MAT KHAU)
            var nd = await _nguoiDungDal.LayDangNhapAsync(yeuCau.TenDangNhap, huyBo);

            if (nd == null)
                return (false, "Ten dang nhap hoac mat khau khong dung.", null);

            // 2. CHECK TRANG THAI
            if (nd.TrangThai is not null && nd.TrangThai != 1)
                return (false, "Tai khoan da bi khoa hoac khong hoat dong.", null);

            // 3. CHECK MAT KHAU NULL
            if (string.IsNullOrEmpty(nd.MatKhau))
                return (false, "Tai khoan chua dat mat khau. Hay dang nhap bang mang xa hoi.", null);

            // 4. VERIFY PASSWORD
            bool hopLe;
            try
            {
                hopLe = BCrypt.Net.BCrypt.Verify(yeuCau.MatKhau, nd.MatKhau);
            }
            catch
            {
                hopLe = false;
            }

            if (!hopLe)
            {
                await GhiLichsuAsync(nd.NguoiDungId, diaChiIp, thietBi, heDieuHanh, viTri, ketQua: 0, huyBo);
                return (false, "Ten dang nhap hoac mat khau khong dung.", null);
            }

            // 5. LOG SUCCESS
            await GhiLichsuAsync(nd.NguoiDungId, diaChiIp, thietBi, heDieuHanh, viTri, ketQua: 1, huyBo);

            // 6. LẤY FULL DTO CHO RESPONSE
            var fullUser = await _nguoiDungDal.LayTheoIdAsync(nd.NguoiDungId, huyBo);

            var phanHoi = await HoanThanhDangNhapAsync(fullUser!, huyBo);

            return (true, null, phanHoi);
        }
        catch (Exception ex)
        {
            return (false, $"Lỗi hệ thống khi đăng nhập: {ex.Message}", null);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> DangNhapMangXaHoiAsync(
        YeuCauDangNhapMangXaHoiDto yeuCau,
        string? diaChiIp,
        string? thietBi,
        string? heDieuHanh = null,
        string? viTri = null,
        CancellationToken huyBo = default)
    {
        try
        {
            var nc = yeuCau.NhaCungCap.Trim().ToUpperInvariant();
            if (nc is not ("GOOGLE" or "FACEBOOK"))
                return (false, "Nha cung cap khong hop le (GOOGLE hoac FACEBOOK).", null);

            ThongTinNguoiMangXaHoi? thongTin = null;

            // Thử access_token trước (OAuth popup flow)
            if (!string.IsNullOrEmpty(yeuCau.AccessToken) && nc == "GOOGLE")
            {
                thongTin = await _oauth.LayThongTinTuAccessTokenAsync(yeuCau.AccessToken, huyBo);
            }

            // Thử id_token nếu access_token không hoạt động (One Tap / FedCM)
            if (thongTin == null && !string.IsNullOrEmpty(yeuCau.IdToken))
            {
                thongTin = await _oauth.LayThongTinTuIdTokenAsync(nc, yeuCau.IdToken, huyBo);
            }

            if (thongTin == null || string.IsNullOrEmpty(thongTin.ProviderId))
                return (false, "Khong xac thuc duoc token tu nha cung cap.", null);

            var lienKet = await _socialDal.LayTheoNhaCungCapVaProviderIdAsync(nc, thongTin.ProviderId, huyBo);
            NguoiDungDto? nd;

            if (lienKet != null)
            {
                nd = await _nguoiDungDal.LayTheoIdAsync(lienKet.NguoiDungId, huyBo);
                if (nd == null)
                    return (false, "Nguoi dung lien ket khong ton tai.", null);
            }
            else
            {
                var email = string.IsNullOrWhiteSpace(thongTin.Email)
                    ? $"{thongTin.ProviderId}@{nc.ToLowerInvariant()}.local"
                    : thongTin.Email.Trim();

                nd = await _nguoiDungDal.LayTheoEmailAsync(email, huyBo);
                if (nd == null)
                {
                    var moi = new NguoiDungDto
                    {
                        HoTen = string.IsNullOrWhiteSpace(thongTin.HoTen) ? email : thongTin.HoTen.Trim(),
                        Email = email,
                        MatKhau = null,
                        NgayTao = TimeHelper.NowInVietnam(),
                        TrangThai = 1
                    };
                    nd = await _nguoiDungDal.ThemMoiAsync(moi, huyBo);
                    await _vaiTroDal.GanVaiTroAsync(nd.NguoiDungId, VaiTroNguoiDungMacDinh, huyBo);
                    nd = await _nguoiDungDal.LayTheoIdAsync(nd.NguoiDungId, huyBo);
                }

                if (nd == null)
                    return (false, "Khong tao duoc nguoi dung.", null);

                await _socialDal.ThemLienKetAsync(
                    new TblNguoidungSocial
                    {
                        NguoiDungId = nd.NguoiDungId,
                        Provider = nc,
                        ProviderId = thongTin.ProviderId,
                        EmailSocial = string.IsNullOrWhiteSpace(thongTin.Email) ? null : thongTin.Email.Trim(),
                        NgayLienKet = TimeHelper.NowInVietnam()
                    },
                    huyBo);
            }

            if (nd.TrangThai is not null && nd.TrangThai != 1)
                return (false, "Tai khoan da bi khoa hoac khong hoat dong.", null);

            await GhiLichsuAsync(nd.NguoiDungId, diaChiIp, thietBi, heDieuHanh, viTri, ketQua: 1, huyBo);
            var phanHoi = await HoanThanhDangNhapAsync(nd, huyBo);
            return (true, null, phanHoi);
        }
        catch (Exception ex)
        {
            return (false, $"Lỗi hệ thống khi đăng nhập mạng xã hội: {ex.Message}", null);
        }
    }

    private async Task GhiLichsuAsync(
        int nguoiDungId,
        string? ip,
        string? thietBi,
        string? heDieuHanh,
        string? viTri,
        sbyte ketQua,
        CancellationToken huyBo)
    {
        await _lichsuDal.GhiLaiAsync(
            new TblLichsuDangnhap
            {
                NguoiDungId = nguoiDungId,
                ThoiGian = TimeHelper.NowInVietnam(),
                IpAddress = ip,
                ThietBi = thietBi,
                HeDieuHanh = heDieuHanh,
                ViTri = viTri,
                KetQua = ketQua
            },
            huyBo);
    }

    private async Task<PhanHoiDangNhapDto> HoanThanhDangNhapAsync(NguoiDungDto nd, CancellationToken huyBo)
    {
        var hetHanAccess = _jwt.TinhHetHanAccessUtc();
        var hetHanRefresh = _jwt.TinhHetHanRefreshUtc();
        var access = _jwt.TaoAccessToken(nd, hetHanAccess);
        var refresh = _jwt.TaoRefreshToken();

        await _tokenDal.LuuTokenAsync(
            new TblToken
            {
                NguoiDungId = nd.NguoiDungId,
                AccessToken = access,
                RefreshToken = refresh,
                NgayTao = TimeHelper.NowInVietnam(),
                NgayHetHan = hetHanRefresh
            },
            huyBo);

        return new PhanHoiDangNhapDto
        {
            AccessToken = access,
            RefreshToken = refresh,
            HetHanAccessUtc = hetHanAccess,
            HetHanRefreshUtc = hetHanRefresh,
            NguoiDung = MapNguoiDung(nd)
        };
    }

    private static NguoiDungTomTatDto MapNguoiDung(NguoiDungDto nd)
    {
        return new NguoiDungTomTatDto
        {
            NguoiDungId = nd.NguoiDungId,
            HoTen = nd.HoTen,
            Email = nd.Email,
            SoDienThoai = nd.SoDienThoai,
            AnhDaiDien = nd.AnhDaiDien,
            VaiTro = nd.VaiTro
        };
    }

    public async Task<bool> KhoaTaiKhoanAsync(int nguoiDungId, bool khoa, CancellationToken huyBo = default)
    {
        var trangThai = (sbyte)(khoa ? 0 : 1);
        return await _nguoiDungDal.CapNhatTrangThaiAsync(nguoiDungId, trangThai, huyBo);
    }

    public async Task<(bool ThanhCong, string? ThongDiep, PhanHoiDangNhapDto? DuLieu)> LamMoiTokenAsync(
        string refreshToken,
        CancellationToken ct = default)
    {
        try
        {
            return (false, "Not implemented yet", null);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi làm mới token: {ex.Message}", ex);
        }
    }

    public async Task DangXuatAsync(string refreshToken, CancellationToken ct = default)
    {
        try
        {
            await _tokenDal.XoaTheoRefreshTokenAsync(refreshToken, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đăng xuất: {ex.Message}", ex);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep)> QuenMatKhauEmailAsync(
        string email,
        CancellationToken ct = default)
    {
        try
        {
            return await GuiOtpEmailAsync(email, ct);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi gửi email quên mật khẩu: {ex.Message}", ex);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep)> GuiOtpEmailAsync(
        string email,
        CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            {
                return (false, "Email khong hop le.");
            }

            var nguoiDung = await _nguoiDungDal.LayTheoEmailAsync(email, ct);
            if (nguoiDung == null)
            {
                return (true, "Neu email ton tai, ma xac thuc se duoc gui.");
            }

            await _otpDal.VoHieuHoaTheoEmailAsync(email, "EMAIL", ct);

            var otpCode = _random.Next(100000, 999999).ToString();
            var now = DateTime.UtcNow;
            var expiryMinutes = OTP_VALID_MINUTES;

            var otp = new TblOtp
            {
                Email = email,
                OtpCode = otpCode,
                Loai = "EMAIL",
                NgayTao = now,
                NgayHetHan = now.AddMinutes(expiryMinutes),
                SoLanSai = 0,
                DaSuDung = false
            };

            await _otpDal.TaoMoiAsync(otp, ct);

            var guiThanhCong = await _emailService.GuiEmailOtpAsync(email, otpCode, ct);
            if (!guiThanhCong)
            {
                return (false, "Khong the gui email. Vui long thu lai sau.");
            }

            return (true, "Ma xac thuc da duoc gui toi email cua ban.");
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi gửi OTP email: {ex.Message}", ex);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep, string? phienId)> QuenMatKhauSdtAsync(
        string sdt,
        CancellationToken ct = default)
    {
        try
        {
            return (false, "Chuc nang gui OTP qua SMS chua duoc ho tro.", null);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi gửi SMS quên mật khẩu: {ex.Message}", ex);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep, string? resetToken)> XacThucOtpAsync(
        string email,
        string otp,
        CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(otp))
            {
                return (false, "Email va ma OTP la bat buoc.", null);
            }

            if (otp.Length != 6)
            {
                return (false, "Ma OTP phai co 6 ky tu.", null);
            }

            var otpRecord = await _otpDal.LayTheoEmailVaLoaiAsync(email, "EMAIL", ct);
            if (otpRecord == null)
            {
                return (false, "Khong tim thay ma xac thuc. Vui long yeu cau gui lai.", null);
            }

            if (DateTime.UtcNow > otpRecord.NgayHetHan)
            {
                return (false, "Ma xac thuc da het han. Vui long yeu cau gui lai.", null);
            }

            if (otpRecord.DaSuDung)
            {
                return (false, "Ma xac thuc da duoc su dung.", null);
            }

            if (otpRecord.SoLanSai >= MAX_OTP_ATTEMPTS)
            {
                otpRecord.DaSuDung = true;
                await _otpDal.CapNhatAsync(otpRecord, ct);
                return (false, "Ban da nhap sai qua nhieu lan. Vui long yeu cau gui lai ma moi.", null);
            }

            if (otpRecord.OtpCode != otp)
            {
                otpRecord.SoLanSai++;
                await _otpDal.CapNhatAsync(otpRecord, ct);
                var remaining = MAX_OTP_ATTEMPTS - otpRecord.SoLanSai;
                return (false, $"Ma xac thuc khong dung. Ban con {remaining} lan thu.", null);
            }

            otpRecord.DaSuDung = true;
            await _otpDal.CapNhatAsync(otpRecord, ct);

            var nguoiDung = await _nguoiDungDal.LayTheoEmailAsync(email, ct);
            if (nguoiDung == null)
            {
                return (false, "Khong tim thay tai khoan.", null);
            }

            await _resetTokenDal.VoHieuHoaTheoEmailAsync(email, ct);

            var resetTokenValue = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            var resetExpiry = DateTime.UtcNow.AddMinutes(30);

            var resetToken = new TblResetToken
            {
                Email = email,
                ResetToken = resetTokenValue,
                NguoiDungId = nguoiDung.NguoiDungId,
                NgayTao = TimeHelper.NowInVietnam(),
                NgayHetHan = resetExpiry,
                DaSuDung = false
            };

            await _resetTokenDal.TaoMoiAsync(resetToken, ct);

            return (true, "Xac thuc thanh cong. Vui long dat lai mat khau.", resetTokenValue);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi xác thực OTP: {ex.Message}", ex);
        }
    }

    public async Task<(bool ThanhCong, string? ThongDiep)> DatLaiMatKhauAsync(
        string email,
        string resetToken,
        string matKhauMoi,
        CancellationToken ct = default)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return (false, "Email la bat buoc.");
            }

            if (string.IsNullOrWhiteSpace(resetToken))
            {
                return (false, "Token reset la bat buoc.");
            }

            if (string.IsNullOrWhiteSpace(matKhauMoi) || matKhauMoi.Length < 6)
            {
                return (false, "Mat khau moi phai it nhat 6 ky tu.");
            }

            var tokenRecord = await _resetTokenDal.LayTheoTokenAsync(resetToken, ct);
            if (tokenRecord == null)
            {
                return (false, "Token reset khong hop le hoac da het han.");
            }

            if (DateTime.UtcNow > tokenRecord.NgayHetHan)
            {
                return (false, "Token reset da het han. Vui long yeu cau dat lai mat khau.");
            }

            if (tokenRecord.DaSuDung)
            {
                return (false, "Token reset da duoc su dung.");
            }

            if (tokenRecord.Email != email)
            {
                return (false, "Email khong khop voi token.");
            }

            var nguoiDung = await _nguoiDungDal.LayTheoIdAsync(tokenRecord.NguoiDungId, ct);
            if (nguoiDung == null)
            {
                return (false, "Khong tim thay tai khoan.");
            }

            await _nguoiDungDal.CapNhatMatKhauAsync(nguoiDung.NguoiDungId, matKhauMoi, ct);

            tokenRecord.DaSuDung = true;
            await _resetTokenDal.CapNhatAsync(tokenRecord, ct);

            return (true, "Dat lai mat khau thanh cong. Ban co the dang nhap ngay.");
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Lỗi khi đặt lại mật khẩu: {ex.Message}", ex);
        }
    }

    public async Task GuiEmailDatLaiMatKhauAsync(string email, CancellationToken ct = default)
    {
        // Tạo reset token
        var nguoiDung = await _nguoiDungDal.LayTheoEmailAsync(email, ct);
        if (nguoiDung == null) return;

        var resetTokenValue = Guid.NewGuid().ToString("N");
        var resetToken = new TblResetToken
        {
            Email = email,
            ResetToken = resetTokenValue,
            NguoiDungId = nguoiDung.NguoiDungId,
            NgayTao = TimeHelper.NowInVietnam(),
            NgayHetHan = TimeHelper.NowInVietnam().AddHours(24),
            DaSuDung = false
        };

        await _resetTokenDal.TaoMoiAsync(resetToken, ct);

        // Gửi email với link reset
        var resetLink = $"https://example.com/reset-password?token={resetTokenValue}&email={Uri.EscapeDataString(email)}";
        await _emailService.GuiEmailOtpAsync(email, resetLink, ct);
    }
}
