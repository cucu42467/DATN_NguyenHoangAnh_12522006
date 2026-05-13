import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';

export interface LoaiDanhMucDto {
  loaiDanhMucId: number;
  tenLoai: string;
}

export interface TaoLoaiDanhMucDto {
  tenLoai: string;
}

const DUONG_DAN = '/api/loai-danh-muc';

/** Lấy danh sách loại danh mục */
export async function layDanhSachLoaiDanhMuc(): Promise<LoaiDanhMucDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết loại danh mục */
export async function layChiTietLoaiDanhMuc(id: number): Promise<LoaiDanhMucDto | null> {
  return goiApiGet<LoaiDanhMucDto>(`${DUONG_DAN}/${id}`);
}

/** Lấy loại danh mục theo ID danh mục */
export async function layLoaiDanhMucTheoDanhMucId(danhMucId: number): Promise<LoaiDanhMucDto | null> {
  return goiApiGet<LoaiDanhMucDto>(`${DUONG_DAN}/theo-danh-muc/${danhMucId}`);
}

/** Tạo loại danh mục mới */
export async function taoLoaiDanhMuc(dto: TaoLoaiDanhMucDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật loại danh mục */
export async function capNhatLoaiDanhMuc(id: number, dto: TaoLoaiDanhMucDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa loại danh mục */
export async function xoaLoaiDanhMuc(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
