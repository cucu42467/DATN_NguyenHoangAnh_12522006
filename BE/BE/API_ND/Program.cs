using BLL;
using BLL.Interfaces;
using Common;
using DAL;
using DAL.Interfaces;
using Mscc.GenerativeAI;
using Microsoft.EntityFrameworkCore;
using Models.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.OpenApi.Models;
using BLL.AIQuery;
using BLL.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

// === MEMORY CACHE ===
// Đăng ký IMemoryCache và CacheService cho toàn bộ ứng dụng
builder.Services.AddAppMemoryCache();

builder.Services.Configure<CauHinhJwt>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<CauHinhOAuthMangXaHoi>(builder.Configuration.GetSection("OAuthMangXaHoi"));
builder.Services.Configure<CauHinhEmail>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<CauHinhOtp>(builder.Configuration.GetSection("Otp"));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mySqlOptions =>
        {
            mySqlOptions.CommandTimeout(120);
            mySqlOptions.EnableRetryOnFailure(0);
        }
    )
);

// Đặt execution strategy thành null để tránh conflict với TransactionScope
AppContext.SetSwitch("MySql.Data.EnableExecuteStrategy", false);

builder.Services.AddScoped<INguoiDungDal, NguoiDungDal>();
builder.Services.AddScoped<INguoiDungSocialDal, NguoiDungSocialDal>();
builder.Services.AddScoped<INguoiDungVaitroDal, NguoiDungVaitroDal>();
builder.Services.AddScoped<ITokenDal, TokenDal>();
builder.Services.AddScoped<ILichsuDangnhapDal, LichsuDangnhapDal>();
builder.Services.AddScoped<IOtpDal, OtpDal>();
builder.Services.AddScoped<IResetTokenDal, ResetTokenDal>();
builder.Services.AddScoped<IDichVuJwt, DichVuJwt>();
builder.Services.AddScoped<IXacThucTokenMangXaHoi, XacThucTokenMangXaHoi>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Audit Log - phải đăng ký TRƯỚC các BLL khác
builder.Services.AddScoped<IAuditLogDal, AuditLogDal>();

builder.Services.AddScoped<IXacThucBll, XacThucBll>();
builder.Services.AddScoped<INguoiDungBll, NguoiDungBll>();
builder.Services.AddScoped<IXacThucTokenMangXaHoi, XacThucTokenMangXaHoi>();


// New services for GiaoDich & TaiKhoan
builder.Services.AddScoped<IGiaoDichDal, GiaoDichDal>();
builder.Services.AddScoped<ITaiKhoanDal, TaiKhoanDal>();
builder.Services.AddScoped<ILoaiTaiKhoanDal, LoaiTaiKhoanDal>();
builder.Services.AddScoped<ICaiDatDal, CaiDatDal>();
builder.Services.AddScoped<IDanhMucDal, DanhMucDal>();
builder.Services.AddScoped<ILoaiDanhMucDal, LoaiDanhMucDal>();
builder.Services.AddScoped<INganSachDal, NganSachDal>();
builder.Services.AddScoped<INhacNhoDal, NhacNhoDal>();
builder.Services.AddScoped<ITuKhoaDal, TuKhoaDal>();
builder.Services.AddScoped<ICanhBaoDal, CanhBaoDal>();
builder.Services.AddScoped<ITepDinhKemDal, TepDinhKemDal>();
builder.Services.AddScoped<IMucTieuDal, MucTieuDal>();
builder.Services.AddScoped<IDongGopMucTieuDal, DongGopMucTieuDal>();
builder.Services.AddScoped<IGiaoDichDinhKyDal, GiaoDichDinhKyDal>();
builder.Services.AddScoped<IImportDal, ImportDal>();
builder.Services.AddScoped<IBaoCaoDal, BaoCaoDal>();
builder.Services.AddScoped<IAiDal, AiDal>();
builder.Services.AddScoped<AiService>(); // NEW: AI Service
builder.Services.AddScoped<BLL.Interfaces.ILichsuDangnhapBll, BLL.LichsuDangnhapBll>();
builder.Services.AddScoped<DAL.Interfaces.ILichsuDangnhapDal, DAL.LichsuDangnhapDal>();


// AI Query Database Services
builder.Services.AddScoped<IAiQueryDal, AiQueryDal>();

builder.Services.AddScoped<IGiaoDichBll, GiaoDichBll>();
builder.Services.AddScoped<IGiaoDichService, GiaoDichService>();
builder.Services.AddScoped<ITaiKhoanBll, TaiKhoanBll>();
builder.Services.AddScoped<ILoaiTaiKhoanBll, LoaiTaiKhoanBll>();
builder.Services.AddScoped<ICaiDatBll, CaiDatBll>();
builder.Services.AddScoped<IDanhMucBll, DanhMucBll>();
builder.Services.AddScoped<ILoaiDanhMucBll, LoaiDanhMucBll>();
builder.Services.AddScoped<INganSachBll, NganSachBll>();
builder.Services.AddScoped<INhacNhoBll, NhacNhoBll>();
builder.Services.AddScoped<ITuKhoaBll, TuKhoaBll>();
builder.Services.AddScoped<ICanhBaoBll, CanhBaoBll>();
builder.Services.AddScoped<ITepDinhKemBll, TepDinhKemBll>();
builder.Services.AddScoped<IMucTieuBll, MucTieuBll>();
builder.Services.AddScoped<IGiaoDichDinhKyBll, GiaoDichDinhKyBll>();
builder.Services.AddScoped<IGiaoDichDinhKyService, GiaoDichDinhKyService>();
builder.Services.AddScoped<IImportBll, ImportBll>();
builder.Services.AddScoped<IBaoCaoBll, BaoCaoBll>();
builder.Services.AddScoped<IPhanHoiDal, PhanHoiDal>();
builder.Services.AddScoped<IPhanHoiBll, PhanHoiBll>();
builder.Services.AddScoped<IPhanHoiTraLoiDal, PhanHoiTraLoiDal>();
builder.Services.AddScoped<IPhanHoiTraLoiBll, PhanHoiTraLoiBll>();
builder.Services.AddScoped<IQuyenDal, QuyenDal>();
builder.Services.AddScoped<IQuyenBll, QuyenBll>();
builder.Services.AddScoped<IAiModelDal, AiModelDal>();
builder.Services.AddScoped<IAiModelBll, AiModelBll>();
builder.Services.AddScoped<IChatAiDal, ChatAiDal>();
builder.Services.AddScoped<IChatAiBll, ChatAiBll>();
builder.Services.AddScoped<IThongBaoDal, ThongBaoDal>();
builder.Services.AddScoped<IThongBaoBll, ThongBaoBll>();
builder.Services.AddScoped<IThongBaoService, ThongBaoService>();
builder.Services.AddScoped<ITaiKhoanDal, TaiKhoanDal>();
builder.Services.AddScoped<INhacNhoDal, NhacNhoDal>();
builder.Services.AddScoped<IMucTieuDal, MucTieuDal>();

builder.Services.AddScoped<IAuditLogBll, AuditLogBll>();
builder.Services.AddScoped<ICauHinhDal, CauHinhDal>();
builder.Services.AddScoped<ICauHinhBll, CauHinhBll>();
builder.Services.AddScoped<IPhienBll, PhienBll>();
builder.Services.AddScoped<IAiBll, AiBll>();
builder.Services.AddScoped<ITongQuanBll, TongQuanBll>();
builder.Services.AddScoped<AiQueryService>();
builder.Services.AddScoped<SchemaProvider>();
builder.Services.AddScoped<KeywordMappingService>();
builder.Services.AddScoped<QueryValidationService>();
builder.Services.AddScoped<AiPromptBuilder>();
builder.Services.AddScoped<SqlBuilder>();

// === BACKGROUND SERVICES ===
builder.Services.AddSingleton<GiaoDichDinhKyBackgroundService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<GiaoDichDinhKyBackgroundService>());

// Thông báo tự động - chạy mỗi 1 phút
builder.Services.AddSingleton<ThongBaoBackgroundService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<ThongBaoBackgroundService>());
builder.Services.AddScoped<DAL.Interfaces.IPhienDal, DAL.PhienDal>();
builder.Services.AddScoped<BLL.Interfaces.IPhienBll, BLL.PhienBll>();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        var jwtSecret = jwtSettings["KhoaBiMat"] ?? throw new InvalidOperationException("Jwt:KhoaBiMat is not configured.");
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
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    c.OperationFilter<SwaggerFileOperationFilter>();
});

builder.Services.AddCors(tuyChon =>
{
    tuyChon.AddDefaultPolicy(chinhSach =>
    {
        chinhSach
            .WithOrigins(
                "http://10.49.145.68:3000",
                "http://10.49.145.68:5188",
                "http://localhost:3000",
                "http://localhost:5188",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:5188",
                "https://localhost:7003",
                "https://localhost:44344")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var fePath = Path.Combine(builder.Environment.ContentRootPath, "..", "..", "FE", "fe");
var anhPath = Path.Combine(fePath, "Anh");
var iconPath = Path.Combine(fePath, "Icon");

if (!Directory.Exists(anhPath)) Directory.CreateDirectory(anhPath);
if (!Directory.Exists(iconPath)) Directory.CreateDirectory(iconPath);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();        // th�m d�ng n�y
    app.UseSwaggerUI();      // th�m d�ng n�y
}

app.UseCors();

// Middleware xử lý exception toàn cục - KHÔNG try-catch rải rác
app.UseGlobalExceptionHandler();

// Chỉ redirect sang HTTPS khi KHÔNG phải môi trường Development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
