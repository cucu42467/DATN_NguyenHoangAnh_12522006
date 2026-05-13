import { goiApiGet, goiApiPut } from '../thu_vien/goi_api';

const DUONG_DAN = '/api/thong-bao';

/** Kiểu dữ liệu thông báo */
export interface ThongBaoDto {
  thongBaoId: number;
  nguoiDungId: number;
  tieuDe: string;
  noiDung?: string;
  loaiThongBao: number; // 1: HeThong, 2: CanhBao, 3: GoiY, 4: DuDoan
  ngayTao: string;
  daDoc: boolean;
  loaiThongBaoText?: string;
}

/** Lấy danh sách thông báo */
export async function layThongBao(
  page = 1,
  pageSize = 20,
  daDoc?: boolean
): Promise<ThongBaoDto[]> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  if (daDoc !== undefined) params.append('daDoc', daDoc.toString());

  const response = await goiApiGet<any>(`${DUONG_DAN}?${params.toString()}`);

  if (Array.isArray(response)) {
    return response.map(mapThongBao);
  }

  if (response && typeof response === 'object') {
    const items = response.items ?? response.data ?? response.danhSach ?? [];
    return Array.isArray(items) ? items.map(mapThongBao) : [];
  }

  return [];
}

/** Lấy số lượng thông báo chưa đọc */
export async function laySoLuongChuaDoc(): Promise<number> {
  try {
    const response = await goiApiGet<any>(`${DUONG_DAN}/so-luong-chua-doc`);
    return typeof response === 'number' ? response : (response?.soLuong ?? response?.count ?? 0);
  } catch {
    return 0;
  }
}

/** Đánh dấu thông báo đã đọc */
export async function danhDauDaDoc(id: number): Promise<void> {
  await goiApiPut<void>(`${DUONG_DAN}/${id}/da-doc`, {});
}

/** Đánh dấu tất cả thông báo đã đọc */
export async function danhDauTatCaDaDoc(): Promise<void> {
  await goiApiPut<void>(`${DUONG_DAN}/tat-ca-da-doc`, {});
}

/** Lấy thông báo theo loại */
export async function layThongBaoTheoLoai(
  loai: number,
  page = 1,
  pageSize = 20
): Promise<ThongBaoDto[]> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  const response = await goiApiGet<any>(`${DUONG_DAN}/theo-loai/${loai}?${params.toString()}`);

  if (Array.isArray(response)) {
    return response.map(mapThongBao);
  }

  if (response && typeof response === 'object') {
    const items = response.items ?? response.data ?? response.danhSach ?? [];
    return Array.isArray(items) ? items.map(mapThongBao) : [];
  }

  return [];
}

/** Map dữ liệu API sang DTO */
function mapThongBao(item: any): ThongBaoDto {
  const loaiText = getLoaiThongBaoText(item.loaiThongBao ?? item.LoaiThongBao ?? 1);
  return {
    thongBaoId: item.thongBaoId ?? item.ThongBaoId ?? 0,
    nguoiDungId: item.nguoiDungId ?? item.NguoiDungId ?? 0,
    tieuDe: item.tieuDe ?? item.TieuDe ?? '',
    noiDung: item.noiDung ?? item.NoiDung,
    loaiThongBao: item.loaiThongBao ?? item.LoaiThongBao ?? 1,
    ngayTao: item.ngayTao ?? item.NgayTao ?? new Date().toISOString(),
    daDoc: item.daDoc ?? item.DaDoc ?? false,
    loaiThongBaoText: loaiText,
  };
}

/** Lấy text cho loại thông báo */
export function getLoaiThongBaoText(loai: number): string {
  switch (loai) {
    case 1: return 'Hệ thống';
    case 2: return 'Cảnh báo';
    case 3: return 'Gợi ý';
    case 4: return 'Dự đoán';
    default: return 'Không xác định';
  }
}

/** Lấy icon cho loại thông báo */
export function getIconLoaiThongBao(loai: number): string {
  switch (loai) {
    case 1: return '🔔';
    case 2: return '⚠️';
    case 3: return '💡';
    case 4: return '📊';
    default: return '📢';
  }
}

/** Lấy màu cho loại thông báo */
export function getMauLoaiThongBao(loai: number): string {
  switch (loai) {
    case 1: return 'blue';
    case 2: return 'red';
    case 3: return 'green';
    case 4: return 'purple';
    default: return 'gray';
  }
}
