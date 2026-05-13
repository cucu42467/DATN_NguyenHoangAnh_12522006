import { goiApiGetQt, goiApiPostQt, goiApiPutQt, goiApiDeleteQt } from './goi_api_qt';

const DUONG_DAN = '/admin/ty-gia';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface TyGiaData {
  tyGiaId: number;
  tuTienTe: string;
  sangTienTe: string;
  tyGia: number;
  ngayCapNhat: string | null;
}

export interface TaoTyGiaDto {
  tuTienTe: string;
  sangTienTe: string;
  tyGia: number;
}

/** Lấy danh sách tỷ giá (admin) */
export async function layDanhSachTyGia(): Promise<TyGiaData[]> {
  const response = await goiApiGetQt<ApiResponse<TyGiaData[]>>(`${DUONG_DAN}`);
  return response.data ?? [];
}

/** Lấy chi tiết tỷ giá */
export async function layChiTietTyGia(id: number): Promise<TyGiaData | null> {
  const response = await goiApiGetQt<ApiResponse<TyGiaData>>(`${DUONG_DAN}/${id}`);
  return response.data ?? null;
}

/** Tạo tỷ giá mới */
export async function taoTyGia(dto: TaoTyGiaDto): Promise<number> {
  const response = await goiApiPostQt<ApiResponse<number>>(`${DUONG_DAN}`, dto);
  return response.data;
}

/** Cập nhật tỷ giá */
export async function capNhatTyGia(id: number, dto: Partial<TyGiaData>): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa tỷ giá */
export async function xoaTyGia(id: number): Promise<void> {
  await goiApiDeleteQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`);
}
