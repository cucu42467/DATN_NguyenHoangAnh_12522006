// Kieu du lieu tuong ung voi DTO cua API_QT

/** NguoiDungTomTatDto — GET admin/NguoiDung */
export interface AdminNguoiDungDto {
  nguoiDungId: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  vaiTro: string[];
  /** Khoa hoac hoat dong — BE se them sau neu can */
  daKhoa?: boolean;
  ngayTao?: string;
}

/** AdminGiaoDichDto — GET admin/giaodich */
export interface AdminGiaoDichDto {
  giaoDichId: number;
  nguoiDungId: number;
  hoTen: string;
  soTien: number;
  loaiGiaoDich: number; // 0=CHI, 1=THU, 2=CHUYEN_KHOAN
  ngayGiaoDich: string;
  moTa?: string;
  tenDanhMuc?: string;
  tenTaiKhoan?: string;
}

/** AdminAuditLogDto — GET admin/audit-log */
export interface AdminAuditLogDto {
  id: number;
  nguoiDungId?: number;
  tenBang: string;
  banGhiId?: number;
  hanhDong: string;
  thoiGian?: string;
  ipAddress?: string;
}

/** AdminTokenDto — GET admin/phien */
export interface AdminTokenDto {
  tokenId: number;
  nguoiDungId: number;
  ngayTao?: string;
  ngayHetHan?: string;
}

/** AdminTongQuanDto — GET admin/tongquan */
export interface AdminTongQuanDto {
  tongNguoiDung: number;
  tongGiaoDich: number;
  tongImport: number;
  tongNguoiDungHoatDong?: number;
  tongNguoiDungBiVoHieuHoa?: number;
}

/** CauHinhHeThongDto — GET admin/cauhinh */
export interface CauHinhHeThongDto {
  cauHinhId: number;
  tenThamSo: string;
  giaTri: string;
  moTa?: string;
  kieuDuLieu?: string;
}

/** TyGiaDto — GET admin/tien-te/ty-gia */
export interface TyGiaDto {
  tyGiaId: number;
  tuTienTe: string;
  sangTienTe: string;
  tyGia: number;
  ngayCapNhat?: string;
}
