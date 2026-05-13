"use client";

import React from 'react';
import { Database, ShieldCheck, History, RefreshCw, Zap, AlertTriangle, Cloud, Lock } from 'lucide-react';
import BangSaoLuu from '@/features/admin/thanh_phan/CaiDat/BangSaoLuu';

export default function SaoLuuKhoiPhucPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Backup <span className="text-emerald-500">& Restore</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Hệ thống sao lưu và phục hồi dữ liệu đồ án
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Snapshot Mode: Active ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Encryption: AES-256</span>
           </div>
        </div>
      </div>

      {/* Backup Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Tổng bản sao lưu', value: '42', color: 'text-zinc-900' },
           { label: 'Dung lượng backup', value: '5.2 GB', color: 'text-emerald-500' },
           { label: 'Lần cuối Restore', value: 'Chưa có', color: 'text-zinc-400' },
           { label: 'AWS S3 Status', value: 'Healthy', color: 'text-indigo-500' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2 opacity-60 italic">{stat.label}</span>
               <p className={`text-2xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
            </div>
         ))}
      </div>

      {/* Main Backup Table Component */}
      <BangSaoLuu />

      {/* Disaster Recovery Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="p-10 bg-zinc-950 text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
               <Lock className="h-10 w-10 text-indigo-400 mb-6" />
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-white">Bảo mật đa tầng</h3>
               <p className="text-sm font-medium leading-relaxed opacity-60 italic mb-10">
                 Dữ liệu sao lưu được đóng gói dưới định dạng SQL nén, mã hóa phía server. Chỉ Admin có Key mới có thể tải xuống và xem nội dung các bản snapshot này.
               </p>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                  View Security Logs <RefreshCw className="h-4 w-4" />
               </button>
            </div>
            <div className="absolute top-1/2 left-0 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
         </div>

         <div className="p-10 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-[3.5rem] flex flex-col justify-center">
            <div className="flex items-center gap-5 mb-6">
               <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-emerald-500 shadow-xl shadow-emerald-500/10">
                  <Cloud className="h-6 w-6" />
               </div>
               <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-100 uppercase italic tracking-tighter">Đồng bộ Cloud</h4>
            </div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 opacity-60 leading-relaxed italic mb-8">
               Ngoài lưu trữ nội bộ, các bản sao lưu được đồng bộ sang 2 vùng (Region) khác nhau để đảm bảo tính sẵn sàng cao (High Availability) trong trường hợp có thảm họa server.
            </p>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Region: Singapore</div>
               <div className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Region: USA</div>
            </div>
         </div>
      </div>
    </div>
  );
}
