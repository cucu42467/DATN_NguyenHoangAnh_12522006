import { goiApiPost } from '../../thu_vien/goi_api';

/**
 * Request cho AI Query
 */
export interface AiQueryRequest {
  question: string;
  chatHistory?: ChatMessage[];
}

/**
 * Tin nhắn chat
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Response từ AI Query
 */
export interface AiQueryResponse {
  success: boolean;
  columns: string[];
  rows: Record<string, unknown>[];
  summary?: string;
  tableName?: string;
  tableDisplayName?: string;
  executionTimeMs: number;
  message?: string;
  suggestedDisplayType?: 'TABLE' | 'CHART' | 'SUMMARY';
}

const DUONG_DAN = '/api/ai-query';

/**
 * Execute AI Query - hỏi bằng ngôn ngữ tự nhiên
 * VD: "3 giao dịch gần nhất", "chi tiêu tháng này"
 */
export async function aiQuery(
  question: string,
  chatHistory?: ChatMessage[]
): Promise<AiQueryResponse> {
  const request: AiQueryRequest = {
    question,
    chatHistory
  };

  return goiApiPost<AiQueryResponse>(`${DUONG_DAN}/query`, request);
}

/**
 * Execute Simple Query - không cần AI, dùng keyword mapping
 * Tốt cho truy vấn nhanh
 */
export async function aiSimpleQuery(
  question: string
): Promise<AiQueryResponse> {
  const request: AiQueryRequest = { question };

  return goiApiPost<AiQueryResponse>(`${DUONG_DAN}/simple-query`, request);
}

/**
 * Quick Query - predefined queries
 */
export async function aiQuickQuery(
  queryType: 'recent-transactions' | 'monthly-expenses' | 'unread-notifications' |
            'accounts' | 'budgets' | 'goals' | 'alerts' | 'recommendations' | 'recurring'
): Promise<AiQueryResponse> {
  return goiApiPost<AiQueryResponse>(`${DUONG_DAN}/quick/${queryType}`, {});
}
