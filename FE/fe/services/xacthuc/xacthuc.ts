import type { PhanHoiDangNhap } from "../../thu_vien/kieu_giao_tiep";
import { goiApiPost } from "../../thu_vien/goi_api";

export type { PhanHoiDangNhap } from "../../thu_vien/kieu_giao_tiep";

const DUONG_DAN_DANG_NHAP = "/api/xacthuc/dang-nhap";
const DUONG_DAN_DANG_NHAP_MANG_XA_HOI = "/api/xacthuc/dang-nhap-mang-xa-hoi";
const DUONG_DAN_DANG_KY = "/api/xacthuc/dang-ky";
const DUONG_DAN_LAM_MOI_TOKEN = "/api/xacthuc/lam-moi-token";
const DUONG_DAN_DANG_XUAT = "/api/xacthuc/dang-xuat";
const DUONG_DAN_QUEN_MAT_KHAU_EMAIL = "/api/xacthuc/quen-mat-khau/email";
const DUONG_DAN_QUEN_MAT_KHAU_SDT = "/api/xacthuc/quen-mat-khau/sdt";
const DUONG_DAN_XAC_THUC_OTP = "/api/xacthuc/xac-thuc-otp";
const DUONG_DAN_DAT_LAI_MAT_KHAU = "/api/xacthuc/dat-lai-mat-khau";
const DUONG_DAN_GUI_OTP = "/api/xacthuc/gui-otp";

export async function dangNhapBangMatKhau(tenDangNhap: string, matKhau: string, ghiNho: boolean) {
  return goiApiPost<PhanHoiDangNhap>(
    DUONG_DAN_DANG_NHAP,
    { tenDangNhap, matKhau, ghiNho },
    { tuDongTuyenToken: false },
  );
}

export async function dangNhapMangXaHoi(
  nhaCungCap: "GOOGLE" | "FACEBOOK",
  idToken: string
) {
  return goiApiPost<PhanHoiDangNhap>(
    DUONG_DAN_DANG_NHAP_MANG_XA_HOI,
    {
      nhaCungCap,
      idToken, // OK
      accessToken: "" // 👈 nên gửi luôn để BE fallback (quan trọng)
    },
    { tuDongTuyenToken: false }
  );
}

export interface YeuCauDangKy {
  hoTen: string;
  email: string;
  soDienThoai?: string;
  matKhau: string;
  xacNhanMatKhau: string;
}

export interface PhanHoiDangKy {
  thanhCong: boolean;
  thongDiep?: string;
  phienDangNhap?: PhanHoiDangNhap;
  nguoiDung?: {
    nguoiDungId: number;
    hoTen: string;
    email: string;
    soDienThoai?: string;
    anhDaiDien?: string;
    vaiTro: string[];
  };
}

export async function dangKy(yeuCau: YeuCauDangKy) {
  return goiApiPost<PhanHoiDangKy>(
    DUONG_DAN_DANG_KY,
    yeuCau,
    { tuDongTuyenToken: false }
  );
}

// Refresh token
export interface YeuCauLamMoiToken {
  refreshToken: string;
}

export async function lamMoiToken(refreshToken: string) {
  return goiApiPost<PhanHoiDangNhap>(
    DUONG_DAN_LAM_MOI_TOKEN,
    { refreshToken },
    { tuDongTuyenToken: false }
  );
}

// Đăng xuất
export interface YeuCauDangXuat {
  refreshToken: string;
}

export async function dangXuat(refreshToken: string) {
  return goiApiPost<void>(
    DUONG_DAN_DANG_XUAT,
    { refreshToken }
  );
}

// Quên mật khẩu qua email
export async function quenMatKhauEmail(email: string) {
  return goiApiPost<{ thongDiep: string }>(
    DUONG_DAN_QUEN_MAT_KHAU_EMAIL,
    { email },
    { tuDongTuyenToken: false }
  );
}

// Quên mật khẩu qua SĐT
export async function quenMatKhauSdt(soDienThoai: string) {
  return goiApiPost<{ phienOtpId: string; thongDiep: string }>(
    DUONG_DAN_QUEN_MAT_KHAU_SDT,
    { soDienThoai },
    { tuDongTuyenToken: false }
  );
}

// Gửi OTP qua email (mới)
export interface PhanHoiGuiOtp {
  thanhCong: boolean;
  thongDiep?: string;
  otpId?: string;
}

export async function guiOtpEmail(email: string) {
  return goiApiPost<PhanHoiGuiOtp>(
    DUONG_DAN_GUI_OTP,
    { email },
    { tuDongTuyenToken: false }
  );
}

// Xác thực OTP
export interface YeuCauXacThucOtp {
  email: string;
  otp: string;
}

export interface PhanHoiXacThucOtp {
  thanhCong: boolean;
  thongDiep?: string;
  resetToken?: string;
}

export async function xacThucOtp(yeuCau: YeuCauXacThucOtp) {
  return goiApiPost<PhanHoiXacThucOtp>(
    DUONG_DAN_XAC_THUC_OTP,
    yeuCau,
    { tuDongTuyenToken: false }
  );
}

// Đặt lại mật khẩu
export interface YeuCauDatLaiMatKhau {
  email: string;
  resetToken: string;
  matKhauMoi: string;
  xacNhanMatKhauMoi: string;
}

export interface PhanHoiDatLaiMatKhau {
  thanhCong: boolean;
  thongDiep?: string;
}

export async function datLaiMatKhau(yeuCau: YeuCauDatLaiMatKhau) {
  return goiApiPost<PhanHoiDatLaiMatKhau>(
    DUONG_DAN_DAT_LAI_MAT_KHAU,
    yeuCau,
    { tuDongTuyenToken: false }
  );
}

export { luuPhienDangNhap, xoaPhienDangNhap } from "../../thu_vien/luu_tru_phien";

