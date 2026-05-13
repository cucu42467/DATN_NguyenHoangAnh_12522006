using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Common;

/// <summary>
/// Cấu hình thời gian cache cho các loại dữ liệu khác nhau
/// </summary>
public class CacheExpirationOptions
{
    // === SHORT TERM: Dữ liệu hay thay đổi ===
    /// <summary>5 phút - Cache cho dữ liệu hay thay đổi</summary>
    public static TimeSpan ShortTerm => TimeSpan.FromMinutes(5);
    
    // === MEDIUM TERM: Dữ liệu tương đối ổn định ===
    /// <summary>10 phút - Cache mặc định cho hầu hết dữ liệu</summary>
    public static TimeSpan MediumTerm => TimeSpan.FromMinutes(10);
    
    /// <summary>15 phút - Cache cho báo cáo đơn giản</summary>
    public static TimeSpan ReportSimple => TimeSpan.FromMinutes(15);
    
    // === LONG TERM: Dữ liệu ít thay đổi ===
    /// <summary>30 phút - Cache cho báo cáo phức tạp</summary>
    public static TimeSpan ReportComplex => TimeSpan.FromMinutes(30);
    
    /// <summary>1 giờ - Cache cho cấu hình hệ thống</summary>
    public static TimeSpan SystemConfig => TimeSpan.FromHours(1);
    
    /// <summary>2 giờ - Cache cho dữ liệu tham chiếu (danh mục hệ thống)</summary>
    public static TimeSpan ReferenceData => TimeSpan.FromHours(2);
    
    /// <summary>6 giờ - Cache cho schema database</summary>
    public static TimeSpan SchemaInfo => TimeSpan.FromHours(6);
    
    /// <summary>24 giờ - Cache cho dữ liệu tĩnh</summary>
    public static TimeSpan StaticData => TimeSpan.FromHours(24);
    
    // === ABSOLUTE EXPIRATION: Thời gian tuyệt đối (không gia hạn) ===
    /// <summary>Sliding: 5 phút, Absolute: 30 phút</summary>
    public static (TimeSpan Sliding, TimeSpan Absolute) ShortTermWithAbsolute => 
        (TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(30));
    
    /// <summary>Sliding: 10 phút, Absolute: 1 giờ</summary>
    public static (TimeSpan Sliding, TimeSpan Absolute) MediumTermWithAbsolute => 
        (TimeSpan.FromMinutes(10), TimeSpan.FromHours(1));
    
    /// <summary>Sliding: 30 phút, Absolute: 6 giờ</summary>
    public static (TimeSpan Sliding, TimeSpan Absolute) LongTermWithAbsolute => 
        (TimeSpan.FromMinutes(30), TimeSpan.FromHours(6));
}

/// <summary>
/// Extension methods để làm việc với MemoryCacheEntryOptions dễ dàng hơn
/// </summary>
public static class CacheOptionsExtensions
{
    /// <summary>
    /// Tạo cache options với sliding expiration
    /// </summary>
    public static MemoryCacheEntryOptions WithSlidingExpiration(
        this MemoryCacheEntryOptions options, 
        TimeSpan slidingExpiration)
    {
        options.SlidingExpiration = slidingExpiration;
        return options;
    }
    
    /// <summary>
    /// Tạo cache options với absolute expiration
    /// </summary>
    public static MemoryCacheEntryOptions WithAbsoluteExpiration(
        this MemoryCacheEntryOptions options, 
        DateTimeOffset absoluteExpiration)
    {
        options.AbsoluteExpiration = absoluteExpiration;
        return options;
    }
    
    /// <summary>
    /// Tạo cache options với absolute expiration relative to now
    /// </summary>
    public static MemoryCacheEntryOptions WithAbsoluteExpirationRelativeToNow(
        this MemoryCacheEntryOptions options,
        TimeSpan absoluteExpiration)
    {
        options.AbsoluteExpirationRelativeToNow = absoluteExpiration;
        return options;
    }
    
    /// <summary>
    /// Tạo cache options với cả sliding và absolute expiration
    /// Absolute expiration là thời gian tối đa cache tồn tại
    /// Sliding expiration là thời gian không accessed trước khi bị xóa
    /// </summary>
    public static MemoryCacheEntryOptions WithBothExpirations(
        this MemoryCacheEntryOptions options, 
        TimeSpan slidingExpiration, 
        TimeSpan absoluteExpiration)
    {
        options.SlidingExpiration = slidingExpiration;
        options.AbsoluteExpirationRelativeToNow = absoluteExpiration;
        return options;
    }
    
    /// <summary>
    /// Tạo options với priority (RAM usage)
    /// </summary>
    public static MemoryCacheEntryOptions WithPriority(
        this MemoryCacheEntryOptions options,
        Microsoft.Extensions.Caching.Memory.CacheItemPriority priority)
    {
        options.Priority = priority;
        return options;
    }
    
    /// <summary>
    /// Thêm callback khi cache entry bị xóa
    /// </summary>
    public static MemoryCacheEntryOptions WithEvictionCallback(
        this MemoryCacheEntryOptions options,
        PostEvictionDelegate callback,
        object? state = null)
    {
        options.PostEvictionCallbacks.Add(new PostEvictionCallbackRegistration
        {
            EvictionCallback = callback,
            State = state
        });
        return options;
    }
}
