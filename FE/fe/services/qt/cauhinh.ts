import { goiApiGetQt, goiApiPutQt } from './goi_api_qt';

const DUONG_DAN = '/admin/cau-hinh';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CauHinhData {
  cauHinhId: number;
  tenThamSo: string;
  giaTri: string;
  moTa: string | null;
  kieuDuLieu: string | null;
}

/** Lấy danh sách cấu hình hệ thống (admin) */
export async function layDanhSachCauHinh(): Promise<CauHinhData[]> {
  const response = await goiApiGetQt<ApiResponse<CauHinhData[]>>(`${DUONG_DAN}`);
  return response.data ?? [];
}

/** Lấy chi tiết cấu hình */
export async function layChiTietCauHinh(id: number): Promise<CauHinhData | null> {
  const response = await goiApiGetQt<ApiResponse<CauHinhData>>(`${DUONG_DAN}/${id}`);
  return response.data ?? null;
}

/** Cập nhật cấu hình */
export async function capNhatCauHinh(id: number, dto: Partial<CauHinhData>): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`, dto);
}
