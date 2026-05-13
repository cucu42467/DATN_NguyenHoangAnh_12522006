export interface MucTieuDto {
  mucTieuId: number;
  nguoiDungId: number;
  tenMucTieu: string;
  // ← THÊM MỚI: moTa, uuTien
  moTa?: string;
  uuTien?: number;  // 1=Cao, 2=Trung bình, 3=Thấp
  soTienMucTieu: number;
  soTienHienTai: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  icon?: string;
  mauSac?: string;
  taiKhoanId?: number;
  trangThai?: number;
  anh?: string;
}

// Alias for backward compatibility
export type MucTieuType = MucTieuDto;

export interface TaoMucTieuDto {
  tenMucTieu: string;
  soTienMucTieu: number;
  // ← THÊM MỚI: moTa, uuTien
  moTa?: string;
  uuTien?: number;
  soTienHienTai?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  icon?: string;
  mauSac?: string;
  taiKhoanId?: number;
  trangThai?: number;
  anh?: string;
}

export interface DongGopMucTieuDto {
  id: number;
  mucTieuId: number;
  soTien: number;
  ngayDongGop?: string;
  ghiChu?: string;
  taiKhoanId?: number;
}

export interface TaoDongGopMucTieuDto {
  soTien: number;
  ngayDongGop?: string;
  ghiChu?: string;
}
