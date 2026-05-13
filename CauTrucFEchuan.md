Ban la Senior Frontend Architect chuyen Next.js 15+, React, TypeScript va kien truc enterprise-scale.

Toi co mot project frontend hien tai dang hoat dong. Toi muon refactor TOAN BO cau truc thu muc sang TIENG VIET KHONG DAU 100%.

## Muc tieu
- Toan bo project phai dung Tieng Viet KHONG DAU
- KHONG duoc giu lai bat ky ten English nao
- Dong nhat 100% toan bo architecture
- Toi uu theo feature-based architecture
- De maintain, de scale, de test

---

## QUY TAC BAT BUOC

### 1. NGON NGU (QUAN TRONG NHAT)
- Toan bo ten thu muc, file module, service, type, component phai la Tieng Viet KHONG DAU
- KHONG duoc su dung tieng Anh (KHONG NGOAI LE)
- KHONG duoc tron English + Vietnamese

Vi du hop le:
- nguoi_dung
- giao_dich
- dich_vu
- bao_cao
- cai_dat
- xac_thuc
- danh_muc
- giam_sat

---

### 2. KIEN TRUC MOI

Chuyen sang cau truc:

- app/ (giu nguyen Next.js routing)
- tinh_nang/ (feature-based architecture thay cho thanh_phan + dich_vu)
- chia_se/ (shared components, hooks, utils, types)
- dich_vu/ (API layer tap trung)
- thu_vien/ (core libs nhu api client, config)

---

### 3. FEATURE-BASED ARCHITECTURE

Tat ca logic phai gom theo domain:

tinh_nang/
  nguoi_dung/
  giao_dich/
  bao_cao/
  danh_muc/
  cai_dat/
  xac_thuc/
  giam_sat/
  ai/

Moi tinh_nang phai co:
- thanh_phan/
- hooks/
- dich_vu/
- kieu_du_lieu/
- index.ts (public API)

---

### 4. LOAI BO CAU TRUC CU

Phai xoa hoac gom lai:

- thanh_phan/ → KHONG DUOC GIU
- dich_vu/ → tach vao dich_vu hoac tinh_nang
- kieu_du_lieu/ → gom vao types trong chia_se hoac tinh_nang
- thu_vien/ → gom vao chia_se/thu_vien

---

### 5. API LAYER CHUAN HOA

dich_vu/ phai co:

- api_khach.ts (base fetch/axios wrapper)
- xac_thuc.dich_vu.ts
- nguoi_dung.dich_vu.ts
- giao_dich.dich_vu.ts

Yeu cau:
- co xu ly loi chung
- co typing ro rang
- co interceptor neu can

---

### 6. CHIA_SE (SHARED LAYER)

chia_se/ gom:
- thanh_phan (UI dung chung)
- hooks (use_xxx)
- tien_ich (utils)
- hang_so (constants)
- kieu_du_lieu (global types)

---

### 7. APP ROUTER (KHONG THAY DOI LOGIC)

- KHONG duoc pha routing
- giu route groups:
  (quan_tri), (nguoi_dung), (xac_thuc)
- chi toi uu structure ben trong

---

## OUTPUT YEU CAU

Tra ve:

### 1. Cau truc thu muc moi (tree format)

### 2. Mapping tu cu → moi
Vi du:
- thanh_phan/admin/NguoiDung → tinh_nang/nguoi_dung/thanh_phan

### 3. Giai thich ngan tai sao thay doi

### 4. Canh bao rui ro khi migrate

---

## QUAN TRONG
- KHONG duoc lam hong logic code
- CHI refactor structure
- GIU NGUYEN functionality
- TOI UU scalability va maintainability
- Huong den production system lon (enterprise level frontend)