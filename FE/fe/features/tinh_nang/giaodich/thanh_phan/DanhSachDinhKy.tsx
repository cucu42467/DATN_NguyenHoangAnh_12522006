"use client";

import React from 'react';
import {
  Calendar,
  Clock,
  Trash2,
  PlayCircle,
  PauseCircle,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { GiaoDichDinhKyType, LoaiGiaoDich } from '@/kieu_du_lieu/user/GiaoDich';

interface DanhSachDinhKyProps {
  recurringItems: GiaoDichDinhKyType[];
}

export default function DanhSachDinhKy({ recurringItems }: DanhSachDinhKyProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTanSuatLabel = (ts: string) => {
    const labels: Record<string, string> = {
      'HANG_NGAY': 'Hàng ngày',
      'HANG_TUAN': 'Hàng tuần',
      'HANG_THANG': 'Hàng tháng',
      'HANG_NAM': 'Hàng năm'
    };
    return labels[ts] || ts;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recurringItems.map((item) => (
        <div
          key={item.giaoDichDinhKyId}
          className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
        >
          {/* Top Decorative Bar */}
          <div className={`h-2 w-full ${item.trangThai ? 'bg-indigo-600' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-2xl ${
                 item.loaiGiaoDich === LoaiGiaoDich.THU
                 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600'
                 : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
               }`}>
                  <Clock className="h-6 w-6" />
               </div>

               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-indigo-600 hover:scale-110 transition-all">
                     <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2.5 bg-rose-50 dark:bg-rose-950/20 rounded-xl text-rose-400 hover:text-rose-600 hover:scale-110 transition-all">
                     <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>

            <div className="mb-6">
               <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
                  {item.tenDanhMuc}
               </h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black uppercase py-1 px-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full italic tracking-widest">
                     {getTanSuatLabel(item.tanSuat)}
                  </span>
                  <div className={`h-2 w-2 rounded-full ${item.trangThai ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.trangThai ? 'text-emerald-500' : 'text-zinc-400'}`}>
                     {item.trangThai ? 'Đang chạy' : 'Đã dừng'}
                  </span>
               </div>
            </div>

            <div className="space-y-4 p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 mb-6">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Số tiền</span>
                  <span className={`text-lg font-black ${item.loaiGiaoDich === LoaiGiaoDich.THU ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {item.loaiGiaoDich === LoaiGiaoDich.THU ? '+' : '-'}{formatCurrency(item.soTien)}
                  </span>
               </div>

               <div className="h-px bg-zinc-200/50 dark:bg-zinc-700/50"></div>

               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                     <Calendar className="h-3 w-3" /> Ngày tiếp theo
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                     {/* Calculation placeholder */}
                     15 Tháng này
                  </span>
               </div>

               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                     <AlertCircle className="h-3 w-3" /> Kết thúc
                  </div>
                  <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase italic">
                     {item.ngayKetThuc || 'Vô thời hạn'}
                  </span>
               </div>
            </div>

            <div className="flex gap-3">
               <button className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 item.trangThai
                 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200'
                 : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-700'
               }`}>
                  {item.trangThai ? (
                    <><PauseCircle className="h-4 w-4" /> Tạm dừng</>
                  ) : (
                    <><PlayCircle className="h-4 w-4" /> Kích hoạt</>
                  )}
               </button>
               <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 transition-all group/btn">
                  Chi ngay <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      ))}

      {/* Placeholder for adding new */}
      <div
        className="border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center p-12 group hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all cursor-pointer min-h-[400px]"
      >
         <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
            <Plus className="h-10 w-10 text-zinc-300 group-hover:text-white" />
         </div>
         <span className="mt-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-indigo-600 transition-colors">
            Thêm thiết lập mới
         </span>
      </div>
    </div>
  );
}
