import { goiApiGetQt } from './goi_api_qt';

const DUONG_DAN = '/admin/import';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ImportFileData {
  importId: number;
  taiKhoanId: number;
  tenFile: string | null;
  ngayImport: string | null;
  tongDong: number;
  soDongThanhCong: number;
  soDongLoi: number;
  trangThai: number;
}

export interface ImportChiTietData {
  id: number;
  importId: number;
  ngayGiaoDich: string | null;
  moTa: string | null;
  soTien: number | null;
  danhMucGoiY: number | null;
  doTinCay: number | null;
  trangThaiXuLy: number;
  ghiChuLoi: string | null;
}

/** Lấy danh sách file import (admin) */
export async function layDanhSachImport(
  page: number = 1,
  pageSize: number = 20,
  trangThai?: number
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (trangThai !== undefined) params.append('trangThai', trangThai.toString());

  const response = await goiApiGetQt<ApiResponse<ImportFileData[]>>(
    `${DUONG_DAN}?${params.toString()}`
  );
  return response.data;
}

/** Lấy chi tiết file import */
export async function layChiTietImport(importId: number, page: number = 1, pageSize: number = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await goiApiGetQt<ApiResponse<ImportChiTietData[]>>(
    `${DUONG_DAN}/${importId}/chi-tiet?${params.toString()}`
  );
  return response.data;
}
