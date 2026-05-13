# Cấu trúc Database - Ứng dụng Quản lý Chi Tiêu

> **Database:** `db47043` | **Engine:** MariaDB 10.11 | **Charset:** utf8mb4

---

## Mục lục

1. [Người dùng & Phân quyền](#1-người-dùng--phân-quyền)
2. [Tài khoản & Giao dịch](#2-tài-khoản--giao-dịch)
3. [Danh mục](#3-danh-mục)
4. [Ngân sách & Mục tiêu](#4-ngân-sách--mục-tiêu)
5. [AI & Chat](#5-ai--chat)
6. [Import & OCR](#6-import--ocr)
7. [Thông báo & Nhắc nhở](#7-thông-báo--nhắc-nhở)
8. [Hệ thống & Cấu hình](#8-hệ-thống--cấu-hình)

---

## 1. Người dùng & Phân quyền

### `tbl_nguoidung`
> Thông tin tài khoản người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `NguoiDungId` | int(11) PK AI | NO | ID người dùng |
| `HoTen` | varchar(255) | NO | Họ tên |
| `Email` | varchar(255) UNIQUE | NO | Email đăng nhập |
| `SoDienThoai` | varchar(20) | YES | Số điện thoại |
| `MatKhau` | varchar(255) | YES | Mật khẩu (bcrypt) |
| `AnhDaiDien` | varchar(500) | YES | Đường dẫn ảnh đại diện |
| `NgayTao` | datetime | YES | Ngày tạo tài khoản |
| `TrangThai` | tinyint(4) | YES | 1=Hoạt động, 0=Khóa |
| `EmailDaXacThuc` | bit(1) | YES | 1=Đã xác thực email |
| `SoDienThoaiDaXacThuc` | bit(1) | YES | 1=Đã xác thực SĐT |
| `Dang2FA` | bit(1) | YES | 1=Bật xác thực 2 lớp |
| `LanDangNhapCuoi` | datetime | YES | Lần đăng nhập gần nhất |
| `DaXoa` | bit(1) | YES | Soft delete |

---

### `tbl_nguoidung_social`
> Liên kết tài khoản mạng xã hội (Google, Facebook...)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `Provider` | varchar(50) | NO | Tên provider: GOOGLE, FACEBOOK... |
| `ProviderId` | varchar(255) | NO | ID từ provider |
| `EmailSocial` | varchar(255) | YES | Email từ tài khoản social |
| `NgayLienKet` | datetime | YES | Ngày liên kết |

**Unique:** `(Provider, ProviderId)`

---

### `tbl_vaitro`
> Danh sách vai trò trong hệ thống

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `VaiTroId` | int(11) PK AI | NO | ID vai trò |
| `TenVaiTro` | varchar(100) UNIQUE | NO | Tên: admin / user / moderator |

---

### `tbl_quyen`
> Danh sách quyền chi tiết (RBAC)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `QuyenId` | int(11) PK AI | NO | ID quyền |
| `TenQuyen` | varchar(255) UNIQUE | NO | Mã quyền (VD: QuanLyNguoiDung) |
| `MoTa` | varchar(255) | YES | Mô tả ý nghĩa quyền |

---

### `tbl_nguoidung_vaitro`
> Bảng trung gian: gán vai trò cho người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `VaiTroId` | int(11) FK | NO | → tbl_vaitro |

---

### `tbl_vaitro_quyen`
> Bảng trung gian: gán quyền cho vai trò

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `VaiTroId` | int(11) FK | NO | → tbl_vaitro |
| `QuyenId` | int(11) FK | NO | → tbl_quyen |

**Unique:** `(VaiTroId, QuyenId)`

---

### `tbl_lichsu_dangnhap`
> Lịch sử đăng nhập của người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `ThoiGian` | datetime | YES | Thời điểm đăng nhập |
| `IpAddress` | varchar(50) | YES | Địa chỉ IP |
| `ThietBi` | varchar(255) | YES | User-Agent thiết bị |
| `KetQua` | tinyint(4) | YES | 1=Thành công, 0=Thất bại |
| `HeDieuHanh` | varchar(100) | YES | Hệ điều hành |
| `ViTri` | varchar(255) | YES | Vị trí địa lý |

---

### `tbl_otp`
> Mã OTP xác thực email/SĐT

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `otp_id` | int(11) PK AI | NO | ID OTP |
| `email` | varchar(255) | NO | Email nhận OTP |
| `otp_code` | varchar(10) | NO | Mã OTP |
| `loai` | varchar(20) | YES | Loại: EMAIL / SMS |
| `ngay_tao` | datetime | NO | Ngày tạo |
| `ngay_het_han` | datetime | NO | Ngày hết hạn |
| `so_lan_sai` | int(11) | YES | Số lần nhập sai |
| `da_su_dung` | tinyint(1) | YES | 1=Đã dùng |

---

### `tbl_reset_token`
> Token đặt lại mật khẩu

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `reset_token_id` | int(11) PK AI | NO | ID token |
| `email` | varchar(255) | NO | Email yêu cầu reset |
| `reset_token` | varchar(255) | NO | Chuỗi token |
| `nguoi_dung_id` | int(11) | NO | ID người dùng |
| `ngay_tao` | datetime | NO | Ngày tạo |
| `ngay_het_han` | datetime | NO | Ngày hết hạn |
| `da_su_dung` | tinyint(1) | YES | 1=Đã sử dụng |

---

### `tbl_token`
> JWT Access & Refresh Token

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TokenId` | int(11) PK AI | NO | ID token |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `AccessToken` | text | YES | JWT access token |
| `RefreshToken` | text | YES | Refresh token |
| `NgayTao` | datetime | YES | Ngày tạo |
| `NgayHetHan` | datetime | YES | Ngày hết hạn |

---

### `tbl_caidat`
> Cài đặt cá nhân của từng người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `CaiDatId` | int(11) PK AI | NO | ID cài đặt |
| `NguoiDungId` | int(11) FK UNIQUE | NO | → tbl_nguoidung |
| `NgonNgu` | varchar(10) | YES | Ngôn ngữ: vi / en |
| `TienTe` | varchar(10) | YES | Đơn vị tiền tệ: VND / USD |
| `CheDoToi` | bit(1) | YES | 1=Dark mode |
| `DinhDangNgay` | varchar(20) | YES | VD: dd/MM/yyyy |
| `NhanThongBao` | bit(1) | YES | 1=Nhận thông báo |

---

## 2. Tài khoản & Giao dịch

### `tbl_loai_taikhoan`
> Danh mục loại tài khoản

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `LoaiTaiKhoanId` | int(11) PK AI | NO | ID loại |
| `TenLoai` | varchar(100) UNIQUE | NO | Tiền mặt / Ngân hàng / Ví điện tử / Thẻ tín dụng / Tiết kiệm |

---

### `tbl_taikhoan`
> Tài khoản tài chính của người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TaiKhoanId` | int(11) PK AI | NO | ID tài khoản |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `LoaiTaiKhoanId` | int(11) FK | NO | → tbl_loai_taikhoan |
| `TenTaiKhoan` | varchar(255) | NO | Tên hiển thị |
| `SoDu` | decimal(18,2) | YES | Số dư hiện tại |
| `SoDuBanDau` | decimal(18,2) | YES | Số dư ban đầu |
| `TienTe` | varchar(10) | YES | VND / USD... |
| `MauSac` | varchar(50) | YES | Màu hiển thị (hex) |
| `Icon` | varchar(100) | YES | Tên icon |
| `NgayTao` | datetime | YES | Ngày tạo |
| `TrangThai` | tinyint(4) | YES | 1=Hoạt động |
| `TenNganHang` | varchar(255) | YES | Tên ngân hàng liên kết |
| `SoTaiKhoan` | varchar(50) | YES | Số tài khoản ngân hàng |
| `HanMucTinDung` | decimal(18,2) | YES | Hạn mức (thẻ tín dụng) |
| `NgayCapNhatSoDu` | datetime | YES | Lần cuối cập nhật số dư |

---

### `tbl_giaodich`
> Lịch sử giao dịch tài chính

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `GiaoDichId` | int(11) PK AI | NO | ID giao dịch |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TaiKhoanId` | int(11) FK | NO | Tài khoản nguồn |
| `TaiKhoanDichId` | int(11) FK | YES | Tài khoản đích (chuyển khoản) |
| `DanhMucId` | int(11) FK | YES | → tbl_danhmuc |
| `LoaiGiaoDich` | tinyint(4) | NO | 1=Thu, 2=Chi, 3=Chuyển khoản |
| `SoTien` | decimal(18,2) | NO | Số tiền giao dịch |
| `TienTe` | varchar(10) | YES | Đơn vị tiền tệ |
| `TyGiaQuyDoi` | decimal(18,6) | YES | Tỷ giá quy đổi |
| `NgayGiaoDich` | datetime | NO | Ngày thực hiện |
| `MoTa` | varchar(500) | YES | Ghi chú |
| `NguonDuLieu` | tinyint(4) | YES | Nguồn nhập liệu |
| `LaTuDong` | bit(1) | YES | 1=Tự động tạo |
| `DoTinCay` | float | YES | Độ tin cậy phân loại AI (0-1) |
| `ImportId` | int(11) | YES | Liên kết lần import |
| `NgayTao` | datetime | YES | Ngày tạo bản ghi |
| `TrangThai` | tinyint(4) | YES | 1=Thành công, 0=Lỗi, 2=Đang xử lý |
| `NguonTao` | varchar(20) | YES | web / mobile / ai / import |
| `ViTri` | varchar(255) | YES | Tọa độ GPS |
| `MaGiaoDichNgoai` | varchar(255) | YES | Mã từ ngân hàng ngoài |

---

### `tbl_chitiet_giaodich`
> Chi tiết từng hạng mục trong một giao dịch (split)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID chi tiết |
| `GiaoDichId` | int(11) FK | NO | → tbl_giaodich |
| `DanhMucId` | int(11) FK | NO | → tbl_danhmuc |
| `SoTien` | decimal(18,2) | NO | Số tiền hạng mục |
| `MoTa` | varchar(255) | YES | Ghi chú hạng mục |

---

### `tbl_giaodich_dinhky`
> Giao dịch lặp lại định kỳ (lương, tiền thuê nhà...)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TaiKhoanId` | int(11) FK | NO | → tbl_taikhoan |
| `DanhMucId` | int(11) FK | YES | → tbl_danhmuc |
| `TenGiaoDich` | varchar(255) | NO | Tên giao dịch |
| `LoaiGiaoDich` | tinyint(4) | NO | 1=Thu, 2=Chi |
| `SoTien` | decimal(18,2) | NO | Số tiền |
| `ChuKy` | varchar(20) | NO | daily / weekly / monthly / yearly |
| `NgayBatDau` | datetime | NO | Ngày bắt đầu |
| `NgayKetThuc` | datetime | YES | Ngày kết thúc |
| `LanTiepTheo` | datetime | YES | Lần thực hiện tiếp theo |
| `TrangThai` | tinyint(4) | YES | 1=Đang hoạt động |

---

### `tbl_tep_dinhkem`
> File đính kèm (ảnh hóa đơn, PDF...)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TepId` | int(11) PK AI | NO | ID file |
| `TenFile` | varchar(255) | NO | Tên file gốc |
| `DuongDan` | varchar(500) | NO | Đường dẫn lưu trữ |
| `LoaiFile` | varchar(50) | YES | MIME type |
| `KichThuoc` | int(11) | YES | Kích thước (bytes) |
| `NgayTao` | datetime | YES | Ngày upload |

---

### `tbl_giaodich_tep`
> Bảng trung gian: giao dịch ↔ file đính kèm

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `GiaoDichId` | int(11) FK | NO | → tbl_giaodich |
| `TepId` | int(11) FK | NO | → tbl_tep_dinhkem |

---

### `tbl_tygia`
> Tỷ giá quy đổi tiền tệ

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TyGiaId` | int(11) PK AI | NO | ID |
| `TuTienTe` | varchar(10) | NO | Tiền tệ gốc (VD: USD) |
| `SangTienTe` | varchar(10) | NO | Tiền tệ đích (VD: VND) |
| `TyGia` | decimal(18,6) | NO | Tỷ giá |
| `NgayCapNhat` | datetime | YES | Ngày cập nhật |

---

### `tbl_ketnoi_nganhang`
> Kết nối Open Banking với ngân hàng/ví điện tử

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `KetNoiId` | int(11) PK AI | NO | ID kết nối |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `Provider` | varchar(100) | NO | VCB / TCB / MOMO / ZALOPAY... |
| `AccessToken` | text | YES | Access token (nên mã hóa) |
| `RefreshToken` | text | YES | Refresh token |
| `HetHan` | datetime | YES | Thời hạn access token |
| `TrangThai` | tinyint(4) | YES | 1=Đang kết nối |
| `NgayTao` | datetime | YES | Ngày thiết lập |

---

## 3. Danh mục

### `tbl_loai_danhmuc`
> Phân loại danh mục: Thu nhập hoặc Chi tiêu

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `LoaiDanhMucId` | int(11) PK AI | NO | ID loại |
| `TenLoai` | varchar(100) UNIQUE | NO | Thu nhập / Chi tiêu |

---

### `tbl_danhmuc`
> Danh mục phân loại giao dịch (có hỗ trợ cây phân cấp)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `DanhMucId` | int(11) PK AI | NO | ID danh mục |
| `TenDanhMuc` | varchar(255) | NO | Tên danh mục |
| `LoaiDanhMucId` | int(11) FK | NO | → tbl_loai_danhmuc |
| `DanhMucChaId` | int(11) | YES | ID danh mục cha (cây phân cấp) |
| `NguoiDungId` | int(11) FK | YES | NULL=Hệ thống, có giá trị=Tùy chỉnh |
| `Icon` | varchar(100) | YES | Tên icon |
| `MauSac` | varchar(50) | YES | Màu hiển thị (hex) |
| `ThuTu` | int(11) | YES | Thứ tự sắp xếp |
| `TrangThai` | tinyint(4) | YES | 1=Hiển thị |
| `CapDo` | tinyint(4) | YES | 1=Gốc, 2=Con, 3=Cháu |
| `DuongDan` | varchar(500) | YES | Đường dẫn cây: /1/5/28/ |
| `DaXoa` | bit(1) | YES | Soft delete |

---

### `tbl_tu_khoa`
> Từ khóa tự động phân loại danh mục cho giao dịch import

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TuKhoaId` | int(11) PK AI | NO | ID từ khóa |
| `NguoiDungId` | int(11) FK | YES | NULL=Hệ thống |
| `TuKhoa` | varchar(255) | NO | Chuỗi từ khóa (VD: GRAB FOOD) |
| `DanhMucId` | int(11) FK | NO | → tbl_danhmuc |
| `DoUuTien` | int(11) | YES | Độ ưu tiên khớp |

---

## 4. Ngân sách & Mục tiêu

### `tbl_ngansach`
> Ngân sách theo danh mục từng tháng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `NganSachId` | int(11) PK AI | NO | ID ngân sách |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `DanhMucId` | int(11) FK | NO | → tbl_danhmuc |
| `SoTienToiDa` | decimal(18,2) | NO | Hạn mức chi tiêu |
| `Thang` | int(11) | NO | Tháng (1-12) |
| `Nam` | int(11) | NO | Năm |
| `SoTienDaChi` | decimal(18,2) | YES | Đã chi tiêu |
| `PhanTramDaDung` | float | YES | % đã sử dụng |
| `TrangThai` | tinyint(4) | YES | 1=Đang theo dõi |

---

### `tbl_theodoi_ngansach`
> Lịch sử cập nhật tiến độ ngân sách

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `NganSachId` | int(11) FK | NO | → tbl_ngansach |
| `SoTienDaChi` | decimal(18,2) | YES | Số tiền đã chi tại thời điểm |
| `PhanTramDaDung` | float | YES | % đã dùng |
| `NgayCapNhat` | datetime | YES | Thời điểm cập nhật |

---

### `tbl_muctieu`
> Mục tiêu tiết kiệm

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `MucTieuId` | int(11) PK AI | NO | ID mục tiêu |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TaiKhoanId` | int(11) FK | YES | → tbl_taikhoan |
| `TenMucTieu` | varchar(255) | NO | Tên mục tiêu |
| `SoTienMucTieu` | decimal(18,2) | NO | Số tiền cần đạt |
| `SoTienHienTai` | decimal(18,2) | YES | Số tiền hiện có |
| `NgayBatDau` | datetime | YES | Ngày bắt đầu |
| `NgayKetThuc` | datetime | YES | Deadline |
| `Icon` | varchar(100) | YES | Icon |
| `MauSac` | varchar(50) | YES | Màu (hex) |
| `TrangThai` | tinyint(4) | YES | 1=Đang thực hiện, 2=Hoàn thành |
| `Anh` | varchar(255) | YES | Ảnh minh họa |

---

### `tbl_donggop_muctieu`
> Lịch sử đóng góp vào mục tiêu tiết kiệm

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `MucTieuId` | int(11) FK | NO | → tbl_muctieu |
| `SoTien` | decimal(18,2) | NO | Số tiền đóng góp |
| `NgayDongGop` | datetime | YES | Ngày đóng góp |
| `GhiChu` | varchar(255) | YES | Ghi chú |

---

### `tbl_tonghop_thang`
> Tổng hợp thu/chi/tiết kiệm theo tháng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `Thang` | int(11) | NO | Tháng (1-12) |
| `Nam` | int(11) | NO | Năm |
| `TongThu` | decimal(18,2) | YES | Tổng thu nhập |
| `TongChi` | decimal(18,2) | YES | Tổng chi tiêu |
| `TietKiem` | decimal(18,2) | YES | Tiết kiệm = Thu - Chi |
| `NgayCapNhat` | datetime | YES | Ngày cập nhật |
| `TyLeTietKiem` | float | YES | % tiết kiệm / thu nhập |

**Unique:** `(NguoiDungId, Thang, Nam)`

---

### `tbl_nhacnho`
> Nhắc nhở định kỳ cho người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `NhacNhoId` | int(11) PK AI | NO | ID nhắc nhở |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TieuDe` | varchar(255) | YES | Tiêu đề |
| `NoiDung` | varchar(500) | YES | Nội dung chi tiết |
| `NgayNhac` | datetime | YES | Thời điểm nhắc |
| `LapLai` | tinyint(4) | YES | 0=Một lần, 1=Ngày, 3=Tháng... |
| `TrangThai` | tinyint(4) | YES | 1=Đang bật |

---

## 5. AI & Chat

### `tbl_ai_model`
> Cấu hình các model AI sử dụng trong hệ thống

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ModelId` | int(11) PK AI | NO | ID model |
| `TenModel` | varchar(255) | NO | VD: gpt-4o, claude-sonnet-4 |
| `MucDich` | varchar(50) | YES | chat / canh_bao / phan_tich_chi_tieu |
| `Provider` | varchar(100) | YES | OpenAI / Anthropic / Google / OpenRouter |
| `ApiUrl` | varchar(500) | YES | Endpoint API |
| `ApiKey` | varchar(500) | YES | API Key (khuyến nghị mã hóa AES) |
| `TrangThai` | tinyint(4) | YES | 1=Đang dùng, 0=Tắt |
| `NgayTao` | datetime | YES | Ngày thêm |

---

### `tbl_chat_ai`
> Lịch sử hội thoại với AI chatbot tài chính

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ChatId` | int(11) PK AI | NO | ID cuộc hội thoại |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `CauHoi` | text | NO | Câu hỏi của người dùng |
| `TraLoi` | text | YES | Phản hồi từ AI |
| `ModelAI` | varchar(100) | YES | Tên model đã xử lý |
| `SoToken` | int(11) | YES | Tổng token tiêu thụ |
| `ChiPhi` | decimal(18,4) | YES | Chi phí API (USD) |
| `ThoiGian` | datetime | YES | Thời điểm thực hiện |
| `TrangThai` | tinyint(4) | YES | 1=Thành công, 0=Lỗi |

---

### `tbl_goiy_ai`
> Gợi ý tài chính từ AI gửi cho người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `GoiYId` | int(11) PK AI | NO | ID gợi ý |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `LoaiGoiY` | tinyint(4) | YES | 1=Tiết kiệm, 2=Cảnh báo, 3=Chúc mừng |
| `NoiDung` | varchar(1000) | NO | Nội dung gợi ý |
| `NgayTao` | datetime | YES | Ngày tạo |
| `DaDoc` | bit(1) | YES | 1=Đã đọc |
| `TrangThai` | tinyint(4) | YES | 1=Đang hiển thị |

---

### `tbl_dudoan`
> Dự đoán thu chi tháng tới bằng AI

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `DuDoanId` | int(11) PK AI | NO | ID dự đoán |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `Thang` | int(11) | NO | Tháng dự đoán |
| `Nam` | int(11) | NO | Năm dự đoán |
| `DuDoanChiTieu` | decimal(18,2) | YES | Chi tiêu dự đoán (VND) |
| `DuDoanThuNhap` | decimal(18,2) | YES | Thu nhập dự đoán (VND) |
| `DoChinhXac` | float | YES | Độ chính xác (0-1) |
| `NgayDuDoan` | datetime | YES | Thời điểm tạo dự đoán |

---

### `tbl_prompt_template`
> Mẫu prompt cho từng tính năng AI

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `PromptId` | int(11) PK AI | NO | ID prompt |
| `TenPrompt` | varchar(255) | NO | Tên định danh |
| `NoiDung` | text | NO | Nội dung prompt (có {placeholder}) |
| `LoaiPrompt` | varchar(50) | YES | chat / ocr / phanloai / dudoan / baocao |
| `TrangThai` | tinyint(4) | YES | 1=Đang dùng |
| `NgayTao` | datetime | YES | Ngày tạo |

---

### `tbl_hanhvi_nguoidung`
> Theo dõi hành vi thao tác của người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `HanhDong` | varchar(255) | NO | Loại hành động (VD: Thêm giao dịch) |
| `DoiTuong` | varchar(100) | YES | Đối tượng tác động |
| `ThoiGian` | datetime | YES | Thời điểm thực hiện |
| `IpAddress` | varchar(50) | YES | Địa chỉ IP |
| `ChiTietThayDoi` | text | YES | Chi tiết thay đổi (JSON) |

---

## 6. Import & OCR

### `tbl_import_file`
> Quản lý các lần import file giao dịch

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ImportId` | int(11) PK AI | NO | ID import |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TaiKhoanId` | int(11) FK | NO | → tbl_taikhoan |
| `TenFile` | varchar(255) | YES | Tên file gốc |
| `NgayImport` | datetime | YES | Ngày import |
| `TongDong` | int(11) | YES | Tổng số dòng |
| `SoDongThanhCong` | int(11) | YES | Số dòng thành công |
| `SoDongLoi` | int(11) | YES | Số dòng lỗi |
| `TrangThai` | tinyint(4) | YES | 0=Đang xử lý, 1=Hoàn thành |
| `LoaiNguon` | varchar(50) | YES | file=CSV upload / api=API ngân hàng |
| `TongLoi` | int(11) | YES | Tổng số lỗi phát sinh |

---

### `tbl_import_chitiet`
> Chi tiết từng dòng trong file import

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID |
| `GiaoDichId` | int(11) | YES | Giao dịch được tạo ra |
| `ImportId` | int(11) FK | NO | → tbl_import_file |
| `NgayGiaoDich` | datetime | YES | Ngày giao dịch |
| `MoTa` | varchar(500) | YES | Mô tả gốc từ file |
| `SoTien` | decimal(18,2) | YES | Số tiền |
| `DanhMucGoiY` | int(11) FK | YES | Danh mục AI đề xuất |
| `DoTinCay` | float | YES | Độ tin cậy phân loại (0-1) |
| `TrangThaiXuLy` | tinyint(4) | YES | 0=Chờ, 1=OK, 2=Chờ duyệt, 3=Lỗi |
| `GhiChuLoi` | varchar(255) | YES | Nội dung lỗi |
| `CapNhatLuc` | datetime | YES | Thời điểm cập nhật |

---

### `tbl_ocr_ketqua`
> Kết quả nhận dạng văn bản từ ảnh hóa đơn

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `OcrId` | int(11) PK AI | NO | ID kết quả OCR |
| `TepId` | int(11) FK | NO | → tbl_tep_dinhkem |
| `NoiDungOCR` | text | YES | Văn bản trích xuất |
| `JsonRaw` | longtext | YES | JSON thô từ AI phân tích |
| `DoTinCay` | float | YES | Độ chính xác OCR (0-1) |
| `NgayXuLy` | datetime | YES | Thời điểm xử lý |

---

## 7. Thông báo & Nhắc nhở

### `tbl_thongbao`
> Thông báo cá nhân gửi đến từng người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ThongBaoId` | int(11) PK AI | NO | ID thông báo |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TieuDe` | varchar(255) | NO | Tiêu đề |
| `NoiDung` | varchar(1000) | YES | Nội dung |
| `LoaiThongBao` | tinyint(4) | YES | 1=Thông tin, 2=Gợi ý AI, 3=Nhắc nhở, 4=Cảnh báo |
| `NgayTao` | datetime | YES | Ngày tạo |
| `DaDoc` | bit(1) | YES | 1=Đã đọc |

---

### `tbl_thongbao_hethong`
> Thông báo broadcast gửi tới toàn bộ người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `ThongBaoHeThongId` | int(11) PK AI | NO | ID |
| `TieuDe` | varchar(255) | NO | Tiêu đề |
| `NoiDung` | text | YES | Nội dung |
| `Loai` | varchar(50) | YES | system / maintenance / update / promotion |
| `NguoiTao` | int(11) FK | YES | Admin tạo → tbl_nguoidung |
| `NgayGui` | datetime | YES | Thời điểm gửi |
| `NgayHetHan` | datetime | YES | NULL=Vĩnh viễn |

---

### `tbl_phanhoi`
> Phản hồi, góp ý, khiếu nại từ người dùng

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `PhanHoiId` | int(11) PK AI | NO | ID phản hồi |
| `NguoiDungId` | int(11) FK | NO | → tbl_nguoidung |
| `TieuDe` | varchar(255) | NO | Tiêu đề |
| `NoiDung` | text | NO | Nội dung chi tiết |
| `TrangThai` | tinyint(4) | YES | 0=Chờ, 1=Đang xử lý, 2=Đã giải quyết, 3=Từ chối |
| `NgayTao` | datetime | YES | Ngày gửi |

---

### `tbl_phanhoi_traloi`
> Lịch sử hội thoại xử lý phản hồi (admin ↔ user)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `TraLoiId` | int(11) PK AI | NO | ID trả lời |
| `PhanHoiId` | int(11) FK | NO | → tbl_phanhoi |
| `NguoiGuiId` | int(11) FK | NO | → tbl_nguoidung |
| `NoiDung` | text | NO | Nội dung trả lời |
| `NgayGui` | datetime | YES | Ngày gửi |

---

## 8. Hệ thống & Cấu hình

### `tbl_cauhinh_hethong`
> Tham số cấu hình toàn hệ thống

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `CauHinhId` | int(11) PK AI | NO | ID cấu hình |
| `TenThamSo` | varchar(100) UNIQUE | NO | Tên tham số |
| `GiaTri` | varchar(255) | NO | Giá trị |
| `MoTa` | varchar(255) | YES | Mô tả |
| `KieuDuLieu` | varchar(50) | YES | int / float / bool / string |

---

### `tbl_feature_flag`
> Bật/tắt tính năng không cần deploy lại

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `FeatureId` | int(11) PK AI | NO | ID tính năng |
| `TenFeature` | varchar(255) UNIQUE | NO | Tên: EnableAIChat / EnableOCR... |
| `BatTat` | bit(1) | YES | 1=Bật, 0=Tắt |
| `MoTa` | varchar(255) | YES | Mô tả mục đích |

---

### `tbl_audit_log`
> Nhật ký thao tác dữ liệu (audit trail)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `Id` | int(11) PK AI | NO | ID bản ghi |
| `NguoiDungId` | int(11) | YES | Người thực hiện |
| `TenBang` | varchar(100) | NO | Tên bảng bị tác động |
| `BanGhiId` | int(11) | YES | ID bản ghi bị tác động |
| `HanhDong` | varchar(20) | NO | INSERT / UPDATE / DELETE |
| `DuLieuCu` | text | YES | Dữ liệu trước thay đổi (JSON) |
| `DuLieuMoi` | text | YES | Dữ liệu sau thay đổi (JSON) |
| `ThoiGian` | datetime | YES | Thời điểm thực hiện |
| `IpAddress` | varchar(50) | YES | Địa chỉ IP |

---

## Sơ đồ quan hệ tóm tắt

```
tbl_nguoidung
├── tbl_caidat (1-1)
├── tbl_nguoidung_vaitro → tbl_vaitro → tbl_vaitro_quyen → tbl_quyen
├── tbl_nguoidung_social
├── tbl_taikhoan
│   └── tbl_giaodich
│       ├── tbl_chitiet_giaodich
│       └── tbl_giaodich_tep → tbl_tep_dinhkem → tbl_ocr_ketqua
├── tbl_danhmuc (← tbl_loai_danhmuc)
├── tbl_ngansach → tbl_theodoi_ngansach
├── tbl_muctieu → tbl_donggop_muctieu
├── tbl_chat_ai
├── tbl_goiy_ai
├── tbl_dudoan
├── tbl_thongbao
├── tbl_nhacnho
└── tbl_import_file → tbl_import_chitiet
```

---

*Tổng số bảng: **38** | Phiên bản: MariaDB 10.11 | Charset: utf8mb4*