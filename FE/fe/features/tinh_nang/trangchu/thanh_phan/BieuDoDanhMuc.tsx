"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  BarChart as RechartsBarChart,
  Pie,
  Bar,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

type ChartType = 'pie' | 'bar';

interface CategoryChartPoint {
  name: string;
  value: number;
}

interface BieuDoDanhMucProps {
  data: CategoryChartPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-zinc-100 dark:border-zinc-700">
        <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{payload[0].name}</p>
        <p className="text-sm font-medium" style={{ color: payload[0].payload.fill || payload[0].color }}>
          {payload[0].value.toLocaleString('vi-VN')} đ
        </p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#6366f1'];

export default function BieuDoDanhMuc({ data }: BieuDoDanhMucProps) {
  const [mounted, setMounted] = useState(false);
  const [chartType, setChartType] = useState<ChartType>('pie');

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const totalStr = `${total.toLocaleString('vi-VN')} đ`;

  const chartTypes = [
    { type: 'pie' as ChartType, icon: PieChartIcon, label: 'Tròn' },
    { type: 'bar' as ChartType, icon: BarChart3, label: 'Cột' },
  ];

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm h-[420px] flex items-center justify-center text-zinc-400">
        Đang khởi tạo biểu đồ...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm h-full flex flex-col relative text-center">
      <div className="flex justify-between items-start mb-2">
        <div className="text-left">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Cơ cấu Chi Tiêu</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tháng {currentMonth}/{currentYear}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {chartTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                chartType === type
                  ? 'bg-[#494fdf] text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative mt-4" style={{ minHeight: 260 }}>
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-zinc-400">Chưa có dữ liệu danh mục từ API.</div>
        ) : chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity outline-none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <RechartsBarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Tr`} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} width={75} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.8 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center items-baseline gap-2">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tổng chi tiêu:</span>
        <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">{totalStr}</span>
      </div>
    </div>
  );
}
