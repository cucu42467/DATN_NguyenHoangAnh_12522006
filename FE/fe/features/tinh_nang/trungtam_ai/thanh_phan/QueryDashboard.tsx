'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Table,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Wallet,
  Target,
  Bell,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { aiQuickQuery, aiQuery, type AiQueryResponse } from '@/services/ai/aiQuery';
import { useToast } from '@/thanh_phan/animation/Toast';

interface QueryDashboardProps {
  className?: string;
}

interface QuickCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  queryType: 'recent-transactions' | 'monthly-expenses' | 'unread-notifications' | 'accounts' | 'goals' | 'alerts';
  color: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  onData: (data: AiQueryResponse) => void;
}

const quickCards: Omit<QuickCardProps, 'onData'>[] = [
  {
    title: 'Giao dịch gần nhất',
    subtitle: '3 giao dịch mới nhất',
    icon: <Clock className="h-5 w-5" />,
    queryType: 'recent-transactions',
    color: 'emerald'
  },
  {
    title: 'Chi tiêu tháng',
    subtitle: 'Tổng chi tháng này',
    icon: <TrendingDown className="h-5 w-5" />,
    queryType: 'monthly-expenses',
    color: 'rose'
  },
  {
    title: 'Thông báo mới',
    subtitle: 'Thông báo chưa đọc',
    icon: <Bell className="h-5 w-5" />,
    queryType: 'unread-notifications',
    color: 'amber'
  },
  {
    title: 'Tài khoản',
    subtitle: 'Số dư tài khoản',
    icon: <Wallet className="h-5 w-5" />,
    queryType: 'accounts',
    color: 'blue'
  },
  {
    title: 'Mục tiêu',
    subtitle: 'Tiến độ tiết kiệm',
    icon: <Target className="h-5 w-5" />,
    queryType: 'goals',
    color: 'purple'
  },
  {
    title: 'Cảnh báo',
    subtitle: 'Cảnh báo hệ thống',
    icon: <AlertTriangle className="h-5 w-5" />,
    queryType: 'alerts',
    color: 'rose'
  }
];

const colorClasses = {
  emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600',
  blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600',
  amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-600',
  purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-600',
  rose: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600'
};

const bgColorClasses = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/50',
  blue: 'bg-blue-100 dark:bg-blue-900/50',
  amber: 'bg-amber-100 dark:bg-amber-900/50',
  purple: 'bg-purple-100 dark:bg-purple-900/50',
  rose: 'bg-rose-100 dark:bg-rose-900/50'
};

export default function QueryDashboard({ className = '' }: QueryDashboardProps) {
  const { toast } = useToast();
  const [loadingCards, setLoadingCards] = useState<Set<string>>(new Set());
  const [queryData, setQueryData] = useState<Record<string, AiQueryResponse>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const loadQuickQuery = async (card: Omit<QuickCardProps, 'onData'>) => {
    if (loadingCards.has(card.queryType)) return;

    setLoadingCards(prev => new Set([...prev, card.queryType]));

    try {
      const result = await aiQuickQuery(card.queryType);
      setQueryData(prev => ({
        ...prev,
        [card.queryType]: result
      }));

      if (result.success && result.rows.length > 0) {
        toast({
          title: 'Truy vấn thành công',
          description: `Tìm thấy ${result.rows.length} kết quả`,
          type: 'success'
        });
      }
    } catch (error: any) {
      console.error('Query error:', error);
      toast({
        title: 'Lỗi truy vấn',
        description: error.message || 'Không thể lấy dữ liệu',
        type: 'error'
      });
    } finally {
      setLoadingCards(prev => {
        const next = new Set(prev);
        next.delete(card.queryType);
        return next;
      });
    }
  };

  const formatValue = (value: unknown, column: string): string => {
    if (value === null || value === undefined) return '-';

    const colLower = column.toLowerCase();

    // Số tiền
    if (colLower.includes('sotien') || colLower.includes('sodu')) {
      const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
      if (!isNaN(num)) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0
        }).format(num);
      }
    }

    // Ngày tháng
    if (colLower.includes('ngay')) {
      const date = new Date(String(value));
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit'
        });
      }
    }

    // Boolean
    if (colLower.includes('d_doc')) {
      return value === 1 || value === '1' ? 'Đã đọc' : 'Chưa đọc';
    }

    // Trạng thái
    if (colLower.includes('trangthai')) {
      const val = typeof value === 'number' ? value : parseInt(String(value));
      if (val === 1) return 'Đang theo dõi';
      if (val === 2) return 'Hoàn thành';
      if (val === 3) return 'Đã hủy';
    }

    // Loại giao dịch
    if (colLower.includes('loai')) {
      const val = typeof value === 'number' ? value : parseInt(String(value));
      if (val === 1) return 'Thu';
      if (val === 2) return 'Chi';
      if (val === 3) return 'Chuyển';
    }

    return String(value);
  };

  const getColumnLabel = (col: string): string => {
    const labels: Record<string, string> = {
      'SoTien': 'Số tiền',
      'SoDu': 'Số dư',
      'NgayGiaoDich': 'Ngày',
      'NgayTao': 'Ngày',
      'MoTa': 'Mô tả',
      'LoaiGiaoDich': 'Loại',
      'TenTaiKhoan': 'Tài khoản',
      'TieuDe': 'Tiêu đề',
      'NoiDung': 'Nội dung',
      'DaDoc': 'Trạng thái',
      'TrangThai': 'Trạng thái',
      'TenMucTieu': 'Mục tiêu',
      'SoTienMongMuon': 'Mục tiêu',
      'SoTienHienTai': 'Hiện tại',
      'LoaiCanhBao': 'Loại',
      'MoTa': 'Mô tả'
    };
    return labels[col] || col;
  };

  const getTotalAmount = (data: AiQueryResponse): string => {
    const amountCol = data.columns.find(c => c.toLowerCase().includes('sotien') || c.toLowerCase().includes('sodu'));
    if (!amountCol) return '';

    const total = data.rows.reduce((sum, row) => {
      const val = row[amountCol];
      const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(total);
  };

  const QuickCard: React.FC<QuickCardProps> = ({ title, subtitle, icon, queryType, color, onData }) => {
    const isLoading = loadingCards.has(queryType);
    const data = queryData[queryType];
    const isExpanded = expandedCard === queryType;

    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-all hover:shadow-md">
        <button
          onClick={() => {
            if (!data) {
              loadQuickQuery({ title, subtitle, icon, queryType, color });
            } else {
              setExpandedCard(isExpanded ? null : queryType);
            }
          }}
          className="w-full p-4 flex items-center gap-4 text-left"
        >
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{subtitle}</p>
          </div>
          {data && (
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{data.rows.length}</p>
              <p className="text-xs text-zinc-500">bản ghi</p>
            </div>
          )}
          <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded view */}
        {isExpanded && data && (
          <div className="border-t border-zinc-200 dark:border-zinc-700">
            {/* Summary */}
            {data.columns.some(c => c.toLowerCase().includes('sotien') || c.toLowerCase().includes('sodu')) && (
              <div className={`px-4 py-3 ${bgColorClasses[color]} border-b border-zinc-200 dark:border-zinc-700`}>
                <p className="text-xs text-zinc-500 mb-1">Tổng cộng</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{getTotalAmount(data)}</p>
              </div>
            )}

            {/* Table */}
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900 sticky top-0">
                  <tr>
                    {data.columns.slice(0, 4).map(col => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">
                        {getColumnLabel(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-t border-zinc-100 dark:border-zinc-700">
                      {data.columns.slice(0, 4).map(col => (
                        <td key={col} className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                          {formatValue(row[col], col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.rows.length > 10 && (
                <div className="px-3 py-2 text-center text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900">
                  ... và {data.rows.length - 10} bản ghi khác
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Search className="h-6 w-6 text-emerald-600" />
            AI Query Database
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Truy vấn dữ liệu tài chính bằng ngôn ngữ tự nhiên
          </p>
        </div>
        <button
          onClick={() => {
            Object.values(quickCards).forEach(card => loadQuickQuery(card));
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="text-sm font-medium">Làm mới</span>
        </button>
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickCards.map((card) => (
          <QuickCard
            key={card.queryType}
            {...card}
            onData={(data) => setQueryData(prev => ({ ...prev, [card.queryType]: data }))}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          Ví dụ câu hỏi bạn có thể hỏi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="bg-white dark:bg-zinc-700 px-2 py-1 rounded">3 giao dịch gần nhất</span>
          <span className="bg-white dark:bg-zinc-700 px-2 py-1 rounded">Chi tiêu tháng này</span>
          <span className="bg-white dark:bg-zinc-700 px-2 py-1 rounded">Thông báo chưa đọc</span>
          <span className="bg-white dark:bg-zinc-700 px-2 py-1 rounded">Tài khoản của tôi</span>
        </div>
      </div>
    </div>
  );
}
