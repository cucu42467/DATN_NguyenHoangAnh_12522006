"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Plus, Calendar } from 'lucide-react';
import BangNganSach from '@/features/ngansach/thanh_phan/BangNganSach';
import FormNganSach from '@/features/ngansach/thanh_phan/FormNganSach';
import type { NganSachType } from '@/types/TrangChu';
import { layDanhSachNganSach } from '@/services';
import { FadeIn, SlideUp } from '@/components/animation';
import { Button } from '@/components/ui';

export default function NganSachPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<NganSachType | null>(null);
  const [budgets, setBudgets] = useState<NganSachType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBudgets() {
      try {
        const now = new Date();
        const data = await layDanhSachNganSach(now.getMonth() + 1, now.getFullYear());
        setBudgets(
          (data || []).map((item) => ({
            nganSachId: item.nganSachId,
            danhMucId: item.danhMucId,
            tenDanhMuc: item.tenDanhMuc ?? 'Không có danh mục',
            hanMuc: item.hanMuc,
            daDung: item.daDung,
            thang: item.thang,
            nam: item.nam,
          }))
        );
      } catch (error) {
        console.error('Lỗi khi tải ngân sách:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBudgets();
  }, []);

  const totalLimit = budgets.reduce((sum, item) => sum + item.hanMuc, 0);
  const totalUsed = budgets.reduce((sum, item) => sum + item.daDung, 0);
  const remaining = totalLimit - totalUsed;
  const usedPercent = totalLimit ? Math.round((totalUsed / totalLimit) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  return (
    <div className="fe-page-shell space-y-8">
      {/* Header Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-4 w-24 fe-skeleton rounded"></div>
          <div className="h-10 w-64 fe-skeleton rounded"></div>
        </div>
      ) : (
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 mb-3">
                Ngân sách tháng
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900">
                Quản lý ngân sách
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary">
                <Settings className="h-4 w-4" />
                Tự động hóa
              </Button>
              <Button variant="success" onClick={handleOpenAdd}>
                <Plus className="h-4 w-4" />
                Thiết lập hạn mức
              </Button>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Stats Cards Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="fe-card-fe p-6 space-y-3">
              <div className="h-3 w-20 fe-skeleton rounded"></div>
              <div className="h-8 w-32 fe-skeleton rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <SlideUp delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="fe-card-fe p-6">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Tổng hạn mức
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {totalLimit.toLocaleString('vi-VN')} đ
              </p>
            </div>
            <div className="fe-card-fe p-6">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Đã sử dụng ({usedPercent}%)
              </span>
              <p className="text-2xl font-bold text-amber-600">
                {totalUsed.toLocaleString('vi-VN')} đ
              </p>
            </div>
            <div className="bg-gray-900 text-white p-6 rounded-2xl">
              <span className="text-xs font-medium uppercase tracking-wider block mb-2 opacity-60">
                Còn lại
              </span>
              <p className="text-2xl font-bold">
                {remaining.toLocaleString('vi-VN')} đ
              </p>
            </div>
          </div>
        </SlideUp>
      )}

      {/* Budget Table */}
      {loading ? (
        <div className="fe-card-fe p-6 space-y-4">
          <div className="h-5 w-40 fe-skeleton rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 fe-skeleton rounded-xl"></div>
            ))}
          </div>
        </div>
      ) : (
        <SlideUp delay={0.2}>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Chi tiết theo danh mục
              </h2>
            </div>
            <BangNganSach budgets={budgets} />
          </div>
        </SlideUp>
      )}


{/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl p-6">
              <FormNganSach
                initialData={editingBudget}
                onClose={() => setIsModalOpen(false)}
                onSubmitSuccess={(data) => console.log('Budget saved:', data)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
