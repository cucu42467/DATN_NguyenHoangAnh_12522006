import { goiApiGetQt } from './goi_api_qt';
import type { ApiResponse } from '@/types';
import type { LichSuDangNhapQtDto } from "@/types";

const DUONG_DAN = '/api/lich-su-dang-nhap';

/** Lấy toàn bộ lịch sử đăng nhập */
export async function layTatCaLichSuDangNhapQt() {
  const response = await goiApiGetQt<ApiResponse<LichSuDangNhapQtDto[]>>(`${DUONG_DAN}`);
  return response.data;
}

/** Lấy lịch sử đăng nhập theo id */
export async function layLichSuDangNhapTheoIdQt(id: number) {
  return goiApiGetQt<LichSuDangNhapQtDto>(`${DUONG_DAN}/${id}`);
}

/** Lấy lịch sử đăng nhập theo người dùng */
export async function layLichSuDangNhapTheoNguoiDungQt(nguoiDungId: number) {
  const response = await goiApiGetQt<ApiResponse<LichSuDangNhapQtDto[]>>(
    `${DUONG_DAN}/nguoi-dung/${nguoiDungId}`
  );
  return response.data;
}

/** Lấy danh sách lịch sử đăng nhập có phân trang */
export async function layLichSuDangNhapPhanTrangQt(page = 1, pageSize = 10) {
  const response = await goiApiGetQt<ApiResponse<LichSuDangNhapQtDto[]>>(
    `${DUONG_DAN}/phan-trang?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
}

/** Lấy lịch sử đăng nhập theo người dùng có phân trang */
export async function layLichSuDangNhapTheoNguoiDungPhanTrangQt(
  nguoiDungId: number,
  page = 1,
  pageSize = 10
) {
  const response = await goiApiGetQt<ApiResponse<LichSuDangNhapQtDto[]>>(
    `${DUONG_DAN}/nguoi-dung/${nguoiDungId}/phan-trang?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
}
