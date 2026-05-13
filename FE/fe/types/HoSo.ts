export interface UserProfileType {
  hoTen: string;
  email: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  ngayThamGia: string;
}

export interface AppSettingsType {
  ngonNgu: 'vi' | 'en';
  tienTe: 'VND' | 'USD' | 'EUR';
  giaoDien: 'light' | 'dark' | 'system';
}

export interface ChangePasswordType {
  matKhauCu: string;
  matKhauMoi: string;
  xacNhanMatKhau: string;
}
