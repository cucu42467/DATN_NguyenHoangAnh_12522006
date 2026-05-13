import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../thu_vien/goi_api';

export interface NhacNhoDto {
  nhacNhoId: number;
  nguoiDungId: number;
  tieuDe?: string;
  noiDung?: string;
  ngayNhac?: string;
  lapLai?: number;
  trangThai: number;
  // ← THÊM MỚI: 3 trường mới
  chuKy?: string;    // none/daily/weekly/monthly/yearly
  lanNhacCuoi?: string;
  lanNhacTiep?: string;
}

export interface TaoNhacNhoDto {
  tieuDe?: string;
  noiDung?: string;
  ngayNhac?: string;
  lapLai?: number;
  // ← THÊM MỚI: chuKy, lanNhacTiep
  chuKy?: string;
  lanNhacTiep?: string;
}

export interface CapNhatTrangThaiNhacNhoDto {
  trangThai: number;
}

const DUONG_DAN = '/api/nhac-nho';

/** Lấy danh sách nhắc nhở */
export async function layDanhSachNhacNho(): Promise<NhacNhoDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết nhắc nhở */
export async function layChiTietNhacNho(id: number): Promise<NhacNhoDto | null> {
  return goiApiGet<NhacNhoDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo nhắc nhở mới */
export async function taoNhacNho(dto: TaoNhacNhoDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật nhắc nhở */
export async function capNhatNhacNho(id: number, dto: TaoNhacNhoDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa nhắc nhở */
export async function xoaNhacNho(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Cập nhật trạng thái nhắc nhở */
export async function capNhatTrangThaiNhacNho(id: number, trangThai: number): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}/trang-thai`, { trangThai });
}
