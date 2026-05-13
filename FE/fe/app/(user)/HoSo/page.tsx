"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileSettings from '@/features/tinh_nang/nguoi_dung/thanh_phan/ProfileSettings';
import { Toaster } from 'sonner';

export default function HoSoPage() {
  return (
    <div className="fe-page-shell space-y-8">
        <Toaster position="top-right" />
        
        <div className="flex items-center justify-between">
          <Link href="/TrangChu" className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
            <ArrowLeft className="h-5 w-5" />
            Quay lại Trang chủ
          </Link>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Cài đặt Hồ sơ & Bảo mật</h1>
        </div>

        <ProfileSettings />
    </div>
  );
}
