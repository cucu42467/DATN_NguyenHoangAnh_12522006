"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Banknote, Smartphone, Loader2 } from 'lucide-react';
import { layBaoCaoTaiKhoan } from '@/services/baocao';
import { FadeIn } from '@/components/animation';
import type { BaoCaoTaiKhoanType } from '@/types/BaoCao';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  thang?: number;
  nam?: number;
}

export default function BaoCaoTaiKhoan({ thang, nam }: Props) {
  const [data, setData] = useState<BaoCaoTaiKhoanType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await layBaoCaoTaiKhoan(thang, nam);
      setData(result);
    } catch (error) {
      console.error('[BaoCaoTaiKhoan]', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [thang, nam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getLoaiIcon = (tenLoai: string) => {
    const lower = tenLoai.toLowerCase();
    if (lower.includes('tiền mặt')) return <Banknote className="h-5 w-5" />;
    if (lower.includes('ngân hàng')) return <Banknote className="h-5 w-5" />;
    if (lower.includes('ví')) return <Smartphone className="h-5 w-5" />;
    if (lower.includes('thẻ')) return <CreditCard className="h-5 w-5" />;
    return <Wallet className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-10 flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-[#494fdf]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-10 text-center text-[#8d969e]">
        Không có dữ liệu tài khoản
      </div>
    );
  }

  // Check if there's data to display
  const hasPhanBoData = data.phanBoTheoLoai && data.phanBoTheoLoai.length > 0 && data.phanBoTheoLoai.some(x => Number(x.tongSoDu) > 0);
  const hasBienDongData = data.bienDongSoDu?.Labels && data.bienDongSoDu.Labels.length > 0 && data.bienDongSoDu.Series?.[0]?.data?.some((v: any) => v > 0);

  const pieOptions = {
    chart: { type: 'pie' as const, toolbar: { show: false } },
    labels: data.phanBoTheoLoai.map(x => x.tenLoai),
    colors: ['#494fdf', '#00a87e', '#e23b4a', '#f59e0b', '#8b5cf6'],
    legend: { position: 'bottom' as const, labels: { colors: '#505a63' } },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
    plotOptions: { pie: { donut: { size: '70%' } } }
  };

  const lineOptions = {
    chart: { type: 'line' as const, toolbar: { show: false }, height: 300 },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#494fdf'],
    fill: { type: 'gradient' as const, gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    xaxis: { categories: data.bienDongSoDu?.Labels || [], labels: { style: { colors: '#8d969e' } } },
    yaxis: { labels: { style: { colors: '#8d969e' }, formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` } },
    grid: { borderColor: '#c9c9cd' },
    tooltip: { y: { formatter: (v: number) => `${v.toLocaleString('vi-VN')}đ` } }
  };

  const lineSeries = [{
    name: 'Tổng tài sản',
    data: data.bienDongSoDu?.Series?.[0]?.data || []
  }];

  return (
    <FadeIn>
      <div className="space-y-8">
        {/* Tổng tài sản */}
        <div className="bg-gradient-to-r from-[#494fdf] to-[#6366f1] rounded-[24px] p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-[16px]">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm opacity-80 uppercase tracking-wider">Tổng tài sản</p>
              <h2 className="text-4xl font-bold">
                {data.tongTaiSan.toLocaleString('vi-VN')}đ
              </h2>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Biểu đồ phân bổ */}
          <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
            <h3 className="text-lg font-semibold mb-4">Phân bổ theo loại tài khoản</h3>
            {hasPhanBoData ? (
              <Chart options={pieOptions} series={data.phanBoTheoLoai.map(x => Number(x.tongSoDu))} type="pie" height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-[#8d969e]">
                <div className="text-center">
                  <Wallet className="h-12 w-12 mx-auto text-zinc-300 mb-2" />
                  <p>Chưa có tài khoản</p>
                </div>
              </div>
            )}
          </div>

          {/* Biến động số dư */}
          <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
            <h3 className="text-lg font-semibold mb-4">Biến động số dư (12 tháng)</h3>
            {hasBienDongData ? (
              <Chart options={lineOptions} series={lineSeries} type="line" height={280} />
            ) : (
              <div className="h-[280px] flex items-center justify-center text-[#8d969e]">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-zinc-300 mb-2" />
                  <p>Chưa có dữ liệu biến động</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danh sách tài khoản */}
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
          <h3 className="text-lg font-semibold mb-4">Chi tiết tài khoản</h3>
          <div className="space-y-3">
            {data.danhSachTaiKhoan?.map((tk) => (
              <div key={tk.taiKhoanId} className="flex items-center justify-between p-4 bg-[#f4f4f4] rounded-[16px]">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-[12px] ${
                    tk.tenLoaiTaiKhoan.toLowerCase().includes('tiền mặt') ? 'bg-green-100 text-green-600' :
                    tk.tenLoaiTaiKhoan.toLowerCase().includes('ngân hàng') ? 'bg-blue-100 text-blue-600' :
                    tk.tenLoaiTaiKhoan.toLowerCase().includes('ví') ? 'bg-purple-100 text-purple-600' :
                    tk.tenLoaiTaiKhoan.toLowerCase().includes('thẻ') ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getLoaiIcon(tk.tenLoaiTaiKhoan)}
                  </div>
                  <div>
                    <p className="font-medium">{tk.tenTaiKhoan}</p>
                    <p className="text-xs text-[#8d969e]">{tk.tenLoaiTaiKhoan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{tk.soDuHienTai.toLocaleString('vi-VN')}đ</p>
                  <p className={`text-xs flex items-center gap-1 justify-end ${
                    tk.bienDong >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tk.bienDong >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(tk.bienDong).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
