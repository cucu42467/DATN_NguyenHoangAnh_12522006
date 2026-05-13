/**
 * Kieu du lieu dong bo voi JSON tra ve tu backend ASP.NET (camelCase).
 */

export type NguoiDungTomTat = {
  nguoiDungId: number;
  hoTen: string;
  email: string;
  soDienThoai?: string | null;
  anhDaiDien?: string | null;
  vaiTro: string[];
};

export type PhanHoiDangNhap = {
  accessToken: string;
  refreshToken: string;
  hetHanAccessUtc: string;
  hetHanRefreshUtc: string;
  nguoiDung: NguoiDungTomTat;
};

/** Phan hoi loi thuong gap: { thongDiep } */
export type PhanHoiLoiApi = {
  thongDiep?: string;
  title?: string;
  errors?: Record<string, string[]>;
};
