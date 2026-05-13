'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Sparkles,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  TrendingDown,
  PiggyBank
} from 'lucide-react';
import { geminiPhanTichChiTieu } from '@/services/gemini';
import { FadeIn, SlideUp } from '@/thanh_phan/animation';
import { useToast } from '@/thanh_phan/animation/Toast';
import type { GeminiPhanTichResponse, GeminiGoiY } from '@/kieu_du_lieu/user/GeminiAI';

// Helper: Decode JWT token để lấy userId (sub claim)
function decodeJwtToken(token: string): { sub?: string } | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

// Helper: Lấy userId từ JWT token trong localStorage
function getUserIdFromToken(): number | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const decoded = decodeJwtToken(token);
  if (!decoded?.sub) return null;

  const userId = parseInt(decoded.sub, 10);
  return isNaN(userId) ? null : userId;
}

export default function GeminiPhanTich() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState<GeminiPhanTichResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Lấy userId từ JWT token (chính xác nhất)
    const uid = getUserIdFromToken();
    if (uid) {
      setUserId(uid);
    } else {
      // Không có token hoặc token không hợp lệ
      setError('Vui lòng đăng nhập để xem phân tích.');
      setLoading(false);
      return;
    }
  }, []);

  // Gọi API khi userId đã được set
  useEffect(() => {
    if (userId) {
      loadAnalysis();
    }
  }, [userId]);

  const loadAnalysis = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Lấy dữ liệu tháng hiện tại
      const now = new Date();
      const tuNgay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const denNgay = now.toISOString().split('T')[0];

      console.log('[GeminiPhanTich] Calling API with userId:', userId, 'tuNgay:', tuNgay, 'denNgay:', denNgay);

      const result = await geminiPhanTichChiTieu(userId, tuNgay, denNgay);

      console.log('[GeminiPhanTich] API response:', result);

      setData(result);
    } catch (err: any) {
      console.error('[GeminiPhanTich] Lỗi phân tích AI:', err);

      // Xử lý lỗi 401 - Token hết hạn
      if (err.status === 401) {
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: "Vui lòng đăng nhập lại để tiếp tục.",
          type: "error"
        });
        // Chuyển về trang đăng nhập
        router.push('/dang-nhap');
        return;
      }

      // Xử lý lỗi 403 - Không có quyền
      if (err.status === 403) {
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn không có quyền xem phân tích này.",
          type: "error"
        });
        setError("Bạn không có quyền truy cập dữ liệu này.");
        return;
      }

      // Các lỗi khác
      setError(err.message || 'Không thể phân tích. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const reAnalyze = async () => {
    setAnalyzing(true);
    await loadAnalysis();
    setAnalyzing(false);
  };

  const getIcon = (loai: string) => {
    switch (loai) {
      case 'CANH_BAO': return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      case 'KHICH_LE': return <Trophy className="h-5 w-5 text-emerald-500" />;
      case 'GOI_Y':
      default: return <Lightbulb className="h-5 w-5 text-amber-500" />;
    }
  };

  const getBgColor = (loai: string) => {
    switch (loai) {
      case 'CANH_BAO': return 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30';
      case 'KHICH_LE': return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30';
      case 'GOI_Y':
      default: return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30';
    }
  };

  const getIconBg = (loai: string) => {
    switch (loai) {
      case 'CANH_BAO': return 'bg-rose-100 dark:bg-rose-950/40 text-rose-600';
      case 'KHICH_LE': return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600';
      case 'GOI_Y':
      default: return 'bg-amber-100 dark:bg-amber-950/40 text-amber-600';
    }
  };

  if (loading) {
    return (
      <FadeIn>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 rounded-[3rem] flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm text-zinc-500">AI đang phân tích dữ liệu của bạn...</p>
        </div>
      </FadeIn>
    );
  }

  if (error) {
    return (
      <FadeIn>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 rounded-[3rem] flex flex-col items-center justify-center min-h-[400px]">
          <XCircle className="h-12 w-12 text-rose-500 mb-4" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
          <button
            onClick={reAnalyze}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full text-xs font-medium hover:bg-indigo-700 transition"
          >
            Thử lại
          </button>
        </div>
      </FadeIn>
    );
  }

  if (!data) return null;

  const { phanTich, goiY } = data;
  const tyLeSo = parseFloat(phanTich.tyLeTietKiem.replace('%', ''));

  return (
    <FadeIn>
      <div className="space-y-10">
        {/* Summary Card */}
        <SlideUp delay={0.1}>
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit className="h-40 w-40" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                  AI Insights • Cập nhật ngay
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight mb-6">
                Phân Tích Tháng Này
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thu */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="h-4 w-4 text-emerald-300" />
                    <p className="text-xs uppercase tracking-wider text-indigo-200">Tổng Thu Nhập</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">
                    {(phanTich.tongThu / 1000000).toFixed(1)}M VNĐ
                  </p>
                </div>

                {/* Chi */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-rose-300" />
                    <p className="text-xs uppercase tracking-wider text-indigo-200">Tổng Chi Tiêu</p>
                  </div>
                  <p className="text-2xl font-bold text-rose-300">
                    {(phanTich.tongChi / 1000000).toFixed(1)}M VNĐ
                  </p>
                </div>

                {/* Tiết kiệm */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-xs uppercase tracking-wider text-indigo-200 mb-2">Tỷ Lệ Tiết Kiệm</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-white">{phanTich.tyLeTietKiem}</p>
                    {tyLeSo >= 20 ? (
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    ) : tyLeSo < 10 ? (
                      <XCircle className="h-6 w-6 text-rose-400" />
                    ) : null}
                  </div>
                  <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${tyLeSo >= 20 ? 'bg-emerald-400' : tyLeSo < 10 ? 'bg-rose-400' : 'bg-amber-400'
                        }`}
                      style={{ width: `${Math.min(tyLeSo, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Danh mục chi tiêu nhiều nhất */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-rose-300" />
                  <p className="text-sm text-indigo-100">
                    Chi tiêu nhiều nhất: <span className="font-bold text-white">{phanTich.danhMucNhieuNhat}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Gợi ý từ AI */}
        <SlideUp delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-2xl">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-medium text-zinc-900 dark:text-white uppercase tracking-tight">
                Gợi Ý Tối Ưu Chi Tiêu
              </h2>
            </div>
            <button
              onClick={reAnalyze}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
              Phân tích lại
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {goiY.map((item, index) => (
              <SlideUp key={index} delay={0.1 + index * 0.05}>
                <div className={`p-6 rounded-2xl border ${getBgColor(item.loai)} transition-all hover:shadow-lg`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${getIconBg(item.loai)}`}>
                      {getIcon(item.loai)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
                          {item.tieuDe}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                          {item.loai === 'CANH_BAO' ? '⚠️ Cảnh báo' :
                            item.loai === 'KHICH_LE' ? '🏆 Khích lệ' : '💡 Gợi ý'}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {item.noiDung}
                      </p>
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </SlideUp>

        {/* Cảnh báo tháng trước */}
        {phanTich.soSanhThangTruoc.tang > 20 && (
          <SlideUp delay={0.3}>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Chi tiêu tháng này tăng {phanTich.soSanhThangTruoc.tang.toFixed(1)}% so với tháng trước
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Hãy xem xét lại các danh mục chi tiêu lớn và điều chỉnh kế hoạch tháng tới.
                  </p>
                </div>
              </div>
            </div>
          </SlideUp>
        )}
      </div>
    </FadeIn>
  );
}
