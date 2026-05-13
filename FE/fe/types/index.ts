/**
 * Shared Types - Global DTOs and Interfaces
 */

// Re-export selected shared types to avoid ambiguous star exports.
export {
  LoaiGiaoDich,
  LoaiGiaoDichEnum,
  type GiaoDichType,
  type GiaoDichDinhKyType,
  type BoLocGiaoDichType,
} from "./GiaoDich";
export type {
  LoaiTaiKhoanType,
} from "./TaiKhoan";
export type {
  ChuyenTienNoiBoDto,
} from "./TaiKhoan";
export {
  type TaiKhoanDto,
  type TaoTaiKhoanDto,
} from "./TaiKhoan";
export * from "./DanhMuc";
export * from "./HoSo";
export * from "./TrungTamAI";
export * from "./GeminiAI";
export * from "./ThongBao";

// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// User DTOs
export interface NguoiDungDto {
  nguoiDungId: number;
  email: string;
  hoTen: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  vaiTro: string[];
  ngayTao: string;
  emailDaXacThuc: number;
  soDienThoaiDaXacThuc: number;
  dang2FA: number;
  lanDangNhapCuoi?: string;
  daXoa?: number;
  trangThai: number;
}

export interface LichSuDangNhapDto {
  lichSuId: number;
  thoiGian: string;
  diaChiIp: string;
  thietBi?: string;
  trangThai: number;
}

// Type cho API login history (QT API)
export interface LichSuDangNhapQtDto {
  id: number;
  nguoiDungId: number;
  hoTen: string;
  thoiGian: string;
  ipAddress: string | null;
  thietBi: string | null;
  heDieuHanh: string | null;
  viTri: string | null;
  thanhCong: boolean;
}

export interface DoiMatKhauDto {
  matKhauCu: string;
  matKhauMoi: string;
}

export interface CaiDatHanhViDto {
  maNgonNgu?: string;
  maTienTe?: string;
  dang2FA?: boolean;
}

export interface NguoiDungTomTatDto {
  nguoiDungId: number;
  hoTen: string;
  email: string;
}

// TongQuan DTOs
export interface TongQuanDto {
  tongThu: number;
  tongChi: number;
  soDuThuan: number;
  soGiaoDich: number;
  bieuDoChiTieu: ThongKeThangDto[];
  bieuDoDanhMuc: ThongKeDanhMucDto[];
  danhSachNganSach: NganSachTomTatDto[];
  danhSachMucTieu: MucTieuTomTatDto[];
}

export interface ThongKeThangDto {
  thang: number;
  nam: number;
  tongThu: number;
  tongChi: number;
}

export interface ThongKeDanhMucDto {
  tenDanhMuc: string;
  mauSac: string | null;
  tongTien: number;
}

export interface NganSachTomTatDto {
  nganSachId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daDung: number;
  mauSac?: string | null;
}

export interface MucTieuTomTatDto {
  mucTieuId: number;
  tenMucTieu: string;
  soTienMucTieu: number;
  soTienHienTai: number;
  mauSac?: string | null;
}

// AI DTOs
export interface LoiKhuyenAIDto {
  id: number;
  tieuDe: string;
  noiDung: string;
  loai: 'CANH_BAO' | 'GOI_Y' | 'KHICH_LE';
  ngayTao: string;
}

// DanhMuc DTOs
export interface DanhMucDto {
  danhMucId: number;
  tenDanhMuc: string;
  loaiDanhMuc: 'CHI' | 'THU';
  chaId?: number;
  icon?: string;
  mauSac?: string;
  capDo?: number;
  duongDan?: string;
  daXoa?: boolean;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

export interface TaoDanhMucDto {
  tenDanhMuc: string;
  loaiDanhMuc: 'CHI' | 'THU';
  chaId?: number;
  icon?: string;
  mauSac?: string;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

// GiaoDich DTOs
export interface GiaoDichDto {
  giaoDichId: number;
  taiKhoanNguonId: number;
  tenTaiKhoanNguon: string;
  taiKhoanDichId?: number;
  tenTaiKhoanDich?: string;
  danhMucId?: number;
  tenDanhMuc?: string;
  loaiDanhMucId?: number; // 1 = Thu nhập, 2 = Chi tiêu
  tenLoaiDanhMuc?: string; // "Thu nhập" hoặc "Chi tiêu"
  loaiGiaoDich: string;
  soTien: number;
  tienTe?: string; // Tiền tệ (default: VND)
  tyGiaQuyDoi?: number; // Tỷ giá quy đổi (default: 1)
  ngayGiaoDich: string;
  ghiChu?: string;
  // ← THÊM MỚI: tenGiaoDich
  tenGiaoDich?: string;
  doTinCayAI?: number;
  tepDinhKem?: string;
  trangThai?: number; // 1=Thành công, 0=Lỗi, 2=Đang xử lý
  nguonTao?: string; // web / mobile / ai / import
  viTri?: string; // Tọa độ GPS
  laTuDong?: boolean; // Giao dịch tự động
  maGiaoDichNgoai?: string; // Mã giao dịch đồng bộ từ ngân hàng
  nguoiDungId?: number;
}

export interface TaoGiaoDichDto {
  taiKhoanNguonId: number;
  taiKhoanDichId?: number;
  danhMucId?: number;
  loaiGiaoDich: string;
  soTien: number;
  tienTe?: string; // Tiền tệ (default: VND)
  tyGiaQuyDoi?: number; // Tỷ giá quy đổi (default: 1)
  ngayGiaoDich?: string;
  ghiChu?: string;
  // ← THÊM MỚI: tenGiaoDich
  tenGiaoDich?: string;
  tepDinhKem?: string;
  trangThai?: number; // 1=Thành công, 0=Lỗi, 2=Đang xử lý
  nguonTao?: string;
  viTri?: string;
  laTuDong?: boolean;
  doTinCay?: number;
  maGiaoDichNgoai?: string;
}

export interface LocGiaoDichDto {
  tuNgay?: string;
  denNgay?: string;
  danhMucId?: number;
  tenLoaiDanhMuc?: string; // "Chi tiêu" hoặc "Thu nhập"
  taiKhoanNguonId?: number;
  soTienTu?: number;
  soTienDen?: number;
  ghiChu?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'ngayGiaoDich' | 'soTien' | 'giaoDichId';
  sortOrder?: 'asc' | 'desc';
}

export interface GiaoDichDinhKyDto {
  giaoDichDinhKyId: number;
  tenDanhMuc: string;
  soTien: number;
  loaiGiaoDich: string;
  tanSuat: 'HANG_NGAY' | 'HANG_TUAN' | 'HANG_THANG' | 'HANG_NAM';
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: boolean;
  // ← THÊM MỚI: 3 trường mới
  moTa?: string;
  soLanDaThucHien?: number;
  lanThucHienCuoi?: string;
}

export interface TaoGiaoDichDinhKyDto {
  danhMucId?: number;
  taiKhoanNguonId: number;
  taiKhoanDichId?: number;
  loaiGiaoDich: string;
  soTien: number;
  tanSuat: 'HANG_NGAY' | 'HANG_TUAN' | 'HANG_THANG' | 'HANG_NAM';
  ngayBatDau: string;
  ngayKetThuc?: string;
  ghiChu?: string;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

// NganSach DTOs
export interface NganSachDto {
  nganSachId: number;
  danhMucId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daDung: number;
  thang: number;
  nam: number;
  // ← THÊM MỚI: 2 trường mới
  ghiChu?: string;
  canhBaoPhanTram?: number;  // Ngưỡng cảnh báo % (mặc định 80)
}

export interface ThietLapNganSachDto {
  danhMucId: number;
  hanMuc: number;
  thang: number;
  nam: number;
  // ← THÊM MỚI: ghiChu
  ghiChu?: string;
}

// MucTieu DTOs
export interface MucTieuDto {
  mucTieuId: number;
  tenMucTieu: string;
  soTienMucTieu: number;
  soTienHienTai: number;
  mauSac?: string;
  // ← THÊM MỚI: moTa, uuTien
  moTa?: string;
  uuTien?: number;  // 1=Cao, 2=Trung bình, 3=Thấp
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: number;
}

export interface TaoMucTieuDto {
  tenMucTieu: string;
  soTienMucTieu: number;
  // ← THÊM MỚI: moTa, uuTien
  moTa?: string;
  uuTien?: number;
  soTienHienTai?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface DongGopMucTieuDto {
  giaoDichId: number;
  mucTieuId: number;
  soTien: number;
  ngayGiaoDich: string;
  ghiChu?: string;
}

export interface TaoDongGopMucTieuDto {
  soTien: number;
  ngayGiaoDich?: string;
  ghiChu?: string;
}

// BaoCao DTOs
export interface BaoCaoTongHopChiSoDto {
  tongThu: number;
  tongChi: number;
  tietKiem: number;
  soGiaoDich: number;
}

export interface BaoCaoTongQuanDto {
  labels: string[];
  series: { name: string; data: number[] }[];
}

export interface PhanBoDanhMucDto {
  danhMuc: string;
  soTien: number;
  tyLe: number;
}

export interface DuDoanAIChartDto {
  months: string[];
  actual: number[];
  forecast: number[];
}

// DTOs cho đồng bộ dữ liệu
export interface DongBoKetQuaDto {
  soBanGhiDongBo: number;
  tongSoBanGhi: number;
  cacBanGhiLech: LechNganSachDto[];
  tongChenhLech: number;
  thongBao: string;
}

export interface LechNganSachDto {
  danhMucId: number;
  tenDanhMuc: string;
  thang: number;
  nam: number;
  soTienTuGiaoDich: number;
  soTienTuNganSach: number;
  chenhLech: number;
}

// ============== BÁO CÁO TÀI KHOẢN ==============

export interface LoaiTaiKhoanPhanBoDto {
  loaiTaiKhoanId: number;
  tenLoai: string;
  tongSoDu: number;
  tyLe: number;
  soLuongTaiKhoan: number;
}

export interface TaiKhoanBaoCaoDto {
  taiKhoanId: number;
  tenTaiKhoan: string;
  tenLoaiTaiKhoan: string;
  soDuHienTai: number;
  soDuDauThang: number;
  soDuCuoiThang: number;
  bienDong: number;
  hanMuc: number | null;
  daSuDung: number | null;
  tyLeSuDung: number | null;
}

export interface BaoCaoTaiKhoanDto {
  tongTaiSan: number;
  phanBoTheoLoai: LoaiTaiKhoanPhanBoDto[];
  danhSachTaiKhoan: TaiKhoanBaoCaoDto[];
  bienDongSoDu: BaoCaoTongQuanDto;
}

// ============== BÁO CÁO DANH MỤC CHI TIÊU ==============

export interface DanhMucChiTieuDto {
  danhMucId: number;
  tenDanhMuc: string;
  danhMucChaId: number | null;
  tongTien: number;
  soGiaoDich: number;
  tyLe: number;
}

export interface DanhMucSoSanhDto {
  danhMucId: number;
  tenDanhMuc: string;
  tienThangNay: number;
  tienThangTruoc: number;
  chenhLech: number;
  tyLeThayDoi: number;
}

export interface DanhMucConDto {
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
}

export interface DanhMucChaDto {
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
  danhMucCon: DanhMucConDto[];
}

export interface TopDanhMucDto {
  rank: number;
  danhMucId: number;
  tenDanhMuc: string;
  tongTien: number;
  soGiaoDich: number;
  tyLe: number;
}

export interface BaoCaoDanhMucDto {
  tongChiTieu: number;
  soGiaoDich: number;
  chiTieuTheoDanhMuc: DanhMucChiTieuDto[];
  soSanhThangTruoc: DanhMucSoSanhDto[];
  danhMucCha: DanhMucChaDto[];
  topDanhMuc: TopDanhMucDto[];
}

// ============== BÁO CÁO NGÂN SÁCH ==============

export interface NganSachChiTietDto {
  nganSachId: number;
  danhMucId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daSuDung: number;
  conLai: number;
  tyLeSuDung: number;
  laVuot: boolean;
}

export interface NganSachCanhBaoDto {
  danhMucId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daSuDung: number;
  tyLeSuDung: number;
  mucDo: 'VUOT' | 'GAN_VUOT' | 'BINH_THUONG';
}

export interface NganSachLichSuDto {
  thang: number;
  nam: number;
  tongHanMuc: number;
  tongDaSuDung: number;
  coVuot: boolean;
  tyLeSuDung: number;
}

export interface BaoCaoNganSachDto {
  tongHanMuc: number;
  tongDaSuDung: number;
  tongConLai: number;
  tyLeSuDungTrungBinh: number;
  chiTietNganSach: NganSachChiTietDto[];
  canhBao: NganSachCanhBaoDto[];
  lichSuThucHien: NganSachLichSuDto[];
  tyLeTuanThu: number;
}

// ============== BÁO CÁO MỤC TIÊU TIẾT KIỆM ==============

export interface DongGopDto {
  dongGopId: number;
  soTien: number;
  ngayTao: string;
  ghiChu: string | null;
}

export interface MucTieuBaoCaoDto {
  mucTieuId: number;
  tenMucTieu: string;
  moTa: string | null;
  mucTieu: number;
  daDat: number;
  conLai: number;
  tyLeHoanThanh: number;
  trungBinhThang: number;
  ngayDuKien: string | null;
  hanChot: string | null;
  daHoanThanh: boolean;
  lichSuDongGop: DongGopDto[];
}

export interface BaoCaoMucTieuDto {
  tongMucTieu: number;
  mucTieuHoanThanh: number;
  tongDaTietKiem: number;
  danhSachMucTieu: MucTieuBaoCaoDto[];
}

export type loiKhuyenAIDto = LoiKhuyenAIDto;
