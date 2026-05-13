"use client";

import React, { useState } from 'react';
import {
  Zap, Trash2, Plus, Search, Tag, Settings,
  Target, Bot, Globe, User, AlertCircle,
  ChevronDown, ArrowRight, BookOpen, Filter
} from 'lucide-react';

type KeywordScope = 'global' | 'local';

interface KeywordMapping {
  id: string;
  keyword: string;
  category: string;
  categoryColor: string;
  confidence: number;
  priority: number;
  scope: KeywordScope;
  matchType: 'contains' | 'regex' | 'exact';
  lastUsed: string;
}

const mockMappings: KeywordMapping[] = [
  { id: '1', keyword: 'GrabFood', category: 'Ăn uống', categoryColor: '#f59e0b', confidence: 0.98, priority: 1, scope: 'global', matchType: 'contains', lastUsed: '2024-04-07' },
  { id: '2', keyword: 'ShopeePay', category: 'Mua sắm', categoryColor: '#6366f1', confidence: 0.85, priority: 2, scope: 'global', matchType: 'contains', lastUsed: '2024-04-06' },
  { id: '3', keyword: 'beFood', category: 'Ăn uống', categoryColor: '#f59e0b', confidence: 0.95, priority: 1, scope: 'global', matchType: 'contains', lastUsed: '2024-04-05' },
  { id: '4', keyword: 'Petrolimex', category: 'Di chuyển', categoryColor: '#3b82f6', confidence: 0.99, priority: 1, scope: 'global', matchType: 'exact', lastUsed: '2024-04-05' },
  { id: '5', keyword: 'Netflix', category: 'Giải trí', categoryColor: '#ec4899', confidence: 0.92, priority: 3, scope: 'global', matchType: 'contains', lastUsed: '2024-04-02' },
  { id: '6', keyword: 'Tiền bà hàng xóm', category: 'Cho vay', categoryColor: '#10b981', confidence: 0.60, priority: 5, scope: 'local', matchType: 'exact', lastUsed: '2024-03-30' },
];

const unknownTransactions = [
  { id: 'u1', content: 'TT LIXI THANG 04 VIB', amount: '300,000₫', date: '2024-04-07' },
  { id: 'u2', content: 'CHUYENKHOAN BANHANGONLINE THUAN', amount: '1,200,000₫', date: '2024-04-06' },
  { id: 'u3', content: 'NAPTIEN GAME GOSU', amount: '200,000₫', date: '2024-04-05' },
];

export default function FormTuKhoaAI() {
  const [mappings, setMappings] = useState<KeywordMapping[]>(mockMappings);
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'global' | 'local'>('all');
  const [activeTab, setActiveTab] = useState<'keywords' | 'unknown'>('keywords');

  const filtered = mappings.filter(m =>
    m.keyword.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (scopeFilter === 'all' || m.scope === scopeFilter)
  );

  const handlePriorityChange = (id: string, delta: number) => {
    setMappings(prev => prev.map(m =>
      m.id === id ? { ...m, priority: Math.max(1, Math.min(10, m.priority + delta)) } : m
    ));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-[#f4f4f4] p-2 rounded-full w-fit">
        {[
          { key: 'keywords', label: 'Bộ từ khóa', icon: Tag },
          { key: 'unknown', label: `Cần phân loại (${unknownTransactions.length})`, icon: AlertCircle },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all
              ${activeTab === tab.key
                ? 'bg-white text-[#191c1f]'
                : 'text-[#8d969e] hover:text-[#191c1f]'}
            `}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'keywords' && (
        <>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8d969e] group-focus-within:text-[#494fdf] transition-colors" />
              <input
                type="text"
                placeholder="Tìm từ khóa huấn luyện (VD: Grab, Netflix...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-3 rounded-full border border-[#c9c9cd] bg-white focus:outline-none focus:border-[#494fdf] transition-all text-sm font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div className="flex gap-3 items-center">
              {/* Scope Filter */}
              <div className="flex gap-2 bg-[#f4f4f4] p-1.5 rounded-full border border-[#c9c9cd]">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'global', label: <><Globe className="h-3 w-3" /> Global</> },
                  { key: 'local', label: <><User className="h-3 w-3" /> Local</> },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setScopeFilter(f.key as any)}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[9px] font-medium uppercase tracking-wider transition-all
                      ${scopeFilter === f.key ? 'bg-white text-[#191c1f] shadow-sm' : 'text-[#8d969e]'}
                    `}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-3 px-10 py-3 bg-[#494fdf] text-white rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#3d42d1] transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Plus className="h-5 w-5" /> Thêm từ khóa
              </button>
            </div>
          </div>

          {/* Keyword Table */}
          <div className="bg-white border border-[#c9c9cd] rounded-[12px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c9c9cd]">
                    <th className="px-10 py-6 text-xs font-medium uppercase tracking-wider text-[#8d969e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Từ khóa / Phạm vi
                    </th>
                    <th className="px-10 py-6 text-xs font-medium uppercase tracking-wider text-[#8d969e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Danh mục đích
                    </th>
                    <th className="px-10 py-6 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-center"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Độ ưu tiên
                    </th>
                    <th className="px-10 py-6 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-center"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Độ chính xác
                    </th>
                    <th className="px-10 py-6 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-right"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c9c9cd]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="group hover:bg-[#f4f4f4] transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-[#f4f4f4] rounded-[12px] text-[#8d969e] group-hover:scale-105 transition-transform">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#191c1f] uppercase italic tracking-tight mb-2"
                              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                              {item.keyword}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider border ${
                                item.scope === 'global'
                                  ? 'bg-[#f4f4f4] border-[#c9c9cd] text-[#494fdf]'
                                  : 'bg-[#f4f4f4] border-[#c9c9cd] text-[#ec7e00]'
                              }`}
                                style={{ fontFamily: 'Inter, sans-serif' }}>
                                {item.scope === 'global' ? <Globe className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                                {item.scope === 'global' ? 'Global' : 'Local'}
                              </div>
                              <div className="px-3 py-1 bg-[#f4f4f4] rounded-full text-[9px] font-mono text-[#8d969e] uppercase tracking-wider border border-[#c9c9cd]"
                                style={{ fontFamily: 'Inter, sans-serif' }}>
                                {item.matchType}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-medium uppercase tracking-wider border-2"
                          style={{ backgroundColor: item.categoryColor + '15', borderColor: item.categoryColor + '40', color: item.categoryColor }}>
                          <Target className="h-3.5 w-3.5" /> {item.category}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handlePriorityChange(item.id, -1)}
                            className="h-7 w-7 rounded-full bg-[#f4f4f4] text-[#8d969e] hover:bg-[#f4f4f4] hover:text-[#e23b4a] font-medium text-lg flex items-center justify-center transition-all"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >−</button>
                          <div className="flex flex-col items-center min-w-[32px]">
                            <span className="text-lg font-medium text-[#191c1f] leading-none"
                              style={{ fontFamily: 'Inter, sans-serif' }}>{item.priority}</span>
                            <span className="text-[8px] text-[#8d969e] uppercase tracking-wider mt-0.5"
                              style={{ fontFamily: 'Inter, sans-serif' }}>RANK</span>
                          </div>
                          <button
                            onClick={() => handlePriorityChange(item.id, +1)}
                            className="h-7 w-7 rounded-full bg-[#f4f4f4] text-[#8d969e] hover:bg-[#f4f4f4] hover:text-[#00a87e] font-medium text-lg flex items-center justify-center transition-all"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >+</button>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`text-sm font-medium ${item.confidence > 0.9 ? 'text-[#00a87e]' : 'text-[#ec7e00]'}`}
                            style={{ fontFamily: 'Inter, sans-serif' }}>
                            {(item.confidence * 100).toFixed(0)}%
                          </span>
                          <div className="w-24 h-2 bg-[#f4f4f4] rounded-full overflow-hidden">
                            <div className={`h-full ${item.confidence > 0.9 ? 'bg-[#00a87e]' : 'bg-[#ec7e00]'} rounded-full transition-all`}
                              style={{ width: `${item.confidence * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-3 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#f4f4f4] rounded-full transition-all">
                            <Settings className="h-5 w-5" />
                          </button>
                          <button className="p-3 text-[#8d969e] hover:text-[#e23b4a] hover:bg-[#f4f4f4] rounded-full transition-all">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-10 py-6 bg-[#f4f4f4] flex justify-between items-center border-t border-[#c9c9cd]">
              <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider italic leading-none flex items-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Bot className="h-4 w-4 text-[#00a87e]" />
                AI đang học từ {filtered.length} quy tắc phân loại • 12,840 giao dịch/ngày
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#494fdf]" />
                  <span className="text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Global: {mappings.filter(m => m.scope === 'global').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#ec7e00]" />
                  <span className="text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Local: {mappings.filter(m => m.scope === 'local').length}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'unknown' && (
        <div className="space-y-8">
          {/* Unknown Transactions Feedback Loop */}
          <div className="bg-[#f4f4f4] border border-[#c9c9cd] rounded-[12px] p-10 flex items-center gap-8">
            <div className="p-5 bg-white rounded-full text-[#ec7e00] shrink-0">
              <AlertCircle className="h-10 w-10" />
            </div>
            <div>
              <h4 className="text-lg font-medium uppercase tracking-tight mb-1 leading-none text-[#191c1f] italic"
                style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                Feedback Loop: Giao dịch chưa phân loại
              </h4>
              <p className="text-sm font-medium text-[#505a63] leading-relaxed italic"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {unknownTransactions.length} giao dịch bên dưới không khớp bất kỳ từ khóa nào trong database. Hãy gán từ khóa mới để cải thiện độ chính xác của AI với các nội dung trên.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {unknownTransactions.map((tx) => (
              <div key={tx.id} className="bg-white border border-[#c9c9cd] rounded-[12px] p-6 group hover:border-[#494fdf] transition-all">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-[12px] bg-[#f4f4f4] border-2 border-[#c9c9cd] text-[#ec7e00] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-[#191c1f] uppercase italic tracking-tight leading-none mb-2"
                        style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                        {tx.content}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-medium text-[#8d969e] uppercase tracking-wider italic">
                        <span>{tx.date}</span>
                        <span className="text-[#e23b4a]">{tx.amount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <input
                      placeholder="Thêm từ khóa mới..."
                      className="px-6 py-3 rounded-full border border-[#c9c9cd] bg-[#f4f4f4] focus:outline-none focus:border-[#494fdf] text-xs font-medium w-52 transition-all"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <select className="px-5 py-3 rounded-full border border-[#c9c9cd] bg-white text-xs font-medium focus:outline-none focus:border-[#494fdf]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      <option>Ăn uống</option>
                      <option>Di chuyển</option>
                      <option>Giải trí</option>
                      <option>Mua sắm</option>
                    </select>
                    <button className="flex items-center gap-2 px-8 py-3 bg-[#494fdf] text-white rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#3d42d1] transition-all"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Zap className="h-4 w-4 fill-white" /> Gán
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
