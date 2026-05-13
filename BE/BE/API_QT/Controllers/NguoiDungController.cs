using Common;
using DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API_QT.Controllers;

[ApiController]
[Route("admin/nguoi-dung")]
[Authorize(Roles = "admin")]
public class NguoiDungController : ControllerBase
{
    private readonly BLL.Interfaces.INguoiDungBll _nguoiDungBll;

    public NguoiDungController(BLL.Interfaces.INguoiDungBll nguoiDungBll)
    {
        _nguoiDungBll = nguoiDungBll;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<NguoiDungDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PagedResponse<NguoiDungDto>>>> LayDanhSach(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? vaiTro = null,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? phuongThucDangNhap = null,
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDir = null,
        CancellationToken ct = default)
    {
        var filter = new LocNguoiDungFilter
        {
            Search = search,
            VaiTro = vaiTro,
            TrangThai = trangThai,
            PhuongThucDangNhap = phuongThucDangNhap,
            TuNgay = tuNgay,
            DenNgay = denNgay,
            SortBy = sortBy,
            SortDir = sortDir
        };

        var result = await _nguoiDungBll.LayDanhSachAdminAsync(page, pageSize, filter, ct);

        return Ok(ApiResponse<PagedResponse<NguoiDungDto>>.Ok(result, "Lấy danh sách thành công"));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<NguoiDungChiTietDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NguoiDungChiTietDto>>> LayChiTiet(int id, CancellationToken ct = default)
    {
        var nguoiDung = await _nguoiDungBll.LayChiTietAdminFullAsync(id, ct);
        if (nguoiDung == null)
            return NotFound(ApiResponse<NguoiDungChiTietDto>.NotFound("Không tìm thấy người dùng"));

        return Ok(ApiResponse<NguoiDungChiTietDto>.Ok(nguoiDung, "Lấy chi tiết thành công"));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<int>>> TaoMoi([FromBody] TaoNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        try
        {
            var id = await _nguoiDungBll.TaoMoiAsync(dto, ct);
            return StatusCode(201, ApiResponse<int>.Ok(id, "Tạo người dùng thành công"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse>> CapNhat(int id, [FromBody] CapNhatNguoiDungAdminDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _nguoiDungBll.CapNhatAdminAsync(id, dto, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Cập nhật người dùng thành công"));
    }

    [HttpPut("{id:int}/vai-tro")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse>> CapNhatVaiTro(int id, [FromBody] CapNhatVaiTroDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _nguoiDungBll.CapNhatVaiTroAsync(id, dto.VaiTro, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Cập nhật vai trò thành công"));
    }

    [HttpPut("{id:int}/khoa")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse>> KhoaTaiKhoan(int id, [FromBody] KhoaTaiKhoanDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _nguoiDungBll.KhoaTaiKhoanAsync(id, true, dto.LyDo, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Đã khóa tài khoản"));
    }

    [HttpPut("{id:int}/mo-khoa")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse>> MoKhoaTaiKhoan(int id, CancellationToken ct = default)
    {
        var thanhCong = await _nguoiDungBll.KhoaTaiKhoanAsync(id, false, null, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Đã mở khóa tài khoản"));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse>> Xoa(int id, [FromQuery] string? email = null, CancellationToken ct = default)
    {
        var nguoiDung = await _nguoiDungBll.LayChiTietAdminAsync(id, ct);
        if (nguoiDung == null)
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

        if (!string.IsNullOrEmpty(email) && email != nguoiDung.Email)
            return BadRequest(ApiResponse.Fail("Email xác nhận không khớp"));

        var thanhCong = await _nguoiDungBll.XoaAsync(id, ct);
        if (!thanhCong)
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

        return Ok(ApiResponse.Ok("Xóa người dùng thành công"));
    }

    [HttpPost("khoa-nhieu")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse>> KhoaNhieu([FromBody] KhoaNhieuDto dto, CancellationToken ct = default)
    {
        var count = await _nguoiDungBll.KhoaNhieuAsync(dto.Ids, dto.LyDo, ct);
        return Ok(ApiResponse.Ok($"Đã khóa {count} tài khoản"));
    }

    [HttpPut("mo-khoa-nhieu")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse>> MoKhoaNhieu([FromBody] List<int> ids, CancellationToken ct = default)
    {
        var count = await _nguoiDungBll.MoKhoaNhieuAsync(ids, ct);
        return Ok(ApiResponse.Ok($"Đã mở khóa {count} tài khoản"));
    }

    [HttpPost("reset-mat-khau")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse>> ResetMatKhau([FromBody] ResetMatKhauDto dto, CancellationToken ct = default)
    {
        var thanhCong = await _nguoiDungBll.GuiEmailResetMatKhauAsync(dto.Email, ct);
        if (!thanhCong)
            return BadRequest(ApiResponse.Fail("Không tìm thấy người dùng với email này"));

        return Ok(ApiResponse.Ok("Đã gửi email đặt lại mật khẩu"));
    }

    [HttpGet("{id:int}/lich-su-dang-nhap")]
    [ProducesResponseType(typeof(ApiResponse<PagedResponse<LichSuDangNhapDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<PagedResponse<LichSuDangNhapDto>>>> LayLichSuDangNhap(
        int id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _nguoiDungBll.LayLichSuDangNhapAsync(id, page, pageSize, ct);
        return Ok(ApiResponse<PagedResponse<LichSuDangNhapDto>>.Ok(result, "Lấy lịch sử đăng nhập thành công"));
    }

    [HttpGet("thong-ke")]
    [ProducesResponseType(typeof(ApiResponse<ThongKeTongQuanNguoiDungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ThongKeTongQuanNguoiDungDto>>> LayThongKe(CancellationToken ct = default)
    {
        var result = await _nguoiDungBll.LayThongKeTongQuanAsync(ct);
        return Ok(ApiResponse<ThongKeTongQuanNguoiDungDto>.Ok(result, "Lấy thống kê thành công"));
    }

    [HttpGet("thong-ke-theo-loc")]
    [ProducesResponseType(typeof(ApiResponse<ThongKeTongQuanNguoiDungDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ThongKeTongQuanNguoiDungDto>>> LayThongKeTheoLoc(
        [FromQuery] string? search = null,
        [FromQuery] string? vaiTro = null,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? phuongThucDangNhap = null,
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        CancellationToken ct = default)
    {
        var filter = new LocNguoiDungFilter
        {
            Search = search,
            VaiTro = vaiTro,
            TrangThai = trangThai,
            PhuongThucDangNhap = phuongThucDangNhap,
            TuNgay = tuNgay,
            DenNgay = denNgay
        };

        var result = await _nguoiDungBll.LayThongKeTheoLocAsync(filter, ct);
        return Ok(ApiResponse<ThongKeTongQuanNguoiDungDto>.Ok(result, "Lấy thống kê thành công"));
    }

    [HttpGet("xuat-excel")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> XuatExcel(
        [FromQuery] string? search = null,
        [FromQuery] string? vaiTro = null,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? tuNgay = null,
        [FromQuery] string? denNgay = null,
        CancellationToken ct = default)
    {
        var filter = new LocNguoiDungFilter
        {
            Search = search,
            VaiTro = vaiTro,
            TrangThai = trangThai,
            TuNgay = tuNgay,
            DenNgay = denNgay
        };

        var fileBytes = await _nguoiDungBll.XuatExcelAsync(filter, ct);
        var fileName = $"danh_sach_nguoi_dung_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}