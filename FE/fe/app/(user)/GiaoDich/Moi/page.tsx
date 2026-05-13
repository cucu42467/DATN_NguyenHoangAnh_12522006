"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import FormGiaoDich from '@/features/giaodich/thanh_phan/FormGiaoDich';

export default function ThemGiaoDichPage() {
  return (
    <div className="fe-page-shell">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
         <Link 
           href="/GiaoDich" 
           className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
         >
            <ArrowLeft className="h-4 w-4" /> Quay lại
         </Link>
         <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase">
            <Sparkles className="h-3 w-3" /> AI đang hỗ trợ phân loại
         </div>
      </div>

      {/* Nội dung Form chính */}
      <FormGiaoDich type="THEM" />

      {/* Mẹo / Trợ giúp */}
      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm text-center">
         <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
           <strong>Mẹo:</strong> Bạn có thể chụp ảnh hóa đơn để AI tự động điền các thông tin như số tiền và ngày tháng, giúp tiết kiệm thời gian hơn! 📸
         </p>
      </div>
    </div>
  );
}
