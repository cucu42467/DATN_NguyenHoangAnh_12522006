import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../thu_vien/goi_api';

export interface CanhBaoDto {
  canhBaoId: number;
  nguoiDungId: number;
  loaiCanhBao?: number;
  noiDung: string;
  ngayTao?: string;
  daDoc: boolean;
}

export interface DanhDauDaDocDto {
  daDoc: boolean;
}

const DUONG_DAN = '/api/canh-bao';

/** Lấy danh sách cảnh báo */
export async function layDanhSachCanhBao(daDoc?: boolean): Promise<CanhBaoDto[]> {
  const url = daDoc !== undefined ? `${DUONG_DAN}?daDoc=${daDoc}` : DUONG_DAN;
  const response = await goiApiGet<any>(url);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết cảnh báo */
export async function layChiTietCanhBao(id: number): Promise<CanhBaoDto | null> {
  return goiApiGet<CanhBaoDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo cảnh báo mới */
export async function taoCanhBao(dto: CanhBaoDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Xóa cảnh báo */
export async function xoaCanhBao(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Đánh dấu đã đọc */
export async function danhDauDaDoc(id: number, daDoc: boolean): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}/da-doc`, { daDoc });
}

/** Đếm số cảnh báo chưa đọc */
export async function demChuaDoc(): Promise<number> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/dem-chua-doc`);
  if (typeof response === 'number') return response;
  return response?.data ?? 0;
}
