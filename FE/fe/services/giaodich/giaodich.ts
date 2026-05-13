import { goiApiGet, goiApiPost, goiApiPut, goiApiDelete } from '../../thu_vien/goi_api';
import type { 
  GiaoDichDto, 
  TaoGiaoDichDto, 
  LocGiaoDichDto,
  ApiResponse,
  PagedResponse,
} from '@/types';
import type { PreviewCapNhatGiaoDich } from '@/types/GiaoDich';

const DUONG_DAN = '/api/giao-dich';

/** Lấy danh sách giao dịch (có filter/pagination) */
export async function layDanhSachGiaoDich(filter: LocGiaoDichDto = {}): Promise<PagedResponse<GiaoDichDto>> {
  const params = new URLSearchParams();
  
  if (filter.tuNgay) params.append('tuNgay', filter.tuNgay);
  if (filter.denNgay) params.append('denNgay', filter.denNgay);
  if (filter.danhMucId) params.append('danhMucId', filter.danhMucId.toString());
  if (filter.taiKhoanNguonId) params.append('taiKhoanNguonId', filter.taiKhoanNguonId.toString());
  if (filter.soTienTu !== undefined && filter.soTienTu !== null) params.append('soTienTu', filter.soTienTu.toString());
  if (filter.soTienDen !== undefined && filter.soTienDen !== null) params.append('soTienDen', filter.soTienDen.toString());
  if (filter.ghiChu) params.append('ghiChu', filter.ghiChu);
  if (filter.tenLoaiDanhMuc) params.append('loaiDanhMuc', filter.tenLoaiDanhMuc);
  if (filter.page) params.append('page', filter.page.toString());
  if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter.sortBy) params.append('sortBy', filter.sortBy);
  if (filter.sortOrder) params.append('sortDir', filter.sortOrder);

  const url = params.toString() ? `${DUONG_DAN}?${params.toString()}` : DUONG_DAN;
  
  const response = await goiApiGet<ApiResponse<PagedResponse<GiaoDichDto>>>(url);
  
  // Backend trả về: { success, message, data: { items, totalCount, page, ... } }
  if (response && response.success && response.data) {
    return response.data;
  }
  
  // Fallback: nếu data là array trực tiếp (legacy)
  if (response && Array.isArray(response)) {
    return {
      items: response,
      totalCount: response.length,
      page: 1,
      pageSize: response.length,
      totalPages: 1,
    } as PagedResponse<GiaoDichDto>;
  }
  
  return {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  } as PagedResponse<GiaoDichDto>;
}

/** Lấy N giao dịch gần nhất (sắp xếp từ mới nhất -> cũ nhất) */
export async function layGiaoDichGanNhat(soLuong: number = 3): Promise<GiaoDichDto[]> {
  const result = await layDanhSachGiaoDich({
    page: 1,
    pageSize: soLuong,
    sortBy: 'ngayGiaoDich',
    sortOrder: 'desc',
  });
  return result.items;
}

/** Lấy chi tiết giao dịch */
export async function layChiTietGiaoDich(id: number) {
  return goiApiGet<GiaoDichDto>(`${DUONG_DAN}/${id}`);
}

/** Tạo giao dịch mới (FormData hỗ trợ file) */
export async function taoGiaoDich(dto: TaoGiaoDichDto) {
  const formData = new FormData();
  formData.append('SoTien', dto.soTien.toString());
  formData.append('LoaiGiaoDich', dto.loaiGiaoDich);
  if (dto.danhMucId !== undefined) formData.append('DanhMucId', dto.danhMucId.toString());
  formData.append('TaiKhoanNguonId', dto.taiKhoanNguonId.toString());
  if (dto.taiKhoanDichId !== undefined) formData.append('TaiKhoanDichId', dto.taiKhoanDichId.toString());
  if (dto.ngayGiaoDich) formData.append('NgayGiaoDich', dto.ngayGiaoDich);
  if (dto.ghiChu) formData.append('GhiChu', dto.ghiChu);
  if (dto.tepDinhKem) formData.append('TepDinhKem', dto.tepDinhKem);
  // TrangThai: 1=Thành công (mặc định), 0=Lỗi, 2=Đang xử lý
  formData.append('TrangThai', dto.trangThai !== undefined ? dto.trangThai.toString() : '1');
  // Các trường bổ sung
  if (dto.tienTe) formData.append('TienTe', dto.tienTe);
  if (dto.tyGiaQuyDoi !== undefined) formData.append('TyGiaQuyDoi', dto.tyGiaQuyDoi.toString());
  if (dto.laTuDong !== undefined) formData.append('LaTuDong', dto.laTuDong ? '1' : '0');
  if (dto.doTinCay !== undefined) formData.append('DoTinCay', dto.doTinCay.toString());
  if (dto.maGiaoDichNgoai) formData.append('MaGiaoDichNgoai', dto.maGiaoDichNgoai);
  if (dto.nguonTao) formData.append('NguonTao', dto.nguonTao);
  if (dto.viTri) formData.append('ViTri', dto.viTri);

  return goiApiPost<number>(DUONG_DAN, formData, {
    tuDongTuyenToken: true,
  });
}

/** Cập nhật giao dịch */
export async function capNhatGiaoDich(id: number, dto: TaoGiaoDichDto) {
  const formData = new FormData();
  formData.append('SoTien', dto.soTien.toString());
  formData.append('LoaiGiaoDich', dto.loaiGiaoDich);
  if (dto.danhMucId !== undefined) formData.append('DanhMucId', dto.danhMucId.toString());
  formData.append('TaiKhoanNguonId', dto.taiKhoanNguonId.toString());
  if (dto.taiKhoanDichId !== undefined) formData.append('TaiKhoanDichId', dto.taiKhoanDichId.toString());
  if (dto.ngayGiaoDich) formData.append('NgayGiaoDich', dto.ngayGiaoDich);
  if (dto.ghiChu) formData.append('GhiChu', dto.ghiChu);
  if (dto.tepDinhKem) formData.append('TepDinhKem', dto.tepDinhKem);
  // TrangThai: 1=Thành công (mặc định), 0=Lỗi, 2=Đang xử lý
  formData.append('TrangThai', dto.trangThai !== undefined ? dto.trangThai.toString() : '1');
  // Các trường bổ sung
  if (dto.tienTe) formData.append('TienTe', dto.tienTe);
  if (dto.tyGiaQuyDoi !== undefined) formData.append('TyGiaQuyDoi', dto.tyGiaQuyDoi.toString());
  if (dto.laTuDong !== undefined) formData.append('LaTuDong', dto.laTuDong ? '1' : '0');
  if (dto.doTinCay !== undefined) formData.append('DoTinCay', dto.doTinCay.toString());
  if (dto.maGiaoDichNgoai) formData.append('MaGiaoDichNgoai', dto.maGiaoDichNgoai);
  if (dto.nguonTao) formData.append('NguonTao', dto.nguonTao);
  if (dto.viTri) formData.append('ViTri', dto.viTri);

  return goiApiPut<void>(`${DUONG_DAN}/${id}`, formData);
}

/** Xóa giao dịch */
export async function xoaGiaoDich(id: number) {
  return goiApiDelete<void>(`${DUONG_DAN}/${id}`);
}

/** Xuất Excel với danh sách giao dịch được chọn */
export async function xuatExcelGiaoDich(giaoDichIds?: number[]) {
  const response = await fetch(`${DUONG_DAN}/xuat-excel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      giaoDichIds: giaoDichIds && giaoDichIds.length > 0 ? giaoDichIds : null,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to export');
  }

  return response.blob();
}

/** Xem trước kết quả cập nhật giao dịch - kiểm tra số dư trước khi lưu */
export async function xemTruocCapNhat(giaoDichId: number, dto: TaoGiaoDichDto): Promise<PreviewCapNhatGiaoDich> {
  const formData = new FormData();
  formData.append('giaoDichId', giaoDichId.toString());
  formData.append('SoTien', dto.soTien.toString());
  formData.append('LoaiGiaoDich', dto.loaiGiaoDich);
  if (dto.danhMucId !== undefined) formData.append('DanhMucId', dto.danhMucId.toString());
  formData.append('TaiKhoanNguonId', dto.taiKhoanNguonId.toString());
  if (dto.taiKhoanDichId !== undefined) formData.append('TaiKhoanDichId', dto.taiKhoanDichId.toString());
  if (dto.ngayGiaoDich) formData.append('NgayGiaoDich', dto.ngayGiaoDich);
  if (dto.ghiChu) formData.append('GhiChu', dto.ghiChu);
  if (dto.tepDinhKem) formData.append('TepDinhKem', dto.tepDinhKem);
  formData.append('TrangThai', dto.trangThai !== undefined ? dto.trangThai.toString() : '1');
  if (dto.tienTe) formData.append('TienTe', dto.tienTe);
  if (dto.tyGiaQuyDoi !== undefined) formData.append('TyGiaQuyDoi', dto.tyGiaQuyDoi.toString());
  if (dto.laTuDong !== undefined) formData.append('LaTuDong', dto.laTuDong ? '1' : '0');
  if (dto.doTinCay !== undefined) formData.append('DoTinCay', dto.doTinCay.toString());
  if (dto.maGiaoDichNgoai) formData.append('MaGiaoDichNgoai', dto.maGiaoDichNgoai);
  if (dto.nguonTao) formData.append('NguonTao', dto.nguonTao);
  if (dto.viTri) formData.append('ViTri', dto.viTri);

  const response = await goiApiPost<ApiResponse<PreviewCapNhatGiaoDich>>(`${DUONG_DAN}/preview-update`, formData, {
    tuDongTuyenToken: true,
  });

  // Backend trả về: { success, message, data: PreviewCapNhatGiaoDich }
  if (response && response.success && response.data) {
    return response.data;
  }

  // Fallback - trả về object lỗi
  return {
    soDuSauKhiCapNhat: 0,
    coLoi: true,
    thongBao: response?.message || 'Không thể xem trước',
  };
}


