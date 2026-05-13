"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  FolderOpen,
  Image as ImageIcon,
  X,
  Loader2,
  AlertCircle,
  Tag,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LoaiMuc } from '@/types/DanhMuc';
import { layIconUrl, uploadIcon, xoaIcon } from '@/services';
import { taoDanhMuc, capNhatDanhMuc, layDanhSachDanhMuc } from '@/services/danhmuc/danhmuc';
import { useToast } from '@/thanh_phan/animation/Toast';
import { Button } from '@/components/ui';

interface FormDanhMucProps {
  initialData?: any;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function FormDanhMuc({ initialData, onSuccess, onClose }: FormDanhMucProps) {
  const { showToast } = useToast();
  
  // Build icon URL helper - sử dụng API endpoint
  const buildIconUrl = (name?: string) => {
    if (!name) return null;
    const trimmed = name.trim();
    if (!trimmed) return null;
    // Nếu là URL đầy đủ từ API, trả về luôn
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Nếu là đường dẫn /ICON/xxx.png -> chuyển thành API URL
    if (trimmed.startsWith('/ICON/')) {
      const fileName = trimmed.replace('/ICON/', '');
      return layIconUrl(fileName);
    }
    // Ngược lại coi như là tên file -> build URL
    return layIconUrl(trimmed);
  };
  
  const [loai, setLoai] = useState<LoaiMuc>(initialData?.loai || LoaiMuc.CHI);
  const [tenDanhMuc, setTenDanhMuc] = useState(initialData?.tenDanhMuc || "");
  const [mauSac, setMauSac] = useState(initialData?.mauSac || "#4f46e5");
  const [moTa, setMoTa] = useState(initialData?.moTa || "");
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.icon ? buildIconUrl(initialData.icon) : null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconName, setIconName] = useState<string | null>(initialData?.icon || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  
  // Validation states
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEdit = Boolean(initialData?.danhMucId);

  // Header gradient colors based on category type
  const headerGradient = loai === LoaiMuc.THU 
    ? 'from-emerald-500 via-teal-500 to-cyan-500'
    : 'from-red-500 via-rose-500 to-pink-500';

  const headerAccentColor = loai === LoaiMuc.THU 
    ? 'text-emerald-100/80'
    : 'text-red-100/80';

  // Validation logic
  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!tenDanhMuc.trim()) {
      newErrors.tenDanhMuc = "Tên danh mục là bắt buộc";
    } else if (tenDanhMuc.trim().length < 2) {
      newErrors.tenDanhMuc = "Tên danh mục phải có ít nhất 2 ký tự";
    } else {
      // Check for duplicate name
      try {
        setIsCheckingDuplicate(true);
        const existingCategories = await layDanhSachDanhMuc(loai);
        const isDuplicate = existingCategories.some((cat: any) => {
          // Case-insensitive comparison
          const nameMatch = cat.tenDanhMuc.toLowerCase() === tenDanhMuc.trim().toLowerCase();
          // If editing, exclude the current category
          const isNotCurrent = isEdit ? cat.danhMucId !== initialData.danhMucId : true;
          return nameMatch && isNotCurrent;
        });
        
        if (isDuplicate) {
          newErrors.tenDanhMuc = "Tên danh mục đã tồn tại";
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trùng tên:", err);
      } finally {
        setIsCheckingDuplicate(false);
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Kích thước file không được vượt quá 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage("Vui lòng chọn file hình ảnh");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setIconFile(file);
  };

  const removeIcon = async () => {
    if (iconName) {
      try {
        await xoaIcon(iconName);
      } catch (err) {
        console.error("Xóa icon thất bại:", err);
      }
    }
    setIconPreview(null);
    setIconFile(null);
    setIconName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Mark all fields as touched
    setTouched({ tenDanhMuc: true });
    
    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);
    try {
      let savedIconName: string | null = null;

      if (iconFile) {
        setIsUploading(true);
        const result = await uploadIcon(iconFile);
        savedIconName = result.tenFile;
        setIconName(savedIconName);
        setIsUploading(false);
      }

      const payload = {
        tenDanhMuc: tenDanhMuc,
        loaiDanhMuc: loai,
        mauSac: mauSac,
        icon: savedIconName || iconName || undefined,
        moTa: moTa || undefined
      };

      if (isEdit) {
        await capNhatDanhMuc(initialData.danhMucId, payload);
        showToast("Danh mục đã được cập nhật thành công!", "success");
      } else {
        await taoDanhMuc(payload);
        showToast("Danh mục đã được thêm thành công! Đang chờ xét duyệt từ quản trị viên.", "success");
      }

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error("Lỗi:", err);
      const message = err?.message || "Có lỗi xảy ra! Vui lòng thử lại.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const showError = (field: string) => touched[field] && errors[field];
  const showSuccess = (field: string) => touched[field] && !errors[field] && field === 'tenDanhMuc' && tenDanhMuc.trim().length >= 2;

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-500 ${
      loai === LoaiMuc.THU 
        ? 'from-emerald-50/30 via-teal-50/20 to-cyan-50/20 dark:from-slate-900 dark:via-emerald-950/10 dark:to-cyan-950/10'
        : 'from-red-50/30 via-rose-50/20 to-pink-50/20 dark:from-slate-900 dark:via-red-950/10 dark:to-pink-950/10'
    } p-4 md:p-8 flex items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-2xl"
      >
        {/* Main Card - Dynamic shadow based on category type */}
        <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 overflow-hidden ${
          loai === LoaiMuc.THU 
            ? 'shadow-xl shadow-emerald-500/10'
            : 'shadow-xl shadow-red-500/10'
        }`}>
          
          {/* Header - Dynamic gradient based on category type */}
          <div className={`relative px-8 pt-8 pb-6 bg-gradient-to-r ${headerGradient} overflow-hidden transition-all duration-500`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className={`absolute bottom-0 left-0 w-48 h-48 ${loai === LoaiMuc.THU ? 'bg-teal-400/20' : 'bg-orange-400/20'} rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`} />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <FolderOpen className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
                    </h1>
                    <p className={`${headerAccentColor} text-sm mt-1`}>
                      {isEdit 
                        ? 'Cập nhật thông tin danh mục của bạn'
                        : loai === LoaiMuc.THU 
                          ? 'Quản lý thu nhập hiệu quả'
                          : 'Quản lý chi tiêu thông minh'}
                    </p>
                  </div>
                </div>
                
                {onClose && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Error Alert */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-red-50/80 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50 rounded-2xl">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium flex-1">
                      {errorMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section 1: Type Toggle - MOVED TO TOP */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Loại danh mục
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chọn loại phù hợp với mục đích sử dụng
                  </p>
                </div>
              </div>
              
              <div className="flex p-1.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl gap-2">
                <motion.button
                  type="button"
                  onClick={() => setLoai(LoaiMuc.CHI)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex-1 py-4 px-6 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    loai === LoaiMuc.CHI
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {loai === LoaiMuc.CHI && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {loai === LoaiMuc.CHI && <Check className="w-4 h-4" />}
                    Chi tiêu
                  </span>
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => setLoai(LoaiMuc.THU)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex-1 py-4 px-6 rounded-xl text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    loai === LoaiMuc.THU
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {loai === LoaiMuc.THU && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {loai === LoaiMuc.THU && <Check className="w-4 h-4" />}
                    Thu nhập
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Section 2: Basic Info - REORDERED (Name first, then description) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Thông tin cơ bản
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nhập tên và mô tả cho danh mục
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Category Name with Icon - Compact design */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {/* Icon Preview/Upload - Left side */}
                    <div 
                      onClick={() => document.getElementById('icon-upload')?.click()}
                      className={`w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        iconPreview 
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 bg-slate-50 dark:bg-slate-800'
                      }`}
                    >
                      {iconPreview ? (
                        <div className="relative group">
                          <img 
                            src={iconPreview} 
                            alt="Icon" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="icon-upload"
                      onChange={handleIconChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {/* Name Input */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={tenDanhMuc}
                        onChange={(e) => setTenDanhMuc(e.target.value)}
                        onBlur={() => handleBlur('tenDanhMuc')}
                        placeholder="VD: Du lịch, Làm đẹp, Mua sắm..."
                        className={`w-full h-14 pl-12 pr-4 rounded-xl text-base font-medium transition-all outline-none ${
                          showError('tenDanhMuc')
                            ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-700 focus:border-red-500'
                            : showSuccess('tenDanhMuc')
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-300 dark:border-emerald-700 focus:border-emerald-500'
                              : 'bg-slate-50/50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400'
                        }`}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--input-text)'
                        }}
                      />
                      {/* Icon inside input */}
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center ${
                        showError('tenDanhMuc') 
                          ? 'bg-red-100 text-red-500' 
                          : showSuccess('tenDanhMuc')
                            ? 'bg-emerald-100 text-emerald-500'
                            : 'bg-transparent'
                      }`}>
                        {isCheckingDuplicate ? (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        ) : showError('tenDanhMuc') ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : showSuccess('tenDanhMuc') ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Tag className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  {showError('tenDanhMuc') && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 font-medium pl-1"
                    >
                      {errors.tenDanhMuc}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-900/10 rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Xem trước
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>Cập nhật theo thời gian thực</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
                <AnimatePresence mode="wait">
                  {iconPreview ? (
                    <motion.img
                      key="custom-icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      src={iconPreview}
                      alt="Icon"
                      className="h-14 w-14 object-cover rounded-2xl shadow-md"
                    />
                  ) : (
                    <motion.div
                      key="default-icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-3.5 rounded-2xl shadow-md bg-slate-100 dark:bg-slate-700"
                    >
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                    {tenDanhMuc || "Tên danh mục"}
                  </h4>
                  {moTa && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
                      {moTa}
                    </p>
                  )}
                  <motion.span
                    key={loai}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white ${
                      loai === LoaiMuc.THU 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                        : 'bg-gradient-to-r from-rose-500 to-pink-500'
                    }`}
                  >
                    {loai === LoaiMuc.THU ? (
                      <>
                        <Check className="w-3 h-3" /> Thu nhập
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-3 h-3" /> Chi tiêu
                      </>
                    )}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800"
            >
              {onClose && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="px-6"
                >
                  Hủy bỏ
                </Button>
              )}
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting || isUploading}
                loading={isSubmitting || isUploading}
                className={`px-8 min-w-[160px] shadow-lg ${
                  isEdit 
                    ? 'shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                    : loai === LoaiMuc.THU 
                      ? 'shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30'
                      : 'shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30'
                }`}
                leftIcon={!isSubmitting && !isUploading ? <Check className="w-4 h-4" /> : undefined}
              >
                {isEdit ? 'Cập nhật' : 'Tạo danh mục'}
              </Button>
            </motion.div>
          </form>
        </div>

        {/* Footer Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6"
        >
          Danh mục mới sẽ được xét duyệt bởi quản trị viên trước khi hiển thị
        </motion.p>
      </motion.div>
    </div>
  );
}
