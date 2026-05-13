import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../thu_vien/goi_api';

export interface LoaiTaiKhoanDto {
  loaiTaiKhoanId: number;
  tenLoai: string;
}

export interface TaoLoaiTaiKhoanDto {
  tenLoai: string;
}

const DUONG_DAN = '/api/loai-tai-khoan';

/** Lấy danh sách loại tài khoản */
export async function layDanhSachLoaiTaiKhoan(): Promise<LoaiTaiKhoanDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}

/** Lấy chi tiết loại tài khoản */
export async function layChiTietLoaiTaiKhoan(id: number): Promise<LoaiTaiKhoanDto | null> {
  return goiApiGet<LoaiTaiKhoanDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo loại tài khoản mới */
export async function taoLoaiTaiKhoan(dto: TaoLoaiTaiKhoanDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật loại tài khoản */
export async function capNhatLoaiTaiKhoan(id: number, dto: TaoLoaiTaiKhoanDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa loại tài khoản */
export async function xoaLoaiTaiKhoan(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}
