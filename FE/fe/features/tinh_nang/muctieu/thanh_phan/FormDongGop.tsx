"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Wallet,
  Send,
  X,
  PlusCircle,
  ArrowRight,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  PiggyBank,
  RefreshCw,
  Info,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { taoDongGop, layChiTietMucTieu } from '@/services/muctieu/muctieu';
import { layChiTietTaiKhoan } from '@/services/taikhoan/taikhoan';
import type { MucTieuDto, TaoDongGopMucTieuDto } from '@/types/MucTieu';
import type { TaiKhoanDto } from '@/types/TaiKhoan';

const schema = z.object({
  soTien: z.number().min(1000, "Số tiền tối thiểu 1,000đ"),
  ngayDongGop: z.string().optional(),
  ghiChu: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface FormDongGopProps {
  mucTieuId: number;
  goalName: string;
  mauSac?: string;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

const QUICK_AMOUNTS = [
  { label: '50K', value: 50000 },
  { label: '100K', value: 100000 },
  { label: '200K', value: 200000 },
  { label: '500K', value: 500000 },
  { label: '1Tr', value: 1000000 },
];

export default function FormDongGop({ mucTieuId, goalName, mauSac = '#4f46e5', onClose, onSubmitSuccess }: FormDongGopProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [mucTieu, setMucTieu] = useState<MucTieuDto | null>(null);
  const [taiKhoan, setTaiKhoan] = useState<TaiKhoanDto | null>(null);
  const [soDuHienCo, setSoDuHienCo] = useState<number>(0);
  const [loadingTaiKhoan, setLoadingTaiKhoan] = useState(false);

  // Load thông tin mục tiêu và tài khoản liên kết
  useEffect(() => {
    async function loadMucTieu() {
      try {
        const data = await layChiTietMucTieu(mucTieuId);
        if (data) {
          setMucTieu(data);
          
          // Nếu có tài khoản liên kết, lấy thông tin số dư
          if (data.taiKhoanId) {
            setLoadingTaiKhoan(true);
            try {
              const tk = await layChiTietTaiKhoan(data.taiKhoanId);
              if (tk) {
                setTaiKhoan(tk);
                setSoDuHienCo(tk.soDu || 0);
              }
            } catch (err) {
              console.error('Lỗi tải tài khoản:', err);
            } finally {
              setLoadingTaiKhoan(false);
            }
          }
        }
      } catch (error) {
        console.error('Lỗi tải mục tiêu:', error);
      }
    }
    loadMucTieu();
  }, [mucTieuId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      soTien: 0,
      ngayDongGop: new Date().toISOString().split('T')[0],
      ghiChu: ""
    }
  });

  const watchSoTien = watch("soTien");
  const watchGhiChu = watch("ghiChu");

  // Format tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Kiểm tra số dư có đủ không
  const isVuotSoDu = soDuHienCo > 0 && watchSoTien > soDuHienCo;
  
  // Số tiền còn thiếu của mục tiêu
  const tienConThieu = Math.max(0, (mucTieu?.soTienMucTieu || 0) - (mucTieu?.soTienHienTai || 0));
  
  // Kiểm tra vượt quá số tiền còn thiếu
  const isVuotMucTieu = tienConThieu > 0 && watchSoTien > tienConThieu;
  
  // Mục tiêu đã đạt chưa
  const mucTieuDaDat = tienConThieu === 0 && (mucTieu?.soTienMucTieu || 0) > 0;
  
  // Số dư sau khi nạp
  const soDuSauNhap = soDuHienCo - watchSoTien;

  // Tính % hoàn thành
  const tienConLai = (mucTieu?.soTienMucTieu || 0) - (mucTieu?.soTienHienTai || 0);
  const soTienSauNhap = (mucTieu?.soTienHienTai || 0) + watchSoTien;
  const phanTramHoanThanh = mucTieu?.soTienMucTieu 
    ? Math.min(Math.round((soTienSauNhap / mucTieu.soTienMucTieu) * 100), 100)
    : 0;

  // Giới hạn số tiền nạp bằng số dư và số tiền còn thiếu (nếu có tài khoản)
  const handleQuickAmount = (amount: number) => {
    const currentValue = watchSoTien || 0;
    let newValue = currentValue + amount;
    
    // Giới hạn bởi số dư (nếu có)
    if (soDuHienCo > 0) {
      newValue = Math.min(newValue, soDuHienCo);
    }
    
    // Giới hạn bởi số tiền còn thiếu của mục tiêu
    if (tienConThieu > 0) {
      newValue = Math.min(newValue, tienConThieu);
    }
    
    setValue("soTien", newValue, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    // Validation trước khi submit
    if (soDuHienCo > 0 && data.soTien > soDuHienCo) {
      setErrorMessage(`Số dư không đủ! Số dư hiện có: ${formatCurrency(soDuHienCo)}đ`);
      return;
    }
    
    if (!mucTieuDaDat && tienConThieu > 0 && data.soTien > tienConThieu) {
      setErrorMessage(`Số tiền nạp vượt quá số tiền còn thiếu! Cần nạp tối đa: ${formatCurrency(tienConThieu)}đ`);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      const payload: TaoDongGopMucTieuDto = {
        soTien: Number(data.soTien),
        ngayDongGop: data.ngayDongGop || null,
        ghiChu: data.ghiChu || null
      };

      console.log('Đang gửi đóng góp:', { mucTieuId, payload });
      
      const result = await taoDongGop(mucTieuId, payload);
      console.log('Kết quả đóng góp:', result);
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        onSubmitSuccess?.(payload);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error("Lỗi đóng góp:", err);
      setSubmitStatus('error');
      const errorMsg = err?.thongDiep || err?.message || err?.thongBao || 'Có lỗi xảy ra. Vui lòng thử lại!';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nút submit bị disabled nếu:
  // - Đang submit
  // - Số tiền <= 0
  // - Vượt quá số dư
  // - Vượt quá số tiền còn thiếu
  const isDisabled = isSubmitting || watchSoTien <= 0 || isVuotSoDu || isVuotMucTieu;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div 
        className="relative px-8 py-6"
        style={{
          background: `linear-gradient(135deg, ${mauSac}15 0%, ${mauSac}05 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: mauSac }}
            >
              <PiggyBank className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Nạp tiền tiết kiệm
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {goalName}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
        {/* Progress Overview */}
        {mucTieu && (
          <div className="p-4 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Tiến độ mục tiêu</span>
              <span className="text-sm font-bold" style={{ color: mauSac }}>
                {phanTramHoanThanh}%
              </span>
            </div>
            <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${phanTramHoanThanh}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: mauSac }}
              />
            </div>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                Đã có: <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(mucTieu.soTienHienTai)}đ</span>
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Mục tiêu: <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(mucTieu.soTienMucTieu)}đ</span>
              </span>
            </div>
          </div>
        )}

        {/* Mục tiêu đã đạt */}
        {mucTieuDaDat && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Mục tiêu đã đạt!
              </p>
              <p className="text-xs text-emerald-500/80 dark:text-emerald-400/70 mt-1">
                Bạn đã tích lũy đủ số tiền {formatCurrency(mucTieu?.soTienMucTieu || 0)}đ cho mục tiêu này. Có thể tiếp tục nạp thêm nếu muốn!
              </p>
            </div>
          </div>
        )}

        {/* Hiển thị số dư tài khoản liên kết */}
        {taiKhoan && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Tài khoản nguồn</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{taiKhoan.tenTaiKhoan}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Số dư khả dụng</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {loadingTaiKhoan ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </span>
                ) : (
                  formatCurrency(soDuHienCo) + 'đ'
                )}
              </p>
            </div>
          </div>
        )}

        {/* Cảnh báo vượt số dư hoặc vượt mục tiêu */}
        <AnimatePresence>
          {(isVuotSoDu || isVuotMucTieu) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {isVuotMucTieu ? 'Vượt quá số tiền cần thiết!' : 'Số dư không đủ!'}
                </p>
                <p className="text-xs text-red-500/80 dark:text-red-400/70 mt-1">
                  {isVuotMucTieu ? (
                    <>Mục tiêu chỉ còn thiếu <strong>{formatCurrency(tienConThieu)}đ</strong>. Bạn chỉ cần nạp tối đa {formatCurrency(tienConThieu)}đ là đạt mục tiêu.</>
                  ) : (
                    <>Số dư hiện có: <strong>{formatCurrency(soDuHienCo)}đ</strong>. Bạn cần giảm số tiền nạp hoặc chọn tài khoản khác.</>
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transfer Icon */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-4 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
            <div className="p-3 bg-white dark:bg-zinc-700 rounded-xl shadow-sm text-zinc-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className="h-5 w-5 text-zinc-300" />
            </div>
            <div 
              className="p-3 rounded-xl shadow-lg"
              style={{ backgroundColor: mauSac }}
            >
              <PiggyBank className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Số tiền nạp */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-zinc-400" />
            Số tiền muốn nạp
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("soTien", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              max={mucTieuDaDat ? undefined : (soDuHienCo > 0 ? Math.min(soDuHienCo, tienConThieu > 0 ? tienConThieu : Infinity) : (tienConThieu > 0 ? tienConThieu : undefined))}
              className={`w-full h-14 px-4 pl-12 rounded-xl border-2 transition-all duration-200 outline-none text-2xl font-semibold
                ${errors.soTien || isVuotSoDu
                  ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400'
                }
                text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600
              `}
            />
            <PlusCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
            {watchSoTien > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
                VNĐ
              </span>
            )}
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amount) => {
              const isDisabledAmount = soDuHienCo > 0 && amount.value > soDuHienCo;
              return (
                <button
                  key={amount.value}
                  type="button"
                  onClick={() => handleQuickAmount(amount.value)}
                  disabled={isDisabledAmount}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${watchSoTien === amount.value
                      ? 'shadow-lg'
                      : ''
                    }
                    ${watchSoTien === amount.value
                      ? 'text-white'
                      : isDisabledAmount
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }
                  `}
                  style={watchSoTien === amount.value && !isDisabledAmount ? { 
                    backgroundColor: mauSac,
                    boxShadow: `0 4px 12px ${mauSac}30`
                  } : {}}
                >
                  {amount.label}
                </button>
              );
            })}
            {soDuHienCo > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAmount(
                  mucTieuDaDat 
                    ? soDuHienCo - watchSoTien 
                    : Math.min(tienConThieu, soDuHienCo) - watchSoTien
                )}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
                  ${mucTieuDaDat 
                    ? (watchSoTien >= soDuHienCo 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50')
                    : (watchSoTien >= Math.min(tienConThieu, soDuHienCo)
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50')
                  }
                `}
              >
                <TrendingUp className="w-3 h-3" />
                {mucTieuDaDat ? 'Còn lại' : 'Đủ'}
              </button>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {errors.soTien && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.soTien.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Ghi chú */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-zinc-400" />
            Ghi chú (tùy chọn)
          </label>
          <textarea
            {...register("ghiChu")}
            placeholder="VD: Tiết kiệm tháng lương..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 
              hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400
              text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              transition-all duration-200 outline-none resize-none"
          />
        </div>

        {/* Preview sau nạp */}
        {watchSoTien > 0 && mucTieu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div 
              className="p-4 rounded-2xl border-2"
              style={{ 
                borderColor: isVuotSoDu ? '#ef4444' : `${mauSac}30`,
                backgroundColor: isVuotSoDu ? '#fef2f2' : `${mauSac}05`
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${isVuotSoDu ? '#ef4444' : mauSac}20` }}
                >
                  {isVuotSoDu ? (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" style={{ color: mauSac }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {isVuotSoDu ? 'Không thể thực hiện' : 'Sau khi nạp tiền'}
                  </p>
                  {isVuotSoDu ? (
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Vượt quá số dư {formatCurrency(soDuHienCo)}đ
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {formatCurrency(soTienSauNhap)}đ
                    </p>
                  )}
                </div>
                {!isVuotSoDu && (
                  <div className="text-right">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: mauSac }}
                    >
                      {phanTramHoanThanh}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Hiển thị số dư sau nạp nếu có tài khoản */}
              {taiKhoan && !isVuotSoDu && (
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Số dư còn lại:</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(soDuSauNhap)}đ
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isDisabled}
          className={`relative w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden
            ${isDisabled
              ? 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed'
              : 'shadow-lg hover:shadow-xl'
            }
          `}
          style={!isDisabled ? { 
            backgroundColor: mauSac,
            boxShadow: `0 4px 14px ${mauSac}40`
          } : {}}
        >
          <span className={`flex items-center justify-center gap-2 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            {submitStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Thành công!
              </>
            ) : isVuotSoDu ? (
              <>
                <AlertCircle className="w-5 h-5" />
                Số dư không đủ
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Xác nhận nạp {watchSoTien > 0 ? formatCurrency(watchSoTien) + 'đ' : ''}
              </>
            )}
          </span>
          
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          {submitStatus === 'success' && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-emerald-500"
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </button>
      </form>
    </motion.div>
  );
}
