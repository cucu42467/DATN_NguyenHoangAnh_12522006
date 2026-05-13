Bạn là AI Senior Fullstack Engineer (.NET + Next.js + AI Engineer).

Bạn đang làm việc trên hệ thống:

* Backend: API_ND + API_QT + BLL + DAL + DTO
* Frontend: Next.js
* Database: ĐÃ CÓ tbl_thongbao

---

# 🎯 MỤC TIÊU

Xây dựng hệ thống AI:

1. Phân tích dữ liệu chi tiêu
2. Tạo:

   * Cảnh báo (tbl_canhbao)
   * Gợi ý (tbl_goiy_ai)
   * Dự đoán (tbl_dudoan)
3. TỰ ĐỘNG tạo **thông báo (tbl_thongbao)**
4. Hiển thị cho FE
5. Có admin control (KHÔNG duyệt tay)

---

# 🧱 BẢNG THÔNG BÁO (ĐÃ CÓ)

```sql id="sql01"
CREATE TABLE tbl_thongbao (
  ThongBaoId int PRIMARY KEY,
  NguoiDungId int NOT NULL,
  TieuDe varchar(255) NOT NULL,
  NoiDung varchar(1000),
  LoaiThongBao tinyint DEFAULT 1,
  NgayTao datetime DEFAULT current_timestamp(),
  DaDoc bit DEFAULT 0
);
```

---

# 🧠 AI PIPELINE

## Trong AiBll.cs

Viết thêm:

* taoThongBaoTuCanhBaoAsync(nguoiDungId, canhBao)
* taoThongBaoTuGoiYAsync(nguoiDungId, goiY)

---

## LOGIC TẠO THÔNG BÁO

### Mapping:

| AI      | ThongBao         |
| ------- | ---------------- |
| canhBao | LoaiThongBao = 2 |
| goiY    | LoaiThongBao = 3 |
| duDoan  | LoaiThongBao = 4 |

---

### Ví dụ:

canhBao:

* "Ban da vuot ngan sach 120%"

→ tbl_thongbao:

* TieuDe: "Cảnh báo chi tiêu"
* NoiDung: "Ban da vuot ngan sach 120%"
* LoaiThongBao: 2

---

goiY:

* "Ban co the tiet kiem 500k"

→ tbl_thongbao:

* TieuDe: "Gợi ý từ AI"
* NoiDung: "Ban co the tiet kiem 500k"
* LoaiThongBao: 3

---

# 🧩 HÀM PHẢI CÓ

Trong AiBll:

* taoThongBaoAsync(nguoiDungId, ketQuaAi)

Flow:

* loop canhBao → insert tbl_thongbao
* loop goiY → insert tbl_thongbao
* duDoan → tạo 1 thông báo

---

# 🚫 TRÁNH TRÙNG

Rule:

* Không tạo thông báo giống nhau trong 24h
* Check theo:

  * NoiDung
  * NguoiDungId

---

# 🧩 DAL

Trong AiDal hoặc ThongBaoDal:

* themThongBaoAsync(thongBao)

---

# 🧩 API_ND

## ThongBaoController.cs (nếu chưa có thì tạo)

### GET /api/thong-bao

* lấy danh sách thông báo

### PUT /api/thong-bao/{id}/da-doc

---

# 🖥️ FRONTEND

## Service

dich_vu/thongbao.ts:

* layThongBao()
* danhDauDaDoc()

---

## UI

Hiển thị:

* icon chuông 🔔
* badge số lượng chưa đọc

---

## TrangChu

* hiển thị:

  * cảnh báo quan trọng
  * gợi ý mới

---

## TrungTamAI

* hiển thị full:

  * goiY
  * duDoan
  * canhBao

---

# 🛡️ ADMIN CONTROL

KHÔNG đổi:

* vẫn filter ở backend
* thông báo chỉ tạo từ data đã hợp lệ

---

# 🔄 FLOW HOÀN CHỈNH

1. User mở app

2. FE gọi:
   → /api/ai/tao-du-lieu

3. BE:

   * AI generate
   * validate
   * lưu:

     * tbl_canhbao
     * tbl_goiy_ai
     * tbl_dudoan
     * tbl_thongbao

4. FE:

   * gọi /api/thong-bao
   * hiển thị realtime

---

# 🚫 CẤM

* Không tạo thông báo trực tiếp từ AI raw
* Không bỏ validate
* Không tạo trùng

---

# 🎯 KẾT QUẢ

* AI tạo dữ liệu
* User nhận thông báo ngay
* Không cần admin duyệt
* Hệ thống realtime + sạch

---

Hãy cập nhật toàn bộ code để tích hợp tbl_thongbao vào AI pipeline.
