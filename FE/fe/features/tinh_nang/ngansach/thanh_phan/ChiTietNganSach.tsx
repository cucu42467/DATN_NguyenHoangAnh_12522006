"use client";

import React, { useEffect, useState } from 'react';
import {
  X,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  PieChart
} from 'lucide-react';
import { Button } from '@/thanh_phan/ui';
import { layNganSachTheoId, layGiaoDichTheoNganSach } from '@/services/ngansach/ngansach';
import type { NganSachDto, GiaoDichDto } from '@/types';

interface ChiTietNganSachProps {
  nganSachId: number;
  onClose: () => void;
}

export default function ChiTietNganSach({ nganSachId, onClose }: ChiTietNganSachProps) {
  const [nganSach, setNganSach] = useState<NganSachDto | null>(null);
  const [giaoDichList, setGiaoDichList] = useState<GiaoDichDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [nsData, gdData] = await Promise.all([
          layNganSachTheoId(nganSachId),
          layGiaoDichTheoNganSach(nganSachId)
        ]);
        setNganSach(nsData);
        setGiaoDichList(gdData || []);
      } catch (error) {
        console.error('Lỗi tải chi tiết ngân sách:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [nganSachId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-2xl">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nganSach) {
    return null;
  }

  const percent = Math.min((nganSach.daDung / nganSach.hanMuc) * 100, 100);
  const isOver = nganSach.daDung > nganSach.hanMuc;
  const conLai = nganSach.hanMuc - nganSach.daDung;

  const getProgressColor = () => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-amber-500';
    if (percent < 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusInfo = () => {
    if (isOver) {
      return {
        icon: AlertTriangle,
        color: 'text-red-600 bg-red-100',
        text: 'Đã vượt hạn mức',
        subtext: `Vượt ${formatCurrency(nganSach.daDung - nganSach.hanMuc)}`
      };
    }
    if (percent >= 80) {
      return {
        icon: Clock,
        color: 'text-orange-600 bg-orange-100',
        text: 'Gần đạt hạn mức',
        subtext: `Còn ${formatCurrency(conLai)}`
      };
    }
    return {
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
      text: 'Trong hạn mức',
      subtext: `Còn ${formatCurrency(conLai)}`
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Chi tiết ngân sách
            </h2>
            <p className="text-zinc-500 mt-1">
              {nganSach.tenDanhMuc} - Tháng {nganSach.thang}/{nganSach.nam}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-zinc-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-zinc-400" />
                <span className="text-xs text-zinc-500 uppercase">Hạn mức</span>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">
                {formatCurrency(nganSach.hanMuc)}
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-zinc-400" />
                <span className="text-xs text-zinc-500 uppercase">Đã dùng</span>
              </div>
              <p className={`text-lg font-bold ${isOver ? 'text-red-600' : 'text-zinc-900 dark:text-white'}`}>
                {formatCurrency(nganSach.daDung)}
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-zinc-400" />
                <span className="text-xs text-zinc-500 uppercase">Còn lại</span>
              </div>
              <p className={`text-lg font-bold ${conLai < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(conLai))}
                {conLai < 0 && ' (thiếu)'}
              </p>
            </div>

            <div className={`${status.color} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className="h-4 w-4" />
                <span className="text-xs uppercase">Trạng thái</span>
              </div>
              <p className="text-lg font-bold">{status.text}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Tiến độ sử dụng
              </span>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">
                {percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor()}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
          </div>

          {/* Transaction List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-zinc-400" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Giao dịch trong tháng ({giaoDichList.length})
              </h3>
            </div>

            {giaoDichList.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                Chưa có giao dịch nào trong tháng này
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {giaoDichList.map((gd) => (
                  <div
                    key={gd.giaoDichId}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {gd.ghiChu || gd.moTa || 'Giao dịch chi'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatDate(gd.ngayGiaoDich)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        -{formatCurrency(gd.soTien)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-700">
          <Button variant="neutral" onClick={onClose} className="w-full">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
