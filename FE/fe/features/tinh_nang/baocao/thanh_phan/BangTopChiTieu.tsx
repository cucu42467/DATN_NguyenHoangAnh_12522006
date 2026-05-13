"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, Loader2, BarChart3 } from 'lucide-react';
import { layBaoCaoPhanBoDanhMuc } from '@/services/baocao';
import { StaggerContainer, StaggerItem, FadeIn, SlideUp } from '@/thanh_phan/animation';

type DateRange = {
  tuNgay: string;
  denNgay: string;
};

interface TopChiTieuItem {
  name: string;
  amount: number;
  index: number;
  change: number;
  status: 'up' | 'down' | 'stable';
}

interface BangTopChiTieuProps {
  dateRange?: DateRange;
}

export default function BangTopChiTieu({ dateRange }: BangTopChiTieuProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await layBaoCaoPhanBoDanhMuc(
        'month',
        undefined,
        undefined,
        'CHI',
        dateRange?.tuNgay,
        dateRange?.denNgay
      );
      // API trả về { labels, series } (camelCase)
      setData(response || { labels: [], series: [] });
    } catch (error) {
      console.error(error);
      setData({ labels: [], series: [] });
    } finally {
      setLoading(false);
    }
  }, [dateRange?.tuNgay, dateRange?.denNgay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return `${amount}`;
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.tuNgay || !dateRange?.denNgay) return 'Danh mục tốn nhiều nhất tháng này';
    const tuNgay = new Date(dateRange.tuNgay);
    const denNgay = new Date(dateRange.denNgay);
    const formatDMY = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    return `Từ ${formatDMY(tuNgay)} - ${formatDMY(denNgay)}`;
  };

  const tableData: TopChiTieuItem[] = data?.labels ? data.labels.map((label: string, index: number) => ({
    name: label,
    amount: data.series?.[index] || 0,
    index
  }))
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 4) : [];

  if (loading) {
    return (
      <FadeIn>
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-10 flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-[#494fdf]" />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="relative bg-white border border-[#c9c9cd] rounded-[24px] overflow-hidden">
        {/* Header */}
        <div className="relative p-8 lg:p-10 mb-6 flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-[#494fdf] rounded-full"></div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>Thống kê</h3>
            </div>
            <h2 className="text-xl font-medium uppercase tracking-tight leading-none text-[#191c1f]"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
              Top danh mục chi tiêu
            </h2>
            <p className="text-sm text-[#8d969e] italic"
              style={{ fontFamily: 'Inter, sans-serif' }}>{formatDateRange()}</p>
          </div>
          <button className="p-3 bg-[#f4f4f4] rounded-[12px] text-[#494fdf] hover:bg-[#494fdf] hover:text-white transition-all">
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>

        {/* Table Content */}
        <SlideUp delay={0.1}>
          <div className="relative space-y-3 px-8 pb-10">
            {tableData.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-[#8d969e] font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Chưa có dữ liệu chi tiêu</p>
                <p className="text-xs text-zinc-400 mt-1">Thêm giao dịch để xem thống kê</p>
              </div>
            ) : (
              <StaggerContainer staggerDelay={0.08}>
                {tableData.map((item, idx) => (
                  <StaggerItem key={`${item.name}-${item.index}`}>
                    <div
                      className="group/row relative flex items-center justify-between p-4 hover:bg-[#f4f4f4] rounded-[12px] transition-all cursor-pointer border border-[#c9c9cd] hover:border-[#494fdf]"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-[#f4f4f4] font-medium text-[#494fdf] text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          #{idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium uppercase tracking-tight text-[#191c1f]"
                            style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</h4>
                          <p className="text-xs text-[#8d969e] mt-1"
                            style={{ fontFamily: 'Inter, sans-serif' }}>{formatCurrency(item.amount)} VND</p>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[9px] font-medium uppercase tracking-wider ${item.amount > 0
                            ? 'bg-[#f4f4f4] text-[#e23b4a]'
                            : 'bg-[#f4f4f4] text-[#00a87e]'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.amount > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                          Chi tiêu
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </SlideUp>
      </div>
    </FadeIn>
  );
}
