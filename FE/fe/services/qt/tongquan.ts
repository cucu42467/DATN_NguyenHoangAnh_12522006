import { goiApiGetQt } from './goi_api_qt';

const DUONG_DAN = '/admin/tong-quan';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface TangTruongUserData {
  labels: string[];
  series: {
    name: string;
    data: number[];
  }[];
}

/** Lấy tổng quan admin (stats) */
export async function layTongQuanAdmin() {
  const response = await goiApiGetQt<ApiResponse<{
    tongNguoiDung: number;
    tongGiaoDich: number;
    tongImport: number;
    tongNguoiDungHoatDong?: number;
    tongNguoiDungBiVoHieuHoa?: number;
  }>>(DUONG_DAN);
  return response.data;
}

/** Lấy dữ liệu tăng trưởng user theo bộ lọc */
export async function layTangTruongUser(options?: {
  nam?: number;
  duration?: 'day' | 'week' | 'month' | 'year';
  tuNgay?: string;
  denNgay?: string;
}) {
  const params = new URLSearchParams();
  if (options?.nam) params.append('nam', options.nam.toString());
  if (options?.duration) params.append('duration', options.duration);
  if (options?.tuNgay) params.append('tuNgay', options.tuNgay);
  if (options?.denNgay) params.append('denNgay', options.denNgay);
  
  const queryString = params.toString();
  const url = `${DUONG_DAN}/tang-truong-user${queryString ? `?${queryString}` : ''}`;
  const response = await goiApiGetQt<ApiResponse<TangTruongUserData>>(url);
  return response.data;
}
