"use client";

import React, { useState } from 'react';
import { 
  Type, Zap, Trash2, Plus, Search, Target, ArrowRight, 
  Edit3, Database, BarChart2, Settings2, RefreshCw,
  Cpu, SlidersHorizontal, AlertTriangle, Check, X, 
  ChevronRight, HelpCircle, Layers
} from 'lucide-react';

interface PriorityItem {
  id: string;
  keyword: string;
  weight: number;
  category: string;
  categoryColor: string;
  lastTuned: string;
}

interface ThresholdConfig {
  id: string;
  label: string;
  description: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  highlight: string;
}

const mockPriorities: PriorityItem[] = [
  { id: 'P1', keyword: 'Grab', weight: 85, category: 'Di chuyển', categoryColor: '#3b82f6', lastTuned: '2024-04-07' },
  { id: 'P2', keyword: 'Food', weight: 70, category: 'Ăn uống', categoryColor: '#f59e0b', lastTuned: '2024-04-07' },
  { id: 'P3', keyword: 'Pharmacy', weight: 95, category: 'Sức khỏe', categoryColor: '#10b981', lastTuned: '2024-04-05' },
  { id: 'P4', keyword: 'Cinema', weight: 60, category: 'Giải trí', categoryColor: '#ec4899', lastTuned: '2024-04-02' },
  { id: 'P5', keyword: 'Shopee', weight: 78, category: 'Mua sắm', categoryColor: '#6366f1', lastTuned: '2024-04-01' },
];

const thresholdConfigs: ThresholdConfig[] = [
  { id: 'T1', label: 'Ngưỡng gợi ý tiết kiệm', description: 'Gửi gợi ý khi chi tiêu vượt X% ngân sách tháng', value: 85, unit: '%', min: 50, max: 100, defaultValue: 80, highlight: 'Hiện tại: gợi ý tại 85%' },
  { id: 'T2', label: 'Ngưỡng cảnh báo vượt mức', description: 'Gửi cảnh báo đỏ khi chi tiêu >X% ngân sách', value: 95, unit: '%', min: 70, max: 120, defaultValue: 100, highlight: 'Cảnh báo màu đỏ tại 95%' },
  { id: 'T3', label: 'Ngưỡng phân loại tự tin', description: 'Chỉ áp dụng auto-tag khi AI tự tin >X%', value: 75, unit: '%', min: 50, max: 100, defaultValue: 70, highlight: 'Giao dịch <75% sẽ cần xác nhận' },
  { id: 'T4', label: 'Min sample để Retrain', description: 'Chỉ kích hoạt light retrain khi có đủ dữ liệu mới', value: 500, unit: 'giao dịch', min: 100, max: 2000, defaultValue: 500, highlight: 'Hiện tại cần 500 records mới' },
];

export default function FormUuTien() {
  const [priorities, setPriorities] = useState<PriorityItem[]>(mockPriorities);
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>(thresholdConfigs);
  const [search, setSearch] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainDone, setRetrainDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'weights' | 'thresholds'>('weights');

  const updateWeight = (id: string, newWeight: number) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, weight: newWeight } : p));
  };

  const updateThreshold = (id: string, val: number) => {
    setThresholds(prev => prev.map(t => t.id === id ? { ...t, value: val } : t));
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainDone(false);
    setTimeout(() => {
      setIsRetraining(false);
      setRetrainDone(true);
    }, 2500);
  };

  const filtered = priorities.filter(p => p.keyword.toLowerCase().includes(search.toLowerCase()));

  // Simulated Scoring Algorithm: "GrabFood" example
  const grabScore = (priorities.find(p => p.keyword === 'Grab')?.weight ?? 0) * 0.5;
  const foodScore = (priorities.find(p => p.keyword === 'Food')?.weight ?? 0) * 0.5;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Algorithm Demo Box */}
      <div className="bg-zinc-950 text-white p-10 rounded-[3.5rem] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-5 w-5 text-amber-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Weighting Scoring Algorithm</p>
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Ví dụ thực tế: "Thanh toán GrabFood"</h3>
            <p className="text-sm font-medium opacity-60 leading-relaxed italic">
              AI phát hiện 2 từ khóa khớp. Backend cộng dồn trọng số cho mỗi danh mục. Danh mục có <strong className="opacity-100 text-amber-400">tổng weight cao nhất</strong> sẽ được chọn.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Kết quả tính điểm (Live Preview):</div>
            {[
              { keyword: 'Grab', category: 'Di chuyển', color: '#3b82f6', score: grabScore, weight: priorities.find(p => p.keyword === 'Grab')?.weight ?? 0 },
              { keyword: 'Food', category: 'Ăn uống', color: '#f59e0b', score: foodScore, weight: priorities.find(p => p.keyword === 'Food')?.weight ?? 0 },
            ].map((k, i) => {
              const winner = foodScore >= grabScore;
              const isWinner = (i === 0 && !winner) || (i === 1 && winner);
              return (
                <div key={i} className={`p-4 rounded-2xl border-2 ${isWinner ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm" style={{ color: k.color }}>"{k.keyword}"</span>
                      <ChevronRight className="h-4 w-4 opacity-40" />
                      <span className="text-[10px] font-black uppercase opacity-70">{k.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">Score: <span style={{ color: k.color }}>{k.score.toFixed(1)}</span></p>
                      <p className="text-[9px] opacity-40">weight × 0.5</p>
                    </div>
                  </div>
                  {isWinner && (
                    <div className="mt-2 text-[9px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Check className="h-3 w-3" /> AI sẽ gán vào: {k.category}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute top-0 right-0 p-16 opacity-[0.04] pointer-events-none"><Layers className="h-40 w-40" /></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-[2rem] w-fit">
        {[
          { key: 'weights', label: 'Trọng số từ khóa', icon: SlidersHorizontal },
          { key: 'thresholds', label: 'Ngưỡng cảnh báo', icon: AlertTriangle },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.key ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-600'
            }`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'weights' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Priority Tuner Table */}
          <div className="xl:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3.5rem] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
                <input type="text" placeholder="Tìm từ khóa..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 text-sm font-medium" />
              </div>
              <button className="flex items-center gap-2 px-6 py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20">
                <Plus className="h-4 w-4" /> Thêm
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-50 dark:border-zinc-800">
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Từ khóa → Danh mục</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Trọng số (Weight)</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 group-hover:scale-110 transition-transform">
                            <Type className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">{item.keyword}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.categoryColor }} />
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-70">{item.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 min-w-[280px]">
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black">
                            <span className="text-zinc-400 uppercase tracking-widest italic">Influence</span>
                            <span className={`font-black ${item.weight >= 90 ? 'text-emerald-500' : item.weight >= 70 ? 'text-amber-500' : 'text-zinc-400'}`}>{item.weight}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={item.weight}
                            onChange={e => updateWeight(item.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                          <div className="flex justify-between text-[8px] text-zinc-300 uppercase">
                            <span>Low</span><span>Medium</span><span>High</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 className="h-4 w-4" /></button>
                          <button className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-10 py-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60">Lưu vào Redis · Hiệu lực ngay · Không cần restart server</p>
              </div>
              <button className="text-[9px] font-black text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-widest flex items-center gap-2 italic">
                Khôi phục mặc định <Settings2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar: Retrain + Category Scores */}
          <div className="space-y-6">
            {/* Retrain Button */}
            <div className="bg-amber-500 p-8 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <RefreshCw className={`h-8 w-8 ${isRetraining ? 'animate-spin' : ''}`} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-3">Retrain AI Model</h3>
                <p className="text-sm font-medium opacity-70 italic leading-relaxed mb-8">
                  Quét lại dữ liệu mới nhất và cập nhật bộ nhớ phân loại (Light-weight Retrain). Không làm gián đoạn hệ thống.
                </p>
                <button onClick={handleRetrain} disabled={isRetraining}
                  className="w-full py-5 bg-white text-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-3">
                  {isRetraining ? (
                    <><RefreshCw className="h-5 w-5 animate-spin" /> Đang huấn luyện...</>
                  ) : retrainDone ? (
                    <><Check className="h-5 w-5 text-emerald-600" /> Hoàn thành!</>
                  ) : (
                    <><Zap className="h-5 w-5 fill-amber-500" /> Bắt đầu Retrain</>
                  )}
                </button>
                {retrainDone && (
                  <p className="text-[9px] text-white/70 uppercase tracking-widest text-center mt-3 italic animate-in fade-in">
                    ✓ Model đã được cập nhật lúc vừa xong
                  </p>
                )}
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
            </div>

            {/* Top Weighted Categories */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60">Top Weighted Categories</h4>
                <BarChart2 className="h-4 w-4 text-zinc-300" />
              </div>
              <div className="space-y-5">
                {priorities.sort((a, b) => b.weight - a.weight).slice(0, 5).map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.categoryColor }} />
                        <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-tight">{p.keyword}</span>
                        <span className="text-[9px] text-zinc-400 opacity-60">({p.category})</span>
                      </div>
                      <span className="text-[10px] font-black text-zinc-500">{p.weight}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.weight}%`, backgroundColor: p.categoryColor + 'cc' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'thresholds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thresholds.map((t) => (
            <div key={t.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none mb-2">{t.label}</h4>
                  <p className="text-xs font-bold text-zinc-400 italic leading-relaxed opacity-70">{t.description}</p>
                </div>
                <div className="shrink-0 ml-4 text-right">
                  <p className="text-3xl font-black text-amber-500 leading-none">{t.value}</p>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold mt-1">{t.unit}</p>
                </div>
              </div>
              
              <div className="space-y-3 my-6">
                <div className="flex justify-between text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>{t.min}{t.unit === '%' ? '%' : ''}</span>
                  <span className="text-indigo-400 italic">{t.highlight}</span>
                  <span>{t.max}{t.unit === '%' ? '%' : ''}</span>
                </div>
                <input type="range" min={t.min} max={t.max} value={t.value}
                  onChange={e => updateThreshold(t.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-200 italic opacity-70">
                  Lưu vào <strong>SystemConfigs / Redis</strong> · Hiệu lực ngay · Không restart server
                </p>
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div className="md:col-span-2">
            <button className="w-full py-6 bg-zinc-950 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.01] transition-all shadow-2xl flex items-center justify-center gap-4">
              <Database className="h-5 w-5" />
              Lưu toàn bộ ngưỡng vào SystemConfigs
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
