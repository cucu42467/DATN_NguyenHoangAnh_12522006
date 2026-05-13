"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { BrainCircuit, TrendingUp, AlertCircle, Info, Sparkles } from 'lucide-react';
import { layDuDoanAI } from '@/services/ai';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BieuDoDuDoanProps {
  months?: number;
}

export default function BieuDoDuDoan({ months = 6 }: BieuDoDuDoanProps) {
  const [data, setData] = useState<{
    months: string[];
    actual: number[];
    forecast: number[];
    mucDoChinhXac?: number;
    ghiChu?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await layDuDoanAI();
        console.log('[BieuDoDuDoan] API response:', JSON.stringify(response, null, 2));
        setData(response);
      } catch (err) {
        console.error('[BieuDoDuDoan] Lỗi tải dữ liệu dự báo:', err);
        setError('Không thể tải dữ liệu dự báo');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Tìm vị trí bắt đầu của forecast
  const forecastStartIndex = data?.actual?.findIndex(a => a === 0) ?? -1;
  const hasForecast = forecastStartIndex >= 0;

  // Tính tổng
  const totalActual = data?.actual?.filter(a => a > 0).reduce((a, b) => a + b, 0) || 0;
  const avgActual = totalActual > 0 ? totalActual / (forecastStartIndex > 0 ? forecastStartIndex : 1) : 0;
  const avgForecast = hasForecast
    ? data?.forecast?.slice(forecastStartIndex).filter(f => f > 0).reduce((a, b) => a + b, 0) || 0
    : 0;

  // Chuẩn bị series cho ApexCharts
  const series = [
    {
      name: 'Chi tiêu thực tế',
      type: 'column' as const,
      data: data?.actual?.map(d => Number(d)) || []
    },
    {
      name: 'Dự đoán',
      type: 'line' as const,
      data: data?.forecast?.map(d => Number(d)) || []
    }
  ];

  const options: ApexOptions = {
    chart: {
      height: 400,
      type: 'line',
      stacked: false,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent'
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth'
    },
    colors: ['#4f46e5', '#f59e0b'],
    fill: {
      opacity: [0.85, 0],
      type: ['solid', 'solid']
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      formatter: (val: number) => {
        if (val === 0) return '';
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}Tr`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
        return val.toString();
      },
      style: {
        fontSize: '10px',
        fontWeight: 500
      }
    },
    labels: data?.months || [],
    markers: {
      size: [0, 5],
      colors: ['#fff', '#fff'],
      strokeColors: ['#4f46e5', '#f59e0b'],
      strokeWidth: [0, 2]
    },
    xaxis: {
      axisBorder: { show: false },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '11px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '10px',
          fontWeight: 600
        },
        formatter: (val) => {
          if (val >= 1000000) return `${(val / 1000000).toFixed(1)}Tr`;
          if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
          return val.toString();
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      fontWeight: 600,
      markers: { size: 8 },
      labels: { colors: '#475569' }
    },
    tooltip: {
      theme: 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => {
          if (val === 0) return 'Chưa có dữ liệu';
          if (val >= 1000000) return `${(val / 1000000).toFixed(2)}Tr VND`;
          if (val >= 1000) return `${(val / 1000).toFixed(0)}K VND`;
          return `${val} VND`;
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    annotations: hasForecast ? {
      yaxis: [{
        y: avgActual,
        borderColor: '#4f46e5',
        borderWidth: 1,
        strokeDashArray: 4,
        label: {
          borderColor: '#4f46e5',
          style: { color: '#fff', background: '#4f46e5' },
          text: `TB: ${(avgActual / 1000000).toFixed(1)}Tr`,
          position: 'right',
          offsetX: 10
        }
      }]
    } : undefined
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[3rem] relative overflow-hidden min-h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-gray-200 rounded-[2rem] animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-16 w-28 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-16 w-28 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4 h-64">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-end">
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[3rem] relative overflow-hidden flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-sm text-zinc-500">Chưa có dữ liệu dự báo. Hãy thêm giao dịch để AI phân tích.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 rounded-[3rem] relative overflow-hidden group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[2rem] text-white">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-medium uppercase tracking-tight text-zinc-900 dark:text-white">Dự Đoán Chi Tiêu</h3>
            <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider italic">AI phân tích xu hướng & dự đoán</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-right p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/10">
            <span className="text-[9px] font-medium text-indigo-600 uppercase tracking-wider block mb-1">Trung bình thực tế</span>
            <p className="text-lg font-medium text-indigo-600">
              {(avgActual / 1000000).toFixed(1)}Tr/tháng
            </p>
          </div>
          {hasForecast && (
            <div className="text-right p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/10">
              <span className="text-[9px] font-medium text-amber-600 uppercase tracking-wider block mb-1">Dự đoán TB</span>
              <p className="text-lg font-medium text-amber-600">
                {(avgForecast / 1000000).toFixed(1)}Tr/tháng
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[400px] w-full">
        <Chart options={options} series={series} type="line" height={400} />
      </div>

      {/* Ghi chú về dự đoán */}
      <div className="mt-8 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-amber-50 dark:from-indigo-950/30 dark:to-amber-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/10">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Cách tính dự đoán</h4>
              {data.mucDoChinhXac && (
                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  Độ chính xác: {Math.round(data.mucDoChinhXac * 100)}%
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {data.ghiChu || 'Dự đoán dựa trên dữ liệu chi tiêu thực tế của bạn. Thêm nhiều giao dịch hơn để cải thiện độ chính xác.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-indigo-500 rounded"></span>
                Thực tế
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500"></span>
                Dự đoán ({data.months?.length - (forecastStartIndex >= 0 ? forecastStartIndex : data.months?.length)} tháng)
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
