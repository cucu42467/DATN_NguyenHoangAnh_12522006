// Admin Services - Re-exports từ qt services (shared API client)
// Admin và QT cùng gọi API_QT nên dùng chung goi_api_qt

export * from './co_so_api_admin';
export * from './dashboard';
export * from './baocao';

// Re-export API functions từ qt để admin có thể dùng
export { 
  goiAdminGet, 
  goiAdminPost, 
  goiAdminPut, 
  goiAdminDelete,
  loiAdminApi 
} from '../qt/goi_api_qt';

export type {
  DashboardTongQuanDto,
  ThongKeNguoiDungDto,
  ThongKeGiaoDichThangDto,
  ChiTieuTheoDanhMucDto,
  CanhBaoNganSachAdminDto,
  DashboardTongHopDto,
} from './dashboard';

export type {
  AdminNguoiDungDto,
  AdminGiaoDichDto,
  AdminAuditLogDto,
  AdminTokenDto,
  AdminTongQuanDto,
  CauHinhHeThongDto,
  TyGiaDto,
} from './kieu_du_lieu_admin';
