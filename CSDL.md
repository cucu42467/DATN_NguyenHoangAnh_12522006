# CẤU TRÚC CƠ SỞ DỮ LIỆU
## Ứng Dụng Quản Lý Chi Tiêu Cá Nhân

---

## TỔNG QUAN

Hệ thống cơ sở dữ liệu bao gồm các bảng chính sau:

Cấu trúc & Mô tả các bảng cơ sở dữ liệu
Hệ thống Quản lý Chi tiêu Cá nhân

1. tbl_nguoidung
Mô tả: Lưu thông tin tài khoản người dùng của hệ thống.
CộtKiểuGhi chúNguoiDungIdint(11)PK, AUTO_INCREMENTHoTenvarchar(255)Họ tên đầy đủEmailvarchar(255)Email đăng nhập, UNIQUESoDienThoaivarchar(20)Số điện thoại liên hệMatKhauvarchar(255)Mật khẩu đã hash (bcrypt)AnhDaiDienvarchar(500)Đường dẫn ảnh đại diệnNgayTaodatetimeNgày tạo tài khoản, DEFAULT now()TrangThaitinyint(4)1=Hoạt động, 0=Bị khóa

2. tbl_vaitro
Mô tả: Danh sách vai trò phân quyền trong hệ thống (admin, user, moderator).
CộtKiểuGhi chúVaiTroIdint(11)PK, AUTO_INCREMENTTenVaiTrovarchar(100)Tên vai trò, UNIQUE

3. tbl_nguoidung_vaitro
Mô tả: Bảng trung gian gán vai trò cho người dùng. Một người dùng có thể có nhiều vai trò.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungVaiTroIdint(11)FK → tbl_vaitro

4. tbl_nguoidung_social
Mô tả: Lưu thông tin đăng nhập qua mạng xã hội (Google, Facebook...) liên kết với tài khoản nội bộ.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungProvidervarchar(50)Nhà cung cấp: GOOGLE, FACEBOOK...ProviderIdvarchar(255)ID định danh từ nhà cung cấpEmailSocialvarchar(255)Email từ tài khoản mạng xã hộiNgayLienKetdatetimeNgày liên kết tài khoản

5. tbl_caidat
Mô tả: Lưu cài đặt cá nhân cho từng người dùng: ngôn ngữ, tiền tệ, giao diện, thông báo...
CộtKiểuGhi chúCaiDatIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidung, UNIQUE (1 user - 1 cài đặt)NgonNguvarchar(10)Ngôn ngữ giao diện: 'vi', 'en'TienTevarchar(10)Đơn vị tiền tệ mặc định: 'VND', 'USD'CheDoToibit(1)1=Bật dark mode, 0=TắtDinhDangNgayvarchar(20)Định dạng ngày: 'dd/MM/yyyy', 'MM/dd/yyyy'NhanThongBaobit(1)1=Cho phép nhận thông báo, 0=Tắt

6. tbl_loai_taikhoan
Mô tả: Danh mục loại tài khoản tài chính (tiền mặt, ngân hàng, ví điện tử, thẻ tín dụng, tiết kiệm).
CộtKiểuGhi chúLoaiTaiKhoanIdint(11)PK, AUTO_INCREMENTTenLoaivarchar(100)Tên loại tài khoản, UNIQUE

7. tbl_taikhoan
Mô tả: Lưu các tài khoản tài chính của người dùng. Một người dùng có thể có nhiều tài khoản (ví tiền mặt, ngân hàng, MoMo...).
CộtKiểuGhi chúTaiKhoanIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungLoaiTaiKhoanIdint(11)FK → tbl_loai_taikhoanTenTaiKhoanvarchar(255)Tên hiển thị (VD: "TPBank", "Ví MoMo")SoDudecimal(18,2)Số dư hiện tạiSoDuBanDaudecimal(18,2)Số dư ban đầu khi tạo tài khoảnTienTevarchar(10)Loại tiền tệ của tài khoảnMauSacvarchar(50)Màu sắc hiển thị trên giao diệnIconvarchar(100)Icon đại diện cho tài khoảnNgayTaodatetimeNgày tạo tài khoảnTrangThaitinyint(4)1=Đang dùng, 0=Đã ẩn/xóa

8. tbl_loai_danhmuc
Mô tả: Phân loại danh mục giao dịch ở mức cao nhất: Thu nhập hoặc Chi tiêu.
CộtKiểuGhi chúLoaiDanhMucIdint(11)PK, AUTO_INCREMENTTenLoaivarchar(100)'Thu nhập' hoặc 'Chi tiêu', UNIQUE

9. tbl_danhmuc
Mô tả: Danh mục phân loại giao dịch (Ăn uống, Di chuyển, Lương...). Hỗ trợ danh mục cha-con và danh mục tùy chỉnh riêng cho từng người dùng.
CộtKiểuGhi chúDanhMucIdint(11)PK, AUTO_INCREMENTTenDanhMucvarchar(255)Tên danh mụcLoaiDanhMucIdint(11)FK → tbl_loai_danhmuc (Thu/Chi)DanhMucChaIdint(11)FK tự tham chiếu (danh mục con)NguoiDungIdint(11)FK → tbl_nguoidung (NULL = danh mục hệ thống)Iconvarchar(100)Icon hiển thịMauSacvarchar(50)Màu sắc hiển thịThuTuint(11)Thứ tự sắp xếpTrangThaitinyint(4)1=Hiển thị, 0=Ẩn

10. tbl_giaodich
Mô tả: Bảng trung tâm lưu toàn bộ giao dịch tài chính (thu, chi, chuyển khoản). Đây là bảng quan trọng nhất của hệ thống.
CộtKiểuGhi chúGiaoDichIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTaiKhoanIdint(11)FK → tbl_taikhoan (tài khoản nguồn)TaiKhoanDichIdint(11)FK → tbl_taikhoan (tài khoản đích, dùng khi chuyển tiền)DanhMucIdint(11)FK → tbl_danhmucLoaiGiaoDichtinyint(4)1=Thu, 2=Chi, 3=Chuyển khoảnSoTiendecimal(18,2)Số tiền giao dịchTienTevarchar(10)Loại tiền tệTyGiaQuyDoidecimal(18,6)Tỷ giá quy đổi sang VNDNgayGiaoDichdatetimeThời điểm thực hiện giao dịchMoTavarchar(500)Ghi chú mô tả giao dịchNguonDuLieutinyint(4)0=Nhập tay, 1=Import file, 2=Tự độngLaTuDongbit(1)1=Giao dịch định kỳ tự tạoDoTinCayfloatĐộ tin cậy AI phân loại (0-1)ImportIdint(11)FK → tbl_import_file (nếu từ import)NgayTaodatetimeNgày tạo bản ghi

11. tbl_chitiet_giaodich
Mô tả: Lưu chi tiết từng hạng mục trong một giao dịch (VD: 1 lần mua gồm nhiều món hàng khác nhau).
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTGiaoDichIdint(11)FK → tbl_giaodichDanhMucIdint(11)FK → tbl_danhmucSoTiendecimal(18,2)Số tiền của hạng mục nàyMoTavarchar(255)Mô tả chi tiết hạng mục

12. tbl_giaodich_dinhky
Mô tả: Lưu cấu hình các giao dịch lặp lại định kỳ (tiền thuê nhà hàng tháng, lương, phí Netflix...). Hệ thống tự tạo giao dịch theo chu kỳ.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTaiKhoanIdint(11)FK → tbl_taikhoanDanhMucIdint(11)FK → tbl_danhmucTenGiaoDichvarchar(255)Tên giao dịch định kỳLoaiGiaoDichtinyint(4)1=Thu, 2=ChiSoTiendecimal(18,2)Số tiền mỗi lầnChuKyvarchar(20)'daily', 'weekly', 'monthly', 'yearly'NgayBatDaudatetimeNgày bắt đầu hiệu lựcNgayKetThucdatetimeNgày kết thúc (NULL = vô thời hạn)LanTiepTheodatetimeLần thực hiện tiếp theoTrangThaitinyint(4)1=Đang hoạt động, 0=Đã dừng

13. tbl_tep_dinhkem
Mô tả: Lưu thông tin các file đính kèm (hóa đơn, biên lai) được upload lên hệ thống.
CộtKiểuGhi chúTepIdint(11)PK, AUTO_INCREMENTTenFilevarchar(255)Tên file gốcDuongDanvarchar(500)Đường dẫn lưu trữ trên serverLoaiFilevarchar(50)MIME type: 'image/jpeg', 'application/pdf'...KichThuocint(11)Kích thước file (bytes)NgayTaodatetimeNgày upload

14. tbl_giaodich_tep
Mô tả: Bảng trung gian liên kết giao dịch với file đính kèm. Một giao dịch có thể có nhiều file.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTGiaoDichIdint(11)FK → tbl_giaodichTepIdint(11)FK → tbl_tep_dinhkem

15. tbl_ngansach
Mô tả: Lưu hạn mức ngân sách theo danh mục và theo tháng. Theo dõi người dùng có chi tiêu vượt ngân sách không.
CộtKiểuGhi chúNganSachIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungDanhMucIdint(11)FK → tbl_danhmucSoTienToiDadecimal(18,2)Hạn mức chi tiêu tối đaThangint(11)Tháng áp dụng (1-12)Namint(11)Năm áp dụngSoTienDaChidecimal(18,2)Số tiền đã chi trong thángPhanTramDaDungfloat% đã dùng so với hạn mứcTrangThaitinyint(4)1=Đang áp dụng, 0=Vô hiệu

16. tbl_theodoi_ngansach
Mô tả: Lịch sử theo dõi biến động ngân sách theo thời gian. Dùng để vẽ biểu đồ tiến độ chi tiêu trong tháng.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNganSachIdint(11)FK → tbl_ngansachSoTienDaChidecimal(18,2)Số tiền đã chi tại thời điểm ghi nhậnPhanTramDaDungfloat% đã dùng tại thời điểm ghi nhậnNgayCapNhatdatetimeThời điểm ghi nhận

17. tbl_muctieu
Mô tả: Lưu các mục tiêu tiết kiệm tài chính của người dùng (mua laptop, du lịch, quỹ khẩn cấp...).
CộtKiểuGhi chúMucTieuIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTaiKhoanIdint(11)FK → tbl_taikhoan (tài khoản gắn mục tiêu)TenMucTieuvarchar(255)Tên mục tiêuSoTienMucTieudecimal(18,2)Số tiền cần đạtSoTienHienTaidecimal(18,2)Số tiền đã tích lũy đượcNgayBatDaudatetimeNgày bắt đầuNgayKetThucdatetimeDeadline hoàn thànhIconvarchar(100)Icon mục tiêuMauSacvarchar(50)Màu sắc hiển thịTrangThaitinyint(4)1=Đang thực hiện, 2=Hoàn thành, 0=Hủy

18. tbl_donggop_muctieu
Mô tả: Ghi lại từng lần nạp tiền/đóng góp vào một mục tiêu tiết kiệm.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTMucTieuIdint(11)FK → tbl_muctieuSoTiendecimal(18,2)Số tiền đóng góp lần nàyNgayDongGopdatetimeNgày thực hiện đóng gópGhiChuvarchar(255)Ghi chú lần đóng góp

19. tbl_nhacnho
Mô tả: Lưu các nhắc nhở tài chính do người dùng thiết lập (nhắc đóng tiền điện, trả nợ...).
CộtKiểuGhi chúNhacNhoIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTieuDevarchar(255)Tiêu đề nhắc nhởNoiDungvarchar(500)Nội dung chi tiếtNgayNhacdatetimeThời điểm gửi nhắc nhởLapLaitinyint(4)0=Không lặp, 1=Hàng ngày, 3=Hàng tháng, 4=Hàng tuầnTrangThaitinyint(4)1=Đang hoạt động, 0=Đã tắt

20. tbl_canhbao
Mô tả: Lưu các cảnh báo tự động do hệ thống tạo ra khi phát hiện bất thường (vượt ngân sách, số dư thấp, đến hạn giao dịch...).
CộtKiểuGhi chúCanhBaoIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungLoaiCanhBaotinyint(4)1=Vượt ngân sách, 2=Đến hạn, 3=Số dư thấpNoiDungvarchar(500)Nội dung cảnh báoNgayTaodatetimeThời điểm tạo cảnh báoDaDocbit(1)0=Chưa đọc, 1=Đã đọc

21. tbl_thongbao
Mô tả: Lưu thông báo hệ thống gửi đến người dùng (chào mừng, gợi ý AI, cảnh báo, nhắc giao dịch định kỳ...).
CộtKiểuGhi chúThongBaoIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTieuDevarchar(255)Tiêu đề thông báoNoiDungvarchar(1000)Nội dung chi tiếtLoaiThongBaotinyint(4)1=Hệ thống, 2=Gợi ý AI, 3=Nhắc nhở, 4=Cảnh báoNgayTaodatetimeThời điểm tạoDaDocbit(1)0=Chưa đọc, 1=Đã đọc

22. tbl_goiy_ai
Mô tả: Lưu các gợi ý, phân tích tài chính do AI tạo ra dựa trên hành vi chi tiêu của người dùng.
CộtKiểuGhi chúGoiYIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungLoaiGoiYtinyint(4)1=Tiết kiệm, 2=Cảnh báo chi tiêu, 3=Chúc mừngNoiDungvarchar(1000)Nội dung gợi ý từ AINgayTaodatetimeThời điểm AI tạo gợi ýDaDocbit(1)0=Chưa đọc, 1=Đã đọcTrangThaitinyint(4)1=Hiển thị, 0=Đã ẩn

23. tbl_dudoan
Mô tả: Lưu kết quả dự đoán thu nhập và chi tiêu cho tháng tiếp theo do AI tính toán dựa trên lịch sử.
CộtKiểuGhi chúDuDoanIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungThangint(11)Tháng dự đoánNamint(11)Năm dự đoánDuDoanChiTieudecimal(18,2)Số tiền chi tiêu dự đoánDuDoanThuNhapdecimal(18,2)Số tiền thu nhập dự đoánDoChinhXacfloatĐộ chính xác mô hình (0-1)NgayDuDoandatetimeThời điểm thực hiện dự đoán

24. tbl_phantich_chitieu
Mô tả: Lưu kết quả phân tích tổng hợp thu chi theo tháng: tổng thu, tổng chi, tỷ lệ tiết kiệm.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungThangint(11)Tháng phân tíchNamint(11)Năm phân tíchTongChidecimal(18,2)Tổng chi tiêu trong thángTongThudecimal(18,2)Tổng thu nhập trong thángTyLeTietKiemfloat% tiết kiệm = (Thu - Chi) / Thu × 100NgayTinhToandatetimeThời điểm tính toán

25. tbl_tonghop_thang
Mô tả: Bảng tổng hợp nhanh thu/chi/tiết kiệm theo tháng. Dùng để tăng tốc truy vấn báo cáo thay vì tính lại từ bảng giao dịch.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungThangint(11)Tháng tổng hợpNamint(11)Năm tổng hợpTongThudecimal(18,2)Tổng thu trong thángTongChidecimal(18,2)Tổng chi trong thángTietKiemdecimal(18,2)Tiết kiệm = TongThu - TongChiNgayCapNhatdatetimeLần cập nhật gần nhất

UNIQUE KEY (NguoiDungId, Thang, Nam)


26. tbl_tonghop_danhmuc
Mô tả: Tổng hợp số tiền chi/thu theo từng danh mục trong tháng. Dùng để vẽ biểu đồ tròn, biểu đồ cột phân tích chi tiêu.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungDanhMucIdint(11)FK → tbl_danhmucTongTiendecimal(18,2)Tổng tiền danh mục trong thángThangint(11)ThángNamint(11)NămNgayCapNhatdatetimeLần cập nhật gần nhất

27. tbl_import_file
Mô tả: Quản lý các lần import file sao kê ngân hàng (CSV). Theo dõi trạng thái xử lý và thống kê kết quả.
CộtKiểuGhi chúImportIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungTaiKhoanIdint(11)FK → tbl_taikhoan (tài khoản import vào)TenFilevarchar(255)Tên file uploadNgayImportdatetimeThời điểm uploadTongDongint(11)Tổng số dòng dữ liệu trong fileSoDongThanhCongint(11)Số dòng xử lý thành côngSoDongLoiint(11)Số dòng lỗi/không xử lý đượcTrangThaitinyint(4)0=Đang xử lý, 1=Hoàn thành, 2=Lỗi

28. tbl_import_chitiet
Mô tả: Lưu từng dòng dữ liệu trong file import. AI tự động đề xuất danh mục cho từng giao dịch dựa trên mô tả.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTGiaoDichIdint(11)FK → tbl_giaodich (sau khi xác nhận)ImportIdint(11)FK → tbl_import_fileNgayGiaoDichdatetimeNgày giao dịch từ fileMoTavarchar(500)Mô tả giao dịch gốc từ ngân hàngSoTiendecimal(18,2)Số tiền giao dịchDanhMucGoiYint(11)FK → tbl_danhmuc (AI đề xuất)DoTinCayfloatĐộ tin cậy của AI khi phân loại (0-1)TrangThaiXuLytinyint(4)0=Chờ, 1=Đã xác nhận, 2=Bỏ qua, 3=LỗiGhiChuLoivarchar(255)Lý do lỗi nếu không xử lý đượcCapNhatLucdatetimeLần cập nhật gần nhất

29. tbl_tu_khoa
Mô tả: Từ điển từ khóa để AI tự động phân loại danh mục giao dịch. Ví dụ: "GRAB FOOD" → Ăn uống, "SHOPEE" → Mua sắm.
CộtKiểuGhi chúTuKhoaIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidung (NULL = từ khóa hệ thống)TuKhoavarchar(255)Chuỗi từ khóa cần nhận dạngDanhMucIdint(11)FK → tbl_danhmuc (danh mục tương ứng)DoUuTienint(11)Độ ưu tiên khi nhiều từ khóa khớp

30. tbl_tygia
Mô tả: Lưu tỷ giá quy đổi giữa các loại tiền tệ. Dùng khi người dùng có giao dịch ngoại tệ.
CộtKiểuGhi chúTyGiaIdint(11)PK, AUTO_INCREMENTTuTienTevarchar(10)Tiền tệ gốc (VD: USD)SangTienTevarchar(10)Tiền tệ đích (VD: VND)TyGiadecimal(18,6)Tỷ giá quy đổiNgayCapNhatdatetimeNgày cập nhật tỷ giá

31. tbl_cauhinh_hethong
Mô tả: Lưu các tham số cấu hình toàn hệ thống (kích thước file tối đa, ngưỡng AI, chế độ bảo trì...).
CộtKiểuGhi chúCauHinhIdint(11)PK, AUTO_INCREMENTTenThamSovarchar(100)Tên tham số, UNIQUEGiaTrivarchar(255)Giá trị tham sốMoTavarchar(255)Mô tả ý nghĩa tham sốKieuDuLieuvarchar(50)'int', 'float', 'bool', 'string'

32. tbl_audit_log
Mô tả: Ghi lại toàn bộ thao tác thay đổi dữ liệu quan trọng (INSERT/UPDATE/DELETE). Dùng để kiểm tra, truy vết lịch sử thay đổi.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)Người thực hiện thao tácTenBangvarchar(100)Tên bảng bị thay đổiBanGhiIdint(11)ID bản ghi bị tác độngHanhDongvarchar(20)'INSERT', 'UPDATE', 'DELETE'DuLieuCutextDữ liệu trước khi thay đổi (JSON)DuLieuMoitextDữ liệu sau khi thay đổi (JSON)ThoiGiandatetimeThời điểm thực hiệnIpAddressvarchar(50)Địa chỉ IP thực hiện

33. tbl_hanhvi_nguoidung
Mô tả: Ghi lại hành vi sử dụng ứng dụng của người dùng (xem báo cáo, thêm giao dịch, đổi cài đặt...). Dùng để phân tích UX và cá nhân hóa trải nghiệm.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungHanhDongvarchar(255)Mô tả hành động (VD: "Xem báo cáo")DoiTuongvarchar(100)Màn hình/đối tượng tác độngThoiGiandatetimeThời điểm thực hiệnIpAddressvarchar(50)Địa chỉ IPChiTietThayDoitextChi tiết thay đổi dạng JSON

34. tbl_lichsu_dangnhap
Mô tả: Lưu lịch sử mỗi lần đăng nhập vào hệ thống, bao gồm thiết bị, IP, kết quả đăng nhập thành công hay thất bại.
CộtKiểuGhi chúIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungThoiGiandatetimeThời điểm đăng nhậpIpAddressvarchar(50)Địa chỉ IPThietBivarchar(255)User-agent (trình duyệt, thiết bị)KetQuatinyint(4)1=Thành công, 0=Thất bại

35. tbl_token
Mô tả: Lưu Access Token và Refresh Token của phiên đăng nhập. Dùng để xác thực JWT và làm mới phiên.
CộtKiểuGhi chúTokenIdint(11)PK, AUTO_INCREMENTNguoiDungIdint(11)FK → tbl_nguoidungAccessTokentextJWT access tokenRefreshTokentextRefresh token để làm mới access tokenNgayTaodatetimeThời điểm cấp tokenNgayHetHandatetimeThời điểm hết hạn token

36. tbl_otp
Mô tả: Lưu mã OTP gửi qua email để xác thực các thao tác nhạy cảm (đặt lại mật khẩu, xác minh tài khoản...).
CộtKiểuGhi chúotp_idint(11)PK, AUTO_INCREMENTemailvarchar(255)Email nhận OTPotp_codevarchar(10)Mã OTPloaivarchar(20)Loại OTP: 'EMAIL'ngay_taodatetimeThời điểm tạo OTPngay_het_handatetimeThời điểm hết hạnso_lan_saiint(11)Số lần nhập saida_su_dungtinyint(1)0=Chưa dùng, 1=Đã dùng

37. tbl_reset_token
Mô tả: Lưu token đặt lại mật khẩu được gửi qua email. Token có thời hạn và chỉ dùng được một lần.
CộtKiểuGhi chúreset_token_idint(11)PK, AUTO_INCREMENTemailvarchar(255)Email yêu cầu đặt lại mật khẩureset_tokenvarchar(255)Token bảo mật (hash)nguoi_dung_idint(11)ID người dùng liên quanngay_taodatetimeThời điểm tạo tokenngay_het_handatetimeThời điểm hết hạn (thường 30 phút)da_su_dungtinyint(1)0=Chưa dùng, 1=Đã dùng