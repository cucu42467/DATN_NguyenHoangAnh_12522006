using BLL.Interfaces;
using Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_ND.Controllers;

/// <summary>
/// Controller ví dụ minh họa cách sử dụng MemoryCache trong ASP.NET Core
/// </summary>
[ApiController]
[Route("api/vidu-cache")]
[Authorize]
public class ViDuCacheController : ControllerBase
{
    private readonly ICacheService _cache;
    private readonly ILogger<ViDuCacheController> _logger;

    public ViDuCacheController(ICacheService cache, ILogger<ViDuCacheController> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Ví dụ 1: Cache đơn giản - Lấy và hiển thị cache status
    /// </summary>
    [HttpGet("trang-thai")]
    public async Task<ActionResult<ApiResponse<object>>> GetCacheStatus()
    {
        var cacheKey = "example:ping";
        
        // Thử lấy từ cache
        var cachedValue = await _cache.GetAsync<string>(cacheKey);
        
        if (cachedValue != null)
        {
            return Ok(ApiResponse<object>.Ok(new 
            {
                message = "Từ CACHE",
                value = cachedValue,
                key = cacheKey
            }, "Cache HIT"));
        }
        
        // Cache miss - tạo mới
        var newValue = $"Pong! {DateTime.Now:HH:mm:ss}";
        await _cache.SetAsync(cacheKey, newValue, CacheExpirationOptions.ShortTerm);
        
        return Ok(ApiResponse<object>.Ok(new 
        {
            message = "Từ SERVER (đã lưu cache)",
            value = newValue,
            key = cacheKey
        }, "Cache MISS - đã tạo mới"));
    }

    /// <summary>
    /// Ví dụ 2: GetOrSet pattern - cách sử dụng phổ biến nhất
    /// Cache sẽ tự động được tạo nếu chưa có
    /// </summary>
    [HttpGet("danh-sach")]
    public async Task<ActionResult<ApiResponse<object>>> GetListWithCache(
        [FromQuery] bool forceRefresh = false)
    {
        var cacheKey = "example:products:all";
        
        // Nếu force refresh, xóa cache trước
        if (forceRefresh)
        {
            await _cache.RemoveAsync(cacheKey);
            _logger.LogInformation("Cache cleared for key: {Key}", cacheKey);
        }
        
        // GetOrSet: lấy từ cache hoặc tạo mới từ factory
        var products = await _cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                _logger.LogInformation("Fetching products from database...");
                // Simulate database call
                await Task.Delay(100);
                return new[]
                {
                    new { id = 1, name = "Sản phẩm A", price = 100000 },
                    new { id = 2, name = "Sản phẩm B", price = 200000 },
                    new { id = 3, name = "Sản phẩm C", price = 300000 }
                };
            },
            CacheExpirationOptions.MediumTerm // 10 phút
        );
        
        return Ok(ApiResponse<object>.Ok(products, "Lấy danh sách thành công"));
    }

    /// <summary>
    /// Ví dụ 3: Cache với Sliding + Absolute Expiration
    /// - Sliding: Gia hạn mỗi khi được truy cập
    /// - Absolute: Thời gian tối đa cache tồn tại
    /// </summary>
    [HttpGet("chi-tiet/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> GetDetailWithCache(int id)
    {
        var cacheKey = $"example:product:{id}";
        
        var product = await _cache.GetOrSetAsync(
            cacheKey,
            async () =>
            {
                _logger.LogInformation("Fetching product {Id} from database...", id);
                await Task.Delay(50);
                return new { id, name = $"Sản phẩm {id}", price = id * 100000, createdAt = DateTime.Now };
            },
            // Sử dụng cả sliding và absolute expiration
            null // Pass null để dùng overload với cả 2
        );
        
        // Hoặc gọi trực tiếp:
        // await _cache.SetWithBothExpirationsAsync(
        //     cacheKey, 
        //     product,
        //     CacheExpirationOptions.MediumTermWithAbsolute.Sliding,  // 10 phút sliding
        //     CacheExpirationOptions.MediumTermWithAbsolute.Absolute    // 1 giờ absolute
        // );
        
        return Ok(ApiResponse<object>.Ok(product, "Lấy chi tiết thành công"));
    }

    /// <summary>
    /// Ví dụ 4: Xóa cache - khi thêm/sửa/xóa dữ liệu
    /// </summary>
    [HttpPost("xoa-cache")]
    public async Task<ActionResult<ApiResponse<object>>> ClearCache([FromBody] ClearCacheRequest request)
    {
        if (request.ClearAll)
        {
            // Xóa tất cả cache liên quan (sẽ log warning vì IMemoryCache không hỗ trợ prefix)
            await _cache.RemoveByPrefixAsync("example:");
            return Ok(ApiResponse<object>.Ok(new { message = "Đã xóa tất cả cache" }, "Xóa cache thành công"));
        }
        
        if (!string.IsNullOrEmpty(request.Key))
        {
            await _cache.RemoveAsync(request.Key);
            return Ok(ApiResponse<object>.Ok(new { key = request.Key }, "Đã xóa cache key"));
        }
        
        return BadRequest(ApiResponse<object>.Fail("Vui lòng cung cấp key hoặc chọn clearAll"));
    }

    /// <summary>
    /// Ví dụ 5: Kiểm tra cache có tồn tại không
    /// </summary>
    [HttpGet("kiem-tra/{key}")]
    public async Task<ActionResult<ApiResponse<object>>> CheckCache(string key)
    {
        var exists = _cache.Exists(key);
        var value = await _cache.GetAsync<string>(key);
        
        return Ok(ApiResponse<object>.Ok(new
        {
            key,
            exists,
            value = exists ? value : null
        }, exists ? "Cache tồn tại" : "Cache không tồn tại"));
    }
}

/// <summary>
/// Request model cho việc xóa cache
/// </summary>
public class ClearCacheRequest
{
    public string? Key { get; set; }
    public bool ClearAll { get; set; }
}
