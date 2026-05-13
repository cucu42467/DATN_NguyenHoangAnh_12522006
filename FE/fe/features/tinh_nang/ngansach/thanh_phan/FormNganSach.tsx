"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Target,
  Tag,
  Calendar,
  Save,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Input,
  Select,
  AmountInput,
  FormSection,
  FormGrid,
  FormActions
} from '@/thanh_phan/chung/Form';
import { Button } from '@/thanh_phan/ui';
import { layDanhSachDanhMuc } from '@/services/danhmuc/danhmuc';
import { taoNganSach, capNhatNganSach, layDanhSachNganSach } from '@/services/ngansach/ngansach';
import type { DanhMucDto, NganSachDto } from '@/types';

// Schema Validation
const schema = z.object({
  danhMucId: z.coerce.number({
    invalid_type_error: "Vui lòng chọn danh mục"
  }).min(1, "Vui lòng chọn danh mục"),
  hanMuc: z.coerce.number({
    invalid_type_error: "Hạn mức phải là con số"
  }).min(100000, "Hạn mức tối thiểu 100,000đ"),
  thang: z.coerce.number({
    invalid_type_error: "Vui lòng chọn tháng"
  }).min(1).max(12),
  nam: z.coerce.number({
    invalid_type_error: "Vui lòng chọn năm"
  }).min(2024),
  // ← THÊM MỚI: ghiChu, canhBaoPhanTram
  ghiChu: z.string().optional(),
  canhBaoPhanTram: z.coerce.number().min(0).max(100).optional()
});

type FormData = z.infer<typeof schema>;

interface FormNganSachProps {
  initialData?: any;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export default function FormNganSach({ initialData, onClose, onSubmitSuccess }: FormNganSachProps) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [danhMucOptions, setDanhMucOptions] = useState<{ value: number; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBudgets, setExistingBudgets] = useState<NganSachDto[]>([]);

  // Load danh sách ngân sách hiện có
  useEffect(() => {
    async function loadDanhMuc() {
      try {
        const danhMucs = await layDanhSachDanhMuc('CHI');
        const opts = (danhMucs as DanhMucDto[]).map(dm => ({
          value: dm.danhMucId,
          label: dm.tenDanhMuc || `Danh mục ${dm.danhMucId}`
        }));
        setDanhMucOptions(opts);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      } finally {
        setLoadingOptions(false);
      }
    }
    loadDanhMuc();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      danhMucId: 0,
      hanMuc: 0,
      thang: currentMonth,
      nam: currentYear,
      // ← THÊM MỚI: ghiChu, canhBaoPhanTram
      ghiChu: "",
      canhBaoPhanTram: 80
    }
  });

  const watchHanMuc = watch("hanMuc");
  const watchDanhMuc = watch("danhMucId");

  // Kiểm tra trùng lặp khi thay đổi danh mục
  const getDuplicateWarning = (danhMucId: number, thang: number, nam: number) => {
    if (!danhMucId || !thang || !nam) return null;
    const existing = existingBudgets.find(
      ns => ns.danhMucId === danhMucId && ns.thang === thang && ns.nam === nam && ns.nganSachId !== initialData?.nganSachId
    );
    return existing ? { tenDanhMuc: existing.tenDanhMuc, hanMuc: existing.hanMuc, nganSachId: existing.nganSachId } : null;
  };

  const duplicateWarning = getDuplicateWarning(watchDanhMuc, watch("thang"), watch("nam"));

  // Load danh sách ngân sách hiện có
  useEffect(() => {
    async function loadExistingBudgets() {
      try {
        const data = await layDanhSachNganSach(currentMonth, currentYear);
        setExistingBudgets(data || []);
      } catch (error) {
        console.error('Lỗi tải ngân sách:', error);
      }
    }
    if (!initialData) {
      loadExistingBudgets();
    }
  }, [initialData, currentMonth, currentYear]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        danhMucId: data.danhMucId,
        hanMuc: data.hanMuc,
        thang: data.thang,
        nam: data.nam,
        // ← THÊM MỚI: ghiChu, canhBaoPhanTram
        ghiChu: data.ghiChu || undefined,
        canhBaoPhanTram: data.canhBaoPhanTram || 80
      };

      if (initialData?.nganSachId) {
        await capNhatNganSach(initialData.nganSachId, payload);
      } else {
        await taoNganSach(payload);
      }

      onSubmitSuccess?.(payload);
      onClose();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tạo options cho tháng và năm
  const thangOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }));

  const namOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - 2 + i,
    label: `${currentYear - 2 + i}`
  }));

return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl mx-auto max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500">
      {/* Header Form */}
      <div className="sticky top-0 z-20 bg-white dark:bg-zinc-900 p-8 border-b border-zinc-100 dark:border-zinc-800 mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {initialData ? 'Chỉnh sửa hạn mức' : 'Thiết lập hạn mức chi tiêu'}
        </h1>
        <p className="text-zinc-500 mt-2">
          Đặt giới hạn chi tiêu cho từng danh mục để kiểm soát tài chính tốt hơn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-8">
        {/* SECTION 1: CHỌN DANH MỤC */}
        <FormSection 
          title="Danh mục chi tiêu" 
          description="Chọn danh mục bạn muốn đặt hạn mức"
        >
          <Select
            id="danhMucId"
            label="Danh mục"
            required={true}
            icon={Tag}
            options={loadingOptions ? [] : danhMucOptions}
            value={watchDanhMuc || ""}
            onChange={(e: any) => setValue("danhMucId", Number(e.target.value) || 0, { shouldValidate: true })}
            error={errors.danhMucId?.message}
            disabled={loadingOptions}
          />
        </FormSection>

        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  Danh mục "{duplicateWarning.tenDanhMuc}" đã có hạn mức trong tháng này
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Hạn mức hiện tại: <strong>{duplicateWarning.hanMuc.toLocaleString('vi-VN')} đ</strong>
                </p>
                <p className="text-xs text-amber-600 mt-2">
                  Vui lòng chọn danh mục khác hoặc chỉnh sửa ngân sách hiện có.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: HẠN MỨC */}
        <FormSection 
          title="Hạn mức chi tiêu" 
          description="Nhập số tiền tối đa cho danh mục này"
        >
          <AmountInput
            id="hanMuc"
            label="Hạn mức tối đa"
            required={true}
            value={watchHanMuc}
            onChange={(val) => setValue("hanMuc", val, { shouldValidate: true })}
            error={errors.hanMuc?.message}
            quickAmounts={[500000, 1000000, 2000000, 5000000, 10000000]}
            disabled={loadingOptions}
          />
        </FormSection>

        {/* SECTION 3: THỜI GIAN */}
        <FormSection 
          title="Thời gian áp dụng" 
          description="Chọn tháng và năm để áp dụng hạn mức"
        >
          <FormGrid columns={2}>
            <Select
              id="thang"
              label="Tháng"
              required={true}
              icon={Calendar}
              options={thangOptions}
              value={watch("thang") || currentMonth}
              onChange={(e: any) => setValue("thang", Number(e.target.value) || currentMonth, { shouldValidate: true })}
              error={errors.thang?.message}
              disabled={loadingOptions}
            />
            <Select
              id="nam"
              label="Năm"
              required={true}
              icon={Calendar}
              options={namOptions}
              value={watch("nam") || currentYear}
              onChange={(e: any) => setValue("nam", Number(e.target.value) || currentYear, { shouldValidate: true })}
              error={errors.nam?.message}
              disabled={loadingOptions}
            />
          </FormGrid>
        </FormSection>

        {/* ← THÊM MỚI: CẢNH BÁO & GHI CHÚ */}
        <FormSection
          title="Cảnh báo & Ghi chú"
          description="Thiết lập ngưỡng cảnh báo và ghi chú thêm"
        >
          <div className="space-y-6">
            {/* Ngưỡng cảnh báo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Ngưỡng cảnh báo
                <span className="text-xs text-zinc-400 font-normal">(mặc định: 80%)</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={watch("canhBaoPhanTram") || 80}
                  onChange={(e) => setValue("canhBaoPhanTram", Number(e.target.value), { shouldValidate: true })}
                  className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg min-w-[70px]">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {watch("canhBaoPhanTram") || 80}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cảnh báo sẽ được gửi khi chi tiêu vượt {watch("canhBaoPhanTram") || 80}% hạn mức
              </p>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                Ghi chú
                <span className="text-xs text-zinc-400 font-normal">(tùy chọn)</span>
              </label>
              <textarea
                {...register("ghiChu")}
                placeholder="Thêm ghi chú cho ngân sách này..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50
                  hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-amber-500 dark:focus:border-amber-400
                  text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all duration-200 outline-none resize-none"
              />
            </div>
          </div>
        </FormSection>

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
            <p className="text-sm text-rose-600 font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Vui lòng kiểm tra lại thông tin: {Object.values(errors).map(e => e?.message).join(", ")}
            </p>
          </div>
        )}

        <FormActions>
          <Button
            type="button"
            variant="neutral"
            size="lg"
            onClick={onClose}
            className="px-10"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="px-10 min-w-[200px]"
            disabled={isSubmitting || loadingOptions || !!duplicateWarning}
            loading={isSubmitting}
          >
            <Save className="h-5 w-5 mr-2" />
            {initialData ? 'Cập nhật' : 'Lưu hạn mức'}
          </Button>
        </FormActions>
      </form>
    </div>
  );
}
