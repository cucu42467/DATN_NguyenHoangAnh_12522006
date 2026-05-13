"use client";

import React from 'react';
import { Database, FileText, HardDrive, Trash2, Search, AlertCircle, BarChart3, Layers, Cloud } from 'lucide-react';
import QuanLyLuuTru from '@/features/admin/thanh_phan/CaiDat/QuanLyLuuTru';

export default function QuanLyTaiNguyenPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Cloud <span className="text-indigo-600">Storage</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Cloud className="h-4 w-4 text-indigo-600" /> Giám sát và quản lý tài nguyên lưu trữ đa đám mây
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest italic animate-pulse">S3 Glacier Check ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">CDN: Active (Edge 12)</span>
           </div>
        </div>
      </div>

      {/* Storage Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Tổng file lưu trữ', value: '1,240', color: 'text-zinc-900' },
           { label: 'Dung lượng đã dùng', value: '42.5 GB', sub: 'Tăng 2% tuần này', color: 'text-indigo-500' },
           { label: 'Lượt truy cập file', value: '8,4k', color: 'text-emerald-500' },
           { label: 'Files lỗi sync', value: '0', color: 'text-zinc-400' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">{stat.label}</span>
               <p className={`text-2xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
               {stat.sub && <p className="text-[9px] font-black text-emerald-500 mt-2 uppercase tracking-widest italic opacity-60">{stat.sub}</p>}
            </div>
         ))}
      </div>

      {/* Main Storage Component */}
      <QuanLyLuuTru />

      {/* Resource Optimization Advice */}
      <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left text-white">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Tối ưu hóa tài nguyên</h3>
               <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                 Hệ thống tự động nén ảnh hóa đơn xuống định dạng WebP với tỉ lệ nén 80% để tiết kiệm băng thông. Các file lớn hơn 10MB sẽ được chuyển vào chế độ lưu trữ lạnh (Cold Storage) sau 90 ngày không truy cập.
               </p>
            </div>
            <button className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all shrink-0 active:scale-95">
               Thiết lập Retention Policy
            </button>
         </div>
         <div className="absolute top-1/2 left-0 w-full h-full bg-white/10 blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-[4000ms]"></div>
      </div>
    </div>
  );
}
