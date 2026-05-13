/**
 * API service cho trang Báo cáo Admin - Kết hợp API có sẵn từ DashboardController
 * và mở rộng cho các báo cáo mới
 */

import { goiAdminGet } from '../qt/goi_api_qt';

// ==================== TYPES ====================

// Tái sử dụng từ dashboard.ts
export interface DashboardTongQuanDto {
  TongNguoiDungHoatDong: number;
  NguoiDungMoi7Ngay: number;
  NguoiDungDangNhapHomNay: number;
  TongNguoiDungBiVoHieuHoa: number;
  TongGiaoDichHeThong: number;
  TongThuThangHienTai: number;
  TongChiThangHienTai: number;
  PhanHoiChoXuLy: number;
}

export interface ThongKeNguoiDungDto {
  Labels: string[];
  Data: number[];
}

export interface ThongKeGiaoDichThangDto {
  Thang: string;
  TongThu: number;
  TongChi: number;
}

export interface ChiTieuTheoDanhMucDto {
  TenDanhMuc: string;
  TongTien: number;
  PhanTram: number;
}

export interface AdminAuditLogDto {
  Id: number;
  NguoiDungId?: number;
  TenBang: string;
  BanGhiId?: number;
  HanhDong: string;
  DuLieuCu?: string;
  DuLieuMoi?: string;
  ThoiGian?: string;
  IpAddress?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  thongDiep?: string;
  data?: T;
}

// ==================== 1. THỐNG KÊ NGƯỜI DÙNG ====================

export interface ThongKeNguoiDungFullDto {
  TongNguoiDung: number;
  DangHoatDong: number;
  BiKhoa: number;
  DaXoa: number;
  EmailDaXacThuc: number;
  SDTDaXacThuc: number;
  Dang2FA: number;
  TongSocial: number;
  Google: number;
  Facebook: number;
}

export interface NguoiDungMoiTheoThoiGianDto {
  Ngay?: string;
  Tuan?: string;
  Thang?: string;
  SoLuong: number;
}

export interface ThietBiHeDieuHanhDto {
  Ten: string;
  SoLuong: number;
  PhanTram: number;
}

export interface NguoiDungKhongHoatDongDto {
  NguoiDungId: number;
  HoTen: string;
  Email: string;
  LanDangNhapCuoi: string;
  SoNgayKhongHoatDong: number;
}

export interface DAUMAUDto {
  DAU: number;
  MAU: number;
  TyLe: number;
}

// ==================== 2. THỐNG KÊ GIAO DỊCH ====================

export interface ThongKeGiaoDichFullDto {
  TongGiaoDich: number;
  GiaoDichThanhCong: number;
  GiaoDichLoi: number;
  TongThu: number;
  TongChi: number;
  Web: number;
  Mobile: number;
  AI: number;
  Import: number;
}

export interface GiaoDichTheoDanhMucDto {
  DanhMucId: number;
  TenDanhMuc: string;
  SoLuong: number;
  TongTien: number;
  PhanTram: number;
}

export interface GiaoDichDinhKyThongKeDto {
  TongDangHoatDong: number;
  TongNgungHoatDong: number;
  TongNguoiDungSuDung: number;
}

// ==================== 3. THỐNG KÊ THÔNG BÁO & PHẢN HỒI ====================

export interface ThongKeThongBaoDto {
  TongThongBao: number;
  DaDoc: number;
  ChuaDoc: number;
  TyLeDoc: number;
  TheoLoai: ThongBaoTheoLoaiDto[];
}

export interface ThongBaoTheoLoaiDto {
  Loai: string;
  TongSo: number;
  DaDoc: number;
  TyLeDoc: number;
}

export interface ThongKePhanHoiDto {
  TongSo: number;
  ChoXuLy: number;
  DangXuLy: number;
  DaGiaiQuyet: number;
  TuChoi: number;
  ThoiGianXuLyTrungBinh: number;
}

export interface PhanHoiTheoThangDto {
  Thang: string;
  TongSo: number;
  ChoXuLy: number;
  DaGiaiQuyet: number;
}

// ==================== 4. BẢO MẬT & AUDIT ====================

export interface ThongKeBaoMatDto {
  TongDangNhap: number;
  ThanhCong: number;
  ThatBai: number;
  TyLeThatBai: number;
}

export interface DangNhapThatBaiDto {
  Id: number;
  NguoiDungId?: number;
  HoTen?: string;
  Email?: string;
  ThoiGian: string;
  IpAddress?: string;
  ThietBi?: string;
}

export interface AuditLogTheoUserDto {
  NguoiDungId: number;
  HoTen: string;
  Email: string;
  TongThaoTac: number;
  Insert: number;
  Update: number;
  Delete: number;
  HanhDongGanNhat?: string;
  ThoiGianGanNhat?: string;
}

export interface HoatDongBatThuongDto {
  NguoiDungId: number;
  HoTen: string;
  Email: string;
  SoIPKhacNhau: number;
  DanhSachIP: string[];
  SoDangNhapTrongNgay: number;
}

// ==================== API FUNCTIONS ====================

// 1. Lấy dashboard tổng hợp (đã có)
export async function layDashboardTongHop(): Promise<any> {
  try {
    const response = await goiAdminGet<ApiResponse<any>>('/admin/dashboard/tong-hop');
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy dashboard tổng hợp:', error);
    return null;
  }
}

// 2. Lấy thống kê người dùng mở rộng
export async function layThongKeNguoiDungFull(): Promise<ThongKeNguoiDungFullDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<ThongKeNguoiDungFullDto>>(
      '/admin/dashboard/thong-ke-nguoi-dung-full'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê người dùng:', error);
    return null;
  }
}

// 3. Lấy người dùng mới theo thời gian
export async function layNguoiDungMoiTheoThoiGian(
  loai: 'ngay' | 'tuan' | 'thang' = 'thang'
): Promise<NguoiDungMoiTheoThoiGianDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<NguoiDungMoiTheoThoiGianDto[]>>(
      `/admin/dashboard/nguoi-dung-moi?loai=${loai}`
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy người dùng mới:', error);
    return [];
  }
}

// 4. Lấy thống kê thiết bị
export async function layThongKeThietBi(): Promise<ThietBiHeDieuHanhDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<ThietBiHeDieuHanhDto[]>>(
      '/admin/dashboard/thiet-bi'
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy thống kê thiết bị:', error);
    return [];
  }
}

// 5. Lấy DAU/MAU
export async function layDAUMAU(): Promise<DAUMAUDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<DAUMAUDto>>(
      '/admin/dashboard/dau-mau'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy DAU/MAU:', error);
    return null;
  }
}

// 6. Lấy người dùng không hoạt động
export async function layNguoiDungKhongHoatDong(
  soNgay: 30 | 60 | 90 = 30
): Promise<NguoiDungKhongHoatDongDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<NguoiDungKhongHoatDongDto[]>>(
      `/admin/dashboard/nguoi-dung-khong-hoat-dong?soNgay=${soNgay}`
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy người dùng không hoạt động:', error);
    return [];
  }
}

// 7. Lấy thống kê giao dịch mở rộng
export async function layThongKeGiaoDichFull(): Promise<ThongKeGiaoDichFullDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<ThongKeGiaoDichFullDto>>(
      '/admin/dashboard/thong-ke-giao-dich-full'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê giao dịch:', error);
    return null;
  }
}

// 8. Lấy giao dịch theo danh mục
export async function layGiaoDichTheoDanhMuc(): Promise<GiaoDichTheoDanhMucDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<GiaoDichTheoDanhMucDto[]>>(
      '/admin/dashboard/giao-dich-theo-danh-muc'
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy giao dịch theo danh mục:', error);
    return [];
  }
}

// 9. Lấy thống kê giao dịch định kỳ
export async function layGiaoDichDinhKyThongKe(): Promise<GiaoDichDinhKyThongKeDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<GiaoDichDinhKyThongKeDto>>(
      '/admin/dashboard/giao-dich-dinh-ky-thong-ke'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê giao dịch định kỳ:', error);
    return null;
  }
}

// 10. Lấy thống kê thông báo
export async function layThongKeThongBao(): Promise<ThongKeThongBaoDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<ThongKeThongBaoDto>>(
      '/admin/dashboard/thong-ke-thong-bao'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê thông báo:', error);
    return null;
  }
}

// 11. Lấy thống kê phản hồi
export async function layThongKePhanHoi(): Promise<ThongKePhanHoiDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<ThongKePhanHoiDto>>(
      '/admin/dashboard/thong-ke-phan-hoi'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê phản hồi:', error);
    return null;
  }
}

// 12. Lấy thống kê bảo mật
export async function layThongKeBaoMat(): Promise<ThongKeBaoMatDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<ThongKeBaoMatDto>>(
      '/admin/dashboard/thong-ke-bao-mat'
    );
    return response?.data ?? null;
  } catch (error) {
    console.error('Lỗi lấy thống kê bảo mật:', error);
    return null;
  }
}

// 13. Lấy đăng nhập thất bại
export async function layDangNhapThatBai(
  gioiHan: number = 50
): Promise<DangNhapThatBaiDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<DangNhapThatBaiDto[]>>(
      `/admin/dashboard/dang-nhap-that-bai?gioiHan=${gioiHan}`
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy đăng nhập thất bại:', error);
    return [];
  }
}

// 14. Lấy audit log theo user
export async function layAuditLogTheoUser(): Promise<AuditLogTheoUserDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<AuditLogTheoUserDto[]>>(
      '/admin/dashboard/audit-log-theo-user'
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy audit log theo user:', error);
    return [];
  }
}

// 15. Lấy hoạt động bất thường
export async function layHoatDongBatThuong(): Promise<HoatDongBatThuongDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<HoatDongBatThuongDto[]>>(
      '/admin/dashboard/hoat-dong-bat-thuong'
    );
    return response?.data ?? [];
  } catch (error) {
    console.error('Lỗi lấy hoạt động bất thường:', error);
    return [];
  }
}
