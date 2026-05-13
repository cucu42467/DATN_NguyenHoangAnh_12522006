"use client";

import React from 'react';
import { Sparkles, MessageSquare, ShieldCheck, Search, Filter, Database, Target, BrainCircuit } from 'lucide-react';
import BangGoiY from '@/features/admin/thanh_phan/AI/BangGoiY';

export default function CauHinhGoiYPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            AI <span className="text-purple-600">Recommendations</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <MessageSquare className="h-4 w-4 text-purple-600" /> Quản trị nội dung tư vấn tài chính thông minh
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-purple-600 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Kiểm duyệt nội dung ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Moderation: Auto-On</span>
           </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Gợi ý chờ duyệt', value: '12', color: 'text-amber-500' },
           { label: 'Đang hiển thị', value: '1,240', color: 'text-emerald-500' },
           { label: 'Đã báo cáo', value: '3', color: 'text-rose-500' },
           { label: 'Tương tác TB', value: '12.5%', color: 'text-purple-500' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2 opacity-60 italic">{stat.label}</span>
               <p className={`text-3xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
            </div>
         ))}
      </div>

      {/* Main Moderation List */}
      <BangGoiY />

      {/* Security Tip Box */}
      <div className="p-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-white">Chính sách nội dung AI</h3>
               <p className="text-sm font-medium leading-relaxed opacity-60 italic">
                 Mọi lời khuyên tài chính từ AI đều phải tuân thủ quy tắc bảo mật dữ liệu và không được phép gợi ý các hình thức đầu tư rủi ro cao chưa qua kiểm duyệt. Admin có quyền ghi đè (Override) các gợi ý tự động.
               </p>
            </div>
            <button className="px-10 py-5 bg-purple-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-700 transition-all shrink-0">
               Thiết lập Content Filter
            </button>
         </div>
      </div>
    </div>
  );
}
