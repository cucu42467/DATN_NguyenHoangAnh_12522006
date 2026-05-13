using Microsoft.EntityFrameworkCore;
using Models;

namespace Models.Data;

public class AppDbContext : DbContext
{
public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
{
    // Global NoTracking for performance on read-heavy queries like reports
    this.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
}

    // Core tables
    public DbSet<TblNguoidung> TblNguoidungs { get; set; }
    public DbSet<TblGiaodich> TblGiaodiches { get; set; }
    public DbSet<TblTaikhoan> TblTaikhoans { get; set; }
    public DbSet<TblDanhmuc> TblDanhmucs { get; set; }
    public DbSet<TblMuctieu> TblMuctieus { get; set; }
    public DbSet<TblNgansach> TblNgansaches { get; set; }

    // Auth tables
    public DbSet<TblLichsuDangnhap> TblLichsuDangnhaps { get; set; }
    public DbSet<TblNguoidungSocial> TblNguoidungSocials { get; set; }
    public DbSet<TblNguoidungVaitro> TblNguoidungVaitros { get; set; }
    public DbSet<TblToken> TblTokens { get; set; }
    public DbSet<TblVaitro> TblVaitros { get; set; }
    public DbSet<TblOtp> TblOtps { get; set; }
    public DbSet<TblResetToken> TblResetTokens { get; set; }

    // Import & AI
    public DbSet<TblImportFile> TblImportFiles { get; set; }
    public DbSet<TblImportChitiet> TblImportChitiets { get; set; }
    public DbSet<TblGoiyAi> TblGoiyAis { get; set; }

    // Restored missing DbSet properties required for navigation properties
    public DbSet<TblAuditLog> TblAuditLogs { get; set; }
    public DbSet<TblCaidat> TblCaidats { get; set; }
    public DbSet<TblCanhbao> TblCanhbaos { get; set; }
    public DbSet<TblCauhinhHethong> TblCauhinhHethongs { get; set; }
    public DbSet<TblChitietGiaodich> TblChitietGiaodiches { get; set; }
    public DbSet<TblDonggopMuctieu> TblDonggopMuctieus { get; set; }
    public DbSet<TblDudoan> TblDudoans { get; set; }
    public DbSet<TblGiaodichDinhky> TblGiaodichDinhkies { get; set; }
    public DbSet<TblGiaodichTep> TblGiaodichTeps { get; set; }
    public DbSet<TblHanhviNguoidung> TblHanhviNguoidungs { get; set; }
    public DbSet<TblLoaiDanhmuc> TblLoaiDanhmucs { get; set; }
    public DbSet<TblLoaiTaikhoan> TblLoaiTaikhoans { get; set; }
    public DbSet<TblNhacnho> TblNhacnhos { get; set; }
    public DbSet<TblPhantichChitieu> TblPhantichChitieus { get; set; }
    public DbSet<TblTepDinhkem> TblTepDinhkems { get; set; }
    public DbSet<TblTheodoiNgansach> TblTheodoiNgansaches { get; set; }
    public DbSet<TblThongbao> TblThongbaos { get; set; }
    public DbSet<TblThongbaoHeThong> TblThongbaoHeThongs { get; set; }
    public DbSet<TblTonghopDanhmuc> TblTonghopDanhmucs { get; set; }
    public DbSet<TblTonghopThang> TblTonghopThangs { get; set; }
    public DbSet<TblTuKhoa> TblTuKhoas { get; set; }
    public DbSet<TblTygium> TblTygia { get; set; }
    public DbSet<TblChatAi> TblChatAis { get; set; }
    public DbSet<TblAiModel> TblAiModels { get; set; }
    public DbSet<TblPromptTemplate> TblPromptTemplates { get; set; }
    public DbSet<TblOcrKetqua> TblOcrKetquas { get; set; }
    public DbSet<TblQuyen> TblQuyens { get; set; }
    public DbSet<TblVaitroQuyen> TblVaitroQuyens { get; set; }
    public DbSet<TblPhienDangnhap> TblPhienDangnhaps { get; set; }
    public DbSet<TblFeatureFlag> TblFeatureFlags { get; set; }
    public DbSet<TblKetnoiNganhang> TblKetnoiNganhangs { get; set; }
    public DbSet<TblPhanhoi> TblPhanhois { get; set; }
    public DbSet<TblPhanhoiTraloi> TblPhanhoiTralois { get; set; }
    public DbSet<TblDaguiThongbao> TblDaguiThongbaos { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ===== MAP TABLE NAME =====
        modelBuilder.Entity<TblNguoidung>().ToTable("tbl_nguoidung");
        modelBuilder.Entity<TblGiaodich>().ToTable("tbl_giaodich");
        modelBuilder.Entity<TblTaikhoan>().ToTable("tbl_taikhoan");
        modelBuilder.Entity<TblDanhmuc>().ToTable("tbl_danhmuc");
        modelBuilder.Entity<TblMuctieu>().ToTable("tbl_muctieu");
        modelBuilder.Entity<TblNgansach>().ToTable("tbl_ngansach");
        modelBuilder.Entity<TblDaguiThongbao>().ToTable("tbl_da_gui_thongbao");

        modelBuilder.Entity<TblLichsuDangnhap>().ToTable("tbl_lichsu_dangnhap");
        modelBuilder.Entity<TblNguoidungSocial>().ToTable("tbl_nguoidung_social");
        modelBuilder.Entity<TblNguoidungVaitro>().ToTable("tbl_nguoidung_vaitro");
        modelBuilder.Entity<TblToken>().ToTable("tbl_token");
        modelBuilder.Entity<TblVaitro>().ToTable("tbl_vaitro");
        modelBuilder.Entity<TblOtp>().ToTable("tbl_otp");
        modelBuilder.Entity<TblResetToken>().ToTable("tbl_reset_token");

        modelBuilder.Entity<TblImportFile>().ToTable("tbl_import_file");
        modelBuilder.Entity<TblImportChitiet>().ToTable("tbl_import_chitiet");
        modelBuilder.Entity<TblGoiyAi>().ToTable("tbl_goiy_ai");

        modelBuilder.Entity<TblAuditLog>().ToTable("tbl_audit_log");
        modelBuilder.Entity<TblCaidat>().ToTable("tbl_caidat");
        modelBuilder.Entity<TblCanhbao>().ToTable("tbl_canhbao");
        modelBuilder.Entity<TblCauhinhHethong>().ToTable("tbl_cauhinh_hethong");
        modelBuilder.Entity<TblChitietGiaodich>().ToTable("tbl_chitiet_giaodich");
        modelBuilder.Entity<TblDonggopMuctieu>().ToTable("tbl_donggop_muctieu");
        modelBuilder.Entity<TblDudoan>().ToTable("tbl_dudoan");
        modelBuilder.Entity<TblGiaodichDinhky>().ToTable("tbl_giaodich_dinhky");
        modelBuilder.Entity<TblGiaodichTep>().ToTable("tbl_giaodich_tep");
        modelBuilder.Entity<TblHanhviNguoidung>().ToTable("tbl_hanhvi_nguoidung");
        modelBuilder.Entity<TblLoaiDanhmuc>().ToTable("tbl_loai_danhmuc");
        modelBuilder.Entity<TblLoaiTaikhoan>().ToTable("tbl_loai_taikhoan");
        modelBuilder.Entity<TblNhacnho>().ToTable("tbl_nhacnho");
        modelBuilder.Entity<TblPhantichChitieu>().ToTable("tbl_phantich_chitieu");
        modelBuilder.Entity<TblTepDinhkem>().ToTable("tbl_tep_dinhkem");
        modelBuilder.Entity<TblTheodoiNgansach>().ToTable("tbl_theodoi_ngansach");
        modelBuilder.Entity<TblThongbao>().ToTable("tbl_thongbao");
        modelBuilder.Entity<TblTonghopDanhmuc>().ToTable("tbl_tonghop_danhmuc");
        modelBuilder.Entity<TblTonghopThang>().ToTable("tbl_tonghop_thang");
        modelBuilder.Entity<TblTuKhoa>().ToTable("tbl_tu_khoa");
        modelBuilder.Entity<TblTygium>().ToTable("tbl_tygia");

        modelBuilder.Entity<TblThongbaoHeThong>().ToTable("tbl_thongbao_hethong");
        modelBuilder.Entity<TblChatAi>().ToTable("tbl_chat_ai");
        modelBuilder.Entity<TblAiModel>().ToTable("tbl_ai_model");
        modelBuilder.Entity<TblPromptTemplate>().ToTable("tbl_prompt_template");
        modelBuilder.Entity<TblOcrKetqua>().ToTable("tbl_ocr_ketqua");
        modelBuilder.Entity<TblQuyen>().ToTable("tbl_quyen");
        modelBuilder.Entity<TblVaitroQuyen>().ToTable("tbl_vaitro_quyen");
        modelBuilder.Entity<TblPhienDangnhap>().ToTable("tbl_phien_dangnhap");
        modelBuilder.Entity<TblFeatureFlag>().ToTable("tbl_feature_flag");
        modelBuilder.Entity<TblKetnoiNganhang>().ToTable("tbl_ketnoi_nganhang");
        modelBuilder.Entity<TblPhanhoi>().ToTable("tbl_phanhoi");
        modelBuilder.Entity<TblPhanhoiTraloi>().ToTable("tbl_phanhoi_traloi");

        modelBuilder.Entity<TblNguoidung>()
            .HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<TblGiaodich>()
            .HasIndex(g => new { g.NguoiDungId, g.NgayGiaoDich });

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblGiaodich =====   // ← THÊM MỚI
        modelBuilder.Entity<TblGiaodich>()
            .Property(e => e.TenGiaoDich)
            .HasMaxLength(255)
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblTaikhoan =====
        modelBuilder.Entity<TblTaikhoan>()
            .Property(e => e.MoTa)
            .HasMaxLength(500)
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblMuctieu =====
        modelBuilder.Entity<TblMuctieu>()
            .Property(e => e.MoTa)
            .HasMaxLength(500)
            .IsRequired(false);
        modelBuilder.Entity<TblMuctieu>()
            .Property(e => e.UuTien)
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblGiaodichDinhky =====
        modelBuilder.Entity<TblGiaodichDinhky>()
            .Property(e => e.MoTa)
            .HasMaxLength(500)
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblNgansach =====
        modelBuilder.Entity<TblNgansach>()
            .Property(e => e.GhiChu)
            .HasMaxLength(500)
            .IsRequired(false);
        modelBuilder.Entity<TblNgansach>()
            .Property(e => e.CanhBaoPhanTram)
            .HasDefaultValue(80f);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblDanhmuc =====
        modelBuilder.Entity<TblDanhmuc>()
            .Property(e => e.MoTa)
            .HasMaxLength(500)
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblChatAi =====
        modelBuilder.Entity<TblChatAi>()
            .Property(e => e.CuocHoiThoaiId)
            .HasMaxLength(36)
            .IsRequired(false);
        modelBuilder.Entity<TblChatAi>()
            .Property(e => e.TieuDe)
            .HasMaxLength(255)
            .IsRequired(false);
        modelBuilder.Entity<TblChatAi>()
            .Property(e => e.VaiTro)
            .HasMaxLength(20)
            .HasDefaultValue("user")
            .IsRequired(false);

        // ===== CẤU HÌNH THUỘC TÍNH MỚI - TblThongbao =====
        modelBuilder.Entity<TblThongbao>()
            .Property(e => e.LoaiDoiTuong)
            .HasMaxLength(50)
            .IsRequired(false);
        modelBuilder.Entity<TblThongbao>()
            .Property(e => e.DuongDanDieuHuong)
            .HasMaxLength(500)
            .IsRequired(false);

        modelBuilder.Entity<TblNguoidungVaitro>()
            .HasKey(uv => new { uv.NguoiDungId, uv.VaiTroId });

        // Fix EF relationship for TblGiaodich.TaiKhoan (error in Test/ket-noi)
        modelBuilder.Entity<TblGiaodich>()
            .HasOne(g => g.TaiKhoan)
            .WithMany(t => t.TblGiaodichTaiKhoans)
            .HasForeignKey(g => g.TaiKhoanId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TblGiaodich>()
            .HasOne(g => g.TaiKhoanDich)
            .WithMany(t => t.TblGiaodichTaiKhoanDiches)
            .HasForeignKey(g => g.TaiKhoanDichId)
            .OnDelete(DeleteBehavior.SetNull);

        base.OnModelCreating(modelBuilder);

    }
}

