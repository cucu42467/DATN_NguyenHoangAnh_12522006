import { goiApiGetQt, goiApiDeleteQt } from './goi_api_qt';

const DUONG_DAN = '/admin/phien';

// Interface cho response wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

// Helper: trích xuất data từ response wrapper
function layDuLieu<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
}

/** Lấy danh sách phiên hoạt động (admin) */
export async function layDanhSachPhienQt(riskFilter?: 'high' | 'medium' | 'all') {
  const params = new URLSearchParams();
  if (riskFilter && riskFilter !== 'all') params.append('risk', riskFilter);
  const url = params.toString() ? `${DUONG_DAN}?${params}` : DUONG_DAN;
  const response = await goiApiGetQt<ApiResponse<any>>(url);
  return layDuLieu(response);
}

/** Lấy danh sách phiên của một người dùng cụ thể */
export async function layPhienTheoNguoiDung(nguoiDungId: number) {
  const params = new URLSearchParams({ userId: nguoiDungId.toString() });
  const response = await goiApiGetQt<ApiResponse<any>>(`${DUONG_DAN}?${params}`);
  return layDuLieu(response);
}

/** Revoke/Kill session */
export async function revokePhien(id: string) {
  return goiApiDeleteQt<void>(`${DUONG_DAN}/${id}`);
}

