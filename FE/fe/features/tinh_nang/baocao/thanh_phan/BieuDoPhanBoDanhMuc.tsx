"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Loader2 } from 'lucide-react';
import { layBaoCaoPhanBoDanhMuc } from '@/services/baocao';
import { FadeIn, SlideUp } from '@/thanh_phan/animation';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type DateRange = {
  tuNgay: string;
  denNgay: string;
};

interface BieuDoPhanBoDanhMucProps {
  loai?: 'CHI' | 'THU';
  dateRange?: DateRange;
}

export default function BieuDoPhanBoDanhMuc({ loai = 'CHI', dateRange }: BieuDoPhanBoDanhMucProps) {
  const [data, setData] = useState<{ labels: string[]; series: number[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await layBaoCaoPhanBoDanhMuc(
        'month',
        undefined,
        undefined,
        loai,
        dateRange?.tuNgay,
        dateRange?.denNgay
      );
      // Validate data structure - API trả về labels và series (camelCase)
      if (response && typeof response === 'object') {
        const labels = Array.isArray(response.labels) ? response.labels : [];
        const series = Array.isArray(response.series) ? response.series : [];
        setData({ labels, series });
      } else {
        setData({ labels: [], series: [] });
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      setData({ labels: [], series: [] });
    } finally {
      setLoading(false);
    }
  }, [loai, dateRange?.tuNgay, dateRange?.denNgay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Safe access with fallbacks
  const labels = data?.labels || [];
  const series = data?.series || [];

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.tuNgay || !dateRange?.denNgay) return 'Tháng hiện tại';
    const tuNgay = new Date(dateRange.tuNgay);
    const denNgay = new Date(dateRange.denNgay);
    const formatDMY = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    return `${formatDMY(tuNgay)} - ${formatDMY(denNgay)}`;
  };

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    labels: labels,
    colors: ['#494fdf', '#00a87e', '#ec7e00', '#e23b4a', '#505a63', '#4db6ac', '#8b5cf6', '#f59e0b'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: loai === 'CHI' ? 'Tổng chi' : 'Tổng thu',
              formatter: () => {
                const total = series.reduce((a: number, b: number) => a + b, 0);
                return total > 1000000 ? `${(total / 1000000).toFixed(1)}M` : `${(total / 1000).toFixed(0)}K`;
              },
              fontSize: '12px',
              fontWeight: 500,
              color: '#8d969e'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 500,
              color: '#191c1f',
              offsetY: 8
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '10px',
      fontWeight: 500,
      labels: { colors: '#8d969e' },
      markers: { size: 6 }
    },
    stroke: { show: false },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => {
          return val > 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}K`;
        }
      }
    }
  };

  if (loading) {
    return (
      <FadeIn>
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-10 flex items-center justify-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-[#494fdf]" />
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="relative bg-white border border-[#c9c9cd] rounded-[24px] overflow-hidden">
        {/* Header */}
        <div className="relative p-8 lg:p-10 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-[#494fdf] rounded-full"></div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[#8d969e]"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {loai === 'CHI' ? 'Chi tiêu' : 'Thu nhập'}
            </h3>
          </div>
          <h2 className="mt-3 text-xl font-medium uppercase tracking-tight leading-none text-[#191c1f]"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            {loai === 'CHI' ? 'Phân bổ chi tiêu' : 'Phân bổ thu nhập'}
          </h2>
          <p className="mt-2 text-sm text-[#8d969e] italic"
            style={{ fontFamily: 'Inter, sans-serif' }}>{formatDateRange()}</p>
        </div>

        <SlideUp delay={0.1}>
          <div className="min-h-[320px] w-full flex items-center justify-center px-8 pb-10 relative z-10">
            {labels.length === 0 ? (
              <div className="text-center text-[#8d969e]">
                <p>Chưa có dữ liệu</p>
              </div>
            ) : (
              <Chart options={options} series={series} type="donut" height={320} />
            )}
          </div>
        </SlideUp>
      </div>
    </FadeIn>
  );
}
