using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace API_ND.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly string _anhPath;
    private readonly string _iconPath;
    private readonly string _luuTruPath;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
        // Đường dẫn từ BE ra: BE\BE\API_ND -> lên 3 cấp -> Code
        _anhPath = Path.Combine(_env.ContentRootPath, "..", "..", "..", "Anh");
        _iconPath = Path.Combine(_env.ContentRootPath, "..", "..", "..", "ICON");
        _luuTruPath = Path.Combine(_env.ContentRootPath, "..", "..", "..", "LuuTruFile");
    }

    /// <summary>
    /// Upload ảnh hóa đơn/chứng từ vào thư mục Anh
    /// </summary>
    [HttpPost("anh")]
    public async Task<ActionResult<string>> UploadAnh(IFormFile file, CancellationToken ct = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { thongDiep = "Vui lòng chọn file" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { thongDiep = "Chỉ chấp nhận file ảnh (jpg, png, gif, webp)" });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { thongDiep = "File không được vượt quá 10MB" });

        var fileName = $"{Guid.NewGuid()}{ext}";
        var directory = _anhPath;

        if (!Directory.Exists(directory))
            Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, ct);
        }

        // Lưu bản sao vào LuuTruFile
        if (!Directory.Exists(_luuTruPath)) Directory.CreateDirectory(_luuTruPath);
        var backupPath = Path.Combine(_luuTruPath, fileName);
        using (var stream = new FileStream(backupPath, FileMode.Create))
        {
            await file.CopyToAsync(stream, ct);
        }

        return Ok(new { tenFile = fileName });
    }

    /// <summary>
    /// Upload icon danh mục vào thư mục ICON (cùng cấp FE)
    /// </summary>
    [HttpPost("icon")]
    public async Task<ActionResult<string>> UploadIcon(IFormFile file, CancellationToken ct = default)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { thongDiep = "Vui lòng chọn file" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { thongDiep = "Chỉ chấp nhận file ảnh (jpg, png, gif, webp, svg)" });

        if (file.Length > 2 * 1024 * 1024)
            return BadRequest(new { thongDiep = "File không được vượt quá 2MB" });

        // Giữ nguyên tên file gốc (hoặc dùng GUID nếu muốn tránh trùng)
        var fileName = $"{Guid.NewGuid()}{ext}";
        var directory = _iconPath;

        if (!Directory.Exists(directory))
            Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream, ct);
        }

        // Trả về tên file để FE sử dụng
        return Ok(new { tenFile = fileName });
    }

    /// <summary>
    /// Lấy icon từ thư mục ICON
    /// </summary>
    [HttpGet("icon/{fileName}")]
    [AllowAnonymous]
    public IActionResult LayIcon(string fileName)
    {
        var filePath = Path.Combine(_iconPath, fileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound(new { thongDiep = "Không tìm thấy icon" });

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };

        var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        return File(fileStream, contentType);
    }

    /// <summary>
    /// Xóa icon
    /// </summary>
    [HttpDelete("icon/{fileName}")]
    public IActionResult XoaIcon(string fileName)
    {
        var filePath = Path.Combine(_iconPath, fileName);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
            return NoContent();
        }
        return NotFound(new { thongDiep = "Không tìm thấy file" });
    }

    /// <summary>
    /// Xóa ảnh (dùng khi cần cleanup)
    /// </summary>
    [HttpDelete("anh/{fileName}")]
    public IActionResult XoaAnh(string fileName)
    {
        var filePath = Path.Combine(_anhPath, fileName);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
            return NoContent();
        }
        return NotFound(new { thongDiep = "Không tìm thấy file" });
    }

    /// <summary>
    /// Lấy ảnh mục tiêu từ thư mục Anh
    /// </summary>
    [HttpGet("muctieu/{fileName}")]
    [AllowAnonymous]
    public IActionResult LayAnhMucTieu(string fileName)
    {
        var filePath = Path.Combine(_anhPath, fileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound(new { thongDiep = "Không tìm thấy ảnh" });

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            _ => "application/octet-stream"
        };

        var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        return File(fileStream, contentType);
    }

    /// <summary>
    /// Lấy tệp từ LuuTruFile để hiển thị hoặc tải về
    /// </summary>
    [HttpGet("tep/{fileName}")]
    [AllowAnonymous]
    public IActionResult LayTep(string fileName)
    {
        var filePath = Path.Combine(_luuTruPath, fileName);
        if (!System.IO.File.Exists(filePath))
            return NotFound(new { thongDiep = "Không tìm thấy file" });

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };

        var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        return File(fileStream, contentType);
    }
}
