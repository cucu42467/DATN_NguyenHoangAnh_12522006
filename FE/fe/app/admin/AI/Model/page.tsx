"use client";

import BangQuanLyAiModel from '@/features/tinh_nang/admin/thanh_phan/AI/BangQuanLyAiModel';

export default function QuanLyAiModelPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Quản lý AI Model
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Cấu hình và quản lý các model AI được sử dụng trong hệ thống
        </p>
      </div>
      <BangQuanLyAiModel />
    </div>
  );
}
