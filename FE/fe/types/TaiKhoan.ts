export interface LoaiTaiKhoanType {
  loaiTaiKhoanId: number;
  tenLoai: string;
}

// Dữ liệu trả về từ API
export interface TaiKhoanDto {
  taiKhoanId: number;
  tenTaiKhoan: string;
  loaiTaiKhoan: string;
  soDu: number;
  soDuBanDau?: number;
  tienTe?: string;
  mauSac?: string | null;
  icon?: string | null;
  nguoiDungId: number;
  laMacDinh: boolean;
  tenNganHang?: string;
  soTaiKhoan?: string;
  hanMucTinDung?: number;
  ngayCapNhatSoDu?: string;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

// Dữ liệu gửi lên API để tạo/cập nhật tài khoản
export interface TaoTaiKhoanDto {
  tenTaiKhoan: string;
  loaiTaiKhoan: string;
  soDuBanDau?: number;
  tenNganHang?: string;
  soTaiKhoan?: string;
  hanMucTinDung?: number;
  mauSac?: string;
  icon?: string;
  // ← THÊM MỚI: moTa
  moTa?: string;
}

export interface ChuyenTienNoiBoDto {
  taiKhoanNguonId: number;
  taiKhoanDichId: number;
  soTien: number;
  ghiChu?: string;
}
