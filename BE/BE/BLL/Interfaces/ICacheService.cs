namespace BLL.Interfaces;

/// <summary>
/// Interface cho Cache Service - quản lý caching trong ứng dụng
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Lấy giá trị từ cache
    /// </summary>
    Task<T?> GetAsync<T>(string key);
    
    /// <summary>
    /// Lấy giá trị từ cache - phiên bản synchronous
    /// </summary>
    T? Get<T>(string key);
    
    /// <summary>
    /// Lưu giá trị vào cache
    /// </summary>
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    
    /// <summary>
    /// Lưu giá trị vào cache - phiên bản synchronous
    /// </summary>
    void Set<T>(string key, T value, TimeSpan? expiration = null);
    
    /// <summary>
    /// Lưu giá trị vào cache với cả sliding và absolute expiration
    /// </summary>
    Task SetWithBothExpirationsAsync<T>(string key, T value, TimeSpan slidingExpiration, TimeSpan absoluteExpiration);
    
    /// <summary>
    /// Xóa một cache entry
    /// </summary>
    Task RemoveAsync(string key);
    
    /// <summary>
    /// Xóa một cache entry - phiên bản synchronous
    /// </summary>
    void Remove(string key);
    
    /// <summary>
    /// Xóa tất cả cache entries có key bắt đầu với prefix
    /// </summary>
    Task RemoveByPrefixAsync(string prefix);
    
    /// <summary>
    /// Kiểm tra key có tồn tại trong cache không
    /// </summary>
    bool Exists(string key);
    
    /// <summary>
    /// Lấy hoặc tạo mới giá trị cache (GetOrSet pattern)
    /// </summary>
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null);
    
    /// <summary>
    /// Lấy hoặc tạo mới giá trị cache - phiên bản synchronous
    /// </summary>
    T GetOrSet<T>(string key, Func<T> factory, TimeSpan? expiration = null);
}
