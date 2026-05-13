using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Interfaces;

/// <summary>
/// Interface cho service gửi email
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Gửi email OTP
    /// </summary>
    Task<bool> GuiEmailOtpAsync(string email, string otpCode, CancellationToken ct = default);

    /// <summary>
    /// Gửi email thông báo
    /// </summary>
    Task GuiThongBaoAsync(string email, string tieuDe, string noiDung);
}
