"use client";

import React from 'react';
import { FileText, Database, BarChart3, AlertCircle, Download, ExternalLink } from 'lucide-react';
import BangImport from '@/features/admin/thanh_phan/GiamSat/BangImport';

export default function LichSuImportPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Import <span className="text-amber-500">History</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <FileText className="h-4 w-4 text-amber-500" /> Giám sát luồng dữ liệu ngoại vi vào hệ thống
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Data integrity check ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all shadow-sm">
              <Download className="h-4 w-4" /> Export Report CSV
           </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         <div className="bg-zinc-950 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
               <div>
                  <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Parsing Success</h4>
                  <p className="text-5xl font-black text-white italic tracking-tighter">98.2%</p>
               </div>
               <p className="text-xs font-bold text-white/40 italic leading-relaxed">Tỉ lệ parse thành công dựa trên 1.2 triệu bản ghi trong tháng này.</p>
            </div>
            <BarChart3 className="absolute bottom-0 right-0 h-48 w-48 text-white/5 -mb-10 -mr-10 group-hover:scale-110 transition-transform duration-1000" />
         </div>

         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex flex-col gap-8">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-60 italic">Error Distribution</span>
                  <AlertCircle className="h-4 w-4 text-rose-500" />
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Sai định dạng ngày', percent: 65, color: 'bg-rose-500' },
                    { label: 'Số tiền không hợp lệ', percent: 25, color: 'bg-amber-500' },
                    { label: 'Trùng lặp dữ liệu', percent: 10, color: 'bg-indigo-500' },
                  ].map((err, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 w-24 uppercase truncate">{err.label}</span>
                       <div className="flex-1 h-2 bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className={`h-full ${err.color} rounded-full`} style={{ width: `${err.percent}%` }}></div>
                       </div>
                       <span className="text-[10px] font-black text-zinc-400 w-8">{err.percent}%</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px] text-white">
               <div>
                  <h4 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Data Growth</h4>
                  <p className="text-5xl font-black italic tracking-tighter text-white">+42.5 GB</p>
               </div>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors">
                  Check DB health <ExternalLink className="h-4 w-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Main Import List */}
      <BangImport />
    </div>
  );
}
