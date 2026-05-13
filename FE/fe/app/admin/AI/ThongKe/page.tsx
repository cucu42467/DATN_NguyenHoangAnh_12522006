"use client";

import React from 'react';
import { TrendingUp, BarChart3, PieChart, ShieldCheck, Activity, Target, BrainCircuit } from 'lucide-react';
import BieuDoAIHeC from '@/features/admin/thanh_phan/AI/BieuDoAIHeC';

export default function ThongKeAIPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            AI <span className="text-indigo-600">Analytics</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <BarChart3 className="h-4 w-4 text-indigo-600" /> Thống kê & Dự báo hiệu suất mô hình tổng thể
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Model Health Check ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Prediction Mode: Dynamic</span>
           </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Độ chính xác toàn cục', value: '98.2%', delta: '+0.5%', color: 'text-emerald-500' },
           { label: 'Giao dịch gán nhãn AI', value: '1.2M', delta: '+12%', color: 'text-indigo-600' },
           { label: 'Lỗi gán nhãn TB', value: '142', delta: '-15%', color: 'text-amber-500' },
           { label: 'Dự báo chi tiêu (T+1)', value: '840 tỷ', delta: '+4%', color: 'text-zinc-900' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:scale-105 transition-all">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest opacity-60 italic">{stat.label}</span>
                  <span className={`text-[10px] font-black ${stat.delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.delta}</span>
               </div>
               <p className={`text-3xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
            </div>
         ))}
      </div>

      {/* Main Aggregated Chart Component */}
      <BieuDoAIHeC />

      {/* Model Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-zinc-950 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
               <div>
                  <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">Training Progress</h4>
                  <p className="text-4xl font-black text-white italic tracking-tighter">Model v4.5 Pre-training</p>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-white/40 italic uppercase tracking-widest">
                     <span>Epoch 120/500</span>
                     <span>82%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full w-[82%] shadow-xl shadow-indigo-500/30"></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
               <div>
                  <h4 className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-4">Anomaly Detection</h4>
                  <p className="text-4xl font-black text-zinc-900 italic tracking-tighter">Phát hiện bất thường</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full border-[6px] border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                     <span className="text-sm font-black text-zinc-900">92%</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-500 italic max-w-xs">
                     Tỉ lệ nhận diện thành công các giao dịch có nghi vấn gian lận hoặc sai lệch dữ liệu lớn.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
