import { goiApiGetQt, goiApiPostQt, goiApiPutQt, goiApiDeleteQt } from './goi_api_qt';
import type { DanhMucDto, TaoDanhMucDto } from '@/kieu_du_lieu/user';
import type { ApiResponse } from '@/types';

const DUONG_DAN = '/admin/danh-muc';

/** Lấy danh sách danh mục toàn hệ thống (admin) */
export async function layDanhSachDanhMucQt(loai?: 'CHI' | 'THU', includeChildren = false) {
  const params = new URLSearchParams();
  if (loai) params.append('loai', loai);
  params.append('includeChildren', includeChildren.toString());
  const url = params.toString() ? `${DUONG_DAN}?${params}` : DUONG_DAN;
  const response = await goiApiGetQt<ApiResponse<DanhMucDto[]>>(url);
  return response.data;
}

/** Lấy chi tiết */
export async function layChiTietDanhMucQt(id: number) {
  return goiApiGetQt<DanhMucDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo mới (global) */
export async function taoDanhMucQt(dto: TaoDanhMucDto) {
  return goiApiPostQt<number>(DUONG_DAN, dto);
}

/** Cập nhật */
export async function capNhatDanhMucQt(id: number, dto: TaoDanhMucDto) {
  return goiApiPutQt<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa */
export async function xoaDanhMucQt(id: number) {
  return goiApiDeleteQt<void>(`${DUONG_DAN}/${id}`);
}

