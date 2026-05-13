# CẤU TRÚC GIAO DIỆN FRONTEND (FE)

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-05-08  
> **Mô tả**: Tài liệu mô tả chi tiết từng giao diện - hiển thị, chức năng, API và dữ liệu mẫu

---

## MỤC LỤC

1. [Tổng quan cấu trúc](#1-tổng-quan-cấu-trúc)
2. [Trang Chủ (TrangChu)](#2-trang-chủ-trangchu)
3. [Quản lý Giao dịch (GiaoDich)](#3-quản-lý-giao-dịch-giaodich)
4. [Quản lý Tài khoản (TaiKhoan)](#4-quản-lý-tài-khoản-taikhoan)
5. [Quản lý Danh mục (DanhMuc)](#5-quản-lý-danh-mục-danhmuc)
6. [Mục tiêu Tiết kiệm (MucTieu)](#6-mục-tiêu-tiết-kiệm-muctieu)
7. [Báo cáo Phân tích (BaoCao)](#7-báo-cáo-phân-tích-baocao)
8. [Trung tâm AI (TrungTamAI)](#8-trung-tâm-ai-trungtamai)
9. [Thông báo (ThongBao)](#9-thông-báo-thongbao)
10. [Cài đặt (CaiDat)](#10-cài-đặt-caidat)
11. [Hồ sơ (HoSo)](#11-hồ-sơ-hoso)
12. [Trang Admin](#12-trang-admin)
13. [Tổng kết API theo trang](#13-tổng-kết-api-theo-trang)

---

## 1. TỔNG QUAN CẤU TRÚC

### 1.1 Cấu trúc thư mục

```
FE/fe/
├── app/
│   ├── (user)/                 # Nhóm trang người dùng (có layout đăng nhập)
│   │   ├── TrangChu/
│   │   ├── GiaoDich/
│   │   ├── TaiKhoan/
│   │   ├── DanhMuc/
│   │   ├── MucTieu/
│   │   ├── BaoCao/
│   │   ├── TrungTamAI/
│   │   ├── ThongBao/
│   │   ├── CaiDat/
│   │   └── HoSo/
│   ├── admin/                  # Trang quản trị
│   └── DieuKhoanDichVu/
├── thanh_phan/                 # Components tái sử dụng
│   ├── ui/                     # UI cơ bản (Button, Input, Badge, Dialog...)
│   ├── animation/               # Animation effects
│   └── user/                   # Components theo module
├── dich_vu/                    # Services gọi API
│   ├── giaodich/
│   ├── taikhoan/
│   ├── danhmuc/
│   ├── muctieu/
│   ├── baocao/
│   ├── ai/
│   ├── thongbao/
│   ├── caidat/
│   └── trangchu/
├── types/                      # TypeScript types
├── hooks/                       # Custom React hooks
├── thu_vien/                    # Thư viện dùng chung
├── chia_se/                     # Code chia sẻ (constants, utils)
└── tinh_nang/                   # Features theo module
```

### 1.2 Base URLs

- **API Người dùng (ND)**: `http://192.168.1.8:5000` (env: `NEXT_PUBLIC_API_ND_BASE_URL`)
- **API Quản trị (QT)**: `http://192.168.1.9:5001` (env: `NEXT_PUBLIC_API_QT_BASE_URL`)

### 1.3 Mapping Database → UI

| Bảng DB | Module UI | Trang |
|---------|----------|-------|
| `tbl_nguoidung` | Người dùng | HoSo, CaiDat |
| `tbl_taikhoan` | Tài khoản | TaiKhoan, TrangChu |
| `tbl_danhmuc` | Danh mục | DanhMuc, GiaoDich |
| `tbl_giaodich` | Giao dịch | GiaoDich, TrangChu |
| `tbl_ngansach` | Ngân sách | TrangChu |
| `tbl_muctieu` | Mục tiêu | MucTieu |
| `tbl_thongbao` | Thông báo | ThongBao |
| `tbl_goiy_ai` | AI | TrungTamAI, TrangChu |
| `tbl_dudoan` | AI | TrungTamAI |

---

## 2. TRANG CHỦ (TrangChu)

**Đường dẫn**: `/TrangChu`  
**File**: `app/(user)/TrangChu/page.tsx`

### 2.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ "Tổng quan tài chính" - "Theo dõi dòng tiền rõ ràng"       │
│ [Thêm giao dịch] [Xem báo cáo]                             │
├──────────────────────────────────────────────────────────────┤
│ THẺ TỔNG QUAN (TheTongQuan)                                 │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│ │Tổng thu│ │Tổng chi│ │Tiết kiệm│ │Số dư thuần│            │
│ │ 15.5M  │ │ 8.2M   │ │ 7.3M   │ │ 12.1M  │                │
│ └────────┘ └────────┘ └────────┘ └────────┘                 │
├──────────────────────────────────────────────────────────────┤
│ SỐ DƯ TÀI KHOẢN (SoDuTaiKhoan)                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ Vietcombank  │ │ Ví Momo      │ │ Tiền mặt     │         │
│ │ 10,500,000đ  │ │ 1,200,000đ  │ │ 400,000đ    │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
├────────────────────────────┬─────────────────────────────────┤
│ BIỂU ĐỒ CHI TIÊU           │ GỢI Ý AI (GoiYAI)              │
│ (BieuDoChiTieu)            │ • "Chi tiêu tháng này tăng 15%" │
│ [Chart 12 tháng]           │ • "Nên giảm chi tiêu ăn uống"    │
│                            ├─────────────────────────────────┤
│                            │ MỤC TIÊU & NGÂN SÁCH            │
│                            │ (MucTieuNganSach)                │
│                            │ ████████░░ 80% Ăn uống         │
│                            ├─────────────────────────────────┤
│                            │ GIAO DỊCH GẦN NHẤT (BangGiaoDich)│
│                            │ • -150k Starbucks               │
│                            │ • -500k Tiền điện              │
│                            │ • +15M Lương                   │
└────────────────────────────┴─────────────────────────────────┘
```

### 2.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem tổng quan | Hiển thị tổng thu/chi/tiết kiệm/thuần |
| Xem số dư | Danh sách tài khoản với số dư |
| Xem biểu đồ | Chart thu chi 12 tháng |
| Xem gợi ý AI | 3 gợi ý AI gần nhất |
| Xem ngân sách | Progress bar theo danh mục |
| Xem giao dịch | 3 giao dịch gần nhất |
| Thêm giao dịch | Navigate đến `/GiaoDich?form=THEM` |
| Xem báo cáo | Navigate đến `/BaoCao` |

### 2.3 API gọi

| API | Method | Mục đích | Dữ liệu trả về |
|-----|--------|-----------|-----------------|
| `/api/tong-quan` | GET | Tổng quan + biểu đồ | tongThu, tongChi, bieuDoChiTieu[], danhSachNganSach[], danhSachMucTieu[] |
| `/api/tai-khoan` | GET | Danh sách tài khoản | taiKhoanId, tenTaiKhoan, loaiTaiKhoan, soDu, icon, mauSac |
| `/api/ai/goi-y` | GET | Gợi ý AI | id, tieuDe, noiDung, loai, ngayTao |
| `/api/giao-dich?page=1&pageSize=3` | GET | 3 giao dịch gần nhất | items[], totalCount, page, pageSize |

### 2.4 Dữ liệu mẫu (Mock Data)

**Hiện tại**: KHÔNG có dữ liệu mẫu cứng - tất cả load từ API. Khi API không có data, hiển thị skeleton loading.

---

## 3. QUẢN LÝ GIAO DỊCH (GiaoDich)

**Đường dẫn**: `/GiaoDich`  
**File**: `app/(user)/GiaoDich/page.tsx`

### 3.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER HERO                                                 │
│ "Quản lý giao dịch"                                         │
│ "Lịch sử giao dịch" - theo dõi dòng tiền                  │
│ [Export CSV] [Thêm giao dịch +]                             │
├──────────────────────────────────────────────────────────────┤
│ BỨC TRANH TÀI CHÍNH                                        │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐   │
│ │ ● TỔNG THU     │ │ ● TỔNG CHI     │ │ ● SỐ DƯ THUẦN │   │
│ │ 15,500,000 đ   │ │ 8,200,000 đ    │ │ 7,300,000 đ    │   │
│ │ Dòng tiền vào  │ │ Dòng tiền ra   │ │ Thu - Chi      │   │
│ └────────────────┘ └────────────────┘ └────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ BỘ LỌC (BoLocGiaoDich)                                      │
│ [Từ ngày] - [Đến ngày] [Loại: Tất cả ▼] [Tài khoản ▼]     │
├──────────────────────────────────────────────────────────────┤
│ BẢNG LỊCH SỬ (BangLichSu)                                   │
│ ┌────┬─────────────┬────────┬──────────┬────────┬─────────┐ │
│ │STT │ Ngày        │ Mô tả  │ Danh mục │ Số tiền│ Hành động│ │
│ ├────┼─────────────┼────────┼──────────┼────────┼─────────┤ │
│ │ 1  │ 08/05/2026 │ Ăn trưa│ Ăn uống  │ -150,000│ [Sửa][Xóa]│ │
│ │ 2  │ 07/05/2026 │ Lương  │ Thu nhập │ +15,000,000│      │ │
│ │ 3  │ 06/05/2026 │ Điện   │ Hóa đơn  │ -500,000│ [Sửa][Xóa]│ │
│ └────┴─────────────┴────────┴──────────┴────────┴─────────┘ │
│ [Trang 1/5] [<] [1] [2] [3] [>]                             │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách | Bảng phân trang (20 giao dịch/trang) |
| Thêm giao dịch | Mở modal form với `?form=THEM` |
| Sửa giao dịch | Mở modal form với `?form=CHINH_SUA&id=X` |
| Xóa giao dịch | Confirm dialog → gọi API DELETE |
| Lọc | Theo ngày, loại (thu/chi/chuyển), tài khoản, danh mục |
| Export | Xuất CSV (chức năng mở rộng) |
| Xem tổng quan | 3 thẻ stats phía trên |

### 3.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/giao-dich?page=1&pageSize=20&...` | GET | Danh sách có filter + phân trang |
| `/api/giao-dich/tong-quan` | GET | Tổng thu/chi/thuần |
| `/api/giao-dich` | POST | Tạo giao dịch mới |
| `/api/giao-dich/{id}` | PUT | Cập nhật giao dịch |
| `/api/giao-dich/{id}` | DELETE | Xóa giao dịch |

### 3.4 Dữ liệu mẫu

**Hiện tại**: KHÔNG có mock data - load từ API. Khi chưa có API, bảng hiển thị empty state với nút "Thêm giao dịch đầu tiên".

---

## 4. QUẢN LÝ TÀI KHOẢN (TaiKhoan)

**Đường dẫn**: `/TaiKhoan`  
**File**: `app/(user)/TaiKhoan/page.tsx`

### 4.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER HERO (Gradient dark)                                  │
│ "Quản lý tài khoản"                                         │
│ "Theo dõi các ví, tài khoản ngân hàng..."                   │
│ [↻ Làm mới] [Thêm tài khoản +]                             │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Tổng số dư: 12,100,000 đ │ 3 tài khoản               │  │
│ └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│ DANH SÁCH TÀI KHOẢN (DanhSachTaiKhoan)                       │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 💳 Vietcombank        │ 💰 Ví Momo        │ 💵 Tiền mặt│    │
│ │ ────────────────────  │ ─────────────────  │ ───────────│    │
│ │ Số dư: 10,500,000 đ  │ Số dư: 1,200,000đ│ 400,000 đ │    │
│ │ Loại: Ngân hàng       │ Loại: Ví điện tử │ Loại: Tiền │    │
│ │ [Sửa] [Xóa]         │ [Sửa] [Xóa]      │ [Sửa][Xóa]│    │
│ └──────────────────────────────────────────────────────┘    │
│ HOẶC (Empty State)                                          │
│ "Chưa có tài khoản nào"                                    │
│ [Thêm tài khoản ngân hàng hoặc ví điện tử để bắt đầu]    │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách | Cards hiển thị tài khoản |
| Xem tổng số dư | Tổng tất cả tài khoản |
| Thêm tài khoản | Mở form với `?form=THEM` |
| Sửa tài khoản | Mở form edit với `?form=CHINH_SUA&id=X` |
| Xóa tài khoản | Confirm dialog |
| Làm mới | Gọi lại API |

### 4.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/tai-khoan` | GET | Danh sách tài khoản |
| `/api/tai-khoan/{id}` | GET | Chi tiết 1 tài khoản |
| `/api/loai-tai-khoan` | GET | Danh sách loại (tiền mặt, ngân hàng...) |
| `/api/tai-khoan` | POST | Tạo tài khoản mới |
| `/api/tai-khoan/{id}` | PUT | Cập nhật tài khoản |
| `/api/tai-khoan/{id}` | DELETE | Xóa tài khoản |

### 4.4 Dữ liệu mẫu

**Hiện tại**: KHÔNG có mock data - load từ API. 

### 4.5 Form Thêm/Sửa Tài khoản

```
┌────────────────────────────────────────┐
│ Thêm tài khoản mới                     │
├────────────────────────────────────────┤
│ Tên tài khoản *                        │
│ [________________]                     │
│                                        │
│ Loại tài khoản *                       │
│ [Tiền mặt          ▼]                 │
│                                        │
│ Số dư ban đầu                          │
│ [0________________]                    │
│                                        │
│ Màu sắc                                │
│ [● ● ● ● ●]                            │
│                                        │
│ [Hủy bỏ]              [Lưu tài khoản]│
└────────────────────────────────────────┘
```

---

## 5. QUẢN LÝ DANH MỤC (DanhMuc)

**Đường dẫn**: `/DanhMuc`  
**File**: `app/(user)/DanhMuc/page.tsx`

### 5.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER HERO                                                  │
│ "Quản lý danh mục"                                          │
│ "Sắp xếp danh mục thông minh"                              │
├──────────────────────────────────────────────────────────────┤
│ QUẢN LÝ DANH MỤC (QuanLyDanhMuc)                            │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 🔵 THU NHẬP                                          │    │
│ │   ├─ 💰 Lương                                       │    │
│ │   ├─ 🎁 Thưởng                                      │    │
│ │   ├─ 📈 Đầu tư                                      │    │
│ │   └─ ➕ Thêm danh mục con                           │    │
│ │                                                      │    │
│ │ 🔴 CHI TIÊU                                         │    │
│ │   ├─ 🍔 Ăn uống                                     │    │
│ │   ├─ 🚗 Di chuyển                                   │    │
│ │   ├─ 🏠 Nhà ở                                       │    │
│ │   ├─ 🛒 Mua sắm                                    │    │
│ │   ├─ 🎮 Giải trí                                   │    │
│ │   ├─ 💊 Sức khỏe                                   │    │
│ │   └─ ➕ Thêm danh mục con                           │    │
│ └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách | Phân theo 2 nhóm: Thu nhập / Chi tiêu |
| Thêm danh mục | Form modal |
| Sửa danh mục | Form modal |
| Xóa danh mục | Confirm dialog |
| Thêm danh mục con | Nested structure |

### 5.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/danh-muc` | GET | Danh sách danh mục (phân loại thu/chi) |
| `/api/danh-muc` | POST | Tạo danh mục mới |
| `/api/danh-muc/{id}` | PUT | Cập nhật danh mục |
| `/api/danh-muc/{id}` | DELETE | Xóa danh mục |

### 5.4 Dữ liệu mẫu

**Danh mục hệ thống mặc định** (từ DB):
- **Thu nhập**: Lương, Thưởng, Đầu tư, Thu nhập khác
- **Chi tiêu**: Ăn uống, Di chuyển, Nhà ở, Mua sắm, Giải trí, Sức khoẻ, Giáo dục, Hóa đơn

---

## 6. MỤC TIÊU TIẾT KIỆM (MucTieu)

**Đường dẫn**: `/MucTieu`  
**File**: `app/(user)/MucTieu/page.tsx`

### 6.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ "Mục tiêu tài chính" - "Cột mốc tài chính"                 │
│ [Tạo mục tiêu mới +]                                       │
├──────────────────────────────────────────────────────────────┤
│ PROGRESS TỔNG QUAN                                          │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Tổng giá trị: 50,000,000 đ                              │ │
│ │ ████████████████░░░░░░░░ 65%                             │ │
│ │ Đã tích lũy: 32,500,000 đ │ Còn lại: 17,500,000 đ        │ │
│ └──────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ TIẾN TRÌNH CHI TIẾT                                         │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐      │
│ │ 🏠 Mua nhà   │ │ 🚗 Mua xe     │ │ ✈️ Du lịch   │      │
│ │ 30,000,000    │ │ 15,000,000    │ │ 5,000,000    │      │
│ │ ████████░░ 80%│ │ ██████░░░░ 60%│ │ ██░░░░░░░ 20%│      │
│ │ [Đóng góp]   │ │ [Đóng góp]    │ │ [Đóng góp]   │      │
│ └───────────────┘ └───────────────┘ └───────────────┘      │
├──────────────────────────────────────────────────────────────┤
│ GỢI Ý                                                       │
│ "Hãy thiết lập tự động trích lương vào mục tiêu..."        │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách | Cards mục tiêu với progress |
| Tạo mục tiêu | Modal form |
| Đóng góp | Modal chọn số tiền |
| Xóa mục tiêu | Confirm dialog |

### 6.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/muc-tieu` | GET | Danh sách mục tiêu |
| `/api/muc-tieu` | POST | Tạo mục tiêu mới |
| `/api/muc-tieu/{id}` | PUT | Cập nhật mục tiêu |
| `/api/muc-tieu/{id}` | DELETE | Xóa mục tiêu |
| `/api/muc-tieu/{id}/dong-gop` | POST | Đóng góp vào mục tiêu |

### 6.4 Dữ liệu mẫu

**Hiện tại**: KHÔNG có mock data - load từ API.

---

## 7. BÁO CÁO PHÂN TÍCH (BaoCao)

**Đường dẫn**: `/BaoCao`  
**File**: `app/(user)/BaoCao/page.tsx`

### 7.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ "Báo cáo tài chính" - "Phân tích chi tiêu toàn diện"       │
├──────────────────────────────────────────────────────────────┤
│ BỘ CHỌN THỜI GIAN                                           │
│ [Tuần này] [Tháng này] [3 tháng] [6 tháng] [12 tháng]     │
│ [Từ: __/__/____] - [Đến: __/__/____] [↻]                  │
├──────────────────────────────────────────────────────────────┤
│ THẺ TỔNG QUAN                                               │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Tổng thu   │ │ Tổng chi   │ │ Tiết kiệm   │            │
│ │ 15,500,000  │ │ 8,200,000  │ │ 7,300,000   │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
├──────────────────────────────────────────────────────────────┤
│ BIỂU ĐỒ PHÂN TÍCH (BieuDoPhanTichApex)                      │
│ [Chart Line: Thu chi theo tháng]                            │
├──────────────────────┬───────────────────────────────────────┤
│ BIỂU ĐỒ PHÂN BỔ     │ BIỂU ĐỒ PHÂN BỔ                     │
│ CHI TIÊU (CHI)       │ THU NHẬP (THU)                       │
│ [Pie Chart]           │ [Pie Chart]                          │
│ Ăn uống: 35%         │ Lương: 70%                           │
│ Di chuyển: 20%        │ Thưởng: 20%                          │
│ Mua sắm: 25%          │ Đầu tư: 10%                          │
└──────────────────────┴───────────────────────────────────────┘
│ BẢNG TOP CHI TIÊU (BangTopChiTieu)                          │
│ ┌────┬──────────────┬─────────────┬────────────┬─────────┐ │
│ │STT │ Danh mục     │ Số tiền     │ % tổng chi │ So sánh│ │
│ ├────┼──────────────┼─────────────┼────────────┼─────────┤ │
│ │ 1  │ Ăn uống      │ 2,870,000   │ 35%        │ +5%    │ │
│ │ 2  │ Mua sắm      │ 2,050,000   │ 25%        │ -3%    │ │
│ └────┴──────────────┴─────────────┴────────────┴─────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Chọn thời gian | Quick select hoặc date picker |
| Xem biểu đồ | Line chart thu chi, Pie chart phân bổ |
| Xem top chi tiêu | Bảng xếp hạng theo danh mục |
| So sánh | % thay đổi so với kỳ trước |

### 7.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/bao-cao/tong-hop?duration=month&tuNgay=...&denNgay=...` | GET | Tổng hợp thu/chi |
| `/api/bao-cao/chi-tieu-theo-danh-muc` | GET | Chi tiêu theo danh mục |
| `/api/bao-cao/phan-tich` | GET | Dữ liệu phân tích chi tiết |

### 7.4 Dữ liệu mẫu

**Hiện tại**: KHÔNG có mock data - load từ API. Khi không có dữ liệu, hiển thị "Không có dữ liệu trong khoảng thời gian đã chọn".

---

## 8. TRUNG TÂM AI (TrungTamAI)

**Đường dẫn**: `/TrungTamAI`  
**File**: `app/(user)/TrungTamAI/page.tsx`

### 8.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ 🧠 Trung Tâm AI Insights                                     │
│ "Phân tích bởi NVIDIA Nemotron" [Tạo Phân Tích AI] [HỎI ĐÁP]│
├──────────────────────────────────────────────────────────────┤
│ THÔNG BÁO AI MỚI (nếu có)                                   │
│ ⚠️ "Chi tiêu tháng này tăng 15% so với tháng trước"        │
│ 💡 "Nên giảm chi tiêu ăn uống tuần tới"                     │
├──────────────────────────────────────────────────────────────┤
│ TABS: [Dự Đoán] [Phân Tích AI] [Hỏi Đáp]                   │
├──────────────────────────────────────────────────────────────┤
│ TAB: DỰ ĐOÁN                                                │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ BIỂU ĐỒ DỰ ĐOÁN (BieuDoDuDoan)                        │   │
│ │ [Chart Line: Dự đoán thu chi 3 tháng tới]              │   │
│ │ Màu xanh: Dự đoán, Màu đỏ: Thực tế                    │   │
│ └────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ CỐ VẤN TÀI CHÍNH                                           │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ 💬 "Chi tiêu của bạn đang trong ngưỡng an toàn"        │   │
│ │ 💬 "Bạn nên tiết kiệm thêm 2M/tháng để đạt mục tiêu" │   │
│ └────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ CẢNH BÁO HỆ THỐNG                                           │
│ ⚡ "Tốc Độ Tiêu Tiền Nhanh - 3 ngày tới hết ngân sách"     │
│ 🚨 "Số dư không đủ cho thanh toán dự kiến"                  │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem dự đoán | Biểu đồ dự đoán thu chi |
| Xem phân tích | Chi tiết AI phân tích |
| Hỏi đáp AI | Chat với AI (CoVanAIChuyenSau) |
| Tạo dữ liệu AI | Gọi API tạo mock AI data |
| Xem thông báo AI | Danh sách thông báo mới |

### 8.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/thong-bao` | GET | Danh sách thông báo |
| `/api/thong-bao/so-luong-chua-doc` | GET | Số thông báo chưa đọc |
| `/api/ai/tao-du-lieu` | POST | Tạo dữ liệu AI (mock) |
| `/api/ai/du-doan` | GET | Dữ liệu dự đoán |
| `/api/ai/phan-tich` | GET | Kết quả phân tích AI |

### 8.4 Dữ liệu mẫu

**Hiện tại**: CÓ một số phần dùng mock data cứng:
- "Tốc Độ Tiêu Tiền Nhanh - 3 ngày tới hết ngân sách"
- "Số dư không đủ để chi trả tiền nhà dự kiến vào ngày 05/04"
- Các tab cảnh báo hệ thống

---

## 9. THÔNG BÁO (ThongBao)

**Đường dẫn**: `/ThongBao`  
**File**: `app/(user)/ThongBao/page.tsx`

### 9.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ "Thông báo" - "Bạn có 3 thông báo chưa đọc"               │
│ [Làm mới] [Đánh dấu tất cả đã đọc]                        │
├──────────────────────────────────────────────────────────────┤
│ BỘ LỌC                                                       │
│ Trạng thái: [Tất cả] [Chưa đọc (3)] [Đã đọc]              │
│ Loại: [Tất cả] [Cảnh báo] [Gợi ý] [Dự đoán]               │
├──────────────────────────────────────────────────────────────┤
│ DANH SÁCH THÔNG BÁO                                          │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ⚠️ Chi tiêu vượt ngân sách     2 giờ trước     [●]     │ │
│ │    Bạn đã chi 95% ngân sách "Ăn uống" tháng này        │ │
│ │    [Xem chi tiết] [Đánh dấu đã đọc]                   │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 💡 Gợi ý tiết kiệm              1 ngày trước    [●]    │ │
│ │    Nên giảm 500k chi tiêu giải trí tuần này            │ │
│ │    [Đánh dấu đã đọc]                                 │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 📈 Dự đoán chi tiêu            2 ngày trước    [✓]    │ │
│ │    Tháng tới dự kiến chi tiêu tăng 10%                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│ HOẶC (Empty State)                                          │
│ "Không có thông báo nào"                                    │
└──────────────────────────────────────────────────────────────┘
```

### 9.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem danh sách | Phân trang, phân loại theo loại |
| Đánh dấu đã đọc | 1 thông báo hoặc tất cả |
| Lọc | Theo trạng thái (chưa/đã đọc) và loại |
| Xem chi tiết | Navigate đến TrungTamAI |

### 9.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/thong-bao?page=1&pageSize=100` | GET | Danh sách thông báo |
| `/api/thong-bao/{id}/da-doc` | PUT | Đánh dấu 1 thông báo đã đọc |
| `/api/thong-bao/da-doc-tat-ca` | PUT | Đánh dấu tất cả đã đọc |
| `/api/thong-bao/so-luong-chua-doc` | GET | Số lượng chưa đọc |

### 9.4 Dữ liệu mẫu

**Hiện tại**: KHÔNG có mock data cứng - load từ API.

---

## 10. CÀI ĐẶT (CaiDat)

**Đường dẫn**: `/CaiDat`  
**File**: `app/(user)/CaiDat/page.tsx`

### 10.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ ← Quay lại Trang chủ                                        │
├──────────────────────────────────────────────────────────────┤
│ THẺ CÀI ĐẶT                                                 │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ ⚙️ Cài đặt tài khoản                                   │   │
│ │                                                        │   │
│ │ Tài khoản: Nguyễn Văn A                                │   │
│ │ Email: nguyenvana@email.com                             │   │
│ │ Vai trò: User                                          │   │
│ │                                                        │   │
│ │ ─────────────────────────────────────────────────────  │   │
│ │                                                        │   │
│ │ 🔔 Thông báo         [ON ]  Nhận thông báo            │   │
│ │ 🌙 Chế độ tối       [OFF]  Giao diện tối tự động     │   │
│ │ 💳 Thanh toán tự động [OFF]  Lập lịch giao dịch       │   │
│ │                                                        │   │
│ │ [Quản lý Phương thức thanh toán]                      │   │
│ │ [Lưu thay đổi]                                        │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 10.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem thông tin | Email, vai trò từ session |
| Bật/tắt thông báo | Toggle switch |
| Bật/tắt dark mode | Toggle switch |
| Lưu cài đặt | Gọi API cập nhật |

### 10.3 API gọi

| API | Method | Mục đích |
|-----|--------|-----------|
| `/api/cai-dat` | GET | Lấy cài đặt user |
| `/api/cai-dat` | PUT | Cập nhật cài đặt |

### 10.4 Dữ liệu mẫu

**Hiện tại**: CÓ dùng dữ liệu từ `useUserSession()` hook:
- `user.hoTen` - tên user
- `user.email` - email
- `user.vaiTro` - vai trò
- Toggle states là local state (chưa sync với API)

---

## 11. HỒ SƠ (HoSo)

**Đường dẫn**: `/HoSo`  
**File**: `app/(user)/HoSo/page.tsx`

### 11.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ ← Quay lại Trang chủ                                        │
├──────────────────────────────────────────────────────────────┤
│ THẺ HỒ SƠ                                                   │
│ ┌────────────────────────────────────────────────────────┐   │
│ │                    👤 Avatar                           │   │
│ │              Nguyễn Văn A                              │   │
│ │                  User                                  │   │
│ │                                                        │   │
│ │ ─────────────────────────────────────────────────────  │   │
│ │                                                        │   │
│ │ 📧 Email: nguyenvana@email.com                         │   │
│ │ 🛡️ Vai trò: User                                     │   │
│ │                                                        │   │
│ │ ─────────────────────────────────────────────────────  │   │
│ │                                                        │   │
│ │ [Quản lý Tài khoản & Giao dịch]                      │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 11.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem avatar | Từ user session hoặc gravatar |
| Xem thông tin | Email, vai trò |
| Điều hướng | Link đến TaiKhoan |

### 11.3 Dữ liệu mẫu

**Hiện tại**: Dùng dữ liệu từ `useUserSession()` hook:
- Avatar từ `user.anhDaiDien` hoặc gravatar
- Tên từ `user.hoTen`
- Email từ `user.email`
- Vai trò từ `user.vaiTro`

---

## 12. TRANG ADMIN

**Đường dẫn**: `/admin`  
**File**: `app/admin/page.tsx`

### 12.1 Hiển thị

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ "Bảng Điều Khiển" - "Trung tâm điều hành FINANCE AI"       │
│ [Server Status: Optimal]                                     │
├──────────────────────────────────────────────────────────────┤
│ THẺ METRICS                                                 │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────┐ │
│ │ 👥 Tổng user │ │ 💳 Giao dịch│ │ 📋 Yêu cầu   │ │ 🔄   │ │
│ │    1,234     │ │   24h: 5,678│ │   hỗ trợ: 12 │ │ 92.4%│ │
│ │   +12%       │ │   +5%       │ │   -18%       │ │ +2%  │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────┘ │
├──────────────────────────────────────────────────────────────┤
│ BIỂU ĐỒ TĂNG TRƯỞNG USER                   │ CẢNH BÁO     │
│ [Area Chart: Tăng trưởng theo thời gian]    │ ────────────  │
│                                             │ CPU: 45%      │
│                                             │ Memory: 82%  │
│                                             │ ⚠️ Warning   │
├─────────────────────────────────────────────┼───────────────┤
│ GLOBAL TRAFFIC                             │               │
│ 🌍 84.2K Requests                         │               │
└─────────────────────────────────────────────┴───────────────┘
```

### 12.2 Chức năng

| Hành động | Mô tả |
|-----------|-------|
| Xem metrics | Tổng user, giao dịch, yêu cầu hỗ trợ |
| Xem biểu đồ | Tăng trưởng user theo thời gian |
| Xem cảnh báo | CPU, Memory usage |
| Filter thời gian | 7 ngày, 30 ngày, 90 ngày, 1 năm |

### 12.3 API gọi

| API | Method | Mục đích | Base URL |
|-----|--------|-----------|----------|
| `/api/admin/tong-quan` | GET | Metrics tổng quan | QT (5001) |
| `/api/admin/tang-truong-user` | GET | Dữ liệu tăng trưởng | QT (5001) |

### 12.4 Dữ liệu mẫu

**Hiện tại**: CÓ dùng mock data cứng:
- "Yêu cầu hỗ trợ: 12"
- "Tỉ lệ giữ chân: 92.4%"
- CPU/Memory hardcoded: 45%, 82%
- Global Traffic: "84.2K Requests"

---

## 13. TỔNG KẾT API THEO TRANG

### 13.1 Bảng tổng hợp

| Trang | API Endpoints | Mock Data | Ghi chú |
|-------|--------------|-----------|---------|
| **TrangChu** | `/api/tong-quan`, `/api/tai-khoan`, `/api/ai/goi-y`, `/api/giao-dich` | ❌ | |
| **GiaoDich** | `/api/giao-dich`, `/api/giao-dich/tong-quan` | ❌ | CRUD đầy đủ |
| **TaiKhoan** | `/api/tai-khoan`, `/api/loai-tai-khoan` | ❌ | CRUD đầy đủ |
| **DanhMuc** | `/api/danh-muc` | ⚠️ | Mặc định từ DB |
| **MucTieu** | `/api/muc-tieu`, `/api/muc-tieu/{id}/dong-gop` | ❌ | CRUD + đóng góp |
| **BaoCao** | `/api/bao-cao/*` | ❌ | Charts từ API |
| **TrungTamAI** | `/api/thong-bao`, `/api/ai/*` | ✅ | Một số cảnh báo hardcoded |
| **ThongBao** | `/api/thong-bao`, `/api/thong-bao/{id}/da-doc` | ❌ | |
| **CaiDat** | `/api/cai-dat` | ⚠️ | Toggle local state |
| **HoSo** | Session only | ⚠️ | Dùng `useUserSession()` |
| **Admin** | `/api/admin/*` (QT) | ✅ | Metrics hardcoded |

### 13.2 Chú thích

| Ký hiệu | Ý nghĩa |
|----------|---------|
| ✅ | CÓ mock data hoặc hardcoded |
| ❌ | KHÔNG có mock data - 100% từ API |
| ⚠️ | Dùng hybrid - có phần từ API, có phần hardcoded |

### 13.3 Database Tables Mapping

| Bảng (CSDL.md) | UI Module | Trang sử dụng |
|----------------|----------|---------------|
| `tbl_nguoidung` | Người dùng | HoSo, CaiDat |
| `tbl_caidat` | Cài đặt | CaiDat |
| `tbl_taikhoan` | Tài khoản | TaiKhoan, TrangChu |
| `tbl_loai_taikhoan` | Loại TK | TaiKhoan (dropdown) |
| `tbl_danhmuc` | Danh mục | DanhMuc, GiaoDich, BaoCao |
| `tbl_loai_danhmuc` | Loại DM | DanhMuc (phân nhóm) |
| `tbl_giaodich` | Giao dịch | GiaoDich, TrangChu, BaoCao |
| `tbl_giaodich_dinhky` | Định kỳ | (Chưa implement UI) |
| `tbl_ngansach` | Ngân sách | TrangChu |
| `tbl_muctieu` | Mục tiêu | MucTieu |
| `tbl_donggop_muctieu` | Đóng góp | MucTieu |
| `tbl_thongbao` | Thông báo | ThongBao, TrungTamAI |
| `tbl_canhbao` | Cảnh báo | TrungTamAI |
| `tbl_goiy_ai` | Gợi ý AI | TrangChu, TrungTamAI |
| `tbl_dudoan` | Dự đoán | TrungTamAI |
| `tbl_phantich_chitieu` | Phân tích | BaoCao |
| `tbl_tonghop_thang` | Tổng hợp | TrangChu |

---

## 14. CÁC COMPONENTS CHÍNH

### 14.1 Shared Components (`thanh_phan/`)

| Component | Mô tả | Sử dụng |
|-----------|-------|---------|
| `Button` | Nút với variants (primary, success, warning, danger, neutral) | Tất cả trang |
| `Input` | Input field với label và error | Forms |
| `Select` | Dropdown select | Forms, Filters |
| `Badge` | Status badge (hoạt động, ngừng...) | Tables |
| `Dialog/ConfirmDialog` | Modal xác nhận xóa | CRUD pages |
| `EmptyState` | Hiển thị khi không có dữ liệu | Tất cả list pages |
| `Table` | Bảng dữ liệu | GiaoDich, Admin |
| `Toast` | Thông báo feedback | Tất cả forms |
| `FadeIn/SlideUp/StaggerContainer` | Animation | Tất cả trang |

### 14.2 Feature Components (`tinh_nang/`)

| Component | Trang cha | Mô tả |
|-----------|----------|--------|
| `TheTongQuan` | TrangChu | 4 thẻ tổng quan |
| `SoDuTaiKhoan` | TrangChu | Cards tài khoản |
| `BieuDoChiTieu` | TrangChu | Chart 12 tháng |
| `GoiYAI` | TrangChu | Gợi ý AI |
| `MucTieuNganSach` | TrangChu | Progress bars |
| `BangGiaoDich` | TrangChu | 3 GD gần nhất |
| `BangLichSu` | GiaoDich | Bảng GD phân trang |
| `BoLocGiaoDich` | GiaoDich | Bộ lọc |
| `FormGiaoDich` | GiaoDich | Form thêm/sửa |
| `DanhSachTaiKhoan` | TaiKhoan | Cards tài khoản |
| `FormTaiKhoan` | TaiKhoan | Form thêm/sửa |
| `QuanLyDanhMuc` | DanhMuc | Tree danh mục |
| `DanhSachMucTieu` | MucTieu | Cards mục tiêu |
| `FormMucTieu` | MucTieu | Form thêm mục tiêu |
| `FormDongGop` | MucTieu | Form đóng góp |
| `BieuDoPhanTichApex` | BaoCao | Line chart |
| `BieuDoPhanBoDanhMuc` | BaoCao | Pie chart |
| `BangTopChiTieu` | BaoCao | Bảng xếp hạng |
| `BieuDoDuDoan` | TrungTamAI | Chart dự đoán |
| `LoiKhuyenAI` | TrungTamAI | Lời khuyên |
| `CoVanAIChuyenSau` | TrungTamAI | Chat AI |

---

## 15. SERVICES API (`dich_vu/`)

| Service | File | API Endpoints |
|---------|------|---------------|
| Giao dịch | `giaodich/giaodich.ts` | `/api/giao-dich` |
| Tài khoản | `taikhoan/taikhoan.ts` | `/api/tai-khoan`, `/api/loai-tai-khoan` |
| Danh mục | `danhmuc/danhmuc.ts` | `/api/danh-muc` |
| Mục tiêu | `muctieu/muctieu.ts` | `/api/muc-tieu` |
| Báo cáo | `baocao/baocao.ts` | `/api/bao-cao/*` |
| AI | `ai/ai.ts`, `ai/aiQuery.ts` | `/api/ai/*` |
| Thông báo | `thongbao.ts` | `/api/thong-bao` |
| Cài đặt | `caidat.ts` | `/api/cai-dat` |
| Tổng quan | `trangchu/tongquan.ts` | `/api/tong-quan` |
| Xác thực | `xacthuc/xacthuc.ts` | `/api/auth/*` |
| Import | `qt/import.ts` | Import CSV/Excel |
| Từ khóa | `tukhoa.ts` | `/api/tu-khoa` |
| Upload | `upload.ts` | Upload file |

---

## 16. TYPES (`types/`)

| Type File | Mô tả |
|-----------|--------|
| `GiaoDich.ts` | GiaoDichDto, TaoGiaoDichDto, LocGiaoDichDto |
| `TaiKhoan.ts` | TaiKhoanDto, TaoTaiKhoanDto, LoaiTaiKhoanType |
| `DanhMuc.ts` | DanhMucDto, LoaiDanhMucDto |
| `BaoCao.ts` | BaoCaoTongHopDto, ChiTieuTheoDanhMucDto |
| `TrangChu.ts` | TongQuanDto, TongHopThangType, NganSachType, MucTieuType |
| `TrungTamAI.ts` | loiKhuyenAIType, DuDoanDto |
| `ThongBao.ts` | ThongBaoDto |
| `HoSo.ts` | HoSoDto, UserSession |
| `chung.ts` | ApiResponse, PagedResponse, ErrorResponse |
| `index.ts` | Export tất cả types |

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-08  
**Author**: FE Development Team
