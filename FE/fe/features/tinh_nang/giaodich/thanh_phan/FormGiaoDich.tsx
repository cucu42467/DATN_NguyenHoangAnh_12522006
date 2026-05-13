"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calendar,
  Tag,
  Wallet,
  StickyNote,
  Save,
  Camera,
  X,
  Loader2,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { FileText } from "lucide-react";
import { LoaiGiaoDich } from '@/types/GiaoDich';
import {
  Input,
  Select,
  AmountInput,
  FormSection,
  FormGrid,
  FormActions
} from '@/thanh_phan/chung/Form';
import { Button } from '@/thanh_phan/ui';
import { uploadAnh, xoaAnh } from '@/services';
import { layDanhSachDanhMuc } from '@/services/danhmuc/danhmuc';
import { layDanhSachLoaiDanhMuc } from '@/services/danhmuc/loaidanhmuc';
import { layDanhSachTaiKhoan } from '@/services/taikhoan/taikhoan';
import { taoGiaoDich, capNhatGiaoDich, layChiTietGiaoDich, xemTruocCapNhat } from '@/services/giaodich/giaodich';
import { layCoSoApi } from '@/thu_vien/co_so_api';
import type { TaiKhoanDto, DanhMucDto, LoaiDanhMucDto } from '@/types';
import type { PreviewCapNhatGiaoDich } from '@/types/GiaoDich';

// Schema Validation
const schema = z.object({
  loaiGiaoDich: z.string().min(1, "Vui lòng chọn loại giao dịch"),
  soTien: z.coerce.number({
    invalid_type_error: "Số tiền phải là con số"
  }).min(1000, "Số tiền tối thiểu là 1,000đ"),
  ngayGiaoDich: z.string().min(1, "Vui lòng chọn ngày"),
  taiKhoanNguonId: z.coerce.number({
    invalid_type_error: "Vui lòng chọn tài khoản nguồn"
  }).min(1, "Vui lòng chọn tài khoản nguồn"),
  taiKhoanDichId: z.coerce.number().nullable().optional(),
  danhMucId: z.coerce.number({
    invalid_type_error: "Vui lòng chọn danh mục"
  }).min(1, "Vui lòng chọn danh mục"),
  ghiChu: z.string().nullable().optional(),
  // ← THÊM MỚI: tenGiaoDich
  tenGiaoDich: z.string().optional()
});

type FormData = z.infer<typeof schema>;

type FormGiaoDichType = 'THEM' | 'CHINH_SUA';

interface FormGiaoDichProps {
  type?: FormGiaoDichType;
  initialData?: any;
  onClose?: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export default function FormGiaoDich({ type, initialData, onClose, onSubmitSuccess }: FormGiaoDichProps) {
  const isEdit = Boolean(initialData?.giaoDichId) || type === 'CHINH_SUA';
  const [taiKhoanOptions, setTaiKhoanOptions] = useState<{ value: number; label: string }[]>([]);
  const [taiKhoanList, setTaiKhoanList] = useState<TaiKhoanDto[]>([]); // Lưu full object để hiển thị số dư
  const [loaiDanhMucOptions, setLoaiDanhMucOptions] = useState<LoaiDanhMucDto[]>([]);
  const [danhMucOptions, setDanhMucOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedLoaiDanhMuc, setSelectedLoaiDanhMuc] = useState<LoaiDanhMucDto | null>(null);
  const [savedDanhMucByLoai, setSavedDanhMucByLoai] = useState<Record<number, number | undefined>>({}); // Lưu danh mục đã chọn theo từng loại
  const [originalDanhMucId, setOriginalDanhMucId] = useState<number | undefined>(undefined); // Lưu danh mục gốc khi sửa
  const [originalLoaiDanhMucId, setOriginalLoaiDanhMucId] = useState<number | undefined>(undefined); // Lưu loại danh mục gốc khi sửa
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false); // Loading khi load dữ liệu edit
  const hasLoadedEditData = useRef(false);

  // Preview state cho chế độ sửa
  const [previewData, setPreviewData] = useState<PreviewCapNhatGiaoDich | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewDebounceRef = useRef<NodeJS.Timeout | null>(null);


  const isImageFile = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  // Upload state
  const [anhPreview, setAnhPreview] = useState<string | null>(null);
  const [anhFile, setAnhFile] = useState<File | null>(null);
  const [anhName, setAnhName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);



  // Load tài khoản và loại danh mục từ API
  useEffect(() => {
    console.log('[OPTIONS] Effect triggered, giaoDichId:', initialData?.giaoDichId, '| full initialData:', initialData);
    
    async function loadOptions() {
      try {
        console.log('[OPTIONS] Đang load tài khoản và loại danh mục...');
        const [taiKhoans, loaiDanhMucs] = await Promise.all([
          layDanhSachTaiKhoan(),
          layDanhSachLoaiDanhMuc()
        ]);
        
        console.log('[OPTIONS] Kết quả:', { 
          taiKhoans: taiKhoans, 
          loaiDanhMucs: loaiDanhMucs 
        });

        const taiKhoanOpts = (taiKhoans as TaiKhoanDto[]).map(tk => {
          // Handle cả PascalCase (BE) và camelCase (FE)
          console.log('DEBUG taiKhoan:', JSON.stringify(tk));
          const id = tk.taiKhoanId ?? (tk as any).TaiKhoanId;
          const ten = tk.tenTaiKhoan ?? (tk as any).TenTaiKhoan ?? `Tài khoản ${id}`;
          console.log('DEBUG id:', id, 'ten:', ten);
          return {
            value: id,
            label: ten
          };
        });

        setTaiKhoanOptions(taiKhoanOpts);
        setTaiKhoanList(taiKhoans as TaiKhoanDto[]);
        setLoaiDanhMucOptions(loaiDanhMucs);

        // Nếu là thêm mới, chọn loại đầu tiên làm mặc định và load danh mục
        if (!initialData?.giaoDichId && loaiDanhMucs.length > 0) {
          const defaultLoai = loaiDanhMucs[0];
          setSelectedLoaiDanhMuc(defaultLoai);
          
          const danhMucs = await layDanhSachDanhMuc(defaultLoai.loaiDanhMucId);
          const danhMucOpts = (danhMucs as DanhMucDto[]).map(dm => ({
            value: dm.danhMucId,
            label: dm.tenDanhMuc || `Danh mục ${dm.danhMucId}`
          }));
          setDanhMucOptions(danhMucOpts);
        }
        
        // Nếu là edit, load cả 2 loại danh mục (sẽ lọc đúng sau khi fetch chi tiết)
        if (initialData?.giaoDichId && loaiDanhMucs.length > 0) {
          // Load danh mục của loại đầu tiên làm mặc định
          const defaultLoai = loaiDanhMucs[0];
          setSelectedLoaiDanhMuc(defaultLoai);
          
          const danhMucs = await layDanhSachDanhMuc(defaultLoai.loaiDanhMucId);
          const danhMucOpts = (danhMucs as DanhMucDto[]).map(dm => ({
            value: dm.danhMucId,
            label: dm.tenDanhMuc || `Danh mục ${dm.danhMucId}`
          }));
          setDanhMucOptions(danhMucOpts);
          console.log('[OPTIONS] Edit mode - loaded danh muc for:', defaultLoai.tenLoai);
        }
      } catch (error) {
        console.error('Lỗi tải tùy chọn:', error);
      } finally {
        setLoadingOptions(false);
        setOptionsLoaded(true);
        console.log('[OPTIONS] Đã load xong, optionsLoaded = true');
      }
    }
    loadOptions();
  }, [initialData?.giaoDichId]);

  // Load danh mục khi thay đổi loại danh mục
  useEffect(() => {
    if (!selectedLoaiDanhMuc) return;
    
    const currentLoaiDanhMuc = selectedLoaiDanhMuc;
    
    async function loadDanhMucTheoLoai() {
      try {
        const danhMucs = await layDanhSachDanhMuc(currentLoaiDanhMuc.loaiDanhMucId);
        const danhMucOpts = (danhMucs as DanhMucDto[]).map(dm => ({
          value: dm.danhMucId,
          label: dm.tenDanhMuc || `Danh mục ${dm.danhMucId}`
        }));
        setDanhMucOptions(danhMucOpts);

        // Đang edit: khôi phục danh mục gốc nếu quay về loại ban đầu, reset nếu chuyển loại mới
        if (initialData?.giaoDichId) {
          if (originalLoaiDanhMucId && currentLoaiDanhMuc.loaiDanhMucId === originalLoaiDanhMucId && originalDanhMucId !== undefined) {
            setValue('danhMucId', originalDanhMucId, { shouldValidate: false });
          } else {
            setValue('danhMucId', undefined as unknown as number, { shouldValidate: false });
          }
        } else {
          // Thêm mới: restore danh mục đã lưu cho loại này (nếu có)
          const savedDanhMucId = savedDanhMucByLoai[currentLoaiDanhMuc.loaiDanhMucId];
          if (savedDanhMucId !== undefined) {
            setValue('danhMucId', savedDanhMucId, { shouldValidate: false });
          } else {
            setValue('danhMucId', undefined as unknown as number, { shouldValidate: false });
          }
        }
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    }
    loadDanhMucTheoLoai();
  }, [selectedLoaiDanhMuc, initialData?.giaoDichId, originalLoaiDanhMucId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      loaiGiaoDich: (() => {
        const v = initialData?.loaiGiaoDich as any;
        // BE đang trả về "1"=THU, "2"=CHI, có thể "3"=CHUYEN_KHOAN
        if (v === 1 || v === '1') return LoaiGiaoDich.THU;
        if (v === 2 || v === '2') return LoaiGiaoDich.CHI;
        if (v === 3 || v === '3') return LoaiGiaoDich.CHUYEN_KHOAN;
        // fallback trường hợp FE đang dùng enum chữ
        if (v === LoaiGiaoDich.THU || v === LoaiGiaoDich.CHI || v === LoaiGiaoDich.CHUYEN_KHOAN) return v;
        return LoaiGiaoDich.CHI;
      })(),
      soTien: typeof initialData?.soTien === 'number' && initialData.soTien > 0 
        ? initialData.soTien 
        : undefined,
      ngayGiaoDich: initialData?.ngayGiaoDich ?? new Date().toISOString().split('T')[0],
      taiKhoanNguonId:
        typeof initialData?.taiKhoanNguonId === 'number'
          ? initialData.taiKhoanNguonId
          : Number(initialData?.taiKhoanNguonId) || 0,
      taiKhoanDichId:
        initialData?.taiKhoanDichId === undefined || initialData?.taiKhoanDichId === null
          ? undefined
          : Number(initialData?.taiKhoanDichId),
      danhMucId:
        initialData?.danhMucId === undefined || initialData?.danhMucId === null
          ? undefined
          : Number(initialData?.danhMucId),
      ghiChu: initialData?.ghiChu ?? "",
    }
  });

  // Reset ref khi mở form edit mới
  useEffect(() => {
    hasLoadedEditData.current = false;
    setOptionsLoaded(false);
  }, [initialData?.giaoDichId]);

  // Effect để tải dữ liệu chi tiết khi chỉnh sửa (set giá trị form, set ảnh)
  useEffect(() => {
    console.log('[EDIT] Check conditions:', {
      giaoDichId: initialData?.giaoDichId,
      loaiDanhMucOptionsLength: loaiDanhMucOptions.length,
      danhMucOptionsLength: danhMucOptions.length,
      loadingOptions,
      optionsLoaded,
      hasLoaded: hasLoadedEditData.current
    });
    
    if (!initialData?.giaoDichId) {
      console.log('[EDIT] Skip - no giaoDichId');
      return;
    }
    if (hasLoadedEditData.current) {
      console.log('[EDIT] Skip - already loaded');
      return;
    }
    if (loadingOptions || loaiDanhMucOptions.length === 0 || danhMucOptions.length === 0) {
      console.log('[EDIT] Skip - options not loaded yet', { loadingOptions });
      return;
    }
    if (!optionsLoaded) {
      console.log('[EDIT] Skip - options not fully loaded');
      return;
    }
    
    const fetchData = async () => {
      console.log('[EDIT] Fetching data for giaoDichId:', initialData.giaoDichId);
      setIsLoadingData(true);
      try {
        const res = await layChiTietGiaoDich(initialData.giaoDichId);
        if (res) {
          // BE trả về ApiResponse { success, data, ... }
          const apiResponse = res as any;
          const data = apiResponse.data || apiResponse;
          console.log('[EDIT] Data received:', data);

          // Tìm loại giao dịch
          const loaiGiaoDich = (() => {
            const v = data.loaiGiaoDich;
            if (v === 1 || v === '1') return LoaiGiaoDich.THU;
            if (v === 2 || v === '2') return LoaiGiaoDich.CHI;
            return LoaiGiaoDich.CHI;
          })();

          // Tìm loại danh mục phù hợp với loaiDanhMucId từ API
          const loaiDanhMuc = loaiDanhMucOptions.find(l => l.loaiDanhMucId === data.loaiDanhMucId);
          console.log('[EDIT] loaiDanhMuc lookup:', { loaiDanhMucId: data.loaiDanhMucId, found: loaiDanhMuc, selectedLoaiDanhMuc });

          // Load danh mục đúng loại nếu cần
          let currentDanhMucOptions = danhMucOptions;
          if (loaiDanhMuc && selectedLoaiDanhMuc?.loaiDanhMucId !== data.loaiDanhMucId) {
            console.log('[EDIT] Loading correct danh muc for loaiDanhMucId:', data.loaiDanhMucId);
            const danhMucs = await layDanhSachDanhMuc(data.loaiDanhMucId);
            currentDanhMucOptions = (danhMucs as DanhMucDto[]).map(dm => ({
              value: dm.danhMucId,
              label: dm.tenDanhMuc || `Danh mục ${dm.danhMucId}`
            }));
            console.log('[EDIT] New danhMucOptions:', currentDanhMucOptions);
            setDanhMucOptions(currentDanhMucOptions);
            setSelectedLoaiDanhMuc(loaiDanhMuc);
          }

          // Tìm danhMucId - ưu tiên theo ID, backup theo tenDanhMuc
          let finalDanhMucId = data.danhMucId;
          
          // Kiểm tra danhMucId có trong options không
          const danhMucIds = currentDanhMucOptions.map(d => d.value);
          if (!danhMucIds.includes(finalDanhMucId) && data.tenDanhMuc) {
            // Tìm theo tenDanhMuc (không phân biệt hoa thường)
            const foundByName = currentDanhMucOptions.find(dm => 
              dm.label?.toLowerCase() === data.tenDanhMuc?.toLowerCase()
            );
            if (foundByName) {
              finalDanhMucId = foundByName.value;
              console.log('[EDIT] Found danhMuc by tenDanhMuc:', foundByName);
            }
          }
          console.log('[EDIT] Final danhMucId:', finalDanhMucId);

          reset({
            loaiGiaoDich,
            soTien: data.soTien,
            ngayGiaoDich: data.ngayGiaoDich ? data.ngayGiaoDich.split('T')[0] : new Date().toISOString().split('T')[0],
            taiKhoanNguonId: data.taiKhoanNguonId,
            taiKhoanDichId: data.taiKhoanDichId,
            danhMucId: finalDanhMucId,
            ghiChu: data.ghiChu || ""
          });

          // Lưu danh mục gốc và loại danh mục gốc để khôi phục khi chuyển loại rồi quay lại (chế độ sửa)
          setOriginalDanhMucId(finalDanhMucId);
          if (data.loaiDanhMucId) {
            setOriginalLoaiDanhMucId(data.loaiDanhMucId);
          }

          // Xử lý ảnh đính kèm
          if (data.tepDinhKem) {
            const fileUrl = `${layCoSoApi()}/api/upload/tep/${data.tepDinhKem}`;
            setAnhPreview(fileUrl);
            setAnhName(data.tepDinhKem);
          }
          
          hasLoadedEditData.current = true;
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết giao dịch:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [initialData?.giaoDichId, loaiDanhMucOptions.length, danhMucOptions.length, loadingOptions]);

  const watchSoTien = watch("soTien");
  const watchTaiKhoanNguon = watch("taiKhoanNguonId");
  const watchLoaiGiaoDich = watch("loaiGiaoDich");

  // Lấy số dư của tài khoản đang chọn (handle cả PascalCase và camelCase)
  const selectedTaiKhoan = taiKhoanList.find(tk => (tk.taiKhoanId ?? (tk as any).TaiKhoanId) === watchTaiKhoanNguon);
  const selectedTaiKhoanSoDu = selectedTaiKhoan?.soDu ?? (selectedTaiKhoan as any)?.SoDu;

  // Preview số dư khi thay đổi số tiền, loại giao dịch, hoặc tài khoản
  useEffect(() => {
    // Debounce để tránh gọi API quá nhiều
    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
    }

    previewDebounceRef.current = setTimeout(async () => {
      // Chờ form load xong
      if (!optionsLoaded || danhMucOptions.length === 0) return;

      const currentData = {
        soTien: watchSoTien,
        loaiGiaoDich: watchLoaiGiaoDich,
        taiKhoanNguonId: watchTaiKhoanNguon,
        danhMucId: watch("danhMucId"),
        ngayGiaoDich: watch("ngayGiaoDich"),
        ghiChu: watch("ghiChu"),
      };

      // Chỉ gọi preview nếu dữ liệu hợp lệ
      if (!currentData.soTien || !currentData.loaiGiaoDich || !currentData.taiKhoanNguonId) return;

      setPreviewLoading(true);
      try {
        // Nếu là CHỈNH SỬA: gọi API preview
        if (isEdit && initialData?.giaoDichId) {
          const apiLoaiGiaoDich = (() => {
            if (!selectedLoaiDanhMuc) return '2';
            if (selectedLoaiDanhMuc.tenLoai === 'Thu nhập') return '1';
            if (selectedLoaiDanhMuc.tenLoai === 'Chi tiêu') return '2';
            return '2';
          })();

          const preview = await xemTruocCapNhat(initialData.giaoDichId, {
            soTien: currentData.soTien,
            loaiGiaoDich: apiLoaiGiaoDich,
            taiKhoanNguonId: currentData.taiKhoanNguonId,
          } as any);
          setPreviewData(preview);
        } else {
          // THÊM MỚI: tính preview trực tiếp ở FE
          const taiKhoan = taiKhoanList.find(tk => tk.taiKhoanId === currentData.taiKhoanNguonId);
          const soDuHienTai = taiKhoan?.soDu || 0;
          
          // Xác định loại giao dịch dựa vào selectedLoaiDanhMuc ( được set ngay khi click)
          const isChiTieu = selectedLoaiDanhMuc?.tenLoai === 'Chi tiêu';
          
          let soDuMoi: number;
          if (isChiTieu) {
            soDuMoi = soDuHienTai - currentData.soTien;
          } else {
            // Thu nhập: tiền vào tài khoản
            soDuMoi = soDuHienTai + currentData.soTien;
          }
          
          setPreviewData({
            soDuHienTai,
            soDuSauKhiCapNhat: soDuMoi,
            hoanTacDuoc: true,
            coLoi: false
          });
        }
      } catch (err) {
        console.error("Lỗi preview:", err);
        setPreviewData(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 500); // Debounce 500ms

    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
      }
    };
  }, [watchSoTien, watchLoaiGiaoDich, watchTaiKhoanNguon, isEdit, initialData?.giaoDichId, optionsLoaded, danhMucOptions.length, selectedLoaiDanhMuc, taiKhoanList]);

  // Upload handlers
  const handleAnhChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnhFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnhPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAnh = async () => {
    if (anhName) {
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

  const onSubmit = async (data: FormData) => {
    // Validation: Chi tiêu không được vượt số dư
    const isChiTieu = selectedLoaiDanhMuc?.tenLoai === 'Chi tiêu' || data.loaiGiaoDich === LoaiGiaoDich.CHI;
    
    if (isChiTieu && previewData?.soDuHienTai !== undefined && previewData?.soDuSauKhiCapNhat !== undefined) {
      if (previewData.soDuSauKhiCapNhat < 0) {
        alert(`Số tiền chi (${data.soTien.toLocaleString('vi-VN')}đ) vượt quá số dư khả dụng (${previewData.soDuHienTai.toLocaleString('vi-VN')}đ). Vui lòng giảm số tiền hoặc chọn tài khoản khác.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let finalAnhName = anhName;
      if (anhFile) {
        setIsUploading(true);
        const result = await uploadAnh(anhFile);
        finalAnhName = result.tenFile;
        setIsUploading(false);
      }

      // Chuẩn hoá payload theo BE: "1"=THU, "2"=CHI, "3"=CHUYEN_KHOAN
      // Map từ selectedLoaiDanhMuc sang loaiGiaoDich
      const apiLoaiGiaoDich = (() => {
        if (!selectedLoaiDanhMuc) return '2';
        // Backend: 1 = Thu nhập, 2 = Chi tiêu
        if (selectedLoaiDanhMuc.tenLoai === 'Thu nhập') return '1';
        if (selectedLoaiDanhMuc.tenLoai === 'Chi tiêu') return '2';
        return '2';
      })();

      // Lấy thời gian hiện tại và ghép với ngày giao dịch
      const now = new Date();
      const thoiGianHienTai = now.toTimeString().split(' ')[0]; // Format: "HH:mm:ss"
      const ngayGiaoDichFull = `${data.ngayGiaoDich}T${thoiGianHienTai}`;

      const payload = {
        soTien: data.soTien,
        loaiGiaoDich: apiLoaiGiaoDich,
        danhMucId: data.danhMucId || undefined,
        taiKhoanNguonId: data.taiKhoanNguonId,
        taiKhoanDichId: undefined, // Chưa hỗ trợ chuyển khoản trong form mới
        ngayGiaoDich: ngayGiaoDichFull,
        ghiChu: data.ghiChu ?? undefined,
        tepDinhKem: finalAnhName || undefined,
        // ← THÊM MỚI: tenGiaoDich
        tenGiaoDich: data.tenGiaoDich || undefined
      };

      // Loại giao dịch hiển thị dùng mapping: API "2"=CHI (âm), "1"=THU (dương)
      // Form dùng enum LoaiGiaoDich, đảm bảo value được gửi đúng.


      if (isEdit && initialData?.giaoDichId) {
        await capNhatGiaoDich(initialData.giaoDichId, payload as any);
      } else {
        await taoGiaoDich(payload as any);
      }

      onSubmitSuccess?.(payload);
      onClose?.();
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Có lỗi xảy ra: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 relative">
      {/* Loading overlay khi load dữ liệu edit */}
      {isLoadingData && (
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Header Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          {initialData ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}
        </h1>
        <p className="text-zinc-500 mt-2">
          Điền đầy đủ thông tin để quản lý dòng tiền của bạn một cách chính xác.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* SECTION 1: LOẠI GIAO DỊCH */}
        <FormSection title="Phân loại" description="Chọn hình thức giao dịch bạn muốn thực hiện">
          <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl gap-1.5 w-fit flex-wrap">
            {loaiDanhMucOptions.map((loai) => {
              // Map loại danh mục với màu sắc
              const isThuNhap = loai.tenLoai === 'Thu nhập';
              const isChiTieu = loai.tenLoai === 'Chi tiêu';
              const colorClass = isThuNhap ? 'bg-emerald-500' : isChiTieu ? 'bg-rose-500' : 'bg-blue-500';
              const isSelected = selectedLoaiDanhMuc?.loaiDanhMucId === loai.loaiDanhMucId;
              const currentSelectedLoai = selectedLoaiDanhMuc;
              
              const handleClick = () => {
                const currentDanhMucId = watch("danhMucId");
                
                // Lưu danh mục hiện tại theo loại
                if (currentSelectedLoai) {
                  if (initialData?.giaoDichId) {
                    // Chế độ sửa: lưu danh mục gốc
                    setSavedDanhMucByLoai(prev => ({
                      ...prev,
                      [currentSelectedLoai.loaiDanhMucId]: currentDanhMucId === originalDanhMucId ? originalDanhMucId : currentDanhMucId
                    }));
                  } else {
                    // Chế độ thêm mới
                    setSavedDanhMucByLoai(prev => ({
                      ...prev,
                      [currentSelectedLoai.loaiDanhMucId]: currentDanhMucId
                    }));
                  }
                }
                
                // Reset danhMuc khi chuyển loại (vì danh mục cũ không thuộc loại mới)
                setValue('danhMucId', undefined as unknown as number, { shouldValidate: false });
                setSelectedLoaiDanhMuc(loai);
              };

              return (
                <button
                  key={loai.loaiDanhMucId}
                  type="button"
                  onClick={handleClick}
                  disabled={isLoadingData}
                  className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isSelected
                      ? `${colorClass} text-white shadow-lg scale-[1.02]`
                      : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    } ${isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loai.tenLoai}
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* SECTION 2: CHI TIẾT GIAO DỊCH */}
        <FormSection title="Thông tin chính" description="Nhập số tiền và thời gian thực hiện">
          <FormGrid columns={2}>
            <AmountInput
              id="soTien"
              label="Số tiền"
              required={true}
              value={watchSoTien}
              onChange={(val) => setValue("soTien", val, { shouldValidate: true })}
              error={errors.soTien?.message}
              quickAmounts={[50000, 100000, 200000, 500000, 1000000]}
              disabled={isLoadingData}
            />
            <Input
              id="ngayGiaoDich"
              label="Ngày giao dịch"
              required={true}
              icon={Calendar}
              type="date"
              error={errors.ngayGiaoDich?.message}
              {...register("ngayGiaoDich")}
              disabled={isLoadingData}
            />
          </FormGrid>
        </FormSection>

        {/* SECTION 3: TÀI KHOẢN & DANH MỤC */}
        <FormSection title="Luồng tiền" description="Xác định tài khoản nguồn và mục đích">
          <FormGrid columns={2}>
            <div>
              <Select
                id="taiKhoanNguonId"
                label="Tài khoản nguồn"
                required={true}
                icon={Wallet}
                options={loadingOptions ? [] : taiKhoanOptions}
                value={watchTaiKhoanNguon || ""}
                onChange={(e: any) => setValue("taiKhoanNguonId", Number(e.target.value) || 0, { shouldValidate: true })}
                error={errors.taiKhoanNguonId?.message}
                disabled={isLoadingData}
              />
              {/* Hiển thị số dư tài khoản đang chọn */}
              {watchTaiKhoanNguon && selectedTaiKhoanSoDu !== undefined && (
                <div className="mt-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Số dư hiện tại</span>
                    <span className={`text-sm font-bold ${selectedTaiKhoanSoDu < 0 ? 'text-rose-600' : 'text-indigo-700 dark:text-indigo-300'}`}>
                      {selectedTaiKhoanSoDu.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  {/* Preview số dư sau giao dịch */}
                  {isEdit && previewData && !previewData.coLoi && previewData.soDuSauKhiCapNhat !== undefined && (
                    <div className="mt-1 pt-1 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                      <span className="text-xs text-indigo-500">Sau cập nhật</span>
                      <span className={`text-xs font-bold ${previewData.soDuSauKhiCapNhat < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {previewData.soDuSauKhiCapNhat.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Select
              id="danhMucId"
              label="Danh mục"
              required={true}
              icon={Tag}
              options={loadingOptions ? [] : danhMucOptions}
              value={watch("danhMucId") || ""}
              onChange={(e: any) => setValue("danhMucId", Number(e.target.value) || 0, { shouldValidate: true })}
              error={errors.danhMucId?.message}
            />
          </FormGrid>
        </FormSection>

        {/* SECTION 4: THÔNG TIN BỔ SUNG */}
        <FormSection title="Ghi chú & Đính kèm" description="Thêm mô tả hoặc hóa đơn nếu cần">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="ghiChu" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Nội dung ghi chú</label>
              <div className="relative group">
                <StickyNote className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                <textarea
                  {...register("ghiChu")}
                  id="ghiChu"
                  placeholder="Mô tả ngắn gọn về giao dịch này..."
                  rows={5}
                  className="w-full rounded-2xl border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                ></textarea>
              </div>
            </div>

            {/* ← THÊM MỚI: Tên giao dịch */}
            <div className="space-y-2">
              <label htmlFor="tenGiaoDich" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Tên giao dịch ngắn gọn</label>
              <div className="relative group">
                <StickyNote className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  {...register("tenGiaoDich")}
                  id="tenGiaoDich"
                  placeholder="VD: Uber đi làm, Mua cơm trưa..."
                  className="w-full h-12 rounded-2xl border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-zinc-400 ml-1">Tên ngắn hiển thị thay cho ghi chú dài</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                Ảnh hóa đơn / Chứng từ (Tùy chọn)
              </label>

              <div
                onClick={() => document.getElementById('anh-hoa-don-upload')?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group
              ${anhPreview
                    ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-indigo-500 hover:bg-zinc-100'
                  }`}
              >
                <input
                  type="file"
                  id="anh-hoa-don-upload"
                  onChange={handleAnhChange}
                  accept="image/*"
                  className="hidden"
                />

                {anhPreview ? (
                  <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 aspect-video flex items-center justify-center">
                    {anhName && isImageFile(anhName) ? (
                      <img
                        src={anhPreview}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-6 text-zinc-500">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                          <FileText size={40} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center px-4 line-clamp-2">
                          {anhName || 'Tệp đính kèm'}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnh();
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm text-zinc-300 group-hover:text-indigo-500 group-hover:scale-110 transition-all">
                      <Camera className="h-6 w-6" />
                    </div>
                    <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                      Nhấn để tải ảnh hóa đơn
                    </p>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 rounded-xl flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </FormSection>

        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-6">
            <p className="text-sm text-rose-600 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Vui lòng kiểm tra lại các thông tin: {Object.values(errors).map(e => e?.message).join(", ")}
            </p>
          </div>
        )}

        {/* Preview Số dư - Hiển thị cho cả thêm mới và chỉnh sửa */}
        {(previewLoading || previewData) && (
          <div className={`p-4 rounded-2xl mb-6 ${previewData?.soDuSauKhiCapNhat !== undefined && previewData.soDuSauKhiCapNhat < 0 ? 'bg-rose-50 border border-rose-300' : previewData?.coLoi ? 'bg-rose-50 border border-rose-300' : 'bg-emerald-50 border border-emerald-200'}`}>
            {previewLoading ? (
              <div className="flex items-center gap-2 text-zinc-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Đang kiểm tra số dư...</span>
              </div>
            ) : previewData?.soDuSauKhiCapNhat !== undefined && previewData.soDuSauKhiCapNhat < 0 ? (
              // Cảnh báo số dư âm
              <div className="space-y-2">
                <p className="text-sm text-rose-600 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Số dư sau giao dịch sẽ bị âm
                </p>
                <p className="text-sm text-rose-700">
                  Số dư tài khoản sẽ giảm từ <span className="font-semibold">{previewData.soDuHienTai?.toLocaleString('vi-VN')}đ</span> 
                  xuống <span className="font-semibold text-rose-600">{previewData.soDuSauKhiCapNhat?.toLocaleString('vi-VN')}đ</span>
                </p>
              </div>
            ) : previewData?.coLoi ? (
              // Lỗi từ API (chỉnh sửa)
              <div className="space-y-2">
                <p className="text-sm text-rose-600 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Không thể cập nhật giao dịch
                </p>
                <p className="text-sm text-rose-700">{previewData.canhBao || previewData.thongBao}</p>
                <div className="mt-3 pt-3 border-t border-rose-200 text-xs text-rose-600 space-y-1">
                  <p>Số dư hiện tại: <span className="font-semibold">{previewData.soDuTaiKhoanNguonHienTai?.toLocaleString('vi-VN')}đ</span></p>
                  <p>Số tiền cũ: <span className="font-semibold">{previewData.soTienHienTai?.toLocaleString('vi-VN')}đ</span></p>
                  <p>Số tiền mới: <span className="font-semibold">{previewData.soTienMoi?.toLocaleString('vi-VN')}đ</span></p>
                </div>
              </div>
            ) : (
              // Preview OK
              <div className="space-y-2">
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Số dư sau khi cập nhật: {previewData?.soDuSauKhiCapNhat?.toLocaleString('vi-VN')}đ
                </p>
                {isEdit ? (
                  <p className="text-xs text-emerald-600">
                    Số dư tài khoản "{previewData?.tenTaiKhoanNguonMoi || previewData?.tenTaiKhoanNguonHienTai}" sẽ thay đổi từ {previewData?.soDuTaiKhoanNguonHienTai?.toLocaleString('vi-VN')}đ
                    thành {previewData?.soDuSauKhiCapNhat?.toLocaleString('vi-VN')}đ
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600">
                    Số dư tài khoản sẽ thay đổi từ {previewData?.soDuHienTai?.toLocaleString('vi-VN')}đ
                    thành {previewData?.soDuSauKhiCapNhat?.toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>
            )}
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
            disabled={isSubmitting || isUploading || previewLoading || 
              (isEdit && previewData?.coLoi === true) ||
              (previewData?.soDuSauKhiCapNhat !== undefined && previewData.soDuSauKhiCapNhat < 0)
            }
            loading={isSubmitting || isUploading}
          >
            <Save className="h-5 w-5 mr-2" />
            {isEdit ? 'Cập nhật' : 'Lưu giao dịch'}
          </Button>
        </FormActions>
      </form>
    </div>
  );
}
