"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Wallet,
  CreditCard,
  Smartphone,
  Banknote,
  Save,
  X,
  StickyNote,
  Loader2,
  Info,
  HelpCircle,
  LayoutGrid,
  PiggyBank
} from 'lucide-react';
const LoaiTaiKhoan = {
  TIEN_MAT: 'Tiền mặt',
  NGAN_HANG: 'Tài khoản ngân hàng',
  VI_DIEN_TU: 'Ví điện tử',
  THE_TIN_DUNG: 'Thẻ tín dụng',
  TIET_KIEM: 'Tiết kiệm',
} as const;
import {
  Input,
  AmountInput,
  FormSection,
  FormGrid,
  FormActions
} from '@/thanh_phan/chung/Form';
import { Button } from '@/thanh_phan/ui';
import { taoTaiKhoan, capNhatTaiKhoan } from '@/services/taikhoan/taikhoan';

const schema = z.object({
  tenTaiKhoan: z.string().min(2, "Tên tài khoản quá ngắn"),
  loaiTaiKhoan: z.string().min(1, "Vui lòng chọn loại tài khoản"),
  soDuBanDau: z.number().min(0, "Số dư không được âm"),
  tenNganHang: z.string().optional(),
  soTaiKhoan: z.string().optional(),
  hanMucTinDung: z.number().optional(),
  moTa: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface FormTaiKhoanProps {
  type?: 'THEM' | 'CHINH_SUA';
  initialData?: any;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export default function FormTaiKhoan({ type, initialData, onClose, onSubmitSuccess }: FormTaiKhoanProps) {
  const isEdit = Boolean(initialData?.taiKhoanId) || type === 'CHINH_SUA';
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenTaiKhoan: initialData?.tenTaiKhoan ?? "",
      loaiTaiKhoan: initialData?.loaiTaiKhoan ?? LoaiTaiKhoan.TIEN_MAT,
      soDuBanDau: typeof initialData?.soDuBanDau === 'number' ? initialData.soDuBanDau : (initialData?.soDu ?? 0),
      tenNganHang: initialData?.tenNganHang ?? "",
      soTaiKhoan: initialData?.soTaiKhoan ?? "",
      hanMucTinDung: initialData?.hanMucTinDung ?? 0,
      moTa: initialData?.moTa ?? "",
    }
  });

  React.useEffect(() => {
    if (!initialData) return;
    setValue('tenTaiKhoan', initialData.tenTaiKhoan ?? '');
    setValue('loaiTaiKhoan', initialData.loaiTaiKhoan ?? LoaiTaiKhoan.TIEN_MAT);
    const so = typeof initialData.soDuBanDau === 'number' ? initialData.soDuBanDau : (initialData.soDu ?? 0);
    setValue('soDuBanDau', so);
    setValue('tenNganHang', initialData.tenNganHang ?? '');
    setValue('soTaiKhoan', initialData.soTaiKhoan ?? '');
    setValue('hanMucTinDung', initialData.hanMucTinDung ?? 0);
    setValue('moTa', initialData.moTa ?? '');
  }, [initialData, setValue]);

  const watchLoai = watch("loaiTaiKhoan");
  const watchSoDu = watch("soDuBanDau");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        tenTaiKhoan: data.tenTaiKhoan,
        loaiTaiKhoan: data.loaiTaiKhoan,
        soDuBanDau: data.soDuBanDau,
        tenNganHang: data.tenNganHang,
        soTaiKhoan: data.soTaiKhoan,
        hanMucTinDung: data.hanMucTinDung,
        moTa: data.moTa || undefined
      };

      if (isEdit && initialData?.taiKhoanId) {
        // Đảm bảo taiKhoanId là số nguyên
        const taiKhoanId = Number(initialData.taiKhoanId);
        console.log('DEBUG - Cập nhật tài khoản ID:', taiKhoanId, 'Payload:', payload);
        if (!Number.isInteger(taiKhoanId) || taiKhoanId <= 0) {
          alert("ID tài khoản không hợp lệ!");
          return;
        }
        const result = await capNhatTaiKhoan(taiKhoanId, payload);
        console.log('DEBUG - Kết quả API:', result);
      } else {
        console.log('DEBUG - Tạo tài khoản mới, Payload:', payload);
        await taoTaiKhoan(payload);
      }

      console.log('DEBUG - Gọi onSubmitSuccess...');
      onSubmitSuccess?.(payload);
      console.log('DEBUG - Gọi onClose...');
      onClose?.();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-500">
      {/* Khung form nền trắng, viền xanh + accent xanh */}
      <div className="rounded-3xl border border-blue-200/70 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Header + nội dung nằm trong 1 khung gradient để form nhìn đồng nhất */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-zinc-900 dark:to-zinc-900">
          <div className="sticky top-0 z-20 bg-white dark:bg-zinc-900 p-8 border-b border-blue-100 dark:border-zinc-800 mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
            </h1>
            <p className="text-zinc-500 mt-2">
              Quản lý nguồn tiền để theo dõi dòng tiền chính xác hơn.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-10">
            {/* SECTION 1: PHÂN LOẠI */}
            <FormSection title="Phân loại" description="Chọn loại hình lưu trữ tiền tệ phù hợp">
              <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl gap-1.5 w-fit overflow-x-auto no-scrollbar">
                {[
                  { id: LoaiTaiKhoan.TIEN_MAT, label: 'Tiền mặt', color: 'bg-amber-500' },
                  { id: LoaiTaiKhoan.NGAN_HANG, label: 'Ngân hàng', color: 'bg-indigo-600' },
                  { id: LoaiTaiKhoan.VI_DIEN_TU, label: 'Ví điện tử', color: 'bg-pink-600' },
                  { id: LoaiTaiKhoan.TIET_KIEM, label: 'Tiết kiệm', color: 'bg-emerald-500' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setValue("loaiTaiKhoan", item.id)}
                    className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${watchLoai === item.id
                        ? `${item.color} text-white shadow-lg scale-[1.02]`
                        : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </FormSection>

            {/* SECTION 2: THÔNG TIN CHI TIẾT */}
            <FormSection title="Thông tin cơ bản" description="Đặt tên gợi nhớ và xác định số dư hiện tại">
              <FormGrid columns={2}>
                <Input
                  id="tenTaiKhoan"
                  label="Tên tài khoản"
                  icon={Wallet}
                  placeholder="Nhập tên..."
                  error={errors.tenTaiKhoan?.message}
                  {...register("tenTaiKhoan")}
                />
                <AmountInput
                  id="soDuBanDau"
                  label="Số dư hiện tại"
                  value={watchSoDu}
                  onChange={(val) => setValue("soDuBanDau", val, { shouldValidate: true })}
                  error={errors.soDuBanDau?.message}
                  quickAmounts={[100000, 500000, 1000000, 5000000, 10000000]}
                />
              </FormGrid>

              {watchLoai === 'NGAN_HANG' && (
                <div className="mt-8 pt-8 border-t border-dashed border-zinc-100 dark:border-zinc-800">
                   <FormGrid columns={2}>
                      <Input
                        id="tenNganHang"
                        label="Tên ngân hàng"
                        icon={CreditCard}
                        placeholder="Ví dụ: Vietcombank, Techcombank..."
                        error={errors.tenNganHang?.message}
                        {...register("tenNganHang")}
                      />
                      <Input
                        id="soTaiKhoan"
                        label="Số tài khoản"
                        icon={Smartphone}
                        placeholder="Nhập số tài khoản..."
                        error={errors.soTaiKhoan?.message}
                        {...register("soTaiKhoan")}
                      />
                      <AmountInput
                        id="hanMucTinDung"
                        label="Hạn mức tín dụng (nếu có)"
                        value={watch("hanMucTinDung") || 0}
                        onChange={(val) => setValue("hanMucTinDung", val)}
                        error={errors.hanMucTinDung?.message}
                      />
                   </FormGrid>
                </div>
              )}
            </FormSection>

            {/* SECTION 3: MÔ TẢ */}
            <FormSection title="Ghi chú thêm" description="Các thông tin bổ sung về tài khoản (nếu có)">
              <div className="space-y-2">
                <label htmlFor="moTa" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Nội dung mô tả</label>
                <div className="relative group">
                  <StickyNote className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                  <textarea
                    {...register("moTa")}
                    id="moTa"
                    placeholder="Mô tả thêm về tài khoản này..."
                    rows={5}
                    className="w-full rounded-2xl border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  ></textarea>
                </div>
              </div>
            </FormSection>

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
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                <Save className="h-5 w-5 mr-2" />
                {initialData ? 'Cập nhật' : 'Lưu tài khoản'}
              </Button>
            </FormActions>
          </form>
        </div>

      </div>

    </div>
  );
}
