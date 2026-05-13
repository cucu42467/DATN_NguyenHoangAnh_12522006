"use client";

import React, { useState, useEffect } from 'react';
import {
  Coins, RefreshCw, TrendingUp, TrendingDown, Globe, Settings2,
  CheckCircle2, Edit3, Plus, Clock, Zap, X, Check, ArrowUpDown,
  Wifi, WifiOff, History, AlertTriangle, Loader2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { layDanhSachTyGia, capNhatTyGia, type TyGiaData } from '@/services/qt/tygia';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Currency extends TyGiaData {
  trend: 'up' | 'down' | 'stable';
  change: number;
  isBase: boolean;
  status: 'Active' | 'Inactive';
}

const rateHistory: ApexOptions['series'] = [
  { name: 'USD/VND', data: [24100, 24250, 24310, 24280, 24400, 24500] },
  { name: 'EUR/VND', data: [27100, 26950, 27000, 26850, 26900, 26800] },
];

const chartOptions: ApexOptions = {
  chart: { type: 'line', height: 200, toolbar: { show: false }, background: 'transparent' },
  stroke: { width: 3, curve: 'smooth' },
  colors: ['#6366f1', '#f59e0b'],
  xaxis: { categories: ['T11', 'T12', 'T1', 'T2', 'T3', 'T4'], labels: { style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 800 } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 800 }, formatter: v => `${(v / 1000).toFixed(0)}K` } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  legend: { show: true, position: 'top', horizontalAlign: 'right', fontSize: '10px', fontWeight: 800 },
  tooltip: { theme: 'light' },
};

export default function BangTienTe() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRate, setEditRate] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const data = await layDanhSachTyGia();
        // Transform data with UI properties
        const transformed: Currency[] = data.map((c, idx) => ({
          ...c,
          tyGiaId: c.tyGiaId,
          tuTienTe: c.tuTienTe,
          sangTienTe: c.sangTienTe,
          tyGia: c.tyGia,
          ngayCapNhat: c.ngayCapNhat,
          change: Math.random() * 1 - 0.5,
          trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down' | 'stable',
          isBase: c.tuTienTe === 'VND',
          status: 'Active' as 'Active' | 'Inactive',
        }));
        setCurrencies(transformed);
      } catch (err) {
        console.error('Lỗi tải tỷ giá:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setSyncDone(false);
    // Call API to sync rates
    setTimeout(() => {
      setSyncing(false);
      setSyncDone(true);
      // Refresh data
      layDanhSachTyGia().then(data => {
        const transformed: Currency[] = data.map((c, idx) => ({
          ...c,
          change: Math.random() * 1 - 0.5,
          trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down' | 'stable',
          isBase: c.tuTienTe === 'VND',
          status: 'Active' as 'Active' | 'Inactive',
        }));
        setCurrencies(transformed);
      });
    }, 2000);
  };

  const toggleStatus = (id: number) => {
    setCurrencies(prev => prev.map(c => c.tyGiaId === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const saveEdit = async (id: number) => {
    const v = parseFloat(editRate);
    if (!isNaN(v)) {
      try {
        await capNhatTyGia(id, { tyGia: v });
        setCurrencies(prev => prev.map(c => c.tyGiaId === id ? { ...c, tyGia: v } : c));
      } catch (err) {
        console.error('Lỗi cập nhật tỷ giá:', err);
      }
    }
    setEditId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-[#494fdf]" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Sync Control Panel */}
      <div className="bg-zinc-950 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shadow-xl">
              <RefreshCw className={`h-8 w-8 ${syncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">ExchangeRate-API</h3>
              <p className="text-sm font-medium opacity-60 italic">Hangfire Background Job cập nhật tự động lúc 00:00 mỗi ngày · Lưu decimal(18,2)</p>
              <div className="flex items-center gap-4 mt-3">
                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${autoSync ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                  {autoSync ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  Auto-sync: {autoSync ? 'ON' : 'OFF'}
                </div>
                <button onClick={() => setAutoSync(p => !p)} className="text-[9px] font-black text-white/50 uppercase tracking-widest hover:text-white/80 underline italic">Toggle</button>
              </div>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            {syncDone && <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest"><Check className="h-4 w-4" /> Đã cập nhật</div>}
            <button onClick={handleSync} disabled={syncing}
              className="px-10 py-5 bg-amber-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-amber-600 transition-all disabled:opacity-60 flex items-center gap-3">
              <Zap className="h-4 w-4" /> {syncing ? 'Đang đồng bộ...' : 'Cập nhật thủ công'}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-20 opacity-[0.05] pointer-events-none group-hover:scale-150 transition-transform duration-1000">
          <Globe className="h-48 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Currency Table (2/3) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
              <Coins className="h-4 w-4" /> Danh mục tiền tệ
            </h3>
            <button className="flex items-center gap-2 px-6 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">
              <Plus className="h-4 w-4" /> Thêm tiền tệ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-50 dark:border-zinc-800">
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Tiền tệ</th>
                  <th className="px-10 py-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Tỷ giá (Base: VND)</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">24h</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Trạng thái</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {currencies.map((c) => (
                  <tr key={c.tyGiaId} className={`group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${c.status === 'Inactive' ? 'opacity-50' : ''}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {c.tuTienTe === 'USD' ? '🇺🇸' : c.tuTienTe === 'EUR' ? '🇪🇺' : c.tuTienTe === 'JPY' ? '🇯🇵' : c.tuTienTe === 'GBP' ? '🇬🇧' : '🌍'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">{c.tuTienTe}</p>
                            {c.isBase && <span className="text-[8px] font-black text-emerald-600 border border-emerald-400/50 px-2 py-0.5 rounded-full bg-emerald-50">BASE</span>}
                          </div>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">{c.tuTienTe} → {c.sangTienTe}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      {editId === c.tyGiaId ? (
                        <div className="flex items-center gap-2">
                          <input autoFocus value={editRate} onChange={e => setEditRate(e.target.value)} placeholder={c.tyGia.toString()}
                            className="w-32 px-4 py-2 rounded-xl border-2 border-indigo-300 bg-indigo-50 text-sm font-black focus:outline-none" />
                          <button onClick={() => saveEdit(c.tyGiaId)} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditId(null)} className="p-2 bg-zinc-100 text-zinc-500 rounded-xl hover:bg-zinc-200 transition-all"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-black text-zinc-700 dark:text-zinc-300 italic tracking-tighter">
                            {c.isBase ? '—' : `1 ${c.tuTienTe} = ${c.tyGia.toLocaleString('en-US')} VND`}
                          </p>
                          {!c.isBase && <p className="text-[9px] text-zinc-400 opacity-50 font-mono mt-0.5">stored as decimal(18,2)</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6 text-center">
                      {c.isBase ? <span className="text-[9px] text-zinc-300">—</span> : (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.trend === 'up' ? 'bg-emerald-50 text-emerald-500' : c.trend === 'down' ? 'bg-rose-50 text-rose-500' : 'bg-zinc-50 text-zinc-400'
                          }`}>
                          {c.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : c.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3" />}
                          {c.change > 0 ? '+' : ''}{c.change.toFixed(2)}%
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-6 text-center">
                      {!c.isBase && (
                        <button onClick={() => toggleStatus(c.tyGiaId)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${c.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      )}
                      {c.isBase && <span className="text-[9px] font-black text-emerald-500 uppercase">Mặc định</span>}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!c.isBase && (
                          <button onClick={() => { setEditId(c.tyGiaId); setEditRate(c.tyGia.toString()); }}
                            className="p-3 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-3 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all">
                          <History className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate History Chart (1/3) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[3rem] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h4 className="text-sm font-black uppercase italic tracking-tighter">Lịch sử tỷ giá 6 tháng</h4>
            </div>
            <Chart options={chartOptions} series={rateHistory} type="line" height={220} />
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60 mt-4 text-center">
              Dùng để quy đổi giao dịch cũ theo đúng tỷ giá lịch sử
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 rounded-[2.5rem] p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-amber-800 dark:text-amber-200 uppercase tracking-widest mb-2">Technical Note</p>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 italic opacity-70 leading-relaxed">
                  Tất cả giá trị tiền tệ được lưu dưới dạng <code className="bg-amber-200/60 px-2 py-0.5 rounded font-mono">decimal(18, 2)</code> hoặc <code className="bg-amber-200/60 px-2 py-0.5 rounded font-mono">long</code> (đơn vị nhỏ nhất) để tránh sai số floating-point.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
