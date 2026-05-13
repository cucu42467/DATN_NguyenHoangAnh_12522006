"use client";

import React from 'react';
import { Bot, Sparkles, ArrowLeft, Zap, Target, BrainCircuit, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import FormTuKhoaAI from '@/features/admin/thanh_phan/DanhMuc/FormTuKhoaAI';

export default function TuKhoaAIPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <Link 
             href="/admin/DanhMuc"
             className="flex items-center gap-3 text-zinc-400 hover:text-emerald-500 font-bold uppercase tracking-widest text-[10px] transition-all group mb-6"
           >
             <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm group-hover:-translate-x-1 transition-transform">
                <ArrowLeft className="h-4 w-4" />
             </div>
             Quay lại Cấu hình danh mục
           </Link>
           <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
             Huấn Luyện <span className="text-amber-500">Từ Khóa AI</span>
           </h1>
           <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
              <Bot className="h-4 w-4 text-emerald-500" /> Mapping logic cho hệ thống phân loại tự động
           </p>
        </div>

        <div className="flex gap-4">
           <div className="px-8 py-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Model Accuracy</p>
                 <h4 className="text-lg font-black italic tracking-tighter leading-none">94.8% <span className="text-[10px] opacity-40">Precision</span></h4>
              </div>
           </div>
        </div>
      </div>

      {/* AI Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-zinc-950 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 mb-8">
                  <BrainCircuit className="h-8 w-8" />
               </div>
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Cơ chế Auto-Classify</h3>
               <p className="text-sm font-medium leading-relaxed opacity-60 italic mb-8">
                  Hệ thống sử dụng các từ khóa ánh xạ dưới đây để gán nhãn giao dịch ngay khi người dùng nhập liệu hoặc import CSV. Độ tin cậy càng cao, tỉ lệ tự động gán nhãn chính xác càng lớn.
               </p>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:scale-105 transition-transform">
                  Xem tham số trọng số <ChevronRight className="h-4 w-4" />
               </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]"></div>
         </div>

         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">Top Keywords Performed</h4>
               <span className="text-[10px] px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 font-black tracking-widest italic">Last 24h</span>
            </div>
            <div className="space-y-6">
               {[
                 { k: 'GrabFood', t: '1,240 times', p: 98 },
                 { k: 'Petrolimex', t: '840 times', p: 99 },
                 { k: 'ShopeePay', t: '560 times', p: 85 },
               ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-900 dark:text-zinc-100 italic">{item.k} <span className="text-[10px] opacity-40 leading-none">({item.t})</span></span>
                        <span className={item.p > 95 ? 'text-emerald-500' : 'text-amber-500'}>{item.p}% Match</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.p > 95 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`} style={{ width: `${item.p}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Main Mapping Table */}
      <FormTuKhoaAI />
    </div>
  );
}
