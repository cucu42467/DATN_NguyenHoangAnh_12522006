import { goiApiGetQt } from './goi_api_qt';

const DUONG_DAN = '/admin/giao-dich';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GiaoDichData {
  giaoDichId: number;
  nguoiDungId: number;
  hoTen: string;
  soTien: number;
  loaiGiaoDich: number;
  ngayGiaoDich: string;
  moTa: string | null;
  tenDanhMuc: string | null;
  tenTaiKhoan: string | null;
}

export interface LocGiaoDich {
  page?: number;
  pageSize?: number;
  userId?: number;
  loai?: number;
  tuNgay?: string;
  denNgay?: string;
  q?: string;
}

/** Lấy danh sách giao dịch (admin) */
export async function layDanhSachGiaoDichQt(options: LocGiaoDich = {}) {
  const params = new URLSearchParams();
  if (options.page) params.append('page', options.page.toString());
  if (options.pageSize) params.append('pageSize', options.pageSize.toString());
  if (options.userId) params.append('userId', options.userId.toString());
  if (options.loai !== undefined) params.append('loai', options.loai.toString());
  if (options.tuNgay) params.append('tuNgay', options.tuNgay);
  if (options.denNgay) params.append('denNgay', options.denNgay);
  if (options.q) params.append('q', options.q);

  const queryString = params.toString();
  const url = `${DUONG_DAN}${queryString ? `?${queryString}` : ''}`;
  const response = await goiApiGetQt<ApiResponse<PagedResult<GiaoDichData>>>(url);
  return response.data;
}
