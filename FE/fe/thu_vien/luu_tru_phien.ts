import type { NguoiDungTomTat, PhanHoiDangNhap } from "./kieu_giao_tiep";

/** Ten key localStorage — dong bo toan app */
export const KHOA_ACCESS_TOKEN = "accessToken";
export const KHOA_REFRESH_TOKEN = "refreshToken";
export const KHOA_NGUOI_DUNG = "nguoiDung";

function coTheDungLuuTru(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function luuPhienDangNhap(phanHoi: PhanHoiDangNhap): void {
  if (!coTheDungLuuTru()) return;
  localStorage.setItem(KHOA_ACCESS_TOKEN, phanHoi.accessToken);
  localStorage.setItem(KHOA_REFRESH_TOKEN, phanHoi.refreshToken);
  localStorage.setItem(KHOA_NGUOI_DUNG, JSON.stringify(phanHoi.nguoiDung));
}

export function xoaPhienDangNhap(): void {
  if (!coTheDungLuuTru()) return;
  localStorage.removeItem(KHOA_ACCESS_TOKEN);
  localStorage.removeItem(KHOA_REFRESH_TOKEN);
  localStorage.removeItem(KHOA_NGUOI_DUNG);
}

export function layAccessToken(): string | null {
  if (!coTheDungLuuTru()) return null;
  return localStorage.getItem(KHOA_ACCESS_TOKEN);
}

export function layRefreshToken(): string | null {
  if (!coTheDungLuuTru()) return null;
  return localStorage.getItem(KHOA_REFRESH_TOKEN);
}

export function layNguoiDungLuu(): NguoiDungTomTat | null {
  if (!coTheDungLuuTru()) return null;
  const raw = localStorage.getItem(KHOA_NGUOI_DUNG);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NguoiDungTomTat;
  } catch {
    return null;
  }
}

export function daDangNhap(): boolean {
  return Boolean(layAccessToken());
}
