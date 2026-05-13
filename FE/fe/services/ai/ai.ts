import { goiApiGet, goiApiPost, goiApiPut } from '../../thu_vien/goi_api';
import { goiApiGetQt, goiApiPostQt, goiApiPutQt, goiApiDeleteQt } from '../qt/goi_api_qt';
import type { DuDoanAIChartDto, loiKhuyenAIDto } from '@/kieu_du_lieu/user';
import type { GeminiChatDataDto } from '@/kieu_du_lieu/user/GeminiAI';
import type { AiModelType, ApiResponse } from '@/kieu_du_lieu/TrungTamAI';

const DUONG_DAN = '/api/ai';
const DUONG_DAN_QT = '/admin/ai';
const DUONG_DAN_AI_MODEL = '/api/aimodel';

/** Dự đoán AI - biểu đồ thực tế + dự đoán */
export async function layDuDoanAI(thang?: number, nam?: number) {
  const params = new URLSearchParams();
  if (thang !== undefined) params.append('thang', thang.toString());
  if (nam !== undefined) params.append('nam', nam.toString());

  const url = params.toString() ? `${DUONG_DAN}/dudoan?${params.toString()}` : `${DUONG_DAN}/dudoan`;
  return goiApiGet<DuDoanAIChartDto>(url);
}

/** Lấy danh sách gợi ý AI (User) */
export async function layDanhSachGoiYAI(
  page = 1,
  pageSize = 100,
  daDoc?: boolean
): Promise<loiKhuyenAIDto[]> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  if (daDoc !== undefined) params.append('daDoc', daDoc.toString());

  const response = await goiApiGet<any>(`${DUONG_DAN}/goi-y?${params.toString()}`);
  
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && typeof response === 'object') {
    if (response.items && Array.isArray(response.items)) {
      return response.items;
    }
    return response.data ?? response.items ?? response.danhSach ?? [];
  }
  
  return [];
}

// ================== ADMIN AI SERVICES ==================

/** Lấy danh sách gợi ý AI (Admin) */
export async function layDanhSachGoiYAdmin(
  page = 1,
  pageSize = 20,
  trangThai?: string,
  loai?: string
) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  if (trangThai) params.append('trangThai', trangThai);
  if (loai) params.append('loai', loai);

  const response = await goiApiGetQt<{ success: boolean; data: loiKhuyenAIDto[] }>(
    `${DUONG_DAN_QT}/goi-y?${params.toString()}`
  );
  return response.data ?? [];
}

/** Duyệt gợi ý AI (Admin) */
export async function duyetGoiYAdmin(id: number) {
  return goiApiPutQt<any>(`${DUONG_DAN_QT}/goi-y/${id}/duyet`, {});
}

/** Từ chối gợi ý AI (Admin) */
export async function tuChoiGoiYAdmin(id: number) {
  return goiApiPutQt<any>(`${DUONG_DAN_QT}/goi-y/${id}/tu-choi`, {});
}

/** Xóa gợi ý AI (Admin) */
export async function xoaGoiYAdmin(id: number) {
  return goiApiDeleteQt<any>(`${DUONG_DAN_QT}/goi-y/${id}`);
}

/** Tạo gợi ý AI mới (Admin) */
export async function taoGoiYAdmin(dto: Partial<loiKhuyenAIDto>) {
  return goiApiPostQt<{ success: boolean; data: number }>(`${DUONG_DAN_QT}/goi-y`, dto);
}

/** Lấy thống kê AI (Admin) */
export async function layThongKeAIAdmin() {
  return goiApiGetQt<{
    success: boolean;
    data: {
      tongGoiY: number;
      daDuyet: number;
      choDuyet: number;
      tuChoi: number;
      tongCanhBao: number;
    }
  }>(`${DUONG_DAN_QT}/thong-ke`);
}

/** Đánh dấu gợi ý AI đã đọc */
export async function danhDauGoiYDaDoc(id: number | string) {
  return goiApiPut<void>(`${DUONG_DAN}/goi-y/${id}/da-doc`, {});
}

/** Phân tích chi tiêu bằng Gemini */
export async function phanTichChiTieuGemini(tuNgay: string, denNgay: string) {
  const request = { tuNgay, denNgay };
  return goiApiPost<any>(`${DUONG_DAN}/gemini/phan-tich`, request);
}

/** Lấy ngữ cảnh tài chính của người dùng cho AI */
export async function layNgucCanhAICuaNguoiDung() {
  return goiApiGet<GeminiChatDataDto>(`${DUONG_DAN}/assistant/context`);
}

/** Lấy thống kê AI hệ thống (User) */
export async function layThongKeAI() {
  return goiApiGetQt<any>(`${DUONG_DAN_QT}/thong-ke`);
}

// ============ AI Model CRUD ============

/** Lấy danh sách tất cả AI Model */
export async function layTatCaAiModel(): Promise<AiModelType[]> {
  const response = await goiApiGetQt<ApiResponse<AiModelType[]>>(`${DUONG_DAN_AI_MODEL}`);
  return response?.data ?? [];
}

/** Lấy AI Model theo ID */
export async function layAiModelTheoId(id: number): Promise<AiModelType | null> {
  const response = await goiApiGetQt<ApiResponse<AiModelType>>(`${DUONG_DAN_AI_MODEL}/${id}`);
  return response?.data ?? null;
}

/** Tạo AI Model mới */
export async function taoAiModel(dto: Partial<AiModelType>): Promise<number> {
  const response = await goiApiPostQt<ApiResponse<number>>(`${DUONG_DAN_AI_MODEL}`, dto);
  return response?.data ?? 0;
}

/** Cập nhật AI Model */
export async function capNhatAiModel(id: number, dto: Partial<AiModelType>): Promise<boolean> {
  const response = await goiApiPutQt<ApiResponse<null>>(`${DUONG_DAN_AI_MODEL}/${id}`, dto);
  return response?.success ?? false;
}

/** Xóa AI Model */
export async function xoaAiModel(id: number): Promise<boolean> {
  const response = await goiApiDeleteQt<ApiResponse<null>>(`${DUONG_DAN_AI_MODEL}/${id}`);
  return response?.success ?? false;
}
