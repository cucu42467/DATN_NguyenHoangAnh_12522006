"use client";

import React from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Plus
} from 'lucide-react';
import BangGiaoDichAdmin from '@/features/admin/thanh_phan/BangGiaoDichAdmin';

export default function QuanLyGiaoDichPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-medium uppercase tracking-tight leading-none mb-4 text-[#191c1f]"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            Toàn Bộ <span className="text-[#494fdf]">Giao Dịch</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <ShieldCheck className="h-4 w-4 text-[#494fdf]" /> Giám sát và điều phối dòng tiền hệ thống
            </p>
            <span className="h-4 w-px bg-[#c9c9cd]"></span>
            <p className="text-[10px] font-medium text-[#494fdf] uppercase tracking-wider italic"
              style={{ fontFamily: 'Inter, sans-serif' }}>Dữ liệu thời gian thực ⚡</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-3 bg-[#494fdf] text-white rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#3d42d1] transition-all"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <Plus className="h-5 w-5" /> Thêm giao dịch thủ công
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white border border-[#c9c9cd] rounded-[20px] p-8 space-y-6">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8d969e] group-focus-within:text-[#494fdf] transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ghi chú, người dùng..."
              className="w-full pl-14 pr-6 py-3 rounded-full border border-[#c9c9cd] bg-white focus:outline-none focus:border-[#494fdf] transition-all text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <select className="px-6 py-3 rounded-full border border-[#c9c9cd] bg-white font-medium text-sm focus:outline-none hover:bg-[#f4f4f4] transition-all"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <option value="All">Tất cả người dùng</option>
              <option value="U001">Nguyễn Văn Anh</option>
              <option value="U002">Trần Thị Bình</option>
            </select>
            <select className="px-6 py-3 rounded-full border border-[#c9c9cd] bg-white font-medium text-sm focus:outline-none hover:bg-[#f4f4f4] transition-all"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <option value="All">Tất cả loại</option>
              <option value="CHI">Chi tiêu</option>
              <option value="THU">Thu nhập</option>
              <option value="CHUYEN_KHOAN">Chuyển khoản</option>
            </select>
            <button className="flex items-center gap-3 px-8 py-3 bg-white border border-[#c9c9cd] text-[#191c1f] rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#f4f4f4] transition-all"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <Download className="h-5 w-5" /> Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Main Transaction Table */}
      <BangGiaoDichAdmin />
    </div>
  );
}
