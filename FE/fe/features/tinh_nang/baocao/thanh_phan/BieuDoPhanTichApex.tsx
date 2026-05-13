"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { AreaChart, BarChart2, LineChart, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { layBaoCaoBieuDo } from '@/services/baocao';
import { FadeIn, SlideUp } from '@/thanh_phan/animation';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ViewMode = 'area' | 'bar' | 'line';

type DateRange = {
  tuNgay: string;
  denNgay: string;
};

type Props = {
  dateRange: DateRange;
  onRefresh?: () => void;
};

// Tính duration dựa trên khoảng cách ngày
const tinhDuration = (tuNgay: string, denNgay: string): 'day' | 'week' | 'month' | 'year' => {
  if (!tuNgay || !denNgay) return 'month';
  const from = new Date(tuNgay);
  const to = new Date(denNgay);
  const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 7) return 'week';
  if (days <= 31) return 'month';
  if (days <= 180) return 'month'; // quarter -> month
  return 'year';
};

export default function BieuDoPhanTichApex({ dateRange, onRefresh }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('area');
  const [data, setData] = useState<{ labels: string[]; series: { name: string; data: number[] }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const duration = tinhDuration(dateRange.tuNgay, dateRange.denNgay);
      const response = await layBaoCaoBieuDo(duration, undefined, undefined, dateRange.tuNgay || undefined, dateRange.denNgay || undefined);
      setData(response || { labels: [], series: [] });
    } catch (error) {
      console.error(error);
      setData({ labels: [], series: [] });
    } finally {
      setLoading(false);
    }
  }, [dateRange.tuNgay, dateRange.denNgay]);

  useEffect(() => {
    if (dateRange.tuNgay && dateRange.denNgay) {
      fetchData();
    }
  }, [fetchData, dateRange.tuNgay, dateRange.denNgay]);

  const chartData = data || { labels: [], series: [] };

  // Check if there's actual data to display
  const hasData = chartData.labels && chartData.labels.length > 0 &&
    chartData.series && chartData.series.some(s => s.data && s.data.length > 0 && s.data.some(v => v > 0));

  const series = viewMode === 'line' ? [
    {
      name: 'Số dư tổng tài sản',
      data: chartData.series?.[0]?.data || [0]
    }
  ] : [
    {
      name: chartData.series?.[0]?.name || 'Thu nhập',
      data: chartData.series?.[0]?.data || [0]
    },
    {
      name: chartData.series?.[1]?.name || 'Chi tiêu',
      data: chartData.series?.[1]?.data || [0]
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: viewMode === 'bar' ? 'bar' : viewMode === 'line' ? 'line' : 'area',
      height: 550,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      zoom: { enabled: false },
      background: 'transparent',
      stacked: viewMode === 'bar'
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: viewMode === 'bar' ? 0 : 2,
    },
    colors: viewMode === 'line' ? ['#494fdf'] : ['#00a87e', '#e23b4a'],
    fill: {
      type: viewMode === 'bar' ? 'solid' : 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      }
    },
    xaxis: {
      categories: chartData.labels || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#8d969e',
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8d969e',
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif'
        },
        formatter: (val) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
          return val.toString();
        }
      }
    },
    grid: {
      borderColor: '#c9c9cd',
      strokeDashArray: 4,
      xaxis: { lines: { show: true } }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '10px',
      fontWeight: 500,
      markers: { size: 6 },
      labels: { colors: '#505a63' }
    },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M VND`;
          if (val >= 1000) return `${(val / 1000).toFixed(0)}K VND`;
          return `${val} VND`;
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
        <div className="relative p-8 lg:p-10">
          <SlideUp delay={0.1}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              {/* Left Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-[#494fdf] rounded-full"></div>
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[#8d969e]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Phân tích</h3>
                </div>
                <h2 className="text-2xl lg:text-3xl font-medium uppercase tracking-tight leading-none text-[#191c1f]"
                  style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                  Hiệu suất tài chính
                </h2>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4f4f4] text-[#00a87e] rounded-[12px] text-xs font-medium uppercase tracking-wider border border-[#c9c9cd]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <TrendingUp className="h-4 w-4" /> Tiền vào
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#f4f4f4] text-[#e23b4a] rounded-[12px] text-xs font-medium uppercase tracking-wider border border-[#c9c9cd]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <TrendingDown className="h-4 w-4" /> Tiền ra
                  </span>
                </div>
              </div>

              {/* View Mode Buttons */}
              <div className="flex p-2 bg-[#f4f4f4] rounded-[12px] gap-2">
                <button
                  onClick={() => setViewMode('area')}
                  className={`p-3 rounded-[8px] transition-all ${viewMode === 'area' ? 'bg-white text-[#494fdf] shadow-sm' : 'text-[#8d969e] hover:text-[#191c1f]'}`}
                  title="Khu vực"
                >
                  <AreaChart className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('bar')}
                  className={`p-3 rounded-[8px] transition-all ${viewMode === 'bar' ? 'bg-white text-[#494fdf] shadow-sm' : 'text-[#8d969e] hover:text-[#191c1f]'}`}
                  title="Cột"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('line')}
                  className={`p-3 rounded-[8px] transition-all ${viewMode === 'line' ? 'bg-white text-[#494fdf] shadow-sm' : 'text-[#8d969e] hover:text-[#191c1f]'}`}
                  title="Đường"
                >
                  <LineChart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </SlideUp>

          <SlideUp delay={0.2}>
            <div className="min-h-[600px] w-full flex items-center justify-center">
              {!hasData ? (
                <div className="text-center py-20">
                  <BarChart2 className="h-20 w-20 mx-auto text-[#c9c9cd] mb-4" />
                  <p className="text-[#8d969e] text-xl font-medium">Chưa có dữ liệu hiệu suất</p>
                  <p className="text-[#c9c9cd] text-sm mt-2">Hãy thêm giao dịch để xem biểu đồ</p>
                </div>
              ) : (
                <Chart key={viewMode} options={options} series={Array.isArray(series) ? series : []} type={options.chart?.type || 'area'} height={580} />
              )}
            </div>
          </SlideUp>
        </div>
      </div>
    </FadeIn>
  );
}
