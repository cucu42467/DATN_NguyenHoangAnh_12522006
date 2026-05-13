"use client";

import React, { use } from 'react';
import ChiTietNguoiDung from '@/features/admin/thanh_phan/NguoiDung/ChiTietNguoiDung';

export default function ChiTietNguoiDungPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
            Chi tiết <span className="text-indigo-600">Thành viên</span>
          </h1>
          <p className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
            ID người dùng: {userId} • Quyền hạn và Bảo mật hệ thống
          </p>
        </div>
      </div>

      <ChiTietNguoiDung userId={userId} />
    </div>
  );
}
