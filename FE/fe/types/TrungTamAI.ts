export interface DuDoanAIChartType {
  months: string[];
  actual: number[];
  forecast: number[];
}

export interface loiKhuyenAIType {
  id: number;
  tieuDe: string;
  noiDung: string;
  loai: 'CANH_BAO' | 'GOI_Y' | 'KHICH_LE';
  ngayTao: string;
}

export type LoiKhuyenAIType = loiKhuyenAIType;
export type DuDoanAIChartDto = DuDoanAIChartType;

export interface CanhBaoHeThongType {
  id: number;
  noiDung: string;
  mucDo: 'CAO' | 'TRUNG_BINH' | 'THAP';
  isDaDoc: boolean;
}

// ============ AI Model ============
export interface AiModelType {
  modelId: number;
  tenModel: string;
  mucDich?: string;
  provider?: string;
  apiUrl?: string;
  apiKey?: string;
  trangThai: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
