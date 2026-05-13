import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { TaiKhoanDto, TaoTaiKhoanDto, ChuyenTienNoiBoDto, LoaiTaiKhoanType } from '@/types/TaiKhoan';

const DUONG_DAN = '/api/tai-khoan';

/** Lấy danh sách tài khoản */
export async function layDanhSachTaiKhoan(): Promise<TaiKhoanDto[]> {
  const response = await goiApiGet<any>(DUONG_DAN);
  
  let rawData: any[] = [];
  if (Array.isArray(response)) {
    rawData = response;
  } else if (response?.data) {
    rawData = response.data;
  } else if (response?.items) {
    rawData = response.items;
  }
  
  const accounts: TaiKhoanDto[] = rawData.map((item: any) => ({
    taiKhoanId: item.taiKhoanId,
    tenTaiKhoan: item.tenTaiKhoan,
    loaiTaiKhoan: item.loaiTaiKhoan,
    soDu: item.soDu ?? 0,
    soDuBanDau: item.soDuBanDau,
    tienTe: item.tienTe,
    mauSac: item.mauSac,
    icon: item.icon,
    nguoiDungId: item.nguoiDungId,
    laMacDinh: item.laMacDinh,
    tenNganHang: item.tenNganHang,
    soTaiKhoan: item.soTaiKhoan,
    hanMucTinDung: item.hanMucTinDung,
    ngayCapNhatSoDu: item.ngayCapNhatSoDu,
  }));
  
  return accounts;
}

/** Lấy chi tiết tài khoản */
export async function layChiTietTaiKhoan(id: number): Promise<TaiKhoanDto | null> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/${id}`);
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}

/** Tạo tài khoản mới */
export async function taoTaiKhoan(dto: TaoTaiKhoanDto): Promise<number> {
  return goiApiPost<number>(DUONG_DAN, dto);
}

/** Cập nhật tài khoản */
export async function capNhatTaiKhoan(id: number, dto: TaoTaiKhoanDto): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}`, dto);
}

/** Xóa tài khoản */
export async function xoaTaiKhoan(id: number): Promise<void> {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Cập nhật trạng thái tài khoản */
export async function capNhatTrangThaiTaiKhoan(id: number, trangThai: number): Promise<void> {
  return goiApiPut<void>(`${DUONG_DAN}/${id}/trang-thai`, { trangThai });
}

/** Chuyển tiền nội bộ */
export async function chuyenTienNoiBo(dto: ChuyenTienNoiBoDto): Promise<number> {
  return goiApiPost<number>(`${DUONG_DAN}/chuyen-tien-noi-bo`, dto);
}

/** Lấy danh sách loại tài khoản */
export async function layDanhSachLoaiTaiKhoan(): Promise<LoaiTaiKhoanType[]> {
  const response = await goiApiGet<any>('/api/loai-tai-khoan');
  if (Array.isArray(response)) return response;
  return response?.data ?? response?.items ?? [];
}
