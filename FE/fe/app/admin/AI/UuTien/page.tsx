"use client";

import React from 'react';
import { Target, Zap, Settings2, ShieldCheck, Search, Filter, Database, BrainCircuit, Type } from 'lucide-react';
import FormUuTien from '@/features/admin/thanh_phan/AI/FormUuTien';

export default function DieuchinhUuTienPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Priority <span className="text-amber-500">Tuner</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Settings2 className="h-4 w-4 text-amber-500" /> Điều chỉnh trọng số từ khóa phân loại AI
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Tinh chỉnh tối ưu ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Auto-Optimization: On</span>
           </div>
        </div>
      </div>

      {/* Tunning Strategy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Từ khóa ưu tiên', value: '250', color: 'text-zinc-900' },
           { label: 'Trọng số trung bình', value: '72%', color: 'text-indigo-600' },
           { label: 'Lỗi gán nhãn giảm', value: '24%', color: 'text-emerald-500' },
           { label: 'Category ảnh hưởng', value: '12', color: 'text-amber-500' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2 opacity-60 italic">{stat.label}</span>
               <p className={`text-3xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
            </div>
         ))}
      </div>

      {/* Main Priority Tuner Component */}
      <FormUuTien />

      {/* Security Tip Box */}
      <div className="p-10 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-[3.5rem] flex items-center gap-8">
         <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl text-amber-500 shadow-xl shadow-amber-500/10 shrink-0">
            <Zap className="h-10 w-10 animate-pulse" />
         </div>
         <div>
            <h4 className="text-lg font-black text-amber-900 dark:text-amber-100 uppercase italic tracking-tighter mb-1 leading-none">Cơ chế trọng số AI</h4>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-200 opacity-60 leading-relaxed italic">
               Trọng số (Weight) xác định mức độ tin cậy của AI khi gặp một từ khóa trong mô tả giao dịch. Việc đặt trọng số cao cho các từ khóa "Unique" sẽ triệt tiêu nhiễu từ các giao dịch rác. Mọi thiết lập sẽ có hiệu lực sau chu kỳ train lại (15 phút).
            </p>
         </div>
      </div>
    </div>
  );
}
