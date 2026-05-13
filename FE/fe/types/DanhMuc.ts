export enum LoaiMuc {
  THU = 'THU',
  CHI = 'CHI'
}

export interface LoaiDanhMucDto {
  loaiDanhMucId: number;
  tenLoai: string;
}

export interface TaoLoaiDanhMucDto {
  tenLoai: string;
}

export interface DanhMucDto {
  danhMucId: number;
  tenDanhMuc: string;
  mauSac?: string;
  loaiDanhMuc: string;
  loaiDanhMucId?: number;
  chaId?: number;
  icon?: string;
  laHeThong: boolean;
  thuTu?: number;
  nguoiDungId?: number;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

export interface TaoDanhMucDto {
  tenDanhMuc: string;
  mauSac?: string;
  loaiDanhMuc: string;
  loaiDanhMucId?: number;
  chaId?: number;
  icon?: string;
  thuTu?: number;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

export interface IconType {
  id: number;
  name: string;
}
