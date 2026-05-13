using System.Net;
using System.Net.Mail;
using BLL.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BLL;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> GuiEmailOtpAsync(string email, string otpCode, CancellationToken ct = default)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:SmtpUsername"];
            var smtpPassword = _configuration["Email:SmtpPassword"];
            var fromEmail = _configuration["Email:FromEmail"];
            var fromName = _configuration["Email:FromName"] ?? "App Quan Ly Chi Tieu";
            var useSsl = bool.Parse(_configuration["Email:UseSsl"] ?? "true");

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(fromEmail))
            {
                _logger.LogWarning("Email service chua duoc cau hinh day du. OTP code: {OtpCode}", otpCode);
                
                // Trong moi truong dev, log ra console de test
                Console.WriteLine($"===== OTP CODE FOR {email} =====");
                Console.WriteLine($"Ma xac thuc: {otpCode}");
                Console.WriteLine($"Het han sau 5 phut");
                Console.WriteLine($"=================================");
                
                return true; // Tra ve true de tranh loi trong dev
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = useSsl,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword)
            };

            var subject = "Ma xac thuc dat lai mat khau";
            var body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 24px;'>Dat Lai Mat Khau</h1>
    </div>
    <div style='background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;'>
        <p style='color: #333; font-size: 16px;'>Xin chao,</p>
        <p style='color: #333; font-size: 16px;'>Ban yeu cau dat lai mat khau cho tai khoan. Vui long su dung ma xac thuc ben duoi:</p>
        <div style='background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;'>
            <span style='font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea;'>{otpCode}</span>
        </div>
        <p style='color: #666; font-size: 14px;'>Ma xac thuc nay co hieu luc trong <strong>5 phut</strong>.</p>
        <p style='color: #666; font-size: 14px;'>Neu ban khong yeu cau dat lai mat khau, vui long bo qua email nay.</p>
        <hr style='border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;'>
        <p style='color: #999; font-size: 12px; text-align: center;'>Email nay duoc gui tu {fromName}</p>
    </div>
</div>";

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(email);

            await client.SendMailAsync(message, ct);
            _logger.LogInformation("Da gui email OTP den {Email}", email);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loi khi gui email OTP den {Email}", email);
            return false;
        }
    }

    /// <summary>
    /// Gửi email thông báo cho người dùng
    /// </summary>
    public async Task GuiThongBaoAsync(string email, string tieuDe, string noiDung)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:SmtpUsername"];
            var smtpPassword = _configuration["Email:SmtpPassword"];
            var fromEmail = _configuration["Email:FromEmail"];
            var fromName = _configuration["Email:FromName"] ?? "App Quan Ly Chi Tieu";
            var useSsl = bool.Parse(_configuration["Email:UseSsl"] ?? "true");

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(fromEmail))
            {
                _logger.LogWarning("Email service chua duoc cau hinh. Thong bao: {TieuDe}", tieuDe);
                Console.WriteLine($"===== THONG BAO EMAIL (DEV) =====");
                Console.WriteLine($"Den: {email}");
                Console.WriteLine($"Tieu de: {tieuDe}");
                Console.WriteLine($"Noi dung: {noiDung}");
                Console.WriteLine($"==================================");
                return;
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = useSsl,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword)
            };

            var body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 24px;'>🔔 Thong Bao Tu App</h1>
    </div>
    <div style='background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;'>
        <h2 style='color: #333; font-size: 20px; margin-top: 0;'>{tieuDe}</h2>
        <div style='background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;'>
            <p style='color: #333; font-size: 16px; margin: 0;'>{noiDung}</p>
        </div>
        <p style='color: #666; font-size: 14px;'>Vui long dang nhap vao ung dung de xem chi tiet.</p>
        <hr style='border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;'>
        <p style='color: #999; font-size: 12px; text-align: center;'>Email nay duoc gui tu {fromName}</p>
    </div>
</div>";

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = $"[Thong Bao] {tieuDe}",
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(email);

            await client.SendMailAsync(message);
            _logger.LogInformation("Da gui email thong bao den {Email}: {TieuDe}", email, tieuDe);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loi khi gui email thong bao den {Email}", email);
        }
    }
}
