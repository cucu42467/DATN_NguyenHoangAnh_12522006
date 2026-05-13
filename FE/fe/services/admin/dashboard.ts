import { goiAdminGet } from '../qt/goi_api_qt';

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

export interface CanhBaoNganSachAdminDto {
  NguoiDungId: number;
  HoTen: string;
  TenDanhMuc: string;
  PhanTramDaDung: number;
  ThangNam: string;
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

/** Interface nhận từ API (lowercase keys) */
export interface AdminAuditLogApiDto {
  id: number;
  nguoiDungId?: number;
  tenBang: string;
  banGhiId?: number;
  hanhDong: string;
  duLieuCu?: string;
  duLieuMoi?: string;
  thoiGian?: string;
  ipAddress?: string;
}

export interface DashboardTongHopDto {
  TongQuan: DashboardTongQuanDto;
  TangTruongNguoiDung: ThongKeNguoiDungDto;
  GiaoDich6Thang: ThongKeGiaoDichThangDto[];
  ChiTieuDanhMuc: ChiTieuTheoDanhMucDto[];
  CanhBaoNganSach: CanhBaoNganSachAdminDto[];
  HoatDongGanDay: AdminAuditLogDto[];
}

export interface ApiResponse<T> {
  success: boolean;
  thongDiep?: string;
  data?: T;
}

/**
 * Lấy tất cả dữ liệu dashboard từ API (keys lowercase)
 */
export interface DashboardApiResponse {
  tongQuan: {
    tongNguoiDungHoatDong: number;
    nguoiDungMoi7Ngay: number;
    nguoiDungDangNhapHomNay: number;
    tongNguoiDungBiVoHieuHoa: number;
    tongGiaoDichHeThong: number;
    tongThuThangHienTai: number;
    tongChiThangHienTai: number;
    phanHoiChoXuLy: number;
  };
  tangTruongNguoiDung: {
    labels: string[];
    data: number[];
  };
  giaoDich6Thang: {
    thang: string;
    tongThu: number;
    tongChi: number;
  }[];
  chiTieuDanhMuc: {
    tenDanhMuc: string;
    tongTien: number;
    phanTram: number;
  }[];
  canhBaoNganSach: {
    nguoiDungId: number;
    hoTen: string;
    tenDanhMuc: string;
    phanTramDaDung: number;
    thangNam: string;
  }[];
  hoatDongGanDay: {
    id: number;
    nguoiDungId?: number;
    tenBang: string;
    banGhiId?: number;
    hanhDong: string;
    duLieuCu?: string;
    duLieuMoi?: string;
    thoiGian?: string;
    ipAddress?: string;
  }[];
}

/**
 * Chuyển đổi response từ API (lowercase) sang DTO (PascalCase)
 */
function mapApiResponseToDto(apiResponse: ApiResponse<DashboardApiResponse>): DashboardTongHopDto | null {
  if (!apiResponse?.data) return null;

  const data = apiResponse.data;
  return {
    TongQuan: {
      TongNguoiDungHoatDong: data.tongQuan?.tongNguoiDungHoatDong ?? 0,
      NguoiDungMoi7Ngay: data.tongQuan?.nguoiDungMoi7Ngay ?? 0,
      NguoiDungDangNhapHomNay: data.tongQuan?.nguoiDungDangNhapHomNay ?? 0,
      TongNguoiDungBiVoHieuHoa: data.tongQuan?.tongNguoiDungBiVoHieuHoa ?? 0,
      TongGiaoDichHeThong: data.tongQuan?.tongGiaoDichHeThong ?? 0,
      TongThuThangHienTai: data.tongQuan?.tongThuThangHienTai ?? 0,
      TongChiThangHienTai: data.tongQuan?.tongChiThangHienTai ?? 0,
      PhanHoiChoXuLy: data.tongQuan?.phanHoiChoXuLy ?? 0,
    },
    TangTruongNguoiDung: {
      Labels: data.tangTruongNguoiDung?.labels ?? [],
      Data: data.tangTruongNguoiDung?.data ?? [],
    },
    GiaoDich6Thang: (data.giaoDich6Thang ?? []).map(g => ({
      Thang: g.thang,
      TongThu: g.tongThu,
      TongChi: g.tongChi,
    })),
    ChiTieuDanhMuc: (data.chiTieuDanhMuc ?? []).map(c => ({
      TenDanhMuc: c.tenDanhMuc,
      TongTien: c.tongTien,
      PhanTram: c.phanTram,
    })),
    CanhBaoNganSach: (data.canhBaoNganSach ?? []).map(w => ({
      NguoiDungId: w.nguoiDungId,
      HoTen: w.hoTen,
      TenDanhMuc: w.tenDanhMuc,
      PhanTramDaDung: w.phanTramDaDung,
      ThangNam: w.thangNam,
    })),
    HoatDongGanDay: (data.hoatDongGanDay ?? []).map((h: AdminAuditLogApiDto) => ({
      Id: h.id,
      NguoiDungId: h.nguoiDungId,
      TenBang: h.tenBang,
      BanGhiId: h.banGhiId,
      HanhDong: h.hanhDong,
      DuLieuCu: h.duLieuCu,
      DuLieuMoi: h.duLieuMoi,
      ThoiGian: h.thoiGian,
      IpAddress: h.ipAddress,
    })),
  };
}

/**
 * Lấy tất cả dữ liệu dashboard tổng hợp
 */
export async function layDashboardTongHop(): Promise<DashboardTongHopDto | null> {
  try {
    const response = await goiAdminGet<ApiResponse<DashboardApiResponse>>('/admin/dashboard/tong-hop');
    if (!response) {
      console.error('API trả về null/undefined');
      return null;
    }
    return mapApiResponseToDto(response);
  } catch (error) {
    console.error('Lỗi lấy dashboard tổng hợp:', error);
    return null;
  }
}

/**
 * Lấy thống kê tăng trưởng người dùng theo tháng
 */
export async function layThongKeNguoiDung(nam?: number): Promise<ThongKeNguoiDungDto | null> {
  try {
    const url = nam ? `/admin/dashboard/thong-ke-nguoi-dung?nam=${nam}` : '/admin/dashboard/thong-ke-nguoi-dung';
    const response = await goiAdminGet<ApiResponse<{ labels: string[]; data: number[] }>>(url);
    if (response?.data) {
      return {
        Labels: response.data.labels ?? [],
        Data: response.data.data ?? [],
      };
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy thống kê người dùng:', error);
    return null;
  }
}

/**
 * Lấy thống kê giao dịch 6 tháng gần nhất
 */
export async function layThongKeGiaoDich6Thang(): Promise<ThongKeGiaoDichThangDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<{ thang: string; tongThu: number; tongChi: number }[]>>('/admin/dashboard/thong-ke-giao-dich-6-thang');
    if (Array.isArray(response?.data)) {
      return response.data.map(g => ({
        Thang: g.thang,
        TongThu: g.tongThu,
        TongChi: g.tongChi,
      }));
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy thống kê giao dịch 6 tháng:', error);
    return [];
  }
}

/**
 * Lấy chi tiêu theo danh mục (top N)
 */
export async function layChiTieuDanhMuc(top: number = 6): Promise<ChiTieuTheoDanhMucDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<{ tenDanhMuc: string; tongTien: number; phanTram: number }[]>>(`/admin/dashboard/chi-tieu-danh-muc?top=${top}`);
    if (Array.isArray(response?.data)) {
      return response.data.map(c => ({
        TenDanhMuc: c.tenDanhMuc,
        TongTien: c.tongTien,
        PhanTram: c.phanTram,
      }));
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy chi tiêu theo danh mục:', error);
    return [];
  }
}

/**
 * Lấy cảnh báo ngân sách vượt mức
 */
export async function layCanhBaoNganSach(): Promise<CanhBaoNganSachAdminDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<{ nguoiDungId: number; hoTen: string; tenDanhMuc: string; phanTramDaDung: number; thangNam: string }[]>>('/admin/dashboard/canh-bao-ngan-sach');
    if (Array.isArray(response?.data)) {
      return response.data.map(w => ({
        NguoiDungId: w.nguoiDungId,
        HoTen: w.hoTen,
        TenDanhMuc: w.tenDanhMuc,
        PhanTramDaDung: w.phanTramDaDung,
        ThangNam: w.thangNam,
      }));
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy cảnh báo ngân sách:', error);
    return [];
  }
}

/**
 * Lấy hoạt động gần đây (audit log)
 */
export async function layHoatDongGanDay(count: number = 10): Promise<AdminAuditLogDto[]> {
  try {
    const response = await goiAdminGet<ApiResponse<AdminAuditLogApiDto[]>>(`/admin/dashboard/hoat-dong-gan-day?count=${count}`);
    if (Array.isArray(response?.data)) {
      return response.data.map(h => ({
        Id: h.id,
        NguoiDungId: h.nguoiDungId,
        TenBang: h.tenBang,
        BanGhiId: h.banGhiId,
        HanhDong: h.hanhDong,
        DuLieuCu: h.duLieuCu,
        DuLieuMoi: h.duLieuMoi,
        ThoiGian: h.thoiGian,
        IpAddress: h.ipAddress,
      }));
    }
    return [];
  } catch (error) {
    console.error('Lỗi lấy hoạt động gần đây:', error);
    return [];
  }
}
