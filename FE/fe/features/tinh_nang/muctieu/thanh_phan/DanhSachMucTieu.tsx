"use client";

import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { MucTieuType } from '@/types/MucTieu';
import { StaggerContainer, StaggerItem } from '@/thanh_phan/animation';
import { ActionButton } from '@/thanh_phan/ui';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';
import { layAnhMucTieuUrl, anMucTieu } from '@/services';

interface DanhSachMucTieuProps {
  goals: MucTieuType[];
  onContribute: (goal: MucTieuType) => void;
  onRefresh?: () => void;
  onCreateNew?: () => void;
  onEdit?: (goal: MucTieuType) => void;
}

export default function DanhSachMucTieu({ goals, onContribute, onRefresh, onCreateNew, onEdit }: DanhSachMucTieuProps) {
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const getPercentage = (current: number, target: number) => {
    if (!target || isNaN(current) || isNaN(target)) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const calculateForecast = (target: number, current: number, targetDate: string) => {
    const remaining = target - current;
    if (remaining <= 0) return { days: 0, monthly: 0, status: 'completed' };

    const end = new Date(targetDate);
    if (isNaN(end.getTime())) {
      return { days: 0, monthly: remaining, status: 'invalid_date' };
    }
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { days: 0, monthly: remaining, status: 'overdue' };

    const diffMonths = diffDays / 30;
    const monthlyNeeded = remaining / (diffMonths || 1);

    return { 
      days: diffDays, 
      monthly: monthlyNeeded, 
      status: diffDays < 30 ? 'urgent' : 'on-track' 
    };
  };

  const handleHide = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await anMucTieu(deleteId);
      showToast("Đã hoàn tiền vào tài khoản liên kết. Mục tiêu đã được ẩn!", "success");
      setDeleteId(null);
      onRefresh?.();
    } catch (error) {
      showToast("Không thể xóa mục tiêu. Vui lòng thử lại.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (goal: MucTieuType) => {
    if (onEdit) {
      onEdit(goal);
    }
  };

  return (
    <>
      <StaggerContainer staggerDelay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((item, index) => {
            const percent = getPercentage(item.soTienHienTai, item.soTienMucTieu);
            const forecast = calculateForecast(item.soTienMucTieu, item.soTienHienTai, item.ngayKetThuc ?? '');
            
            return (
              <StaggerItem key={item.mucTieuId}>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-lg transition-all">
                  {/* Visual Header - Ảnh hoặc Gradient */}
                  <div 
                    className="h-40 relative overflow-hidden"
                    style={{
                      background: item.anh 
                        ? `url(${layAnhMucTieuUrl(item.anh)}) center/cover no-repeat`
                        : item.mauSac 
                          ? `linear-gradient(135deg, ${item.mauSac}ee 0%, ${item.mauSac}88 50%, ${item.mauSac}44 100%)`
                          : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Goal Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Mục tiêu</span>
                        </div>
                        <h3 className="text-xl font-bold">{item.tenMucTieu}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-medium uppercase tracking-wider opacity-60 block">Mục tiêu</span>
                        <p className="text-lg font-bold">{formatCurrency(item.soTienMucTieu)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Số dư</span>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(item.soTienHienTai)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl text-right">
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Ngày còn lại</span>
                        <p className="text-lg font-bold flex items-center justify-end gap-1">
                          <Clock className="h-4 w-4 text-gray-400" /> {forecast.days}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {percent === 100 ? (
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Zap className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                            {percent === 100 ? 'Hoàn thành!' : 'Đang thực hiện'}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{percent}%</span>
                      </div>
                      
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Forecast */}
                    {percent < 100 && (
                      <div className="p-4 bg-blue-50 rounded-xl flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-medium text-blue-600 uppercase tracking-wider">Dự đoán</h4>
                          <p className="text-sm font-medium text-gray-800">
                            Cần tích lũy thêm <span className="text-blue-600 font-bold">{formatCurrency(forecast.monthly)}/tháng</span> để hoàn thành.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Contribute Button - SUCCESS */}
                    <button 
                      onClick={() => onContribute(item as MucTieuType)}
                      className="w-full h-12 fe-btn-success flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Nạp thêm tiền tiết kiệm
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(item as MucTieuType); }}
                        className="flex-1 h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Sửa
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.mucTieuId); }}
                        className="flex-1 h-10 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}

          {/* Placeholder Add Card */}
          <div 
            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 group hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer min-h-[300px]"
            onClick={onCreateNew}
          >
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all">
              <Plus className="h-8 w-8 text-gray-400 group-hover:text-white" />
            </div>
            <span className="mt-4 text-sm font-medium text-gray-500 group-hover:text-green-600 transition-colors">
              Tạo mục tiêu mới
            </span>
          </div>
        </div>
      </StaggerContainer>

      {/* Confirm Hide Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleHide}
        title="Xóa mục tiêu?"
        description="Tiền đã tích lũy sẽ được hoàn vào tài khoản liên kết. Mục tiêu sẽ bị ẩn."
        confirmText="Xóa & hoàn tiền"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
