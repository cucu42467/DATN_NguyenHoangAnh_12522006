import { goiApiGetQt, goiApiPostQt, goiApiPutQt, goiApiDeleteQt } from './goi_api_qt';

const DUONG_DAN = '/admin/nguoi-dung';

// Interface cho response wrapper của API admin
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}

// ============ INTERFACES ============

// Interface cho NguoiDung Item (trong bảng danh sách)
export interface NguoiDungItem {
  nguoiDungId: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  vaiTro: string[];
  trangThai?: number; // 1: Hoạt động, 0: Khóa
  daXoa?: number; // 1: Đã xóa, 0: Chưa xóa
  emailDaXacThuc?: number; // 1: Đã xác thực, 0: Chưa
  lanDangNhapCuoi?: string;
  ngayTao?: string;
  phuongThucDangNhap?: 'THUONG' | 'GOOGLE';
}

// Filter cho danh sách người dùng
export interface LocNguoiDungDto {
  search?: string;
  vaiTro?: string;
  trangThai?: 'HOAT_DONG' | 'KHOA' | 'DA_XOA';
  phuongThucDangNhap?: 'THUONG' | 'GOOGLE';
  tuNgay?: string;
  denNgay?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Chi tiết người dùng đầy đủ (cho drawer)
export interface NguoiDungChiTietDto {
  nguoiDungId: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  vaiTro: string[];
  trangThai: number;
  daXoa: number;
  emailDaXacThuc: number;
  soDienThoaiDaXacThuc: number;
  lanDangNhapCuoi?: string;
  ngayTao: string;
  // Thông tin tài chính
  taiKhoan: TaiKhoanThongKeDto[];
  giaoDich: GiaoDichThongKeDto;
  // Liên kết mạng xã hội
  socialLogins: SocialLoginDto[];
  // Cài đặt
  caiDat?: CaiDatDto;
}

// Thông tin tài khoản ngân hàng
export interface TaiKhoanThongKeDto {
  taiKhoanId: number;
  tenTaiKhoan: string;
  loaiTaiKhoan: string;
  soDu: number;
  icon?: string;
  mauSac?: string;
}

// Thống kê giao dịch
export interface GiaoDichThongKeDto {
  tongGiaoDich: number;
  tongThuThang: number;
  tongChiThang: number;
}

// Liên kết mạng xã hội
export interface SocialLoginDto {
  id: number;
  provider: string;
  emailSocial?: string;
  ngayLienKet: string;
}

// Cài đặt người dùng
export interface CaiDatDto {
  ngonNgu?: string;
  tienTe?: string;
  cheDoToi?: boolean;
  dinhDangNgay?: string;
  nhanThongBao?: boolean;
}

// Vai trò
export interface VaiTroDto {
  vaiTroId: number;
  tenVaiTro: string;
}

// DTO tạo người dùng mới
export interface TaoNguoiDungDto {
  hoTen: string;
  email: string;
  soDienThoai?: string;
  matKhau: string;
  vaiTroId: number;
  trangThai?: number;
}

// DTO cập nhật người dùng
export interface CapNhatNguoiDungDto {
  hoTen?: string;
  soDienThoai?: string;
  vaiTroId?: number;
  trangThai?: number;
}

// DTO khóa tài khoản
export interface KhoaTaiKhoanDto {
  lyDo: string;
}

// Lịch sử đăng nhập
export interface LichSuDangNhapNguoiDungDto {
  id: number;
  thoiGian: string;
  thietBi?: string;
  ipAddress?: string;
  ketQua: boolean;
  heDieuHanh?: string;
  viTri?: string;
}

// Kết quả phân trang
export interface PagedNguoiDung {
  items: NguoiDungItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Thống kê tổng quan người dùng
export interface ThongKeTongQuanNguoiDung {
  tongNguoiDung: number;
  dangHoatDong: number;
  biKhoa: number;
  dangKyThangNay: number;
}

// ============ HELPER ============

function layDuLieu<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
}

// ============ APIS ============

/** Lấy danh sách người dùng (admin) - mở rộng với filter */
export async function layDanhSachNguoiDungQt(
  filter: LocNguoiDungDto = {}
): Promise<PagedNguoiDung> {
  const params = new URLSearchParams();
  
  if (filter.search) params.append('search', filter.search);
  if (filter.vaiTro) params.append('vaiTro', filter.vaiTro);
  if (filter.trangThai) params.append('trangThai', filter.trangThai);
  if (filter.phuongThucDangNhap) params.append('phuongThucDangNhap', filter.phuongThucDangNhap);
  if (filter.tuNgay) params.append('tuNgay', filter.tuNgay);
  if (filter.denNgay) params.append('denNgay', filter.denNgay);
  if (filter.page) params.append('page', filter.page.toString());
  if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter.sortBy) params.append('sortBy', filter.sortBy);
  if (filter.sortOrder) params.append('sortDir', filter.sortOrder);
  
  const url = params.toString() ? `${DUONG_DAN}?${params}` : DUONG_DAN;
  const response = await goiApiGetQt<ApiResponse<PagedNguoiDung>>(url);
  return layDuLieu(response);
}

/** Lấy chi tiết người dùng đầy đủ */
export async function layChiTietNguoiDungQt(id: number): Promise<NguoiDungChiTietDto | null> {
  try {
    const response = await goiApiGetQt<ApiResponse<NguoiDungChiTietDto>>(`${DUONG_DAN}/${id}`);
    return layDuLieu(response);
  } catch {
    return null;
  }
}

/** Lấy lịch sử đăng nhập của người dùng */
export async function layLichSuDangNhapNguoiDung(
  nguoiDungId: number,
  page = 1,
  pageSize = 10
): Promise<{ items: LichSuDangNhapNguoiDungDto[]; totalCount: number }> {
  const response = await goiApiGetQt<ApiResponse<{ items: LichSuDangNhapNguoiDungDto[]; totalCount: number }>>(
    `${DUONG_DAN}/${nguoiDungId}/lich-su-dang-nhap?page=${page}&pageSize=${pageSize}`
  );
  return layDuLieu(response);
}

/** Tạo người dùng mới */
export async function taoNguoiDungQt(dto: TaoNguoiDungDto): Promise<number> {
  const response = await goiApiPostQt<ApiResponse<number>>(`${DUONG_DAN}`, dto);
  return layDuLieu(response);
}

/** Cập nhật người dùng */
export async function capNhatNguoiDungQt(id: number, dto: CapNhatNguoiDungDto): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}`, dto);
}

/** Khóa tài khoản */
export async function khoaTaiKhoanQt(id: number, dto: KhoaTaiKhoanDto): Promise<void> {
  await goiApiPostQt<ApiResponse<void>>(`${DUONG_DAN}/${id}/khoa`, dto);
}

/** Mở khóa tài khoản */
export async function moKhoaTaiKhoanQt(id: number): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}/mo-khoa`);
}

/** Xóa mềm người dùng */
export async function xoaMemNguoiDungQt(id: number, email: string): Promise<void> {
  await goiApiDeleteQt<ApiResponse<void>>(`${DUONG_DAN}/${id}?email=${encodeURIComponent(email)}`);
}

/** Cập nhật vai trò nhanh */
export async function capNhatVaiTroNguoiDungQt(id: number, vaiTro: string): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/${id}/vai-tro`, { vaiTro });
}

/** Reset mật khẩu - gửi email đặt lại */
export async function guiEmailResetMatKhauQt(email: string): Promise<void> {
  await goiApiPostQt<ApiResponse<void>>(`${DUONG_DAN}/reset-mat-khau`, { email });
}

/** Khóa/Mở khóa hàng loạt */
export async function khoaNhieuTaiKhoanQt(ids: number[], lyDo: string): Promise<void> {
  await goiApiPostQt<ApiResponse<void>>(`${DUONG_DAN}/khoa-nhieu`, { ids, lyDo });
}

export async function moKhoaNhieuTaiKhoanQt(ids: number[]): Promise<void> {
  await goiApiPutQt<ApiResponse<void>>(`${DUONG_DAN}/mo-khoa-nhieu`, { ids });
}

/** Xuất danh sách người dùng ra Excel */
export async function xuatExcelNguoiDungQt(filter?: LocNguoiDungDto): Promise<Blob> {
  const params = new URLSearchParams();
  if (filter) {
    if (filter.search) params.append('search', filter.search);
    if (filter.vaiTro) params.append('vaiTro', filter.vaiTro);
    if (filter.trangThai) params.append('trangThai', filter.trangThai);
    if (filter.tuNgay) params.append('tuNgay', filter.tuNgay);
    if (filter.denNgay) params.append('denNgay', filter.denNgay);
  }
  
  const url = `${DUONG_DAN}/xuat-excel${params.toString() ? `?${params}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Không thể xuất Excel');
  }
  
  return response.blob();
}

/** Lấy thống kê tổng quan người dùng */
export async function layThongKeTongQuanNguoiDung(): Promise<ThongKeTongQuanNguoiDung> {
  const response = await goiApiGetQt<ApiResponse<ThongKeTongQuanNguoiDung>>(`${DUONG_DAN}/thong-ke`);
  return layDuLieu(response);
}

/** Lấy thống kê theo bộ lọc hiện tại */
export async function layThongKeTheoLoc(filter: LocNguoiDungDto): Promise<ThongKeTongQuanNguoiDung> {
  const params = new URLSearchParams();
  if (filter.search) params.append('search', filter.search);
  if (filter.vaiTro) params.append('vaiTro', filter.vaiTro);
  if (filter.trangThai) params.append('trangThai', filter.trangThai);
  if (filter.phuongThucDangNhap) params.append('phuongThucDangNhap', filter.phuongThucDangNhap);
  if (filter.tuNgay) params.append('tuNgay', filter.tuNgay);
  if (filter.denNgay) params.append('denNgay', filter.denNgay);
  
  const url = `${DUONG_DAN}/thong-ke-theo-loc${params.toString() ? `?${params}` : ''}`;
  const response = await goiApiGetQt<ApiResponse<ThongKeTongQuanNguoiDung>>(url);
  return layDuLieu(response);
}

// ============ DEPRECATED (giữ lại để tương thích ngược) ============

/** @deprecated Sử dụng layDanhSachNguoiDungQt với LocNguoiDungDto */
export async function layDanhSachNguoiDungCu(
  page: number = 1, 
  pageSize: number = 10, 
  search?: string, 
  role?: string
): Promise<PagedNguoiDung> {
  return layDanhSachNguoiDungQt({ page, pageSize, search, vaiTro: role });
}

/** @deprecated Sử dụng layChiTietNguoiDungQt */
export async function layChiTietNguoiDungCu(id: number) {
  return layChiTietNguoiDungQt(id);
}

/** @deprecated Sử dụng moKhoaTaiKhoanQt */
export async function toggleTrangThaiNguoiDungQt(id: number, active: boolean) {
  if (active) {
    return moKhoaTaiKhoanQt(id);
  } else {
    return khoaTaiKhoanQt(id, { lyDo: 'Khóa từ quản trị' });
  }
}

/** @deprecated Sử dụng capNhatVaiTroNguoiDungQt với vai trò mới */
export async function capNhatVaiTroNguoiDungCu(id: number, role: string) {
  return capNhatVaiTroNguoiDungQt(id, role);
}

