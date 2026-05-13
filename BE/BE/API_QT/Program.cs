using BLL;
using BLL.AIQuery;
using BLL.Interfaces;
using BLL.Services;
using Common;
using DAL;
using DAL.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Models.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers + OpenAPI
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

// === MEMORY CACHE ===
builder.Services.AddAppMemoryCache();

// Config
builder.Services.Configure<CauHinhJwt>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<CauHinhOAuthMangXaHoi>(builder.Configuration.GetSection("OAuthMangXaHoi"));

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Existing Auth services
builder.Services.AddScoped<INguoiDungDal, NguoiDungDal>();
builder.Services.AddScoped<IDichVuJwt, DichVuJwt>();


// BLL services
builder.Services.AddScoped<IAiBll, AiBll>();
builder.Services.AddScoped<IAuditLogBll, AuditLogBll>();
builder.Services.AddScoped<IBaoCaoBll, BaoCaoBll>();
builder.Services.AddScoped<ICaiDatBll, CaiDatBll>();
builder.Services.AddScoped<ICanhBaoBll, CanhBaoBll>();
builder.Services.AddScoped<ICauHinhBll, CauHinhBll>();
builder.Services.AddScoped<IDanhMucBll, DanhMucBll>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGiaoDichBll, GiaoDichBll>();
builder.Services.AddScoped<IGiaoDichDinhKyBll, GiaoDichDinhKyBll>();
builder.Services.AddScoped<IImportBll, ImportBll>();
builder.Services.AddScoped<ILoaiDanhMucBll, LoaiDanhMucBll>();
builder.Services.AddScoped<ILoaiTaiKhoanBll, LoaiTaiKhoanBll>();
builder.Services.AddScoped<IMucTieuBll, MucTieuBll>();
builder.Services.AddScoped<INganSachBll, NganSachBll>();
builder.Services.AddScoped<INhacNhoBll, NhacNhoBll>();
builder.Services.AddScoped<IPhienBll, PhienBll>();
builder.Services.AddScoped<ITaiKhoanBll, TaiKhoanBll>();
builder.Services.AddScoped<ITepDinhKemBll, TepDinhKemBll>();
builder.Services.AddScoped<IThongBaoBll, ThongBaoBll>();
builder.Services.AddScoped<ITongQuanBll, TongQuanBll>();
builder.Services.AddScoped<ITuKhoaBll, TuKhoaBll>();
builder.Services.AddScoped<ITyGiaBll, TyGiaBll>();
builder.Services.AddScoped<IVaiTroBll, VaiTroBll>();
builder.Services.AddScoped<IAuditLogDal, AuditLogDal>(); // Phải đăng ký TRƯỚC NguoiDungBll
builder.Services.AddScoped<INguoiDungBll, NguoiDungBll>();
builder.Services.AddScoped<IXacThucBll, XacThucBll>();
builder.Services.AddScoped<IXacThucTokenMangXaHoi, XacThucTokenMangXaHoi>();
builder.Services.AddScoped<AiService>();
builder.Services.AddScoped<AiQueryService>();
builder.Services.AddScoped<SchemaProvider>();
builder.Services.AddScoped<KeywordMappingService>();
builder.Services.AddScoped<QueryValidationService>();
builder.Services.AddScoped<AiPromptBuilder>();
builder.Services.AddScoped<SqlBuilder>();
builder.Services.AddScoped<DAL.Interfaces.IPhienDal, DAL.PhienDal>();
builder.Services.AddScoped<BLL.Interfaces.IPhienBll, BLL.PhienBll>();
builder.Services.AddScoped<BLL.Interfaces.ILichsuDangnhapBll, BLL.LichsuDangnhapBll>();
builder.Services.AddScoped<IPhanHoiBll, PhanHoiBll>();
builder.Services.AddScoped<IPhanHoiTraLoiBll, PhanHoiTraLoiBll>();
builder.Services.AddScoped<IPhanHoiDal, PhanHoiDal>();
builder.Services.AddScoped<IGiaoDichService, GiaoDichService>();
builder.Services.AddScoped<IPhanHoiTraLoiDal, PhanHoiTraLoiDal>();



// DAL services
builder.Services.AddScoped<IAiDal, AiDal>();
builder.Services.AddScoped<IAuditLogDal, AuditLogDal>();
builder.Services.AddScoped<IBaoCaoDal, BaoCaoDal>();
builder.Services.AddScoped<ICaiDatDal, CaiDatDal>();
builder.Services.AddScoped<ICanhBaoDal, CanhBaoDal>();
builder.Services.AddScoped<ICauHinhDal, CauHinhDal>();
builder.Services.AddScoped<IDanhMucDal, DanhMucDal>();
builder.Services.AddScoped<IDongGopMucTieuDal, DongGopMucTieuDal>();
builder.Services.AddScoped<IGiaoDichDal, GiaoDichDal>();
builder.Services.AddScoped<IGiaoDichDinhKyDal, GiaoDichDinhKyDal>();
builder.Services.AddScoped<IImportDal, ImportDal>();
builder.Services.AddScoped<ILichsuDangnhapDal, LichsuDangnhapDal>();
builder.Services.AddScoped<ILoaiDanhMucDal, LoaiDanhMucDal>();
builder.Services.AddScoped<ILoaiTaiKhoanDal, LoaiTaiKhoanDal>();
builder.Services.AddScoped<IMucTieuDal, MucTieuDal>();
builder.Services.AddScoped<INganSachDal, NganSachDal>();
builder.Services.AddScoped<INguoiDungSocialDal, NguoiDungSocialDal>();
builder.Services.AddScoped<INguoiDungVaitroDal, NguoiDungVaitroDal>();
builder.Services.AddScoped<INhacNhoDal, NhacNhoDal>();
builder.Services.AddScoped<IOtpDal, OtpDal>();
builder.Services.AddScoped<IPhienDal, PhienDal>();
builder.Services.AddScoped<IResetTokenDal, ResetTokenDal>();
builder.Services.AddScoped<ITaiKhoanDal, TaiKhoanDal>();
builder.Services.AddScoped<ITepDinhKemDal, TepDinhKemDal>();
builder.Services.AddScoped<IThongBaoDal, ThongBaoDal>();
builder.Services.AddScoped<ITokenDal, TokenDal>();
builder.Services.AddScoped<ITyGiaDal, TyGiaDal>();
builder.Services.AddScoped<IVaiTroDal, VaiTroDal>();
builder.Services.AddScoped<IAiQueryDal, AiQueryDal>();
builder.Services.AddScoped<DAL.Interfaces.ITuKhoaDal, DAL.TuKhoaDal>();
builder.Services.AddScoped<BLL.Interfaces.ITuKhoaBll, BLL.TuKhoaBll>();
builder.Services.AddScoped<IAiModelDal, AiModelDal>();
builder.Services.AddScoped<IChatAiDal, ChatAiDal>();

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("Jwt");
        var jwtSecret = jwtSettings["KhoaBiMat"] ?? throw new InvalidOperationException("Jwt:KhoaBiMat is not configured.");
        Console.WriteLine($"API_QT JWT Key loaded: {jwtSecret.Length} characters (first 5: {jwtSecret.Substring(0, Math.Min(5, jwtSecret.Length))}****)");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["PhatHanh"],
            ValidAudience = jwtSettings["KhanGia"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            RoleClaimType =
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        };
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API_QT", Version = "v1" });
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
            new string[0]
        }
    });
});

// CORS FE + Admin UI - cho phép nhiều origin phổ biến
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminCors", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin API v1"));
}

// CORS phải gọi TRƯỚC bất kỳ middleware nào khác
app.UseCors("AdminCors");

// app.UseHttpsRedirection();
app.UseGlobalExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
