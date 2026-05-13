# 4.2 Xây dựng các chức năng

Phần này trình bày chi tiết quá trình xây dựng và cài đặt các chức năng của hệ thống Quản lý Chi tiêu Cá nhân. Hệ thống được phân chia thành hai phân hệ chính: phân hệ Người dùng (sử dụng cho cá nhân quản lý tài chính) và phân hệ Quản trị (dành cho admin quản lý hệ thống). Mỗi chức năng được mô tả theo bốn phần: mô tả chức năng, giao diện người dùng, luồng xử lý kèm code minh hoạ, và kết quả trả về.

---

## 4.2.1 Các chức năng phân hệ Người dùng

### a) Xác thực người dùng (Đăng ký, Đăng nhập, Đăng nhập mạng xã hội, Quên mật khẩu/OTP, Đăng xuất, Refresh Token)

#### ① Mô tả chức năng

Hệ thống cung cấp toàn bộ các chức năng xác thực người dùng theo chuẩn JWT Bearer Token. Người dùng có thể đăng ký tài khoản mới bằng email và mật khẩu, đăng nhập qua tài khoản local hoặc qua Google OAuth 2.0, khôi phục mật khẩu thông qua mã OTP gửi qua email, và duy trì phiên đăng nhập thông qua cơ chế Refresh Token tự động. Khi đăng xuất, hệ thống sẽ revoke Refresh Token để đảm bảo bảo mật.

#### ② Giao diện người dùng

Trang đăng nhập (`/DangNhap`) bao gồm: form nhập email và mật khẩu với nút toggle hiển thị/ẩn mật khẩu, checkbox "Ghi nhớ mật khẩu", nút đăng nhập bằng tài khoản local, nút đăng nhập Google với logo SVG, và liên kết "Quên mật khẩu?". Sau khi đăng nhập thành công, nếu tài khoản có nhiều vai trò (user + admin), hệ thống hiển thị dialog chọn vai trò trước khi chuyển hướng.

Trang đăng ký (`/DangKy`) gồm form với các trường: Họ và tên, Email, Số điện thoại (tùy chọn), Mật khẩu (có toggle ẩn/hiện), Xác nhận mật khẩu. Form sử dụng react-hook-form kết hợp zod validation cho việc kiểm tra dữ liệu phía client.

Trang quên mật khẩu cho phép người dùng nhập email để nhận mã OTP xác thực, sau đó nhập mã OTP và đặt lại mật khẩu mới.

#### ③ Luồng xử lý

**Frontend - Gọi API đăng nhập:**

```typescript
// FE: fe\app\(auth)\DangNhap\page.tsx (dòng 238-291)
dangNhapBangMatKhau(data.email, data.matKhau, true)
  .then((res) => {
    luuPhienDangNhap(res);
    const vaiTro = res.nguoiDung.vaiTro;
    const hasAdmin = vaiTro.includes('admin');
    const hasUser = vaiTro.includes('user');
    // Nếu có 2 vai trò -> hiển thị dialog chọn vai trò
    if (hasAdmin && hasUser) {
      setShowRoleDialog(true);
    } else if (hasAdmin && !hasUser) {
      router.push('/admin');
    } else {
      router.push('/TrangChu');
    }
  })
```

**Controller - Xử lý yêu cầu:**

```csharp
// BE: BE\API_ND\Controllers\XacThucController.cs (dòng 22-45)
[HttpPost("dang-nhap")]
[ProducesResponseType(typeof(PhanHoiDangNhapDto), (int)HttpStatusCode.OK)]
[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
public async Task<IActionResult> DangNhap(
    [FromBody] YeuCauDangNhapDto yeuCau,
    CancellationToken huyBo)
{
    var ip = LayDiaChiIp();
    var thietBi = Request.Headers.UserAgent.ToString();
    var (thanhCong, thongDiep, duLieu) =
        await _xacThucBll.DangNhapAsync(
            yeuCau, ip,
            string.IsNullOrEmpty(thietBi) ? null : thietBi,
            yeuCau.HeDieuHanh, yeuCau.ViTri, huyBo);

    if (!thanhCong)
        return Unauthorized(new { thongDiep });

    return Ok(duLieu);
}
```

**Đăng ký tài khoản mới:**

```csharp
// BE: XacThucController.cs (dòng 50-70)
[HttpPost("dang-ky")]
[ProducesResponseType(typeof(PhanHoiDangKyDto), (int)HttpStatusCode.OK)]
[ProducesResponseType((int)HttpStatusCode.BadRequest)]
public async Task<IActionResult> DangKy(
    [FromBody] YeuCauDangKyDto yeuCau,
    CancellationToken huyBo)
{
    var ip = LayDiaChiIp();
    var thietBi = Request.Headers.UserAgent.ToString();
    var (thanhCong, thongDiep, duLieu) =
        await _xacThucBll.DangKyAsync(
            yeuCau, ip,
            string.IsNullOrEmpty(thietBi) ? null : thietBi,
            huyBo: huyBo);

    if (!thanhCong)
        return BadRequest(new { thongDiep });

    return Ok(duLieu);
}
```

**Refresh Token:**

```csharp
// BE: XacThucController.cs (dòng 105-114)
[HttpPost("lam-moi-token")]
[ProducesResponseType(typeof(PhanHoiDangNhapDto), (int)HttpStatusCode.OK)]
public async Task<IActionResult> LamMoiToken(
    [FromBody] YeuCauLamMoiTokenDto yeuCau,
    CancellationToken huyBo)
{
    var (thanhCong, thongDiep, duLieu) =
        await _xacThucBll.LamMoiTokenAsync(yeuCau.RefreshToken, huyBo);
    if (!thanhCong)
        return Unauthorized(new { thongDiep });

    return Ok(duLieu);
}
```

#### ④ Kết quả

Đăng nhập thành công trả về `PhanHoiDangNhapDto` chứa: `accessToken` (JWT), `refreshToken`, thông tin người dùng (id, họ tên, email, vai trò). Token được lưu vào localStorage và cookie. Đăng ký thành công trả về `PhanHoiDangKyDto` với thông báo xác nhận email.

Trên UI, khi thành công hiển thị loading overlay với thông điệp "Đang đăng nhập..." rồi chuyển hướng. Khi thất bại hiển thị thông báo lỗi màu đỏ phía trên form.

---

### b) Quản lý tài khoản tài chính (CRUD tài khoản, Ẩn/Hiện, Chuyển tiền nội bộ)

#### ① Mô tả chức năng

Chức năng cho phép người dùng tạo, xem, sửa và xóa các tài khoản tài chính của mình (tiền mặt, tài khoản ngân hàng, ví điện tử, thẻ tín dụng, tiết kiệm). Người dùng có thể thay đổi trạng thái hiển thị của tài khoản (ẩn/hiện) và thực hiện chuyển tiền nội bộ giữa các tài khoản cùng chủ sở hữu. Mỗi giao dịch chuyển tiền sẽ tự động tạo hai bản ghi giao dịch (giao dịch trừ tiền từ tài khoản nguồn và giao dịch cộng tiền vào tài khoản đích).

#### ② Giao diện người dùng

Trang quản lý tài khoản (`/TaiKhoan`) hiển thị danh sách tài khoản dạng card grid (3 cột trên desktop). Mỗi card hiển thị: icon theo loại tài khoản (Banknote cho tiền mặt, CreditCard cho ngân hàng/thẻ, Smartphone cho ví điện tử), tên tài khoản, loại tài khoản, thông tin ngân hàng/số tài khoản, số dư hiện tại (format VND), hạn mức tín dụng (nếu có), nút "Sửa tài khoản" và nút xóa. Card cuối cùng là placeholder "Thêm tài khoản mới" với border dashed.

Khi click "Sửa", hệ thống điều hướng đến `/TaiKhoan?form=CHINH_SUA&edit=<JSON>` chứa dữ liệu tài khoản được mã hóa URL. Dialog xác nhận xuất hiện trước khi xóa tài khoản.

#### ③ Luồng xử lý

**Frontend - Xử lý xóa tài khoản:**

```typescript
// FE: fe\features\tinh_nang\taikhoan\thanh_phan\DanhSachTaiKhoan.tsx (dòng 49-62)
const handleDelete = async () => {
  if (!deleteId) return;
  setIsDeleting(true);
  try {
    await xoaTaiKhoan(deleteId);
    showToast("Tài khoản đã được xóa thành công!", "success");
    setDeleteId(null);
    onRefresh?.();
  } catch (error) {
    showToast("Không thể xóa tài khoản. Vui lòng thử lại.", "error");
  } finally {
    setIsDeleting(false);
  }
};
```

**Controller - API CRUD tài khoản:**

```csharp
// BE: BE\API_ND\Controllers\TaiKhoanController.cs (dòng 23-33)
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<List<TaiKhoanDto>>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<List<TaiKhoanDto>>>> LayDanhSach(
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var ketQua = await _taiKhoanBll.LayDanhSachAsync(userId.Value, ct);
    return Ok(ApiResponse<List<TaiKhoanDto>>.Ok(ketQua, "Lấy danh sách thành công"));
}
```

**Chuyển tiền nội bộ:**

```csharp
// BE: TaiKhoanController.cs (dòng 114-154)
[HttpPost("chuyen-tien-noi-bo")]
[ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
public async Task<ActionResult<ApiResponse<int>>> ChuyenTienNoiBo(
    [FromBody] ChuyenTienNoiBoDto dto,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var tkNguon = await _taiKhoanBll.LayChiTietAsync(dto.TaiKhoanNguonId, userId.Value, ct);
    var tkDich = await _taiKhoanBll.LayChiTietAsync(dto.TaiKhoanDichId, userId.Value, ct);
    if (tkNguon == null || tkDich == null)
        return BadRequest(ApiResponse.Fail("Tài khoản không hợp lệ"));
    if (tkNguon.SoDu < dto.SoTien)
        return BadRequest(ApiResponse.Fail("Số dư không đủ"));

    // Tạo giao dịch trừ tiền
    var giaoDichOut = new TaoGiaoDichDto {
        SoTien = dto.SoTien,
        LoaiGiaoDich = "3", // Chuyển khoản
        TaiKhoanNguonId = dto.TaiKhoanNguonId,
        TaiKhoanDichId = dto.TaiKhoanDichId,
        GhiChu = $"Chuyển {dto.SoTien:N0} → {tkDich.TenTaiKhoan}: {dto.GhiChu ?? ""}",
        NgayGiaoDich = DateTime.Now
    };
    var giaoDichOutId = await _giaoDichBll.TaoMoiAsync(giaoDichOut, userId.Value, ct);

    // Tạo giao dịch cộng tiền
    var giaoDichIn = new TaoGiaoDichDto {
        SoTien = dto.SoTien,
        LoaiGiaoDich = "1", // Thu nhập
        TaiKhoanNguonId = dto.TaiKhoanDichId,
        TaiKhoanDichId = dto.TaiKhoanNguonId,
        GhiChu = $"Nhận chuyển {dto.SoTien:N0} ← {tkNguon.TenTaiKhoan}: {dto.GhiChu ?? ""}",
        NgayGiaoDich = DateTime.Now
    };
    await _giaoDichBll.TaoMoiAsync(giaoDichIn, userId.Value, ct);

    return StatusCode(StatusCodes.Status201Created,
        ApiResponse<int>.Ok(giaoDichOutId, "Chuyển tiền thành công"));
}
```

#### ④ Kết quả

API trả về `ApiResponse<T>` với cấu trúc chuẩn: `{ thanhCong: true/false, duLieu: ..., thongDiep: string }`. Thành công trả về HTTP 200/201 kèm dữ liệu. Lỗi trả về HTTP 400/401/404 kèm thông điệp lỗi.

Trên UI, toast notification hiển thị "Tài khoản đã được xóa thành công!" hoặc "Không thể xóa tài khoản. Vui lòng thử lại." Danh sách tài khoản được cập nhật lại sau khi thao tác thành công.

---

### c) Quản lý giao dịch (Xem danh sách có lọc/phân trang, Thêm/Sửa/Xóa, Giao dịch định kỳ, Xuất CSV/Excel)

#### ① Mô tả chức năng

Hệ thống cho phép người dùng xem toàn bộ lịch sử giao dịch với khả năng lọc đa chiều (theo ngày, danh mục, loại giao dịch, khoảng số tiền, tài khoản nguồn) và phân trang. Người dùng có thể thêm mới giao dịch (thu nhập, chi tiêu, chuyển khoản), chỉnh sửa hoặc xóa giao dịch. Giao dịch định kỳ cho phép tự động tạo giao dịch theo lịch (hàng ngày, hàng tuần, hàng tháng). Chức năng xuất dữ liệu hỗ trợ định dạng CSV và Excel với khả năng chọn nhiều giao dịch để xuất.

#### ② Giao diện người dùng

Trang giao dịch (`/GiaoDich`) hiển thị bảng dữ liệu với các cột: checkbox chọn, giao dịch (ghi chú), loại/danh mục (icon + badge), tài khoản nguồn, số tiền (màu xanh cho thu, đỏ cho chi, tím cho chuyển khoản), ngày/thời gian, AI/nguồn tạo, trạng thái, thao tác (sửa, xóa, xem hóa đơn). Bảng hỗ trợ sắp xếp theo cột (ngày, số tiền, loại, tài khoản).

Phần đầu bảng có: dropdown chọn tài khoản, dropdown loại giao dịch, date picker từ ngày - đến ngày, nút "Xuất dữ liệu" (hiện số lượng đã chọn), badge hiển thị tổng số giao dịch. Phần cuối bảng có: text hiển thị "Hiển thị X / Y giao dịch", dropdown chọn page size, nút phân trang "Trước/Tiếp".

Modal xuất dữ liệu cho phép chọn định dạng CSV hoặc Excel, hiển thị số lượng giao dịch đã chọn.

#### ③ Luồng xử lý

**Frontend - Xuất Excel giao dịch:**

```typescript
// FE: fe\features\tinh_nang\giaodich\thanh_phan\BangLichSu.tsx (dòng 128-151)
const handleExport = async (format: 'csv' | 'excel') => {
  if (selectedIds.size === 0) {
    showToast('Vui lòng chọn ít nhất một giao dịch để xuất!', 'warning');
    return;
  }
  setIsExporting(true);
  try {
    const coSoApi = layCoSoApi();
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${coSoApi}/api/giao-dich/xuat-excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ giaoDichIds: Array.from(selectedIds) }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giaodich_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast(`Xuất ${format.toUpperCase()} thành công!`, 'success');
  } catch (error) {
    showToast('Không thể xuất file. Vui lòng thử lại.', 'error');
  } finally {
    setIsExporting(false);
  }
};
```

**Controller - API xuất Excel:**

```csharp
// BE: BE\API_ND\Controllers\GiaoDichController.cs (dòng 294-375)
[HttpPost("xuat-excel")]
[ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
public async Task<IActionResult> XuatExcel([FromBody] XuatExcelDto dto, CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    List<GiaoDichDto> giaoDichs;
    if (dto.GiaoDichIds != null && dto.GiaoDichIds.Count > 0) {
        // Lấy chỉ các giao dịch được chọn
        var allItems = new List<GiaoDichDto>();
        int page = 1; int pageSize = 1000;
        while (true) {
            var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, page, pageSize, ct);
            allItems.AddRange(result.Items);
            if (result.Items.Count < pageSize) break;
            page++;
        }
        giaoDichs = allItems.Where(g => dto.GiaoDichIds.Contains(g.GiaoDichId)).ToList();
    } else {
        var result = await _giaoDichBll.LayDanhSachAsync(userId.Value, dto.Filter, 1, 10000, ct);
        giaoDichs = result.Items.ToList();
    }

    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("GiaoDich");
    var headers = new[] { "STT", "Ngày", "Loại", "Danh Mục", "Tài Khoản Nguồn", "Tài Khoản Đích", "Số Tiền", "Ghi Chú" };
    for (int i = 0; i < headers.Length; i++) {
        worksheet.Cell(1, i + 1).Value = headers[i];
        worksheet.Cell(1, i + 1).Style.Font.Bold = true;
        worksheet.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.LightGray;
    }

    int row = 2;
    foreach (var gd in giaoDichs) {
        worksheet.Cell(row, 1).Value = row - 1;
        worksheet.Cell(row, 2).Value = gd.NgayGiaoDich.ToString("dd/MM/yyyy HH:mm");
        worksheet.Cell(row, 3).Value = gd.TenLoaiDanhMuc ?? gd.LoaiGiaoDich;
        worksheet.Cell(row, 7).Value = gd.SoTien;
        worksheet.Cell(row, 7).Style.NumberFormat.Format = "#,##0";
        row++;
    }

    using var stream = new MemoryStream();
    workbook.SaveAs(stream);
    return File(stream.ToArray(),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        $"giaodich_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
}
```

**API lấy danh sách với filter và phân trang:**

```csharp
// BE: GiaoDichController.cs (dòng 22-91)
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<PagedResponse<GiaoDichDto>>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<PagedResponse<GiaoDichDto>>>> LayDanhSach(
    [FromQuery] string? tuNgay = null,
    [FromQuery] string? denNgay = null,
    [FromQuery] int? danhMucId = null,
    [FromQuery] string? loaiDanhMuc = null,
    [FromQuery] decimal? soTienTu = null,
    [FromQuery] decimal? soTienDen = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] string? sortBy = null,
    [FromQuery] string? sortDir = null,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    var filter = new LocGiaoDichDto {
        TuNgay = tuNgayValue,
        DenNgay = denNgayValue,
        DanhMucId = danhMucId,
        TenLoaiDanhMuc = loaiDanhMuc,
        SoTienTu = soTienTu,
        SoTienDen = soTienDen,
        SortBy = sortBy,
        SortDir = sortDir
    };
    var ketQua = await _giaoDichBll.LayDanhSachAsync(userId.Value, filter, page, pageSize, ct);
    return Ok(ApiResponse<PagedResponse<GiaoDichDto>>.Ok(ketQua, "Lấy danh sách thành công"));
}
```

#### ④ Kết quả

API trả về file Excel (.xlsx) hoặc CSV (.csv) chứa danh sách giao dịch đã chọn. File Excel có header in đậm với nền xám, số tiền format số có dấu phẩy phân cách hàng nghìn. Giao dịch thu nhập hiển thị màu xanh, chi tiêu màu đỏ.

Trên UI, sau khi xuất thành công hiển thị toast "Xuất EXCEL thành công!" hoặc "Xuất CSV thành công!". Toast lỗi hiển thị "Không thể xuất file. Vui lòng thử lại." Khi chưa chọn giao dịch nào, hiển thị "Vui lòng chọn ít nhất một giao dịch để xuất!" với icon cảnh báo.

---

### d) Quản lý danh mục (CRUD danh mục chi tiêu / thu nhập)

#### ① Mô tả chức năng

Hệ thống cho phép người dùng xem danh sách danh mục chi tiêu và thu nhập, tạo danh mục cá nhân mới, chỉnh sửa thông tin danh mục, và ẩn danh mục không sử dụng. Danh mục được chia thành hai nhóm: danh mục hệ thống (mặc định, không thể xóa, có thể sắp xếp thứ tự bởi admin) và danh mục cá nhân (do người dùng tạo, có thể sửa/xóa/sắp xếp). Người dùng có thể lọc danh mục theo loại (chi tiêu/thu nhập), theo nguồn gốc (hệ thống/cá nhân), và tìm kiếm theo tên.

#### ② Giao diện người dùng

Trang quản lý danh mục (`/DanhMuc`) có giao diện với: tab chuyển đổi "Chi tiêu" / "Thu nhập" (tab active có nền trắng, text màu đỏ/xanh tương ứng), nút "Thêm danh mục" (màu xanh), thanh tìm kiếm theo tên, bộ lọc "Tất cả / Hệ thống / Cá nhân" dạng button.

Danh sách hiển thị dạng grid 3 cột, mỗi item là card với: icon màu theo `mauSac` từ database, tên danh mục, mô tả (nếu có), badge "Hệ thống" hoặc "Cá nhân", nút sửa/xóa (chỉ hiển thị cho danh mục cá nhân). Dialog xác nhận xuất hiện khi xóa với thông điệp "Danh mục này sẽ bị ẩn khỏi danh sách."

#### ③ Luồng xử lý

**Frontend - Fetch và hiển thị danh sách:**

```typescript
// FE: fe\features\tinh_nang\danhmuc\thanh_phan\QuanLyDanhMuc.tsx (dòng 53-78)
const fetchCategories = async () => {
  try {
    setLoading(true);
    const data = await layDanhSachDanhMuc(activeTab);
    const mapped: any[] = (data || []).map((item: any) => ({
      danhMucId: item.danhMucId,
      tenDanhMuc: item.tenDanhMuc,
      icon: item.icon,
      mauSac: item.mauSac || '#64748b',
      loai: item.loaiDanhMuc,
      moTa: item.moTa,
      isHeThong: item.laHeThong,
      thuTu: item.thuTu ?? 0,
    }));
    mapped.sort((a, b) => a.thuTu - b.thuTu);
    setCategories(mapped);
  } catch (err) {
    setError('Lỗi tải danh mục. Vui lòng thử lại.');
    setCategories([]);
  } finally {
    setLoading(false);
  }
};
```

**Controller - API CRUD danh mục:**

```csharp
// BE: BE\API_ND\Controllers\DanhMucController.cs (dòng 21-34)
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<List<DanhMucDto>>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<List<DanhMucDto>>>> LayDanhSach(
    [FromQuery] int? loaiDanhMucId = null,
    [FromQuery] bool includeChildren = false,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var danhMucs = await _danhMucBll.LayDanhSachAsync(userId.Value, loaiDanhMucId, includeChildren, ct);
    return Ok(ApiResponse<List<DanhMucDto>>.Ok(danhMucs, "Lấy danh sách thành công"));
}
```

**Xóa danh mục:**

```csharp
// BE: DanhMucController.cs (dòng 94-108)
[HttpDelete("{id:int}")]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
public async Task<ActionResult<ApiResponse>> Xoa(int id, CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var thanhCong = await _danhMucBll.XoaAsync(id, userId.Value, ct);
    if (!thanhCong)
        return NotFound(ApiResponse.Fail("Không tìm thấy danh mục"));

    return Ok(ApiResponse.Ok("Xóa danh mục thành công"));
}
```

#### ④ Kết quả

Xóa thành công trả về HTTP 200 với thông điệp "Xóa danh mục thành công". Trên UI, toast hiển thị "Danh mục đã được ẩn khỏi danh sách!" (thực chất là soft delete - ẩn chứ không xóa vĩnh viễn). Danh sách được refresh tự động sau khi xóa thành công.

---

### e) Quản lý ngân sách (Đặt ngân sách theo tháng/danh mục, Cảnh báo vượt ngân sách)

#### ① Mô tả chức năng

Chức năng cho phép người dùng thiết lập hạn mức chi tiêu cho từng danh mục theo từng tháng. Hệ thống tự động theo dõi và so sánh số tiền đã chi với hạn mức đã đặt, hiển thị tiến độ bằng thanh progress bar và đưa ra cảnh báo khi chi tiêu vượt ngưỡng. Người dùng có thể xem chi tiết các giao dịch thuộc một ngân sách cụ thể, chỉnh sửa hạn mức, hoặc xóa ngân sách.

#### ② Giao diện người dùng

Trang ngân sách (`/NganSach`) hiển thị grid cards với mỗi card chứa: icon AlertTriangle (khi vượt 80%) hoặc TrendingUp, tên danh mục, tháng/năm, số tiền đã dùng và hạn mức, thanh progress bar với màu thay đổi theo mức độ sử dụng (xanh < 50%, vàng 50-80%, cam 80-100%, đỏ > 100%), text phần trăm và số tiền còn lại hoặc cảnh báo "Vượt", nút "Chi tiết" để xem danh sách giao dịch, nút sửa và xóa.

Khi vượt ngân sách (percent > 100%), card có background đỏ nhạt và icon cảnh báo. Card cuối cùng là placeholder "Thêm ngân sách" với border dashed.

#### ③ Luồng xử lý

**Frontend - Render card ngân sách:**

```typescript
// FE: fe\features\tinh_nang\ngansach\thanh_phan\BangNganSach.tsx (dòng 89-172)
{budgets.map((budget) => {
  const percent = Math.min((budget.daDung / budget.hanMuc) * 100, 100);
  const isOver = budget.daDung > budget.hanMuc;
  const isWarning = percent >= 80;

  return (
    <div key={budget.nganSachId} className="bg-white rounded-xl border border-gray-200...">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${getProgressBackground(percent)}`}>
              {percent > 90 ? <AlertTriangle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-semibold">{budget.tenDanhMuc}</h3>
              <span className="text-xs text-gray-500">{budget.thang}/{budget.nam}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-medium text-gray-500 uppercase">Đã dùng</span>
            <p className={`text-lg font-bold ${getTextColor(percent)}`}>
              {formatCurrency(budget.daDung)}
            </p>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="px-5 pb-5">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${getProgressColor(percent)}`}
               style={{ width: `${percent}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={getTextColor(percent)}>{percent.toFixed(0)}% đã chi</span>
          <span className={percent > 100 ? 'text-red-600 font-medium' : 'text-gray-500'}>
            {isOver ? '⚠️ Vượt' : `Còn ${formatCurrency(budget.hanMuc - budget.daDung)}`}
          </span>
        </div>
      </div>
    </div>
  );
})}
```

**Controller - API ngân sách:**

```csharp
// BE: BE\API_ND\Controllers\NganSachController.cs (dòng 21-40)
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<List<NganSachDto>>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
public async Task<ActionResult<ApiResponse<List<NganSachDto>>>> LayDanhSach(
    [FromQuery] int thang,
    [FromQuery] int nam,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    if (thang is < 1 or > 12)
        return BadRequest(ApiResponse.Fail("Tháng không hợp lệ"));
    if (nam < 2000)
        return BadRequest(ApiResponse.Fail("Năm không hợp lệ"));

    var data = await _nganSachBll.LayDanhSachAsync(userId.Value, thang, nam, ct);
    return Ok(ApiResponse<List<NganSachDto>>.Ok(data, "Lấy danh sách thành công"));
}
```

**Xem giao dịch theo ngân sách:**

```csharp
// BE: NganSachController.cs (dòng 105-115)
[HttpGet("{id:int}/giao-dich")]
[ProducesResponseType(typeof(ApiResponse<List<GiaoDichDto>>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<List<GiaoDichDto>>>> LayGiaoDichTheoNganSach(
    int id, CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var data = await _nganSachBll.LayGiaoDichTheoNganSachAsync(userId.Value, id, ct);
    return Ok(ApiResponse<List<GiaoDichDto>>.Ok(data, "Lấy danh sách giao dịch thành công"));
}
```

#### ④ Kết quả

API trả về danh sách ngân sách với các trường: `nganSachId`, `tenDanhMuc`, `thang`, `nam`, `hanMuc` (hạn mức), `daDung` (số đã chi). Thanh progress bar hiển thị màu xanh khi dưới 50%, vàng 50-80%, cam 80-100%, đỏ khi vượt 100%. Toast notification hiển thị khi xóa thành công.

---

### f) Quản lý mục tiêu tiết kiệm (Tạo, theo dõi tiến độ, cập nhật mục tiêu)

#### ① Mô tả chức năng

Hệ thống cho phép người dùng tạo các mục tiêu tiết kiệm với thông tin: tên mục tiêu, số tiền mục tiêu, ngày bắt đầu và kết thúc, tài khoản liên kết, hình ảnh và màu sắc tùy chỉnh. Người dùng có thể đóng góp tiền vào mục tiêu (cập nhật số dư), xem tiến độ phần trăm hoàn thành, dự đoán thời gian hoàn thành dựa trên tốc độ đóng góp hiện tại. Khi hoàn thành hoặc xóa mục tiêu, số tiền đã tích lũy sẽ được hoàn vào tài khoản liên kết.

#### ② Giao diện người dùng

Trang mục tiêu (`/MucTieu`) hiển thị grid 2 cột với mỗi card gồm: header với hình ảnh/gradient theo cấu hình, tên mục tiêu và số tiền mục tiêu, thông tin số dư và số ngày còn lại, thanh progress phần trăm với màu xanh dương, card dự đoán hiển thị số tiền cần tích lũy thêm mỗi tháng, nút "Nạp thêm tiền tiết kiệm" (màu xanh lá), nút sửa và xóa.

Trạng thái hiển thị: shield icon + "Hoàn thành!" khi đạt 100%, zap icon + "Đang thực hiện" khi chưa đạt. Khi xóa, dialog cảnh báo: "Tiền đã tích lũy sẽ được hoàn vào tài khoản liên kết."

#### ③ Luồng xử lý

**Frontend - Tính toán dự đoán và render:**

```typescript
// FE: fe\features\tinh_nang\muctieu\thanh_phan\DanhSachMucTieu.tsx (dòng 48-70)
const calculateForecast = (target: number, current: number, targetDate: string) => {
  const remaining = target - current;
  if (remaining <= 0) return { days: 0, monthly: 0, status: 'completed' };

  const end = new Date(targetDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { days: 0, monthly: remaining, status: 'overdue' };

  const diffMonths = diffDays / 30;
  const monthlyNeeded = remaining / (diffMonths || 1);

  return {
    days: diffDays,
    monthly: monthlyNeeded,
    status: diffDays < 30 ? 'urgent' : 'on-track'
  };
};
```

**Controller - CRUD mục tiêu:**

```csharp
// BE: BE\API_ND\Controllers\MucTieuController.cs (dòng 49-60)
[HttpPost]
[ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
public async Task<ActionResult<ApiResponse<int>>> TaoMoi(
    [FromBody] TaoMucTieuDto dto,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var id = await _mucTieuBll.TaoMoiAsync(userId.Value, dto, ct);
    return StatusCode(StatusCodes.Status201Created,
        ApiResponse<int>.Ok(id, "Tạo mục tiêu thành công"));
}
```

**Đóng góp vào mục tiêu:**

```csharp
// BE: MucTieuController.cs (dòng 130-142)
[HttpPost("{id:int}/dong-gop")]
[ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status201Created)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
public async Task<ActionResult<ApiResponse<int>>> TaoDongGop(
    int id,
    [FromBody] TaoDongGopMucTieuDto dto,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var dongGopId = await _mucTieuBll.TaoDongGopAsync(userId.Value, id, dto, ct);
    return StatusCode(StatusCodes.Status201Created,
        ApiResponse<int>.Ok(dongGopId, "Tạo đóng góp thành công"));
}
```

#### ④ Kết quả

API trả về `MucTieuDto` với các trường: `mucTieuId`, `tenMucTieu`, `soTienMucTieu`, `soTienHienTai`, `ngayBatDau`, `ngayKetThuc`, `anh`, `mauSac`, `taiKhoanLienKetId`. Tiến độ tính bằng: `(soTienHienTai / soTienMucTieu) * 100`.

Trên UI, khi hoàn thành hiển thị toast "Đã hoàn tiền vào tài khoản liên kết. Mục tiêu đã được ẩn!" Card có icon shield màu xanh khi hoàn thành, icon zap màu vàng khi đang thực hiện.

---

### g) Báo cáo & Thống kê (Tổng hợp thu/chi, Biểu đồ phân bổ, Báo cáo ngân sách/mục tiêu)

#### ① Mô tả chức năng

Hệ thống cung cấp module báo cáo toàn diện cho phép người dùng xem tổng hợp thu nhập/chi tiêu theo kỳ (tuần, tháng, quý, năm), phân tích chi tiêu theo danh mục với biểu đồ tròn, xem báo cáo chi tiết về tài khoản, ngân sách và mục tiêu tiết kiệm. Dữ liệu có thể xem theo tháng cụ thể hoặc khoảng ngày tùy chọn. Hệ thống hỗ trợ đồng bộ dữ liệu giữa các bảng để đảm bảo tính nhất quán.

#### ② Giao diện người dùng

Trang báo cáo (`/BaoCao`) có các tab: Giao dịch, Tài khoản, Danh mục, Ngân sách, Mục tiêu. Tab Giao dịch hiển thị: 3 card summary (Tổng thu nhập, Tổng chi tiêu, Tiết kiệm), biểu đồ cột đường xu hướng, 2 biểu đồ tròn (phân bổ chi tiêu/thu nhập theo danh mục), bảng top chi tiêu.

Bộ lọc gồm: buttons Tuần/Tháng/Quý/Năm, dropdown chọn tháng, dropdown chọn năm, date picker từ ngày - đến ngày, nút làm mới. Các tab khác hiển thị báo cáo chuyên biệt: biểu đồ tài sản theo loại, so sánh chi tiêu theo danh mục, tiến độ ngân sách, trạng thái mục tiêu.

#### ③ Luồng xử lý

**Frontend - Fetch và hiển thị tổng hợp:**

```typescript
// FE: fe\app\(user)\BaoCao\page.tsx (dòng 128-145)
const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const duration = tinhDuration(dateRange.tuNgay, dateRange.denNgay);
    const data = await layBaoCaoTongHop(
      duration,
      undefined, undefined,
      dateRange.tuNgay || undefined,
      dateRange.denNgay || undefined
    );
    const normalized = normalizeSummary(data);
    setSummary(normalized);
  } catch (error) {
    console.error('[BaoCao] Error:', error);
    setSummary({ TongThu: 0, TongChi: 0, SoGiaoDich: 0 });
  } finally {
    setLoading(false);
  }
}, [dateRange.tuNgay, dateRange.denNgay]);
```

**Controller - API tổng hợp:**

```csharp
// BE: BE\API_ND\Controllers\BaoCaoController.cs (dòng 21-55)
[HttpGet("tong-hop")]
[ProducesResponseType(typeof(ApiResponse<BaoCaoTongHopChiSoDto>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<BaoCaoTongHopChiSoDto>>> TongHop(
    [FromQuery] string duration = "month",
    [FromQuery] int? thang = null,
    [FromQuery] int? nam = null,
    [FromQuery] string? tuNgay = null,
    [FromQuery] string? denNgay = null,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    DateTime? fromDate = null, toDate = null;
    if (!string.IsNullOrEmpty(tuNgay) && DateTime.TryParse(tuNgay, out var parsedTuNgay))
        fromDate = new DateTime(parsedTuNgay.Year, parsedTuNgay.Month, parsedTuNgay.Day, 0, 0, 0)
                   .ToVietnamTime().ToUtc();
    if (!string.IsNullOrEmpty(denNgay) && DateTime.TryParse(denNgay, out var parsedDenNgay))
        toDate = new DateTime(parsedDenNgay.Year, parsedDenNgay.Month, parsedDenNgay.Day, 23, 59, 59)
                 .ToVietnamTime().ToUtc();

    var data = await _bll.LayTongHopChiSoAsync(
        userId.Value, duration, thang, nam, fromDate, toDate, ct);
    return Ok(ApiResponse<BaoCaoTongHopChiSoDto>.Ok(data, "Lấy tổng hợp thành công"));
}
```

**Báo cáo phân bổ danh mục:**

```csharp
// BE: BaoCaoController.cs (dòng 75-92)
[HttpGet("phan-bo-danh-muc")]
[ProducesResponseType(typeof(ApiResponse<PhanBoDanhMucDto>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<PhanBoDanhMucDto>>> PhanBoDanhMuc(
    [FromQuery] string duration = "month",
    [FromQuery] int? thang = null,
    [FromQuery] int? nam = null,
    [FromQuery] string loai = "CHI",
    [FromQuery] DateTime? tuNgay = null,
    [FromQuery] DateTime? denNgay = null,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var data = await _bll.LayPhanBoDanhMucAsync(
        userId.Value, duration, thang, nam, loai, tuNgay, denNgay, ct);
    return Ok(ApiResponse<PhanBoDanhMucDto>.Ok(data, "Lấy phân bổ thành công"));
}
```

#### ④ Kết quả

API trả về dữ liệu tổng hợp với các trường: `TongThu`, `TongChi`, `SoGiaoDich`, `SoDuThuan`. Biểu đồ sử dụng ApexCharts hoặc Recharts để render. Trên UI, loading skeleton hiển thị trong khi fetch data. Số liệu format theo locale Việt Nam với đơn vị VND.

---

### h) Nhắc nhở & Thông báo (Tạo nhắc nhở, Xem/đánh dấu đọc thông báo)

#### ① Mô tả chức năng

Hệ thống cho phép người dùng tạo các nhắc nhở cho các sự kiện tài chính (nhắc thanh toán hóa đơn, nhắc tiết kiệm, nhắc đóng góp mục tiêu) và xem danh sách thông báo được tạo bởi hệ thống và AI. Thông báo được phân loại: cảnh báo (loại 2), gợi ý (loại 3), dự đoán (loại 4). Người dùng có thể đánh dấu thông báo đã đọc từng cái hoặc đánh dấu tất cả cùng lúc.

#### ② Giao diện người dùng

Trang thông báo (`/ThongBao`) hiển thị: header với tiêu đề "Thông báo", số thông báo chưa đọc, nút "Làm mới" và nút "Đánh dấu tất cả đã đọc" (hiện khi có thông báo chưa đọc).

Bộ lọc gồm: buttons "Tất cả / Chưa đọc / Đã đọc" (badge số lượng chưa đọc), buttons lọc theo loại "Cảnh báo / Gợi ý / Dự đoán". Danh sách thông báo dạng card với: icon theo loại (AlertTriangle vàng, Lightbulb xanh lá, TrendingUp tím), tiêu đề, nội dung (tối đa 2 dòng), thời gian tạo (định dạng tương đối: "Vừa xong", "5 phút trước", "2 giờ trước"), dot xanh cho chưa đọc, badge trạng thái. Thông báo chưa đọc có border xanh dương và shadow.

#### ③ Luồng xử lý

**Frontend - Fetch và đánh dấu đã đọc:**

```typescript
// FE: fe\app\(user)\ThongBao\page.tsx (dòng 31-45)
const taiThongBao = useCallback(async () => {
  try {
    setLoading(true);
    const data = await layThongBao(1, 100);
    setThongBaos(data);
  } catch (err) {
    console.error('Lỗi khi tải thông báo:', err);
  } finally {
    setLoading(false);
  }
}, []);

const handleDanhDauDaDoc = async (id: number) => {
  try {
    await danhDauDaDoc(id);
    setThongBaos(prev => prev.map(tb =>
      tb.thongBaoId === id ? { ...tb, daDoc: true } : tb
    ));
  } catch (err) {
    console.error('Lỗi khi đánh dấu đã đọc:', err);
  }
};
```

**Controller - API thông báo:**

```csharp
// BE: BE\API_ND\Controllers\NhacNhoController.cs (dòng 21-31)
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<List<NhacNhoDto>>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<List<NhacNhoDto>>>> LayDanhSach(
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var data = await _bll.LayDanhSachAsync(userId.Value, ct);
    return Ok(ApiResponse<List<NhacNhoDto>>.Ok(data, "Lấy danh sách thành công"));
}
```

**Cập nhật trạng thái thông báo:**

```csharp
// BE: NhacNhoController.cs (dòng 94-108)
[HttpPut("{id:int}/trang-thai")]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
public async Task<ActionResult<ApiResponse>> CapNhatTrangThai(
    int id,
    [FromBody] CapNhatTrangThaiNhacNhoDto dto,
    CancellationToken ct = default)
{
    var userId = GetUserId();
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    var thanhCong = await _bll.CapNhatTrangThaiAsync(userId.Value, id, dto.TrangThai, ct);
    if (!thanhCong)
        return NotFound(ApiResponse.Fail("Không tìm thấy nhắc nhở"));

    return Ok(ApiResponse.Ok("Cập nhật trạng thái thành công"));
}
```

#### ④ Kết quả

API trả về `ThongBaoDto[]` với các trường: `thongBaoId`, `tieuDe`, `noiDung`, `loaiThongBao`, `ngayTao`, `daDoc`. Thông báo chưa đọc có `daDoc: false`, hiển thị border xanh dương. Khi đánh dấu thành công, UI cập nhật ngay mà không cần reload.

Trên UI, header hiển thị "Bạn có X thông báo chưa đọc" hoặc "Tất cả thông báo đã được đọc". Thông báo có dot xanh bên phải khi chưa đọc.

---

### i) Tích hợp AI – OpenRouter/NVIDIA Nemotron 3 Super (Gợi ý chi tiêu thông minh, Lịch sử hội thoại)

#### ① Mô tả chức năng

Hệ thống tích hợp AI thông qua OpenRouter API sử dụng model NVIDIA Nemotron 3 Super để cung cấp các tính năng thông minh: Cố vấn tài chính AI chatbot cho phép người dùng hỏi đáp về tài chính cá nhân, phân tích chi tiêu tự động, gợi ý tiết kiệm, dự đoán chi tiêu tháng tới. AI có thể trả lời bằng text, kèm biểu đồ, danh sách có cấu trúc, và các action buttons để thực hiện hành động nhanh (tạo ngân sách, xem báo cáo).

#### ② Giao diện người dùng

Trang Trung tâm AI (`/TrungTamAI`) và widget Cố vấn AI (có thể mở từ bất kỳ trang nào) có giao diện: header với icon Sparkles, tiêu đề "Cố Vấn NVIDIA Nemotron 3 Super", mô tả "Chuyên gia tài chính 24/7".

Phần quick actions với 5 buttons: "Phân tích chi tiêu", "Xem biểu đồ chi tiêu", "Gợi ý tiết kiệm", "Lập kế hoạch", "Tư vấn đầu tư". Area chat với messages hiển thị dạng bubble (user bên phải màu indigo, assistant bên trái màu xám), hỗ trợ markdown rendering, biểu đồ ApexCharts inline, danh sách có icon, action buttons.

Input với nút gửi, gợi ý quick questions khi input rỗng. Chat container có thể resize được (kéo góc phải dưới).

#### ③ Luồng xử lý

**Frontend - Gửi tin nhắn và nhận phản hồi:**

```typescript
// FE: fe\features\tinh_nang\trungtam_ai\thanh_phan\CoVanAIChuyenSau.tsx (dòng 202-264)
const sendMessage = async (text: string, type: QuickAction['type'] = 'TU_DO') => {
  if (!text.trim() || isLoading) return;

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: text,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);
  setShowQuickActions(false);

  const history: GeminiChatMessage[] = messages.slice(-10).map(m => ({
    vaiTro: m.role === 'user' ? 'user' : 'model',
    noiDung: m.content
  }));

  try {
    const response = await geminiChat(text, history, type);
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.phanHoi,
      timestamp: new Date(),
      type: response.loaiPhanHoi as ChatMessage['type'],
      actions: response.goiYHanDong,
      duLieuBieuDo: response.duLieuBieuDo,
      duLieuDanhSach: response.duLieuDanhSach
    };
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error: any) {
    if (error.status === 401) {
      router.push('/DangNhap?session=expired');
      return;
    }
    // Hiển thị thông báo lỗi trong chat
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: error.message || 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu.',
      timestamp: new Date(),
      type: 'WARNING'
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

**Controller - API chat với AI:**

```csharp
// BE: BE\API_ND\Controllers\AiController.cs (dòng 96-117)
[HttpPost("gemini/chat")]
public async Task<ActionResult<GeminiChatResponse>> ChatVoiGemini(
    [FromBody] GeminiChatRequest request,
    CancellationToken ct = default)
{
    var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    if (!int.TryParse(userIdClaim, out var userId))
        return Unauthorized("Invalid token");

    if (string.IsNullOrWhiteSpace(request.TinNhan))
        return BadRequest("Tin nhan khong duoc trong");

    var result = await _bll.ChatVoiGeminiAsync(
        userId,
        request.TinNhan,
        request.LichSuTinNhan,
        request.LoaiYeuCau,
        ct);

    return Ok(result);
}
```

**Dự đoán chi tiêu:**

```csharp
// BE: AiController.cs (dòng 22-31)
[HttpGet("dudoan")]
public async Task<ActionResult<DuDoanAIChartDto>> DuDoan(
    [FromQuery] int? thang = null,
    [FromQuery] int? nam = null,
    CancellationToken ct = default)
{
    var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    if (!int.TryParse(userIdClaim, out var userId))
        return Unauthorized("Invalid token");

    var data = await _bll.LayDuDoanAsync(userId, thang, nam, ct);
    return Ok(data);
}
```

#### ④ Kết quả

API trả về `GeminiChatResponse` với các trường: `phanHoi` (text), `loaiPhanHoi` (TEXT/SUGGESTION/ACTION/WARNING/LIST), `goiYHanDong` (danh sách action buttons), `duLieuBieuDo` (dữ liệu chart), `duLieuDanhSach` (dữ liệu list).

Trên UI, khi AI đang xử lý hiển thị "AI đang suy nghĩ..." với spinner. Phản hồi được parse và hiển thị: text thường, structured text (##TIEUDE##, ###SUBTIEUDE###, -ITEM~, NUMBER.), biểu đồ inline, danh sách với icon, action buttons có thể click để gửi prompt mới.

---

## 4.2.2 Các chức năng phân hệ Quản trị

Phân hệ quản trị cung cấp các công cụ để quản lý người dùng, giám sát hệ thống và xem báo cáo tổng quan. Truy cập phân hệ này yêu cầu tài khoản có vai trò "admin".

### a) Quản lý người dùng (Xem danh sách, Tìm kiếm, Khoá/Mở khoá tài khoản)

#### ① Mô tả chức năng

Chức năng cho phép admin xem danh sách toàn bộ người dùng trong hệ thống với khả năng tìm kiếm, lọc theo trạng thái, và thực hiện khoá/mở khoá tài khoản. Khi khoá tài khoản, người dùng không thể đăng nhập nhưng dữ liệu vẫn được giữ nguyên. Admin có thể xem chi tiết thông tin người dùng bao gồm: họ tên, email, số điện thoại, ngày đăng ký, trạng thái tài khoản, vai trò.

#### ② Giao diện người dùng

Trang quản lý người dùng (`/admin/NguoiDung`) hiển thị: header với tiêu đề "Quản lý người dùng", ô tìm kiếm theo tên/email, dropdown lọc theo trạng thái (Tất cả / Hoạt động / Bị khoá), bảng dữ liệu với các cột: avatar + họ tên, email, số điện thoại, ngày đăng ký, vai trò, trạng thái (badge), thao tác.

Thao tác gồm: xem chi tiết (navigate đến `/admin/NguoiDung/[id]`), khoá/mở khoá (toggle button). Modal xác nhận xuất hiện khi khoá tài khoản với thông điệp cảnh báo.

#### ③ Luồng xử lý

**Controller - API quản lý người dùng (Backend):**

Backend cung cấp các API trong `API_QT\Controllers\NguoiDungController.cs`:

```csharp
// API lấy danh sách với phân trang và tìm kiếm
[HttpGet]
public async Task<ActionResult<ApiResponse<PagedResult<NguoiDungDto>>>> GetAll(
    [FromQuery] string? search = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] bool? isActive = null,
    CancellationToken ct = default)
{
    var result = await _nguoiDungBll.GetAllAsync(search, page, pageSize, isActive, ct);
    return Ok(ApiResponse<PagedResult<NguoiDungDto>>.Ok(result));
}

// Khoá/Mở khoá tài khoản
[HttpPut("{id:int}/trang-thai")]
public async Task<ActionResult<ApiResponse>> UpdateStatus(
    int id,
    [FromBody] UpdateStatusDto dto,
    CancellationToken ct = default)
{
    var success = await _nguoiDungBll.UpdateStatusAsync(id, dto.IsActive, ct);
    if (!success)
        return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));

    return Ok(ApiResponse.Ok(dto.IsActive ? "Đã mở khoá tài khoản" : "Đã khoá tài khoản"));
}
```

#### ④ Kết quả

API trả về `PagedResult<NguoiDungDto>` với cấu trúc: `{ items: NguoiDungDto[], totalCount, page, pageSize, totalPages }`. Mỗi `NguoiDungDto` gồm: `nguoiDungId`, `hoTen`, `email`, `soDienThoai`, `ngayDangKy`, `trangThai` (true = hoạt động, false = bị khoá), `vaiTro`.

Trên UI, toggle khoá/mở khoá cập nhật ngay badge trạng thái mà không cần reload. Toast notification hiển thị kết quả thao tác.

---

### b) Nhật ký hệ thống (Xem Audit Log, Lịch sử đăng nhập)

#### ① Mô tả chức năng

Hệ thống ghi nhận và lưu trữ các hoạt động quan trọng bao gồm: nhật ký đăng nhập (IP, thiết bị, thời gian, kết quả), nhật ký hành động người dùng (tạo/sửa/xoá dữ liệu). Admin có thể xem, tìm kiếm và lọc nhật ký theo người dùng, loại hành động, khoảng thời gian. Tính năng này phục vụ mục đích kiểm toán và phát hiện các hoạt động bất thường.

#### ② Giao diện người dùng

Trang giám sát (`/admin/GiamSat`) có các tab: Nhật ký, Phiên, Import. Tab Nhật ký hiển thị: bảng với cột thời gian, người dùng, hành động, mô tả chi tiết, địa chỉ IP. Tab Phiên hiển thị: danh sách phiên đăng nhập đang hoạt động với thông tin thiết bị, IP, thời gian đăng nhập, có nút "Thu hồi phiên" nếu phát hiện truy cập bất thường.

#### ③ Luồng xử lý

**Controller - API audit log:**

```csharp
// Backend sử dụng AuditLogBll và AuditLogDal
// Ghi log khi có hành động
await _auditLogBll.GhiLogAsync(new AuditLogDto {
    NguoiDungId = userId,
    HanhDong = action,
    MoTa = description,
    DiaChiIp = ip,
    ThoiGian = DateTime.UtcNow
});

// API lấy danh sách log
[HttpGet("nhat-ky")]
public async Task<ActionResult<ApiResponse<PagedResult<AuditLogDto>>>> GetAuditLogs(
    [FromQuery] int? nguoiDungId = null,
    [FromQuery] string? hanhDong = null,
    [FromQuery] DateTime? tuNgay = null,
    [FromQuery] DateTime? denNgay = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50,
    CancellationToken ct = default)
{
    var result = await _auditLogBll.GetLogsAsync(
        nguoiDungId, hanhDong, tuNgay, denNgay, page, pageSize, ct);
    return Ok(ApiResponse<PagedResult<AuditLogDto>>.Ok(result));
}
```

#### ④ Kết quả

API trả về danh sách audit log với thông tin chi tiết về từng hành động. Trên UI, bảng hiển thị dữ liệu với phân trang, có thể export ra file để lưu trữ.

---

### c) Dashboard tổng quan Admin (Thống kê số người dùng, giao dịch toàn hệ thống)

#### ① Mô tả chức năng

Dashboard quản trị cung cấp cái nhìn tổng quan về hệ thống thông qua các số liệu thống kê: tổng số người dùng, số người dùng hoạt động, tổng số giao dịch, tổng giá trị giao dịch, biểu đồ xu hướng hoạt động theo thời gian. Dashboard được cập nhật theo thời gian thực hoặc có nút làm mới để admin nắm bắt tình trạng hệ thống.

#### ② Giao diện người dùng

Trang admin chính (`/admin`) hiển thị: header với "Dashboard Quản trị", thời gian cập nhật, nút làm mới. 4 stat cards: Tổng người dùng, Người dùng hoạt động, Tổng giao dịch, Tổng giá trị giao dịch (VND). Biểu đồ đường xu hướng giao dịch theo tháng. Bảng top 10 người dùng nhiều giao dịch nhất.

#### ③ Luồng xử lý

**Controller - API Dashboard:**

```csharp
// BE: API_QT\Controllers\TongQuanController.cs
[HttpGet]
public async Task<ActionResult<ApiResponse<AdminDashboardDto>>> GetDashboard(
    CancellationToken ct = default)
{
    var data = await _dashboardBll.GetStatisticsAsync(ct);
    return Ok(ApiResponse<AdminDashboardDto>.Ok(data));
}

public class AdminDashboardDto {
    public int TongNguoiDung { get; set; }
    public int NguoiDungHoatDong { get; set; }
    public int TongGiaoDich { get; set; }
    public decimal TongGiaTriGiaoDich { get; set; }
    public List<MonthlyStats> XuHuongGiaoDich { get; set; }
    public List<TopUserDto> TopNguoiDung { get; set; }
}
```

#### ④ Kết quả

API trả về `AdminDashboardDto` chứa toàn bộ số liệu thống kê cần thiết. Trên UI, stat cards hiển thị số liệu với icon tương ứng. Biểu đồ sử dụng ApexCharts hoặc Recharts. Loading skeleton hiển thị trong khi fetch data.

---

## 4.2.3 Tổng kết

Phần 4.2 đã trình bày chi tiết quá trình xây dựng các chức năng cho hệ thống Quản lý Chi tiêu Cá nhân. Hệ thống được xây dựng theo kiến trúc N-Layer với Backend ASP.NET Core 9.0 (API_ND, BLL, DAL) và Frontend Next.js/React.js, sử dụng MySQL làm cơ sở dữ liệu và JWT Bearer Token cho xác thực.

Tất cả các chức năng đều tuân thủ quy trình chuẩn: Frontend gửi yêu cầu qua API Controller → Controller xử lý validation và phân quyền → Business Logic Layer (BLL) thực hiện nghiệp vụ → Data Access Layer (DAL) tương tác với Database thông qua Entity Framework Core. Kết quả được đóng gói theo format `ApiResponse<T>` chuẩn và trả về cho Frontend để hiển thị.

Hệ thống đảm bảo tính bảo mật thông qua JWT authentication, authorization theo vai trò, và audit logging cho các hoạt động quan trọng. Giao diện người dùng được thiết kế responsive, thân thiện với người dùng, có loading states, error handling, và feedback ngay lập tức qua toast notifications.
