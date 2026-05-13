import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { MucTieuDto, TaoMucTieuDto, DongGopMucTieuDto, TaoDongGopMucTieuDto } from '@/types/MucTieu';

const DUONG_DAN = '/api/muc-tieu';

// Helper để trích xuất data từ response API
function layDuLieu<T>(response: any): T {
  if (Array.isArray(response)) return response as T;
  if (response && typeof response === 'object') {
    // Nếu có property 'data' thì lấy data
    if ('data' in response) return response.data as T;
    // Nếu có property 'items' thì lấy items
    if ('items' in response) return response.items as T;
    // Ngược lại trả về nguyên response
    return response as T;
  }
  return response as T;
}

/** Lấy danh sách mục tiêu */
export async function layDanhSachMucTieu(): Promise<MucTieuDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  return layDuLieu<MucTieuDto[]>(response);
}

/** Lấy chi tiết mục tiêu */
export async function layChiTietMucTieu(id: number): Promise<MucTieuDto | null> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${id}`);
  return layDuLieu<MucTieuDto | null>(response);
}

/** Tạo mục tiêu mới - trả về ID */
export async function taoMucTieu(dto: TaoMucTieuDto): Promise<number> {
  const response = await goiApiPost<any>(DUONG_DAN, dto);
  // API trả về { data: id } hoặc { id: id }
  if (response && typeof response === 'object') {
    if ('data' in response) return Number(response.data);
    if ('id' in response) return Number(response.id);
  }
  return Number(response);
}

/** Cập nhật mục tiêu */
export async function capNhatMucTieu(id: number, dto: TaoMucTieuDto): Promise<void> {
  await goiApiPut<any>(`${DUONG_DAN}/${id}`, dto);
}

/** Ẩn mục tiêu (xóa mềm + hoàn tiền) */
export async function anMucTieu(id: number): Promise<void> {
  await goiApiDelete<any>(`${DUONG_DAN}/${id}`);
}

/** Xóa vĩnh viễn mục tiêu (hoàn tiền) */
export async function xoaVinhVienMucTieu(id: number): Promise<void> {
  await goiApiDelete<any>(`${DUONG_DAN}/${id}/xoa-vinh-vien`);
}

/** Lấy danh sách đóng góp mục tiêu */
export async function layDanhSachDongGop(mucTieuId: number): Promise<DongGopMucTieuDto[]> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${mucTieuId}/dong-gop`);
  return layDuLieu<DongGopMucTieuDto[]>(response);
}

/** Tạo đóng góp mục tiêu (nạp tiền) - trả về ID */
export async function taoDongGop(mucTieuId: number, dto: TaoDongGopMucTieuDto): Promise<number> {
  try {
    const response = await goiApiPost<any>(`${DUONG_DAN}/${mucTieuId}/dong-gop`, dto);
    console.log('Response tạo đóng góp:', response);
    
    // API trả về { data: id } hoặc { id: id }
    if (response && typeof response === 'object') {
      if ('data' in response) return Number(response.data);
      if ('id' in response) return Number(response.id);
      if ('thanhCong' in response && response.thanhCong === false) {
        throw new Error(response.thongDiep || 'Tạo đóng góp thất bại');
      }
    }
    return Number(response);
  } catch (error) {
    console.error('Lỗi tạo đóng góp:', error);
    throw error;
  }
}
