import { goiApiGetQt, goiApiPostQt, goiApiPutQt, goiApiDeleteQt } from './goi_api_qt';

const DUONG_DAN = '/admin/vai-tro';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface VaiTroData {
  vaiTroId: number;
  tenVaiTro: string;
  moTa: string | null;
}

export interface TaoVaiTroDto {
  tenVaiTro: string;
  moTa?: string;
}

/** Lấy danh sách vai trò (admin) */
export async function layDanhSachVaiTro(): Promise<VaiTroData[]> {
  const response = await goiApiGetQt<ApiResponse<VaiTroData[]>>(`${DUONG_DAN}`);
  return response.data ?? [];
}

/** Lấy chi tiết vai trò */
export async function layChiTietVaiTro(id: number): Promise<VaiTroData | null> {
  const response = await goiApiGetQt<ApiResponse<VaiTroData>>(`${DUONG_DAN}/${id}`);
  return response.data ?? null;
}

/** Tạo vai trò mới */
export async function taoVaiTro(dto: TaoVaiTroDto): Promise<number> {
  const response = await goiApiPostQt<ApiResponse<number>>(`${DUONG_DAN}`, dto);
  return response.data;
}

/** Cập nhật vai trò */
export async function capNhatVaiTro(id: number, dto: Partial<VaiTroData>): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa vai trò */
export async function xoaVaiTro(id: number): Promise<void> {
  await goiApiDeleteQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`);
}
