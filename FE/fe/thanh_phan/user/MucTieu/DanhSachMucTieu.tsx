"use client";

import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Edit2,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MucTieuType } from '../../../types/MucTieu';
import { StaggerContainer, StaggerItem } from '@/components/animation';

interface DanhSachMucTieuProps {
  goals: MucTieuType[];
  onContribute: (goal: MucTieuType) => void;
}

export default function DanhSachMucTieu({ goals, onContribute }: DanhSachMucTieuProps) {
  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getPercentage = (current: number, target: number) => {
    if (!target || isNaN(current) || isNaN(target)) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateForecast = (target: number, current: number, targetDate: string) => {
    const remaining = target - current;
    if (remaining <= 0) return { days: 0, monthly: 0, status: 'completed' };

    const end = new Date(targetDate);
    // If targetDate is invalid, treat days remaining as 0
    if (isNaN(end.getTime())) {
      return { days: 0, monthly: remaining, status: 'invalid_date' };
    }
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { days: 0, monthly: remaining, status: 'overdue' };

    const diffMonths = diffDays / 30;
    const monthlyNeeded = remaining / (diffMonths || 1);

    return { 
      days: diffDays, 
      monthly: monthlyNeeded, 
      status: diffDays < 30 ? 'urgent' : 'on-track' 
    };
  };

  const getRandomImage = (id: number) => {
    // Sử dụng hình ảnh từ API hoặc placeholder mặc định
    return `https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&h=400&auto=format&fit=crop`; // Placeholder mặc định
  };

  return (
    <StaggerContainer staggerDelay={0.1}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {goals.map((item, index) => {
          const percent = getPercentage(item.soTienHienTai, item.soTienMucTieu);
          const forecast = calculateForecast(item.soTienMucTieu, item.soTienHienTai, item.ngayKetThuc || '');
          
          return (
            <StaggerItem key={item.mucTieuId}>
              <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
                {/* Visual Header */}
                <div className="h-56 relative overflow-hidden">
                   <img 
                     src={getRandomImage(index)} 
                     alt={item.tenMucTieu} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-90" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent"></div>
                   
                   {/* Controls */}
                   <div className="absolute top-6 right-6 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-overlay">
                      <button className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-zinc-900 transition-all hover-scale-safe">
                         <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="p-3 bg-rose-500/20 backdrop-blur-xl rounded-2xl text-rose-200 hover:bg-rose-500 hover:text-white transition-all hover-scale-safe">
                         <Trash2 className="h-5 w-5" />
                      </button>
                   </div>

                   {/* Goal Info Overlay */}
                   <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white z-overlay">
                      <div className="safe-icon-text">
                         <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg scale-75 origin-left">
                               <Target className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Saving Project</span>
                         </div>
                         <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{item.tenMucTieu}</h3>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Target Value</span>
                         <p className="text-xl font-black">{formatCurrency(item.soTienMucTieu)}</p>
                      </div>
                   </div>
                </div>

                <div className="p-10 space-y-10 bg-white dark:bg-zinc-900">
                   {/* Savings Stats */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Current Balance</span>
                         <p className="text-xl font-black text-indigo-600">{formatCurrency(item.soTienHienTai)}</p>
                      </div>
                      <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 text-right">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Days Remaining</span>
                         <p className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-end gap-2">
                            <Clock className="h-5 w-5 text-indigo-500" /> {forecast.days}
                         </p>
                      </div>
                   </div>

                   {/* Dynamic Progress Visualization */}
                   <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-2">
                            {percent === 100 ? (
                               <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            ) : (
                               <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">
                               {percent === 100 ? 'Goal Completed!' : 'Project In Progress'}
                            </span>
                         </div>
                         <span className="text-2xl font-black text-zinc-900 dark:text-white italic">{percent}%</span>
                      </div>
                      
                      <div className="relative h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1.5 shadow-inner">
                         <div 
                           className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                           style={{ width: `${percent}%` }}
                         >
                            <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-sm"></div>
                         </div>
                      </div>
                   </div>

                   {/* Financial Insight / Forecast */}
                   {percent < 100 && (
                      <div className="p-8 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-6">
                         <div className="p-4 bg-white dark:bg-indigo-900 rounded-2xl text-indigo-600 shadow-xl shadow-indigo-600/10">
                            <Sparkles className="h-8 w-8" />
                         </div>
                         <div>
                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 italic">Smart Forecast</h4>
                            <p className="text-sm font-bold text-zinc-800 dark:text-indigo-100 leading-tight">
                               Bạn cần tích lũy thêm <span className="text-indigo-600 underline underline-offset-4">{formatCurrency(forecast.monthly)}/tháng</span> để hoàn thành mục tiêu đúng thời hạn.
                            </p>
                         </div>
                      </div>
                   )}

                   <button 
                      onClick={() => onContribute(item)}
                      className="w-full h-20 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] text-xs font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                   >
                      <Plus className="h-6 w-6 group-hover/btn:rotate-90 transition-transform" />
                      <span className="uppercase tracking-widest">NẠP THÊM TIỀN TIẾT KIỆM</span>
                      <ArrowUpRight className="h-5 w-5 opacity-40 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   </button>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </div>

      {/* Placeholder Add Card */}
      <div className="bg-zinc-50 dark:bg-zinc-800/10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center p-12 group hover:border-indigo-500/50 hover:bg-indigo-50 transition-all cursor-pointer min-h-[500px]">
         <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
            <Plus className="h-12 w-12 text-indigo-600 group-hover:text-white" />
         </div>
         <span className="mt-8 text-[10px] font-black text-zinc-400 uppercase group-hover:text-indigo-600 tracking-[0.4em] text-center max-w-[150px] italic">
            Kiến tạo mục tiêu tài chính mới
         </span>
      </div>
    </StaggerContainer>
  );
}
