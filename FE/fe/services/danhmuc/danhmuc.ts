import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { DanhMucDto, TaoDanhMucDto, LoaiDanhMucDto } from '@/types/DanhMuc';

const DUONG_DAN = '/api/danh-muc';

/** Lấy danh sách danh mục theo loại (dùng loaiDanhMucId: 1=Thu nhập, 2=Chi tiêu, hoặc string 'THU'/'CHI') */
export async function layDanhSachDanhMuc(
  loaiDanhMucIdOrLoai?: number | 'CHI' | 'THU'
): Promise<DanhMucDto[]> {
  const params = new URLSearchParams();
  
  // Chuyển đổi string sang number nếu cần
  let loaiDanhMucId: number | undefined;
  if (typeof loaiDanhMucIdOrLoai === 'number') {
    loaiDanhMucId = loaiDanhMucIdOrLoai;
  } else if (loaiDanhMucIdOrLoai === 'THU') {
    loaiDanhMucId = 1;
  } else if (loaiDanhMucIdOrLoai === 'CHI') {
    loaiDanhMucId = 2;
  }
  
  if (loaiDanhMucId !== undefined) {
    params.append('loaiDanhMucId', loaiDanhMucId.toString());
  }

  const url = params.toString() ? `${DUONG_DAN}?${params.toString()}` : DUONG_DAN;
  const response = await goiApiGet<any>(url);

  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết danh mục */
export async function layChiTietDanhMuc(id: number): Promise<DanhMucDto | null> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${id}`);
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}

/** Tạo danh mục mới */
export async function taoDanhMuc(dto: TaoDanhMucDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật danh mục */
export async function capNhatDanhMuc(id: number, dto: TaoDanhMucDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa danh mục */
export async function xoaDanhMuc(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Lấy danh sách loại danh mục */
export async function layDanhSachLoaiDanhMuc(): Promise<LoaiDanhMucDto[]> {
  const response = await goiApiGet<any>('/api/loai-danh-muc');
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Cập nhật thứ tự danh mục */
export async function capNhatThuTuDanhMuc(id: number, thuTuMoi: number): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}/thu-tu`, { thuTu: thuTuMoi });
}
