"use client";

import React from 'react';
import { Monitor, Smartphone, ShieldX, RefreshCw, Activity, Search, Target } from 'lucide-react';
import BangPhien from '@/features/admin/thanh_phan/GiamSat/BangPhien';

export default function GiamSatPhienPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Session <span className="text-emerald-500">Manager</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Monitor className="h-4 w-4 text-emerald-500" /> Giám sát phiên đăng nhập thời gian thực
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Cập nhật 5s/lần ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-zinc-950/20">
              <ShieldX className="h-4 w-4" /> Thu hồi tất cả
           </button>
        </div>
      </div>

      {/* Main Sessions UI */}
      <BangPhien />

      {/* Session Security Warning */}
      <div className="p-10 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[3.5rem] flex items-center gap-8">
         <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl text-emerald-500 shadow-xl shadow-emerald-500/10 shrink-0">
            <Target className="h-10 w-10 animate-spin-slow" />
         </div>
         <div>
            <h4 className="text-lg font-black text-emerald-900 dark:text-emerald-100 uppercase italic tracking-tighter mb-1 leading-none">Chế độ bảo vệ AI</h4>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 opacity-60 leading-relaxed italic">
               Mọi phiên đăng nhập từ IP lạ hoặc thiết bị chưa từng dùng sẽ tự động bị đánh dấu "Rủi ro cao". Admin có quyền yêu cầu xác thực 2FA lại ngay lập tức cho các phiên này.
            </p>
         </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
