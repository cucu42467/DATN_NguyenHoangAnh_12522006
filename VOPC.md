# 🎯 PROMPT: Phân tích Use Case → Liệt kê thành phần VOPC

Bạn là một chuyên gia phân tích hệ thống và thiết kế UML.

Nhiệm vụ của bạn:
Phân tích Use Case được cung cấp và liệt kê đầy đủ các thành phần cần thiết để xây dựng sơ đồ VOPC (View of Participating Classes).

---

## 📌 Input

* Tên Use Case: {USE_CASE_NAME}
* Mô tả Use Case: {USE_CASE_DESCRIPTION}
* Actor (nếu có): {ACTORS}
* Danh sách bảng dữ liệu (Database Tables): {TABLE_LIST}
* Danh sách API / Controller: {API_LIST}
* Danh sách Service / BLL: {SERVICE_LIST}

---

## 📌 Yêu cầu output

### 1. 🎯 Use Case

* Tên:
* Mô tả ngắn:

---

### 2. 👤 Actor

Liệt kê tất cả actor tham gia:

* Tên actor
* Vai trò

---

### 3. 🌐 Boundary (Giao diện / API)

Liệt kê các thành phần giao tiếp với actor:

* Tên (API / Controller / UI)
* Vai trò
* Actor nào tương tác

---

### 4. ⚙️ Control (Xử lý nghiệp vụ)

Liệt kê các class/service xử lý logic:

* Tên service
* Vai trò
* Xử lý gì trong Use Case

---

### 5. 🧱 Entity (Dữ liệu)

Liệt kê các entity liên quan:

* Tên bảng / class
* Vai trò trong Use Case
* Được sử dụng để làm gì

---

### 6. 🔗 Quan hệ (Relationships)

Mô tả luồng tương tác giữa các thành phần:

* Actor → Boundary
* Boundary → Control
* Control → Entity

Viết dạng:
A → B : hành động

---

### 7. 📊 Tóm tắt luồng xử lý (Flow)

Mô tả ngắn gọn các bước chính:
1.
2.
3.

---

## 📌 Quy tắc bắt buộc

* CHỈ liệt kê các thành phần liên quan trực tiếp đến Use Case
* KHÔNG liệt kê toàn bộ hệ thống
* KHÔNG cần thuộc tính (field) của entity
* KHÔNG cần method chi tiết
* Ưu tiên rõ ràng, ngắn gọn, đúng bản chất UML

---

## 📌 Output format

Trả về dạng Markdown, rõ ràng từng mục.

---

## 📌 Ví dụ Use Case (tham khảo format, KHÔNG lặp lại)

Use Case: Đăng nhập
→ Actor: Người dùng
→ Boundary: AuthController
→ Control: AuthService
→ Entity: NguoiDung
→ Flow: Người dùng gửi request → Controller → Service → DB → trả kết quả

---

Bây giờ hãy phân tích Use Case sau:

{DỮ LIỆU ĐẦU VÀO Ở ĐÂY}
