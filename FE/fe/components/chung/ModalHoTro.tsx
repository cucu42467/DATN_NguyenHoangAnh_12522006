"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Send, 
  Loader2, 
  MessageCircleQuestion, 
  CheckCircle, 
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  User,
  ShieldCheck
} from 'lucide-react';
import { layDanhSachPhanHoi, layDanhSachTraLoi, demTraLoiChuaDoc, PhanHoiData, PhanHoiTraloiData } from '@/services/phanhoi';
import { useUserSession } from '@/hooks/useUserSession';
import { toast } from 'react-hot-toast';

interface ModalHoTroProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRANG_THAI = [
  { value: 0, label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  { value: 1, label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  { value: 2, label: 'Đã giải quyết', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  { value: 3, label: 'Từ chối', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
];

function getStatusInfo(trangThai?: number) {
  return TRANG_THAI.find(s => s.value === trangThai) || TRANG_THAI[0];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function ModalHoTro({ isOpen, onClose }: ModalHoTroProps) {
  const { user } = useUserSession();
  const [mode, setMode] = useState<'form' | 'list'>('form');
  const [danhSachPhanHoi, setDanhSachPhanHoi] = useState<PhanHoiData[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [traLoiMap, setTraLoiMap] = useState<Record<number, PhanHoiTraloiData[]>>({});
  const [loadingTraLoi, setLoadingTraLoi] = useState<Set<number>>(new Set());
  const [soTraLoiChuaDoc, setSoTraLoiChuaDoc] = useState(0);
  
  // Form state
  const [tieuDe, setTieuDe] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load danh sách phản hồi khi mở tab "Lịch sử"
  const taiDanhSachPhanHoi = useCallback(async () => {
    if (!user?.nguoiDungId) return;
    
    try {
      const res = await layDanhSachPhanHoi(user.nguoiDungId);
      if (res.success && res.data) {
        setDanhSachPhanHoi(res.data);
      }
    } catch (error) {
      console.error('Lỗi tải danh sách phản hồi:', error);
    }
  }, [user?.nguoiDungId]);

  // Đếm số phản hồi có câu trả lời chưa đọc
  const taiSoChuaDoc = useCallback(async () => {
    if (!user?.nguoiDungId) return;
    
    try {
      const res = await demTraLoiChuaDoc(user.nguoiDungId);
      if (res.success && res.data !== undefined) {
        setSoTraLoiChuaDoc(res.data);
      }
    } catch (error) {
      console.error('Lỗi đếm chưa đọc:', error);
    }
  }, [user?.nguoiDungId]);

  // Load chi tiết câu trả lời khi expand
  const taiTraLoi = useCallback(async (phanHoiId: number) => {
    if (traLoiMap[phanHoiId]) return; // Đã load rồi
    
    setLoadingTraLoi(prev => new Set(prev).add(phanHoiId));
    
    try {
      const res = await layDanhSachTraLoi(phanHoiId);
      if (res.success && res.data) {
        setTraLoiMap(prev => ({ ...prev, [phanHoiId]: res.data! }));
      }
    } catch (error) {
      console.error('Lỗi tải câu trả lời:', error);
    } finally {
      setLoadingTraLoi(prev => {
        const next = new Set(prev);
        next.delete(phanHoiId);
        return next;
      });
    }
  }, [traLoiMap]);

  // Toggle expand và load tra lời nếu cần
  const toggleExpand = (phanHoiId: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(phanHoiId)) {
      newExpanded.delete(phanHoiId);
    } else {
      newExpanded.add(phanHoiId);
      taiTraLoi(phanHoiId);
    }
    setExpandedIds(newExpanded);
  };

  // Khi chuyển sang tab list
  useEffect(() => {
    if (mode === 'list') {
      taiDanhSachPhanHoi();
      taiSoChuaDoc();
    }
  }, [mode, taiDanhSachPhanHoi, taiSoChuaDoc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tieuDe.trim() || tieuDe.trim().length < 5) {
      toast.error('Tiêu đề phải có ít nhất 5 ký tự');
      return;
    }

    if (!noiDung.trim() || noiDung.trim().length < 10) {
      toast.error('Nội dung phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: Partial<PhanHoiData> = {
        NguoiDungId: user?.nguoiDungId,
        TieuDe: tieuDe.trim(),
        NoiDung: noiDung.trim()
      };

      const res = await layDanhSachPhanHoi(user!.nguoiDungId!); // Fake call for now, using guiPhanHoi

      // Import guiPhanHoi dynamically to avoid circular dependency
      const { guiPhanHoi } = await import('@/services/phanhoi');
      const createRes = await guiPhanHoi(data);

      if (createRes.success) {
        setIsSuccess(true);
        setTieuDe('');
        setNoiDung('');
        toast.success('Gửi phản hồi thành công! Chúng tôi sẽ phản hồi bạn nhanh nhất có thể.');
        
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      } else {
        toast.error(createRes.message || 'Đã xảy ra lỗi khi gửi phản hồi');
      }
    } catch (error) {
      console.error('Lỗi gửi phản hồi:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <MessageCircleQuestion className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">Hỗ trợ & Phản hồi</h2>
              <p className="text-white/80 text-sm mt-1">Gửi ý kiến để chúng tôi cải thiện</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setMode('form')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'form'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Gửi phản hồi mới
            </button>
            <button
              onClick={() => setMode('list')}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'list'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Lịch sử phản hồi
              {soTraLoiChuaDoc > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg animate-pulse">
                  {soTraLoiChuaDoc > 9 ? '9+' : soTraLoiChuaDoc}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'form' ? (
            <>
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Gửi thành công!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Cảm ơn bạn đã gửi phản hồi.<br />
                    Chúng tôi sẽ phản hồi bạn nhanh nhất có thể.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={tieuDe}
                      onChange={(e) => setTieuDe(e.target.value)}
                      placeholder="Nhập tiêu đề phản hồi (VD: Lỗi khi thêm giao dịch)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      maxLength={255}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{tieuDe.length}/255</p>
                  </div>

                  {/* Nội dung */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={noiDung}
                      onChange={(e) => setNoiDung(e.target.value)}
                      placeholder="Mô tả chi tiết vấn đề hoặc ý kiến của bạn..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{noiDung.length} ký tự</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !tieuDe.trim() || !noiDung.trim()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Gửi phản hồi
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Chúng tôi sẽ phản hồi bạn qua email hoặc thông báo trong ứng dụng
                  </p>
                </form>
              )}
            </>
          ) : (
            /* === LỊCH SỬ PHẢN HỒI === */
            <div className="space-y-4">
              {danhSachPhanHoi.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircleQuestion className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chưa có phản hồi nào
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Gửi phản hồi để được hỗ trợ từ đội ngũ của chúng tôi
                  </p>
                  <button
                    onClick={() => setMode('form')}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Gửi phản hồi mới
                  </button>
                </div>
              ) : (
                danhSachPhanHoi.map((phanHoi, index) => {
                  const phanHoiId = phanHoi.phanHoiId ?? `phanhoi-${index}`;
                  const isExpanded = expandedIds.has(phanHoiId);
                  const statusInfo = getStatusInfo(phanHoi.trangThai);
                  const StatusIcon = statusInfo.icon;
                  const traLoi = traLoiMap[phanHoiId] || [];
                  const isLoadingTraLoi = loadingTraLoi.has(phanHoiId);
                  const coTraLoi = traLoi.length > 0;

                  return (
                    <div
                      key={phanHoiId}
                      className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800/50 transition-all hover:shadow-md"
                    >
                      {/* Header - luôn hiển thị */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {phanHoi.tieuDe}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </span>
                              {phanHoi.trangThai === 2 && coTraLoi && (
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow">
                                  !
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {phanHoi.noiDung}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(phanHoi.ngayTao)}
                            </p>
                          </div>
                          
                          {/* Nút expand nếu đã giải quyết */}
                          {phanHoi.trangThai === 2 && (
                            <button
                              onClick={() => toggleExpand(phanHoiId)}
                              className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                              title={isExpanded ? 'Thu gọn' : 'Xem câu trả lời'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Nội dung câu trả lời - mở rộng khi click */}
                      {phanHoi.trangThai === 2 && isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-4">
                          {isLoadingTraLoi ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                              <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
                            </div>
                          ) : traLoi.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                              Chưa có câu trả lời
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {/* Câu hỏi của user */}
                              <div className="flex gap-3">
                                <div className="shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <User className="h-4 w-4 text-gray-500" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {phanHoi.tenNguoiDung || 'Bạn'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {formatDate(phanHoi.ngayTao)}
                                    </span>
                                  </div>
                                  <div className="bg-gray-100 dark:bg-zinc-700 rounded-2xl rounded-tl-sm px-4 py-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                      {phanHoi.noiDung}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Các câu trả lời */}
                              {traLoi.map((tl, idx) => (
                                <div key={tl.traLoiId ?? `traloi-${idx}`} className="flex gap-3">
                                  <div className="shrink-0">
                                    {tl.laAdmin ? (
                                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                        <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                      </div>
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <User className="h-4 w-4 text-gray-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {tl.tenNguoiGui || (tl.laAdmin ? 'Hỗ trợ viên' : 'Bạn')}
                                      </span>
                                      {tl.laAdmin && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                          Hỗ trợ
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-400">
                                        {formatDate(tl.ngayGui)}
                                      </span>
                                    </div>
                                    <div className={`rounded-2xl px-4 py-2 ${
                                      tl.laAdmin 
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 rounded-tl-sm' 
                                        : 'bg-gray-100 dark:bg-zinc-700 rounded-tl-sm'
                                    }`}>
                                      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                        {tl.noiDung}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
