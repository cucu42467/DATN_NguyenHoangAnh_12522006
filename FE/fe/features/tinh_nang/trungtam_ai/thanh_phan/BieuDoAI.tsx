'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import type { GeminiDuLieuBieuDo } from '@/kieu_du_lieu/user/GeminiAI';

interface BieuDoAIProps {
  duLieu: GeminiDuLieuBieuDo;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function BieuDoAI({ duLieu }: BieuDoAIProps) {
  const data = duLieu.nhan.map((nhan, index) => ({
    name: nhan,
    value: duLieu.giaTri[index] || 0
  }));

  const renderChart = () => {
    switch (duLieu.loaiBieuDo) {
      case 'PIE':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [(value as number)?.toLocaleString('vi-VN') ?? '0', 'Giá trị']} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'BAR':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => (value as number)?.toLocaleString('vi-VN')} />
              <Tooltip formatter={(value) => [(value as number)?.toLocaleString('vi-VN') ?? '0', 'Giá trị']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'LINE':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => (value as number)?.toLocaleString('vi-VN')} />
              <Tooltip formatter={(value) => [(value as number)?.toLocaleString('vi-VN') ?? '0', 'Giá trị']} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Loại biểu đồ không hỗ trợ</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mt-4">
      {duLieu.moTa && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 text-center">
          {duLieu.moTa}
        </p>
      )}
      {renderChart()}
    </div>
  );
}