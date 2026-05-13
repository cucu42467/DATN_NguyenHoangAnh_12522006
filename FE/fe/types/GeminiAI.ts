export interface GeminiPhanTichRequest {
  nguoiDungId: number;
  tuNgay?: string;
  denNgay?: string;
}

export interface GeminiChatRequest {
  tinNhan: string;
  lichSuTinNhan?: GeminiChatMessage[];
  loaiYeuCau: 'TU_DO' | 'PHAN_TICH_CHI_TIEU' | 'GOI_Y_TIET_KIEM' | 'LAP_KHOACH_TAI_CHINH' | 'TRA_LOI_CAU_HOI';
}

export interface GeminiChatMessage {
  vaiTro: 'user' | 'model';
  noiDung: string;
  thoiGian?: string;
}

export interface GeminiChatResponse {
  phanHoi: string;
  loaiPhanHoi: 'TEXT' | 'SUGGESTION' | 'ACTION' | 'WARNING' | 'LIST';
  goiYHanDong?: GeminiGoiYHanDong[];
  duLieuBieuDo?: GeminiDuLieuBieuDo;
  duLieuDanhSach?: GeminiDuLieuDanhSach;
}

export interface GeminiChatTransactionDto {
  giaoDichId: number;
  soTien: number;
  loaiGiaoDich: string;
  danhMucId?: number;
  tenDanhMuc?: string;
  taiKhoanNguonId?: number;
  tenTaiKhoanNguon?: string;
  taiKhoanDichId?: number;
  tenTaiKhoanDich?: string;
  ngayGiaoDich: string;
  ghiChu?: string;
}

export interface GeminiChatDataDto {
  thuNhap: number;
  tongChi: number;
  tongThu: number;
  soDu: number;
  chiTheoDanhMuc: Record<string, number>;
  mucTieu: string[];
  giaoDichChiTiet?: GeminiChatTransactionDto[];
}

export interface GeminiGoiYHanDong {
  hanhDong: string;
  noiDung: string;
  thamSo?: Record<string, string>;
}

export interface GeminiDuLieuBieuDo {
  loaiBieuDo: 'PIE' | 'LINE' | 'BAR';
  nhan: string[];
  giaTri: number[];
  moTa?: string;
}

export interface GeminiDuLieuDanhSach {
  tieuDe: string;
  loai: 'THONG_BAO' | 'GIAO_DICH' | 'TAI_KHOAN' | 'NGAN_SACH' | 'MUC_TIEU' | 'CANH_BAO' | 'GOI_Y' | 'KHAC';
  cacMuc: GeminiMucDanhSach[];
}

export interface GeminiMucDanhSach {
  tieuDe: string;
  moTa?: string;
  giaTri?: string;
  ngay?: string;
  trangThai?: string;
  icon?: string;
  mauSac?: string;
}

export interface GeminiGoiY {
  loai: 'CANH_BAO' | 'GOI_Y' | 'KHICH_LE';
  tieuDe: string;
  noiDung: string;
}

export interface GeminiSoSanh {
  tang: number;
  giam: number;
}

export interface GeminiPhanTichKetQua {
  tongThu: number;
  tongChi: number;
  tyLeTietKiem: string;
  danhMucNhieuNhat: string;
  soSanhThangTruoc: GeminiSoSanh;
}

export interface GeminiPhanTichResponse {
  goiY: GeminiGoiY[];
  phanTich: GeminiPhanTichKetQua;
}

export interface GeminiPhanTichFullData {
  tongThu: number;
  tongChi: number;
  chiTheoDanhMuc: Record<string, number>;
  nganSach?: string;
}
