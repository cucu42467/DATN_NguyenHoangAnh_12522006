"use client";

import React from 'react';
import { Megaphone, Send, BellRing, History, ShieldAlert, Monitor, Smartphone, Globe } from 'lucide-react';
import FormBroadcast from '@/features/admin/thanh_phan/CaiDat/FormBroadcast';

export default function ThongBaoHeThongPage() {
  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 transition-all duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            System <span className="text-indigo-600">Broadcast</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                <Megaphone className="h-4 w-4 text-indigo-600" /> Phát sóng thông báo và cảnh báo đến toàn hệ thống
             </p>
             <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800"></span>
             <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest italic animate-pulse">Global Push ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Push Server: Online</span>
           </div>
        </div>
      </div>

      {/* Broadcast Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Thông báo đã gửi', value: '1,240', color: 'text-zinc-900' },
           { label: 'Tỉ lệ đọc TB', value: '68%', color: 'text-emerald-500' },
           { label: 'Cảnh báo khẩn cấp', value: '3', color: 'text-rose-500' },
           { label: 'Thiết bị nhận diện', value: '4,2k', color: 'text-indigo-500' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-2 opacity-60 italic">{stat.label}</span>
               <p className={`text-2xl font-black ${stat.color} dark:text-white leading-none tracking-tighter italic`}>{stat.value}</p>
            </div>
         ))}
      </div>

      {/* Main Broadcast Composer */}
      <FormBroadcast />

      {/* Targeting Insight */}
      <div className="p-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-white dark:text-zinc-950">Độ phủ sóng thông báo</h3>
               <p className="text-sm font-medium leading-relaxed opacity-60 italic">
                 Hệ thống sử dụng WebSocket để đẩy thông báo ngay lập tức đến các phiên đang online và Firebase Cloud Messaging (FCM) cho các thiết bị di động đã tắt ứng dụng. Tỉ lệ trễ trung bình: 0.8s.
               </p>
            </div>
            <div className="flex gap-4 shrink-0 font-black text-[9px] uppercase tracking-widest text-white/40 italic">
               <div className="flex flex-col items-center gap-2">
                  <Monitor className="h-8 w-8 text-indigo-400 mb-2" /> Web: 2.1k
               </div>
               <div className="flex flex-col items-center gap-2 ml-10">
                  <Smartphone className="h-8 w-8 text-emerald-400 mb-2" /> App: 2.1k
               </div>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]"></div>
      </div>
    </div>
  );
}
