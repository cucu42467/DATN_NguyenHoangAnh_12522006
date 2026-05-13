using BLL.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BLL;

/// <summary>
/// Implementation của ICacheService - sử dụng IMemoryCache của ASP.NET Core
/// </summary>
public class CacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<CacheService> _logger;
    
    // Default expiration time
    private static readonly TimeSpan DefaultExpiration = TimeSpan.FromMinutes(10);

    public CacheService(IMemoryCache cache, ILogger<CacheService> logger)
    {
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            return await Task.FromResult(_cache.Get<T>(key));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cache key: {Key}", key);
            return default;
        }
    }

    /// <inheritdoc />
    public T? Get<T>(string key)
    {
        try
        {
            return _cache.Get<T>(key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cache key: {Key}", key);
            return default;
        }
    }

    /// <inheritdoc />
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var cacheOptions = CreateCacheEntryOptions(expiration ?? DefaultExpiration);
            _cache.Set(key, value, cacheOptions);
            await Task.CompletedTask;
            
            _logger.LogDebug("Cache SET: {Key}, Expiration: {Expiration}", key, expiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache key: {Key}", key);
        }
    }

    /// <inheritdoc />
    public void Set<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var cacheOptions = CreateCacheEntryOptions(expiration ?? DefaultExpiration);
            _cache.Set(key, value, cacheOptions);
            
            _logger.LogDebug("Cache SET: {Key}, Expiration: {Expiration}", key, expiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache key: {Key}", key);
        }
    }

    /// <inheritdoc />
    public async Task SetWithBothExpirationsAsync<T>(string key, T value, TimeSpan slidingExpiration, TimeSpan absoluteExpiration)
    {
        try
        {
            var cacheOptions = new MemoryCacheEntryOptions()
            {
                SlidingExpiration = slidingExpiration,
                AbsoluteExpirationRelativeToNow = absoluteExpiration
            };
            
            _cache.Set(key, value, cacheOptions);
            await Task.CompletedTask;
            
            _logger.LogDebug("Cache SET (both expirations): {Key}, Sliding: {Sliding}, Absolute: {Absolute}", 
                key, slidingExpiration, absoluteExpiration);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache key with both expirations: {Key}", key);
        }
    }

    /// <inheritdoc />
    public async Task RemoveAsync(string key)
    {
        try
        {
            _cache.Remove(key);
            await Task.CompletedTask;
            
            _logger.LogDebug("Cache REMOVE: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache key: {Key}", key);
        }
    }

    /// <inheritdoc />
    public void Remove(string key)
    {
        try
        {
            _cache.Remove(key);
            _logger.LogDebug("Cache REMOVE: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache key: {Key}", key);
        }
    }

    /// <inheritdoc />
    public async Task RemoveByPrefixAsync(string prefix)
    {
        try
        {
            // Note: IMemoryCache doesn't support prefix-based deletion natively
            // This would require a custom implementation or using IDistributedCache with pattern support
            // For now, log a warning - consider using IDistributedCache for this use case
            _logger.LogWarning(
                "RemoveByPrefixAsync is not fully supported with IMemoryCache. " +
                "Consider using IDistributedCache for prefix-based invalidation. Prefix: {Prefix}", 
                prefix);
            
            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache by prefix: {Prefix}", prefix);
        }
    }

    /// <inheritdoc />
    public bool Exists(string key)
    {
        try
        {
            return _cache.TryGetValue(key, out _);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking cache existence: {Key}", key);
            return false;
        }
    }

    /// <inheritdoc />
    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null)
    {
        try
        {
            // Try to get from cache first
            if (_cache.TryGetValue(key, out T? cachedValue) && cachedValue != null)
            {
                _logger.LogDebug("Cache HIT: {Key}", key);
                return cachedValue;
            }

            // Cache miss - call factory to get value
            _logger.LogDebug("Cache MISS: {Key}", key);
            var value = await factory();

            // Store in cache
            if (value != null)
            {
                await SetAsync(key, value, expiration ?? DefaultExpiration);
            }

            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetOrSetAsync for key: {Key}", key);
            // Fallback: try to get value without caching
            return await factory();
        }
    }

    /// <inheritdoc />
    public T GetOrSet<T>(string key, Func<T> factory, TimeSpan? expiration = null)
    {
        try
        {
            // Try to get from cache first
            if (_cache.TryGetValue(key, out T? cachedValue) && cachedValue != null)
            {
                _logger.LogDebug("Cache HIT: {Key}", key);
                return cachedValue;
            }

            // Cache miss - call factory to get value
            _logger.LogDebug("Cache MISS: {Key}", key);
            var value = factory();

            // Store in cache
            if (value != null)
            {
                Set(key, value, expiration ?? DefaultExpiration);
            }

            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetOrSet for key: {Key}", key);
            // Fallback: try to get value without caching
            return factory();
        }
    }

    /// <summary>
    /// Helper method to create MemoryCacheEntryOptions with standard settings
    /// </summary>
    private static MemoryCacheEntryOptions CreateCacheEntryOptions(TimeSpan expiration)
    {
        return new MemoryCacheEntryOptions
        {
            SlidingExpiration = expiration,
            Priority = CacheItemPriority.Normal,
            Size = 1
        };
    }
}

/// <summary>
/// Extension methods để register CacheService as singleton
/// </summary>
public static class CacheServiceExtensions
{
    /// <summary>
    /// Add Memory Cache services với CacheService implementation
    /// </summary>
    public static IServiceCollection AddAppMemoryCache(this IServiceCollection services)
    {
        // Register IMemoryCache (built-in ASP.NET Core)
        services.AddMemoryCache(options =>
        {
            // Configure cache size limits
            options.SizeLimit = 1024;  // Max 1024 entries
            options.CompactionPercentage = 0.05;  // Remove 5% when size limit reached
            
            // Expiration scan frequency
            options.ExpirationScanFrequency = TimeSpan.FromMinutes(1);
        });

        // Register CacheService as singleton
        services.AddSingleton<ICacheService, CacheService>();

        return services;
    }
}
