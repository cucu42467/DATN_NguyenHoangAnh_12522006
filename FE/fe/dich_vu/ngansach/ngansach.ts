import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { NganSachDto, ThietLapNganSachDto } from '../../types/index';

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

/** Xóa ngân sách */
export async function xoaNganSach(id: number) {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
