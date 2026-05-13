using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.Interfaces;
using Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BLL;

/// <summary>
/// BackgroundService xử lý tự động các giao dịch định kỳ
/// Chạy mỗi 1 phút, kiểm tra và tạo giao dịch khi đến hạn
/// </summary>
public class GiaoDichDinhKyBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<GiaoDichDinhKyBackgroundService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    public GiaoDichDinhKyBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<GiaoDichDinhKyBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 GiaoDichDinhKyBackgroundService started");

        // Chạy ngay lần đầu sau 10 giây
        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

        using var timer = new PeriodicTimer(_interval);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await XuLyTatCaGiaoDichDinhKyAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi nghiêm trọng trong BackgroundService");
            }

            await timer.WaitForNextTickAsync(stoppingToken);
        }

        _logger.LogInformation("👋 GiaoDichDinhKyBackgroundService stopped");
    }

    private async Task XuLyTatCaGiaoDichDinhKyAsync(CancellationToken ct)
    {
        _logger.LogDebug("⏰ Bắt đầu kiểm tra giao dịch định kỳ: {Time}", TimeHelper.NowInVietnam());

        using var scope = _scopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IGiaoDichDinhKyService>();

        try
        {
            var count = await service.XuLyTatCaAsync(ct);
            if (count > 0)
            {
                _logger.LogInformation("✅ Đã xử lý {Count} giao dịch định kỳ", count);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Lỗi khi xử lý giao dịch định kỳ");
        }
    }
}
