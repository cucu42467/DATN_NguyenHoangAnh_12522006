"use client";

import React, { useState, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Loader2, PieChart as PieChartIcon, TrendingUp, TrendingDown } from 'lucide-react';

type ChartType = 'pie' | 'donut';

interface BieuDoChiTieuProps {
  tongThu?: number;
  tongChi?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-100 dark:border-zinc-700">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].name}</p>
        <p className="text-sm font-medium" style={{ color: payload[0].payload.fill }}>
          {Number(payload[0].value).toLocaleString('vi-VN')} đ
        </p>
      </div>
    );
  }
  return null;
};

export default function BieuDoChiTieu({ tongThu, tongChi }: BieuDoChiTieuProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('donut');

  useEffect(() => {
    setMounted(true);
    setLoading(false);
  }, []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalThu = tongThu ?? 0;
  const totalChi = tongChi ?? 0;
  const hasData = totalThu > 0 || totalChi > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}T`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}Tr`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const pieData = [
    { name: 'Tiền vào', value: totalThu, fill: '#00a87e' },
    { name: 'Tiền ra', value: totalChi, fill: '#e23b4a' },
  ].filter(d => d.value > 0);

  if (!mounted || loading) {
    return (
      <div className="fe-card-fe p-6 h-[420px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#494fdf]" />
      </div>
    );
  }

  return (
    <div className="fe-card-fe p-6 h-full flex flex-col bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-800/50 border-2 border-zinc-100 dark:border-zinc-800 shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold uppercase tracking-tight text-[#191c1f] dark:text-white"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 600 }}>
            Biểu đồ thu chi
          </h2>
          <p className="text-sm font-medium text-[#8d969e] mt-1"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Tháng {currentMonth}/{currentYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('donut')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              chartType === 'donut'
                ? 'bg-[#494fdf] text-white shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <PieChartIcon className="h-3.5 w-3.5 inline mr-1" />
            Tròn
          </button>
        </div>
      </div>

      {hasData && (
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totalThu)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">
              {formatCurrency(totalChi)}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex items-center justify-center" style={{ minHeight: 280 }}>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center text-[#8d969e]">
            <div className="w-16 h-16 mb-4 rounded-full bg-[#f4f4f4] flex items-center justify-center">
              <PieChartIcon className="h-8 w-8 text-[#c9c9cd]" />
            </div>
            <p className="text-sm font-medium">Chưa có dữ liệu thu chi</p>
            <p className="text-xs text-[#c9c9cd] mt-1">Biểu đồ sẽ hiển thị khi có dữ liệu</p>
          </div>
        ) : pieData.length === 1 ? (
          <div className="text-center">
            <div className="w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-4" 
              style={{ backgroundColor: pieData[0].fill + '20', border: `8px solid ${pieData[0].fill}` }}>
              <div>
                <p className="text-xs font-medium text-zinc-500">{pieData[0].name}</p>
                <p className="text-lg font-bold" style={{ color: pieData[0].fill }}>
                  {formatCurrency(pieData[0].value)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 70 : 0}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle" 
                iconSize={10} 
                wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} 
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
