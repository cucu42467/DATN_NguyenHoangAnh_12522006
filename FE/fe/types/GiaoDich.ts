export enum LoaiGiaoDich {
  THU = 'THU',
  CHI = 'CHI',
  CHUYEN_KHOAN = 'CHUYEN_KHOAN'
}

export enum LoaiGiaoDichEnum {
  Thu = 1,
  Chi = 2,
  ChuyenKhoan = 3
}

export interface GiaoDichType {
  giaoDichId: number;
  soTien: number;
  loaiGiaoDich: LoaiGiaoDich | LoaiGiaoDichEnum;
  danhMucId: number;
  tenDanhMuc: string;
  taiKhoanNguonId: number;
  tenTaiKhoanNguon: string;
  taiKhoanDichId?: number;
  tenTaiKhoanDich?: string;
  ngayGiaoDich: string;
  ghiChu?: string;
  // ← THÊM MỚI: tenGiaoDich
  tenGiaoDich?: string;
  anhHoaDon?: string;
  doTinCayAI?: number;
}

export interface GiaoDichDinhKyType {
  giaoDichDinhKyId: number;
  tenDanhMuc: string;
  soTien: number;
  loaiGiaoDich: LoaiGiaoDich;
  tanSuat: 'HANG_NGAY' | 'HANG_TUAN' | 'HANG_THANG' | 'HANG_NAM';
  ngayBatDau: string;
  ngayKetThuc?: string;
  trangThai: boolean;
  // ← THÊM MỚI: 3 trường mới
  moTa?: string;
  soLanDaThucHien?: number;
  lanThucHienCuoi?: string;
}

export interface BoLocGiaoDichType {
  tuNgay?: string;
  denNgay?: string;
  loaiGiaoDich?: LoaiGiaoDich;
  danhMucId?: number;
  taiKhoanId?: number;
  timKiem?: string;
}

export interface PreviewCapNhatGiaoDich {
  giaoDichId?: number;
  soTienHienTai?: number;
  loaiGiaoDichHienTai?: string;
  tenTaiKhoanNguonHienTai?: string;
  soDuTaiKhoanNguonHienTai?: number;
  soDuHienTai?: number;

  soTienMoi?: number;
  loaiGiaoDichMoi?: string;
  tenTaiKhoanNguonMoi?: string;
  soDuSauKhiHoanLai?: number;
  soDuSauKhiCapNhat: number;

  coLoi: boolean;
  thongBao?: string;
  canhBao?: string;
  hoanTacDuoc?: boolean;
}
