"use client";

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import BangNguoiDung from '@/features/admin/thanh_phan/NguoiDung/BangNguoiDung';
import { layTongQuanAdmin } from '@/services';
import type { AdminTongQuanDto } from '@/services/admin';

export default function QuanLyNguoiDungPage() {
  const [stats, setStats] = useState<AdminTongQuanDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await layTongQuanAdmin();
        setStats(data);
      } catch (error) {
        console.error('Lỗi lấy tổng quan:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-medium uppercase tracking-tight leading-none mb-4 text-[#191c1f]"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            Quản Lý Người Dùng
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <ShieldCheck className="h-4 w-4 text-[#494fdf]" /> Trung tâm điều phối tài khoản hệ thống
            </p>
            <span className="h-4 w-px bg-[#c9c9cd]"></span>
            <p className="text-[10px] font-medium text-[#494fdf] uppercase tracking-wider italic"
              style={{ fontFamily: 'Inter, sans-serif' }}>Cập nhật thời gian thực ⚡</p>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Tổng số', value: loading ? '...' : (stats?.tongNguoiDung ?? 0).toLocaleString('vi-VN'), icon: Users, color: 'text-[#494fdf]' },
            { label: 'Hoạt động', value: loading ? '...' : ((stats?.tongNguoiDungHoatDong ?? 0) || (stats?.tongNguoiDung ?? 0)).toLocaleString('vi-VN'), icon: UserCheck, color: 'text-[#00a87e]' },
            { label: 'Đã khóa', value: loading ? '...' : ((stats?.tongNguoiDungBiVoHieuHoa ?? 0) || 0).toLocaleString('vi-VN'), icon: UserX, color: 'text-[#e23b4a]' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-[#c9c9cd] px-6 py-4 rounded-[20px] flex items-center gap-4 group hover:border-[#494fdf] transition-all">
              <div className={`p-3 rounded-[12px] bg-[#f4f4f4] ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider block mb-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</span>
                <p className="text-xl font-medium text-[#191c1f] leading-none"
                  style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table Section */}
      <BangNguoiDung />

      {/* Admin Quick Tips Box */}
      <div className="p-10 bg-[#191c1f] text-white rounded-[24px] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center md:text-left">
            <h3 className="text-xl font-medium uppercase tracking-tight mb-4 italic"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
              Lưu ý bảo mật hệ thống
            </h3>
            <p className="text-sm font-medium leading-relaxed opacity-80"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              Việc khóa tài khoản người dùng sẽ ngăn chặn mọi quyền truy cập ngay lập tức kể cả các phiên đăng nhập đang hoạt động. Vui lòng kiểm tra kỹ nhật ký giao dịch trước khi thực hiện các hành động giới hạn quyền truy cập.
            </p>
          </div>
          <button className="px-10 py-3 bg-white text-[#191c1f] rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#f4f4f4] transition-all shrink-0"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Chính sách bảo mật CM
          </button>
        </div>
      </div>
    </div>
  );
}
