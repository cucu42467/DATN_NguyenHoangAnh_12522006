import React from 'react';
import { Home, ArrowRightLeft, PieChart, User, Plus } from 'lucide-react';

export default function DieuHuongDiDong() {
  return (
    <>
      {/* Floating Action Button */}
      <button className="md:hidden fixed bottom-20 right-4 z-50 h-14 w-14 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full shadow-xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300">
        <Plus className="h-7 w-7" />
      </button>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          
          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-emerald-500 px-2 group">
            <div className="p-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-semibold mt-1">Trang chủ</span>
          </a>

          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 px-2 transition-colors">
            <div className="p-1 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30">
              <ArrowRightLeft className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium mt-1">Giao dịch</span>
          </a>

          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 px-2 transition-colors">
            <div className="p-1 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30">
              <PieChart className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium mt-1">Ngân sách</span>
          </a>

          <a href="#" className="flex flex-col items-center justify-center w-full h-full text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 px-2 transition-colors">
            <div className="p-1 rounded-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30">
              <User className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium mt-1">Tài khoản</span>
          </a>

        </div>
      </nav>
    </>
  );
}
