import { goiApiGet, goiApiPost, goiApiDelete } from '../thu_vien/goi_api';

export interface TepDinhKemDto {
  tepId: number;
  tenFile: string;
  duongDan: string;
  loaiFile?: string;
  kichThuoc?: number;
  ngayTao?: string;
}

export interface TaoTepDinhKemDto {
  tenFile: string;
  duongDan: string;
  loaiFile?: string;
  kichThuoc?: number;
}

const DUONG_DAN = '/api/tep-dinh-kem';

/** Lấy danh sách tệp đính kèm */
export async function layDanhSachTepDinhKem(): Promise<TepDinhKemDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết tệp đính kèm */
export async function layChiTietTepDinhKem(id: number): Promise<TepDinhKemDto | null> {
  return goiApiGet<TepDinhKemDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo tệp đính kèm mới */
export async function taoTepDinhKem(dto: TaoTepDinhKemDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Xóa tệp đính kèm */
export async function xoaTepDinhKem(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
