import { goiApiPost } from '../../thu_vien/goi_api';
import type { GeminiPhanTichRequest, GeminiPhanTichResponse, GeminiChatRequest, GeminiChatResponse } from '@/kieu_du_lieu/user/GeminiAI';

const DUONG_DAN = '/api/ai/gemini';

/** Timeout 300s cho chat AI (vì API free có thể rất chậm) */
const TIMEOUT_GIOI_HAN = 300;

/**
 * Gọi API phân tích chi tiêu bằng Gemini AI
 * @param nguoiDungId - ID người dùng
 * @param tuNgay - Ngày bắt đầu (YYYY-MM-DD)
 * @param denNgay - Ngày kết thúc (YYYY-MM-DD)
 */
export async function geminiPhanTichChiTieu(
  nguoiDungId: number,
  tuNgay?: string,
  denNgay?: string
): Promise<GeminiPhanTichResponse> {
  console.log('[gemini.ts] Calling geminiPhanTichChiTieu', { nguoiDungId, tuNgay, denNgay });

  const body: GeminiPhanTichRequest = { nguoiDungId };
  if (tuNgay) body.tuNgay = tuNgay;
  if (denNgay) body.denNgay = denNgay;

  console.log('[gemini.ts] Request body:', body);
  console.log('[gemini.ts] API URL:', `${DUONG_DAN}/phan-tich`);

  const result = goiApiPost<GeminiPhanTichResponse>(`${DUONG_DAN}/phan-tich`, body);
  console.log('[gemini.ts] Response promise:', result);

  return result;
}

/**
 * Gửi tin nhắn chat đến Gemini AI
 * @param tinNhan - Nội dung tin nhắn
 * @param lichSuTinNhan - Lịch sử tin nhắn (optional)
 * @param loaiYeuCau - Loại yêu cầu
 */
export async function geminiChat(
  tinNhan: string,
  lichSuTinNhan?: GeminiChatRequest['lichSuTinNhan'],
  loaiYeuCau: GeminiChatRequest['loaiYeuCau'] = 'TU_DO'
): Promise<GeminiChatResponse> {
  console.log('[gemini.ts] Calling geminiChat', { tinNhan, loaiYeuCau, lichSuTinNhan });

  const body: GeminiChatRequest = {
    tinNhan,
    lichSuTinNhan,
    loaiYeuCau
  };

  console.log('[gemini.ts] Request body:', body);
  console.log('[gemini.ts] API URL:', `${DUONG_DAN}/chat`);

  const result = goiApiPost<GeminiChatResponse>(`${DUONG_DAN}/chat`, body, { giayHetHan: TIMEOUT_GIOI_HAN });
  console.log('[gemini.ts] Response:', result);

  return result;
}

/**
 * Lấy dữ liệu phân tích từ API tổng quan
 */
export async function layDuLieuPhanTich(
  nguoiDungId: number,
  tuNgay?: string,
  denNgay?: string
): Promise<{ tongThu: number; tongChi: number; chiTheoDanhMuc: Record<string, number>; nganSach?: string } | null> {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const params = new URLSearchParams();
    if (tuNgay) params.append('tuNgay', tuNgay);
    if (denNgay) params.append('denNgay', denNgay);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tong-quan?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      tongThu: data.tongThu || 0,
      tongChi: data.tongChi || 0,
      chiTheoDanhMuc: data.chiTietTheoDanhMuc || {},
      nganSach: data.nganSach
    };
  } catch (error) {
    console.error('Lỗi lấy dữ liệu phân tích:', error);
    return null;
  }
}
