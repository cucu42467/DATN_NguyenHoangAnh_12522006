# MÔ TẢ CHI TIẾT VÀ PHÂN TÍCH THIẾT KẾ GIAO DIỆN HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN

## a) Giao diện phân hệ người dùng

### 1. Giao diện trang Đăng nhập
**1. Mục đích giao diện**
Giao diện đăng nhập là điểm chạm đầu tiên của người dùng với hệ thống, được thiết kế nhằm xác thực danh tính và bảo vệ dữ liệu cá nhân. Trang này đảm bảo chỉ những người dùng hợp lệ mới có thể truy cập vào các dữ liệu tài chính nhạy cảm.

**2. Thành phần chính trên giao diện**
- **Form xác thực**: Trường nhập Email (kèm icon Mail), trường nhập Mật khẩu (kèm icon Lock và nút ẩn/hiện).
- **Điều hướng phụ**: Liên kết "Quên mật khẩu?" và "Chưa có tài khoản? Tạo mới".
- **Social Auth**: Nút "Đăng nhập với Google" với hiệu ứng hover và icon SVG chuẩn.
- **Phản hồi hệ thống**: Các thẻ Alert (Cảnh báo) khi sai thông tin hoặc phiên làm việc hết hạn.
- **Trạng thái xử lý**: Loading Spinner trên nút đăng nhập khi đang xác thực.

**3. Bố cục hiển thị**
Sử dụng bố cục **Centered Layout** (Căn giữa) để tối đa sự tập trung. Form được bao bọc trong một thẻ Card trắng tinh tế, nổi bật trên nền Gradient nhẹ nhàng. Sử dụng hệ thống lưới Flexbox để căn chỉnh các thành phần theo chiều dọc một cách cân đối.

**4. Trải nghiệm người dùng (UX/UI)**
Thiết kế theo hướng hiện đại, sử dụng font chữ Inter hỗ trợ đọc tốt. Hệ thống phản hồi tức thì thông qua màu sắc (Đỏ cho lỗi, Xanh cho thành công). Thao tác nhập liệu mượt mà, hỗ trợ phím tắt Enter để submit nhanh.

**5. Phân tích thiết kế**
- **Visual Identity**: Sử dụng hiệu ứng bóng đổ (Box Shadow) mềm mại và bo góc lớn (2xl - 16px) tạo cảm giác thân thiện.
- **Màu sắc**: Sử dụng màu Indigo-600 làm chủ đạo cho nút bấm để tạo sự tin cậy và chuyên nghiệp.
- **Khả năng đáp ứng**: Tự động điều chỉnh độ rộng của Card từ 400px trên Desktop xuống full-width trên Mobile để đảm bảo vùng bấm (Tap target) đủ lớn.

---

### 2. Giao diện trang Đăng ký
**1. Mục đích giao diện**
Trang Đăng ký đóng vai trò mở rộng tệp người dùng, cho phép cá nhân thiết lập tài khoản mới. Mục tiêu chính là thu thập thông tin cơ bản một cách nhanh chóng và khuyến khích người dùng hoàn tất quy trình thiết lập ban đầu.

**2. Thành phần chính trên giao diện**
- **Thông tin cơ bản**: Các trường nhập Họ tên, Email, Mật khẩu và Nhập lại mật khẩu.
- **Chính sách**: Liên kết đến Điều khoản dịch vụ và Chính sách bảo mật.
- **Chuyển đổi**: Nút "Tạo tài khoản" và liên kết "Đã có tài khoản? Đăng nhập ngay".
- **Validate**: Các thông báo kiểm tra độ mạnh mật khẩu và định dạng email.

**3. Bố cục hiển thị**
Bố cục dạng thẻ (Card) tập trung. Các trường nhập liệu được phân bổ khoảng cách (spacing) hợp lý theo quy tắc 8px để tránh cảm giác chật chội. Sử dụng các Label nổi (Floating labels) hoặc Label tĩnh phía trên input để rõ ràng.

**4. Trải nghiệm người dùng (UX/UI)**
Trải nghiệm liền mạch với tính năng tự động focus vào trường đầu tiên. Các lỗi nhập liệu được hiển thị ngay dưới từng trường (Inline Error) giúp người dùng sửa lỗi mà không cần tốn công suy luận.

**5. Phân tích thiết kế**
- **Tương tác**: Sử dụng hiệu ứng chuyển cảnh (Transitions) khi focus vào input bằng cách thay đổi màu Border và thêm Ring sáng.
- **Hệ thống màu**: Sử dụng màu sắc trung tính cho nền để làm nổi bật các trường nhập liệu và nút kêu gọi hành động (CTA).

---

### 3. Giao diện trang Quên mật khẩu
**1. Mục đích giao diện**
Cung cấp quy trình khôi phục tài khoản tự động khi người dùng không nhớ thông tin đăng nhập, giúp giảm thiểu sự phiền hà và hỗ trợ người dùng quay lại hệ thống nhanh nhất có thể.

**2. Thành phần chính trên giao diện**
- **Input phục hồi**: Trường nhập Email đã đăng ký.
- **Hướng dẫn**: Đoạn văn bản ngắn giải thích quy trình nhận mã khôi phục qua email.
- **Hành động**: Nút "Gửi liên kết đặt lại mật khẩu".

**3. Bố cục hiển thị**
Tối giản hóa tối đa các thành phần gây xao nhãng. Sử dụng bố cục đơn cột, tập trung vào một hành động duy nhất là nhập email và gửi đi.

**4. Trải nghiệm người dùng (UX/UI)**
Quy trình rõ ràng với thông báo trạng thái gửi email được thiết kế nổi bật. Nút quay lại trang đăng nhập giúp người dùng dễ dàng đổi ý nếu nhớ lại mật khẩu.

**5. Phân tích thiết kế**
- **Tâm lý học thiết kế**: Sử dụng khoảng trắng (White space) rộng rãi để giảm căng thẳng cho người dùng khi họ đang gặp rắc rối với mật khẩu.
- **Phản hồi**: Sử dụng Alert màu xanh lá (Success) với nội dung rõ ràng khi email được gửi đi thành công.

---

### 4. Giao diện trang Thông báo
**1. Mục đích giao diện**
Trung tâm quản lý các sự kiện quan trọng, giúp người dùng không bỏ lỡ các biến động số dư, cảnh báo chi tiêu từ AI hay các thay đổi về bảo mật tài khoản.

**2. Thành phần chính trên giao diện**
- **Header Thông báo**: Tiêu đề trang và nút "Đánh dấu tất cả là đã đọc".
- **Danh sách Item**: Mỗi thông báo gồm Icon phân loại, nội dung chi tiết, thời gian và trạng thái (đã đọc/chưa đọc).
- **Bộ lọc**: Lọc theo loại (Cảnh báo, Gợi ý, Hệ thống).
- **Empty State**: Hình ảnh minh họa khi không có thông báo nào.

**3. Bố cục hiển thị**
Áp dụng bố cục **List View** (Danh sách). Sidebar bên trái giữ vai trò điều hướng chính, trong khi vùng nội dung bên phải hiển thị danh sách thông báo cuộn theo chiều dọc (Scrollable list).

**4. Trải nghiệm người dùng (UX/UI)**
Trực quan hóa mức độ quan trọng bằng màu sắc của Icon (Đỏ cho cảnh báo khẩn, Vàng cho nhắc nhở). Hỗ trợ thao tác xóa nhanh hoặc chuyển trạng thái chỉ bằng một click.

**5. Phân tích thiết kế**
- **Visual Hierarchy**: Tiêu đề thông báo sử dụng Font-weight: Bold để nổi bật hơn phần nội dung mô tả.
- **Micro-interaction**: Hiệu ứng highlight nhẹ khi di chuột qua từng mục thông báo.

---

### 5. Giao diện Trang chủ (Dashboard)
**1. Mục đích giao diện**
Cung cấp cái nhìn toàn cảnh về "sức khỏe tài chính" của người dùng trong thời gian thực. Đây là trung tâm dữ liệu giúp người dùng đưa ra quyết định chi tiêu dựa trên các con số cụ thể.

**2. Thành phần chính trên giao diện**
- **Thẻ Tổng hợp**: Hiển thị Tổng thu, Tổng chi, Số dư thuần và Tiết kiệm bằng các thẻ lớn với màu sắc phân biệt.
- **Biểu đồ Dòng tiền**: Biểu đồ cột/đường (ApexCharts) hiển thị xu hướng thu chi theo các tháng.
- **Widget AI**: Các thẻ gợi ý thông minh từ Gemini về thói quen chi tiêu.
- **Recent Transactions**: Bảng tóm tắt 5 giao dịch gần đây nhất.
- **Budget Progress**: Các thanh tiến độ cho thấy mức độ sử dụng ngân sách hiện tại.

**3. Bố cục hiển thị**
Sử dụng phong cách thiết kế **Bento Box Layout** hiện đại. Các Widget được sắp xếp trong các khối có kích thước khác nhau nhưng thống nhất về tỷ lệ, giúp phân cấp thông tin từ quan trọng nhất đến chi tiết.

**4. Trải nghiệm người dùng (UX/UI)**
Trải nghiệm sống động với các hiệu ứng Animation khi load trang (Framer Motion). Dữ liệu được trình bày khoa học, giảm tải nhận thức (Cognitive load) bằng cách sử dụng các biểu đồ thay vì chỉ có con số khô khan.

**5. Phân tích thiết kế**
- **Color Theory**: Sử dụng bảng màu HSL với các sắc thái dịu mắt. Xanh Emerald (#10b981) cho thu nhập và Rose (#f43f5e) cho chi tiêu.
- **Typography**: Sử dụng font Aeonik Pro cho các con số tiền tệ để tạo cảm giác sang trọng và chính xác.

---

### 6. Giao diện trang Lịch sử giao dịch
**1. Mục đích giao diện**
Là cuốn sổ cái kỹ thuật số, nơi người dùng có thể tra cứu, kiểm tra và quản lý mọi dòng tiền đã phát sinh. Hỗ trợ việc đối soát và điều chỉnh các sai sót trong quá trình nhập liệu.

**2. Thành phần chính trên giao diện**
- **Toolbar**: Thanh tìm kiếm theo ghi chú, bộ chọn khoảng thời gian (Date Range Picker), bộ lọc danh mục.
- **Data Table**: Danh sách chi tiết với các cột: Ngày, Danh mục, Tài khoản, Ghi chú, Số tiền.
- **Hành động**: Nút Edit/Delete cho từng bản ghi.
- **Thống kê nhanh**: Tổng thu/chi của kết quả đang lọc.

**3. Bố cục hiển thị**
Bố cục bảng dữ liệu (Data-heavy layout) nhưng được tối ưu hóa cho di động bằng cách chuyển đổi sang dạng thẻ (Cards) khi màn hình hẹp. Header của bảng được cố định (Sticky) để dễ dàng theo dõi khi cuộn.

**4. Trải nghiệm người dùng (UX/UI)**
Tốc độ là ưu tiên hàng đầu. Tính năng lọc "Real-time" giúp kết quả thay đổi ngay khi người dùng chọn tiêu chí. Sử dụng màu sắc chữ (Xanh/Đỏ) cho số tiền để người dùng nhận diện loại giao dịch ngay lập tức.

**5. Phân tích thiết kế**
- **Interactivity**: Hỗ trợ phân trang (Pagination) để đảm bảo hiệu năng khi dữ liệu lên tới hàng ngàn bản ghi.
- **Visual Cues**: Mỗi danh mục đi kèm với một Icon tròn có màu nền đặc trưng giúp quét mắt tìm kiếm nhanh hơn.

---

### 7. Giao diện trang Nhập dữ liệu bằng AI
**1. Mục đích giao diện**
Đơn giản hóa việc ghi chép tài chính bằng cách sử dụng trí tuệ nhân tạo. Người dùng không cần chọn từng trường thủ công mà chỉ cần mô tả bằng ngôn ngữ tự nhiên.

**2. Thành phần chính trên giao diện**
- **AI Input**: Vùng nhập văn bản lớn với gợi ý "Ví dụ: Ăn sáng 50k bằng ví tiền mặt".
- **Processing State**: Hiệu ứng sóng não hoặc text chạy khi AI đang phân tích.
- **Result Preview**: Các thẻ hiển thị thông tin AI đã bóc tách được (Số tiền, Loại, Danh mục, Tài khoản).
- **Confirm Actions**: Nút "Lưu ngay" hoặc "Chỉnh sửa lại".

**3. Bố cục hiển thị**
Sử dụng thiết kế **Focused Card**. Một thẻ lớn đặt giữa màn hình, tập trung vào ô nhập liệu AI. Kết quả phân tích hiện ra ngay bên dưới theo dạng danh sách các nhãn (tags).

**4. Trải nghiệm người dùng (UX/UI)**
Tạo cảm giác "thông minh" và "kỳ diệu". Giảm thiểu số lần click từ 5-7 lần (nhập thủ công) xuống còn 1 lần nhấn phím. Phản hồi của AI mang tính tương tác cao.

**5. Phân tích thiết kế**
- **Design Trend**: Sử dụng hiệu ứng Gradient chuyển động (Animated Gradient) ở viền ô nhập liệu để biểu thị tính năng AI đang sẵn sàng.
- **UX Writing**: Sử dụng các câu gợi ý thân thiện giúp người dùng biết cách ra lệnh cho AI hiệu quả nhất.

---

### 8. Giao diện trang Tài khoản
**1. Mục đích giao diện**
Quản lý các "nguồn tiền" của người dùng. Trang này giúp theo dõi sự phân bổ tài sản giữa tiền mặt, tài khoản ngân hàng, ví điện tử và các loại tài sản khác.

**2. Thành phần chính trên giao diện**
- **Thẻ Tổng tài sản**: Hiển thị tổng số dư quy đổi từ tất cả tài khoản.
- **Account Cards**: Mỗi thẻ đại diện một tài khoản với tên, số dư, loại (Bank/E-wallet/Cash) và icon đại diện.
- **Form Tài khoản**: Modal thêm/sửa tài khoản với các trường: Tên, Số dư đầu, Loại, Màu sắc nhận diện.

**3. Bố cục hiển thị**
Sử dụng bố cục lưới (**Grid Layout**). Các thẻ tài khoản được thiết kế giống như những chiếc thẻ ngân hàng vật lý, sắp xếp đều nhau tạo sự ngăn nắp và trực quan.

**4. Trải nghiệm người dùng (UX/UI)**
Dễ dàng phân biệt các tài khoản thông qua màu sắc và icon. Thao tác xem chi tiết số dư hoặc lịch sử giao dịch của riêng một tài khoản được thực hiện nhanh chóng thông qua việc click trực tiếp vào thẻ.

**5. Phân tích thiết kế**
- **Visual Style**: Sử dụng hiệu ứng đổ bóng mờ và viền nhẹ (Border 1px) theo phong cách thiết kế phẳng hiện đại.
- **Empty State**: Khi chưa có tài khoản, hiển thị hình ảnh minh họa dễ thương cùng nút "Tạo tài khoản đầu tiên" nổi bật.

---

### 9. Giao diện trang Ngân sách
**1. Mục đích giao diện**
Thiết lập kỷ luật tài chính. Trang này giúp người dùng giới hạn chi tiêu trong mức cho phép, từ đó đạt được các mục tiêu tiết kiệm đã đề ra.

**2. Thành phần chính trên giao diện**
- **Budget Overview**: Biểu đồ vòng thể hiện tỷ lệ ngân sách đã dùng so với tổng hạn mức của tháng.
- **Budget List**: Danh sách các danh mục có đặt hạn mức. Mỗi mục có: Tên danh mục, Hạn mức, Số tiền đã tiêu, Số tiền còn lại.
- **Progress Bars**: Thanh tiến độ hiển thị phần trăm đã tiêu thụ.

**3. Bố cục hiển thị**
Kết hợp giữa biểu đồ tổng quát ở trên và danh sách chi tiết ở dưới. Các thanh tiến độ chiếm vị trí trung tâm trong mỗi hàng của danh sách để thu hút sự chú ý.

**4. Trải nghiệm người dùng (UX/UI)**
Sử dụng mã màu giao thông để cảnh báo: Xanh (Dưới 50%), Vàng (50-80%), Cam (80-100%) và Đỏ (Vượt mức). Điều này giúp người dùng cảm nhận được áp lực tài chính một cách trực quan.

**5. Phân tích thiết kế**
- **Information Architecture**: Ưu tiên hiển thị số tiền "Còn lại" hơn là số tiền "Đã tiêu" để người dùng biết mình còn bao nhiêu dư địa chi tiêu.
- **Responsive**: Trên di động, các thanh tiến độ được làm dày hơn để dễ quan sát.

---

### 10. Giao diện trang Danh mục
**1. Mục đích giao diện**
Cá nhân hóa hệ thống phân loại. Người dùng có thể tự tạo các "nhãn" thu chi phù hợp với lối sống riêng (ví dụ: "Chi phí nuôi thú cưng", "Đầu tư Crypto").

**2. Thành phần chính trên giao diện**
- **Toggle Loại**: Chuyển đổi giữa danh sách danh mục Thu và Chi.
- **Category Grid**: Danh sách các icon tròn kèm tên danh mục.
- **Icon Picker**: Kho biểu tượng đa dạng để người dùng lựa chọn khi tạo mới.
- **Color Palette**: Bộ chọn màu cho từng danh mục.

**3. Bố cục hiển thị**
Sử dụng bố cục dạng lưới các biểu tượng (**Icon Grid**). Thiết kế này giúp người dùng dễ dàng bao quát toàn bộ hệ thống phân loại của mình trên một màn hình duy nhất.

**4. Trải nghiệm người dùng (UX/UI)**
Tính tương tác cao trong việc chọn Icon và Màu sắc. Thao tác kéo thả (nếu có) hoặc chỉnh sửa trực tiếp giúp người dùng cảm thấy mình thực sự làm chủ hệ thống dữ liệu.

**5. Phân tích thiết kế**
- **Visual Consistency**: Tất cả các Icon được thiết kế cùng một kích thước và độ dày đường nét để đảm bảo tính thẩm mỹ đồng nhất.
- **Interaction**: Khi nhấn vào một danh mục, Modal chỉnh sửa hiện ra với hiệu ứng phóng to (Zoom-in) nhẹ nhàng.

---

### 11. Giao diện trang Mục tiêu
**1. Mục đích giao diện**
Gắn kết việc tiết kiệm với những mong muốn cụ thể trong tương lai. Trang này tạo động lực cho người dùng bằng cách biến các con số thành những cột mốc thực tế.

**2. Thành phần chính trên giao diện**
- **Goal Cards**: Thẻ mục tiêu với hình ảnh minh họa/icon, tên mục tiêu, số tiền cần đạt, số tiền hiện có và ngày dự kiến hoàn thành.
- **Circular Progress**: Biểu đồ tròn hiển thị phần trăm tiến độ ngay trong thẻ.
- **Transaction History**: Danh sách các lần nạp tiền vào mục tiêu này.

**3. Bố cục hiển thị**
Các thẻ mục tiêu lớn, trình bày theo dạng lưới. Mỗi thẻ là một khối thông tin độc lập, đầy đủ các chỉ số giúp người dùng theo dõi mà không cần click vào xem chi tiết.

**4. Trải nghiệm người dùng (UX/UI)**
Tạo cảm giác thành tựu. Khi một mục tiêu hoàn thành, hệ thống có thể hiển thị hiệu ứng pháo hoa hoặc thông báo chúc mừng để khích lệ tinh thần người dùng.

**5. Phân tích thiết kế**
- **Gamification**: Áp dụng các yếu tố trò chơi hóa như thanh tiến độ và các biểu tượng phần thưởng để việc tiết kiệm không còn nhàm chán.
- **Layout**: Sử dụng Aspect-ratio cố định cho các thẻ để đảm bảo giao diện cân đối khi có nhiều mục tiêu khác nhau.

---

### 12. Giao diện trang Biểu đồ chi tiêu
**1. Mục đích giao diện**
Chẩn đoán các "lỗ hổng" tài chính thông qua phân tích dữ liệu lịch sử. Đây là công cụ quan trọng để người dùng nhìn nhận lại thói quen tiêu dùng của mình.

**2. Thành phần chính trên giao diện**
- **Pie/Donut Chart**: Phân tích tỷ trọng chi tiêu giữa các danh mục (ví dụ: Ăn uống chiếm 40% tổng chi).
- **Line/Bar Chart**: So sánh biến động thu chi giữa tháng này với tháng trước hoặc các tháng trong năm.
- **Top Spending List**: Danh sách 5 danh mục tiêu tốn nhiều tiền nhất.
- **Insight Cards**: Các nhận xét tự động như "Tháng này bạn chi cho giải trí nhiều hơn 20% so với tháng trước".

**3. Bố cục hiển thị**
Bố cục tập trung vào biểu đồ (**Chart-centric layout**). Sử dụng nhiều khoảng trắng xung quanh biểu đồ để dữ liệu không bị rối. Các bảng số liệu bổ trợ được đặt bên cạnh hoặc bên dưới biểu đồ chính.

**4. Trải nghiệm người dùng (UX/UI)**
Tương tác chạm (Touch interaction) cực tốt trên di động. Người dùng có thể nhấn vào từng phần của biểu đồ tròn để xem số tiền chi tiết của danh mục đó.

**5. Phân tích thiết kế**
- **Data Visualization**: Sử dụng thư viện ApexCharts hoặc Recharts để đảm bảo biểu đồ mượt mà, có hiệu ứng vẽ (Drawing animation) khi load.
- **Color Palette**: Sử dụng các màu sắc có độ tương phản cao cho các phần khác nhau của biểu đồ để dễ phân biệt.

---

### 13. Giao diện trang Trung tâm AI
**1. Mục đích giao diện**
Cung cấp trải nghiệm tư vấn tài chính 1-1. Thay vì tự đọc biểu đồ, người dùng có thể hỏi AI để nhận được câu trả lời trực tiếp về tình trạng tài chính của mình.

**2. Thành phần chính trên giao diện**
- **Chat Interface**: Luồng tin nhắn giữa người dùng và AI.
- **Action Chips**: Các nút bấm nhanh như "Phân tích tháng này", "Làm sao để tiết kiệm?", "Dự báo tháng sau".
- **AI Identity**: Icon trợ lý AI với trạng thái đang gõ (Typing indicator).
- **Embedded Widgets**: AI có thể phản hồi bằng các biểu đồ mini ngay trong khung chat.

**3. Bố cục hiển thị**
Bố cục dạng hội thoại (**Chat-first layout**). Khung chat chiếm toàn bộ diện tích nội dung chính, thanh nhập liệu được thiết kế nổi bật phía dưới với icon gửi đi và icon micro (nếu có).

**4. Trải nghiệm người dùng (UX/UI)**
Tạo sự gần gũi và tin cậy. Cách AI phản hồi theo từng dòng (Streaming) giúp người dùng có cảm giác đang đối thoại với một chuyên gia thực thụ.

**5. Phân tích thiết kế**
- **Visual Cues**: Tin nhắn của người dùng và AI có màu nền khác nhau để phân biệt rõ luồng hội thoại.
- **Responsive**: Khung chat tự động điều chỉnh độ cao để vừa vặn với bàn phím ảo trên điện thoại.

---

## b) Giao diện phân hệ quản trị

### 1. Giao diện Trang chủ (Admin Dashboard)
**1. Mục đích giao diện**
Phòng điều hành trung tâm của hệ thống. Giúp Admin nắm bắt nhanh các chỉ số vận hành quan trọng nhất để đảm bảo hệ thống hoạt động ổn định và phát triển đúng hướng.

**2. Thành phần chính trên giao diện**
- **KPI Metrics**: Các con số tổng quát về Người dùng mới, Tổng giao dịch, Doanh thu (nếu có), Tỷ lệ lỗi hệ thống.
- **Growth Chart**: Biểu đồ đường hiển thị tốc độ tăng trưởng người dùng theo tuần/tháng.
- **System Health**: Các biểu đồ Gauge hiển thị tải của CPU, dung lượng RAM, trạng thái Database.
- **Recent Logs**: Danh sách các sự kiện hệ thống vừa xảy ra.

**3. Bố cục hiển thị**
Sử dụng bố cục Dashboard đa cột chuyên nghiệp. Các thông tin quan trọng (KPIs) được đặt ở hàng trên cùng. Các biểu đồ lớn chiếm phần diện tích trung tâm.

**4. Trải nghiệm người dùng (UX/UI)**
Thiết kế tập trung vào tính hiệu quả. Sử dụng các màu sắc cảnh báo rõ rệt (Đỏ cho lỗi server, Xanh cho trạng thái ổn định). Bố cục ngăn nắp giúp Admin không bị rối trước lượng dữ liệu lớn.

**5. Phân tích thiết kế**
- **Visual Language**: Sử dụng các đường nét sắc sảo, icon tối giản (Lucide Icons) để tạo cảm giác chuyên nghiệp của một công cụ quản trị.
- **Density**: Mật độ thông tin cao hơn so với phân hệ người dùng để tối ưu hóa khả năng giám sát.

---

### 2. Giao diện trang Quản lý người dùng
**1. Mục đích giao diện**
Kiểm soát cộng đồng người dùng. Admin có quyền xem xét, hỗ trợ hoặc xử lý các tài khoản vi phạm chính sách hệ thống.

**2. Thành phần chính trên giao diện**
- **User Table**: Bảng danh sách với các trường: Avatar, Tên, Email, Ngày tham gia, Trạng thái (Active/Banned), Vai trò.
- **Search & Filter**: Tìm kiếm theo email, lọc theo trạng thái tài khoản.
- **Quick Actions**: Nút khóa/mở khóa tài khoản, nút thay đổi vai trò (User sang Admin).

**3. Bố cục hiển thị**
Bố cục bảng dữ liệu trải dài (**Full-width Data Table**). Cung cấp các công cụ lọc mạnh mẽ ở phía trên để Admin có thể tìm thấy một người dùng cụ thể trong hàng vạn bản ghi.

**4. Trải nghiệm người dùng (UX/UI)**
Thao tác nhanh và chính xác. Các hành động quan trọng (như Ban User) luôn có bước xác nhận để tránh sai sót. Sử dụng Badge màu sắc để hiển thị vai trò (Tím cho Admin, Xanh cho User).

**5. Phân tích thiết kế**
- **Data Integrity**: Đảm bảo các thông tin nhạy cảm được che giấu bớt (nếu cần) và chỉ hiển thị khi cần thiết.
- **Pagination**: Hệ thống phân trang mượt mà giúp việc duyệt danh sách người dùng không bị chậm.

---

### 3. Giao diện trang Chi tiết người dùng
**1. Mục đích giao diện**
Cái nhìn 360 độ về một cá nhân. Giúp Admin hiểu rõ hành vi, lịch sử và các vấn đề mà một người dùng cụ thể đang gặp phải để hỗ trợ chính xác.

**2. Thành phần chính trên giao diện**
- **Profile Summary**: Thông tin cá nhân, thiết bị đăng nhập gần nhất, địa chỉ IP.
- **Activity Stats**: Tổng số giao dịch đã tạo, số lượng ngân sách/mục tiêu đang có.
- **Audit Logs**: Danh sách chi tiết các hành động người dùng đã thực hiện trên hệ thống.
- **Support Tools**: Nút gửi thông báo riêng, đặt lại mật khẩu thủ công.

**3. Bố cục hiển thị**
Sử dụng bố cục chia khối (Sectioned Layout). Mỗi nhóm thông tin (Hồ sơ, Hoạt động, Bảo mật) được đặt trong một Card riêng biệt giúp Admin dễ dàng tra cứu.

**4. Trải nghiệm người dùng (UX/UI)**
Thông tin được trình bày mạch lạc, có tính phân cấp. Việc sử dụng các biểu đồ nhỏ (mini-charts) để tóm tắt hoạt động giúp Admin đánh giá người dùng nhanh hơn.

**5. Phân tích thiết kế**
- **Visual Hierarchy**: Các nút hành động chính (Edit/Ban) được đặt ở vị trí dễ thấy (góc trên cùng bên phải).
- **Detail Orientation**: Cung cấp các thông tin kỹ thuật sâu (như User Agent) để phục vụ việc điều tra các sự cố bảo mật.

---

### 4. Giao diện trang Quản lý giao dịch (Toàn hệ thống)
**1. Mục đích giao diện**
Giám sát luồng tiền tổng thể. Giúp Admin phát hiện các xu hướng sử dụng hệ thống hoặc các hành vi giao dịch bất thường (ví dụ: spam giao dịch).

**2. Thành phần chính trên giao diện**
- **Global Transaction Feed**: Luồng giao dịch thời gian thực của toàn bộ hệ thống (đã ẩn danh tính chi tiết).
- **Advanced Search**: Lọc giao dịch theo số tiền lớn, theo danh mục phổ biến, theo khoảng thời gian.
- **Export Tool**: Chức năng xuất dữ liệu ra file Excel/CSV phục vụ báo cáo tài chính của dự án.

**3. Bố cục hiển thị**
Bố cục tập trung vào bảng dữ liệu chi tiết. Các bộ lọc được thiết kế theo dạng thanh Sidebar hoặc thanh công cụ nằm ngang phía trên để tối ưu diện tích hiển thị bảng.

**4. Trải nghiệm người dùng (UX/UI)**
Giao diện mạnh mẽ, hỗ trợ hiển thị lượng lớn dữ liệu mà vẫn đảm bảo tốc độ cuộn mượt mà. Các con số tổng hợp được cập nhật liên tục.

**5. Phân tích thiết kế**
- **Scalability**: Thiết kế bảng hỗ trợ hiển thị nhiều cột thông tin mà không bị vỡ giao diện trên các màn hình có độ phân giải khác nhau.
- **Performance**: Sử dụng kỹ thuật Virtual Scrolling (nếu cần) để hiển thị danh sách giao dịch dài vô tận.

---

### 5. Giao diện trang Quản lý danh mục (Hệ thống)
**1. Mục đích giao diện**
Thiết lập "bộ khung" dữ liệu. Admin quản lý các danh mục mặc định mà mọi người dùng mới khi tham gia hệ thống đều có sẵn (ví dụ: Ăn uống, Di chuyển).

**2. Thành phần chính trên giao diện**
- **Category Manager**: Danh sách các danh mục mặc định kèm icon và màu sắc.
- **Editor**: Form chỉnh sửa tên danh mục, thay đổi icon chuẩn cho hệ thống.
- **Order Management**: Sắp xếp thứ tự ưu tiên hiển thị của các danh mục.

**3. Bố cục hiển thị**
Bố cục danh sách hai cột. Bên trái là danh sách các danh mục hiện có, bên phải là khung xem trước (Preview) và chỉnh sửa thông tin.

**4. Trải nghiệm người dùng (UX/UI)**
Trực quan và dễ điều chỉnh. Việc Admin thay đổi ở đây sẽ áp dụng cho toàn bộ người dùng mới, do đó giao diện có các cảnh báo về tầm ảnh hưởng của hành động.

**5. Phân tích thiết kế**
- **Standardization**: Đảm bảo tất cả các Icon hệ thống đều tuân thủ một bộ tiêu chuẩn thiết kế duy nhất (ví dụ: cùng sử dụng Outline hoặc Solid).
- **Flexibility**: Cho phép thêm các danh mục mới theo xu hướng tiêu dùng thực tế của thị trường một cách nhanh chóng.
