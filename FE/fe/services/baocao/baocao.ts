import { goiApiGet, goiApiPost } from '../../thu_vien/goi_api';
import type {
  BaoCaoTongHopChiSoDto,
  BaoCaoTongQuanDto,
  PhanBoDanhMucDto,
  DongBoKetQuaDto,
  BaoCaoTaiKhoanDto,
  BaoCaoDanhMucDto,
  BaoCaoNganSachDto,
  BaoCaoMucTieuDto,
} from '@/kieu_du_lieu/user';

const DUONG_DAN = '/api/bao-cao';

/** Báo cáo tổng hợp chỉ số */
export async function layBaoCaoTongHop(
  duration: 'day' | 'week' | 'month' | 'year' = 'month',
  thang?: number,
  nam?: number,
  tuNgay?: string,
  denNgay?: string
) {
  const params = new URLSearchParams();
  params.append('duration', duration);
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (tuNgay) params.append('tuNgay', tuNgay);
  if (denNgay) params.append('denNgay', denNgay);

  const response = await goiApiGet<any>(`${DUONG_DAN}/tong-hop?${params.toString()}`);
  return response?.Data ?? response?.data ?? response ?? {};
}

/** Báo cáo biểu đồ tổng quan */
export async function layBaoCaoBieuDo(
  duration: 'day' | 'week' | 'month' | 'year' = 'month',
  thang?: number,
  nam?: number,
  tuNgay?: string,
  denNgay?: string
) {
  const params = new URLSearchParams();
  params.append('duration', duration);
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (tuNgay) params.append('tuNgay', tuNgay);
  if (denNgay) params.append('denNgay', denNgay);

  const response = await goiApiGet<any>(`${DUONG_DAN}/bieu-do?${params.toString()}`);
  return response?.Data ?? response?.data ?? response ?? {};
}

/** Báo cáo phân bổ danh mục */
export async function layBaoCaoPhanBoDanhMuc(
  duration: 'day' | 'week' | 'month' | 'year' = 'month',
  thang?: number,
  nam?: number,
  loai: 'CHI' | 'THU' = 'CHI',
  tuNgay?: string,
  denNgay?: string
) {
  const params = new URLSearchParams();
  params.append('duration', duration);
  params.append('loai', loai);
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (tuNgay) params.append('tuNgay', tuNgay);
  if (denNgay) params.append('denNgay', denNgay);

  const response = await goiApiGet<any>(`${DUONG_DAN}/phan-bo-danh-muc?${params.toString()}`);
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object') {
    return response.data ?? response.items ?? response.danhSach ?? response.Data ?? {};
  }
  return {};
}

/** Kiểm tra lệch dữ liệu */
export async function kiemTraLech(thang: number, nam: number): Promise<DongBoKetQuaDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/kiem-tra-lech?thang=${thang}&nam=${nam}`);
  return response?.Data ?? response?.data ?? response;
}

/** Đồng bộ ngân sách */
export async function dongBoNganSach(thang?: number, nam?: number): Promise<DongBoKetQuaDto> {
  let url = `${DUONG_DAN}/dong-bo-ngan-sach`;
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await goiApiPost<any>(url, {});
  return response?.Data ?? response?.data ?? response;
}

/** Đồng bộ tổng hợp tháng */
export async function dongBoTongHopThang(thang?: number, nam?: number): Promise<DongBoKetQuaDto> {
  let url = `${DUONG_DAN}/dong-bo-tong-hop-thang`;
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await goiApiPost<any>(url, {});
  return response?.Data ?? response?.data ?? response;
}

// ============== CÁC API BÁO CÁO MỚI ==============

/** Báo cáo tài khoản: tổng tài sản, phân bổ theo loại, biến động số dư */
export async function layBaoCaoTaiKhoan(thang?: number, nam?: number): Promise<BaoCaoTaiKhoanDto> {
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  
  const response = await goiApiGet<any>(`${DUONG_DAN}/tai-khoan?${params.toString()}`);
  return response?.Data ?? response?.data ?? response ?? {};
}

/** Báo cáo danh mục chi tiêu: top danh mục, so sánh tháng trước, drill-down cha-con */
export async function layBaoCaoDanhMuc(thang?: number, nam?: number): Promise<BaoCaoDanhMucDto> {
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  
  const response = await goiApiGet<any>(`${DUONG_DAN}/danh-muc?${params.toString()}`);
  return response?.Data ?? response?.data ?? response ?? {};
}

/** Báo cáo ngân sách: tiến độ, cảnh báo vượt, lịch sử thực hiện, tỷ lệ tuân thủ */
export async function layBaoCaoNganSach(thang: number, nam: number): Promise<BaoCaoNganSachDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/ngan-sach?thang=${thang}&nam=${nam}`);
  return response?.Data ?? response?.data ?? response ?? {};
}

/** Báo cáo mục tiêu tiết kiệm: tiến độ, tốc độ đóng góp, lịch sử, so sánh kế hoạch vs thực tế */
export async function layBaoCaoMucTieu(): Promise<BaoCaoMucTieuDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/muc-tieu`);
  return response?.Data ?? response?.data ?? response ?? {};
}
