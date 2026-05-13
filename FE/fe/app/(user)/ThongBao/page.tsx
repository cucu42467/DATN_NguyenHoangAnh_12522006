"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Info,
  Check,
  CheckCheck,
  Filter,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { layThongBao, danhDauDaDoc, danhDauTatCaDaDoc, ThongBaoDto, getIconLoaiThongBao, getMauLoaiThongBao } from '@/services/thongbao';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation';
import { Button } from '@/components/ui';
import Link from 'next/link';

type BoLoc = 'tat_ca' | 'chua_doc' | 'da_doc';
type LocLoai = number | null;

export default function ThongBaoPage() {
  const [thongBaos, setThongBaos] = useState<ThongBaoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [boLoc, setBoLoc] = useState<BoLoc>('tat_ca');
  const [locLoai, setLocLoai] = useState<LocLoai>(null);

  const taiThongBao = useCallback(async () => {
    try {
      setLoading(true);
      const data = await layThongBao(1, 100);
      setThongBaos(data);
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    taiThongBao();
  }, [taiThongBao]);

  const danhSachLoc = boLoc === 'chua_doc' ? false : boLoc === 'da_doc' ? true : undefined;

  const thongBaoLoc = thongBaos.filter(tb => {
    if (danhSachLoc !== undefined && tb.daDoc !== danhSachLoc) return false;
    if (locLoai !== null && tb.loaiThongBao !== locLoai) return false;
    return true;
  });

  const soLuongChuaDoc = thongBaos.filter(tb => !tb.daDoc).length;

  const handleDanhDauDaDoc = async (id: number) => {
    try {
      await danhDauDaDoc(id);
      setThongBaos(prev => prev.map(tb => 
        tb.thongBaoId === id ? { ...tb, daDoc: true } : tb
      ));
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  const handleDanhDauTatCa = async () => {
    try {
      setLoadingAction(true);
      await danhDauTatCaDaDoc();
      setThongBaos(prev => prev.map(tb => ({ ...tb, daDoc: true })));
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getIcon = (loai: number) => {
    switch (loai) {
      case 2: return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 3: return <Lightbulb className="h-5 w-5 text-emerald-600" />;
      case 4: return <TrendingUp className="h-5 w-5 text-purple-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (loai: number) => {
    switch (loai) {
      case 2: return 'bg-amber-100 dark:bg-amber-900/30';
      case 3: return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 4: return 'bg-purple-100 dark:bg-purple-900/30';
      default: return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  return (
    <div className="fe-page-shell space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <FadeIn delay={0}>
            <h1 className="text-3xl lg:text-4xl font-medium uppercase tracking-tight text-[#191c1f] dark:text-white"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
              Thông báo
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-sm text-[#8d969e] mt-1">
              {soLuongChuaDoc > 0 
                ? `Bạn có ${soLuongChuaDoc} thông báo chưa đọc`
                : 'Tất cả thông báo đã được đọc'}
            </p>
          </FadeIn>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={taiThongBao}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          {soLuongChuaDoc > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDanhDauTatCa}
              disabled={loadingAction}
            >
              <CheckCheck className="h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Trạng thái:</span>
            <div className="flex gap-1">
              {[
                { value: 'tat_ca', label: 'Tất cả' },
                { value: 'chua_doc', label: 'Chưa đọc' },
                { value: 'da_doc', label: 'Đã đọc' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setBoLoc(opt.value as BoLoc)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    boLoc === opt.value
                      ? 'bg-[#494fdf] text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {opt.label}
                  {opt.value === 'chua_doc' && soLuongChuaDoc > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
                      {soLuongChuaDoc}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loại:</span>
            <div className="flex gap-1">
              {[
                { value: null, label: 'Tất cả' },
                { value: 2, label: 'Cảnh báo', color: 'amber' },
                { value: 3, label: 'Gợi ý', color: 'emerald' },
                { value: 4, label: 'Dự đoán', color: 'purple' },
              ].map(opt => (
                <button
                  key={opt.value ?? 'all'}
                  onClick={() => setLocLoai(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    locLoai === opt.value
                      ? opt.value === 2 ? 'bg-amber-500 text-white'
                        : opt.value === 3 ? 'bg-emerald-500 text-white'
                        : opt.value === 4 ? 'bg-purple-500 text-white'
                        : 'bg-[#494fdf] text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Notification List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              <div className="h-12 w-12 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : thongBaoLoc.length === 0 ? (
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <Bell className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-[#191c1f] dark:text-white mb-2">
              Không có thông báo nào
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              {boLoc === 'chua_doc' 
                ? 'Tất cả thông báo đã được đọc!'
                : boLoc === 'da_doc'
                ? 'Chưa có thông báo nào được đánh dấu là đã đọc'
                : locLoai 
                ? `Không có thông báo loại này`
                : 'Bạn sẽ nhận được thông báo từ AI khi có cảnh báo, gợi ý hoặc dự đoán mới'}
            </p>
            {boLoc !== 'tat_ca' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setBoLoc('tat_ca'); setLocLoai(null); }}
              >
                Xem tất cả thông báo
              </Button>
            )}
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer staggerDelay={0.05}>
          {thongBaoLoc.map((tb, index) => (
            <StaggerItem key={tb.thongBaoId}>
              <FadeIn delay={index * 0.05}>
                <div 
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    tb.daDoc 
                      ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75' 
                      : 'bg-white dark:bg-zinc-900 border-[#494fdf]/30 dark:border-[#494fdf]/50 shadow-lg shadow-[#494fdf]/5'
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getBgColor(tb.loaiThongBao)}`}>
                    {getIcon(tb.loaiThongBao)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-base font-semibold ${tb.daDoc ? 'text-zinc-500 dark:text-zinc-400' : 'text-[#191c1f] dark:text-white'}`}>
                          {tb.tieuDe}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                          {tb.noiDung}
                        </p>
                      </div>
                      {!tb.daDoc && (
                        <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-[#494fdf]"></span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-zinc-400">
                        {formatDate(tb.ngayTao)}
                      </span>
                      <div className="flex items-center gap-2">
                        {tb.loaiThongBao === 2 && (
                          <Link 
                            href="/TrungTamAI"
                            className="text-xs font-medium text-[#494fdf] hover:underline"
                          >
                            Xem chi tiết
                          </Link>
                        )}
                        {!tb.daDoc && (
                          <button
                            onClick={() => handleDanhDauDaDoc(tb.thongBaoId)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                          >
                            <Check className="h-3 w-3" />
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
