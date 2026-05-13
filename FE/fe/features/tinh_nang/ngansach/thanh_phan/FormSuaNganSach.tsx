"use client";

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Loader2,
  AlertCircle,
  AlertTriangle,
  Target
} from 'lucide-react';
import { Button } from '@/thanh_phan/ui';
import { AmountInput } from '@/thanh_phan/chung/Form';
import { capNhatHanMuc } from '@/services/ngansach/ngansach';
import { useToast } from '@/thanh_phan/animation/Toast';

interface FormSuaNganSachProps {
  nganSachId: number;
  tenDanhMuc: string;
  thang: number;
  nam: number;
  hanMucHienTai: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function FormSuaNganSach({
  nganSachId,
  tenDanhMuc,
  thang,
  nam,
  hanMucHienTai,
  onClose,
  onSuccess
}: FormSuaNganSachProps) {
  const { showToast } = useToast();
  const [hanMuc, setHanMuc] = useState(hanMucHienTai);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hanMuc || hanMuc < 100000) {
      setError("Hạn mức tối thiểu 100,000đ");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await capNhatHanMuc(nganSachId, hanMuc);
      showToast("Cập nhật hạn mức thành công!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      showToast("Không thể cập nhật hạn mức. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Chỉnh sửa hạn mức
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {tenDanhMuc} - Tháng {thang}/{nam}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Thông tin chỉ đọc */}
          <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                <Target className="h-5 w-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Hạn mức hiện tại</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  {formatCurrency(hanMucHienTai)}
                </p>
              </div>
            </div>
          </div>

          {/* Trường sửa */}
          <div className="mb-6">
            <AmountInput
              id="hanMuc"
              label="Hạn mức mới"
              required={true}
              value={hanMuc}
              onChange={(val) => {
                setHanMuc(val);
                setError(null);
              }}
              error={error || undefined}
              quickAmounts={[500000, 1000000, 2000000, 5000000, 10000000]}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="neutral"
              size="lg"
              onClick={onClose}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting || hanMuc === hanMucHienTai}
              loading={isSubmitting}
            >
              <Save className="h-5 w-5 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
