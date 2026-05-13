# 4.1 XÂY DỰNG WEB API

─────────────────────────────────────

## 4.1.1 Giới thiệu công nghệ sử dụng

- **Framework:** ASP.NET Core 9.0 (`.NET 9.0`)
- **Kiến trúc:** N-Layer Architecture với sự phân tách rõ ràng giữa các tầng:
  - **API Layer (Controllers):** Xử lý HTTP request/response
  - **Business Logic Layer (BLL):** Chứa logic nghiệp vụ
  - **Data Access Layer (DAL):** Tương tác với cơ sở dữ liệu
  - **Models Layer:** Định nghĩa Entity, Database Context
  - **DTO Layer:** Data Transfer Objects cho request/response
  - **Common Layer:** Các class dùng chung (helpers, middleware, configuration)

- **Các thư viện chính:**

| Thư viện | Phiên bản | Mô tả |
|----------|-----------|-------|
| `Pomelo.EntityFrameworkCore.MySql` | 9.0.0 | ORM cho MySQL |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | 9.0.0 | Xác thực JWT |
| `Swashbuckle.AspNetCore` | 6.9.0 | Tạo tài liệu Swagger |
| `BCrypt.Net-Next` | 4.1.0 | Mã hóa mật khẩu |
| `ClosedXML` | 0.102.3 | Xuất file Excel |
| `Mscc.GenerativeAI` | 3.1.0 | Tích hợp Google Gemini AI |

- **Pattern áp dụng:**
  - **Repository Pattern:** Tầng DAL cung cấp các interface và implementation riêng biệt cho từng entity
  - **Unit of Work:** Quản lý transaction và đảm bảo tính nhất quán dữ liệu
  - **Dependency Injection:** Toàn bộ service được đăng ký và inject qua constructor
  - **DTO Pattern:** Sử dụng DTO để truyền dữ liệu giữa các tầng, tách biệt Model và API response

─────────────────────────────────────

## 4.1.2 Cấu trúc dự án

Project Backend được tổ chức theo cấu trúc multi-project solution:

```
BE/
├── BE/
│   ├── API_ND/                    # API chính (Người Dùng)
│   │   ├── Controllers/           # Các Controller xử lý API endpoints
│   │   ├── Program.cs              # Cấu hình và khởi tạo ứng dụng
│   │   └── appsettings.json        # Cấu hình (connection string, JWT, email...)
│   ├── API_QT/                    # API Quản Trị (Admin)
│   │   ├── Controllers/
│   │   └── Program.cs
│   ├── BLL/                       # Business Logic Layer
│   │   ├── Interfaces/             # Interface của các service
│   │   ├── *.cs                   # Implementation các service
│   │   └── AIQuery/               # AI Query Database services
│   ├── DAL/                       # Data Access Layer
│   │   ├── Interfaces/            # Interface của repository
│   │   └── *.cs                   # Implementation đọc/ghi database
│   ├── Models/                    # Entity Framework Models
│   │   ├── Data/
│   │   │   └── AppDbContext.cs    # DbContext chính
│   │   └── Tbl*.cs                # Các Entity class
│   ├── DTO/                       # Data Transfer Objects
│   │   └── *.cs                   # Các DTO cho request/response
│   └── Common/                     # Các class dùng chung
│       ├── ApiResponse.cs         # Wrapper response chuẩn
│       ├── GlobalExceptionHandlerMiddleware.cs
│       ├── TimeHelper.cs          # Xử lý timezone
│       └── CauHinh*.cs            # Configuration classes
```

- **Giải thích vai trò từng tầng/folder:**

| Tầng | Vai trò |
|------|---------|
| `API_ND/Controllers` | Nhận HTTP request, validate input, gọi BLL, trả về response |
| `BLL` | Chứa logic nghiệp vụ, validation, xử lý business rules |
| `DAL` | Tương tác trực tiếp với database, thực hiện CRUD operations |
| `Models` | Định nghĩa cấu trúc bảng (Entity), DbContext, relationships |
| `DTO` | Định nghĩa cấu trúc dữ liệu truyền nhận (request/response) |
| `Common` | Middleware xử lý lỗi, helper classes, configuration models |

─────────────────────────────────────

## 4.1.3 Cấu hình hệ thống (Program.cs)

### Cấu hình kết nối Database (Connection String)

```csharp
// appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "Server=db47043.public.databaseasp.net; Database=db47043; Uid=db47043; Pwd=Nm3%w8?H_C7j; SslMode=Preferred;Command Timeout=120;"
}

// Program.cs - Đăng ký DbContext với MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions => {
            mySqlOptions.CommandTimeout(120);
            mySqlOptions.EnableRetryOnFailure(0);
        }
    )
);
```

### Đăng ký Dependency Injection

```csharp
// Auth services
builder.Services.AddScoped<INguoiDungDal, NguoiDungDal>();
builder.Services.AddScoped<IXacThucBll, XacThucBll>();
builder.Services.AddScoped<IDichVuJwt, DichVuJwt>();

// Business services
builder.Services.AddScoped<IGiaoDichBll, GiaoDichBll>();
builder.Services.AddScoped<ITaiKhoanBll, TaiKhoanBll>();
builder.Services.AddScoped<IDanhMucBll, DanhMucBll>();
builder.Services.AddScoped<INganSachBll, NganSachBll>();
builder.Services.AddScoped<IBaoCaoBll, BaoCaoBll>();
builder.Services.AddScoped<IAiBll, AiBll>();
// ... và nhiều service khác
```

### Cấu hình CORS

```csharp
builder.Services.AddCors(tuyChon =>
{
    tuyChon.AddDefaultPolicy(chinhSach =>
    {
        chinhSach
            .WithOrigins(
                "http://10.49.145.68:3000",
                "http://localhost:3000",
                "http://localhost:5188")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
```

### Cấu hình Swagger/OpenAPI

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API_ND", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { /* ... */ });
    c.OperationFilter<SwaggerFileOperationFilter>();
});
```

### Cấu hình Authentication/Authorization (JWT)

```csharp
builder.Services.Configure<CauHinhJwt>(builder.Configuration.GetSection("Jwt"));

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        var jwtSecret = jwtSettings["KhoaBiMat"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["PhatHanh"],
            ValidAudience = jwtSettings["KhanGia"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
```

### Middleware Pipeline

```csharp
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseGlobalExceptionHandler();    // Xử lý exception toàn cục
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

─────────────────────────────────────

## 4.1.4 Thiết kế Database Context & Entity

### DbContext chính

```csharp
// Models/Data/AppDbContext.cs
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    {
        this.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
    }
    
    // Khai báo DbSet cho tất cả các bảng
    public DbSet<TblNguoidung> TblNguoidungs { get; set; }
    public DbSet<TblGiaodich> TblGiaodiches { get; set; }
    public DbSet<TblTaikhoan> TblTaikhoans { get; set; }
    // ... 60+ DbSet khác
}
```

### Các Entity/Table chính

| Entity | Bảng | Mô tả |
|--------|------|-------|
| `TblNguoidung` | `tbl_nguoidung` | Thông tin người dùng |
| `TblGiaodich` | `tbl_giaodich` | Giao dịch (chi tiêu, thu nhập, chuyển khoản) |
| `TblTaikhoan` | `tbl_taikhoan` | Tài khoản tài chính |
| `TblDanhmuc` | `tbl_danhmuc` | Danh mục chi tiêu |
| `TblMuctieu` | `tbl_muctieu` | Mục tiêu tiết kiệm |
| `TblNgansach` | `tbl_ngansach` | Ngân sách tháng |
| `TblVaitro` | `tbl_vaitro` | Vai trò (Admin, User) |
| `TblToken` | `tbl_token` | Refresh token |
| `TblAuditLog` | `tbl_audit_log` | Nhật ký thao tác |

### Mối quan hệ giữa các Entity

```
TblNguoidung (1) ────── (n) TblGiaodich
       │                        │
       │                        ├── (n) TblDanhmuc
       │                        │
       │                        └── (n) TblTaikhoan
       │
       ├── (n) TblTaikhoan (sở hữu)
       ├── (n) TblDanhmuc (tạo)
       ├── (n) TblMuctieu
       ├── (n) TblNgansach
       ├── (n) TblVaitro (qua TblNguoidungVaitro - n-n)
       └── (n) TblToken (refresh token)

TblTaikhoan (1) ────── (n) TblGiaodich (tài khoản nguồn)
       │
       └── (n) TblGiaodich (tài khoản đích - có thể null)

TblDanhmuc (1) ────── (n) TblGiaodich
       │
       └── (n) TblNgansach (ngân sách theo danh mục)
```

**Chi tiết mối quan hệ trong OnModelCreating:**

```csharp
// Một-người-dùng có nhiều-giao-dịch
modelBuilder.Entity<TblGiaodich>()
    .HasOne(g => g.NguoiDung)
    .WithMany(u => u.TblGiaodiches)
    .HasForeignKey(g => g.NguoiDungId);

// Một-giao-dịch thuộc một-tài-khoản (nguồn)
modelBuilder.Entity<TblGiaodich>()
    .HasOne(g => g.TaiKhoan)
    .WithMany(t => t.TblGiaodichTaiKhoans)
    .HasForeignKey(g => g.TaiKhoanId)
    .OnDelete(DeleteBehavior.Restrict);

// Người-dùng có nhiều-vai-trò (n-n)
modelBuilder.Entity<TblNguoidungVaitro>()
    .HasKey(uv => new { uv.NguoiDungId, uv.VaiTroId });
```

─────────────────────────────────────

## 4.1.5 Thiết kế API Endpoint

### XacThucController (Đăng nhập, Đăng ký, Quản lý token)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 1 | POST | `/api/xacthuc/dang-nhap` | Đăng nhập bằng email/password | Không |
| 2 | POST | `/api/xacthuc/dang-ky` | Đăng ký tài khoản mới | Không |
| 3 | POST | `/api/xacthuc/dang-nhap-mang-xa-hoi` | Đăng nhập Google/Facebook | Không |
| 4 | POST | `/api/xacthuc/lam-moi-token` | Làm mới Access Token | Không |
| 5 | POST | `/api/xacthuc/dang-xuat` | Đăng xuất (revoke token) | Không |
| 6 | POST | `/api/xacthuc/gui-otp` | Gửi mã OTP qua email | Không |
| 7 | POST | `/api/xacthuc/xac-thuc-otp` | Xác thực mã OTP | Không |
| 8 | POST | `/api/xacthuc/dat-lai-mat-khau` | Đặt lại mật khẩu mới | Không |

### NguoiDungController (Quản lý người dùng)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 9 | GET | `/api/nguoidung/me` | Lấy thông tin người dùng hiện tại | Bearer Token |
| 10 | PUT | `/api/nguoidung/me` | Cập nhật thông tin cá nhân | Bearer Token |

### GiaoDichController (Quản lý giao dịch)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 11 | GET | `/api/giao-dich` | Lấy danh sách giao dịch (phân trang, lọc) | Bearer Token |
| 12 | GET | `/api/giao-dich/{id}` | Lấy chi tiết một giao dịch | Bearer Token |
| 13 | POST | `/api/giao-dich` | Tạo giao dịch mới | Bearer Token |
| 14 | POST | `/api/giao-dich/tao-voi-kiem-tra` | Tạo giao dịch với kiểm tra ngân sách | Bearer Token |
| 15 | PUT | `/api/giao-dich/{id}` | Cập nhật giao dịch | Bearer Token |
| 16 | POST | `/api/giao-dich/preview-update` | Xem trước thay đổi | Bearer Token |
| 17 | DELETE | `/api/giao-dich/{id}` | Xóa giao dịch | Bearer Token |
| 18 | GET | `/api/giao-dich/xuat-csv` | Xuất danh sách ra CSV | Bearer Token |
| 19 | POST | `/api/giao-dich/xuat-csv` | Xuất danh sách ra CSV (POST) | Bearer Token |
| 20 | POST | `/api/giao-dich/xuat-excel` | Xuất danh sách ra Excel | Bearer Token |

### TaiKhoanController (Quản lý tài khoản tài chính)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 21 | GET | `/api/tai-khoan` | Lấy danh sách tài khoản | Bearer Token |
| 22 | GET | `/api/tai-khoan/{id}` | Lấy chi tiết tài khoản | Bearer Token |
| 23 | POST | `/api/tai-khoan` | Tạo tài khoản mới | Bearer Token |
| 24 | PUT | `/api/tai-khoan/{id}` | Cập nhật tài khoản | Bearer Token |
| 25 | DELETE | `/api/tai-khoan/{id}` | Xóa tài khoản | Bearer Token |
| 26 | PUT | `/api/tai-khoan/{id}/trang-thai` | Cập nhật trạng thái (Ẩn/Hiện) | Bearer Token |
| 27 | POST | `/api/tai-khoan/chuyen-tien-noi-bo` | Chuyển tiền nội bộ | Bearer Token |

### DanhMucController (Quản lý danh mục)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 28 | GET | `/api/danh-muc` | Lấy danh sách danh mục | Bearer Token |
| 29 | GET | `/api/danh-muc/{id}` | Lấy chi tiết danh mục | Bearer Token |
| 30 | POST | `/api/danh-muc` | Tạo danh mục mới | Bearer Token |
| 31 | PUT | `/api/danh-muc/{id}` | Cập nhật danh mục | Bearer Token |
| 32 | DELETE | `/api/danh-muc/{id}` | Xóa danh mục | Bearer Token |

### BaoCaoController (Báo cáo và thống kê)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 33 | GET | `/api/bao-cao/tong-hop` | Tổng hợp chi số (thu/chi) | Bearer Token |
| 34 | GET | `/api/bao-cao/bieu-do` | Dữ liệu biểu đồ tổng quan | Bearer Token |
| 35 | GET | `/api/bao-cao/phan-bo-danh-muc` | Phân bổ theo danh mục | Bearer Token |
| 36 | GET | `/api/bao-cao/kiem-tra-lech` | Kiểm tra lệch ngân sách | Bearer Token |
| 37 | POST | `/api/bao-cao/dong-bo-ngan-sach` | Đồng bộ ngân sách | Bearer Token |
| 38 | POST | `/api/bao-cao/dong-bo-tong-hop-thang` | Đồng bộ tổng hợp tháng | Bearer Token |
| 39 | GET | `/api/bao-cao/tai-khoan` | Báo cáo tài khoản | Bearer Token |
| 40 | GET | `/api/bao-cao/danh-muc` | Báo cáo theo danh mục | Bearer Token |
| 41 | GET | `/api/bao-cao/ngan-sach` | Báo cáo ngân sách | Bearer Token |
| 42 | GET | `/api/bao-cao/muc-tieu` | Báo cáo mục tiêu tiết kiệm | Bearer Token |

### NganSachController (Quản lý ngân sách)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 43 | GET | `/api/ngan-sach` | Lấy danh sách ngân sách | Bearer Token |
| 44 | POST | `/api/ngan-sach` | Tạo ngân sách tháng | Bearer Token |
| 45 | PUT | `/api/ngan-sach/{id}` | Cập nhật ngân sách | Bearer Token |
| 46 | DELETE | `/api/ngan-sach/{id}` | Xóa ngân sách | Bearer Token |

### MucTieuController (Quản lý mục tiêu)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 47 | GET | `/api/muc-tieu` | Lấy danh sách mục tiêu | Bearer Token |
| 48 | GET | `/api/muc-tieu/{id}` | Lấy chi tiết mục tiêu | Bearer Token |
| 49 | POST | `/api/muc-tieu` | Tạo mục tiêu mới | Bearer Token |
| 50 | PUT | `/api/muc-tieu/{id}` | Cập nhật mục tiêu | Bearer Token |
| 51 | DELETE | `/api/muc-tieu/{id}` | Xóa mục tiêu | Bearer Token |

### NhacNhoController (Quản lý nhắc nhở)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 52 | GET | `/api/nhac-nho` | Lấy danh sách nhắc nhở | Bearer Token |
| 53 | POST | `/api/nhac-nho` | Tạo nhắc nhở | Bearer Token |
| 54 | PUT | `/api/nhac-nho/{id}` | Cập nhật nhắc nhở | Bearer Token |
| 55 | DELETE | `/api/nhac-nho/{id}` | Xóa nhắc nhở | Bearer Token |

### ThongBaoController (Thông báo)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 56 | GET | `/api/thong-bao` | Lấy danh sách thông báo | Bearer Token |
| 57 | PUT | `/api/thong-bao/{id}/doc` | Đánh dấu đã đọc | Bearer Token |
| 58 | DELETE | `/api/thong-bao/{id}` | Xóa thông báo | Bearer Token |

### GiaoDichDinhKyController (Giao dịch định kỳ)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 59 | GET | `/api/giao-dich-dinh-ky` | Danh sách giao dịch định kỳ | Bearer Token |
| 60 | POST | `/api/giao-dich-dinh-ky` | Tạo giao dịch định kỳ | Bearer Token |
| 61 | PUT | `/api/giao-dich-dinh-ky/{id}` | Cập nhật | Bearer Token |
| 62 | DELETE | `/api/giao-dich-dinh-ky/{id}` | Xóa | Bearer Token |

### AiController (Tích hợp AI - Gemini)

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 63 | POST | `/api/ai/goi-y` | Nhận gợi ý chi tiêu từ AI | Bearer Token |
| 64 | GET | `/api/ai/lich-su` | Lịch sử gợi ý | Bearer Token |

### Các Controller khác

| STT | Method | Endpoint | Mô tả | Auth yêu cầu |
|-----|--------|----------|-------|---------------|
| 65 | GET | `/api/loai-tai-khoan` | Loại tài khoản | Bearer Token |
| 66 | GET | `/api/loai-danh-muc` | Loại danh mục | Bearer Token |
| 67 | GET | `/api/cai-dat` | Cài đặt người dùng | Bearer Token |
| 68 | PUT | `/api/cai-dat` | Cập nhật cài đặt | Bearer Token |
| 69 | POST | `/api/upload` | Upload file đính kèm | Bearer Token |
| 70 | GET | `/api/lich-su-dang-nhap` | Lịch sử đăng nhập | Bearer Token |
| 71 | GET | `/api/tong-quan` | Dữ liệu tổng quan dashboard | Bearer Token |

─────────────────────────────────────

## 4.1.6 Cơ chế xác thực và phân quyền

### Loại xác thực: JWT Bearer Token

Hệ thống sử dụng JWT (JSON Web Token) để xác thực và phân quyền người dùng.

### Mô tả flow xác thực

```
1. Đăng nhập (POST /api/xacthuc/dang-nhap)
   └── Backend xác thực email/password
       └── Sinh Access Token (JWT) + Refresh Token
           └── Trả về cho Client

2. Các request tiếp theo
   └── Client gửi kèm Header: Authorization: Bearer {access_token}
       └── Backend decode token, kiểm tra:
           ├── Token còn hạn?
           ├── Signature hợp lệ?
           ├── Issuer/Audience đúng?
           └── Lấy userId từ claim "sub"

3. Access Token hết hạn
   └── Client gọi POST /api/xacthuc/lam-moi-token
       └── Gửi Refresh Token
           └── Backend verify refresh token
               └── Sinh Access Token mới

4. Đăng xuất
   └── Client gọi POST /api/xacthuc/dang-xuat
       └── Backend revoke Refresh Token
```

### Cấu trúc JWT Token

```json
{
  "sub": "123",           // User ID
  "email": "user@example.com",
  "name": "Nguyen Van A",
  "role": "User",
  "iat": 1704067200,      // Issued At
  "exp": 1704070800,      // Expiration (4 tiếng)
  "iss": "API_ND",        // Issuer
  "aud": "AppQuanLyChiTieu" // Audience
}
```

### Các Role trong hệ thống

| Role | Mô tả | Quyền |
|------|-------|-------|
| `User` | Người dùng thông thường | CRUD dữ liệu cá nhân, xem báo cáo |
| `Admin` | Quản trị viên | Quản lý người dùng, xem audit log, cấu hình hệ thống |

### Cách phân quyền trên endpoint

```csharp
// Controller yêu cầu đăng nhập
[ApiController]
[Route("api/giao-dich")]
[Authorize]  // Yêu cầu xác thực JWT
public class GiaoDichController : ControllerBase
{
    // endpoint code...
}

// Controller cho phép truy cập công khai
[ApiController]
[Route("api/xacthuc")]
[AllowAnonymous]  // Cho phép truy cập không cần đăng nhập
public class XacThucController : ControllerBase
{
    // endpoint code...
}

// Endpoint yêu cầu role cụ thể
[Authorize(Roles = "Admin")]
public async Task<IActionResult> QuanLyNguoiDung() { }
```

### Lấy UserId từ Token trong Controller

```csharp
private int? GetUserId()
{
    var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    if (int.TryParse(userIdClaim, out var userId))
        return userId;
    return null;
}
```

─────────────────────────────────────

## 4.1.7 Xử lý lỗi và Response chuẩn

### Cấu trúc Response trả về (ApiResponse)

```csharp
// Response thành công
{
  "success": true,
  "message": "Lấy danh sách thành công",
  "data": { ... },
  "errors": null
}

// Response lỗi
{
  "success": false,
  "message": "Không tìm thấy giao dịch",
  "data": null,
  "errors": null
}

// Response phân trang
{
  "success": true,
  "message": "Thành công",
  "data": {
    "items": [...],
    "totalCount": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Các HTTP Status Code sử dụng

| Status Code | Mô tả | Trường hợp sử dụng |
|-------------|-------|---------------------|
| 200 OK | Thành công | GET thành công, PUT cập nhật thành công |
| 201 Created | Tạo mới thành công | POST tạo bản ghi mới |
| 204 No Content | Không có nội dung | DELETE thành công |
| 400 Bad Request | Yêu cầu không hợp lệ | Validation lỗi, dữ liệu đầu vào sai |
| 401 Unauthorized | Chưa xác thực | Token không hợp lệ hoặc hết hạn |
| 403 Forbidden | Không có quyền | Token hợp lệ nhưng không đủ quyền |
| 404 Not Found | Không tìm thấy | Bản ghi không tồn tại |
| 500 Internal Server Error | Lỗi server | Exception không xử lý được |

### Global Exception Handler / Middleware xử lý lỗi

```csharp
// GlobalExceptionHandlerMiddleware.cs
public class GlobalExceptionHandlerMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = context.Response;
        response.ContentType = "application/json";

        switch (exception)
        {
            case InvalidOperationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
            case UnauthorizedAccessException:
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;
            case KeyNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                break;
            case ArgumentException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
            default:
                _logger.LogError(exception, "Unhandled exception occurred");
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        await response.WriteAsync(JsonSerializer.Serialize(new {
            success = false,
            message = exception.Message,
            statusCode = response.StatusCode
        }));
    }
}
```

### Validation dữ liệu đầu vào

```csharp
// Validation trong Controller (sử dụng ModelState)
[HttpPut("me")]
public async Task<ActionResult> CapNhatMe([FromBody] CapNhatNguoiDungMeDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ", ModelState));
    // ...
}

// Validation trong BLL
public async Task<GiaoDichDto?> LayChiTietAsync(int giaoDichId, int nguoiDungId, ...)
{
    if (giaoDichId <= 0)
        throw new ArgumentException("ID giao dịch không hợp lệ");
    
    var giaoDich = await _giaoDichDal.LayTheoIdAsync(giaoDichId, ct);
    if (giaoDich == null || giaoDich.NguoiDungId != nguoiDungId)
        return null;
    
    return giaoDich;
}
```

─────────────────────────────────────

## 4.1.8 Minh họa một luồng API tiêu biểu

### Luồng: Tạo Giao dịch Chi tiêu (Chi tiêu từ Ví/Tài khoản)

**Yêu cầu:** Người dùng tạo một giao dịch chi tiêu 500.000đ từ tài khoản "Ví tiền" vào danh mục "Ăn uống".

---

#### 1. Request đầu vào

```http
POST /api/giao-dich HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: multipart/form-data

loaiGiaoDich: CHI
soTien: 500000
taiKhoanNguonId: 1
danhMucId: 5
ngayGiaoDich: 2026-05-12
ghiChu: Ăn trưa công ty
```

---

#### 2. Xử lý qua các tầng

**Tầng Controller (`GiaoDichController.cs`):**

```csharp
[HttpPost]
public async Task<ActionResult<ApiResponse<int>>> TaoMoi(
    [FromForm] TaoGiaoDichDto dto,
    CancellationToken ct = default)
{
    var userId = GetUserId();  // Lấy từ JWT token
    if (userId == null)
        return Unauthorized(ApiResponse.Fail("Token không hợp lệ"));

    try
    {
        // Gọi tầng BLL
        var giaoDichId = await _giaoDichBll.TaoMoiAsync(dto, userId.Value, ct);
        
        // Trả về response
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<int>.Ok(giaoDichId, "Tạo giao dịch thành công"));
    }
    catch (Exception ex)
    {
        return BadRequest(ApiResponse.Fail($"Lỗi: {ex.Message}"));
    }
}
```

**Tầng BLL (`GiaoDichBll.cs`):**

```csharp
public async Task<int> TaoMoiAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
{
    // 1. Kiểm tra tài khoản nguồn
    var taiKhoanNguon = await _taiKhoanDal.LayTheoIdAsync(dto.TaiKhoanNguonId, ct);
    if (taiKhoanNguon == null || taiKhoanNguon.NguoiDungId != nguoiDungId)
        throw new InvalidOperationException("Tài khoản nguồn không hợp lệ");

    // 2. Kiểm tra số dư
    if (taiKhoanNguon.SoDu < dto.SoTien)
        throw new InvalidOperationException($"Số dư không đủ. Hiện tại: {taiKhoanNguon.SoDu:N0}đ");

    // 3. Tạo giao dịch (gọi DAL)
    var id = await _giaoDichDal.TaoMoiAsync(dto, nguoiDungId, ct);

    // 4. Cập nhật số dư (CHI - trừ tiền)
    var soDuMoi = taiKhoanNguon.SoDu - dto.SoTien;
    await _taiKhoanDal.CapNhatSoDuAsync(dto.TaiKhoanNguonId, soDuMoi, ct);

    // 5. Ghi audit log
    await _auditLogDal.GhiLogAsync(new TaoAuditLogDto {
        NguoiDungId = nguoiDungId,
        TenBang = "tbl_giaodich",
        BanGhiId = id,
        HanhDong = "INSERT"
    });

    return id;
}
```

**Tầng DAL (`GiaoDichDal.cs`):**

```csharp
public async Task<int> TaoMoiAsync(TaoGiaoDichDto dto, int nguoiDungId, CancellationToken ct = default)
{
    var giaoDich = new TblGiaodich
    {
        NguoiDungId = nguoiDungId,
        TaiKhoanId = dto.TaiKhoanNguonId,
        DanhMucId = dto.DanhMucId,
        LoaiGiaoDich = 2,  // Chi tiêu
        SoTien = dto.SoTien,
        NgayGiaoDich = dto.NgayGiaoDich,
        MoTa = dto.GhiChu,
        NgayTao = TimeHelper.NowInVietnam(),
        TrangThai = 1
    };

    _context.TblGiaodiches.Add(giaoDich);
    await _context.SaveChangesAsync(ct);
    
    return giaoDich.GiaoDichId;
}
```

---

#### 3. Response trả về

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Tạo giao dịch thành công",
  "data": 456,
  "errors": null
}
```

---

#### 4. Sơ đồ luồng xử lý

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                            │
│  POST /api/giao-dich with Bearer Token                              │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTROLLER (GiaoDichController)                  │
│  1. GetUserId() from JWT Token                                      │
│  2. Validate ModelState                                             │
│  3. Call BLL.TaoMoiAsync()                                         │
│  4. Return StatusCode 201 Created                                  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BLL (GiaoDichBll)                                 │
│  1. Validate tài khoản nguồn (sở hữu user?)                       │
│  2. Kiểm tra số dư đủ không                                        │
│  3. Gọi DAL.TaoMoiAsync()                                          │
│  4. Cập nhật số dư (-500.000 cho CHI)                              │
│  5. Ghi Audit Log                                                  │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DAL (GiaoDichDal)                                │
│  1. Tạo TblGiaodich entity                                         │
│  2. _context.TblGiaodiches.Add()                                   │
│  3. _context.SaveChangesAsync()                                    │
│  4. Return GiaoDichId                                              │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MySQL)                             │
│  INSERT INTO tbl_giaodich (...)                                      │
│  UPDATE tbl_taikhoan SET so_du = so_du - 500000 WHERE id = 1       │
│  INSERT INTO tbl_audit_log (...)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

#### 5. Minh họa Database State Changes

**Trước khi tạo giao dịch:**

| Bảng | Dữ liệu |
|------|----------|
| `tbl_taikhoan` | id=1, ten="Ví tiền", so_du=2,000,000đ |
| `tbl_giaodich` | 455 bản ghi |

**Sau khi tạo giao dịch:**

| Bảng | Dữ liệu |
|------|----------|
| `tbl_taikhoan` | id=1, ten="Ví tiền", so_du=1,500,000đ (giảm 500k) |
| `tbl_giaodich` | 456 bản ghi (thêm bản ghi mới: CHI, 500k, danh_muc=5) |
| `tbl_audit_log` | 1 bản ghi mới ghi nhận INSERT |

─────────────────────────────────────
