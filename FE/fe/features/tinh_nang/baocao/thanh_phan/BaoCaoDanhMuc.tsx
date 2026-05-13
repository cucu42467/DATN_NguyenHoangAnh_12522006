"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PieChart, TrendingUp, TrendingDown, Loader2, ChevronDown, ChevronRight, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { layBaoCaoDanhMuc } from '@/services/baocao';
import { layDanhSachGiaoDich } from '@/services/giaodich/giaodich';
import { FadeIn, SlideUp } from '@/components/animation';
import type { BaoCaoDanhMucType } from '@/types/BaoCao';
import type { GiaoDichDto } from '@/types';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  thang?: number;
  nam?: number;
}

export default function BaoCaoDanhMuc({ thang, nam }: Props) {
  const [data, setData] = useState<BaoCaoDanhMucType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDanhMuc, setExpandedDanhMuc] = useState<number | null>(null);
  const [selectedDanhMucId, setSelectedDanhMucId] = useState<number | null>(null);
  const [giaoDichList, setGiaoDichList] = useState<GiaoDichDto[]>([]);
  const [loadingGiaoDich, setLoadingGiaoDich] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await layBaoCaoDanhMuc(thang, nam);
      setData(result);
    } catch (error) {
      console.error('[BaoCaoDanhMuc]', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [thang, nam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch giao dịch khi click vào danh mục
  const handleExpandDanhMuc = async (danhMucId: number, tenDanhMuc: string) => {
    if (expandedDanhMuc === danhMucId) {
      setExpandedDanhMuc(null);
      setSelectedDanhMucId(null);
      setGiaoDichList([]);
      return;
    }

    setExpandedDanhMuc(danhMucId);
    setSelectedDanhMucId(danhMucId);
    setLoadingGiaoDich(true);

    try {
      const result = await layDanhSachGiaoDich({
        danhMucId: danhMucId,
        pageSize: 20,
        sortBy: 'ngayGiaoDich',
        sortOrder: 'desc',
      });
      setGiaoDichList(result.items || []);
    } catch (error) {
      console.error('[BaoCaoDanhMuc] Lỗi khi load giao dịch:', error);
      setGiaoDichList([]);
    } finally {
      setLoadingGiaoDich(false);
    }
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
        Không có dữ liệu chi tiêu
      </div>
    );
  }

  const pieColors = ['#e23b4a', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#f97316', '#ec4899', '#6366f1', '#84cc16', '#ef4444'];

  // Check if there's actual data for charts
  const hasPieData = data.topDanhMuc && data.topDanhMuc.length > 0 && data.topDanhMuc.some(x => Number(x.tongTien) > 0);
  const hasCompareData = data.soSanhThangTruoc && data.soSanhThangTruoc.length > 0 && data.soSanhThangTruoc.some(x => Number(x.tienThangNay) > 0 || Number(x.tienThangTruoc) > 0);
  const hasBarData = data.topDanhMuc && data.topDanhMuc.length > 0 && data.topDanhMuc.some(x => Number(x.tongTien) > 0);
  const hasDanhMucData = data.danhMucCha && data.danhMucCha.length > 0;

  const pieOptions = {
    chart: { type: 'pie' as const, toolbar: { show: false } },
    labels: data.topDanhMuc?.map(x => x.tenDanhMuc) || [],
    colors: pieColors,
    legend: { position: 'bottom' as const, labels: { colors: '#505a63' } },
    dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` }
  };

  const compareOptions = {
    chart: { type: 'bar' as const, toolbar: { show: false }, height: 250, stacked: true },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    colors: ['#10b981', '#e23b4a'],
    legend: { position: 'top' as const, labels: { colors: '#505a63' } },
    xaxis: { 
      categories: data.soSanhThangTruoc?.slice(0, 8).map(x => x.tenDanhMuc) || [],
      labels: { style: { colors: '#8d969e' } }
    },
    yaxis: { labels: { style: { colors: '#8d969e' }, formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` } },
    grid: { borderColor: '#c9c9cd' },
    dataLabels: { enabled: false }
  };

  const compareSeries = [
    { name: 'Tháng trước', data: data.soSanhThangTruoc?.slice(0, 8).map(x => Number(x.tienThangTruoc)) || [] },
    { name: 'Tháng này', data: data.soSanhThangTruoc?.slice(0, 8).map(x => Number(x.tienThangNay)) || [] }
  ];

  return (
    <FadeIn>
      <div className="space-y-6">
        {/* Tổng quan - 2 cards compact */}
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
            <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Tổng chi tiêu</p>
            <h2 className="text-3xl font-bold">{data.tongChiTieu.toLocaleString('vi-VN')}đ</h2>
            <p className="text-xs opacity-70 mt-1">{data.soGiaoDich} giao dịch</p>
          </div>
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mb-1">Top chi tiêu</p>
            {data.topDanhMuc?.[0] && (
              <div>
                <p className="text-xl font-bold text-[#e23b4a]">{data.topDanhMuc[0].tenDanhMuc}</p>
                <p className="text-xs text-[#8d969e]">{data.topDanhMuc[0].tongTien.toLocaleString('vi-VN')}đ ({data.topDanhMuc[0].tyLe.toFixed(1)}%)</p>
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ - grid 2 cột */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Biểu đồ tròn */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#191c1f] mb-3">Cơ cấu chi tiêu</h3>
            {hasPieData ? (
              <Chart options={pieOptions} series={data.topDanhMuc?.map(x => Number(x.tongTien)) || []} type="pie" height={320} />
            ) : (
              <div className="h-[320px] flex items-center justify-center text-[#8d969e]">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto text-zinc-300 mb-2" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>

          {/* So sánh tháng trước */}
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#191c1f] mb-3">So sánh tháng trước</h3>
            {hasCompareData ? (
              <Chart options={compareOptions} series={compareSeries} type="bar" height={320} />
            ) : (
              <div className="h-[320px] flex items-center justify-center text-[#8d969e]">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto text-zinc-300 mb-2" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top danh mục - thanh tiến trình */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#191c1f] mb-4">Top danh mục chi tiêu</h3>
          {hasBarData ? (
            <div className="space-y-4">
              {data.topDanhMuc?.slice(0, 10).map((dm, idx) => {
                const maxTien = Math.max(...data.topDanhMuc?.map(x => Number(x.tongTien)) || [1]);
                const barWidth = maxTien > 0 ? (Number(dm.tongTien) / maxTien) * 100 : 0;
                return (
                  <div key={dm.danhMucId} className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#494fdf] text-[9px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-sm text-[#191c1f]">{dm.tenDanhMuc}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#e23b4a]">
                          {dm.tongTien.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[10px] text-[#8d969e] bg-[#f4f4f4] px-2 py-0.5 rounded-full">
                          {dm.tyLe.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {/* Thanh tiến trình */}
                    <div className="h-3 bg-[#f4f4f4] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${barWidth}%`,
                          background: barWidth > 80 ? '#e23b4a' : barWidth > 50 ? '#f59e0b' : '#494fdf'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-[#8d969e]">
              <div className="text-center">
                <TrendingDown className="h-10 w-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-sm">Chưa có dữ liệu</p>
              </div>
            </div>
          )}
        </div>

        {/* Chi tiết theo danh mục - expandable với giao dịch */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#191c1f] mb-3">Chi tiết theo danh mục</h3>
          {hasDanhMucData ? (
            <div className="space-y-2">
              {data.danhMucCha?.map((dm) => {
                const isExpanded = expandedDanhMuc === dm.danhMucId;
                return (
                  <div key={dm.danhMucId} className="border border-[#e5e5e5] rounded-xl overflow-hidden">
                    {/* Header - click để expand */}
                    <button
                      onClick={() => handleExpandDanhMuc(dm.danhMucId, dm.tenDanhMuc)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[#f4f4f4] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-[#8d969e]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#8d969e]" />
                        )}
                        <div>
                          <span className="font-semibold text-sm text-[#191c1f]">{dm.tenDanhMuc}</span>
                          <span className="ml-2 text-[10px] text-[#8d969e]">({dm.soGiaoDich} GD)</span>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-[#e23b4a]">{dm.tongTien.toLocaleString('vi-VN')}đ</p>
                    </button>
                    
                    {/* Expanded - Hiển thị giao dịch */}
                    {isExpanded && (
                      <div className="border-t border-[#e5e5e5] bg-[#fafafa]">
                        {loadingGiaoDich ? (
                          <div className="p-6 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[#494fdf]" />
                          </div>
                        ) : giaoDichList.length > 0 ? (
                          <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-white sticky top-0">
                                <tr className="border-b border-[#e5e5e5]">
                                  <th className="text-left py-2 px-3 text-[#8d969e] font-medium">Ngày</th>
                                  <th className="text-left py-2 px-3 text-[#8d969e] font-medium">Ghi chú</th>
                                  <th className="text-right py-2 px-3 text-[#8d969e] font-medium">Số tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                {giaoDichList.map((gd) => (
                                  <tr key={gd.giaoDichId} className="border-b border-[#f0f0f0] hover:bg-white transition-colors">
                                    <td className="py-2 px-3">
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-[#8d969e]" />
                                        <span className="text-[#505a63]">
                                          {gd.ngayGiaoDich ? new Date(gd.ngayGiaoDich).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '-'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-[#505a63] truncate max-w-[150px]">
                                      {gd.ghiChu || '-'}
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                      <div className="flex items-center justify-end gap-1 text-[#e23b4a]">
                                        <ArrowDownLeft className="h-3 w-3" />
                                        <span className="font-medium">
                                          -{gd.soTien.toLocaleString('vi-VN')}đ
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-[#8d969e] text-sm">
                            Chưa có giao dịch nào
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-[#8d969e]">
              <div className="text-center">
                <PieChart className="h-10 w-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-sm">Chưa có danh mục</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
