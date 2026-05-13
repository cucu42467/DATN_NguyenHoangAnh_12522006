"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Info, X } from 'lucide-react';
import DanhSachDinhKy from '@/features/giaodich/thanh_phan/DanhSachDinhKy';
import FormGiaoDichDinhKy from '@/features/giaodich/thanh_phan/FormGiaoDichDinhKy';
import { GiaoDichDinhKyType } from '@/types/GiaoDich';
import { layDanhSachGiaoDichDinhKy } from '@/services';

export default function GiaoDichDinhKyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recurringItems, setRecurringItems] = useState<GiaoDichDinhKyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecurring() {
      try {
        const data = await layDanhSachGiaoDichDinhKy();
        setRecurringItems((data || []) as GiaoDichDinhKyType[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadRecurring();
  }, []);

  return (
    <div className="fe-page-shell animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">Giao dịch Định kỳ</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium lowercase">Lên lịch các khoản thu chi tự động hàng tháng của bạn.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] text-xs font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /> THIẾT LẬP MỚI
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm mb-10 flex items-start sm:items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-indigo-600/5 pointer-events-none group-hover:rotate-12 transition-transform">
          <Clock className="h-40 w-40" />
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-3xl relative z-10">
          <Info className="h-7 w-7" />
        </div>
        <div className="relative z-10 flex-1">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest italic">Tiết kiệm thời gian mỗi tháng</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed max-w-2xl">
            Hệ thống sẽ tự động ghi sổ hoặc nhắc nhở bạn xác nhận các khoản chi cố định (tiền thuê nhà, bảo hiểm, đăng ký tháng) vào đúng thời điểm. Dữ liệu sạch sẽ, không lo bỏ sót! ⚡
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DanhSachDinhKy recurringItems={recurringItems} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-20"
            >
              <X className="h-5 w-5" />
            </button>
            <FormGiaoDichDinhKy onClose={() => setIsModalOpen(false)} onSubmitSuccess={(data) => console.log('Success:', data)} />
          </div>
        </div>
      )}
    </div>
  );
}
