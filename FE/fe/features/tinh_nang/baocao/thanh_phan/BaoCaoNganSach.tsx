"use client";

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Target, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { layBaoCaoNganSach } from '@/services/baocao';
import { FadeIn } from '@/components/animation';
import type { BaoCaoNganSachType } from '@/types/BaoCao';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  thang: number;
  nam: number;
}

export default function BaoCaoNganSach({ thang, nam }: Props) {
  const [data, setData] = useState<BaoCaoNganSachType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await layBaoCaoNganSach(thang, nam);
      setData(result);
    } catch (error) {
      console.error('[BaoCaoNganSach]', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [thang, nam]);

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
        Không có dữ liệu ngân sách
      </div>
    );
  }

  // Check if there's actual data for charts
  const hasProgressData = data.chiTietNganSach && data.chiTietNganSach.length > 0;
  const hasHistoryData = data.lichSuThucHien && data.lichSuThucHien.length > 0 && data.lichSuThucHien.some(x => Number(x.tongHanMuc) > 0 || Number(x.tongDaSuDung) > 0);

  const progressOptions = {
    chart: { type: 'bar' as const, toolbar: { show: false }, height: 350, stacked: true },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    colors: ['#10b981', '#e23b4a'],
    legend: { position: 'top' as const, labels: { colors: '#505a63' } },
    xaxis: { 
      categories: data.chiTietNganSach?.map(x => x.tenDanhMuc) || [],
      labels: { style: { colors: '#8d969e' } }
    },
    yaxis: { labels: { style: { colors: '#8d969e' }, formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` } },
    grid: { borderColor: '#c9c9cd' },
    dataLabels: { enabled: false }
  };

  const historyOptions = {
    chart: { type: 'line' as const, toolbar: { show: false }, height: 250 },
    stroke: { curve: 'smooth' as const, width: 3 },
    colors: ['#494fdf', '#e23b4a'],
    legend: { position: 'top' as const, labels: { colors: '#505a63' } },
    xaxis: { 
      categories: data.lichSuThucHien?.map(x => `Th${x.thang}`) || [],
      labels: { style: { colors: '#8d969e' } }
    },
    yaxis: { labels: { style: { colors: '#8d969e' }, formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` } },
    grid: { borderColor: '#c9c9cd' },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } }
  };

  const historySeries = [
    { name: 'Hạn mức', data: data.lichSuThucHien?.map(x => Number(x.tongHanMuc)) || [] },
    { name: 'Đã sử dụng', data: data.lichSuThucHien?.map(x => Number(x.tongDaSuDung)) || [] }
  ];

  return (
    <FadeIn>
      <div className="space-y-8">
        {/* Tổng quan */}
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#494fdf] to-[#6366f1] rounded-[24px] p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-6 w-6" />
              <span className="text-sm opacity-80 uppercase tracking-wider">Hạn mức</span>
            </div>
            <p className="text-3xl font-bold">{data.tongHanMuc.toLocaleString('vi-VN')}đ</p>
          </div>
          
          <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-sm text-[#8d969e] uppercase tracking-wider">Đã sử dụng</span>
            </div>
            <p className="text-3xl font-bold text-[#e23b4a]">{data.tongDaSuDung.toLocaleString('vi-VN')}đ</p>
          </div>
          
          <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-[#8d969e] uppercase tracking-wider">Còn lại</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{data.tongConLai.toLocaleString('vi-VN')}đ</p>
          </div>
          
          <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-[#8d969e] uppercase tracking-wider">Tuân thủ</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{data.tyLeTuanThu.toFixed(0)}%</p>
          </div>
        </div>

        {/* Cảnh báo */}
        {data.canhBao && data.canhBao.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-800">Cảnh báo vượt ngân sách</h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-3">
              {data.canhBao.map((item) => (
                <div key={item.danhMucId} className={`p-4 rounded-[12px] ${
                  item.mucDo === 'VUOT' ? 'bg-red-100 border border-red-300' :
                  item.mucDo === 'GAN_VUOT' ? 'bg-orange-100 border border-orange-300' :
                  'bg-yellow-100 border border-yellow-300'
                }`}>
                  <div className="flex justify-between items-start">
                    <p className="font-medium">{item.tenDanhMuc}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.mucDo === 'VUOT' ? 'bg-red-200 text-red-800' :
                      item.mucDo === 'GAN_VUOT' ? 'bg-orange-200 text-orange-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {item.mucDo === 'VUOT' ? 'Đã vượt' : item.mucDo === 'GAN_VUOT' ? 'Gần vượt' : 'Cảnh báo'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-[#505a63]">{item.daSuDung.toLocaleString('vi-VN')}đ / {item.hanMuc.toLocaleString('vi-VN')}đ</span>
                    <span className={`font-medium ${item.mucDo === 'VUOT' ? 'text-red-600' : 'text-orange-600'}`}>
                      {item.tyLeSuDung.toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.mucDo === 'VUOT' ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min(item.tyLeSuDung, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tiến độ ngân sách - Grid card view */}
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
          <h3 className="text-lg font-semibold mb-4">Tiến độ ngân sách theo danh mục</h3>
          {hasProgressData ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.chiTietNganSach?.map((ns) => {
                const isOverBudget = ns.daSuDung > ns.hanMuc;
                const percent = ns.hanMuc > 0 ? Math.min((ns.daSuDung / ns.hanMuc) * 100, 100) : 0;
                return (
                  <div key={ns.nganSachId} className={`p-4 rounded-[16px] border ${
                    isOverBudget ? 'bg-red-50 border-red-200' : 'bg-[#f4f4f4] border-[#e5e5e5]'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-[#191c1f]">{ns.tenDanhMuc}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isOverBudget ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isOverBudget ? 'Vượt' : 'OK'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#505a63]">{ns.daSuDung.toLocaleString('vi-VN')}đ</span>
                        <span className="text-[#8d969e]">{ns.hanMuc.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isOverBudget ? 'bg-red-500' : 
                            percent >= 80 ? 'bg-orange-500' : 
                            percent >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#8d969e]">
                          {isOverBudget ? (
                            <span className="text-red-600">Vượt {Math.abs(ns.conLai).toLocaleString('vi-VN')}đ</span>
                          ) : (
                            <span className="text-green-600">Còn {ns.conLai.toLocaleString('vi-VN')}đ</span>
                          )}
                        </span>
                        <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-[#191c1f]'}`}>
                          {ns.tyLeSuDung.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#8d969e]">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto text-zinc-300 mb-2" />
                <p>Chưa có ngân sách cho tháng này</p>
              </div>
            </div>
          )}
        </div>

        {/* Chi tiết từng ngân sách */}
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
          <h3 className="text-lg font-semibold mb-4">Chi tiết ngân sách</h3>
          <div className="space-y-3">
            {data.chiTietNganSach?.map((ns) => (
              <div key={ns.nganSachId} className={`p-4 rounded-[12px] ${
                ns.laVuot ? 'bg-red-50 border border-red-200' : 'bg-[#f4f4f4]'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{ns.tenDanhMuc}</span>
                  <span className={`font-semibold ${ns.laVuot ? 'text-red-600' : 'text-[#191c1f]'}`}>
                    {ns.daSuDung.toLocaleString('vi-VN')}đ / {ns.hanMuc.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        ns.laVuot ? 'bg-red-500' : 
                        ns.tyLeSuDung >= 80 ? 'bg-orange-500' : 
                        ns.tyLeSuDung >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(ns.tyLeSuDung, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium w-14 text-right ${
                    ns.laVuot ? 'text-red-600' : 'text-[#505a63]'
                  }`}>
                    {ns.tyLeSuDung.toFixed(0)}%
                  </span>
                </div>
                {!ns.laVuot && (
                  <p className="text-xs text-green-600 mt-1">
                    Còn lại: {ns.conLai.toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lịch sử 6 tháng - Bảng chi tiết + Biểu đồ */}
        <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
          <h3 className="text-lg font-semibold mb-4">Lịch sử thực hiện (6 tháng gần nhất)</h3>
          
          {hasHistoryData && (
            <div className="mb-6">
              <Chart options={historyOptions} series={historySeries} type="line" height={200} />
            </div>
          )}
          
          <div className="overflow-x-auto rounded-[12px] border border-[#c9c9cd]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f4f4f4]">
                  <th className="text-left py-3 px-4 text-[#8d969e] font-medium">Tháng</th>
                  <th className="text-right py-3 px-4 text-[#8d969e] font-medium">Hạn mức</th>
                  <th className="text-right py-3 px-4 text-[#8d969e] font-medium">Đã sử dụng</th>
                  <th className="text-right py-3 px-4 text-[#8d969e] font-medium">% Sử dụng</th>
                  <th className="text-center py-3 px-4 text-[#8d969e] font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {data.lichSuThucHien?.map((item, idx) => {
                  const tyLe = item.tongHanMuc > 0 ? (item.tongDaSuDung / item.tongHanMuc) * 100 : 0;
                  const isOver = item.tongDaSuDung > item.tongHanMuc;
                  return (
                    <tr key={idx} className="border-t border-[#f4f4f4] hover:bg-[#fafafa]">
                      <td className="py-3 px-4 font-medium text-[#191c1f]">Tháng {item.thang}/{item.nam}</td>
                      <td className="text-right py-3 px-4 text-[#505a63]">{item.tongHanMuc.toLocaleString('vi-VN')}đ</td>
                      <td className="text-right py-3 px-4 text-[#505a63]">{item.tongDaSuDung.toLocaleString('vi-VN')}đ</td>
                      <td className="text-right py-3 px-4">
                        <span className={`font-medium ${isOver ? 'text-red-600' : 'text-[#191c1f]'}`}>
                          {tyLe.toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        {isOver ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Vượt</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {(!data.lichSuThucHien || data.lichSuThucHien.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#8d969e]">
                      Chưa có dữ liệu lịch sử
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
