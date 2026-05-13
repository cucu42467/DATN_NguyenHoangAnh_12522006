"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Target, 
  Calendar, 
  X,
  Palette,
  Upload,
  Check,
  Sparkles,
  ChevronDown,
  Image as ImageIcon,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadAnh, xoaAnh, layAnhMucTieuUrl } from '@/services';
import { layDanhSachTaiKhoan } from '@/services/taikhoan/taikhoan';
import { taoMucTieu, capNhatMucTieu, layChiTietMucTieu, anMucTieu } from '@/services/muctieu/muctieu';
import { useToast } from '@/thanh_phan/animation/Toast';
import type { TaiKhoanDto } from '@/types';
import type { MucTieuDto } from '@/types/MucTieu';

const schema = z.object({
  tenMucTieu: z.string().min(2, "Tên mục tiêu quá ngắn").max(100, "Tên mục tiêu quá dài"),
  soTienMucTieu: z.number().min(1000, "Số tiền tối thiểu là 1.000đ"),
  ngayKetThuc: z.string().optional(),
  mauSac: z.string().default("#4f46e5"),
  taiKhoanId: z.number().optional()
});

type FormData = z.infer<typeof schema>;

interface FormSuaMucTieuProps {
  mucTieuId: number;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

const PRESET_COLORS = [
  { name: 'Tím', color: '#4f46e5' },
  { name: 'Xanh dương', color: '#0ea5e9' },
  { name: 'Xanh lá', color: '#22c55e' },
  { name: 'Cam', color: '#f97316' },
  { name: 'Đỏ', color: '#ef4444' },
  { name: 'Hồng', color: '#ec4899' },
  { name: 'Vàng', color: '#eab308' },
  { name: 'Teal', color: '#14b8a6' },
];

const QUICK_AMOUNTS = [
  { label: '1Tr', value: 1000000 },
  { label: '5Tr', value: 5000000 },
  { label: '10Tr', value: 10000000 },
  { label: '20Tr', value: 20000000 },
  { label: '50Tr', value: 50000000 },
];

export default function FormSuaMucTieu({ mucTieuId, onClose, onSubmitSuccess }: FormSuaMucTieuProps) {
  const [taiKhoanOptions, setTaiKhoanOptions] = useState<{ value: number; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mucTieuData, setMucTieuData] = useState<MucTieuDto | null>(null);
  const { showToast } = useToast();
  
  // Upload state
  const [anhPreview, setAnhPreview] = useState<string | null>(null);
  const [anhFile, setAnhFile] = useState<File | null>(null);
  const [anhName, setAnhName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // UI State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Load dữ liệu mục tiêu và tài khoản
  useEffect(() => {
    async function loadData() {
      try {
        // Load mục tiêu
        const mucTieu = await layChiTietMucTieu(mucTieuId);
        if (mucTieu) {
          setMucTieuData(mucTieu);
          if (mucTieu.anh) {
            setAnhPreview(layAnhMucTieuUrl(mucTieu.anh));
            setAnhName(mucTieu.anh);
          }
        }
        
        // Load tài khoản
        const taiKhoans = await layDanhSachTaiKhoan();
        const opts = (taiKhoans as TaiKhoanDto[]).map(tk => ({
          value: tk.taiKhoanId,
          label: tk.tenTaiKhoan || `Tài khoản ${tk.taiKhoanId}`
        }));
        setTaiKhoanOptions(opts);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadData();
  }, [mucTieuId]);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset,
    formState: { errors, isValid } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      tenMucTieu: mucTieuData?.tenMucTieu || "",
      soTienMucTieu: mucTieuData?.soTienMucTieu || 0,
      ngayKetThuc: mucTieuData?.ngayKetThuc?.split('T')[0] || "",
      mauSac: mucTieuData?.mauSac || "#4f46e5",
      taiKhoanId: mucTieuData?.taiKhoanId
    }
  });

  // Update form khi có dữ liệu
  useEffect(() => {
    if (mucTieuData) {
      reset({
        tenMucTieu: mucTieuData.tenMucTieu || "",
        soTienMucTieu: mucTieuData.soTienMucTieu || 0,
        ngayKetThuc: mucTieuData.ngayKetThuc?.split('T')[0] || "",
        mauSac: mucTieuData.mauSac || "#4f46e5",
        taiKhoanId: mucTieuData.taiKhoanId
      });
    }
  }, [mucTieuData, reset]);

  const watchSoTien = watch("soTienMucTieu");
  const watchMauSac = watch("mauSac");
  const watchTenMucTieu = watch("tenMucTieu");
  const watchTaiKhoanId = watch("taiKhoanId");

  // Format tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Upload handlers
  const handleAnhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB', 'error');
        return;
      }
      setAnhFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnhPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAnh = async () => {
    if (anhName && !mucTieuData?.anh) {
      try {
        await xoaAnh(anhName);
      } catch (err) {
        console.error("Xóa ảnh thất bại:", err);
      }
    }
    setAnhPreview(null);
    setAnhFile(null);
    setAnhName(null);
  };

  const handleQuickAmount = (amount: number) => {
    const currentValue = watchSoTien || 0;
    setValue("soTienMucTieu", currentValue + amount, { shouldValidate: true });
  };

  const handleColorSelect = (color: string) => {
    setValue("mauSac", color, { shouldValidate: true });
    setShowColorPicker(false);
  };

  const handleXoaVinhVien = async () => {
    if (!confirm('Bạn có chắc muốn xóa vĩnh viễn mục tiêu này? Tiền đã tích lũy sẽ được hoàn vào tài khoản liên kết.')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await anMucTieu(mucTieuId);
      showToast('Đã xóa mục tiêu và hoàn tiền thành công!', 'success');
      onSubmitSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Lỗi:", err);
      showToast(err?.message || 'Có lỗi xảy ra!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      let savedAnhName: string | null = anhName;

      if (anhFile) {
        setIsUploading(true);
        try {
          const result = await uploadAnh(anhFile);
          savedAnhName = result.tenFile;
          setAnhName(savedAnhName);
        } catch (uploadErr) {
          console.error("Upload ảnh thất bại:", uploadErr);
          showToast('Tải ảnh lên thất bại. Vui lòng thử lại!', 'error');
          setIsUploading(false);
          setIsSubmitting(false);
          return;
        }
        setIsUploading(false);
      }

      const payload: any = {
        tenMucTieu: data.tenMucTieu,
        soTienMucTieu: Number(data.soTienMucTieu),
        soTienHienTai: mucTieuData?.soTienHienTai || 0,
        ngayBatDau: mucTieuData?.ngayBatDau || new Date().toISOString(),
        ngayKetThuc: data.ngayKetThuc || null,
        mauSac: data.mauSac,
        taiKhoanId: data.taiKhoanId || null,
        anh: savedAnhName || null
      };

      await capNhatMucTieu(mucTieuId, payload);

      setSubmitStatus('success');
      showToast('Cập nhật mục tiêu thành công!', 'success');
      setTimeout(() => {
        onSubmitSuccess?.(payload);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error("Lỗi cập nhật mục tiêu:", err);
      setSubmitStatus('error');
      
      // Parse error message từ API
      const errorMsg = err?.thongDiep || err?.message || err?.thongBao || 'Có lỗi xảy ra. Vui lòng thử lại!';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const selectedAccount = taiKhoanOptions.find(opt => opt.value === watchTaiKhoanId);

  if (loadingOptions) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 max-w-xl w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
          <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-w-xl w-full max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div 
        className="relative px-8 py-6"
        style={{
          background: `linear-gradient(135deg, ${watchMauSac}20 0%, ${watchMauSac}05 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: watchMauSac }}
            >
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Chỉnh sửa mục tiêu
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Cập nhật thông tin mục tiêu
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
        {/* Tên mục tiêu */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400" />
            Tên mục tiêu
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("tenMucTieu")}
              type="text"
              placeholder="VD: Mua laptop mới, Du lịch Nhật Bản..."
              className={`w-full h-12 px-4 pl-12 rounded-xl border-2 transition-all duration-200 outline-none
                ${errors.tenMucTieu 
                  ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400'
                }
                text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              `}
            />
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
          </div>
          <AnimatePresence mode="wait">
            {errors.tenMucTieu && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.tenMucTieu.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Số tiền mục tiêu */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-zinc-400" />
            Số tiền cần tích lũy
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              {...register("soTienMucTieu", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className={`w-full h-14 px-4 pl-12 rounded-xl border-2 transition-all duration-200 outline-none text-2xl font-semibold
                ${errors.soTienMucTieu 
                  ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-950/20' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400'
                }
                text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600
              `}
            />
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
            {watchSoTien > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
                VNĐ
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <button
                key={amount.value}
                type="button"
                onClick={() => handleQuickAmount(amount.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${watchSoTien === amount.value
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }
                `}
              >
                {amount.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row: Ngày + Tài khoản */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              Ngày hoàn thành
            </label>
            <div className="relative">
              <input
                {...register("ngayKetThuc")}
                type="date"
                className="w-full h-12 px-4 pl-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 
                  hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400
                  text-zinc-900 dark:text-white transition-all duration-200 outline-none
                  [color-scheme:light] dark:[color-scheme:dark]"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-zinc-400" />
              Tài khoản liên kết
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-full h-12 px-4 pl-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 
                  hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400
                  text-left transition-all duration-200 outline-none flex items-center justify-between
                  text-zinc-900 dark:text-white"
              >
                <span className={selectedAccount ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'}>
                  {selectedAccount?.label || 'Chọn tài khoản (tùy chọn)'}
                </span>
                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} />
              </button>
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
              
              <AnimatePresence>
                {showAccountDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden"
                  >
                    <div className="max-h-48 overflow-y-auto py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValue('taiKhoanId', undefined);
                          setShowAccountDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-zinc-500 dark:text-zinc-400"
                      >
                        Không chọn
                      </button>
                      {taiKhoanOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setValue('taiKhoanId', opt.value);
                            setShowAccountDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors
                            ${watchTaiKhoanId === opt.value ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 'text-zinc-900 dark:text-white'}
                          `}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Màu sắc */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Palette className="w-4 h-4 text-zinc-400" />
            Màu nhận diện
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full h-12 px-4 pl-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 
                hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400
                transition-all duration-200 outline-none flex items-center gap-3"
            >
              <div 
                className="w-6 h-6 rounded-lg shadow-inner"
                style={{ backgroundColor: watchMauSac }}
              />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                {PRESET_COLORS.find(c => c.color.toLowerCase() === watchMauSac?.toLowerCase())?.name || 'Tùy chỉnh'}
              </span>
            </button>
            <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 dark:text-zinc-600 pointer-events-none" />
            
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl p-4"
                >
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => handleColorSelect(preset.color)}
                        className="relative group"
                      >
                        <div 
                          className={`w-full aspect-square rounded-xl transition-all duration-200 flex items-center justify-center
                            ${watchMauSac === preset.color 
                              ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-800 scale-110' 
                              : 'hover:scale-105'
                            }
                          `}
                          style={{ 
                            backgroundColor: preset.color,
                            ringColor: preset.color
                          }}
                        >
                          {watchMauSac === preset.color && (
                            <Check className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-700">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Màu tùy chỉnh:</span>
                    <input
                      type="color"
                      {...register("mauSac")}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Upload Ảnh */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-zinc-400" />
            Hình ảnh minh họa
            <span className="text-xs text-zinc-400 font-normal">(tùy chọn)</span>
          </label>
          
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 cursor-pointer
              ${anhPreview 
                ? 'border-indigo-300 dark:border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/20' 
                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-indigo-300 dark:hover:border-indigo-500/50'
              }
            `}
          >
            <input 
              type="file" 
              id="anh-sua-muc-tieu-upload"
              onChange={handleAnhChange}
              accept="image/*"
              className="hidden" 
            />
            
            <label htmlFor="anh-sua-muc-tieu-upload" className="cursor-pointer">
              {anhPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img 
                      src={anhPreview} 
                      alt="Preview" 
                      className="h-24 w-32 object-cover rounded-xl shadow-lg border-2 border-white dark:border-zinc-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Đổi ảnh</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {anhFile?.name || 'Ảnh đã chọn'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Nhấn để thay đổi ảnh khác
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAnh();
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl">
                    <Upload className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Kéo thả ảnh hoặc nhấn để chọn
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      PNG, JPG, GIF, WEBP (tối đa 5MB)
                    </p>
                  </div>
                </div>
              )}
            </label>
            
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                  <span className="text-sm text-indigo-600 dark:text-indigo-400">Đang tải lên...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`relative w-full h-14 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden
              ${isSubmitting || isUploading
                ? 'bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30'
              }
              text-white
            `}
          >
            <span className={`flex items-center justify-center gap-2 transition-opacity ${isSubmitting || isUploading ? 'opacity-0' : 'opacity-100'}`}>
              <Check className="w-5 h-5" />
              Cập nhật mục tiêu
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
        </div>
      </form>
    </motion.div>
  );
}
