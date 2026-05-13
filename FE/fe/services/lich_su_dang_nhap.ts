import { goiApiGet } from "../thu_vien/goi_api";
import type { LichSuDangNhapQtDto } from "@/types";

const BASE_URL = "/api/lich-su-dang-nhap";

/**
 * Lấy toàn bộ lịch sử đăng nhập
 */
export async function layTatCaLichSuDangNhap() {
  return goiApiGet<LichSuDangNhapQtDto[]>(BASE_URL);
}

/**
 * Lấy lịch sử đăng nhập theo id
 */
export async function layLichSuDangNhapTheoId(id: number) {
  return goiApiGet<LichSuDangNhapQtDto>(`${BASE_URL}/${id}`);
}

/**
 * Lấy lịch sử đăng nhập theo người dùng
 */
export async function layLichSuDangNhapTheoNguoiDung(nguoiDungId: number) {
  return goiApiGet<LichSuDangNhapQtDto[]>(`${BASE_URL}/nguoi-dung/${nguoiDungId}`);
}

/**
 * Lấy danh sách lịch sử đăng nhập có phân trang
 */
export async function layLichSuDangNhapPhanTrang(page = 1, pageSize = 10) {
  return goiApiGet<LichSuDangNhapQtDto[]>(`${BASE_URL}/phan-trang?page=${page}&pageSize=${pageSize}`);
}

/**
 * Lấy lịch sử đăng nhập theo người dùng có phân trang
 */
export async function layLichSuDangNhapTheoNguoiDungPhanTrang(nguoiDungId: number, page = 1, pageSize = 10) {
  return goiApiGet<LichSuDangNhapQtDto[]>(
    `${BASE_URL}/nguoi-dung/${nguoiDungId}/phan-trang?page=${page}&pageSize=${pageSize}`
  );
}
