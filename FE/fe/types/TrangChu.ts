import { ReactNode } from 'react';

// Enum cho loại giao dịch
export enum LoaiGiaoDichEnum {
  Thu = 1,
  Chi = 2,
  ChuyenKhoan = 3,
}

// Map với tbl_giaodich (kèm chi tiết danh mục để hiển thị UI)
export interface GiaoDichType {
  giaoDichId: number;
  taiKhoanId: number;
  taiKhoanDichId?: number | null; 
  danhMucId?: number | null; 
  tenDanhMuc?: string;
  loaiGiaoDich: LoaiGiaoDichEnum;
  soTien: number;
  tienTe: string;
  ngayGiaoDich: string;
  moTa?: string;
  doTinCay?: number;
  
  // Custom UI Fields
  iconUI?: ReactNode;
  bgIconUI?: string;
}

// Map với tbl_tonghop_thang
export interface TongHopThangType {
  tongThu: number;
  tongChi: number;
  tietKiem: number;
  soDuThuan: number; // Số dư thực tế từ API
}

// Map với tbl_taikhoan
export interface TaiKhoanType {
  taiKhoanId: number;
  tenTaiKhoan: string;
  soDu: number;
  tienTe: string;
}

// Map với tbl_ngansach
export interface NganSachType {
  nganSachId: number;
  tenDanhMuc: string;
  hanMuc: number;
  daDung: number;
  thang: number;
  nam: number;
  icon?: string;
  mauSac?: string | null;
}

// Map với tbl_muctieu
export interface MucTieuType {
  mucTieuId: number;
  tenMucTieu: string;
  soTienMucTieu: number;
  soTienHienTai: number;
  ngayBatDau?: string;
  ngayKetThuc?: string | null;
  icon?: string | null;
  mauSac?: string | null;
  trangThai?: number;
}

// Map với tbl_goiy_ai
export interface TroLyAIType {
  goiYId: number;
  loaiGoiY: number;
  noiDung: string;
  ngayTao: string;
}
