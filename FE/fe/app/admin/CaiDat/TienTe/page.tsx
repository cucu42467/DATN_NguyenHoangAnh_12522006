"use client";

import React from 'react';
import { Coins, Globe, RefreshCw, TrendingUp, History, Search, Filter } from 'lucide-react';
import BangTienTe from '@/features/admin/thanh_phan/CaiDat/BangTienTe';

export default function QuanLyTienTePage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Currency <span className="text-amber-500">& Rates</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Coins className="h-4 w-4 text-amber-500" /> Quản lý đơn vị tiền tệ và tỷ giá hối đoái
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Base: VND 🇻🇳</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Rate Sync: Enabled</span>
           </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Tiền tệ hỗ trợ', value: '12', color: 'text-zinc-900' },
           { label: 'Tỷ giá hôm nay', value: '24,500', sub: 'VND/USD', color: 'text-amber-500' },
           { label: 'Biến động TB', value: '±0.04%', color: 'text-emerald-500' },
           { label: 'Lần cuối cập nhật', value: '3 giờ trước', color: 'text-zinc-400' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2 opacity-60 italic">{stat.label}</span>
               <p className={`text-2xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
               {stat.sub && <p className="text-[9px] font-black text-zinc-400 mt-2 uppercase tracking-widest italic opacity-40">{stat.sub}</p>}
            </div>
         ))}
      </div>

      {/* Main Currency Table */}
      <BangTienTe />
    </div>
  );
}
