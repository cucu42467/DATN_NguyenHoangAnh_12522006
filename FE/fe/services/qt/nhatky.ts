import { goiApiGetQt } from './goi_api_qt';

const DUONG_DAN = '/admin/audit-log';

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

/** Lấy danh sách nhật ký audit (admin) */
export async function layDanhSachNhatKyQt(typeFilter?: string, search?: string, page = 1) {
  const params = new URLSearchParams({ page: page.toString() });
  if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter);
  if (search) params.append('search', search);
  const url = params.toString() ? `${DUONG_DAN}?${params}` : DUONG_DAN;
  const response = await goiApiGetQt<ApiResponse<any>>(url);
  return layDuLieu(response);
}

