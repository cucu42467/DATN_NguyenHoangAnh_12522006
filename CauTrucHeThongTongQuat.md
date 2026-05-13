# Cấu Trúc Hệ Thống Tổng Quát — Use Case Tổng Quát (Theo SkillBD.md)

> **Mục đích:** Tài liệu này mô tả cấu trúc Use Case tổng quát của Hệ thống Quản lý Tài chính Cá nhân (Black Box), được xây dựng dựa trên phân tích thực tế codebase BE (`API_ND`, `API_QT`) và FE (Next.js App Router).
> **Cập nhật:** Theo trạng thái hiện tại của hệ thống (Controllers, Endpoints, Pages).

---

## 1. Actors & System Boundaries

### 1.1. Actors

| Actor | Mô tả | Vai trò |
|-------|-------|---------|
| **Người dùng** (User) | Người dùng cuối đăng ký/đăng nhập để quản lý tài chính cá nhân | CRUD giao dịch, tài khoản, danh mục, ngân sách, mục tiêu; xem báo cáo, tương tác AI |
| **Quản trị viên** (Admin) | Người quản trị hệ thống, có role `Admin`. Kế thừa từ User. | Giám sát người dùng, audit log, phiên, cấu hình hệ thống/AI/tỷ giá |
| **AI Service** (Gemini) | Hệ thống AI tích hợp (secondary actor) | Phân tích chi tiêu, dự đoán xu hướng, đưa ra gợi ý, chat tư vấn |

### 1.2. System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HỆ THỐNG QUẢN LÝ TÀI CHÍNH                         │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────┐  │
│  │   API_ND (User API)     │  │   API_QT (Admin API)                    │  │
│  │   /api/xacthuc          │  │   /admin/NguoiDung                      │  │
│  │   /api/nguoidung        │  │   /admin/AuditLog                       │  │
│  │   /api/giaodich         │  │   /admin/Phien                          │  │
│  │   /api/taikhoan         │  │   /admin/GiaoDich                       │  │
│  │   /api/danhmuc          │  │   /admin/Import                         │  │
│  │   /api/ngansach         │  │   /admin/CauHinh                        │  │
│  │   /api/muctieu          │  │   /admin/TyGia                          │  │
│  │   /api/giaodich-dinhky  │  │   /admin/TongQuan                       │  │
│  │   /api/ai               │  │                                         │  │
│  │   /api/baocao           │  │                                         │  │
│  │   /api/canhbao          │  │                                         │  │
│  │   /api/tongquan         │  │                                         │  │
│  │   /api/import           │  │                                         │  │
│  │   /api/upload           │  │                                         │  │
│  └─────────────────────────┘  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Danh sách Use Case đầy đủ (Hierarchical)

### PHÂN HỆ NGƯỜI DÙNG (API_ND + FE User Pages)

| Nhóm | Use Case | Mô tả | Endpoint/Page chính |
|------|----------|-------|---------------------|
| **UC1** | **Xác thực người dùng** | | |
| UC1.1 | Đăng nhập | Đăng nhập bằng email/SĐT + mật khẩu | `POST /api/xacthuc/dang-nhap` |
| UC1.2 | Đăng ký | Tạo tài khoản mới | `POST /api/xacthuc/dang-ky` |
| UC1.3 | Đăng nhập mạng xã hội | Đăng nhập qua Google/Facebook id_token | `POST /api/xacthuc/dang-nhap-mang-xa-hoi` |
| UC1.4 | Đăng xuất | Thu hồi refresh token | `POST /api/xacthuc/dang-xuat` |
| UC1.5 | Làm mới token | Lấy access token mới bằng refresh token | `POST /api/xacthuc/lam-moi-token` |
| UC1.6 | Quên mật khẩu (Email) | Gửi link/OTP reset qua email | `POST /api/xacthuc/quen-mat-khau/email` |
| UC1.7 | Quên mật khẩu (SĐT) | Gửi OTP reset qua SĐT | `POST /api/xacthuc/quen-mat-khau/sdt` |
| UC1.8 | Gửi OTP | Gửi mã OTP để xác thực | `POST /api/xacthuc/gui-otp` |
| UC1.9 | Xác thực OTP | Xác nhận mã OTP | `POST /api/xacthuc/xac-thuc-otp` |
| UC1.10 | Đặt lại mật khẩu | Đặt mật khẩu mới sau xác thực | `POST /api/xacthuc/dat-lai-mat-khau` |
| **UC2** | **Quản lý hồ sơ** | | |
| UC2.1 | Xem hồ sơ cá nhân | Lấy thông tin user hiện tại | `GET /api/nguoidung/me` |
| UC2.2 | Cập nhật hồ sơ | Chỉnh sửa thông tin cá nhân | `PUT /api/nguoidung/me` |
| **UC3** | **Quản lý tài chính** | | |
| UC3.1 | Quản lý giao dịch | Thêm, sửa, xóa, xem giao dịch thu/chi/chuyển khoản | `GET/POST/PUT/DELETE /api/giaodich` |
| UC3.2 | Quản lý tài khoản | Tạo, sửa, xóa tài khoản tài chính | `GET/POST/PUT/DELETE /api/taikhoan` |
| UC3.3 | Quản lý danh mục | Tạo, sửa, xóa danh mục chi tiêu/thu nhập | `GET/POST/PUT/DELETE /api/danhmuc` |
| UC3.4 | Chuyển tiền nội bộ | Chuyển tiền giữa các tài khoản cùng user | `POST /api/taikhoan/chuyen-tien-noi-bo` |
| UC3.5 | Upload hóa đơn | Upload file chứng từ cho giao dịch | `POST /api/upload` |
| UC3.6 | Xuất CSV | Xuất danh sách giao dịch ra file CSV | `GET /api/giaodich/xuat-csv` |
| **UC4** | **Lập kế hoạch tài chính** | | |
| UC4.1 | Thiết lập ngân sách | Đặt hạn mức chi tiêu theo danh mục | `POST /api/ngansach` |
| UC4.2 | Quản lý mục tiêu | Tạo, đóng góp, hoàn thành mục tiêu tiết kiệm | `GET/POST/PUT/DELETE /api/muctieu` |
| UC4.3 | Giao dịch định kỳ | Thiết lập giao dịch lặp lại | `GET/POST/PUT/DELETE /api/giaodich-dinhky` |
| **UC5** | **Xem báo cáo** | | |
| UC5.1 | Xem tổng hợp chỉ số | Báo cáo tổng hợp thu/chi/số dư | `GET /api/baocao/tonghop` |
| UC5.2 | Xem biểu đồ tổng quan | Dữ liệu biểu đồ theo ngày/tháng/năm | `GET /api/baocao/bieudo` |
| UC5.3 | Xem phân bố danh mục | Thống kê phân bổ theo danh mục CHI/THU | `GET /api/baocao/phanbo-danhmuc` |
| **UC6** | **Tối ưu tài chính (AI)** | | |
| UC6.1 | Xem dự đoán tài chính | AI dự đoán xu hướng chi tiêu tháng tới | `GET /api/ai/dudoan` |
| UC6.2 | Nhận gợi ý từ AI | Lấy danh sách gợi ý AI | `GET /api/ai/goi-y` |
| UC6.3 | Chat với AI Assistant | Trò chuyện với Gemini về tài chính | `POST /api/ai/assistant/chat` |
| UC6.4 | Phân tích chi tiêu | Phân tích chi tiêu trong khoảng thời gian | `POST /api/ai/gemini/phan-tich` |
| **UC7** | **Nhận thông báo** | | |
| UC7.1 | Xem cảnh báo | Lấy danh sách cảnh báo hệ thống | `GET /api/canhbao` |
| UC7.2 | Đánh dấu cảnh báo đã đọc | Đánh dấu cảnh báo đã đọc | `PUT /api/canhbao/{id}/da-doc` |
| **UC8** | **Nhập xuất dữ liệu** | | |
| UC8.1 | Import dữ liệu | Import giao dịch từ file CSV/Excel | `POST /api/import` |
| UC8.2 | Upload file đính kèm | Upload file chứng từ cho giao dịch | `POST /api/upload` |

### PHÂN HỆ QUẢN TRỊ VIÊN (API_QT + FE Admin Pages)

| Nhóm | Use Case | Mô tả | Endpoint/Page chính |
|------|----------|-------|---------------------|
| **UC9** | **Quản lý người dùng** | | |
| UC9.1 | Xem danh sách người dùng | Lấy danh sách user (phân trang) | `GET /admin/NguoiDung` |
| UC9.2 | Xem chi tiết người dùng | Lấy thông tin chi tiết 1 user | `GET /admin/NguoiDung/{id}` |
| UC9.3 | Khóa/Mở khóa tài khoản | Khóa hoặc mở khóa tài khoản user | `PUT /admin/NguoiDung/{id}/khoa` |
| UC9.4 | Xóa tài khoản | Xóa tài khoản user | `DELETE /admin/NguoiDung/{id}` |
| **UC10** | **Giám sát hệ thống** | | |
| UC10.1 | Xem Audit Log | Xem nhật ký hoạt động hệ thống | `GET /admin/AuditLog` |
| UC10.2 | Quản lý Phiên | Xem và hủy phiên đăng nhập | `GET/DELETE /admin/Phien` |
| UC10.3 | Giám sát Import | Xem tiến trình và lỗi import | `GET /admin/Import` |
| **UC11** | **Cấu hình hệ thống** | | |
| UC11.1 | Cấu hình hệ thống | Thiết lập tham số hệ thống | `PUT /admin/CauHinh` |
| UC11.2 | Cấu hình AI | Quản lý gợi ý AI, ưu tiên, từ khóa | `admin/AI/*` pages |
| UC11.3 | Quản lý Tỷ giá | Cập nhật tỷ giá tiền tệ | `GET/POST /admin/TyGia` |
| UC11.4 | Quản lý Danh mục hệ thống | Quản lý danh mục mặc định | `admin/DanhMuc/*` |
| UC11.5 | Cấu hình Thông báo | Thiết lập thông báo hệ thống | `admin/CaiDat/ThongBao` |
| UC11.6 | Sao lưu & Tài nguyên | Quản lý sao lưu, tài nguyên | `admin/CaiDat/SaoLuu`, `TaiNguyen` |
| **UC12** | **Xem tổng quan** | | |
| UC12.1 | Xem dashboard admin | Tổng quan số liệu hệ thống | `GET /admin/TongQuan` → `/admin` |

---

## 3. Use Case Diagram (Mermaid)

```mermaid
useCaseDiagram
    %% Actors
    actor "Người dùng" as U
    actor "Quản trị viên" as A
    actor "AI Service" as AI

    %% System Boundary
    rectangle "Hệ thống quản lý tài chính cá nhân" {
        %% === LEFT: User Profile & Planning ===
        usecase "UC2\nQuản lý hồ sơ" as UC2
        usecase "UC4\nLập kế hoạch tài chính" as UC4

        %% === CENTER: Core User Functions ===
        usecase "UC1\nXác thực người dùng" as UC1
        usecase "UC3\nQuản lý tài chính" as UC3
        usecase "UC5\nXem báo cáo" as UC5
        usecase "UC6\nTối ưu tài chính" as UC6
        usecase "UC7\nNhận thông báo" as UC7
        usecase "UC8\nNhập xuất dữ liệu" as UC8

        %% === RIGHT: Admin Functions ===
        usecase "UC9\nQuản lý người dùng" as UC9
        usecase "UC10\nGiám sát hệ thống" as UC10
        usecase "UC11\nCấu hình hệ thống" as UC11
        usecase "UC12\nXem tổng quan" as UC12
    }

    %% === Generalization ===
    A --|> U

    %% === User Relationships ===
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8

    %% === Admin Relationships ===
    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12

    %% === AI Relationships ===
    AI --> UC6
    AI --> UC5

    %% === Extend Relationships ===
    UC6 ..> UC5 : <<extend>>
    UC7 ..> UC4 : <<extend>>
```

---

## 4. Phân tích Quan hệ Use Case

### 4.1. `<<include>>` — Quan hệ bắt buộc

| Use Case cha | Use Case con | Giải thích |
|--------------|--------------|------------|
| Tất cả UC User | **UC1: Xác thực** | Mọi thao tác của User đều yêu cầu đã đăng nhập (JWT token). API_ND dùng `[Authorize]` attribute. |
| Tất cả UC Admin | **UC1: Xác thực (Admin)** | Admin cũng phải xác thực, thêm điều kiện `[Authorize(Roles = "Admin")]` |
| UC3.3 (Tạo giao dịch) | **UC8.2 (Upload file)** | Tạo giao dịch có thể `<<include>>` Upload file chứng từ |

### 4.2. `<<extend>>` — Quan hệ mở rộng

| Use Case mở rộng | Use Case gốc | Điều kiện kích hoạt |
|-------------------|--------------|---------------------|
| **UC6: Tối ưu tài chính (AI)** | **UC5: Xem báo cáo** | Người dùng yêu cầu phân tích sâu dữ liệu báo cáo → AI đưa ra gợi ý |
| **UC7: Nhận thông báo** | **UC4: Lập kế hoạch tài chính** | Khi chi tiêu vượt ngưỡng ngân sách hoặc đến hạn mục tiêu → hệ thống tự động phát sinh cảnh báo |

---

## 5. Flows — Luồng sự kiện

### 5.1. Main Flow (Luồng chính — User)

```
[Start]
    │
    ▼
[UC1: Đăng nhập / Đăng ký] ──(thành công)──┐
    │                                        │
    ▼                                        │
[UC3: Tổng quan Tài chính] ◄─────────────────┘
    │
    ├──► [UC3: Quản lý tài chính]
    │         ├──► Thêm/Sửa/Xóa giao dịch
    │         ├──► Quản lý tài khoản
    │         ├──► Quản lý danh mục
    │         ├──► Xuất CSV
    │         └──► Upload file chứng từ
    │
    ├──► [UC4: Lập kế hoạch tài chính]
    │         ├──► Thiết lập ngân sách
    │         ├──► Quản lý mục tiêu
    │         └──► Giao dịch định kỳ
    │         └──► (vượt ngưỡng) ──► [UC7: Nhận thông báo]
    │
    ├──► [UC6: Tối ưu tài chính (AI)]
    │         ├──► Xem dự đoán
    │         ├──► Nhận gợi ý
    │         ├──► Chat với Gemini
    │         └──► Phân tích chi tiêu
    │         └──► (mở rộng) ──► [UC5: Xem báo cáo]
    │
    ├──► [UC5: Xem báo cáo]
    │
    ├──► [UC8: Nhập xuất dữ liệu]
    │
    └──► [UC2: Quản lý hồ sơ]
              └──► Cập nhật thông tin cá nhân
```

### 5.2. Alternative Flow (Luồng thay thế — Admin)

```
[Start]
    │
    ▼
[UC1: Đăng nhập (Admin role)]
    │
    ▼
[UC12: Xem tổng quan]
    │
    ├──► [UC9: Quản lý người dùng]
    │         ├──► Xem danh sách (phân trang)
    │         ├──► Xem chi tiết user
    │         ├──► Khóa/Mở khóa tài khoản
    │         └──► Xóa tài khoản
    │
    ├──► [UC10: Giám sát hệ thống]
    │         ├──► Xem Audit Log
    │         ├──► Quản lý Phiên
    │         └──► Giám sát Import
    │
    └──► [UC11: Cấu hình hệ thống]
              ├──► Cấu hình hệ thống
              ├──► Cấu hình AI (gợi ý, ưu tiên, từ khóa)
              ├──► Quản lý Tỷ giá
              ├──► Quản lý Danh mục hệ thống
              ├──► Cấu hình Thông báo
              └──► Sao lưu & Tài nguyên
```

### 5.3. Exception Flow (Luồng ngoại lệ)

| Kịch bản | Luồng xử lý |
|----------|-------------|
| **Auth fail** (Token hết hạn / không hợp lệ) | Trả về `401 Unauthorized` → FE redirect về `/DangNhap` → Người dùng đăng nhập lại hoặc làm mới token |
| **Quên mật khẩu** | Chọn kênh Email hoặc SĐT → Gửi OTP → Xác thực OTP → Đặt lại mật khẩu |
| **Số dư không đủ** (Chuyển tiền nội bộ) | Trả về `400 BadRequest` với thông báo "Số dư không đủ" |
| **Vượt ngân sách** | Hệ thống tự tạo `UC7: Nhận thông báo` → Hiển thị cảnh báo trên dashboard |
| **Import lỗi** | Admin xem chi tiết lỗi tại `UC10.3: Giám sát Import` → Xử lý và import lại |

---



| Use Case trong tài liệu này | Tham
