"use client";

import React from 'react';
import { 
  ArrowRightLeft, 
  ArrowRight, 
  Calculator, 
  Wallet, 
  Send, 
  History,
  AlertCircle
} from 'lucide-react';

export default function ChuyenTienNoiBo() {
  return (
    <div className="bg-indigo-600 dark:bg-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 p-10 text-white/10 dark:text-zinc-900/5 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
         <ArrowRightLeft className="h-40 w-40" />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
           <h2 className="text-2xl font-black text-white dark:text-zinc-900 uppercase italic tracking-tighter">Luân chuyển nội bộ</h2>
           <p className="text-xs text-indigo-200 dark:text-zinc-500 mt-1 uppercase font-bold tracking-widest leading-relaxed max-w-md">
             Di chuyển tiền giữa các ví của bạn (Ví dụ: Rút tiền từ ATM ra Tiền mặt) mà không làm ảnh hưởng tới tổng tài sản.
           </p>
        </div>

        <form className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Nguồn */}
              <div className="bg-white/10 dark:bg-zinc-50 p-4 rounded-3xl border border-white/10 dark:border-zinc-200">
                 <label className="text-[10px] font-black text-white/60 dark:text-zinc-400 uppercase tracking-widest block mb-2 px-1">Từ tài khoản</label>
                 <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-indigo-200 dark:text-indigo-600" />
                    <select className="bg-transparent border-none text-white dark:text-zinc-900 font-black text-sm w-full outline-none cursor-pointer">
                       <option value="1">ATM Vietcombank</option>
                       <option value="2">ATM Techcombank</option>
                    </select>
                 </div>
              </div>

              {/* Mũi tên chuyển hướng (Cố định ở giữa bằng absolute trên MD) */}
              <div className="hidden md:flex absolute left-1/2 top-[calc(50%+40px)] -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-zinc-900 rounded-full items-center justify-center shadow-xl border-4 border-indigo-600 dark:border-white z-20">
                 <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              {/* Đích */}
              <div className="bg-white/10 dark:bg-zinc-50 p-4 rounded-3xl border border-white/10 dark:border-zinc-200">
                 <label className="text-[10px] font-black text-white/60 dark:text-zinc-400 uppercase tracking-widest block mb-2 px-1">Đến tài khoản</label>
                 <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-emerald-300 dark:text-emerald-500" />
                    <select className="bg-transparent border-none text-white dark:text-zinc-900 font-black text-sm w-full outline-none cursor-pointer">
                       <option value="1">Tiền mặt</option>
                       <option value="3">Ví MoMo</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Số tiền */}
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-xl border border-transparent dark:border-zinc-100 flex items-center justify-between">
              <div className="flex-1">
                 <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Số tiền chuyển</label>
                 <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-indigo-600" />
                    <input 
                      type="number" 
                      placeholder="0"
                      className="bg-transparent border-none text-2xl font-black text-zinc-900 dark:text-zinc-900 w-full outline-none placeholder:text-zinc-200"
                    />
                 </div>
              </div>
              <span className="text-xl font-black text-zinc-400">VND</span>
           </div>

           {/* Footer: Tips & Submit */}
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 dark:border-zinc-100/50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-100 dark:text-zinc-400 uppercase tracking-widest">
                 <AlertCircle className="h-4 w-4" />
                 Giao dịch này sẽ không được tính vào chi tiêu/thu nhập.
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-white font-black text-xs uppercase rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 <Send className="h-4 w-4" /> Thực hiện chuyển
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
