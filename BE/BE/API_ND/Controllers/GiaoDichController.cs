using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using ClosedXML.Excel;

namespace API_ND.Controllers;

[ApiController]
[Route("api/giao-dich")]
[Authorize]
public class GiaoDichController : ControllerBase
{
    private readonly BLL.Interfaces.IGiaoDichBll _giaoDichBll;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GiaoDichController(
        BLL.Interfaces.IGiaoDichBll giaoDichBll,
        IHttpContextAccessor httpContextAccessor)
    {
        _giaoDichBll = giaoDichBll;
        _httpContextAccessor = httpContextAccessor;
    }

    private string? GetIpAddress()
    {
        return _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<GiaoDichDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PagedResponse<GiaoDichDto>>>> LayDanhSach(
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        [FromQuery] int? danhMucId = null,
        [FromQuery] string? loaiDanhMuc = null,
        [FromQuery] decimal? soTienTu = null,
        [FromQuery] decimal? soTienDen = null,
        [FromQuery] string? ghiChu = null,
        [FromQuery] int? taiKhoanNguonId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDir = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        // Parse dates with explicit format handling (yyyy-MM-dd)
        DateTime? tuNgayValue = null;
        DateTime? denNgayValue = null;
        
        if (!string.IsNullOrEmpty(tuNgay))
        {
            if (DateTime.TryParseExact(tuNgay, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out var td))
                tuNgayValue = td;
            else if (DateTime.TryParse(tuNgay, out td))
                tuNgayValue = td;
        }

        if (!string.IsNullOrEmpty(denNgay))
        {
            if (DateTime.TryParseExact(
                denNgay,
                "yyyy-MM-dd",
                null,
                System.Globalization.DateTimeStyles.None,
                out var denNgayParsed))
            {
                denNgayValue = denNgayParsed.AddDays(1).AddTicks(-1);
            }
            else if (DateTime.TryParse(
                denNgay,
                out var denNgayParsed2))
            {
                denNgayValue = denNgayParsed2.AddDays(1).AddTicks(-1);
            }
        }

        // Build filter object from individual parameters
        var filter = new LocGiaoDichDto
        {
            TuNgay = tuNgayValue,
            DenNgay = denNgayValue,
            DanhMucId = danhMucId,
            TenLoaiDanhMuc = loaiDanhMuc, // "Chi tiêu" hoặc "Thu nhập"
            SoTienTu = soTienTu,
            SoTienDen = soTienDen,
            GhiChu = ghiChu,
            TaiKhoanNguonId = taiKhoanNguonId,
            SortBy = sortBy,
            SortDir = sortDir
        };

        var ketQua = await _giaoDichBll.LayDanhSachAsync(userId.Value, filter, page, pageSize, ct);
        return Ok(ApiResponse<PagedResponse<GiaoDichDto>>.Ok(ketQua, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<GiaoDichDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<GiaoDichDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var ketQua = await _giaoDichBll.LayChiTietAsync(id, userId.Value, ct);
        if (ketQua == null)
            return NotFound(ApiResponse<GiaoDichDto>.NotFound("Không tìm thấy giao dịch"));

        return Ok(ApiResponse<GiaoDichDto>.Ok(ketQua, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi(
        [FromForm] TaoGiaoDichDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        try
        {
            var giaoDichId = await _giaoDichBll.TaoMoiAsync(dto, userId.Value, ct);
            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<int>.Ok(giaoDichId, "Tạo giao dịch thành công"));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] TaoMoi: {ex.Message}");
            return BadRequest(ApiResponse.Fail($"Lỗi: {ex.Message}"));
        }
    }

    /// <summary>
    /// Tạo giao dịch với kiểm tra ngân sách - trả về cảnh báo nếu chưa có
    /// </summary>
    [HttpPost("tao-voi-kiem-tra")]
    [ProducesResponseType(typeof(ApiResponse<TaoGiaoDichResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<TaoGiaoDichResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TaoGiaoDichResponseDto>>> TaoMoiVoiKiemTra(
        [FromForm] TaoGiaoDichDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        try
        {
            var result = await _giaoDichBll.TaoMoiWithKiemTraAsync(dto, userId.Value, ct);

            if (!result.ThanhCong && result.ThongBaoLoi == "CHUA_CO_NGAN_SACH")
            {
                // Trả về 200 với cảnh báo để FE hiển thị dialog xác nhận
                return Ok(ApiResponse<TaoGiaoDichResponseDto>.Ok(result, "Cảnh báo: Bạn chưa cài ngân sách cho danh mục này"));
            }

            return StatusCode(StatusCodes.Status201Created,
                ApiResponse<TaoGiaoDichResponseDto>.Ok(result, "Tạo giao dịch thành công"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<TaoGiaoDichResponseDto>.Fail(ex.Message));
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> CapNhat(
        int id,
        [FromForm] TaoGiaoDichDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _giaoDichBll.CapNhatAsync(id, dto, userId.Value, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy giao dịch"));

        return Ok(ApiResponse.Ok("Cập nhật thành công"));
    }

    [HttpPost("preview-update")]
    [ProducesResponseType(typeof(ApiResponse<PreviewCapNhatGiaoDichDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PreviewCapNhatGiaoDichDto>>> XemTruocCapNhat(
        [FromForm] int giaoDichId,
        [FromForm] TaoGiaoDichDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var preview = await _giaoDichBll.XemTruocCapNhatAsync(giaoDichId, dto, userId.Value, ct);
        return Ok(ApiResponse<PreviewCapNhatGiaoDichDto>.Ok(preview, "Xem trước thành công"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var thanhCong = await _giaoDichBll.XoaAsync(id, userId.Value, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy giao dịch"));

        return Ok(ApiResponse.Ok("Xóa giao dịch thành công"));
    }

    [HttpGet("xuat-csv")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> XuatCsv(
        [FromQuery] LocGiaoDichDto? filter = null,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        var giaoDichs = await _giaoDichBll.LayDanhSachAsync(userId.Value, filter, 1, 10000, ct);

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("ID,TaiKhoanNguon,TaiKhoanDich,Loai,DanhMuc,SoTien,NgayGiaoDich,GhiChu");

        foreach (var gd in giaoDichs.Items)
        {
            csv.AppendLine($"{gd.GiaoDichId},\"{gd.TenTaiKhoanNguon}\",\"{gd.TenTaiKhoanDich ?? ""}\",{gd.LoaiGiaoDich},\"{gd.TenDanhMuc ?? ""}\",{gd.SoTien:N0},{gd.NgayGiaoDich:yyyy-MM-dd HH:mm},\"{gd.GhiChu?.Replace("\"", "\"\"") ?? ""}\"");
        }

        var tenFile = $"giaodich_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv; charset=utf-8", tenFile);
    }

    [HttpPost("xuat-csv")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> XuatCsvPost(
        [FromBody] XuatExcelDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        List<GiaoDichDto> giaoDichs;

        if (dto.GiaoDichIds != null && dto.GiaoDichIds.Count > 0)
        {
            var allItems = new List<GiaoDichDto>();
            int page = 1;
            int pageSize = 1000;

            while (true)
            {
                var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, page, pageSize, ct);
                allItems.AddRange(result.Items);
                if (result.Items.Count < pageSize || allItems.Count >= dto.GiaoDichIds.Count)
                    break;
                page++;
            }

            giaoDichs = allItems.Where(g => dto.GiaoDichIds.Contains(g.GiaoDichId)).ToList();
        }
        else
        {
            var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, 1, 10000, ct);
            giaoDichs = result.Items.ToList();
        }

        var csv = new System.Text.StringBuilder();
        csv.AppendLine("STT,Ngày,Loại,Danh Mục,Tài Khoản Nguồn,Tài Khoản Đích,Số Tiền,Ghi Chú");

        int stt = 1;
        foreach (var gd in giaoDichs)
        {
            var loaiDanhMucHienThi = gd.TenLoaiDanhMuc ?? ChuyenDoiLoaiHienThi(gd.LoaiGiaoDich, gd.TenLoaiDanhMuc);

            csv.AppendLine($"{stt},{gd.NgayGiaoDich:dd/MM/yyyy HH:mm},\"{loaiDanhMucHienThi}\",\"{gd.TenDanhMuc ?? ""}\",\"{gd.TenTaiKhoanNguon ?? ""}\",\"{gd.TenTaiKhoanDich ?? ""}\",{gd.SoTien:N0},\"{gd.GhiChu?.Replace("\"", "\"\"") ?? ""}\"");
            stt++;
        }

        var tenFile = $"giaodich_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv; charset=utf-8", tenFile);
    }

    [HttpPost("xuat-excel")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> XuatExcel(
        [FromBody] XuatExcelDto dto,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

        List<GiaoDichDto> giaoDichs;

        if (dto.GiaoDichIds != null && dto.GiaoDichIds.Count > 0)
        {
            var allItems = new List<GiaoDichDto>();
            int page = 1;
            int pageSize = 1000;

            while (true)
            {
                var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, page, pageSize, ct);
                allItems.AddRange(result.Items);
                if (result.Items.Count < pageSize || allItems.Count >= dto.GiaoDichIds.Count)
                    break;
                page++;
            }

            giaoDichs = allItems.Where(g => dto.GiaoDichIds.Contains(g.GiaoDichId)).ToList();
        }
        else
        {
            var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, 1, 10000, ct);
            giaoDichs = result.Items.ToList();
        }

        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("GiaoDich");

        var headers = new[] { "STT", "Ngày", "Loại", "Danh Mục", "Tài Khoản Nguồn", "Tài Khoản Đích", "Số Tiền", "Ghi Chú" };
        for (int i = 0; i < headers.Length; i++)
        {
            worksheet.Cell(1, i + 1).Value = headers[i];
            worksheet.Cell(1, i + 1).Style.Font.Bold = true;
            worksheet.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
            worksheet.Column(i + 1).Width = 15;
        }
        worksheet.Column(1).Width = 6;
        worksheet.Column(7).Width = 18;

        int row = 2;
        foreach (var gd in giaoDichs)
        {
            // Hiển thị loại danh mục: "Thu nhập" hoặc "Chi tiêu" thay vì mã loại giao dịch
            var loaiDanhMucHienThi = gd.TenLoaiDanhMuc ?? (ChuyenDoiLoaiHienThi(gd.LoaiGiaoDich, gd.TenLoaiDanhMuc));

            worksheet.Cell(row, 1).Value = row - 1;
            worksheet.Cell(row, 2).Value = gd.NgayGiaoDich.ToString("dd/MM/yyyy HH:mm");
            worksheet.Cell(row, 3).Value = loaiDanhMucHienThi;
            worksheet.Cell(row, 4).Value = gd.TenDanhMuc ?? "";
            worksheet.Cell(row, 5).Value = gd.TenTaiKhoanNguon ?? "";
            worksheet.Cell(row, 6).Value = gd.TenTaiKhoanDich ?? "";
            worksheet.Cell(row, 7).Value = gd.SoTien;
            worksheet.Cell(row, 7).Style.NumberFormat.Format = "#,##0";
            worksheet.Cell(row, 8).Value = gd.GhiChu ?? "";

            // Tô màu theo loại danh mục
            var loaiChuan = LayLoaiChuan(gd.LoaiGiaoDich, gd.TenLoaiDanhMuc);
            if (loaiChuan == "THU")
                worksheet.Cell(row, 3).Style.Font.FontColor = XLColor.Green;
            else if (loaiChuan == "CHI")
                worksheet.Cell(row, 3).Style.Font.FontColor = XLColor.Red;

            row++;
        }

        var tenFile = $"giaodich_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", tenFile);
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;
        return null;
    }

    private string ChuyenDoiLoaiHienThi(string? loai, string? tenLoaiDanhMuc)
    {
        if (!string.IsNullOrEmpty(tenLoaiDanhMuc))
            return tenLoaiDanhMuc;

        return loai switch
        {
            "THU" => "Thu nhập",
            "CHI" => "Chi tiêu",
            "CHUYEN_KHOAN" => "Chuyển khoản",
            "1" => "Thu nhập",
            "2" => "Chi tiêu",
            "3" => "Chuyển khoản",
            _ => loai ?? ""
        };
    }

    private string LayLoaiChuan(string? loai, string? tenLoaiDanhMuc)
    {
        if (!string.IsNullOrEmpty(tenLoaiDanhMuc))
        {
            if (tenLoaiDanhMuc.Contains("Thu") || tenLoaiDanhMuc.Contains("thu"))
                return "THU";
            if (tenLoaiDanhMuc.Contains("Chi") || tenLoaiDanhMuc.Contains("chi"))
                return "CHI";
        }

        return loai switch
        {
            "THU" => "THU",
            "CHI" => "CHI",
            "CHUYEN_KHOAN" => "CHUYEN_KHOAN",
            "1" => "THU",
            "2" => "CHI",
            "3" => "CHUYEN_KHOAN",
            _ => ""
        };
    }
}
