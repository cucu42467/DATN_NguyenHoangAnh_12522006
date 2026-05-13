'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Table,
  BarChart3,
  PieChart,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { aiQuery, aiSimpleQuery, type AiQueryResponse, type ChatMessage } from '@/services/ai/aiQuery';
import { useToast } from '@/thanh_phan/animation/Toast';

interface QueryChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  queryResult?: AiQueryResponse;
}

export default function QueryChat({ isOpen, onClose }: QueryChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Chào bạn! Tôi có thể giúp bạn truy vấn dữ liệu tài chính của mình bằng ngôn ngữ tự nhiên.

**Ví dụ các câu hỏi bạn có thể hỏi:**
- "3 giao dịch gần nhất"
- "Chi tiêu tháng này"
- "Thông báo chưa đọc"
- "Tài khoản của tôi"
- "Mục tiêu tiết kiệm"
- "Ngân sách hiện tại"

Hãy hỏi tôi bất cứ điều gì!`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  const executeQuery = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add to chat history for AI context
    const newChatHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: question }
    ];

    try {
      // Try AI Query first, fallback to simple query
      let result: AiQueryResponse;
      try {
        result = await aiQuery(question, chatHistory.slice(-5));
      } catch {
        // Fallback to simple query
        result = await aiSimpleQuery(question);
      }

      // Update chat history
      setChatHistory([
        ...newChatHistory,
        { role: 'assistant', content: result.summary || result.message || 'Đã xử lý truy vấn' }
      ]);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.summary || result.message || 'Đã xử lý truy vấn',
        timestamp: new Date(),
        queryResult: result
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Query error:', error);

      let errorMessage = 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn.';
      if (error.status === 401) {
        errorMessage = 'Phiên hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeQuery(inputValue);
    }
  };

  const formatValue = (value: unknown, column: string): string => {
    if (value === null || value === undefined) return '-';

    const colLower = column.toLowerCase();

    // Số tiền
    if (colLower.includes('sotien') || colLower.includes('sodu') ||
      colLower.includes('muc') || colLower.includes('hientai')) {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (!isNaN(num)) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0
        }).format(num);
      }
    }

    // Ngày tháng
    if (colLower.includes('ngay') || colLower.includes('date')) {
      if (value instanceof Date) {
        return value.toLocaleDateString('vi-VN');
      }
      const date = new Date(String(value));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('vi-VN');
      }
    }

    // Boolean/Trạng thái
    if (colLower.includes('d_doc') || colLower.includes('dadoc')) {
      return value === 1 || value === '1' || value === true ? 'Đã đọc' : 'Chưa đọc';
    }

    if (colLower.includes('trangthai') || colLower.includes('status')) {
      const val = typeof value === 'number' ? value : parseInt(String(value));
      if (val === 1) return 'Đang theo dõi';
      if (val === 2) return 'Hoàn thành';
      if (val === 3) return 'Đã hủy';
    }

    if (colLower.includes('loai')) {
      const val = typeof value === 'number' ? value : parseInt(String(value));
      if (val === 1) return 'Thu';
      if (val === 2) return 'Chi';
      if (val === 3) return 'Chuyển khoản';
    }

    return String(value);
  };

  const getColumnLabel = (col: string): string => {
    const labels: Record<string, string> = {
      'SoTien': 'Số tiền',
      'SoDu': 'Số dư',
      'NgayGiaoDich': 'Ngày GD',
      'NgayTao': 'Ngày tạo',
      'MoTa': 'Mô tả',
      'LoaiGiaoDich': 'Loại',
      'TenTaiKhoan': 'Tài khoản',
      'TenDanhMuc': 'Danh mục',
      'TieuDe': 'Tiêu đề',
      'NoiDung': 'Nội dung',
      'DaDoc': 'Trạng thái',
      'TrangThai': 'Trạng thái',
      'Thang': 'Tháng',
      'Nam': 'Năm',
      'SoTienToiDa': 'Giới hạn',
      'SoTienDaChi': 'Đã chi',
      'SoTienMongMuon': 'Mục tiêu',
      'SoTienHienTai': 'Hiện tại',
      'TenMucTieu': 'Mục tiêu',
      'NgayKetThuc': 'Ngày kết thúc',
      'LoaiThongBao': 'Loại TB',
      'ChuKy': 'Chu kỳ',
      'LanTiepTheo': 'Lần tiếp',
      'GhiChu': 'Ghi chú'
    };
    return labels[col] || col;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        style={{ width: '900px', height: '700px', maxWidth: '95vw', maxHeight: '95vh' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">AI Query Database</h2>
              <p className="text-emerald-200 text-xs">Truy vấn dữ liệu bằng ngôn ngữ tự nhiên</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex gap-2 overflow-x-auto shrink-0">
          {[
            { label: 'Giao dịch gần nhất', query: '3 giao dịch gần nhất', icon: Clock },
            { label: 'Chi tiêu tháng', query: 'chi tiêu tháng này', icon: TrendingDown },
            { label: 'Thông báo mới', query: 'thông báo chưa đọc', icon: AlertCircle },
            { label: 'Tài khoản', query: 'tài khoản của tôi', icon: CheckCircle },
            { label: 'Mục tiêu', query: 'mục tiêu tiết kiệm', icon: TrendingUp }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => executeQuery(action.query)}
              disabled={isLoading}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-50"
            >
              <action.icon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    }`}>
                    {msg.role === 'user' ? (
                      <span className="text-xs font-bold">B</span>
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-md'
                        : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-md'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>

                    {/* Query Result Table */}
                    {msg.queryResult && msg.queryResult.success && msg.queryResult.rows.length > 0 && (
                      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                        <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                          <Table className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                            {msg.queryResult.tableDisplayName || 'Kết quả'}
                          </span>
                          <span className="text-xs text-zinc-500">
                            ({msg.queryResult.rows.length} bản ghi)
                          </span>
                        </div>
                        <div className="overflow-x-auto max-h-64">
                          <table className="w-full text-xs">
                            <thead className="bg-zinc-50 dark:bg-zinc-900 sticky top-0">
                              <tr>
                                {msg.queryResult.columns.map((col) => (
                                  <th key={col} className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
                                    {getColumnLabel(col)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {msg.queryResult.rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                                  {msg.queryResult!.columns.map((col) => (
                                    <td key={col} className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                                      {formatValue(row[col], col)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Summary for no results */}
                    {msg.queryResult && msg.queryResult.success && msg.queryResult.rows.length === 0 && (
                      <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Không tìm thấy dữ liệu phù hợp
                        </p>
                      </div>
                    )}

                    <p className={`text-[10px] text-zinc-400 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Search className="h-4 w-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="text-sm text-zinc-500">Đang xử lý truy vấn...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Hỏi về dữ liệu tài chính của bạn..."
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:border-emerald-400 dark:focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/50 transition-all placeholder:text-zinc-400"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => executeQuery(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-2xl font-medium text-sm transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Tìm kiếm</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
