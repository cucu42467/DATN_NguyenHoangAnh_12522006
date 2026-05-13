# QUY TRÌNH THAO TÁC TRÊN ỨNG DỤNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN

## MỤC LỤC

1. [GIAO DIỆN NGƯỜI DÙNG](#1-giao-diện-người-dùng)
   - 1.1. [Trang Đăng nhập](#11-trang-đăng-nhập)
   - 1.2. [Trang Đăng ký](#12-trang-đăng-ký)
   - 1.3. [Trang Quên mật khẩu](#13-trang-quên-mật-khẩu)
   - 1.4. [Trang Chủ (Dashboard)](#14-trang-chủ-dashboard)
   - 1.5. [Trang Giao dịch](#15-trang-giao-dịch)
   - 1.6. [Trang Thêm/Sửa Giao dịch](#16-trang-thêmsửa-giao-dịch)
   - 1.7. [Trang Giao dịch Định kỳ](#17-trang-giao-dịch-định-kỳ)
   - 1.8. [Trang Import CSV](#18-trang-import-csv)
   - 1.9. [Trang Danh mục](#19-trang-danh-mục)
   - 1.10. [Trang Tài khoản](#110-trang-tài-khoản)
   - 1.11. [Trang Ngân sách](#111-trang-ngân-sách)
   - 1.12. [Trang Mục tiêu Tài chính](#112-trang-mục-tiêu-tài-chính)
   - 1.13. [Trang Báo cáo](#113-trang-báo-cáo)
   - 1.14. [Trang Trung tâm AI](#114-trang-trung-tâm-ai)
   - 1.15. [Trang Hồ sơ](#115-trang-hồ-sơ)
   - 1.16. [Trang Cài đặt](#116-trang-cài-đặt)

2. [GIAO DIỆN QUẢN TRỊ VIÊN](#2-giao-diện-quản-trị-viên)
   - 2.1. [Trang Dashboard Admin](#21-trang-dashboard-admin)
   - 2.2. [Trang Quản lý Người dùng](#22-trang-quản-lý-người-dùng)
   - 2.3. [Trang Quản lý Giao dịch](#23-trang-quản-lý-giao-dịch)
   - 2.4. [Trang Quản lý Danh mục](#24-trang-quản-lý-danh-mục)
   - 2.5. [Trang Cấu hình Từ khóa AI](#25-trang-cấu-hình-từ-khóa-ai)
   - 2.6. [Trang AI Analytics](#26-trang-ai-analytics)
   - 2.7. [Trang Giám sát - Nhật ký](#27-trang-giám-sát---nhật-ký)
   - 2.8. [Trang Giám sát - Phiên hoạt động](#28-trang-giám-sát---phiên-hoạt-động)
   - 2.9. [Trang Giám sát - Import](#29-trang-giám-sát---import)
   - 2.10. [Trang Cài đặt - Sao lưu](#210-trang-cài-đặt---sao-lưu)
   - 2.11. [Trang Cài đặt - Tiền tệ](#211-trang-cài-đặt---tiền-tệ)
   - 2.12. [Trang Cài đặt - Thông báo](#212-trang-cài-đặt---thông-báo)
   - 2.13. [Trang Cài đặt - Tài nguyên](#213-trang-cài-đặt---tài-nguyên)

---

# 1. GIAO DIỆN NGƯỜI DÙNG

---

## 1.1. Trang Đăng nhập

**Đường dẫn:** `/DangNhap`

**Mục đích:** Cho phép người dùng đăng nhập vào hệ thống bằng email và mật khẩu, hoặc đăng nhập qua Google.

### Quy trình thao tác:

#### A. Đăng nhập bằng Email và Mật khẩu

**Bước 1:** Truy cập trang đăng nhập
- Mở trình duyệt và truy cập địa chỉ `/DangNhap`
- Hệ thống sẽ hiển thị form đăng nhập với các trường: Email, Mật khẩu

**Bước 2:** Nhập thông tin đăng nhập
- Điền **Email** vào ô "Email" (ví dụ: nguyenvana@email.com)
- Điền **Mật khẩu** vào ô "Mật khẩu"
- Lưu ý: Mật khẩu phải có ít nhất 6 ký tự

**Bước 3:** (Tùy chọn) Ghi nhớ đăng nhập
- Tick chọn ô **"Ghi nhớ mật khẩu"** nếu bạn muốn hệ thống lưu thông tin đăng nhập cho lần sau
- Thông tin sẽ được lưu trong localStorage của trình duyệt

**Bước 4:** Nhấn nút "Đăng nhập"
- Click vào nút **"Đăng nhập"** màu đen
- Hệ thống sẽ hiển thị màn hình loading với thông báo "Đang đăng nhập..."

**Bước 5:** Xử lý kết quả đăng nhập

**Trường hợp 5.1 - Đăng nhập thành công:**
- Nếu tài khoản có **một vai trò duy nhất** (User):
  - Loading chuyển thành "Đang chuyển đến trang chủ..."
  - Tự động chuyển hướng đến `/TrangChu` sau 500ms
- Nếu tài khoản có **hai vai trò** (User và Admin):
  - Hiển thị Dialog chọn vai trò với 2 tùy chọn:
    - **"Quản trị viên"**: Chuyển đến trang `/admin`
    - **"Người dùng"**: Chuyển đến trang `/TrangChu`
  - Chọn vai trò phù hợp và nhấn vào tùy chọn đó
- Nếu đăng nhập thành công với vai trò Admin:
  - Chuyển hướng đến `/admin`

**Trường hợp 5.2 - Đăng nhập thất bại:**
- Hiển thị thông báo lỗi màu đỏ phía trên form
- Ví dụ: "Email không hợp lệ", "Mật khẩu không đúng"
- Người dùng có thể sửa thông tin và đăng nhập lại

#### B. Đăng nhập bằng Google

**Bước 1:** Nhấn nút "Đăng nhập với Google"
- Button màu xám với logo Google màu đỏ/cam/xanh
- Nằm phía trên form đăng nhập thông thường

**Bước 2:** Xác thực với Google
- Hệ thống sẽ mở cửa sổ đăng nhập Google
- Người dùng chọn tài khoản Google và cấp quyền

**Bước 3:** Xử lý tương tự như đăng nhập thông thường

#### C. Chức năng bổ sung

**Quên mật khẩu:**
- Click vào link **"Quên mật khẩu?"** màu tím bên dưới form
- Hệ thống chuyển hướng đến trang `/QuenMatKhau`

**Chuyển sang trang đăng ký:**
- Click vào dòng **"Chưa có tài khoản? Tạo mới"**
- Hệ thống chuyển hướng đến trang `/DangKy`

### Lưu ý quan trọng:
- Nếu phiên đăng nhập đã hết hạn, hệ thống sẽ tự động chuyển về trang đăng nhập với thông báo "Phiên đăng nhập đã hết hạn"
- Có thể bật/tắt hiển thị mật khẩu bằng icon mắt ở ô mật khẩu

---

## 1.2. Trang Đăng ký

**Đường dẫn:** `/DangKy`

**Mục đích:** Tạo tài khoản mới cho người dùng chưa có tài khoản.

### Quy trình thao tác:

**Bước 1:** Truy cập trang đăng ký
- Truy cập địa chỉ `/DangKy`
- Hoặc từ trang đăng nhập, click "Chưa có tài khoản? Tạo mới"

**Bước 2:** Điền thông tin cá nhân
- **Họ và tên**: Nhập họ tên đầy đủ (ít nhất 2 ký tự)
- **Email**: Nhập địa chỉ email hợp lệ (ví dụ: user@email.com)
- **Số điện thoại**: Nhập số điện thoại Việt Nam (ít nhất 10 số)
- **Mật khẩu**: Nhập mật khẩu mới (ít nhất 6 ký tự)
- **Xác nhận mật khẩu**: Nhập lại mật khẩu vừa tạo (phải trùng khớp)

**Bước 3:** Xem mật khẩu (tùy chọn)
- Click icon mắt bên phải ô mật khẩu để hiện/ẩn mật khẩu đang nhập
- Có thể bật cho cả ô "Mật khẩu" và "Xác nhận mật khẩu"

**Bước 4:** Nhấn nút "Tạo tài khoản"
- Click nút **"Tạo tài khoản"** màu đen
- Hệ thống hiển thị loading "Đang tạo tài khoản..."

**Bước 5:** Xử lý kết quả

**Trường hợp 5.1 - Đăng ký thành công:**
- Hệ thống tự động đăng nhập
- Chuyển hướng đến trang chủ `/TrangChu`
- Hiển thị thông báo chào mừng

**Trường hợp 5.2 - Đăng ký thất bại:**
- Hiển thị thông báo lỗi phía trên form
- Ví dụ: "Email đã tồn tại", "Mật khẩu không khớp"
- Yêu cầu người dùng sửa và thử lại

### Lưu ý:
- Tất cả các trường đều bắt buộc
- Mật khẩu và xác nhận mật khẩu phải trùng nhau
- Sau khi đăng ký thành công, tài khoản sẽ có vai trò mặc định là "Người dùng" (User)

---

## 1.3. Trang Quên mật khẩu

**Đường dẫn:** `/QuenMatKhau`

**Mục đích:** Khôi phục mật khẩu cho người dùng đã quên mật khẩu qua email và mã OTP.

### Quy trình thao tác:

Quy trình gồm 4 bước theo flow: Nhập Email → Nhập mã OTP → Đặt mật khẩu mới → Hoàn thành

#### Bước 1: Nhập Email (Bước EMAIL)

**Bước 1.1:** Truy cập trang
- Truy cập địa chỉ `/QuenMatKhau`
- Hoặc click "Quên mật khẩu?" từ trang đăng nhập

**Bước 1.2:** Nhập email đã đăng ký
- Điền **Email** đã sử dụng khi đăng ký tài khoản
- Ví dụ: nguyenvana@email.com

**Bước 1.3:** Nhấn "Gửi mã xác thực"
- Click nút **"Gửi mã xác thực"**
- Hệ thống gửi mã OTP 6 số đến email đã nhập
- Loading hiển thị "Đang gửi..."

**Bước 1.4:** Chuyển sang bước nhập OTP
- Sau khi gửi thành công, giao diện tự động chuyển sang bước 2
- Hiển thị thông báo xanh "Mã xác thực đã được gửi đến email của bạn"

#### Bước 2: Nhập mã OTP (Bước OTP)

**Bước 2.1:** Kiểm tra hộp thư email
- Mở email từ hệ thống
- Tìm mã OTP 6 số (có thời hạn 5 phút)

**Bước 2.2:** Nhập mã OTP
- Điền 6 số vào ô "Mã xác thực (6 số)"
- Mã được nhập với định dạng: `______` (6 ký tự)

**Bước 2.3:** Nhấn "Xác thực"
- Click nút **"Xác thực"**
- Hệ thống kiểm tra mã OTP

**Bước 2.4:** Xử lý kết quả OTP

*Thành công:*
- Chuyển sang bước 3 (Đặt mật khẩu mới)
- Hiển thị thông báo xanh "Xác thực thành công"

*Thất bại:*
- Hiển thị thông báo lỗi đỏ
- Cho phép nhập lại mã hoặc gửi lại mã mới

**Bước 2.5:** Gửi lại mã OTP (nếu cần)
- Đợi đếm ngược 60 giây
- Click **"Gửi lại mã"**
- Kiểm tra email và nhập mã mới

#### Bước 3: Đặt mật khẩu mới (Bước PASSWORD)

**Bước 3.1:** Nhập mật khẩu mới
- Điền **Mật khẩu mới** (ít nhất 6 ký tự)
- Sử dụng icon mắt để hiện/ẩn mật khẩu

**Bước 3.2:** Xác nhận mật khẩu mới
- Điền **Xác nhận mật khẩu mới** (phải trùng với mật khẩu mới)

**Bước 3.3:** Nhấn "Đặt lại mật khẩu"
- Click nút **"Đặt lại mật khẩu"**
- Hệ thống cập nhật mật khẩu mới

**Bước 3.4:** Xử lý kết quả
- **Thành công**: Chuyển sang bước 4 (Hoàn thành)
- **Thất bại**: Hiển thị lỗi và yêu cầu thử lại

#### Bước 4: Hoàn thành (Bước SUCCESS)

**Bước 4.1:** Xác nhận thành công
- Giao diện hiển thị icon checkmark xanh
- Thông báo "Đặt lại mật khẩu thành công!"

**Bước 4.2:** Đăng nhập với mật khẩu mới
- Click nút **"Đăng nhập ngay"**
- Hệ thống chuyển đến trang `/DangNhap`
- Đăng nhập với mật khẩu mới vừa đặt

### Chức năng bổ sung:

**Quay lại bước trước:**
- Từ bước OTP: Click "Nhập lại email khác" để quay về bước 1
- Từ bước PASSWORD: Click "Nhập lại mã xác thực" để quay về bước 2

---

## 1.4. Trang Chủ (Dashboard)

**Đường dẫn:** `/TrangChu`

**Mục đích:** Hiển thị tổng quan tài chính cá nhân bao gồm số dư, thu chi, biểu đồ và gợi ý từ AI.

### Quy trình thao tác:

**Bước 1:** Truy cập trang chủ
- Sau khi đăng nhập thành công, hệ thống tự động chuyển đến `/TrangChu`
- Hoặc click logo "Trang chủ" trên thanh điều hướng

**Bước 2:** Xem thông tin tổng quan (Hero Section)
- Đọc slogan: "Theo dõi dòng tiền rõ ràng"
- Xem các nút hành động nhanh:
  - **"Thêm giao dịch mới"**: Chuyển đến trang thêm giao dịch
  - **"Xem báo cáo"**: Chuyển đến trang báo cáo

**Bước 3:** Xem thẻ tổng quan (TheTongQuan)
- **Tổng thu**: Tổng số tiền thu nhập trong tháng
- **Tổng chi**: Tổng số tiền chi tiêu trong tháng
- **Tiết kiệm**: Số dư thuần (Thu - Chi)

**Bước 4:** Xem số dư các tài khoản (SoDuTaiKhoan)
- Danh sách các tài khoản đã liên kết:
  - Ví điện tử (Momo, ZaloPay...)
  - Tài khoản ngân hàng (MB Bank, Vietcombank...)
  - Tiền mặt
- Xem số dư hiện tại của từng tài khoản

**Bước 5:** Xem biểu đồ chi tiêu (BieuDoChiTieu)
- Biểu đồ đường thể hiện xu hướng thu/chi theo tháng
- So sánh giữa thu nhập và chi tiêu
- Có thể chọn xem theo các khoảng thời gian khác nhau

**Bước 6:** Xem gợi ý từ AI (GoiYAI)
- Các thông báo gợi ý thông minh từ hệ thống AI
- Phân loại: Cảnh báo, Gợi ý, Khích lệ
- Click vào gợi ý để xem chi tiết

**Bước 7:** Xem mục tiêu và ngân sách (MucTieuNganSach)
- Tiến độ các mục tiêu tiết kiệm đã thiết lập
- Trạng thái ngân sách các danh mục

**Bước 8:** Xem giao dịch gần đây (BangGiaoDich)
- Danh sách các giao dịch gần nhất
- Click để xem chi tiết hoặc chỉnh sửa

### Thao tác nhanh từ Dashboard:

1. **Thêm giao dịch mới**: Click nút "Thêm giao dịch mới" → `/GiaoDich/Moi`
2. **Xem báo cáo chi tiết**: Click nút "Xem báo cáo" → `/BaoCao`
3. **Quản lý tài khoản**: Click vào card tài khoản → `/TaiKhoan`
4. **Xem Trung tâm AI**: Click vào gợi ý AI → `/TrungTamAI`

---

## 1.5. Trang Giao dịch

**Đường dẫn:** `/GiaoDich`

**Mục đích:** Quản lý và theo dõi toàn bộ lịch sử giao dịch thu/chi.

### Quy trình thao tác:

**Bước 1:** Truy cập trang giao dịch
- Click menu "Giao dịch" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/GiaoDich`

**Bước 2:** Xem thông tin tổng quan
- **Header banner**: "Lịch sử giao dịch" với nền đen
- **Thẻ thống kê**:
  - Tổng thu (màu xanh lá)
  - Tổng chi (màu đỏ)
  - Số dư thuần (màu tím)
- Số liệu được cập nhật theo kỳ hiện tại

**Bước 3:** Sử dụng bộ lọc (BoLocGiaoDich)
- **Lọc theo tháng/năm**: Chọn tháng và năm muốn xem
- **Lọc theo loại**: Tất cả / Chi tiêu / Thu nhập
- **Lọc theo danh mục**: Chọn danh mục cụ thể
- **Tìm kiếm**: Nhập từ khóa để tìm giao dịch theo ghi chú
- Click **"Áp dụng"** để lọc dữ liệu

**Bước 4:** Xem danh sách giao dịch (BangLichSu)
- Bảng hiển thị các cột:
  - Ngày giao dịch
  - Danh mục (với icon và màu sắc)
  - Ghi chú
  - Số tiền (màu xanh cho thu, màu đỏ cho chi)
  - Tài khoản
- Các giao dịch được sắp xếp theo ngày mới nhất

**Bước 5:** Thao tác với từng giao dịch
- **Xem chi tiết**: Click vào dòng giao dịch
- **Sửa giao dịch**: Click icon chỉnh sửa → chuyển đến form sửa
- **Xóa giao dịch**: Click icon xóa → xác nhận xóa

**Bước 6:** Các nút hành động nhanh
- **"Thêm giao dịch"**: Chuyển đến `/GiaoDich/Moi`
- **"Export CSV"**: Xuất dữ liệu ra file CSV tại `/GiaoDich/NhapDuLieu`

**Bước 7:** Phân trang
- Nếu có nhiều giao dịch, sử dụng thanh phân trang
- Chọn số mục trên mỗi trang: 10, 20, 50...

### Lưu ý:
- Dữ liệu được đồng bộ trực tiếp từ hệ thống
- Có thể xem giao dịch của bất kỳ tháng nào bằng bộ lọc
- Bộ lọc danh mục chỉ hiển thị các danh mục đã được tạo

---

## 1.6. Trang Thêm/Sửa Giao dịch

**Đường dẫn:**
- Thêm mới: `/GiaoDich/Moi`
- Sửa: `/GiaoDich/Sua/{id}`

**Mục đích:** Tạo mới hoặc chỉnh sửa thông tin giao dịch thu/chi.

### Quy trình thao tác:

#### A. Thêm giao dịch mới

**Bước 1:** Truy cập trang
- Từ Dashboard: Click "Thêm giao dịch mới"
- Từ trang Giao dịch: Click nút "Thêm giao dịch"
- Truy cập trực tiếp `/GiaoDich/Moi`

**Bước 2:** Chọn loại giao dịch
- Chọn một trong ba loại bằng cách click:
  - **"Chi tiêu"** (mặc định) - màu đỏ hồng
  - **"Thu nhập"** - màu xanh lá
  - **"Chuyển khoản"** - màu xanh dương

**Bước 3:** Nhập số tiền
- Click vào ô số tiền (AmountInput)
- Nhập số tiền bằng bàn phím số
- Số tiền tối thiểu: 1,000 đ

**Bước 4:** Chọn ngày giao dịch
- Click vào ô ngày
- Chọn ngày từ calendar popup
- Mặc định là ngày hiện tại

**Bước 5:** Chọn tài khoản nguồn
- Click dropdown "Tài khoản nguồn"
- Chọn tài khoản thanh toán:
  - Ví điện tử (Momo, ZaloPay...)
  - Tài khoản ngân hàng
  - Tiền mặt

**Bước 6:** Chọn danh mục
- Click dropdown "Danh mục"
- Chọn danh mục phù hợp với giao dịch
- Ví dụ: Ăn uống, Di chuyển, Mua sắm, Lương...

**Bước 7:** (Tùy chọn) Sử dụng chế độ chia nhỏ (Split)
- Click nút **"BẬT CHIA NHỎ (SPLIT)"**
- Thêm nhiều danh mục cho một giao dịch
- Nhập số tiền cho từng danh mục
- Tổng tiền phân bổ phải bằng tổng số tiền giao dịch
- Click **"THÊM DANH MỤC PHÂN BỔ"** để thêm dòng mới
- Click icon thùng rác để xóa dòng phân bổ

**Bước 8:** (Tùy chọn) Thêm ghi chú
- Click vào ô ghi chú
- Nhập mô tả ngắn về giao dịch
- Ví dụ: "Cơm trưa công ty", "Tiền điện tháng 3"

**Bước 9:** (Tùy chọn) Upload ảnh hóa đơn
- Click vào vùng tải ảnh
- Chọn file ảnh từ máy tính
- Hoặc kéo thả file ảnh vào vùng upload
- Hỗ trợ các định dạng: JPG, PNG, GIF...
- Click icon X để xóa ảnh đã upload

**Bước 10:** Nhấn nút "LƯU GIAO DỊCH"
- Click nút **"LƯU GIAO DỊCH"** màu đen
- Hệ thống hiển thị loading "ĐANG LƯU..."
- Sau khi lưu thành công:
  - Hiển thị thông báo "Thêm giao dịch thành công!"
  - Tự động chuyển về trang danh sách giao dịch

#### B. Sửa giao dịch

**Bước 1:** Truy cập form sửa
- Từ trang danh sách giao dịch, click icon chỉnh sửa
- Hoặc click vào dòng giao dịch → chọn "Sửa"

**Bước 2:** Chỉnh sửa thông tin
- Thực hiện các bước 2-9 như khi thêm mới
- Các trường sẽ được điền sẵn với thông tin hiện tại

**Bước 3:** Lưu thay đổi
- Click nút **"CẬP NHẬT"**
- Hệ thống lưu thay đổi
- Hiển thị thông báo "Cập nhật thành công!"

**Bước 4:** Quay lại danh sách
- Click nút **"Quay lại"** hoặc icon mũi tên trái
- Hệ thống quay về trang danh sách giao dịch

### Mẹo sử dụng:
- Sử dụng chế độ Split khi một khoản chi tiêu thuộc nhiều danh mục
- Chụp ảnh hóa đơn để AI tự động phân loại và điền thông tin
- Ghi chú rõ ràng giúp tìm kiếm giao dịch dễ dàng hơn

---

## 1.7. Trang Giao dịch Định kỳ

**Đường dẫn:** `/GiaoDich/DinhKy`

**Mục đích:** Quản lý các giao dịch tự động lặp lại theo ngày/tuần/tháng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ menu điều hướng, chọn "Giao dịch" → "Định kỳ"
- Hoặc truy cập trực tiếp `/GiaoDich/DinhKy`

**Bước 2:** Xem thông tin giới thiệu
- Đọc thông báo về tính năng tự động
- Hiểu rằng hệ thống sẽ nhắc nhở hoặc tự động ghi nhận các khoản cố định

**Bước 3:** Xem danh sách giao dịch định kỳ
- Danh sách hiển thị các khoản đã thiết lập
- Thông tin mỗi giao dịch:
  - Tên/Khoản chi
  - Số tiền
  - Tần suất (Hàng ngày / Hàng tuần / Hàng tháng)
  - Danh mục
  - Trạng thái (Đang hoạt động / Đã tạm dừng)
  - Ngày bắt đầu / kết thúc

**Bước 4:** Thêm giao dịch định kỳ mới
- Click nút **"THIẾT LẬP MỚI"** màu đen

**Bước 5:** Điền thông tin trong popup
- **Loại giao dịch**: Chi tiêu / Thu nhập
- **Số tiền**: Nhập số tiền cố định
- **Danh mục**: Chọn danh mục
- **Tài khoản**: Chọn tài khoản thanh toán
- **Tần suất**:
  - Hàng ngày: Mỗi ngày
  - Hàng tuần: Chọn ngày trong tuần
  - Hàng tháng: Chọn ngày trong tháng
- **Ngày bắt đầu**: Chọn ngày bắt đầu
- **Ngày kết thúc**: Chọn ngày kết thúc (hoặc để trống nếu không có)
- **Ghi chú**: Mô tả khoản chi (tùy chọn)

**Bước 6:** Lưu giao dịch định kỳ
- Click nút **"Lưu"**
- Popup đóng lại
- Danh sách cập nhật với giao dịch mới

**Bước 7:** Thao tác với giao dịch định kỳ
- **Sửa**: Click icon chỉnh sửa → popup sửa mở ra
- **Tạm dừng**: Click icon tạm dừng → giao dịch không chạy trong thời gian tạm dừng
- **Xóa**: Click icon xóa → xác nhận xóa
- **Bật lại**: Click icon bật sau khi đã tạm dừng

### Ví dụ sử dụng:
- Tiền thuê nhà hàng tháng (Hàng tháng, ngày 5)
- Bảo hiểm xã hội (Hàng tháng, ngày 10)
- Tiền điện hàng tháng (Hàng tháng, cuối tháng)
- Đăng ký Premium hàng tháng (Hàng tháng)

---

## 1.8. Trang Import CSV

**Đường dẫn:** `/GiaoDich/NhapDuLieu`

**Mục đích:** Nhập nhanh lịch sử giao dịch từ file CSV của ngân hàng hoặc Excel.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ trang Giao dịch: Click nút "Export CSV"
- Hoặc truy cập trực tiếp `/GiaoDich/NhapDuLieu`

**Bước 2:** Xem thông tin bảo mật
- Đọc thông báo: "Dữ liệu được xử lý 100% tại trình duyệt của bạn"
- Yên tâm rằng file không được upload lên server

**Bước 3:** Tải file mẫu (tùy chọn)
- Click nút **"Tải file mẫu"** để download CSV mẫu
- Mở file mẫu trong Excel để xem cấu trúc

**Bước 4:** Upload file dữ liệu
- **Cách 1**: Kéo thả file vào vùng upload
- **Cách 2**: Click vào vùng upload → chọn file từ máy

**Bước 5:** Chọn file phù hợp
- Hỗ trợ định dạng: CSV, XLSX, XLS
- Chọn file export từ ngân hàng của bạn:
  - Vietcombank
  - Techcombank
  - MB Bank
  - VietinBank
  - ACB...

**Bước 6:** Xem trước dữ liệu
- Hệ thống hiển thị bảng xem trước các dòng đầu tiên
- Kiểm tra dữ liệu đã đúng format chưa

**Bước 7:** Xử lý với AI
- Hệ thống tự động:
  - Giải mã mô tả giao dịch
  - Gán danh mục tự động (độ chính xác ~98%)
  - Phân loại thu/chi
- Xem danh sách giao dịch đã được xử lý

**Bước 8:** Kiểm tra và chỉnh sửa (tùy chọn)
- Xem lại từng giao dịch đã được gán
- Chỉnh sửa danh mục nếu AI gán sai
- Xóa các dòng không cần thiết

**Bước 9:** Nhập dữ liệu vào hệ thống
- Click nút **"Nhập dữ liệu"**
- Hệ thống tạo các giao dịch trong cơ sở dữ liệu
- Hiển thị số lượng giao dịch đã nhập thành công

### Lưu ý:
- File phải có các cột: Ngày, Mô tả/Ghi chú, Số tiền
- AI sẽ tự nhận diện và phân loại
- Có thể import nhiều file cùng lúc

---

## 1.9. Trang Danh mục

**Đường dẫn:** `/DanhMuc`

**Mục đích:** Quản lý các danh mục thu/chi để phân loại giao dịch.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Danh mục" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/DanhMuc`

**Bước 2:** Xem cấu trúc danh mục
- Header: "Sắp xếp danh mục một cách thông minh"
- Giới thiệu về cách tổ chức nhóm thu chi

**Bước 3:** Xem danh sách danh mục (QuanLyDanhMuc)
- Hai tab chính:
  - **"Chi tiêu"**: Các danh mục chi (Ăn uống, Di chuyển...)
  - **"Thu nhập"**: Các danh mục thu (Lương, Thưởng...)
- Mỗi danh mục hiển thị:
  - Icon màu sắc đặc trưng
  - Tên danh mục
  - Số giao dịch trong tháng
  - Tổng số tiền trong tháng

**Bước 4:** Thêm danh mục mới
- Click nút **"Thêm danh mục"**

**Bước 5:** Điền thông tin danh mục mới
- **Tên danh mục**: Nhập tên mới
  - Ví dụ: "Điện thoại & Laptop", "Du lịch"
- **Loại**: Chi tiêu / Thu nhập
- **Icon**: Chọn icon từ thư viện
- **Màu sắc**: Chọn màu cho danh mục

**Bước 6:** Lưu danh mục
- Click nút **"Lưu"** hoặc **"Tạo mới"**
- Danh mục mới xuất hiện trong danh sách

**Bước 7:** Sửa danh mục
- Click icon chỉnh sửa trên danh mục muốn sửa
- Popup sửa mở ra với thông tin hiện tại
- Chỉnh sửa tên, icon, màu sắc
- Click **"Lưu thay đổi"**

**Bước 8:** Xóa danh mục
- Click icon xóa trên danh mục muốn xóa
- **Cảnh báo**: Nếu danh mục đang có giao dịch:
  - Hệ thống sẽ cảnh báo
  - Yêu cầu chuyển giao dịch sang danh mục khác trước khi xóa
- Xác nhận xóa

**Bước 9:** Lọc danh mục
- Sử dụng tab để xem riêng Chi tiêu / Thu nhập
- Tìm kiếm theo tên danh mục

### Lưu ý:
- Không nên xóa danh mục đang có giao dịch
- Nên tạo danh mục có icon và màu sắc dễ nhận biết
- Có thể tạo danh mục con bên trong danh mục cha (nếu hỗ trợ)

---

## 1.10. Trang Tài khoản

**Đường dẫn:** `/TaiKhoan`

**Mục đích:** Quản lý các tài khoản thanh toán (ví, ngân hàng, tiền mặt).

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Tài khoản" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/TaiKhoan`

**Bước 2:** Xem danh sách tài khoản
- Grid hiển thị các card tài khoản:
  - **Tiền mặt**: Số dư tiền mặt hiện có
  - **Ngân hàng**: MB Bank, Vietcombank...
  - **Ví điện tử**: Momo, ZaloPay, VNPay...
  - **Đầu tư**: Tài khoản chứng khoán, tiết kiệm...

**Bước 3:** Xem chi tiết từng tài khoản
- **Số dư**: Số tiền hiện có trong tài khoản
- **% thay đổi**: Biến động so với kỳ trước
- **Loại tài khoản**: Ví, Ngân hàng, Tiền mặt, Đầu tư

**Bước 4:** Thêm tài khoản mới
- Click nút **"Thêm tài khoản"**

**Bước 5:** Điền thông tin tài khoản mới
- **Tên tài khoản**: Ví dụ "MB Bank - Lương"
- **Loại tài khoản**:
  - Tiền mặt
  - Tài khoản ngân hàng
  - Ví điện tử
  - Tài khoản đầu tư
- **Số dư ban đầu**: Nhập số dư hiện tại
- **Ghi chú**: Thông tin bổ sung (tùy chọn)

**Bước 6:** Lưu tài khoản
- Click nút **"Lưu"** hoặc **"Tạo mới"**
- Tài khoản mới xuất hiện trong danh sách

**Bước 7:** Chuyển tiền nội bộ
- Click nút **"Chuyển khoản nội bộ"**
- Điền thông tin:
  - **Tài khoản nguồn**: Chọn tài khoản gửi tiền
  - **Tài khoản đích**: Chọn tài khoản nhận tiền
  - **Số tiền**: Nhập số tiền chuyển
  - **Ghi chú**: Lý do chuyển tiền (tùy chọn)
- Xác nhận chuyển tiền
- Hệ thống tạo 2 giao dịch:
  - Giao dịch chi: Tài khoản nguồn
  - Giao dịch thu: Tài khoản đích

**Bước 8:** Thao tác với tài khoản
- **Sửa**: Cập nhật thông tin tài khoản
- **Nạp tiền**: Ghi nhận tiền vào tài khoản
- **Xem giao dịch**: Xem lịch sử giao dịch của tài khoản
- **Xóa**: Xóa tài khoản (không xóa được nếu còn số dư)

### Lưu ý:
- Số dư tài khoản tự động cập nhật khi có giao dịch
- Nên tạo ít nhất 1 tài khoản "Tiền mặt" để quản lý chi tiêu hàng ngày
- Chuyển tiền nội bộ không mất phí và không cần xác nhận OTP

---

## 1.11. Trang Ngân sách

**Đường dẫn:** `/NganSach`

**Mục đích:** Thiết lập hạn mức chi tiêu cho từng danh mục để kiểm soát tài chính.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Ngân sách" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/NganSach`

**Bước 2:** Xem tổng quan ngân sách
- Header hiển thị "Quản Lý Ngân Sách"
- Tháng/năm hiện tại
- **Thẻ thống kê**:
  - Tổng hạn mức chi tiêu
  - Đã sử dụng (%)
  - Còn lại

**Bước 3:** Xem chi tiết theo danh mục (BangNganSach)
- Danh sách các ngân sách đã thiết lập
- Mỗi ngân sách hiển thị:
  - Tên danh mục
  - Hạn mức (số tiền tối đa)
  - Đã sử dụng (số tiền đã chi)
  - Còn lại
  - Thanh tiến độ (%)
  - Trạng thái: Bình thường / Sắp đầy / Đã vượt

**Bước 4:** Thiết lập ngân sách mới
- Click nút **"THIẾT LẬP HẠN MỨC"**

**Bước 5:** Điền thông tin ngân sách
- **Tên ngân sách**: Tên gọi (hoặc tự động lấy tên danh mục)
- **Danh mục**: Chọn danh mục muốn đặt hạn mức
- **Hạn mức**: Số tiền tối đa cho phép chi trong tháng
- **Tháng/Năm**: Tháng năm áp dụng (mặc định tháng hiện tại)

**Bước 6:** Lưu ngân sách
- Click nút **"Lưu"** hoặc **"Tạo mới"**
- Ngân sách mới xuất hiện trong danh sách

**Bước 7:** Sửa ngân sách
- Click icon chỉnh sửa trên ngân sách muốn sửa
- Popup sửa mở ra
- Thay đổi hạn mức hoặc danh mục
- Click **"Lưu thay đổi"**

**Bước 8:** Xóa ngân sách
- Click icon xóa trên ngân sách
- Xác nhận xóa

**Bước 9:** Xem cảnh báo
- Phần "Cảnh báo rủi ro chi tiêu" hiển thị:
  - Danh mục sắp đầy hạn mức (>80%)
  - Ngày dự kiến hết ngân sách
- Click **"Tối ưu ngay"** để xem gợi ý

**Bước 10:** Cài đặt tự động hóa (tùy chọn)
- Click nút **"Tự động hóa"**
- Thiết lập:
  - Nhắc nhở khi đạt 70% hạn mức
  - Nhắc nhở khi đạt 90% hạn mức
  - Khóa chi tiêu khi vượt hạn mức

### Lưu ý:
- Nên đặt hạn mức thực tế, không quá thấp hoặc quá cao
- Theo dõi thanh tiến độ để điều chỉnh kịp thời
- Hệ thống sẽ cảnh báo khi sắp vượt hạn mức

---

## 1.12. Trang Mục tiêu Tài chính

**Đường dẫn:** `/MucTieu`

**Mục đích:** Thiết lập và theo dõi các mục tiêu tiết kiệm, đầu tư.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Mục tiêu" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/MucTieu`

**Bước 2:** Xem tổng quan
- Header: "Cột Mốc Tài Chính"
- **Thẻ tổng quan**:
  - Tổng giá trị tất cả mục tiêu
  - % hoàn thành tổng thể
  - Thanh tiến độ tổng hợp

**Bước 3:** Xem danh sách mục tiêu (DanhSachMucTieu)
- Grid hiển thị các card mục tiêu:
  - **Tên mục tiêu**: "Mua xe", "Du lịch Châu Âu", "Quỹ dự phòng"
  - **Số tiền mục tiêu**: Số tiền cần đạt được
  - **Số tiền hiện có**: Số tiền đã tích lũy
  - **Tiến độ**: Thanh % và ngày còn lại
  - **Màu sắc**: Màu đặc trưng của mục tiêu

**Bước 4:** Tạo mục tiêu mới
- Click nút **"TẠO MỤC TIÊU MỚI"** màu tím

**Bước 5:** Điền thông tin mục tiêu (FormMucTieu)
- **Tên mục tiêu**: Ví dụ "Mua xe ô tô"
- **Số tiền mục tiêu**: Số tiền cần tiết kiệm
- **Ngày bắt đầu**: Ngày bắt đầu tính từ hôm nay
- **Ngày kết thúc**: Ngày dự kiến hoàn thành
- **Màu sắc**: Chọn màu cho mục tiêu
- **Ghi chú**: Mô tả chi tiết (tùy chọn)

**Bước 6:** Lưu mục tiêu
- Click nút **"Lưu"** hoặc **"Tạo mới"**
- Mục tiêu xuất hiện trong danh sách

**Bước 7:** Đóng góp vào mục tiêu
- Click nút **"Đóng góp"** trên card mục tiêu

**Bước 8:** Nhập thông tin đóng góp (FormDongGop)
- **Số tiền đóng góp**: Số tiền muốn thêm vào mục tiêu
- **Ghi chú**: Lý do đóng góp (tùy chọn)

**Bước 9:** Xác nhận đóng góp
- Click nút **"Xác nhận"**
- Số tiền được cộng vào mục tiêu
- Tiến độ được cập nhật

**Bước 10:** Thao tác với mục tiêu
- **Sửa**: Chỉnh sửa thông tin mục tiêu
- **Xóa**: Xóa mục tiêu (xác nhận trước khi xóa)
- **Hoàn thành**: Đánh dấu mục tiêu đã hoàn thành

### Lưu ý:
- Nên đặt mục tiêu cụ thể và có thời hạn rõ ràng
- Đóng góp định kỳ giúp đạt mục tiêu nhanh hơn
- Có thể thiết lập tự động trích lập từ lương hàng tháng

---

## 1.13. Trang Báo cáo

**Đường dẫn:** `/BaoCao`

**Mục đích:** Xem báo cáo, biểu đồ phân tích chi tiêu theo nhiều góc nhìn.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Báo cáo" trên thanh điều hướng
- Hoặc từ Dashboard, click "Xem báo cáo"
- Truy cập trực tiếp `/BaoCao`

**Bước 2:** Xem tổng quan báo cáo
- Header: "Phân tích chi tiêu một cách toàn diện"
- Mô tả về tính năng phân tích

**Bước 3:** Xem thẻ tổng hợp
- **Tổng thu nhập**: Số tiền thu trong kỳ (màu xanh)
- **Tổng chi tiêu**: Số tiền chi trong kỳ (màu đỏ)
- **Tiết kiệm**: Chênh lệch (Thu - Chi) (màu tím)

**Bước 4:** Xem biểu đồ phân tích xu hướng (BieuDoPhanTichApex)
- Biểu đồ đường thể hiện:
  - Thu nhập theo ngày/tháng
  - Chi tiêu theo ngày/tháng
  - Xu hướng tiết kiệm
- Có thể chọn khoảng thời gian: 7 ngày, 30 ngày, 3 tháng...

**Bước 5:** Xem biểu đồ phân bổ theo danh mục (BieuDoPhanBoDanhMuc)
- **Biểu đồ Chi tiêu** (biểu đồ tròn):
  - Tỷ lệ chi tiêu theo từng danh mục
  - Ví dụ: Ăn uống 30%, Di chuyển 20%, Mua sắm 25%...
- **Biểu đồ Thu nhập** (biểu đồ tròn):
  - Tỷ lệ thu nhập theo nguồn
  - Ví dụ: Lương 80%, Thưởng 15%, Khác 5%...

**Bước 6:** Xem bảng top chi tiêu (BangTopChiTieu)
- Bảng xếp hạng:
  - Top 5 danh mục chi nhiều nhất
  - So sánh với tháng trước
  - % thay đổi

**Bước 7:** Lọc báo cáo theo thời gian
- Chọn tháng/năm muốn xem
- Hệ thống cập nhật toàn bộ biểu đồ và số liệu

**Bước 8:** Xuất báo cáo (tùy chọn)
- Click nút **"Xuất báo cáo"**
- Chọn định dạng: PDF, Excel
- Tải file về máy

### Phân tích chi tiết:

**So sánh các tháng:**
- Chọn 2 tháng khác nhau để so sánh
- Xem xu hướng tăng/giảm chi tiêu

**Nhận diện bất thường:**
- Các khoản chi bất thường được highlight
- Cảnh báo nếu chi tiêu vượt ngưỡng bình thường

**Gợi ý cải thiện:**
- Hệ thống đề xuất cách tiết kiệm dựa trên dữ liệu
- So sánh với mức chi tiêu trung bình

---

## 1.14. Trang Trung tâm AI

**Đường dẫn:** `/TrungTamAI`

**Mục đích:** Sử dụng các tính năng trí tuệ nhân tạo để phân tích và dự đoán tài chính.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Trung tâm AI" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/TrungTamAI`

**Bước 2:** Xem header và trạng thái
- Header: "Trung Tâm AI Insights"
- Trạng thái: "System Active" với đèn xanh nhấp nháy
- Ghi chú: "Phân tích bởi Gemini-Pro Engine"

**Bước 3:** Chọn tab chức năng
Ba tab chính:
- **"Dự Đoán"**: Xem dự báo và phân tích xu hướng
- **"Phân Tích AI"**: Phân tích chi tiêu chi tiết bằng AI
- **"Hỏi Đáp"**: Chat trực tiếp với AI

**Bước 4:** Tab Dự Đoán (mặc định)

**Bước 4.1:** Xem biểu đồ dự đoán (BieuDoDuDoan)
- Dự đoán chi tiêu tháng tới
- Xu hướng tiết kiệm
- Biểu đồ minh họa

**Bước 4.2:** Xem cố vấn tài chính (LoiKhuyenAI)
- Các lời khuyên được cá nhân hóa
- Tips tiết kiệm cụ thể
- Click "Hỏi đáp AI chuyên sâu" để mở chat

**Bước 4.3:** Xem cảnh báo hệ thống
- **"Tốc Độ Tiêu Tiền Nhanh"**: Cảnh báo nếu chi tiêu vượt dự kiến
- **"Rủi Ro Thanh Toán"**: Cảnh báo số dư không đủ chi trả
- Click vào cảnh báo để xem chi tiết

**Bước 5:** Tab Phân Tích AI

**Bước 5.1:** Sử dụng Gemini Phân Tích (GeminiPhanTich)
- Chọn khoảng thời gian phân tích
- Click **"Phân tích ngay"**
- AI sẽ phân tích toàn bộ giao dịch trong kỳ
- Trả về báo cáo chi tiết:
  - Thói quen chi tiêu
  - Điểm mạnh/yếu tài chính
  - Gợi ý cải thiện

**Bước 6:** Tab Hỏi Đáp

**Bước 6.1:** Mở Cố vấn AI Chuyên sâu
- Click nút **"Bắt Đầu Trò Chuyện Ngay"**
- Popup chat mở ra (CoVanAIChuyenSau)

**Bước 6.2:** Nhập câu hỏi
- Gõ câu hỏi vào ô chat
- Ví dụ:
  - "Tôi nên tiết kiệm bao nhiêu % thu nhập?"
  - "Phân tích chi tiêu tháng này của tôi"
  - "Gợi ý kế hoạch tiết kiệm cho tôi"

**Bước 6.3:** Xem câu trả lời
- AI phản hồi dựa trên dữ liệu thực tế của bạn
- Có thể đưa ra hành động cụ thể

**Bước 6.4:** Tiếp tục hội thoại
- Đặt câu hỏi tiếp theo
- AI ghi nhớ ngữ cảnh cuộc trò chuyện

### Lưu ý:
- AI sử dụng dữ liệu giao dịch thực tế để phân tích
- Câu trả lời được cá nhân hóa theo tình hình tài chính của bạn
- Có thể hỏi về: kế hoạch tài chính, mẹo tiết kiệm, phân tích chi tiêu

---

## 1.15. Trang Hồ sơ

**Đường dẫn:** `/HoSo`

**Mục đích:** Xem và quản lý thông tin cá nhân của người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Hồ sơ" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/HoSo`

**Bước 2:** Xem thông tin hồ sơ
- **Avatar**: Hình đại diện (từ Google hoặc mặc định)
- **Họ tên**: Tên người dùng
- **Email**: Địa chỉ email đăng ký
- **Vai trò**: User / Admin

**Bước 3:** Xem thông tin chi tiết
- **Email**: Hiển thị email đã xác thực
- **Vai trò**: Quyền hạn trong hệ thống

**Bước 4:** Chỉnh sửa hồ sơ (tùy chọn nếu có form)
- Click nút **"Chỉnh sửa"** (nếu có)
- Cập nhật thông tin:
  - Họ tên
  - Số điện thoại
  - Ngày sinh
  - Địa chỉ
- Click **"Lưu"** để cập nhật

**Bước 5:** Thay đổi avatar (tùy chọn)
- Click vào avatar hiện tại
- Chọn ảnh mới từ máy tính
- Crop và xác nhận

**Bước 6:** Truy cập các chức năng liên quan
- Click nút **"Quản lý Tài khoản & Giao dịch"**
- Chuyển đến trang quản lý tài khoản

### Lưu ý:
- Thông tin hồ sơ được bảo mật
- Email là thông tin chính để đăng nhập
- Vai trò xác định quyền truy cập các tính năng

---

## 1.16. Trang Cài đặt

**Đường dẫn:** `/CaiDat`

**Mục đích:** Tùy chỉnh cài đặt ứng dụng và tài khoản.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Click menu "Cài đặt" trên thanh điều hướng
- Hoặc truy cập trực tiếp `/CaiDat`

**Bước 2:** Xem thông tin tài khoản
- **Tên tài khoản**: Tên người dùng
- **Email**: Email đã đăng ký
- **Vai trò**: Quyền hạn hiện tại

**Bước 3:** Bật/tắt thông báo
- Tìm mục **"Thông báo"**
- Click switch để bật/tắt:
  - **Bật**: Nhận thông báo về giao dịch lớn
  - **Tắt**: Không nhận thông báo

**Bước 4:** Bật/tắt chế độ tối
- Tìm mục **"Chế độ tối"**
- Click switch để bật/tắt:
  - **Bật**: Giao diện chuyển sang màu tối
  - **Tắt**: Giao diện sáng (mặc định)

**Bước 5:** Cài đặt thanh toán tự động
- Tìm mục **"Thanh toán tự động"**
- Click switch để bật/tắt:
  - **Bật**: Tự động ghi nhận giao dịch định kỳ
  - **Tắt**: Chỉ nhắc nhở, không tự động

**Bước 6:** Lưu thay đổi
- Click nút **"Lưu thay đổi"**
- Hệ thống lưu các cài đặt đã thay đổi

**Bước 7:** Truy cập quản lý phương thức thanh toán
- Click nút **"Quản lý Phương thức thanh toán"**
- Chuyển đến trang `/TaiKhoan`

### Lưu ý:
- Các cài đặt được lưu theo tài khoản người dùng
- Chế độ tối giúp giảm mỏi mắt khi sử dụng ban đêm
- Thông báo giúp bạn kiểm soát tài chính tốt hơn

---

# 2. GIAO DIỆN QUẢN TRỊ VIÊN

---

## 2.1. Trang Dashboard Admin

**Đường dẫn:** `/admin`

**Mục đích:** Theo dõi tổng quan hệ thống, các chỉ số và hoạt động của toàn bộ người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang Admin
- Đăng nhập với tài khoản có vai trò Admin
- Chọn "Quản trị viên" khi có dialog chọn vai trò
- Hệ thống chuyển đến `/admin`

**Bước 2:** Xem header dashboard
- Tiêu đề: "Bảng Điều Khiển"
- Phụ đề: "Trung tâm điều hành FINANCE AI v4.0.2"
- Trạng thái server: "Optimal" với đèn xanh

**Bước 3:** Xem các chỉ số chính (Metrics Grid)
Bốn thẻ metrics:
- **"Tổng người dùng"**: Tổng số tài khoản đã đăng ký
- **"Giao dịch 24h"**: Tổng giá trị giao dịch trong 24 giờ
- **"Yêu cầu hỗ trợ"**: Số lượng ticket hỗ trợ đang mở
- **"Tỉ lệ giữ chân"**: % người dùng hoạt động thường xuyên

Mỗi thẻ hiển thị:
- Icon màu sắc đặc trưng
- Giá trị hiện tại
- % thay đổi so với kỳ trước

**Bước 4:** Xem biểu đồ tăng trưởng người dùng
- Biểu đồ diện tích (Area Chart)
- Dữ liệu theo ngày trong tuần
- Chọn khoảng thời gian: 7 ngày, 30 ngày, 90 ngày

**Bước 5:** Xem thông số hệ thống
- **CPU Usage**: % sử dụng CPU
- **Memory Load**: % sử dụng RAM
- Cảnh báo nếu vượt ngưỡng 80%

**Bước 6:** Xem lưu lượng global
- Số requests đến hệ thống
- Đang hoạt động theo thời gian thực

**Bước 7:** Điều hướng đến các trang quản lý
- Sidebar/Menu chứa các mục:
  - Người dùng
  - Giao dịch
  - Danh mục
  - AI
  - Giám sát
  - Cài đặt

---

## 2.2. Trang Quản lý Người dùng

**Đường dẫn:** `/admin/NguoiDung`

**Mục đích:** Quản lý tài khoản người dùng, xem thông tin và khóa/mở khóa tài khoản.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Người dùng"**
- Hoặc truy cập trực tiếp `/admin/NguoiDung`

**Bước 2:** Xem tổng quan
- Tiêu đề: "Quản Lý Người Dùng"
- **Thẻ thống kê**:
  - Tổng số tài khoản
  - Hoạt động (đang online)
  - Đã khóa

**Bước 3:** Xem danh sách người dùng (BangNguoiDung)
- Bảng hiển thị các cột:
  - **ID**: Mã người dùng
  - **Họ tên**: Tên đầy đủ
  - **Email**: Địa chỉ email
  - **Vai trò**: User / Admin
  - **Trạng thái**: Hoạt động / Đã khóa
  - **Ngày tạo**: Ngày đăng ký
  - **Hành động**: Các nút thao tác

**Bước 4:** Tìm kiếm người dùng
- Nhập từ khóa vào ô tìm kiếm
- Tìm theo: Tên, Email, ID
- Kết quả lọc tức thì

**Bước 5:** Lọc theo trạng thái
- Chọn dropdown:
  - Tất cả
  - Hoạt động
  - Đã khóa

**Bước 6:** Xem chi tiết người dùng
- Click vào dòng người dùng
- Popup/Modal hiển thị chi tiết (ChiTietNguoiDung):
  - Thông tin cá nhân đầy đủ
  - Lịch sử hoạt động
  - Tổng số giao dịch
  - Tổng thu/chi

**Bước 7:** Khóa tài khoản
- Click icon **"Khóa"** trên dòng người dùng
- Xác nhận hành động
- Người dùng sẽ không thể đăng nhập
- Ghi log hành động khóa

**Bước 8:** Mở khóa tài khoản
- Click icon **"Mở khóa"** trên tài khoản đã khóa
- Xác nhận mở khóa
- Người dùng có thể đăng nhập lại

**Bước 9:** Phân quyền Admin
- Click icon **"Cấp quyền Admin"** (nếu có)
- Người dùng trở thành Admin
- Có thể đăng nhập vào trang Admin

### Lưu ý bảo mật:
- Khóa tài khoản sẽ vô hiệu hóa ngay lập tức
- Tất cả phiên đăng nhập sẽ bị chấm dứt
- Kiểm tra lịch sử giao dịch trước khi khóa

---

## 2.3. Trang Quản lý Giao dịch

**Đường dẫn:** `/admin/GiaoDich`

**Mục đích:** Giám sát toàn bộ giao dịch của tất cả người dùng trong hệ thống.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Giao dịch"**
- Hoặc truy cập trực tiếp `/admin/GiaoDich`

**Bước 2:** Xem thông tin header
- Tiêu đề: "Toàn Bộ Giao Dịch"
- Phụ đề: "Giám sát và điều phối dòng tiền hệ thống"

**Bước 3:** Tìm kiếm giao dịch
- Nhập từ khóa vào ô tìm kiếm
- Tìm theo: Ghi chú, email người dùng

**Bước 4:** Lọc theo người dùng
- Chọn người dùng từ dropdown
- Xem giao dịch của một người cụ thể

**Bước 5:** Lọc theo loại giao dịch
- Chọn loại:
  - Tất cả
  - Chi tiêu
  - Thu nhập
  - Chuyển khoản

**Bước 6:** Xem danh sách giao dịch (BangGiaoDichAdmin)
- Bảng hiển thị:
  - **ID giao dịch**
  - **Người dùng** (email)
  - **Ngày giao dịch**
  - **Danh mục**
  - **Số tiền**
  - **Loại** (Thu/Chi)
  - **Trạng thái**

**Bước 7:** Xem chi tiết giao dịch
- Click vào dòng giao dịch
- Popup hiển thị thông tin đầy đủ:
  - Người tạo
  - Số tiền
  - Danh mục
  - Tài khoản
  - Ghi chú
  - Ảnh hóa đơn (nếu có)

**Bước 8:** Thêm giao dịch thủ công
- Click nút **"Thêm giao dịch thủ công"**
- Điền thông tin và xác nhận
- Giao dịch được tạo cho người dùng được chọn

**Bước 9:** Xuất báo cáo
- Click nút **"Xuất báo cáo"**
- Chọn định dạng: Excel, CSV
- Tải file về máy

---

## 2.4. Trang Quản lý Danh mục

**Đường dẫn:** `/admin/DanhMuc`

**Mục đích:** Cấu hình danh mục hệ thống, thêm/sửa/xóa danh mục toàn cục.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Danh mục"**
- Hoặc truy cập trực tiếp `/admin/DanhMuc`

**Bước 2:** Xem thông tin header
- Tiêu đề: "Cấu Hình Danh Mục"
- Ghi chú: "Cập nhật sẽ đồng bộ toàn người dùng"

**Bước 3:** Xem thống kê
- Tổng danh mục cha
- Tổng danh mục con
- Từ khóa AI đã gán

**Bước 4:** Xem bảng danh mục (BangDanhMuc)
- Hiển thị cây phân cấp danh mục
- Danh mục cha → Danh mục con
- Mỗi danh mục có:
  - Icon và màu sắc
  - Tên danh mục
  - Loại (Thu/Chi)
  - Số lượng giao dịch
  - Hành động

**Bước 5:** Thêm danh mục mới
- Click nút **"Thêm danh mục"**
- Điền thông tin:
  - Tên danh mục
  - Loại: Thu / Chi
  - Danh mục cha (chọn hoặc để null)
  - Icon
  - Màu sắc
- Click **"Lưu"**

**Bước 6:** Sửa danh mục
- Click icon sửa trên danh mục
- Chỉnh sửa thông tin
- Click **"Lưu thay đổi"**

**Bước 7:** Xóa danh mục
- Click icon xóa trên danh mục
- **Cảnh báo**: Xóa sẽ ảnh hưởng đến tất cả người dùng
- Xác nhận xóa

**Bước 8:** Truy cập cấu hình từ khóa AI
- Click nút **"Huấn luyện từ khóa AI"**
- Chuyển đến `/admin/DanhMuc/TuKhoaAI`

### Lưu ý:
- Thay đổi danh mục ảnh hưởng đến tất cả người dùng
- Nên kiểm tra tính tương phản màu trước khi lưu
- Không xóa danh mục đang có giao dịch

---

## 2.5. Trang Cấu hình Từ khóa AI

**Đường dẫn:** `/admin/DanhMuc/TuKhoaAI`

**Mục đích:** Huấn luyện AI tự động phân loại giao dịch dựa trên từ khóa.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ trang Danh mục, click "Huấn luyện từ khóa AI"
- Hoặc truy cập trực tiếp `/admin/DanhMuc/TuKhoaAI`

**Bước 2:** Xem danh sách từ khóa
- Bảng hiển thị:
  - Từ khóa (mô tả giao dịch)
  - Danh mục được gán
  - Số lần match
  - Độ chính xác

**Bước 3:** Thêm từ khóa mới
- Click nút **"Thêm từ khóa"**
- Điền thông tin:
  - Từ khóa: "ATM", "Chuyển khoản", "Thanh toán..."
  - Danh mục gán: Chọn danh mục tương ứng
- Click **"Lưu"**

**Bước 4:** Sửa từ khóa
- Click icon sửa
- Thay đổi danh mục gán
- Click **"Lưu"**

**Bước 5:** Xóa từ khóa
- Click icon xóa
- Xác nhận xóa

**Bước 6:** Import từ khóa hàng loạt
- Click nút **"Import Excel"**
- Upload file Excel chứa danh sách từ khóa
- Xác nhận import

### Lưu ý:
- Càng nhiều từ khóa, AI càng chính xác
- Nên thêm các từ khóa phổ biến của người dùng Việt Nam
- Từ khóa có thể là cụm từ, không chỉ từ đơn

---

## 2.6. Trang AI Analytics

**Đường dẫn:** `/admin/AI/ThongKe`

**Mục đích:** Theo dõi hiệu suất và thống kê của hệ thống AI.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"AI"** → **"Thống kê"**
- Hoặc truy cập trực tiếp `/admin/AI/ThongKe`

**Bước 2:** Xem header
- Tiêu đề: "AI Analytics"
- Trạng thái: "Model Health Check"

**Bước 3:** Xem các chỉ số AI
- **Độ chính xác toàn cục**: % AI phân loại đúng
- **Giao dịch gán nhãn AI**: Số lượng giao dịch được AI phân loại
- **Lỗi gán nhãn TB**: Số lượng lỗi trung bình
- **Dự báo chi tiêu (T+1)**: Dự đoán cho ngày mai

**Bước 4:** Xem biểu đồ tổng hợp (BieuDoAIHeC)
- Biểu đồ hiệu suất mô hình AI
- So sánh các phiên bản model
- Xem độ chính xác theo thời gian

**Bước 5:** Xem Training Progress
- Tiến độ huấn luyện model mới
- Số epoch hiện tại / tổng số
- Độ chính xác đạt được

**Bước 6:** Xem Anomaly Detection
- Tỉ lệ phát hiện bất thường
- Số giao dịch nghi vấn được flag
- Chi tiết về các loại bất thường

**Bước 7:** Truy cập các trang AI khác
- **"Gợi ý"** (`/admin/AI/GoiY`): Cấu hình gợi ý cho người dùng
- **"Ưu tiên"** (`/admin/AI/UuTien`): Cấu hình mức độ ưu tiên AI

---

## 2.7. Trang Giám sát - Nhật ký

**Đường dẫn:** `/admin/GiamSat/NhatKy`

**Mục đích:** Xem nhật ký hoạt động hệ thống, theo dõi các hành động của Admin và người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Giám sát"** → **"Nhật ký"**
- Hoặc truy cập trực tiếp `/admin/GiamSat/NhatKy`

**Bước 2:** Xem header
- Tiêu đề: "Audit Logs"
- Phụ đề: "Nhật ký hoạt động hệ thống nhạy cảm"

**Bước 3:** Xem thống kê
- Tổng logs (24h)
- Hành động nhạy cảm
- Security Alert
- Admin hoạt động

**Bước 4:** Xem bảng nhật ký (BangNhatKy)
- Bảng hiển thị:
  - **Thời gian**: Ngày giờ hành động
  - **Người dùng**: Ai thực hiện
  - **Hành động**: Loại hành động
  - **Đối tượng**: Tài nguyên bị ảnh hưởng
  - **Chi tiết**: Thông tin bổ sung
  - **IP**: Địa chỉ IP thực hiện

**Bước 5:** Lọc nhật ký
- **Theo thời gian**: Hôm nay, 7 ngày, 30 ngày
- **Theo người dùng**: Chọn người cụ thể
- **Theo loại hành động**:
  - Đăng nhập / Đăng xuất
  - Tạo / Sửa / Xóa
  - Admin actions

**Bước 6:** Tìm kiếm nhật ký
- Nhập từ khóa tìm kiếm
- Tìm nhanh trong nội dung nhật ký

**Bước 7:** Xuất nhật ký
- Click nút **"Xuất logs"**
- Chọn định dạng và khoảng thời gian
- Tải file về máy

### Lưu ý bảo mật:
- Logs không thể xóa hoặc sửa
- Mọi hành động của Admin đều được ghi lại
- Dữ liệu được mã hóa và đồng bộ server dự phòng

---

## 2.8. Trang Giám sát - Phiên hoạt động

**Đường dẫn:** `/admin/GiamSat/Phien`

**Mục đích:** Theo dõi các phiên đăng nhập đang hoạt động của người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Giám sát"** → **"Phiên"**
- Hoặc truy cập trực tiếp `/admin/GiamSat/Phien`

**Bước 2:** Xem danh sách phiên
- Bảng hiển thị:
  - **Người dùng**: Email
  - **Loại thiết bị**: Desktop, Mobile, Tablet
  - **Trình duyệt**: Chrome, Firefox...
  - **Địa chỉ IP**
  - **Bắt đầu**: Thời gian đăng nhập
  - **Hoạt động cuối**: Thời gian tương tác gần nhất
  - **Trạng thái**: Online, Idle, Offline

**Bước 3:** Lọc phiên
- Theo trạng thái: Tất cả, Online, Offline
- Theo người dùng

**Bước 4:** Buộc đăng xuất
- Click icon **"Đăng xuất"** trên phiên
- Người dùng sẽ bị đăng xuất ngay lập tức
- Ghi log hành động

**Bước 5:** Xem chi tiết phiên
- Click vào dòng phiên
- Popup hiển thị:
  - User Agent đầy đủ
  - Location (nếu có)
  - Refresh token đang dùng

---

## 2.9. Trang Giám sát - Import

**Đường dẫn:** `/admin/GiamSat/Import`

**Mục đích:** Theo dõi các lần import dữ liệu từ file CSV của người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Giám sát"** → **"Import"**
- Hoặc truy cập trực tiếp `/admin/GiamSat/Import`

**Bước 2:** Xem bảng Import (BangImport)
- Danh sách các lần import:
  - **Người dùng**: Ai import
  - **Thời gian**: Khi nào
  - **Số dòng**: Bao nhiêu dòng trong file
  - **Số giao dịch tạo**: Bao nhiêu giao dịch được tạo
  - **Trạng thái**: Thành công / Thất bại / Đang xử lý

**Bước 3:** Xem chi tiết import
- Click vào dòng import
- Popup hiển thị:
  - Danh sách giao dịch đã tạo
  - Các dòng bị lỗi (nếu có)
  - Nguyên nhân lỗi

**Bước 4:** Xử lý import lỗi
- Nếu import thất bại:
  - Xem nguyên nhân
  - Yêu cầu người dùng import lại
  - Hoặc sửa file và import lại

---

## 2.10. Trang Cài đặt - Sao lưu

**Đường dẫn:** `/admin/CaiDat/SaoLuu`

**Mục đích:** Quản lý sao lưu và phục hồi dữ liệu hệ thống.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Cài đặt"** → **"Sao lưu"**
- Hoặc truy cập trực tiếp `/admin/CaiDat/SaoLuu`

**Bước 2:** Xem thông tin header
- Tiêu đề: "Backup & Restore"
- Trạng thái: "Snapshot Mode: Active"
- Mã hóa: "AES-256"

**Bước 3:** Xem thống kê sao lưu
- Tổng bản sao lưu
- Dung lượng backup
- Lần cuối Restore
- AWS S3 Status

**Bước 4:** Xem danh sách bản sao lưu (BangSaoLuu)
- Bảng hiển thị:
  - **Tên bản**: Tên/mã backup
  - **Ngày tạo**: Khi nào
  - **Dung lượng**: Kích thước file
  - **Loại**: Full backup / Incremental
  - **Trạng thái**: Thành công / Thất bại
  - **Hành động**: Tải về / Restore

**Bước 5:** Tạo bản sao lưu mới
- Click nút **"Tạo backup mới"**
- Chọn loại:
  - **Full backup**: Toàn bộ dữ liệu
  - **Incremental**: Chỉ dữ liệu thay đổi
- Đợi quá trình hoàn thành

**Bước 6:** Tải bản sao lưu
- Click icon **"Tải về"** trên bản backup
- File SQL nén được tải về máy

**Bước 7:** Phục hồi dữ liệu
- Click icon **"Restore"** trên bản backup
- **Cảnh báo nghiêm trọng**: Restore sẽ ghi đè dữ liệu hiện tại
- Xác nhận nhiều lần trước khi thực hiện
- Đợi quá trình restore hoàn thành

### Lưu ý:
- Backup được mã hóa AES-256
- Đồng bộ sang 2 region: Singapore và USA
- Chỉ Admin có key mới xem/tải được backup

---

## 2.11. Trang Cài đặt - Tiền tệ

**Đường dẫn:** `/admin/CaiDat/TienTe`

**Mục đích:** Cấu hình đơn vị tiền tệ và tỷ giá cho hệ thống.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Cài đặt"** → **"Tiền tệ"**
- Hoặc truy cập trực tiếp `/admin/CaiDat/TienTe`

**Bước 2:** Xem danh sách tiền tệ (BangTienTe)
- Bảng hiển thị:
  - **Mã tiền**: VND, USD, EUR...
  - **Tên tiền**: Vietnamese Dong, US Dollar...
  - **Tỷ giá**: Với đồng VND
  - **Trạng thái**: Hoạt động / Không hoạt động

**Bước 3:** Thêm tiền tệ mới
- Click nút **"Thêm tiền tệ"**
- Điền thông tin:
  - Mã tiền (3 chữ cái)
  - Tên đầy đủ
  - Tỷ giá với VND
- Click **"Lưu"**

**Bước 4:** Cập nhật tỷ giá
- Click icon sửa trên dòng tiền tệ
- Cập nhật tỷ giá mới
- Click **"Lưu"**

**Bước 5:** Bật/tắt tiền tệ
- Toggle switch để bật/tắt tiền tệ
- Tiền tệ không hoạt động sẽ không hiển thị cho người dùng

---

## 2.12. Trang Cài đặt - Thông báo

**Đường dẫn:** `/admin/CaiDat/ThongBao`

**Mục đích:** Cấu hình thông báo hệ thống và broadcast cho người dùng.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Cài đặt"** → **"Thông báo"**
- Hoặc truy cập trực tiếp `/admin/CaiDat/ThongBao`

**Bước 2:** Gửi thông báo Broadcast
- Sử dụng FormBroadcast
- Điền nội dung thông báo
- Chọn đối tượng nhận:
  - Tất cả người dùng
  - Người dùng cụ thể
  - Theo vai trò
- Click **"Gửi thông báo"**

**Bước 3:** Xem lịch sử thông báo
- Danh sách các thông báo đã gửi
- Thời gian gửi
- Số người nhận
- Trạng thái: Đã gửi / Đang gửi / Lỗi

**Bước 4:** Cấu hình thông báo tự động
- Bật/tắt các loại thông báo:
  - Nhắc nhở ngân sách
  - Cảnh báo chi tiêu lớn
  - Thông báo mục tiêu
  - Báo cáo tuần/tháng

---

## 2.13. Trang Cài đặt - Tài nguyên

**Đường dẫn:** `/admin/CaiDat/TaiNguyen`

**Mục đích:** Quản lý tài nguyên hệ thống như lưu trữ, giới hạn upload.

### Quy trình thao tác:

**Bước 1:** Truy cập trang
- Từ sidebar Admin, click **"Cài đặt"** → **"Tài nguyên"**
- Hoặc truy cập trực tiếp `/admin/CaiDat/TaiNguyen`

**Bước 2:** Xem thông tin lưu trữ
- Dung lượng đã sử dụng
- Dung lượng tối đa
- Số lượng file đang lưu trữ

**Bước 3:** Xem cấu hình upload
- Kích thước file tối đa
- Định dạng cho phép
- Thư mục lưu trữ

**Bước 4:** Cấu hình giới hạn
- Giới hạn upload cho mỗi người dùng
- Giới hạn tổng dung lượng
- Thời gian lưu file tạm

**Bước 5:** Dọn dẹp tài nguyên
- Xóa file rác
- Xóa ảnh hóa đơn cũ
- Nén database

---

# PHỤ LỤC

## A. Tổ hợp phím tắt

| Phím | Chức năng |
|------|----------|
| `Ctrl + K` | Tìm kiếm nhanh |
| `Esc` | Đóng popup/dialog |
| `Enter` | Xác nhận |
| `Ctrl + S` | Lưu (trong form) |

## B. Mã trạng thái giao dịch

| Mã | Trạng thái | Mô tả |
|----|-----------|-------|
| `00` | Thành công | Giao dịch đã được xử lý |
| `01` | Đang chờ | Chờ xác nhận |
| `02` | Thất bại | Giao dịch bị lỗi |
| `03` | Đã hủy | Người dùng hủy giao dịch |

## C. Danh sách vai trò

| Vai trò | Quyền hạn |
|---------|-----------|
| `User` | Người dùng thông thường |
| `Admin` | Quản trị viên hệ thống |

## D. Các loại tài khoản

| Loại | Mô tả |
|------|-------|
| `vi` | Ví điện tử (Momo, ZaloPay...) |
| `ngan-hang` | Tài khoản ngân hàng |
| `tien-mat` | Tiền mặt |
| `dau-tu` | Tài khoản đầu tư |

## E. Liên hệ hỗ trợ

- **Email hỗ trợ**: support@financeai.vn
- **Hotline**: 1900-xxxx
- **Giờ hỗ trợ**: 8:00 - 22:00 (Thứ 2 - Thứ 7)

---

**Phiên bản tài liệu:** 1.0
**Ngày cập nhật:** $(Get-Date -Format "dd/MM/yyyy")
**Người tạo:** Hệ thống tự động từ mã nguồn
