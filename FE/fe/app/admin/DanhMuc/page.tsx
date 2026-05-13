"use client";

import React from 'react';
import { LayoutGrid, Plus, Zap, ArrowRight, Settings, Database } from 'lucide-react';
import Link from 'next/link';
import BangDanhMuc from '@/features/admin/thanh_phan/DanhMuc/BangDanhMuc';

export default function QuanLyDanhMucPage() {
  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-medium uppercase tracking-tight leading-none mb-4 text-[#191c1f] dark:text-white" style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            Cấu Hình <span className="text-[#494fdf]">Danh Mục</span>
          </h1>
          <div className="flex items-center gap-4">
             <p className="text-[#8d969e] font-medium flex items-center gap-2 uppercase tracking-wider text-[10px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Database className="h-4 w-4 text-[#494fdf]" /> Hệ thống dữ liệu toàn cầu FINANCE AI
             </p>
             <span className="h-4 w-px bg-[#c9c9cd]"></span>
             <p className="text-[#ec7e00] font-medium text-[10px] uppercase tracking-wider italic" style={{ fontFamily: 'Inter, sans-serif' }}>Cập nhật sẽ đồng bộ toàn người dùng ⚡</p>
          </div>
        </div>

        {/* Global Action */}
        <Link
          href="/admin/DanhMuc/TuKhoaAI"
          className="flex items-center gap-4 px-10 py-5 bg-[#191c1f] text-white rounded-full shadow-none hover:opacity-85 active:opacity-70 transition-all"
        >
           <div>
              <p className="text-[9px] font-medium uppercase tracking-wider opacity-70">AI Training</p>
              <h4 className="text-sm font-medium uppercase tracking-tight italic">Huấn luyện từ khóa AI</h4>
           </div>
           <div className="p-2 bg-[#494fdf] rounded-full hover:rotate-12 transition-transform">
              <Zap className="h-5 w-5 text-white fill-white" />
           </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Tổng danh mục cha', value: '12', icon: LayoutGrid, color: '#494fdf' },
           { label: 'Tổng danh mục con', value: '48', icon: Settings, color: '#00a87e' },
           { label: 'Từ khóa AI đã gán', value: '250', icon: Zap, color: '#ec7e00' },
         ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-[#c9c9cd] p-8 rounded-[20px] flex items-center gap-6 group hover:border-[#191c1f] transition-all">
               <div className="p-4 rounded-[12px] bg-[#f4f4f4]" style={{ color: stat.color }}>
                  <stat.icon className="h-6 w-6" />
               </div>
               <div>
                  <span className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider block mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</span>
                  <p className="text-2xl font-medium text-[#191c1f] leading-none tracking-tight italic" style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>{stat.value}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Main Hierarchy Table */}
      <BangDanhMuc />

      {/* Warning Box */}
      <div className="p-10 bg-[#f4f4f4] border border-[#c9c9cd] rounded-[24px] flex items-center gap-8">
         <div className="p-5 bg-white rounded-full text-[#ec7e00] shrink-0">
            <Zap className="h-10 w-10" />
         </div>
         <div>
            <h4 className="text-lg font-medium uppercase tracking-tight mb-1 leading-none text-[#191c1f] italic" style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>Chế độ đồng bộ hệ thống</h4>
            <p className="text-sm font-medium text-[#505a63] leading-relaxed italic" style={{ fontFamily: 'Inter, sans-serif' }}>
               Mọi thay đổi về màu sắc, icon của Danh mục gốc sẽ được cập nhật ngay lập tức cho 12,840 người dùng đang hoạt động. Vui lòng kiểm tra tính tương phản trước khi lưu.
            </p>
         </div>
      </div>
    </div>
  );
}
