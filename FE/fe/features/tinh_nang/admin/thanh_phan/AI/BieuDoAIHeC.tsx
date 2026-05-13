"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import {
  BrainCircuit, Activity, TrendingUp, History, Box, Layers,
  ChevronRight, Target, Users, BarChart3, Cpu, GitBranch, ArrowUp, ArrowDown,
  RefreshCw, Loader2
} from 'lucide-react';
import { layThongKeAI } from '@/services/ai';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ClusterData {
  group: string;
  pct: number;
  count: string;
  color: string;
  description: string;
}

interface ModelVersion {
  version: string;
  mae: number;
  precision: number;
  date: string;
  active: boolean;
}

interface ThongKeAI {
  mae?: number;
  doChinhXac?: number;
  ctr?: number;
  clusters?: ClusterData[];
  modelVersions?: ModelVersion[];
  labels?: string[];
  actualData?: number[];
  predictedData?: number[];
  totalTransactions?: number;
}

export default function BieuDoAIHeC() {
  const [data, setData] = useState<ThongKeAI | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVersion, setActiveVersion] = useState('v4.2.0 (XGBoost)');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await layThongKeAI();
      setData(response as ThongKeAI);
      if (response?.modelVersions?.length) {
        const active = response.modelVersions.find((v: ModelVersion) => v.active);
        if (active) setActiveVersion(active.version);
      }
    } catch (error) {
      console.error('Lỗi tải thống kê AI:', error);
      // Sử dụng dữ liệu mặc định nếu API không có
      setData({
        mae: 0,
        doChinhXac: 0,
        ctr: 0,
        clusters: [],
        modelVersions: [],
        labels: [],
        actualData: [],
        predictedData: [],
        totalTransactions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Default data khi không có API
  const CLUSTER_DATA = data?.clusters?.length ? data.clusters : [
    { group: 'Chưa có dữ liệu', pct: 0, count: '0', color: '#94a3b8', description: 'Chưa có dữ liệu phân cụm' },
  ];

  const MODEL_VERSIONS = data?.modelVersions?.length ? data.modelVersions : [
    { version: 'v4.2.0 (XGBoost)', mae: 0, precision: 0, date: new Date().toISOString().split('T')[0], active: true },
  ];

  const systemSeries = [
    { name: 'Chi tiêu thực tế', type: 'column', data: data?.actualData?.length ? data.actualData : [] },
    { name: 'Dự báo AI Model', type: 'line', data: data?.predictedData?.length ? data.predictedData : [] },
  ];

  const systemOptions: ApexOptions = {
    chart: { height: 380, type: 'line', toolbar: { show: false }, fontFamily: 'Inter, sans-serif', background: 'transparent' },
    stroke: { width: [0, 4], curve: 'smooth', dashArray: [0, 0] },
    colors: ['#818cf8', '#6366f1'],
    fill: { opacity: [0.3, 1], type: ['gradient', 'solid'], gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02, stops: [20, 100] } },
    labels: data?.labels?.length ? data.labels : ['Chưa có dữ liệu'],
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 800 } } },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 800 }, formatter: v => `${v.toLocaleString()}` } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px', fontWeight: 800, labels: { colors: '#64748b' } },
    tooltip: { theme: 'light', shared: true, intersect: false },
  };

  const clusterOptions: ApexOptions = {
    chart: { type: 'donut', height: 260, background: 'transparent' },
    colors: CLUSTER_DATA.map(c => c.color),
    labels: CLUSTER_DATA.map(c => c.group),
    legend: { show: false },
    plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, label: 'Người dùng', fontSize: '10px', fontWeight: 800, color: '#94a3b8', formatter: () => `${data?.totalTransactions?.toLocaleString() || 0}` } } } } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'light' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Accuracy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'MAE (Sai số TB)', value: data?.mae ? `${data.mae}%` : 'N/A', sub: 'Mean Absolute Error', trend: data?.mae ? '-58%' : '', up: data?.mae ? false : true, color: 'text-emerald-500', icon: Target },
          { label: 'Độ chính xác phân loại', value: data?.doChinhXac ? `${data.doChinhXac}%` : 'N/A', sub: 'Classification Precision', trend: data?.doChinhXac ? '+5.7%' : '', up: data?.doChinhXac ? true : true, color: 'text-indigo-500', icon: Activity },
          { label: 'Recommendation CTR', value: data?.ctr ? `${data.ctr}%` : 'N/A', sub: 'Click-Through Rate', trend: data?.ctr ? '+3.2%' : '', up: data?.ctr ? true : true, color: 'text-purple-500', icon: BrainCircuit },
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm group hover:translate-y-[-4px] transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${m.color} group-hover:rotate-12 transition-transform`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${m.up ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-500'}`}>
                {m.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {m.trend}
              </div>
            </div>
            <p className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-2">{m.value}</p>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] italic opacity-60">{m.label}</p>
            <p className="text-[9px] font-bold text-zinc-300 uppercase mt-1 italic">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Chart: Actual vs Predicted (2/3) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-10 rounded-[3.5rem] shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">Actual vs Predicted — Dòng tiền Hệ thống</h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1.5 italic flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse inline-block" />
                  Dữ liệu từ API · {data?.totalTransactions?.toLocaleString() || 0} giao dịch
                </p>
              </div>
            </div>
            <button onClick={fetchData} className="p-3 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors">
              <RefreshCw className="h-5 w-5 text-zinc-500" />
            </button>
          </div>
          {systemSeries[0].data.length === 0 ? (
            <div className="flex items-center justify-center h-[380px] text-zinc-400">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                <p>Chưa có dữ liệu dự báo từ API</p>
              </div>
            </div>
          ) : (
            <Chart options={systemOptions} series={systemSeries} type="line" height={380} />
          )}
        </div>

        {/* Right Panel (1/3) */}
        <div className="space-y-6">
          {/* Model Versioning */}
          <div className="bg-zinc-950 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <GitBranch className="h-5 w-5 text-indigo-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Model Versioning</p>
              </div>
              <div className="space-y-3">
                {MODEL_VERSIONS.map((v, i) => (
                  <button key={i} onClick={() => setActiveVersion(v.version)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${activeVersion === v.version ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-600/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase italic tracking-tighter">{v.version}</p>
                        <p className="text-[9px] opacity-50 mt-0.5">{v.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-emerald-400">{v.precision}%</p>
                        <p className="text-[8px] opacity-40 uppercase">Precision</p>
                      </div>
                    </div>
                    {activeVersion === v.version && (
                      <div className="mt-3 flex gap-3 pt-3 border-t border-white/10">
                        <div><p className="text-[8px] opacity-50 uppercase">MAE</p><p className="text-xs font-black">{v.mae}%</p></div>
                        <div><p className="text-[8px] opacity-50 uppercase">Status</p>
                          <span className="text-[9px] font-black text-emerald-400">{v.active ? '● Active' : '○ Archived'}</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-[0.04] pointer-events-none">
              <Cpu className="h-32 w-32" />
            </div>
          </div>

          {/* Cluster Info */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-indigo-500" />
              <h4 className="text-sm font-black uppercase italic tracking-tighter">Phân nhóm người dùng</h4>
            </div>
            {CLUSTER_DATA.length === 1 && CLUSTER_DATA[0].pct === 0 ? (
              <div className="flex flex-col items-center justify-center h-[220px] text-zinc-400">
                <Users className="h-10 w-10 mb-3 text-zinc-300" />
                <p className="text-sm">Chưa có dữ liệu phân cụm</p>
              </div>
            ) : (
              <>
                <Chart options={clusterOptions} series={CLUSTER_DATA.map(c => c.pct)} type="donut" height={220} />
                <div className="space-y-3 mt-4">
                  {CLUSTER_DATA.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-700 dark:text-zinc-300 truncate">{c.group}</p>
                        <p className="text-[9px] text-zinc-400 italic opacity-60">{c.count} users</p>
                      </div>
                      <span className="text-sm font-black text-zinc-500">{c.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
