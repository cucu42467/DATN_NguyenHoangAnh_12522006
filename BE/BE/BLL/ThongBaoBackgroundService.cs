using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BLL;

/// <summary>
/// BackgroundService xử lý thông báo tự động
/// Chạy mỗi 1 phút: kiểm tra số dư thấp, nhắc lịch, vượt ngân sách, mục tiêu
/// </summary>
public class ThongBaoBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ThongBaoBackgroundService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    public ThongBaoBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<ThongBaoBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🔔 ThongBaoBackgroundService started - Xử lý thông báo tự động");

        // Chạy ngay lần đầu sau 30 giây (đợi app khởi động xong)
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

        using var timer = new PeriodicTimer(_interval);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await XuLyThongBaoTuDongAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi nghiêm trọng trong ThongBaoBackgroundService");
            }

            await timer.WaitForNextTickAsync(stoppingToken);
        }

        _logger.LogInformation("👋 ThongBaoBackgroundService stopped");
    }

    private async Task XuLyThongBaoTuDongAsync(CancellationToken ct)
    {
        _logger.LogDebug("⏰ [{Time}] Bắt đầu kiểm tra thông báo tự động", 
            DateTime.Now.ToString("HH:mm:ss"));

        using var scope = _scopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IThongBaoService>();

        try
        {
            await service.XuLyThongBaoTuDongAsync();
            _logger.LogDebug("✅ Hoàn thành kiểm tra thông báo tự động");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Lỗi khi xử lý thông báo tự động");
        }
    }
}
