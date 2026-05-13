"use client";

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Clock,
  Calendar,
  Wallet,
  Tag,
  Save,
  Bell,
  RefreshCw,
  Infinity,
  CalendarCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { LoaiGiaoDich } from '@/kieu_du_lieu/user/GiaoDich';
import Input from '@/thanh_phan/chung/Form/Input';
import AmountInput from '@/thanh_phan/chung/Form/AmountInput';
import Select from '@/thanh_phan/chung/Form/Select';
import { taoGiaoDichDinhKy } from '@/services/giaodich/giaodichdinhky';
import { layDanhSachTaiKhoan } from '@/services/taikhoan/taikhoan';
import { layDanhSachDanhMuc } from '@/services/danhmuc/danhmuc';
import { useToast } from '@/thanh_phan/animation/Toast';

const schema = z.object({
  tenKhoan: z.string().min(2, "Tên khoản định kỳ quá ngắn"),
  soTien: z.number().min(1000, "Số tiền tối thiểu 1,000đ"),
  loai: z.nativeEnum(LoaiGiaoDich),
  danhmucId: z.string().min(1, "Vui lòng chọn danh mục"),
  taikhoanId: z.string().min(1, "Vui lòng chọn tài khoản"),
  tanSuat: z.enum(['HANG_NGAY', 'HANG_TUAN', 'HANG_THANG', 'HANG_NAM']),
  ngayBatDau: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  hinhThucKetThuc: z.enum(['VO_THOI_HAN', 'SO_LAN_LAP', 'NGAY_CU_THE']),
  giaTriKetThuc: z.any().optional(),
  nhacNho: z.boolean(),
  // ← THÊM MỚI: moTa
  moTa: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface FormGiaoDichDinhKyProps {
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export default function FormGiaoDichDinhKy({ onClose, onSubmitSuccess }: FormGiaoDichDinhKyProps) {
  const { showToast } = useToast();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [taiKhoanOptions, setTaiKhoanOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [danhMucOptions, setDanhMucOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(true);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenKhoan: "",
      soTien: 0,
      loai: LoaiGiaoDich.CHI,
      tanSuat: 'HANG_THANG',
      ngayBatDau: new Date().toISOString().split('T')[0],
      hinhThucKetThuc: 'VO_THOI_HAN',
      nhacNho: true,
      // ← THÊM MỚI: moTa
      moTa: ""
    }
  });

  const watchHinhThuc = watch("hinhThucKetThuc");
  const watchLoai = watch("loai");
  const watchSoTien = watch("soTien");

  // Load tài khoản và danh mục
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingOptions(true);
      try {
        const [taiKhoans, danhMucs] = await Promise.all([
          layDanhSachTaiKhoan(),
          layDanhSachDanhMuc(watchLoai === LoaiGiaoDich.THU ? 'THU' : 'CHI')
        ]);

        setTaiKhoanOptions(
          (taiKhoans || []).map((tk: any) => ({
            value: String(tk.taiKhoanId),
            label: tk.tenTaiKhoan
          }))
        );
        setDanhMucOptions(
          (danhMucs || []).map((dm: any) => ({
            value: String(dm.danhMucId),
            label: dm.tenDanhMuc
          }))
        );
      } catch (err) {
        console.error('Lỗi load dữ liệu:', err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadData();
  }, [watchLoai]);

  const onSubmit = async (data: FormData) => {
    try {
      const dto = {
        tenKhoanDinhKy: data.tenKhoan,
        soTien: data.soTien,
        loaiGiaoDich: data.loai === LoaiGiaoDich.THU ? 'THU' : 'CHI',
        tanSuat: data.tanSuat,
        ngayBatDau: data.ngayBatDau,
        ngayKetThuc: data.hinhThucKetThuc === 'NGAY_CU_THE' ? data.giaTriKetThuc : undefined,
        taiKhoanNguonId: parseInt(data.taikhoanId),
        danhMucId: data.danhmucId ? parseInt(data.danhmucId) : undefined,
        trangThai: true,
        // ← THÊM MỚI: moTa
        moTa: data.moTa || undefined
      };

      await taoGiaoDichDinhKy(dto);
      showToast('Thiết lập định kỳ thành công!', 'success');
      onSubmitSuccess?.(dto);
    } catch (err: any) {
      showToast(err.message || 'Có lỗi xảy ra', 'error');
      throw err;
    }
  };

  return (
    /* ========== CONTAINER ========== */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 -z-10"
        onClick={onClose}
      />

      {/* ========== FORM WRAPPER ========== */}
      <div 
        className="relative w-full max-w-2xl max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] 
                   flex flex-col
                   bg-white dark:bg-zinc-900
                   rounded-3xl sm:rounded-[2rem]
                   shadow-2xl shadow-black/20
                   animate-in fade-in zoom-in-95 duration-300"
      >
        {/* ========== HEADER ========== */}
        <header className="flex-shrink-0 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  Thiết lập Định kỳ
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tự động hóa tài chính của bạn
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-xl 
                         hover:bg-zinc-100 dark:hover:bg-zinc-800 
                         text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300
                         transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ========== BODY (SCROLLABLE) ========== */}
        <div 
          ref={bodyRef}
          className="flex-1 overflow-y-auto overscroll-contain
                     scroll-smooth
                     custom-scrollbar"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Tên khoản định kỳ */}
            <Input
              label="Tên khoản định kỳ"
              icon={Clock}
              placeholder="Ví dụ: Tiền thuê nhà, Netflix..."
              error={errors.tenKhoan?.message}
              {...register("tenKhoan")}
            />

            {/* Loại giao dịch + Số tiền */}
            <div className="space-y-4">
              {/* Toggle loại */}
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl gap-1 w-max mx-auto sm:mx-0">
                {[
                  { id: LoaiGiaoDich.CHI, label: 'Chi tiêu', color: 'bg-rose-500', hover: 'hover:bg-rose-400' },
                  { id: LoaiGiaoDich.THU, label: 'Thu nhập', color: 'bg-emerald-500', hover: 'hover:bg-emerald-400' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setValue("loai", item.id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                      watchLoai === item.id
                        ? `${item.color} text-white shadow-md scale-[1.02]`
                        : `text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 ${item.hover} hover:text-white`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <AmountInput
                label="Số tiền mỗi chu kỳ"
                value={watchSoTien}
                onChange={(val) => setValue("soTien", val, { shouldValidate: true })}
                error={errors.soTien?.message}
              />
            </div>

            {/* Tài khoản & Danh mục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tài khoản nguồn"
                icon={Wallet}
                options={taiKhoanOptions}
                {...register("taikhoanId")}
                onChange={(e) => setValue("taikhoanId", e.target.value)}
                error={errors.taikhoanId?.message}
              />
              <Select
                label="Danh mục"
                icon={Tag}
                options={danhMucOptions}
                {...register("danhmucId")}
                onChange={(e) => setValue("danhmucId", e.target.value)}
                error={errors.danhmucId?.message}
              />
            </div>

            {/* Thiết lập chu kỳ */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-4">
                <Calendar className="w-4 h-4" />
                Thiết lập chu kỳ
              </h3>

              <div className="space-y-4">
                {/* Chu kỳ & Ngày bắt đầu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Chu kỳ lặp lại"
                    icon={RefreshCw}
                    options={[
                      { value: "HANG_NGAY", label: "Hàng ngày" },
                      { value: "HANG_TUAN", label: "Hàng tuần" },
                      { value: "HANG_THANG", label: "Hàng tháng" },
                      { value: "HANG_NAM", label: "Hàng năm" },
                    ]}
                    {...register("tanSuat")}
                  />
                  <Input
                    label="Ngày bắt đầu"
                    icon={Calendar}
                    type="date"
                    {...register("ngayBatDau")}
                  />
                </div>

                {/* Thời hạn kết thúc */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-indigo-900/70 dark:text-indigo-400/70 uppercase tracking-wide">
                    Thời hạn kết thúc
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'VO_THOI_HAN', label: 'Vô thời hạn', icon: Infinity },
                      { id: 'SO_LAN_LAP', label: 'Sau số lần', icon: RefreshCw },
                      { id: 'NGAY_CU_THE', label: 'Vào ngày cụ thể', icon: CalendarCheck },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setValue("hinhThucKetThuc", opt.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                          watchHinhThuc === opt.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                        }`}
                      >
                        <opt.icon className="w-3.5 h-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic fields */}
                  {watchHinhThuc === 'SO_LAN_LAP' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <Input
                        label="Số lần lặp lại"
                        type="number"
                        placeholder="Ví dụ: 12"
                        {...register("giaTriKetThuc")}
                      />
                    </div>
                  )}

                  {watchHinhThuc === 'NGAY_CU_THE' && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <Input
                        label="Ngày kết thúc"
                        icon={CalendarCheck}
                        type="date"
                        {...register("giaTriKetThuc")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nhắc nhở */}
            <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100/50 dark:border-amber-900/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Nhắc nhở trước khi ghi sổ
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Đảm bảo bạn kiểm soát dòng tiền
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("nhacNho")}
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50 dark:peer-focus:ring-indigo-400/50 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* ← THÊM MỚI: Mô tả */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                Mô tả chi tiết
                <span className="text-xs text-zinc-400 font-normal">(tùy chọn)</span>
              </label>
              <textarea
                {...register("moTa")}
                placeholder="Thêm mô tả chi tiết cho khoản định kỳ này..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50
                  hover:border-zinc-300 dark:hover:border-zinc-600 focus:border-indigo-500 dark:focus:border-indigo-400
                  text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition-all duration-200 outline-none resize-none"
              />
            </div>

            {/* Error summary */}
            {(errors.tenKhoan || errors.soTien || errors.danhmucId || errors.taikhoanId) && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Vui lòng kiểm tra lại thông tin
                  </p>
                  <ul className="text-xs text-red-600/80 dark:text-red-400/80 space-y-0.5">
                    {errors.tenKhoan && <li>{errors.tenKhoan.message}</li>}
                    {errors.soTien && <li>{errors.soTien.message}</li>}
                    {errors.danhmucId && <li>{errors.danhmucId.message}</li>}
                    {errors.taikhoanId && <li>{errors.taikhoanId.message}</li>}
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ========== FOOTER ========== */}
        <footer className="flex-shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 
                         hover:text-zinc-900 dark:hover:text-white
                         hover:bg-zinc-100 dark:hover:bg-zinc-800
                         rounded-xl transition-all duration-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="flex-[2] flex items-center justify-center gap-2.5 py-3.5
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         hover:from-indigo-500 hover:to-purple-500
                         text-white font-semibold rounded-xl
                         shadow-lg shadow-indigo-500/30
                         hover:shadow-xl hover:shadow-indigo-500/40
                         hover:scale-[1.01] active:scale-[0.99]
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
