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
} from '../../types/index';

const DUONG_DAN = '/api/bao-cao';

export type DurationType = 'day' | 'week' | 'month' | 'year';

export interface TimeParams {
  duration?: DurationType;
  thang?: number;
  nam?: number;
  tuNgay?: string;
  denNgay?: string;
}

function buildTimeParams(params: TimeParams): URLSearchParams {
  const urlParams = new URLSearchParams();
  if (params.duration) urlParams.append('duration', params.duration);
  if (params.thang !== undefined) urlParams.append('thang', params.thang.toString());
  if (params.nam !== undefined) urlParams.append('nam', params.nam.toString());
  if (params.tuNgay) urlParams.append('tuNgay', params.tuNgay);
  if (params.denNgay) urlParams.append('denNgay', params.denNgay);
  return urlParams;
}

// Helper để extract data từ API response { success, message, data, errors }
function extractData<T>(response: any): T {
  if (!response) return {} as T;
  // API trả về { success, message, data: {...} }
  if (response.data !== undefined) return response.data;
  if (response.Data !== undefined) return response.Data;
  if (response.items !== undefined) return response.items;
  if (response.danhSach !== undefined) return response.danhSach;
  return response;
}

/** Báo cáo tổng hợp chỉ số */
export async function layBaoCaoTongHop(timeParams: TimeParams): Promise<BaoCaoTongHopChiSoDto> {
  const params = buildTimeParams(timeParams);
  const response = await goiApiGet<any>(`${DUONG_DAN}/tong-hop?${params.toString()}`);
  return extractData<BaoCaoTongHopChiSoDto>(response);
}

/** Báo cáo biểu đồ tổng quan */
export async function layBaoCaoBieuDo(timeParams: TimeParams): Promise<BaoCaoTongQuanDto> {
  const params = buildTimeParams(timeParams);
  const response = await goiApiGet<any>(`${DUONG_DAN}/bieu-do?${params.toString()}`);
  return extractData<BaoCaoTongQuanDto>(response);
}

/** Báo cáo phân bổ danh mục - trả về { labels: string[], series: number[] } */
export async function layBaoCaoPhanBoDanhMuc(timeParams: TimeParams, loai: 'CHI' | 'THU' = 'CHI') {
  const params = buildTimeParams(timeParams);
  params.append('loai', loai);
  
  const response = await goiApiGet<any>(`${DUONG_DAN}/phan-bo-danh-muc?${params.toString()}`);
  return extractData<{ labels: string[]; series: number[] }>(response);
}

/** Báo cáo tài khoản: tổng tài sản, phân bổ theo loại, biến động số dư */
export async function layBaoCaoTaiKhoan(timeParams: TimeParams): Promise<BaoCaoTaiKhoanDto> {
  const params = buildTimeParams(timeParams);
  const response = await goiApiGet<any>(`${DUONG_DAN}/tai-khoan?${params.toString()}`);
  return extractData<BaoCaoTaiKhoanDto>(response);
}

/** Báo cáo danh mục chi tiêu: top danh mục, so sánh tháng trước, drill-down cha-con */
export async function layBaoCaoDanhMuc(timeParams: TimeParams): Promise<BaoCaoDanhMucDto> {
  const params = buildTimeParams(timeParams);
  const response = await goiApiGet<any>(`${DUONG_DAN}/danh-muc?${params.toString()}`);
  return extractData<BaoCaoDanhMucDto>(response);
}

/** Báo cáo ngân sách: tiến độ, cảnh báo vượt, lịch sử thực hiện, tỷ lệ tuân thủ */
export async function layBaoCaoNganSach(thang: number, nam: number): Promise<BaoCaoNganSachDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/ngan-sach?thang=${thang}&nam=${nam}`);
  return extractData<BaoCaoNganSachDto>(response);
}

/** Báo cáo mục tiêu tiết kiệm: tiến độ, tốc độ đóng góp, lịch sử, so sánh kế hoạch vs thực tế */
export async function layBaoCaoMucTieu(): Promise<BaoCaoMucTieuDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/muc-tieu`);
  return extractData<BaoCaoMucTieuDto>(response);
}

/** Kiểm tra lệch dữ liệu giữa ngân sách và giao dịch */
export async function kiemTraLech(thang: number, nam: number): Promise<DongBoKetQuaDto> {
  const response = await goiApiGet<any>(`${DUONG_DAN}/kiem-tra-lech?thang=${thang}&nam=${nam}`);
  return extractData<DongBoKetQuaDto>(response);
}

/** Đồng bộ ngân sách từ giao dịch */
export async function dongBoNganSach(thang?: number, nam?: number): Promise<DongBoKetQuaDto> {
  let url = `${DUONG_DAN}/dong-bo-ngan-sach`;
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await goiApiPost<any>(url, {});
  return extractData<DongBoKetQuaDto>(response);
}

/** Đồng bộ tổng hợp tháng từ giao dịch */
export async function dongBoTongHopThang(thang?: number, nam?: number): Promise<DongBoKetQuaDto> {
  let url = `${DUONG_DAN}/dong-bo-tong-hop-thang`;
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());
  if (params.toString()) url += `?${params.toString()}`;
  
  const response = await goiApiPost<any>(url, {});
  return extractData<DongBoKetQuaDto>(response);
}
