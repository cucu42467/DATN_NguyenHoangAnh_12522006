# Cấu trúc Frontend (FE) - Tài liệu chi tiết

## 1) Tổng quan

Dự án **Next.js 16** với TypeScript, sử dụng:
- **React Query** (`@tanstack/react-query`) - quản lý state server-side
- **Zustand** - quản lý state client-side
- **TailwindCSS** - styling
- **React Hook Form + Zod** - form validation

## 2) Cấu trúc thư mục chi tiết

```
FE/fe/
├── app/                          # Next.js App Router (các trang)
├── components/                   # Components dùng chung
├── features/                     # Features theo domain (mới)
├── hooks/                       # Custom React Hooks
├── lib/                         # Thư viện, config, utilities
├── services/                    # API services (goiApi)
├── thu_vien/                    # Thư viện cũ (backward compat)
├── types/                       # TypeScript interfaces/types
├── thanh_phan/                  # Components UI (dùng chung)
├── public/                      # Static assets (icons, images)
├── constants/                   # Hằng số
└── scripts/                     # Build scripts
```

## 3) Chi tiết từng thư mục

---

### 📁 `app/` - Next.js App Router

**Cấu trúc Pages:**
```
app/
├── layout.tsx                    # Root layout - providers (Query, Toast)
├── page.tsx                     # Trang chủ (redirect)
├── (auth)/                      # Route group: Authentication
│   ├── DangNhap/page.tsx        # Đăng nhập
│   ├── DangKy/page.tsx          # Đăng ký
│   └── QuenMatKhau/page.tsx     # Quên mật khẩu
├── (user)/                      # Route group: User pages
│   ├── layout.tsx               # User layout (sidebar, header)
│   ├── TrangChu/page.tsx        # Trang chủ dashboard
│   ├── TaiKhoan/page.tsx        # Danh sách tài khoản
│   ├── TaiKhoan/Moi/page.tsx    # Tạo tài khoản mới
│   ├── GiaoDich/page.tsx        # Lịch sử giao dịch
│   ├── GiaoDich/Moi/page.tsx    # Tạo giao dịch mới
│   ├── GiaoDich/NhapDuLieu/page.tsx  # Nhập dữ liệu CSV/Excel
│   ├── GiaoDich/DinhKy/page.tsx # Giao dịch định kỳ
│   ├── DanhMuc/page.tsx         # Quản lý danh mục
│   ├── MucTieu/page.tsx         # Mục tiêu tài chính
│   ├── NganSach/page.tsx        # Ngân sách
│   ├── BaoCao/page.tsx          # Báo cáo thống kê
│   ├── TrungTamAI/page.tsx      # Trung tâm AI
│   ├── ThongBao/page.tsx        # Thông báo
│   ├── HoSo/page.tsx            # Hồ sơ cá nhân
│   └── CaiDat/page.tsx          # Cài đặt
├── (admin)/                     # Route group: Admin layout
│   └── layout.tsx               # Admin layout
├── admin/                       # Admin pages (Dashboard, Settings...)
│   ├── layout.tsx               # Admin layout
│   ├── page.tsx                 # Dashboard admin
│   ├── NguoiDung/              # Quản lý người dùng
│   ├── GiaoDich/               # Giám sát giao dịch
│   ├── DanhMuc/                # Quản lý danh mục hệ thống
│   ├── GiamSat/                # Giám sát hệ thống
│   │   ├── Phien/             # Quản lý phiên đăng nhập
│   │   ├── NhatKy/           # Nhật ký hệ thống
│   │   └── Import/           # Import dữ liệu
│   ├── AI/                     # Quản lý AI
│   │   ├── Model/            # Cấu hình model AI
│   │   ├── UuTien/          # Ưu tiên AI
│   │   ├── ThongKe/         # Thống kê AI
│   │   └── GoiY/            # Gợi ý AI
│   └── CaiDat/               # Cài đặt hệ thống
│       ├── ThongBao/         # Cấu hình thông báo
│       ├── SaoLuu/          # Sao lưu dữ liệu
│       ├── TaiNguyen/        # Quản lý tài nguyên
│       └── TienTe/           # Cấu hình tiền tệ
├── ChinhSachBaoMat/            # Trang chính sách bảo mật
└── DieuKhoanDichVu/            # Trang điều khoản dịch vụ
```

**Tác dụng:**
- `(auth)/` - Nhóm route không cần đăng nhập
- `(user)/` - Nhóm route cho user đã đăng nhập (có layout với sidebar)
- `admin/` - Trang quản trị viên
- Route groups `(auth)`, `(user)` không tạo URL segment

---

### 📁 `services/` - API Layer

**Gọi API đến Backend (ASP.NET Core)**

```
services/
├── index.ts                     # Export tất cả services
├── xacthuc/                    # Authentication
│   └── xacthuc.ts             # Đăng nhập, đăng ký, refresh token
├── giaodich/
│   ├── giaodich.ts            # CRUD giao dịch
│   └── giaodichdinhky.ts     # Giao dịch định kỳ
├── taikhoan/
│   └── taikhoan.ts           # CRUD tài khoản
├── danhmuc/
│   └── danhmuc.ts            # CRUD danh mục
├── muctieu/
│   └── muctieu.ts           # CRUD mục tiêu
├── ngansach/
│   └── ngansach.ts          # CRUD ngân sách
├── baocao/
│   └── baocao.ts            # Báo cáo thống kê
├── trangchu/
│   └── tongquan.ts          # Tổng quan dashboard
├── thongbao.ts               # Thông báo
├── nguoidung.ts              # Thông tin người dùng
├── nhacnho.ts                # Nhắc nhở
├── caidat.ts                 # Cài đặt
├── canhbao.ts                # Cảnh báo
├── tukhoa.ts                 # Từ khóa AI
├── loaitaikhoan.ts           # Loại tài khoản
├── tepdingkem.ts             # Tệp đính kèm
├── upload.ts                 # Upload file
├── lich_su_dang_nhap.ts       # Lịch sử đăng nhập
├── ai/                       # AI services
│   ├── ai.ts                # AI chat
│   ├── aiQuery.ts           # AI query
│   └── gemini.ts            # Gemini API
├── admin/                    # Admin services
│   ├── co_so_api_admin.ts   # Base URL admin
│   ├── goi_api_admin.ts     # Admin API calls
│   ├── index.ts
│   └── kieu_du_lieu_admin.ts
└── qt/                      # Quản trị (Admin API v2)
    ├── cauhinh.ts           # Cấu hình
    ├── danhmuc.ts           # Danh mục
    ├── giaodich.ts          # Giao dịch
    ├── goi_api_qt.ts        # Admin API calls
    ├── import.ts            # Import data
    ├── index.ts
    ├── kieu_giao_tiep.ts    # Types
    ├── nguoidung.ts         # Người dùng
    ├── nhatky.ts            # Nhật ký
    ├── phien.ts             # Phiên
    ├── tongquan.ts          # Tổng quan
    ├── tygia.ts             # Tỷ giá
    └── vaitro.ts            # Vai trò
```

**Tác dụng:** Tập trung logic gọi API, tách biệt với UI

---

### 📁 `thu_vien/` - Core Library

**Thư viện cốt lõi, backward compatibility**

```
thu_vien/
├── co_so_api.ts              # Cấu hình base URL API
├── goi_api.ts                # Hàm goiApi(), goiApiGet(), goiApiPost()...
├── kieu_giao_tiep.ts         # Types giao tiếp
├── luu_tru_phien.ts          # LocalStorage: accessToken, refreshToken
├── xacthuc.ts                # Refresh token, đăng xuất
└── index.ts                  # Re-export all
```

**Chi tiết `co_so_api.ts`:**
- `CO_SO_API_ND_MAC_DINH` - Base URL user (mặc định: `http://10.49.145.68:5000`)
- `CO_SO_API_QT_MAC_DINH` - Base URL admin (mặc định: `http://10.49.145.68:5001`)
- `layCoSoApi()` - Lấy base URL user
- `noiDuongDan()` - Nối base URL + path

**Chi tiết `goi_api.ts`:**
- `goiApi<T>()` - Hàm fetch cơ bản
- `goiApiGet()`, `goiApiPost()`, `goiApiPut()`, `goiApiPatch()`, `goiApiDelete()` - Wrapper methods
- Tự động thêm `Authorization: Bearer {token}`
- Tự động refresh token khi hết hạn
- Throw `LoiApi` khi có lỗi HTTP

---

### 📁 `types/` - TypeScript Types

```
types/
├── index.ts                   # Export all types
├── chung.ts                  # Types dùng chung
├── GiaoDich.ts              # GiaoDichDto, LocGiaoDichDto...
├── TaiKhoan.ts              # TaiKhoanDto, TaoTaiKhoanDto...
├── DanhMuc.ts               # DanhMucDto, TaoDanhMucDto...
├── MucTieu.ts               # MucTieuDto, TaoMucTieuDto...
├── NganSach.ts              # NganSachDto...
├── BaoCao.ts                # BaoCaoDto...
├── TrangChu.ts              # TrangChuDto...
├── ThongBao.ts              # ThongBaoDto...
├── HoSo.ts                  # HoSoDto...
├── GeminiAI.ts              # AI types
└── TrungTamAI.ts            # Trung tâm AI types
```

**Tác dụng:** Định nghĩa DTOs (Data Transfer Objects) cho API

---

### 📁 `hooks/` - Custom React Hooks

```
hooks/
├── index.ts                  # Export all
├── useAuthErrorHandler.ts    # Xử lý lỗi auth (401 → redirect login)
├── useScrollAnimation.ts     # Animation khi scroll
├── useUserSession.ts         # Quản lý session user
└── query/                   # React Query hooks (TanStack Query)
    ├── index.ts
    ├── giaodich/
    │   └── useGiaoDichQueries.ts
    └── danhmuc/
        └── useDanhMucQueries.ts
```

**Chi tiết `query-keys.ts`:**
```typescript
export const queryKeys = {
  giaoDich: {
    all: ["giao-dich"] as const,
    list: (filter) => ["giao-dich", "list", filter] as const,
    detail: (id) => ["giao-dich", "detail", id] as const,
    tongQuan: ["giao-dich", "tong-quan"] as const,
  },
  danhMuc: { ... },
  taiKhoan: { ... },
}
```

**Tác dụng:** Quản lý cache key cho React Query

---

### 📁 `components/` - Shared Components

```
components/
├── index.ts                  # Export all
├── animation/                 # Animation components
│   └── Toast.tsx             # Toast notifications
├── chung/                    # Common components
│   └── Form/                 # Form components
│       ├── AmountInput.tsx   # Input số tiền (format VND)
│       └── Select.tsx       # Select dropdown
├── ui/                       # UI primitives
│   ├── Dialog.tsx           # Dialog modal
│   ├── Input.tsx            # Input component
│   ├── Badge.tsx            # Badge/Tag
│   ├── Table.tsx            # Table component
│   └── EmptyState.tsx       # Empty state placeholder
└── user/                     # User-specific components
    ├── GiaoDich/
    │   ├── BangLichSu.tsx   # Bảng lịch sử giao dịch
    │   └── index.ts
    └── MucTieu/
        └── DanhSachMucTieu.tsx
```

---

### 📁 `features/` - Feature-based Components (Mới)

**Cấu trúc theo domain features**

```
features/
├── tinh_nang/               # Tính năng chính
│   ├── index.ts             # Export all
│   ├── giaodich/
│   │   ├── index.ts
│   │   └── thanh_phan/
│   │       ├── FormGiaoDich.tsx    # Form tạo/sửa giao dịch
│   │       ├── BangLichSu.tsx      # Bảng lịch sử
│   │       ├── BoLocGiaoDich.tsx   # Bộ lọc
│   │       └── TaiLenCSV.tsx       # Upload CSV
│   ├── taikhoan/
│   │   ├── index.ts
│   │   └── thanh_phan/
│   │       ├── FormTaiKhoan.tsx    # Form tài khoản
│   │       └── DanhSachTaiKhoan.tsx
│   ├── danhmuc/
│   ├── muctieu/
│   ├── ngansach/
│   ├── baocao/
│   ├── trangchu/
│   ├── trungtam_ai/
│   ├── hoso/
│   ├── nguoi_dung/
│   ├── giamsat/
│   └── admin/
└── backup/                  # Backup code cũ
```

**Tác dụng:** Group components theo domain, dễ maintain

---

### 📁 `lib/` - Utilities & Configuration

```
lib/
├── index.ts                  # Export all
├── validation.ts            # Zod schemas cho form validation
├── page-templates.tsx        # Page template components
└── query/
    ├── query-provider.tsx    # React Query Provider
    └── query-keys.ts         # Query keys definition
```

---

### 📁 `thanh_phan/` - Components UI (Legacy)

```
thanh_phan/
├── index.ts
├── animation/               # Animation components
├── bieu_do/                 # Chart components (ApexCharts, Recharts)
├── chung/                   # Common components
├── ui/                      # UI primitives
│   └── Table/
│       └── Table.tsx
└── user/                    # User components
    ├── TrangChu/
    │   └── MucTieuNganSach.tsx
    └── MucTieu/
        └── DanhSachMucTieu.tsx
```

---

### 📁 `constants/` - Constants

```
constants/
└── index.ts                 # Hằng số ứng dụng
```

---

### 📁 `public/` - Static Assets

```
public/
├── Anh/                     # Hình ảnh user (nam.jpg, nu.jpg)
├── ICON/                    # Category icons
│   ├── food.png
│   ├── health.png
│   ├── education.png
│   └── ... (20+ icons)
└── *.svg                    # Next.js default icons
```

---

### 📁 `scripts/` - Build Scripts

```
scripts/
├── copy-icons.js            # Copy icons từ ICON/ ra thư mục build
└── public/
```

---

## 4) Package.json Scripts

```json
{
  "dev": "next dev",           // Chạy dev server
  "build": "npm run copy-icons && next build",  // Build production
  "start": "next start",       // Chạy production server
  "lint": "eslint",           // Kiểm tra code style
  "copy-icons": "node scripts/copy-icons.js"  // Copy icons
}
```

## 5) Key Dependencies

| Package | Version | Mục đích |
|---------|--------|----------|
| next | 16.2.2 | Framework React |
| @tanstack/react-query | ^5.100.9 | Server state management |
| zustand | ^5.0.13 | Client state management |
| react-hook-form | ^7.72.1 | Form handling |
| zod | ^3.25.76 | Schema validation |
| apexcharts | ^5.10.5 | Charts |
| recharts | ^3.8.1 | Charts (alternative) |
| framer-motion | ^11.0.0 | Animations |
| tailwindcss | ^3.4.19 | CSS framework |
| sonner | ^2.0.7 | Toast notifications |
| xlsx | ^0.18.5 | Excel/CSV parsing |

## 6) Flow dữ liệu

```
┌─────────────────────────────────────────────────────────────┐
│  User Interface (Page Components)                            │
│  app/(user)/TrangChu/page.tsx                               │
└─────────────────────────┬───────────────────────────────────┘
                          │ useTongQuanGiaoDichQuery()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  React Query Hooks                                          │
│  hooks/query/giaodich/useGiaoDichQueries.ts                 │
│  - Caching, refetching, loading states                       │
└─────────────────────────┬───────────────────────────────────┘
                          │ layTongQuan()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Service Layer                                               │
│  services/trangchu/tongquan.ts                              │
│  - Gọi goiApi() với endpoint /api/tong-quan                │
└─────────────────────────┬───────────────────────────────────┘
                          │ goiApi()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  API Library                                                 │
│  thu_vien/goi_api.ts                                        │
│  - Thêm Bearer token                                        │
│  - Auto refresh token                                       │
│  - Handle 401/403/500...                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │ fetch()
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (ASP.NET Core)                                     │
│  http://10.49.145.68:5000                                   │
└─────────────────────────────────────────────────────────────┘
```

## 7) Cách thêm tính năng mới

### Bước 1: Thêm Types
```typescript
// types/MucTieu.ts
export interface MucTieuDto {
  mucTieuId: number;
  tenMucTieu: string;
  soTienMucTieu: number;
  // ...
}
```

### Bước 2: Thêm Service
```typescript
// services/muctieu/muctieu.ts
export async function layDanhSachMucTieu() {
  return goiApiGet<MucTieuDto[]>("/api/muc-tieu");
}
```

### Bước 3: Thêm Query Hooks
```typescript
// hooks/query/muctieu/useMucTieuQueries.ts
export function useDanhSachMucTieuQuery() {
  return useQuery({
    queryKey: queryKeys.mucTieu.all,
    queryFn: layDanhSachMucTieu,
  });
}
```

### Bước 4: Thêm Components
```typescript
// features/tinh_nang/muctieu/thanh_phan/DanhSachMucTieu.tsx
```

### Bước 5: Thêm Page
```typescript
// app/(user)/MucTieu/page.tsx
```

## 8) Cấu hình API URLs

```bash
# .env.local
NEXT_PUBLIC_API_ND_BASE_URL=http://10.49.145.68:5000   # User API
NEXT_PUBLIC_API_QT_BASE_URL=http://10.49.145.68:5001   # Admin API
NEXT_PUBLIC_API_TIMEOUT_SECONDS=60                      # Timeout (giây)
```

## 9) Cấu hình Tailwind

```typescript
// tailwind.config.ts
// Content paths: app/**/*.{js,ts,jsx,tsx,mdx}
// Theme: colors, fonts từ globals.css
// Plugins: @tailwindcss/forms, typography
```
