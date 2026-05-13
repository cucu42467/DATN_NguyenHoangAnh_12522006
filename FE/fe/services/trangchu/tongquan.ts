import { goiApiGet } from '../../thu_vien/goi_api';
import type { TongQuanDto, ApiResponse } from '@/types';

const DUONG_DAN = '/api/tong-quan';

/** Lấy tổng quan tài chính - unwrap data từ API response
 * @param tuNgay - Ngày bắt đầu (FE quyết định)
 * @param denNgay - Ngày kết thúc (FE quyết định)
 */
export async function layTongQuan(
  tuNgay?: string,
  denNgay?: string
): Promise<TongQuanDto | null> {
  const params = new URLSearchParams();
  if (tuNgay) params.append('tuNgay', tuNgay);
  if (denNgay) params.append('denNgay', denNgay);
  
  const queryString = params.toString();
  const url = queryString ? `${DUONG_DAN}?${queryString}` : DUONG_DAN;
  const response = await goiApiGet<any>(url);
  
  // Xử lý response có thể là object trực tiếp hoặc object { success, data, message }
  if (response && typeof response === 'object' && !Array.isArray(response)) {
    // Nếu có data property, lấy data
    if ('data' in response && response.data) {
      return response.data;
    }
    // Nếu response đã là TongQuanDto trực tiếp
    return response;
  }
  
  return null;
}
