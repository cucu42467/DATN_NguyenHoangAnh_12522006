"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import FormTaiKhoan from '@/features/taikhoan/thanh_phan/FormTaiKhoan';

export default function ThemTaiKhoanPage() {
  const router = useRouter();

  return (
    <div className="fe-page-shell">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
         <Link 
           href="/TaiKhoan" 
           className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
         >
            <ArrowLeft className="h-4 w-4" /> Quay lại
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase">
            <ShieldCheck className="h-3 w-3" /> Kết nối an toàn & bảo mật
         </div>
      </div>

      {/* Nội dung Form chính */}
      <FormTaiKhoan 
        onClose={() => router.push('/TaiKhoan')} 
        onSubmitSuccess={() => router.push('/TaiKhoan')} 
      />

      {/* Mẹo / Trợ giúp */}
      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
         <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
           <strong>Mẹo:</strong> Bạn nên đặt tên tài khoản dễ nhớ và chọn đúng loại (Ngân hàng, Tiền mặt, Ví điện tử) để hệ thống tự động áp dụng các quy tắc tính toán số dư chính xác nhất! 💰
         </p>
      </div>
    </div>
  );
}