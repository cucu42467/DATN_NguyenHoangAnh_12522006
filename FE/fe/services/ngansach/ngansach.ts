import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { NganSachDto, ThietLapNganSachDto } from '@/kieu_du_lieu/user';

const DUONG_DAN = '/api/ngan-sach';

/** Lấy danh sách ngân sách theo tháng/năm */
export async function layDanhSachNganSach(thang: number, nam: number): Promise<NganSachDto[]> {
  const params = new URLSearchParams();
  params.append('thang', thang.toString());
  params.append('nam', nam.toString());

  const response = await goiApiGet<any>(`${DUONG_DAN}?${params.toString()}`);
  
  // Xử lý response có thể là array trực tiếp hoặc object { success, data, message }
  if (Array.isArray(response)) {
    return response;
  }
  
  // Nếu là object, lấy property chứa array
  if (response && typeof response === 'object') {
    return response.data ?? response.items ?? response.danhSach ?? [];
  }
  
  return [];
}

/** Tạo ngân sách mới */
export async function taoNganSach(dto: ThietLapNganSachDto) {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật ngân sách */
export async function capNhatNganSach(id: number, dto: ThietLapNganSachDto) {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Cập nhật chỉ hạn mức */
export async function capNhatHanMuc(id: number, hanMuc: number) {
  return goiApiPut<void>(`${DUONG_DAN}/${id}/han-muc`, { hanMuc });
}

/** Xóa ngân sách */
export async function xoaNganSach(id: number) {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Lấy ngân sách theo ID */
export async function layNganSachTheoId(id: number): Promise<NganSachDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${id}`);
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}

/** Lấy giao dịch theo ngân sách (theo danh mục + tháng/năm) */
export async function layGiaoDichTheoNganSach(nganSachId: number): Promise<any[]> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${nganSachId}/giao-dich`);
  if (Array.isArray(response)) {
    return response;
  }
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data ?? [];
  }
  return [];
}
