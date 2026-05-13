import { goiApiGet, goiApiPut, goiApiPost } from "../thu_vien/goi_api";
import type { ApiResponse, NguoiDungDto, DoiMatKhauDto } from "../types";

const BASE_URL = "/api/nguoidung";

/**
 * Lấy thông tin cá nhân của người dùng hiện tại
 */
export async function layThongTinCaNhan() {
  return goiApiGet<ApiResponse<NguoiDungDto>>(`${BASE_URL}/me`);
}

/**
 * Cập nhật thông tin cá nhân
 */
export async function capNhatThongTinCaNhan(data: Partial<NguoiDungDto>) {
  return goiApiPut<ApiResponse>(`${BASE_URL}/me`, data);
}

/**
 * Đổi mật khẩu
 */
export async function doiMatKhau(data: DoiMatKhauDto) {
  return goiApiPost<ApiResponse>(`${BASE_URL}/doi-mat-khau`, data);
}

/**
 * Cập nhật cài đặt bảo mật (2FA, Ngôn ngữ, Tiền tệ)
 */
export async function capNhatCaiDatBaoMat(data: { dang2FA?: boolean; maNgonNgu?: string; maTienTe?: string }) {
  return goiApiPut<ApiResponse>(`${BASE_URL}/me/settings`, data);
}

/**
 * Lấy lịch sử đăng nhập
 */
export async function layLichSuDangNhap() {
  return goiApiGet<ApiResponse<import('../types').LichSuDangNhapDto[]>>(`${BASE_URL}/me/lich-su-dang-nhap`);
}
