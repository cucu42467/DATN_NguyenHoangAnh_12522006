import { goiApiGet, goiApiPost } from '@/thu_vien/goi_api';

export interface PhanHoiData {
  phanHoiId?: number;
  nguoiDungId?: number;
  tenNguoiDung?: string;
  tieuDe: string;
  noiDung: string;
  trangThai?: number;
  trangThaiText?: string;
  ngayTao?: string;
  soCauTraLoiChuaDoc?: number;
}

export interface PhanHoiTraloiData {
  traLoiId?: number;
  phanHoiId: number;
  nguoiGuiId: number;
  tenNguoiGui?: string;
  laAdmin?: boolean;
  noiDung: string;
  ngayGui?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ============ PHAN HOI ============

export async function guiPhanHoi(data: Partial<PhanHoiData>): Promise<ApiResponse<number>> {
  return goiApiPost<ApiResponse<number>>('/api/PhanHoi', data);
}

export async function layDanhSachPhanHoi(nguoiDungId: number): Promise<ApiResponse<PhanHoiData[]>> {
  return goiApiGet<ApiResponse<PhanHoiData[]>>(`/api/PhanHoi?nguoiDungId=${nguoiDungId}`);
}

export async function layPhanHoiTheoId(phanHoiId: number): Promise<ApiResponse<PhanHoiData>> {
  return goiApiGet<ApiResponse<PhanHoiData>>(`/api/PhanHoi/${phanHoiId}`);
}

// ============ PHAN HOI TRA LOI ============

export async function layDanhSachTraLoi(phanHoiId: number): Promise<ApiResponse<PhanHoiTraloiData[]>> {
  return goiApiGet<ApiResponse<PhanHoiTraloiData[]>>(`/api/PhanHoiTraLoi/${phanHoiId}`);
}

export async function demTraLoiChuaDoc(nguoiDungId: number): Promise<ApiResponse<number>> {
  return goiApiGet<ApiResponse<number>>(`/api/PhanHoiTraLoi/dem-chua-doc/${nguoiDungId}`);
}
