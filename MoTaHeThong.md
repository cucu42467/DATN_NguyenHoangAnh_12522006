# MÔ TẢ HỆ THỐNG - BIỂU ĐỒ VOPC
## Ứng Dụng Quản Lý Chi Tiêu Cá Nhân

---

# PHẦN 1: TỔNG QUAN KIẾN TRÚC VOPC

## 1.1. Giới thiệu VOPC (View of Participating Classes)

Biểu đồ VOPC mô tả các thành phần tham gia trong mỗi Use Case theo mô hình 4 lớp UML:
- **Boundary (Biên)**: Giao diện/API tương tác với Actor
- **Control (Điều khiển)**: Logic nghiệp vụ xử lý Use Case
- **Entity (Thực thể)**: Dữ liệu được sử dụng/tạo ra
- **Actor**: Người dùng hoặc hệ thống bên ngoài tương tác

## 1.2. Quy ước đặt tên

| Loại | Prefix | Ví dụ |
|------|--------|-------|
| Controller | *Controller | XacThucController |
| BLL (Service) | *Bll | XacThucBll |
| DAL | *Dal | NguoiDungDal |
| Model/Entity | Tbl* | TblNguoidung |
| DTO | YeuCau* / PhanHoi* | YeuCauDangNhapDto |

---

# PHẦN 2: PHÂN HỆ NGƯỜI DÙNG (USER SUBSYSTEM)

---

## UC-01: XÁC THỰC & BẢO MẬT

### 1.1. Đăng ký tài khoản

```
┌─────────────────────────────────────────────────────────────────┐
│                      UC-01.1: ĐĂNG KÝ                          │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: Guest (Người dùng mới chưa có tài khoản)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │  (Guest)    │─────►│  AuthController  │─────►│ XacThucBll│ │
│   └─────────────┘      │ /api/auth/register│      └─────┬─────┘ │
│                        └──────────────────┘              │       │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNguoidung│ │
│                                                  │  TblVaitro  │ │
│                                                  │TblNguoiDungVaiTro│
│                                                  │   TblOTP    │ │
│                                                  │  TblCaiDat  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API endpoint `/api/auth/register`, nhận request đăng ký |
| **Control** | `XacThucBll` | Xử lý nghiệp vụ: validate, hash password, tạo tài khoản, gửi OTP |
| **Entity** | `TblNguoidung` | Lưu thông tin người dùng mới |
| **Entity** | `TblVaitro` | Tham chiếu vai trò User mặc định |
| **Entity** | `TblNguoidungVaitro` | Liên kết user-vai trò |
| **Entity** | `TblOtp` | Lưu mã OTP xác thực email |
| **Entity** | `TblCaiDat` | Tạo cài đặt mặc định cho user mới |

**Luồng xử lý:**
1. Actor gửi request đăng ký (email, password, họ tên)
2. Boundary nhận và validate dữ liệu đầu vào
3. Control kiểm tra email đã tồn tại chưa
4. Control hash password và tạo user mới
5. Control gán vai trò User mặc định
6. Control tạo bản ghi cài đặt mặc định
7. Control tạo và gửi mã OTP qua email
8. Trả kết quả thành công cho Actor

---

### 1.2. Đăng nhập

```
┌─────────────────────────────────────────────────────────────────┐
│                      UC-01.2: ĐĂNG NHẬP                         │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│  AuthController  │─────►│ XacThucBll│ │
│   └─────────────┘      │ /api/auth/login  │      └─────┬─────┘ │
│                        └──────────────────┘              │       │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNguoidung│ │
│                                                  │  TblToken   │ │
│                                                  │TblLichsuDangnhap│
│                                                  │  TblCaiDat  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API endpoint `/api/auth/login` |
| **Control** | `XacThucBll` | Xác thực credentials, tạo JWT token |
| **Control** | `DichVuJwt` | Tạo và validate JWT token |
| **Entity** | `TblNguoidung` | Kiểm tra thông tin đăng nhập |
| **Entity** | `TblToken` | Lưu trữ JWT token (access + refresh) |
| **Entity** | `TblLichsuDangnhap` | Ghi log đăng nhập (IP, thiết bị) |
| **Entity** | `TblCaiDat` | Lấy thông tin cài đặt user |

**Luồng xử lý:**
1. Actor gửi email + password
2. Boundary nhận request
3. Control kiểm tra tài khoản tồn tại và trạng thái
4. Control verify password (hash)
5. Control tạo JWT access token + refresh token
6. Control lưu token vào database
7. Control ghi log đăng nhập
8. Trả token về cho Actor

---

### 1.3. Đăng nhập qua mạng xã hội

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API endpoints OAuth (Google, Facebook) |
| **Boundary** | `GoogleAuth.tsx` | Component React cho đăng nhập Google |
| **Control** | `XacThucTokenMangXaHoi` | Xử lý OAuth flow |
| **Control** | `ThongTinNguoiMangXaHoi` | Lấy thông tin từ provider |
| **Entity** | `TblNguoidung` | Tạo/link tài khoản |
| **Entity** | `TblNguoidungSocial` | Lưu liên kết social account |
| **Entity** | `TblToken` | Tạo JWT sau khi xác thực |

---

### 1.4. Xác thực OTP

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API `/api/auth/verify-otp`, `/api/auth/resend-otp` |
| **Control** | `XacThucBll` | Verify OTP, kích hoạt tài khoản |
| **Entity** | `TblOtp` | Kiểm tra mã OTP, số lần sai, hạn sử dụng |
| **Entity** | `TblNguoidung` | Cập nhật trạng thái đã xác thực |

---

### 1.5. Quên mật khẩu / Cấp lại mật khẩu

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API `/api/auth/forgot-password`, `/api/auth/reset-password` |
| **Control** | `XacThucBll` | Gửi email reset, tạo reset token |
| **Control** | `EmailService` | Gửi email chứa link reset |
| **Entity** | `TblNguoidung` | Tìm user theo email |
| **Entity** | `TblResetToken` | Lưu token reset (30 phút) |

---

### 1.6. Quản lý phiên đăng nhập

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `XacThucController` | API `/api/auth/logout`, `/api/auth/refresh-token` |
| **Control** | `PhienBll` | Quản lý phiên, revoke token |
| **Entity** | `TblToken` | Vô hiệu hóa token khi logout |
| **Entity** | `TblLichsuDangnhap` | Theo dõi lịch sử đăng nhập |

---

## UC-02: BÁO CÁO & THỐNG KÊ

```
┌─────────────────────────────────────────────────────────────────┐
│                    UC-02: BÁO CÁO & THỐNG KÊ                   │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│ BaoCaoController │─────►│ BaoCaoBll │ │
│   └─────────────┘      │ /api/baocao/*    │      └─────┬─────┘ │
│                        └──────────────────┘              │       │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │TblGiaoDich  │ │
│                                                  │TblDanhMuc   │ │
│                                                  │TblTaiKhoan  │ │
│                                                  │TblTongHopThang│
│                                                  │TblTongHopDanhMuc│
│                                                  │TblPhanTichChiTieu│
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `BaoCaoController` | API endpoints báo cáo: `/api/baocao/tong-quan`, `/api/baocao/theo-danh-muc`, `/api/baocao/chi-tieu` |
| **Control** | `BaoCaoBll` | Tổng hợp số liệu, tính toán thống kê |
| **Entity** | `TblGiaodich` | Dữ liệu giao dịch để phân tích |
| **Entity** | `TblDanhmuc` | Phân loại theo danh mục |
| **Entity** | `TblTaiKhoan` | Phân loại theo tài khoản |
| **Entity** | `TblTonghopThang` | Tổng hợp thu/chi/tháng |
| **Entity** | `TblTonghopDanhmuc` | Tổng hợp theo danh mục |
| **Entity** | `TblPhanTichChiTieu` | Kết quả phân tích chi tiêu |
| **DTO** | `BaoCaoDto` | Data transfer cho biểu đồ |

**Luồng xử lý:**
1. Actor yêu cầu xem báo cáo (theo tháng, theo danh mục)
2. Boundary nhận request với bộ lọc
3. Control truy vấn dữ liệu giao dịch
4. Control tính toán tổng thu/chi/tiết kiệm
5. Control phân tích theo danh mục
6. Control format dữ liệu cho biểu đồ
7. Trả kết quả về Actor

**Các loại báo cáo:**
- Báo cáo tổng quan tháng
- Biểu đồ tròn theo danh mục chi tiêu
- Biểu đồ cột so sánh thu/chi
- Xu hướng chi tiêu theo thời gian

---

## UC-03: QUẢN LÝ HỒ SƠ

```
┌─────────────────────────────────────────────────────────────────┐
│                    UC-03: QUẢN LÝ HỒ SƠ                          │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│ NguoiDungController─────►│NguoiDungBll│ │
│   └─────────────┘      │ /api/nguoidung/*│      └─────┬─────┘ │
│                        └──────────────────┘              │       │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNguoidung │ │
│                                                  │  TblCaiDat   │ │
│                                                  │TblTaiKhoan   │ │
│                                                  │ TblLichsuDangnhap│
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `NguoiDungController` | API: `/api/nguoidung/profile`, `/api/nguoidung/update`, `/api/nguoidung/doi-mk` |
| **Control** | `NguoiDungBll` | Xử lý cập nhật hồ sơ, đổi mật khẩu |
| **Entity** | `TblNguoidung` | Lưu thông tin cá nhân |
| **Entity** | `TblCaiDat` | Lưu cài đặt ngôn ngữ, tiền tệ, dark mode |
| **Entity** | `TblTaiKhoan` | Tài khoản tài chính của user |
| **Entity** | `TblLichsuDangnhap` | Lịch sử đăng nhập |

**Các chức năng con:**
1. **Xem thông tin cá nhân** - Lấy profile từ TblNguoidung
2. **Cập nhật danh tính** - Update họ tên, avatar
3. **Thay đổi thông tin liên lạc** - Email, SĐT
4. **Quản lý bảo mật** - Đổi mật khẩu, xem lịch sử đăng nhập
5. **Cài đặt giao diện** - Ngôn ngữ, tiền tệ, dark mode

---

## UC-04: QUẢN LÝ TÀI CHÍNH

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-04: QUẢN LÝ TÀI CHÍNH                       │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│  GiaoDichController────►│ GiaoDichBll│ │
│   │             │      │  TaiKhoanController────►│TaiKhoanBll │ │
│   │             │      │  DanhMucController──────►│DanhMucBll  │ │
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblTaiKhoan │ │
│                                                  │TblGiaoDich  │ │
│                                                  │TblDanhMuc   │ │
│                                                  │TblLoaiDanhMuc│
│                                                  │TblLoaiTaiKhoan│
│                                                  │TblChiTietGiaoDich│
│                                                  │ TblTuKhoa   │ │
│                                                  │TblGiaodichDinhky│
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1. Quản lý Tài khoản/Ví

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `TaiKhoanController` | API: CRUD tài khoản, lấy số dư |
| **Control** | `TaiKhoanBll` | Nghiệp vụ tài khoản |
| **Entity** | `TblTaiKhoan` | Thông tin tài khoản, số dư |
| **Entity** | `TblLoaiTaiKhoan` | Loại (tiền mặt, ngân hàng, ví điện tử) |

**Chức năng:**
- Tạo tài khoản mới (ví, ngân hàng, thẻ)
- Cập nhật thông tin, màu sắc, icon
- Xem số dư các tài khoản
- Khóa/mở tài khoản

---

### 4.2. Ghi nhận giao dịch

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `GiaoDichController` | API: `/api/giaodich`, `/api/giaodich/tao-moi` |
| **Control** | `GiaoDichBll` | Nghiệp vụ giao dịch, cập nhật số dư |
| **Entity** | `TblGiaodich` | Lưu giao dịch (thu/chi/chuyển khoản) |
| **Entity** | `TblChiTietGiaodich` | Chi tiết giao dịch chia nhiều danh mục |
| **Entity** | `TblTaiKhoan` | Cập nhật số dư |
| **Entity** | `TblDanhmuc` | Gán danh mục |
| **Entity** | `TblTuKhoa` | Gợi ý danh mục tự động |

**Luồng xử lý giao dịch:**
1. User nhập thông tin giao dịch
2. Hệ thống gợi ý danh mục dựa trên từ khóa
3. User xác nhận hoặc chọn danh mục khác
4. Cập nhật số dư tài khoản nguồn
5. Nếu chuyển khoản: cập nhật số dư tài khoản đích
6. Ghi log giao dịch

---

### 4.3. Chuyển khoản nội bộ

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `GiaoDichController` | API: `/api/giaodich/chuyen-khoan` |
| **Control** | `GiaoDichBll` | Xử lý chuyển khoản, cập nhật 2 tài khoản |
| **Entity** | `TblGiaodich` | Giao dịch loại 3 (chuyển khoản) |
| **Entity** | `TblTaiKhoan` | Trừ tài khoản nguồn, cộng tài khoản đích |

---

### 4.4. Phân loại danh mục

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `DanhMucController` | API: CRUD danh mục, gợi ý |
| **Boundary** | `LoaiDanhMucController` | API loại danh mục (thu/chi) |
| **Control** | `DanhMucBll` | Nghiệp vụ danh mục |
| **Entity** | `TblDanhmuc` | Danh mục chi tiết |
| **Entity** | `TblLoaiDanhMuc` | Loại (1=Thu, 2=Chi) |
| **Entity** | `TblTuKhoa` | Từ khóa gợi ý cho user |

---

## UC-05: LẬP KẾ HOẠCH TÀI CHÍNH

```
┌─────────────────────────────────────────────────────────────────┐
│                   UC-05: LẬP KẾ HOẠCH                           │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│ NganSachController─────►│ NganSachBll│ │
│   │             │      │ MucTieuController───────►│ MucTieuBll │ │
│   │             │      │GiaoDichDinhKyController──►│GiaoDichDinhKyBll│
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNganSach │ │
│                                                  │TblTheoDoiNganSach│
│                                                  │ TblMucTieu  │ │
│                                                  │TblDongGopMucTieu│
│                                                  │TblGiaoDichDinhKy│
│                                                  │ TblDanhmuc  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.1. Quản lý Ngân sách

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `NganSachController` | API: CRUD ngân sách, theo dõi |
| **Control** | `NganSachBll` | Tính toán % sử dụng, cảnh báo |
| **Entity** | `TblNganSach` | Ngân sách theo danh mục/tháng |
| **Entity** | `TblTheoDoiNganSach` | Lịch sử cập nhật ngân sách |
| **Entity** | `TblDanhmuc` | Danh mục áp dụng ngân sách |
| **Entity** | `TblGiaodich` | Dùng để tính số tiền đã chi |

**Chức năng:**
- Đặt hạn mức chi tiêu theo danh mục
- Theo dõi % sử dụng ngân sách
- Tự động cảnh báo khi vượt 80%, 100%

---

### 5.2. Quản lý Mục tiêu tiết kiệm

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `MucTieuController` | API: CRUD mục tiêu, đóng góp |
| **Control** | `MucTieuBll` | Nghiệp vụ mục tiêu |
| **Entity** | `TblMucTieu` | Thông tin mục tiêu |
| **Entity** | `TblDongGopMucTieu` | Lịch sử đóng góp |
| **Entity** | `TblTaiKhoan` | Tài khoản nguồn đóng góp |

---

### 5.3. Giao dịch định kỳ

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `GiaoDichDinhKyController` | API: CRUD giao dịch định kỳ |
| **Control** | `GiaoDichDinhKyBll` | Xử lý tạo giao dịch tự động |
| **Entity** | `TblGiaoDichDinhKy` | Cấu hình chu kỳ (daily/weekly/monthly) |
| **Entity** | `TblGiaodich` | Giao dịch được tạo tự động |

---

## UC-06: TỐI ƯU BẰNG AI

```
┌─────────────────────────────────────────────────────────────────┐
│                    UC-06: TỐI ƯU AI                             │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│    AiController  │─────►│   AiBll   │ │
│   │             │      │ /api/ai/*        │      └─────┬─────┘ │
│   │             │      └──────────────────┘            │       │
│   │             │                                      ▼       │
│   │             │                            ┌─────────────────┐│
│   │             │                            │ External Service││
│   │             │                            │ GeminiService   ││
│   └─────────────┘                            └────────┬────────┘│
│                                                          │       │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblGoiYAI   │ │
│                                                  │ TblDuDoan   │ │
│                                                  │TblPhanTichChiTieu│
│                                                  │TblHanHViNguoiDung│
│                                                  │ TblGiaodich  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `AiController` | API: `/api/ai/chat`, `/api/ai/goi-y`, `/api/ai/phan-tich` |
| **Control** | `AiBll` | Xử lý nghiệp vụ AI |
| **External** | `GeminiService` | Giao tiếp với Google Gemini API |
| **Entity** | `TblGoiYAI` | Lưu gợi ý từ AI |
| **Entity** | `TblDuDoan` | Lưu dự đoán chi tiêu |
| **Entity** | `TblPhanTichChiTieu` | Kết quả phân tích |
| **Entity** | `TblHanhViNguoiDung` | Dữ liệu hành vi cho AI phân tích |
| **Entity** | `TblGiaodich` | Dữ liệu chi tiêu để phân tích |

**Các chức năng AI:**
1. **Chat tư vấn** - User hỏi AI về tài chính
2. **Phân tích hành vi** - AI học từ lịch sử chi tiêu
3. **Dự báo chi tiêu** - Dự đoán tháng tới
4. **Gợi ý tiết kiệm** - Đề xuất cải thiện

---

## UC-07: THÔNG BÁO

```
┌─────────────────────────────────────────────────────────────────┐
│                    UC-07: THÔNG BÁO                             │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User, System (tự động)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│  ThongBaoController─────►│ (Trong    │ │
│   │  System     │─────►│                   │      │ NganSachBll│ │
│   │ (Background)│      │ /api/thongbao/*  │      │ MucTieuBll │ │
│   └─────────────┘      └──────────────────┘      │ GiaoDichBll│
│                                                   └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblThongBao │ │
│                                                  │ TblCanhBao  │ │
│                                                  │ TblNhacNho  │ │
│                                                  │ TblNganSach │ │
│                                                  │ TblMucTieu  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `ThongBaoController` | API: lấy danh sách, đánh dấu đã đọc |
| **Boundary** | `CanhBaoController` | API cảnh báo ngân sách |
| **Control** | `NganSachBll` | Tự động tạo cảnh báo khi vượt ngân sách |
| **Control** | `MucTieuBll` | Tạo thông báo mục tiêu |
| **Entity** | `TblThongBao` | Thông báo hệ thống |
| **Entity** | `TblCanhBao` | Cảnh báo ngân sách/mục tiêu |
| **Entity** | `TblNhacNho` | Nhắc nhở người dùng |
| **Entity** | `TblCaiDat` | Kiểm tra user có bật thông báo không |

**Loại thông báo:**
1. Cảnh báo ngân sách (80%, 100%)
2. Nhắc nhở mục tiêu sắp đến hạn
3. Số dư tài khoản thấp
4. Giao dịch định kỳ sắp thực hiện

---

## UC-08: NHẬP/XUẤT DỮ LIỆU

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-08: NHẬP/XUẤT DỮ LIỆU                       │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: User                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │   (User)    │─────►│  ImportController │─────►│ ImportBll │ │
│   │             │      │  UploadController │      │   AiBll   │ │
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │TblImportFile│ │
│                                                  │TblImportChiTiet│
│                                                  │ TblGiaodich │ │
│                                                  │ TblTaiKhoan │ │
│                                                  │ TblDanhmuc  │ │
│                                                  │ TblTepDinhKem│
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.1. Import dữ liệu

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `ImportController` | API: upload file, xem kết quả import |
| **Boundary** | `UploadController` | Xử lý upload file |
| **Control** | `ImportBll` | Parse file CSV/Excel, validate dữ liệu |
| **Control** | `AiBll` | Gợi ý danh mục cho giao dịch import |
| **Entity** | `TblImportFile` | Thông tin file đã upload |
| **Entity** | `TblImportChiTiet` | Chi tiết từng dòng import |
| **Entity** | `TblGiaodich` | Tạo giao dịch từ import |
| **Entity** | `TblDanhmuc` | Gợi ý danh mục |
| **Entity** | `TblTepDinhKem` | Lưu file gốc |

**Luồng xử lý:**
1. User upload file CSV/Excel
2. System parse và validate định dạng
3. AI gợi ý danh mục cho từng giao dịch
4. User xác nhận/điều chỉnh gợi ý
5. Tạo giao dịch hàng loạt
6. Hiển thị kết quả import

---

### 8.2. Xuất/Export dữ liệu

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `GiaoDichController` | API export: `/api/giaodich/export` |
| **Control** | `GiaoDichBll` | Lấy dữ liệu export |
| **Entity** | `TblGiaodich` | Nguồn dữ liệu export |

---

# PHẦN 3: PHÂN HỆ QUẢN TRỊ (ADMIN SUBSYSTEM)

---

## UC-09: QUẢN LÝ NGƯỜI DÙNG

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-09: QUẢN LÝ NGƯỜI DÙNG                    │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: Admin                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │  (Admin)    │─────►│NguoiDungController─────►│NguoiDungBll│ │
│   │             │      │(API_QT prefix /api/admin/nguoidung)│
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNguoidung │ │
│                                                  │ TblVaitro   │ │
│                                                  │TblNguoiDungVaiTro│
│                                                  │TblLichsuDangnhap│
│                                                  │ TblCaiDat   │ │
│                                                  │ TblAuditLog │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `NguoiDungController` (API_QT) | API: `/api/admin/nguoidung/*` |
| **Control** | `NguoiDungBll` | Nghiệp vụ quản lý user |
| **Entity** | `TblNguoidung` | Thông tin tài khoản |
| **Entity** | `TblVaitro` | Vai trò (Admin, User) |
| **Entity** | `TblNguoidungVaitro` | Liên kết user-vai trò |
| **Entity** | `TblLichsuDangnhap` | Phân tích hành vi đăng nhập |
| **Entity** | `TblCaiDat` | Xem cài đặt user |
| **Entity** | `TblAuditLog` | Theo dõi thao tác admin |

**Chức năng:**
1. **Tra cứu danh sách** - Tìm kiếm, phân trang user
2. **Phân tích chi tiết** - Xem profile, lịch sử hoạt động
3. **Khóa/Mở tài khoản** - Thay đổi trạng thái
4. **Gán vai trò** - Phân quyền Admin/User
5. **Xem thống kê** - Số lần đăng nhập, hoạt động gần nhất

---

## UC-10: GIÁM SÁT HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-10: GIÁM SÁT HỆ THỐNG                       │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: Admin                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │  (Admin)    │─────►│  AuditLogController─────►│AuditLogBll │ │
│   │             │      │(API_QT prefix /api/admin/audit)│
│   │             │─────►│ NguoiDungController───►│ PhienBll   │ │
│   │             │      │                       │ TongQuanBll│ │
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblAuditLog │ │
│                                                  │ TblToken    │ │
│                                                  │TblLichsuDangnhap│
│                                                  │TblHanHViNguoiDung│
│                                                  │ TblGiaodich  │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `AuditLogController` (API_QT) | API: `/api/admin/audit/*` |
| **Boundary** | `NguoiDungController` | API xem phiên đăng nhập |
| **Control** | `AuditLogBll` | Nghiệp vụ audit log |
| **Control** | `PhienBll` | Quản lý phiên đăng nhập |
| **Control** | `TongQuanBll` | Thống kê hiệu suất |
| **Entity** | `TblAuditLog` | Nhật ký hành động (INSERT/UPDATE/DELETE) |
| **Entity** | `TblToken` | Theo dõi phiên hoạt động |
| **Entity** | `TblLichsuDangnhap` | Lịch sử đăng nhập |
| **Entity** | `TblHanhViNguoiDung` | Theo dõi hành vi sử dụng |
| **Entity** | `TblGiaodich` | Thống kê nhập liệu |

**Chức năng:**
1. **Audit Log** - Xem log tất cả thay đổi dữ liệu
2. **Kiểm soát phiên** - Xem ai đang online, revoke token
3. **Giám sát nhập liệu** - Thống kê số giao dịch/người dùng

---

## UC-11: CẤU HÌNH HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-11: CẤU HÌNH HỆ THỐNG                      │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: Admin                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │  (Admin)    │─────►│ CauHinhController───────►│CauHinhBll │ │
│   │             │      │(API_QT prefix /api/admin/cauhinh)│
│   │             │─────►│ AiController(ND)─────────►│  AiBll    │ │
│   │             │      │                       │TyGiaBll   │ │
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │TblCauHinhHeThong│
│                                                  │ TblTyGium   │ │
│                                                  │ TblGoiYAI   │ │
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `CauHinhController` (API_QT) | API: `/api/admin/cauhinh/*` |
| **Boundary** | `AiController` (API_ND) | API cấu hình AI |
| **Control** | `CauHinhBll` | Nghiệp vụ cấu hình |
| **Control** | `AiBll` | Cấu hình tham số AI Gemini |
| **Control** | `TyGiaBll` | Cập nhật tỷ giá ngoại tệ |
| **Entity** | `TblCauHinhHeThong` | Các tham số hệ thống |
| **Entity** | `TblTyGium` | Tỷ giá ngoại tệ |
| **Entity** | `TblGoiYAI` | Cấu hình gợi ý AI |

**Các tham số cấu hình:**
1. **AI Gemini** - API key, model, temperature
2. **Tỷ giá** - Cập nhật tỷ giá VND/USD/EUR
3. **Quy tắc hệ thống** - Số lần OTP sai, thời hạn token
4. **Ngưỡng cảnh báo** - % ngân sách để cảnh báo

---

## UC-12: QUẢN LÝ TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────────┐
│                  UC-12: QUẢN LÝ TỔNG QUAN                       │
├─────────────────────────────────────────────────────────────────┤
│  👤 Actor: Admin                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐      ┌──────────────────┐      ┌───────────┐ │
│   │   Actor     │      │    Boundary      │      │  Control  │ │
│   │  (Admin)    │─────►│ TongQuanController─────►│TongQuanBll │ │
│   │             │      │(API_QT prefix /api/admin/tongquan)│
│   └─────────────┘      └──────────────────┘      └─────┬─────┘ │
│                                                          ▼       │
│                                                  ┌─────────────┐ │
│                                                  │   Entity    │ │
│                                                  │ TblNguoidung│ │
│                                                  │ TblGiaodich │ │
│                                                  │ TblTonghopThang│
│                                                  │TblGoiYAI    │ │
│                                                  │TblAuditLog  │ │
│                                                  │TblPhanTichChiTieu│
│                                                  └─────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Thành phần | Tên | Vai trò |
|------------|-----|---------|
| **Boundary** | `TongQuanController` (API_QT) | API: `/api/admin/tongquan/*` |
| **Control** | `TongQuanBll` | Tổng hợp số liệu toàn hệ thống |
| **Entity** | `TblNguoidung` | Đếm user, user mới |
| **Entity** | `TblGiaodich` | Thống kê giao dịch |
| **Entity** | `TblTonghopThang` | Dữ liệu tổng hợp |
| **Entity** | `TblGoiYAI` | Hiệu suất AI |
| **Entity** | `TblAuditLog` | Hoạt động hệ thống |
| **Entity** | `TblPhanTichChiTieu` | Phân tích tổng quát |

**Chỉ số tổng quan:**
1. **Tăng trưởng user** - Đăng ký mới theo ngày/tháng
2. **Lưu lượng giao dịch** - Tổng GD, giá trị GD
3. **Hiệu suất AI** - Số gợi ý, độ chính xác
4. **Sức khỏe hệ thống** - Số lỗi, thời gian phản hồi

---

# PHẦN 4: BẢNG TỔNG HỢP

## 4.1. Tổng hợp Boundary (API/Controller)

| STT | Controller | Phân hệ | API Prefix | Use Cases |
|-----|------------|---------|------------|-----------|
| 1 | `XacThucController` | User | `/api/auth/*` | UC-01 |
| 2 | `BaoCaoController` | User | `/api/baocao/*` | UC-02 |
| 3 | `NguoiDungController` (ND) | User | `/api/nguoidung/*` | UC-03 |
| 4 | `TaiKhoanController` | User | `/api/taikhoan/*` | UC-04 |
| 5 | `GiaoDichController` | User | `/api/giaodich/*` | UC-04, UC-08 |
| 6 | `DanhMucController` | User | `/api/danhmuc/*` | UC-04 |
| 7 | `LoaiDanhMucController` | User | `/api/loai-danh-muc/*` | UC-04 |
| 8 | `NganSachController` | User | `/api/ngansach/*` | UC-05, UC-07 |
| 9 | `MucTieuController` | User | `/api/muctieu/*` | UC-05, UC-07 |
| 10 | `GiaoDichDinhKyController` | User | `/api/giaodich-dinh-ky/*` | UC-05 |
| 11 | `AiController` | User | `/api/ai/*` | UC-06 |
| 12 | `ThongBaoController` | User | `/api/thongbao/*` | UC-07 |
| 13 | `ImportController` | User | `/api/import/*` | UC-08 |
| 14 | `UploadController` | User | `/api/upload/*` | UC-08 |
| 15 | `NguoiDungController` (QT) | Admin | `/api/admin/nguoidung/*` | UC-09 |
| 16 | `AuditLogController` | Admin | `/api/admin/audit/*` | UC-10 |
| 17 | `CauHinhController` | Admin | `/api/admin/cauhinh/*` | UC-11 |
| 18 | `TongQuanController` | Admin | `/api/admin/tongquan/*` | UC-12 |

---

## 4.2. Tổng hợp Control (Service/BLL)

| STT | BLL | Phân hệ | Use Cases phụ trách |
|-----|-----|---------|---------------------|
| 1 | `XacThucBll` | User | UC-01 (đăng ký, đăng nhập, OTP) |
| 2 | `DichVuJwt` | User | UC-01 (tạo/verify JWT) |
| 3 | `EmailService` | User | UC-01 (gửi email) |
| 4 | `XacThucTokenMangXaHoi` | User | UC-01 (OAuth) |
| 5 | `ThongTinNguoiMangXaHoi` | User | UC-01 (lấy info social) |
| 6 | `PhienBll` | User | UC-01 (quản lý phiên) |
| 7 | `BaoCaoBll` | User | UC-02 |
| 8 | `NguoiDungBll` | User/Admin | UC-03, UC-09 |
| 9 | `TaiKhoanBll` | User | UC-04 |
| 10 | `GiaoDichBll` | User | UC-04, UC-05, UC-08 |
| 11 | `DanhMucBll` | User | UC-04 |
| 12 | `LoaiDanhMucBll` | User | UC-04 |
| 13 | `NganSachBll` | User | UC-05, UC-07 |
| 14 | `MucTieuBll` | User | UC-05, UC-07 |
| 15 | `GiaoDichDinhKyBll` | User | UC-05 |
| 16 | `AiBll` | User/Admin | UC-06, UC-08, UC-11 |
| 17 | `GeminiService` | User | UC-06 (gọi Gemini API) |
| 18 | `ImportBll` | User | UC-08 |
| 19 | `AuditLogBll` | Admin | UC-10 |
| 20 | `CauHinhBll` | Admin | UC-11 |
| 21 | `TyGiaBll` | Admin | UC-11 |
| 22 | `TongQuanBll` | Admin | UC-10, UC-12 |

---

## 4.3. Tổng hợp Entity (Model/DAL)

| STT | Entity | Bảng DB | Use Cases sử dụng |
|-----|--------|---------|-------------------|
| 1 | `TblNguoidung` | `tbl_nguoidung` | Tất cả UC |
| 2 | `TblVaitro` | `tbl_vaitro` | UC-01, UC-09 |
| 3 | `TblNguoidungVaitro` | `tbl_nguoidung_vaitro` | UC-01, UC-09 |
| 4 | `TblCaiDat` | `tbl_caidat` | UC-01, UC-03 |
| 5 | `TblToken` | `tbl_token` | UC-01, UC-10 |
| 6 | `TblOtp` | `tbl_otp` | UC-01 |
| 7 | `TblResetToken` | `tbl_reset_token` | UC-01 |
| 8 | `TblLichsuDangnhap` | `tbl_lichsu_dangnhap` | UC-01, UC-09, UC-10 |
| 9 | `TblNguoidungSocial` | `tbl_nguoidung_social` | UC-01 |
| 10 | `TblTaiKhoan` | `tbl_taikhoan` | UC-03, UC-04, UC-05 |
| 11 | `TblLoaiTaiKhoan` | `tbl_loai_taikhoan` | UC-04 |
| 12 | `TblDanhmuc` | `tbl_danhmuc` | UC-04, UC-05 |
| 13 | `TblLoaiDanhMuc` | `tbl_loai_danhmuc` | UC-04 |
| 14 | `TblGiaodich` | `tbl_giaodich` | UC-02, UC-04, UC-08, UC-10, UC-12 |
| 15 | `TblGiaoDichDinhKy` | `tbl_giaodich_dinhky` | UC-05 |
| 16 | `TblChiTietGiaoDich` | `tbl_chitiet_giaodich` | UC-04 |
| 17 | `TblTuKhoa` | `tbl_tu_khoa` | UC-04 |
| 18 | `TblNganSach` | `tbl_ngansach` | UC-05, UC-07 |
| 19 | `TblTheoDoiNganSach` | `tbl_theodoi_ngansach` | UC-05 |
| 20 | `TblMucTieu` | `tbl_muctieu` | UC-05, UC-07 |
| 21 | `TblDongGopMucTieu` | `tbl_donggop_muctieu` | UC-05 |
| 22 | `TblGoiYAI` | `tbl_goiy_ai` | UC-06, UC-11, UC-12 |
| 23 | `TblDuDoan` | `tbl_dudoan` | UC-06 |
| 24 | `TblPhanTichChiTieu` | `tbl_phantich_chitieu` | UC-02, UC-06, UC-12 |
| 25 | `TblTonghopThang` | `tbl_tonghop_thang` | UC-02, UC-12 |
| 26 | `TblTonghopDanhmuc` | `tbl_tonghop_danhmuc` | UC-02 |
| 27 | `TblThongBao` | `tbl_thongbao` | UC-07 |
| 28 | `TblCanhBao` | `tbl_canhbao` | UC-07 |
| 29 | `TblNhacNho` | `tbl_nhacnho` | UC-07 |
| 30 | `TblImportFile` | `tbl_import_file` | UC-08 |
| 31 | `TblImportChiTiet` | `tbl_import_chitiet` | UC-08 |
| 32 | `TblTepDinhKem` | `tbl_tep_dinhkem` | UC-08 |
| 33 | `TblAuditLog` | `tbl_audit_log` | UC-09, UC-10, UC-12 |
| 34 | `TblCauHinhHeThong` | `tbl_cauhinh_hethong` | UC-11 |
| 35 | `TblTyGium` | `tbl_tygium` | UC-11 |
| 36 | `TblHanhViNguoiDung` | `tbl_hanhvi_nguoidung` | UC-06, UC-10 |

---

# PHẦN 5: SƠ ĐỒ TƯƠNG TÁC TỔNG QUAN

## 5.1. Kiến trúc phân lớp

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │   Mobile     │  │   Desktop    │              │
│  │  (React.js)  │  │   (React)    │  │   (WPF)      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌────────────────────────────────────────────────────────────────────┐
│                      API LAYER (ASP.NET Core)                      │
│  ┌─────────────────────────┐    ┌─────────────────────────┐        │
│  │       API_ND            │    │       API_QT            │        │
│  │  (Người Dùng/Admin)    │    │   (Quản Trị viên)       │        │
│  │  Prefix: /api/          │    │  Prefix: /api/admin/    │        │
│  └────────────┬────────────┘    └────────────┬────────────┘        │
│               │                              │                      │
└───────────────┼──────────────────────────────┼──────────────────────┘
                │                              │
                ▼                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                    BLL LAYER (Business Logic)                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Shared BLL Services                      │   │
│  │  XacThucBll  │  NguoiDungBll  │  GiaoDichBll  │  AiBll     │   │
│  │  BaoCaoBll   │  TaiKhoanBll   │  DanhMucBll    │  ImportBll │   │
│  │  NganSachBll │  MucTieuBll    │  AuditLogBll   │  CauHinhBll│   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                    DAL LAYER (Data Access)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Shared DAL Repositories                         │   │
│  │  NguoiDungDal │ GiaoDichDal │ DanhMucDal │ TaiKhoanDal    │   │
│  │  NganSachDal  │ MucTieuDal  │ AuditLogDal │ ImportDal     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              tbl_nguoidung, tbl_giaodich, tbl_danhmuc,     │   │
│  │              tbl_taikhoan, tbl_ngansach, tbl_muctieu,     │   │
│  │              tbl_audit_log, tbl_cauhinh_hethong, ...      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

## 5.2. Luồng dữ liệu điển hình (Use Case Đăng nhập)

```
User              Boundary              Control               Entity
 │                    │                    │                    │
 │──Click Login──────►│                    │                    │
 │                    │──Validate──────────►│                    │
 │                    │                    │                    │
 │                    │                    │──Check User────────►│
 │                    │                    │◄──User Found────────│
 │                    │                    │                    │
 │                    │                    │──Verify Password──►│
 │                    │                    │◄──Password OK──────│
 │                    │                    │                    │
 │                    │                    │──Create JWT────────►│
 │                    │                    │◄──Token Created────│
 │                    │                    │                    │
 │                    │                    │──Save Token────────►│
 │                    │                    │◄──Token Saved──────│
 │                    │                    │                    │
 │                    │                    │──Log Login────────►│
 │                    │                    │◄──Log Saved────────│
 │                    │                    │                    │
 │◄──Login Success────│◄──Return Token─────│                    │
 │◄──Redirect to Dashboard                                         │
```

---

# PHẦN 6: QUY TẮC VÀ LƯU Ý

## 6.1. Quy tắc đặt tên

1. **Controller**: `{TinhNang}Controller` (VD: `GiaoDichController`)
2. **Service/BLL**: `{TinhNang}Bll` (VD: `GiaoDichBll`)
3. **DAL**: `{TinhNang}Dal` (VD: `GiaoDichDal`)
4. **Entity/Model**: `Tbl{TenBang}` (VD: `TblGiaodich`)
5. **DTO Request**: `YeuCau{TinhNang}Dto` (VD: `YeuCauDangNhapDto`)
6. **DTO Response**: `PhanHoi{TinhNang}Dto` (VD: `PhanHoiDangNhapDto`)

## 6.2. Quy tắc API

1. **User API**: Prefix `/api/`
2. **Admin API**: Prefix `/api/admin/`
3. **CRUD endpoints**: GET/POST/PUT/DELETE theo REST conventions
4. **Authentication**: JWT Bearer Token trong Header

## 6.3. Quy tắc bảo mật

1. Admin API phải có role `Admin` trong JWT
2. User chỉ truy cập dữ liệu của mình (filter by NguoiDungId)
3. Tất cả thay đổi phải ghi audit log
4. Password phải được hash trước khi lưu

---

# PHỤ LỤC: TRA CỨU NHANH

## Tìm VOPC cho một Use Case cụ thể

| Use Case | Phân hệ | Trang |
|----------|---------|-------|
| UC-01: Xác thực & Bảo mật | User | Trang 2-5 |
| UC-02: Báo cáo & Thống kê | User | Trang 6 |
| UC-03: Quản lý Hồ sơ | User | Trang 7 |
| UC-04: Quản lý Tài chính | User | Trang 8-9 |
| UC-05: Lập kế hoạch | User | Trang 10-11 |
| UC-06: Tối ưu AI | User | Trang 12 |
| UC-07: Thông báo | User | Trang 13 |
| UC-08: Nhập/Xuất dữ liệu | User | Trang 14-15 |
| UC-09: Quản lý Người dùng | Admin | Trang 16 |
| UC-10: Giám sát Hệ thống | Admin | Trang 17 |
| UC-11: Cấu hình Hệ thống | Admin | Trang 18 |
| UC-12: Quản lý Tổng quan | Admin | Trang 19 |

---

*Document được tạo tự động từ TODO.md, VOPC.md và CSDL.md*
*Phiên bản: 1.0 | Ngày tạo: 2026-05-07*

---

# PHỤ LỤC: SO SÁNH CSDL.md VÀ CSDL-2.md

> **CSDL.md**: 37 bảng (phiên bản cũ)
> **CSDL-2.md**: 38 bảng (phiên bản mới)

---

## 1. BẢNG MỚI THÊM VÀO (CSDL-2.md)

| STT | Tên bảng | Mô tả |
|-----|----------|-------|
| 1 | `tbl_quyen` | Danh sách quyền chi tiết (RBAC) |
| 2 | `tbl_vaitro_quyen` | Bảng trung gian gán quyền cho vai trò |
| 3 | `tbl_ai_model` | Cấu hình các model AI (OpenAI, Anthropic...) |
| 4 | `tbl_chat_ai` | Lịch sử hội thoại với AI chatbot |
| 5 | `tbl_prompt_template` | Mẫu prompt cho từng tính năng AI |
| 6 | `tbl_ketnoi_nganhang` | Kết nối Open Banking (VCB, TCB, MoMo...) |
| 7 | `tbl_thongbao_hethong` | Thông báo broadcast tới toàn bộ user |
| 8 | `tbl_phanhoi` | Phản hồi/góp ý từ người dùng |
| 9 | `tbl_phanhoi_traloi` | Lịch sử hội thoại xử lý phản hồi |
| 10 | `tbl_ocr_ketqua` | Kết quả nhận dạng OCR từ ảnh hóa đơn |
| 11 | `tbl_feature_flag` | Bật/tắt tính năng không cần deploy |

**Tổng cộng: 11 bảng mới**

---

## 2. BẢNG BỊ LOẠI BỎ (chỉ có trong CSDL.md)

| STT | Tên bảng | Lý do loại bỏ |
|-----|----------|----------------|
| 1 | `tbl_canhbao` | Tích hợp vào `tbl_thongbao` (LoaiThongBao=4) |
| 2 | `tbl_phantich_chitieu` | Tích hợp vào `tbl_tonghop_thang` |
| 3 | `tbl_tonghop_danhmuc` | Tính toán động từ `tbl_giaodich` khi cần |

**Tổng cộng: 3 bảng bị loại**

---

## 3. TRƯỜNG MỚI THÊM VÀO CÁC BẢNG EXISTING

### tbl_nguoidung
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `EmailDaXacThuc` | bit(1) | 1=Đã xác thực email |
| `SoDienThoaiDaXacThuc` | bit(1) | 1=Đã xác thực SĐT |
| `Dang2FA` | bit(1) | 1=Bật xác thực 2 lớp |
| `LanDangNhapCuoi` | datetime | Lần đăng nhập gần nhất |
| `DaXoa` | bit(1) | Soft delete |

### tbl_taikhoan
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `TenNganHang` | varchar(255) | Tên ngân hàng liên kết |
| `SoTaiKhoan` | varchar(50) | Số tài khoản ngân hàng |
| `HanMucTinDung` | decimal(18,2) | Hạn mức thẻ tín dụng |
| `NgayCapNhatSoDu` | datetime | Lần cuối cập nhật số dư |

### tbl_giaodich
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `NguonTao` | varchar(20) | web / mobile / ai / import |
| `ViTri` | varchar(255) | Tọa độ GPS |
| `MaGiaoDichNgoai` | varchar(255) | Mã từ ngân hàng ngoài |
| `TrangThai` | tinyint(4) | 1=Thành công, 0=Lỗi, 2=Đang xử lý |

### tbl_danhmuc
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `CapDo` | tinyint(4) | 1=Gốc, 2=Con, 3=Cháu |
| `DuongDan` | varchar(500) | Đường dẫn cây: /1/5/28/ |
| `DaXoa` | bit(1) | Soft delete |

### tbl_ngansach
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `SoTienDaChi` | decimal(18,2) | Đã chi tiêu trong tháng |
| `PhanTramDaDung` | float | % đã sử dụng |

### tbl_muctieu
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `Anh` | varchar(255) | Ảnh minh họa mục tiêu |

### tbl_tonghop_thang
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `TyLeTietKiem` | float | % tiết kiệm / thu nhập |

### tbl_lichsu_dangnhap (mở rộng)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `ThietBi` | varchar(255) | User-Agent thiết bị |
| `HeDieuHanh` | varchar(100) | Hệ điều hành |
| `ViTri` | varchar(255) | Vị trí địa lý |

### tbl_import_file (mở rộng)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `LoaiNguon` | varchar(50) | file=CSV / api=API ngân hàng |
| `TongLoi` | int(11) | Tổng số lỗi |

### tbl_import_chitiet (mở rộng)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `GiaoDichId` | int(11) | Giao dịch được tạo ra |
| `TrangThaiXuLy` | tinyint(4) | 0=Chờ, 1=OK, 2=Chờ duyệt, 3=Lỗi |

---

## 4. TÓM TẮT THAY ĐỔI

| Loại | Số lượng |
|------|----------|
| Bảng mới thêm | +11 |
| Bảng bị loại bỏ | -3 |
| **Bảng tăng thêm** | **+8** |

### Thay đổi chính:
1. **RBAC mở rộng**: Thêm `tbl_quyen`, `tbl_vaitro_quyen` cho phân quyền chi tiết
2. **AI nâng cao**: Thêm `tbl_ai_model`, `tbl_chat_ai`, `tbl_prompt_template`
3. **Open Banking**: Thêm `tbl_ketnoi_nganhang` kết nối ngân hàng
4. **OCR**: Thêm `tbl_ocr_ketqua` nhận dạng hóa đơn
5. **Phản hồi user**: Thêm `tbl_phanhoi`, `tbl_phanhoi_traloi`
6. **Thông báo hệ thống**: Thêm `tbl_thongbao_hethong` broadcast
7. **Feature toggle**: Thêm `tbl_feature_flag` bật/tắt tính năng
8. **Xác thực 2FA**: Bổ sung `Dang2FA` trong `tbl_nguoidung`

---

*So sánh thực hiện: 2026-05-11*

---

# PHỤ LỤC: CHI TIẾT CÁC BẢNG MỚI THÊM VÀO

## 1. tbl_quyen - Danh sách quyền chi tiết (RBAC)

> Dùng cho hệ thống phân quyền chi tiết theo mô hình RBAC (Role-Based Access Control)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `QuyenId` | int(11) PK AI | NO | ID quyền |
| `TenQuyen` | varchar(255) UNIQUE | NO | Mã quyền (VD: QuanLyNguoiDung, XemBaoCao) |
| `MoTa` | varchar(255) | YES | Mô tả ý nghĩa quyền |

**Ví dụ dữ liệu:**
| QuyenId | TenQuyen | MoTa |
|---------|----------|------|
| 1 | QuanLyNguoiDung | Quản lý người dùng (CRUD) |
| 2 | XemBaoCao | Xem báo cáo thống kê |
| 3 | QuanLyDanhMuc | Quản lý danh mục |
| 4 | XemGiaoDich | Xem lịch sử giao dịch |
| 5 | QuanLyHeThong | Cấu hình hệ thống |

---

## 2. tbl_vaitro_quyen - Gán quyền cho vai trò

> Bảng trung gian: Một vai trò có thể có nhiều quyền

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `VaiTroId` | int(11) FK | NO | → tbl_vaitro |
| `QuyenId` | int(11) FK | NO | → tbl_quyen |

**Unique:** `(VaiTroId, QuyenId)` - đảm bảo mỗi quyền chỉ được gán 1 lần cho 1 vai trò

**Ví dụ:**
| VaiTro | TenQuyen |
|--------|----------|
| Admin | QuanLyNguoiDung |
| Admin | QuanLyDanhMuc |
| Admin | QuanLyHeThong |
| NhanVien | XemBaoCao |
| NhanVien | XemGiaoDich |

---

## 3. tbl_ai_model - Cấu hình các model AI

> Quản lý danh sách AI model sử dụng trong hệ thống (hỗ trợ đa provider: OpenAI, Anthropic, Google, OpenRouter...)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ModelId` | int(11) PK AI | NO | ID model |
| `TenModel` | varchar(255) | NO | Tên model (VD: gpt-4o, claude-sonnet-4-20250514) |
| `MucDich` | varchar(50) | YES | Mục đích sử dụng: chat, canh_bao, phan_tich_chi_tieu |
| `Provider` | varchar(100) | YES | Nhà cung cấp: OpenAI, Anthropic, Google, OpenRouter |
| `ApiUrl` | varchar(500) | YES | Endpoint API (VD: https://api.openai.com/v1/chat/completions) |
| `ApiKey` | varchar(500) | YES | API Key (khuyến nghị mã hóa AES) |
| `TrangThai` | tinyint(4) | YES | 1=Đang dùng, 0=Tắt |
| `NgayTao` | datetime | YES | Ngày thêm model vào hệ thống |

**Ví dụ dữ liệu:**
| TenModel | MucDich | Provider | TrangThai |
|----------|---------|----------|-----------|
| gpt-4o | chat | OpenAI | 1 |
| claude-sonnet-4-20250514 | chat | Anthropic | 1 |
| gemini-2.0-flash | canh_bao | Google | 1 |
| o4-mini | phan_tich_chi_tieu | OpenAI | 1 |

---

## 4. tbl_chat_ai - Lịch sử hội thoại AI chatbot

> Lưu toàn bộ lịch sử hội thoại với AI chatbot tài chính cá nhân

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ChatId` | int(11) PK AI | NO | ID cuộc hội thoại |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `CauHoi` | text | NO | Câu hỏi của người dùng |
| `TraLoi` | text | YES | Phản hồi từ AI |
| `ModelAI` | varchar(100) | YES | Tên model đã xử lý |
| `SoToken` | int(11) | YES | Tổng token tiêu thụ (input + output) |
| `ChiPhi` | decimal(18,4) | YES | Chi phí API tính bằng USD |
| `ThoiGian` | datetime | YES | Thời điểm thực hiện |
| `TrangThai` | tinyint(4) | YES | 1=Thành công, 0=Lỗi |

**Use case:**
- Lưu lịch sử chat để user xem lại
- Tính chi phí sử dụng AI theo tháng
- Phân tích hành vi user với AI

---

## 5. tbl_prompt_template - Mẫu prompt cho AI

> Quản lý các prompt template cho từng tính năng AI, hỗ trợ placeholder `{placeholder}`

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `PromptId` | int(11) PK AI | NO | ID prompt |
| `TenPrompt` | varchar(255) | NO | Tên định danh (VD: phanloai_giaodich) |
| `NoiDung` | text | NO | Nội dung prompt (có {placeholder}) |
| `LoaiPrompt` | varchar(50) | YES | Loại: chat, ocr, phanloai, dudoan, baocao |
| `TrangThai` | tinyint(4) | YES | 1=Đang dùng, 0=Tắt |
| `NgayTao` | datetime | YES | Ngày tạo |

**Ví dụ nội dung:**
```
LoaiPrompt: phanloai
NoiDung: "Phân loại giao dịch sau vào danh mục phù hợp:
- Mô tả: {mo_ta}
- Số tiền: {so_tien} VND
Danh mục: {danh_sach_danh_muc}
Trả lời JSON: {{"danh_muc_id": x, "do_tin_cay": 0.x}}"
```

---

## 6. tbl_ketnoi_nganhang - Kết nối Open Banking

> Lưu thông tin kết nối với ngân hàng/ví điện tử qua Open Banking API

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `KetNoiId` | int(11) PK AI | NO | ID kết nối |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `Provider` | varchar(100) | NO | Mã provider: VCB, TCB, MOMO, ZALOPAY, ACB... |
| `AccessToken` | text | YES | Access token từ provider (nên mã hóa) |
| `RefreshToken` | text | YES | Refresh token để làm mới access token |
| `HetHan` | datetime | YES | Thời điểm access token hết hạn |
| `TrangThai` | tinyint(4) | YES | 1=Đang kết nối, 0=Ngắt kết nối |
| `NgayTao` | datetime | YES | Ngày thiết lập kết nối |

**Ví dụ:**
| NguoiDungId | Provider | TrangThai |
|--------------|----------|-----------|
| 1 | VCB | 1 |
| 1 | MOMO | 1 |
| 2 | TCB | 0 |

---

## 7. tbl_thongbao_hethong - Thông báo broadcast

> Gửi thông báo tới toàn bộ người dùng (bảo trì, cập nhật, khuyến mãi...)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ThongBaoHeThongId` | int(11) PK AI | NO | ID thông báo |
| `TieuDe` | varchar(255) | NO | Tiêu đề thông báo |
| `NoiDung` | text | YES | Nội dung chi tiết |
| `Loai` | varchar(50) | YES | Loại: system, maintenance, update, promotion |
| `NguoiTao` | int(11) FK | YES | Admin tạo → tbl_nguoidung |
| `NgayGui` | datetime | YES | Thời điểm gửi |
| `NgayHetHan` | datetime | YES | NULL = Vĩnh viễn, có giá trị = tự động ẩn |

**Ví dụ:**
| TieuDe | Loai | NgayHetHan |
|--------|------|------------|
| Bảo trì hệ thống 22:00 | maintenance | 2026-05-15 |
| Cập nhật phiên bản 2.0 | update | 2026-06-01 |
| Khuyến mãi 20% tháng 5 | promotion | 2026-05-31 |

---

## 8. tbl_phanhoi - Phản hồi từ người dùng

> Lưu phản hồi, góp ý, khiếu nại từ người dùng gửi về hệ thống

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `PhanHoiId` | int(11) PK AI | NO | ID phản hồi |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TieuDe` | varchar(255) | NO | Tiêu đề phản hồi |
| `NoiDung` | text | NO | Nội dung chi tiết |
| `TrangThai` | tinyint(4) | YES | 0=Chờ xử lý, 1=Đang xử lý, 2=Đã giải quyết, 3=Từ chối |
| `NgayTao` | datetime | YES | Ngày gửi phản hồi |

---

## 9. tbl_phanhoi_traloi - Hội thoại xử lý phản hồi

> Lịch sử trao đổi giữa admin và user trong quá trình xử lý phản hồi

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TraLoiId` | int(11) PK AI | NO | ID trả lời |
| `PhanHoiId` | int(11) FK | NO | → tbl_phanhoi |
| `NguoiGuiId` | int(11) FK | NO | → tbl_nguoidung (admin hoặc user) |
| `NoiDung` | text | NO | Nội dung trả lời |
| `NgayGui` | datetime | YES | Thời điểm gửi |

**Quy trình:**
1. User gửi phản hồi → `tbl_phanhoi` (TrangThai=0)
2. Admin đọc và trả lời → `tbl_phanhoi_traloi`
3. User tiếp tục hỏi → thêm `tbl_phanhoi_traloi`
4. Admin đánh dấu xong → `tbl_phanhoi.TrangThai=2`

---

## 10. tbl_ocr_ketqua - Kết quả OCR hóa đơn

> Lưu kết quả nhận dạng văn bản từ ảnh hóa đơn bằng AI OCR

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `OcrId` | int(11) PK AI | NO | ID kết quả OCR |
| `TepId` | int(11) FK | NO | → tbl_tep_dinhkem (file ảnh gốc) |
| `NoiDungOCR` | text | YES | Văn bản trích xuất từ ảnh |
| `JsonRaw` | longtext | YES | JSON thô từ AI phân tích |
| `DoTinCay` | float | YES | Độ chính xác OCR (0-1) |
| `NgayXuLy` | datetime | YES | Thời điểm xử lý xong |

**JsonRaw ví dụ:**
```json
{
  "so_hoa_don": "HD001234",
  "ngay": "2026-05-10",
  "nha_cung_cap": "Co.opmart",
  "tong_tien": 150000,
  "cac_mon": [
    {"ten": "Thịt heo", "gia": 80000},
    {"ten": "Rau xanh", "gia": 20000}
  ]
}
```

---

## 11. tbl_feature_flag - Feature Toggle

> Bật/tắt tính năng không cần deploy lại code

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `FeatureId` | int(11) PK AI | NO | ID tính năng |
| `TenFeature` | varchar(255) UNIQUE | NO | Tên định danh feature |
| `BatTat` | bit(1) | YES | 1=Bật, 0=Tắt |
| `MoTa` | varchar(255) | YES | Mô tả chức năng |

**Ví dụ dữ liệu:**
| TenFeature | BatTat | MoTa |
|------------|--------|------|
| EnableAIChat | 1 | Bật chatbot AI tài chính |
| EnableOCR | 1 | Bật nhận diện hóa đơn |
| EnableOpenBanking | 0 | Bật kết nối ngân hàng |
| EnableGamification | 1 | Bật tính năng gamification |
| MaintenanceMode | 0 | Chế độ bảo trì |

---

## SƠ ĐỒ QUAN HỆ MỚI

```
RBAC (Phân quyền):
tbl_vaitro ──── tbl_vaitro_quyen ──── tbl_quyen

AI System:
tbl_ai_model
tbl_prompt_template
tbl_chat_ai

Open Banking:
tbl_ketnoi_nganhang ──→ tbl_nguoidung

OCR:
tbl_tep_dinhkem ──→ tbl_ocr_ketqua

Phản hồi User:
tbl_phanhoi ──── tbl_phanhoi_traloi

Hệ thống:
tbl_thongbao_hethong
tbl_feature_flag
```

---

*Chi tiết bảng mới: 2026-05-11*
