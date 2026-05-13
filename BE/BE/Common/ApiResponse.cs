namespace Common;

/// <summary>
/// Response wrapper chuẩn cho tất cả API
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public object? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Thành công")
        => new() { Success = true, Message = message, Data = data };

    public static ApiResponse<T> Fail(string message, object? errors = null)
        => new() { Success = false, Message = message, Errors = errors };

    public static ApiResponse<T> NotFound(string message = "Không tìm thấy")
        => new() { Success = false, Message = message };
}

/// <summary>
/// Response không có data
/// </summary>
public class ApiResponse : ApiResponse<object>
{
    public new static ApiResponse Ok(string message = "Thành công")
        => new() { Success = true, Message = message };

    public new static ApiResponse Fail(string message, object? errors = null)
        => new() { Success = false, Message = message, Errors = errors };

    public new static ApiResponse NotFound(string message = "Không tìm thấy")
        => new() { Success = false, Message = message };
}

/// <summary>
/// Response phân trang
/// </summary>
public class PagedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
