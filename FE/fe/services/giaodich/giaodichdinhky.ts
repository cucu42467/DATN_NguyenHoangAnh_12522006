import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { GiaoDichDinhKyDto, TaoGiaoDichDinhKyDto } from '@/kieu_du_lieu/user';

const DUONG_DAN = '/api/giao-dich-dinh-ky';

/** Lấy danh sách giao dịch định kỳ */
export async function layDanhSachGiaoDichDinhKy(): Promise<GiaoDichDinhKyDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  
  // Xử lý response có thể là array trực tiếp hoặc object { success, data, message }
  if (Array.isArray(response)) {
    return response;
  }
  
  // Nếu là object, lấy property chứa array
  if (response && typeof response === 'object') {
    return response.data ?? response.items ?? response.danhSach ?? [];
  }
  
  return [];
}

/** Tạo giao dịch định kỳ mới */
export async function taoGiaoDichDinhKy(dto: TaoGiaoDichDinhKyDto) {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật giao dịch định kỳ */
export async function capNhatGiaoDichDinhKy(id: number, dto: TaoGiaoDichDinhKyDto) {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa giao dịch định kỳ */
export async function xoaGiaoDichDinhKy(id: number) {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
