import React from 'react';

export default function PhanCuoi() {
  return (
    <footer className="w-full py-8 mt-12 bg-zinc-50 dark:bg-[#0a0a0a] border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Bản quyền */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          &copy; 2026 Nguyễn Hoàng Anh - Đồ án tốt nghiệp UTEHY.
        </p>

        {/* Liên kết nhanh */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <a href="#" className="hover:text-emerald-500 transition-colors">Trợ giúp</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">Liên hệ hỗ trợ</a>
        </div>

        {/* Trạng thái hệ thống */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Hệ thống đang hoạt động ổn định
        </div>

      </div>
    </footer>
  );
}
