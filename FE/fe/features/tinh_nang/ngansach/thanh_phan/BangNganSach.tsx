"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  AlertTriangle, 
  Edit2,
  Trash2,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import type { NganSachType } from '@/kieu_du_lieu/NganSach';
import { xoaNganSach } from '@/services/ngansach/ngansach';
import { ActionButton } from '@/thanh_phan/ui';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';
import ChiTietNganSach from './ChiTietNganSach';
import FormSuaNganSach from './FormSuaNganSach';

interface BangNganSachProps {
  budgets: NganSachType[];
  onRefresh?: () => void;
}

export default function BangNganSach({ budgets, onRefresh }: BangNganSachProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [chiTietId, setChiTietId] = useState<number | null>(null);
  const [suaNganSach, setSuaNganSach] = useState<NganSachType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getProgressColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-amber-500';
    if (percent < 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBackground = (percent: number) => {
    if (percent < 50) return 'bg-green-50 text-green-600';
    if (percent < 80) return 'bg-amber-50 text-amber-600';
    if (percent < 100) return 'bg-orange-50 text-orange-600';
    return 'bg-red-50 text-red-600';
  };

  const getTextColor = (percent: number) => {
    if (percent < 50) return 'text-green-600';
    if (percent < 80) return 'text-amber-600';
    if (percent < 100) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await xoaNganSach(deleteId);
      showToast("Ngân sách đã được xóa thành công!", "success");
      setDeleteId(null);
      onRefresh?.();
    } catch (error) {
      showToast("Không thể xóa ngân sách. Vui lòng thử lại.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (budget: NganSachType) => {
    setSuaNganSach(budget);
  };

  const handleChiTiet = (id: number) => {
    setChiTietId(id);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const percent = Math.min((budget.daDung / budget.hanMuc) * 100, 100);
          const isOver = budget.daDung > budget.hanMuc;
          const isWarning = percent >= 80;

          return (
            <div
              key={budget.nganSachId}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${getProgressBackground(percent)}`}>
                      {percent > 90 ? <AlertTriangle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{budget.tenDanhMuc}</h3>
                      <span className="text-xs text-gray-500">{budget.thang}/{budget.nam}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-0.5">Đã dùng</span>
                      <p className={`text-lg font-bold ${getTextColor(percent)}`}>{formatCurrency(budget.daDung)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-0.5">Hạn mức</span>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(budget.hanMuc)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - xuống dưới cùng */}
              <div className="px-5 pb-5 pt-2 flex gap-2">
                <button
                  className={`flex-1 py-3 text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    isWarning
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => handleChiTiet(budget.nganSachId)}
                >
                  Chi tiết <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
                <ActionButton
                  variant="edit"
                  onClick={(e) => { e.stopPropagation(); handleEdit(budget); }}
                  title="Sửa"
                  className="px-4 py-3"
                >
                  <Edit2 className="h-4 w-4" />
                </ActionButton>
                <ActionButton
                  variant="delete"
                  onClick={(e) => { e.stopPropagation(); setDeleteId(budget.nganSachId); }}
                  title="Xóa"
                  className="px-6 py-3"
                >
                  <Trash2 className="h-5 w-5" />
                </ActionButton>
              </div>

              {/* Progress Bar */}
              <div className={`px-5 pb-5 pt-0`}>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percent)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={getTextColor(percent)}>{percent.toFixed(0)}% đã chi</span>
                  <span className={percent > 100 ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {isOver ? '⚠️ Vượt' : `Còn ${formatCurrency(budget.hanMuc - budget.daDung)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Placeholder Add Card - SUCCESS */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer min-h-[200px]"
          onClick={() => router.push('/NganSach/Them')}
        >
          <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm group-hover:bg-green-500 group-hover:border-green-500 transition-all">
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-white" />
          </div>
          <span className="mt-3 text-sm font-medium text-gray-500 group-hover:text-green-600 transition-colors">
            Thêm ngân sách
          </span>
        </div>
      </div>

      {/* Chi Tiết Ngân Sách Modal */}
      {chiTietId && (
        <ChiTietNganSach
          nganSachId={chiTietId}
          onClose={() => setChiTietId(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa ngân sách?"
        description="Ngân sách này sẽ bị xóa vĩnh viễn. Bạn có chắc muốn tiếp tục?"
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />

      {/* Form Sửa Ngân Sách Modal */}
      {suaNganSach && (
        <FormSuaNganSach
          nganSachId={suaNganSach.nganSachId}
          tenDanhMuc={suaNganSach.tenDanhMuc}
          thang={suaNganSach.thang}
          nam={suaNganSach.nam}
          hanMucHienTai={suaNganSach.hanMuc}
          onClose={() => setSuaNganSach(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}
