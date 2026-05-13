"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Target, Trophy, TrendingUp, Loader2, Calendar, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { layBaoCaoMucTieu } from '@/services/baocao';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation';
import type { BaoCaoMucTieuType } from '@/types/BaoCao';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BaoCaoMucTieu() {
  const [data, setData] = useState<BaoCaoMucTieuType | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await layBaoCaoMucTieu();
      setData(result);
    } catch (error) {
      console.error('[BaoCaoMucTieu]', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        Không có dữ liệu mục tiêu
      </div>
    );
  }

  // Chuẩn bị dữ liệu biểu đồ
  const completedCount = data.danhSachMucTieu?.filter(x => x.daHoanThanh).length || 0;
  const inProgressCount = data.danhSachMucTieu?.filter(x => !x.daHoanThanh).length || 0;

  const donutOptions = {
    chart: { type: 'donut' as const, toolbar: { show: false } },
    labels: ['Đã hoàn thành', 'Đang theo dõi'],
    colors: ['#10b981', '#f59e0b'],
    legend: { position: 'bottom' as const, labels: { colors: '#505a63' } },
    plotOptions: { pie: { donut: { size: '70%', labels: { show: true, name: { show: true }, value: { show: true } } } } },
    dataLabels: { enabled: false }
  };

  const donutSeries = [completedCount, inProgressCount];

  return (
    <FadeIn>
      <div className="space-y-6">
        {/* Tổng quan - 4 cards compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#494fdf] to-[#6366f1] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 opacity-80" />
              <span className="text-[10px] opacity-70 uppercase tracking-wider">Tổng mục tiêu</span>
            </div>
            <p className="text-2xl font-bold">{data.tongMucTieu}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 opacity-80" />
              <span className="text-[10px] opacity-70 uppercase tracking-wider">Hoàn thành</span>
            </div>
            <p className="text-2xl font-bold">{data.mucTieuHoanThanh}</p>
          </div>
          
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="text-[10px] text-[#8d969e] uppercase tracking-wider">Đã tiết kiệm</span>
            </div>
            <p className="text-xl font-bold text-green-600">{data.tongDaTietKiem.toLocaleString('vi-VN')}đ</p>
          </div>
          
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Target className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span className="text-[10px] text-[#8d969e] uppercase tracking-wider">Đang theo dõi</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{data.tongMucTieu - data.mucTieuHoanThanh}</p>
          </div>
        </div>

        {/* Biểu đồ donut - compact */}
        {data.tongMucTieu > 0 && (
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#191c1f]">Tỷ lệ hoàn thành</h3>
              <Chart options={donutOptions} series={donutSeries} type="donut" height={160} />
            </div>
          </div>
        )}

        {/* Danh sách mục tiêu - compact cards */}
        <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#191c1f] mb-4">Danh sách mục tiêu tiết kiệm</h3>
          
          {data.danhSachMucTieu && data.danhSachMucTieu.length > 0 ? (
            <StaggerContainer staggerDelay={0.05}>
              <div className="grid md:grid-cols-2 gap-4">
                {data.danhSachMucTieu?.map((mt) => {
                  const isExpanded = expandedGoal === mt.mucTieuId;
                  return (
                    <StaggerItem key={mt.mucTieuId}>
                      <div className={`rounded-xl border transition-all ${
                        mt.daHoanThanh 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-[#e5e5e5]'
                      }`}>
                        {/* Header - luôn hiển thị */}
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedGoal(isExpanded ? null : mt.mucTieuId)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {mt.daHoanThanh && <CheckCircle className="h-4 w-4 text-green-600" />}
                              <h4 className="font-semibold text-[#191c1f]">{mt.tenMucTieu}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                mt.daHoanThanh ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {mt.daHoanThanh ? 'Hoàn thành' : 'Đang tiết kiệm'}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-[#8d969e]" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-[#8d969e]" />
                              )}
                            </div>
                          </div>
                          
                          {/* Progress bar compact */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-[#505a63]">{mt.daDat.toLocaleString('vi-VN')}đ</span>
                              <span className="font-medium">{mt.tyLeHoanThanh.toFixed(0)}%</span>
                              <span className="text-[#8d969e]">{mt.mucTieu.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${mt.daHoanThanh ? 'bg-green-500' : 'bg-[#494fdf]'}`
                                }
                                style={{ width: `${Math.min(mt.tyLeHoanThanh, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="border-t border-[#e5e5e5] p-4 bg-white/50">
                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-[10px] text-[#8d969e]">Còn thiếu</p>
                                <p className="font-semibold text-sm">{mt.conLai.toLocaleString('vi-VN')}đ</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-[10px] text-[#8d969e]">TB/tháng</p>
                                <p className="font-semibold text-sm">{mt.trungBinhThang.toLocaleString('vi-VN')}đ</p>
                              </div>
                              <div className="text-center p-2 bg-white rounded-lg">
                                <p className="text-[10px] text-[#8d969e]">Dự kiến</p>
                                <p className="font-semibold text-sm">
                                  {mt.ngayDuKien ? new Date(mt.ngayDuKien).toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }) : '-'}
                                </p>
                              </div>
                            </div>
                            
                            {/* Lịch sử đóng góp */}
                            {mt.lichSuDongGop && mt.lichSuDongGop.length > 0 && (
                              <div>
                                <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-2">Lịch sử đóng góp</p>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {mt.lichSuDongGop.slice(0, 5).map((dg) => (
                                    <div key={dg.dongGopId} className="flex items-center justify-between text-xs p-2 bg-white rounded-lg">
                                      <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3 text-[#8d969e]" />
                                        <span className="text-[#505a63]">{new Date(dg.ngayTao).toLocaleDateString('vi-VN')}</span>
                                      </div>
                                      <span className="font-medium text-green-600">+{dg.soTien.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          ) : (
            <div className="text-center py-12 text-[#8d969e]">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Bạn chưa có mục tiêu tiết kiệm nào</p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
