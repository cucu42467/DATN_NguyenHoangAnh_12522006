import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../thu_vien/goi_api';

export interface TuKhoaDto {
  tuKhoaId: number;
  nguoiDungId?: number;
  tuKhoa: string;
  danhMucId: number;
  tenDanhMuc?: string;
  doUuTien?: number;
}

export interface TaoTuKhoaDto {
  tuKhoa: string;
  danhMucId: number;
  doUuTien?: number;
}

const DUONG_DAN = '/api/tu-khoa';

/** Lấy danh sách từ khóa */
export async function layDanhSachTuKhoa(): Promise<TuKhoaDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết từ khóa */
export async function layChiTietTuKhoa(id: number): Promise<TuKhoaDto | null> {
  return goiApiGet<TuKhoaDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo từ khóa mới */
export async function taoTuKhoa(dto: TaoTuKhoaDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật từ khóa */
export async function capNhatTuKhoa(id: number, dto: TaoTuKhoaDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa từ khóa */
export async function xoaTuKhoa(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
