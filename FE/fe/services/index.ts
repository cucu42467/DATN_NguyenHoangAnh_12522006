/**
 * API Layer - tap trung cac service goi API
 * Chuẩn hóa: api_khach.ts (base), {domain}.dich_vu.ts
 */

// Core API (from thu_vien)
export {
  CO_SO_API_ND_MAC_DINH,
  TEN_BIEN_CO_SO_ND,
  layCoSoApi,
  noiDuongDan,
  layGiayHetHanFetch,
} from "../thu_vien/co_so_api";

export {
  goiApi,
  goiApiGet,
  goiApiPost,
  goiApiPut,
  goiApiPatch,
  goiApiDelete,
  layUrlDayDu,
  LoiApi,
  type PhuongThucHttp,
  type TuyChonGoiApi,
} from "../thu_vien/goi_api";

export {
  KHOA_ACCESS_TOKEN,
  KHOA_REFRESH_TOKEN,
  KHOA_NGUOI_DUNG,
  luuPhienDangNhap,
  xoaPhienDangNhap,
  layAccessToken,
  layRefreshToken,
  layNguoiDungLuu,
  daDangNhap,
} from "../thu_vien/luu_tru_phien";

export type { NguoiDungTomTat, PhanHoiDangNhap, PhanHoiLoiApi } from "../thu_vien/kieu_giao_tiep";

// Authentication Services
export * from "./xacthuc/xacthuc";

// Domain Services
export * from "./giaodich/giaodich";
export * from "./giaodich/giaodichdinhky";
export * from "./danhmuc/danhmuc";
// export * from "./danhmuc/loaidanhmuc";
export * from "./taikhoan/taikhoan";
export * from "./muctieu/muctieu";
export * from "./ngansach/ngansach";
export * from "./baocao/baocao";
export * from "./ai/ai";
export * from "./ai/gemini";
export * from "./trangchu/tongquan";
export * from "./thongbao";

// New CRUD services
// export * from "./loaitaikhoan";
export * from "./nhacnho";
export * from "./caidat";
export * from "./tukhoa";
// export * from "./canhbao";
export * from "./tepdingkem";

// Upload
export * from "./upload";

// Profile & User
export * from "./nguoidung";
export * from "./lich_su_dang_nhap";

// Admin Services
export * from "./admin";

// QT Services
export * from "./qt";
