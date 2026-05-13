# Fix API QT /admin prefix endpoints

- [ ] Step 6: Complete task

## Cấu trúc thư mục BE/ (toàn bộ)

```
BE/
├── BE.sln
├── API_ND/
│   ├── API_ND.csproj
│   ├── API_ND.http
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Controllers/
│   │   ├── AiController.cs
│   │   ├── BaoCaoController.cs
│   │   ├── CanhBaoController.cs
│   │   ├── DanhMucController.cs
│   │   ├── GiaoDichController.cs
│   │   ├── GiaoDichDinhKyController.cs
│   │   ├── ImportController.cs
│   │   ├── LoaiDanhMucController.cs
│   │   ├── MucTieuController.cs
│   │   ├── NganSachController.cs
│   │   ├── NguoiDungController.cs
│   │   ├── TaiKhoanController.cs
│   │   ├── TestController.cs
│   │   ├── TongQuanController.cs
│   │   ├── UploadController.cs
│   │   ├── WeatherForecastController.cs
│   │   └── XacThucController.cs
│   ├── bin/
│   └── obj/
├── API_QT/
│   ├── API_QT.csproj
│   ├── API_QT.http
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs
│   ├── Properties/
│   ├── Controllers/
│   │   ├── AuditLogController.cs
│   │   ├── CauHinhController.cs
│   │   ├── GiaoDichController.cs
│   │   ├── ImportController.cs
│   │   └── NguoiDungController.cs
│   ├── bin/
│   └── obj/
├── BLL/
│   ├── BLL.csproj
│   ├── AiBll.cs
│   ├── AuditLogBll.cs
│   ├── BaoCaoBll.cs
│   ├── CauHinhBll.cs
│   ├── DanhMucBll.cs
│   ├── DichVuJwt.cs
│   ├── EmailService.cs
│   ├── GeminiService.cs
│   ├── GiaoDichBll.cs
│   ├── GiaoDichDinhKyBll.cs
│   ├── ImportBll.cs
│   ├── LoaiDanhMucBll.cs
│   ├── MucTieuBll.cs
│   ├── NganSachBll.cs
│   ├── NguoiDungBll.cs
│   ├── PhienBll.cs
│   ├── TaiKhoanBll.cs
│   ├── ThongTinNguoiMangXaHoi.cs
│   ├── TongQuanBll.cs
│   ├── TyGiaBll.cs
│   ├── XacThucBll.cs
│   ├── XacThucTokenMangXaHoi.cs
│   ├── Interfaces/
│   ├── bin/
│   └── obj/
├── Common/
│   ├── Common.csproj
│   ├── CauHinhEmail.cs
│   ├── CauHinhJwt.cs
│   ├── CauHinhOAuthMangXaHoi.cs
│   ├── CauHinhOtp.cs
│   ├── TimeHelper.cs
│   ├── bin/
│   └── obj/
├── DAL/
│   ├── DAL.csproj
│   ├── AiDal.cs
│   ├── AuditLogDal.cs
│   ├── BaoCaoDal.cs
│   ├── CauHinhDal.cs
│   ├── DanhMucDal.cs
│   ├── DongGopMucTieuDal.cs
│   ├── GiaoDichDal.cs
│   ├── GiaoDichDinhKyDal.cs
│   ├── ImportDal.cs
│   ├── LichsuDangnhapDal.cs
│   ├── LoaiDanhMucDal.cs
│   ├── MucTieuDal.cs
│   ├── NganSachDal.cs
│   ├── NguoiDungDal.cs
│   ├── NguoiDungSocialDal.cs
│   ├── NguoiDungVaitroDal.cs
│   ├── OtpDal.cs
│   ├── PhienDal.cs
│   ├── ResetTokenDal.cs
│   ├── TaiKhoanDal.cs
│   ├── TokenDal.cs
│   ├── TyGiaDal.cs
│   ├── Interfaces/
│   ├── bin/
│   └── obj/
├── DTO/
│   ├── DTO.csproj
│   ├── AdminDto.cs
│   ├── AiDto.cs
│   ├── BaoCaoDto.cs
│   ├── DanhMucDto.cs
│   ├── GeminiDto.cs
│   ├── GiaoDichDinhKyDto.cs
│   ├── GiaoDichDto.cs
│   ├── ImportDto.cs
│   ├── LoaiDanhMucDto.cs
│   ├── MucTieuDto.cs
│   ├── NganSachDto.cs
│   ├── NguoiDungDto.cs
│   ├── NguoiDungMeDto.cs
│   ├── NguoiDungTomTatDto.cs
│   ├── PhanHoiDangKyDto.cs
│   ├── PhanHoiDangNhapDto.cs
│   ├── QuenMatKhauDto.cs
│   ├── TaiKhoanDto.cs
│   ├── TongQuanDto.cs
│   ├── YeuCauDangKyDto.cs
│   ├── YeuCauDangNhapDto.cs
│   └── YeuCauDangNhapMangXaHoiDto.cs
│   ├── bin/
│   └── obj/
└── Models/
    ├── Models.csproj
    ├── Class1.cs
    ├── TblAuditLog.cs
    ├── TblCaidat.cs
    ├── TblCanhbao.cs
    ├── TblCauhinhHethong.cs
    ├── TblChitietGiaodich.cs
    ├── TblDanhmuc.cs
    ├── TblDonggopMuctieu.cs
    ├── TblDudoan.cs
    ├── TblGiaodich.cs
    ├── TblGiaodichDinhky.cs
    ├── TblGiaodichTep.cs
    ├── TblGoiyAi.cs
    ├── TblHanhviNguoidung.cs
    ├── TblImportChitiet.cs
    ├── TblImportFile.cs
    ├── TblLichsuDangnhap.cs
    ├── TblLoaiDanhmuc.cs
    ├── TblLoaiTaikhoan.cs
    ├── TblMuctieu.cs
    ├── TblNgansach.cs
    ├── TblNguoidung.cs
    ├── TblNguoidungSocial.cs
    ├── TblNguoidungVaitro.cs
    ├── TblNhacnho.cs
    ├── TblOtp.cs
    ├── TblPhantichChitieu.cs
    ├── TblResetToken.cs
    ├── TblTaikhoan.cs
    ├── TblTepDinhkem.cs
    ├── TblTheodoiNgansach.cs
    ├── TblThongbao.cs
    ├── TblToken.cs
    ├── TblTonghopDanhmuc.cs
    ├── TblTonghopThang.cs
    ├── TblTuKhoa.cs
    ├── TblTygium.cs
    ├── TblVaitro.cs
    ├── Data/
    ├── bin/
    └── obj/
```

**Tổng quan:**
- **API_ND/**: API chính cho admin/ND (Nhân dân?), 20+ controllers cho giao dịch, danh mục, người dùng, báo cáo, AI, etc.
- **API_QT/**: API cho quản trị, controllers cho audit log, cấu hình, người dùng.
- **BLL/**: Business logic layers (25+ BLL files).
- **DAL/**: Data access layers (25+ DAL files).
- **DTO/**: Data transfer objects (20+ DTOs).
- **Models/**: Database entities (40+ Tbl* models).
- **Common/**: Shared configs (JWT, Email, OAuth, etc.).
</xai:function_call >  
<xai:function_call name="read_file">
<parameter name="path">TODO.md
