"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText, User, Calendar, CheckCircle2, AlertCircle, XSquare,
  ArrowRight, Database, Search, Download, ChevronDown, X,
  Clock, BarChart3, HardDrive, Zap, AlertTriangle
} from 'lucide-react';

type ImportStatus = 'Success' | 'Partial' | 'Failed';

interface ErrorDetail {
  line: number;
  column: string;
  value: string;
  reason: string;
}

interface ImportLog {
  id: string;
  filename: string;
  filesize: string;
  user: string;
  date: string;
  processTime: string;
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  status: ImportStatus;
  errors?: ErrorDetail[];
  queueJob?: boolean;
}

import { layDanhSachImport } from '@/services/qt/import';

export default function BangImport() {
  const [imports, setImports] = useState<ImportLog[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ImportStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await layDanhSachImport();
        setImports(data as any);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải log import');
      } finally {
        setLoading(false);
      }
    };
    fetchImports();
  }, []);

  const filtered = loading ? [] : imports.filter(item =>
    item.filename.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );

  const totalSuccess = imports.reduce((s, i) => s + i.successRecords, 0);
  const totalFailed = imports.reduce((s, i) => s + i.failedRecords, 0);
  const totalRecords = imports.reduce((s, i) => s + i.totalRecords, 0);

  const statusStyle = (status: ImportStatus) => ({
    Success: 'bg-emerald-50 text-emerald-500 border border-emerald-100',
    Partial: 'bg-amber-50 text-amber-500 border border-amber-100',
    Failed: 'bg-rose-50 text-rose-500 border border-rose-100',
  }[status]);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex gap-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return (
    <div className="p-20 text-center text-red-500">
      Lỗi: {error}
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng file đã tải', value: imports.length.toString(), icon: FileText, color: 'text-indigo-500' },
          { label: 'Records thành công', value: totalSuccess.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Records thất bại', value: totalFailed.toLocaleString(), icon: AlertCircle, color: 'text-rose-500' },
          { label: 'Tổng giao dịch đã nạp', value: (totalRecords).toLocaleString(), icon: Database, color: 'text-amber-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
            <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${stat.color} group-hover:rotate-12 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">{stat.label}</span>
              <p className="text-xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên file hoặc người dùng..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {(['all', 'Success', 'Partial', 'Failed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${statusFilter === s
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xl'
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                }`}
            >
              {s === 'all' ? 'Tất cả' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Import List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            {/* Row Header */}
            <div
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 gap-6 cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl border ${statusStyle(item.status)}`}>
                  {item.status === 'Success' ? <CheckCircle2 className="h-6 w-6" /> :
                    item.status === 'Partial' ? <AlertCircle className="h-6 w-6" /> :
                      <XSquare className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">{item.filename}</p>
                    {item.queueJob && (
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-indigo-100">
                        <Zap className="h-3 w-3" /> Queue Job
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
                    <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {item.user}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {item.date}</span>
                    <span className="flex items-center gap-1.5"><HardDrive className="h-3 w-3" /> {item.filesize}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Xử lý: {item.processTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                {/* Progress Bar */}
                <div className="hidden md:block">
                  <div className="flex items-center gap-3 text-[10px] font-black mb-2">
                    <span className="text-emerald-500">{item.successRecords} OK</span>
                    {item.failedRecords > 0 && <span className="text-rose-500">{item.failedRecords} Error</span>}
                    <span className="text-zinc-300">/ {item.totalRecords} total</span>
                  </div>
                  <div className="w-36 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(item.successRecords / item.totalRecords) * 100}%` }} />
                    <div className="bg-rose-500 h-full transition-all" style={{ width: `${(item.failedRecords / item.totalRecords) * 100}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-indigo-600 rounded-2xl transition-all" onClick={e => e.stopPropagation()}>
                    <Download className="h-4 w-4" />
                  </button>
                  <ChevronDown className={`h-5 w-5 text-zinc-300 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>

            {/* Error Detail Expandable */}
            {expandedId === item.id && item.errors && item.errors.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-8 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Báo cáo lỗi chi tiết — {item.errors.length} dòng bị lỗi</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-700">
                        <th className="pb-4 pr-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Dòng #</th>
                        <th className="pb-4 pr-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Cột lỗi</th>
                        <th className="pb-4 pr-6 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Giá trị gốc</th>
                        <th className="pb-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Lý do lỗi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {item.errors.map((err, i) => (
                        <tr key={i} className="hover:bg-white dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 pr-6">
                            <span className="font-mono font-black text-xs text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">#{err.line}</span>
                          </td>
                          <td className="py-4 pr-6">
                            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{err.column}</span>
                          </td>
                          <td className="py-4 pr-6">
                            <span className="font-mono text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg max-w-[200px] truncate block">
                              {err.value || '(rỗng)'}
                            </span>
                          </td>
                          <td className="py-4">
                            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 italic">{err.reason}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:scale-105 transition-transform mt-4 italic">
                  <Download className="h-4 w-4" /> Tải về file lỗi để Admin kiểm tra
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Queue Processing Note */}
      <div className="bg-zinc-950 text-white p-10 rounded-[3.5rem] flex items-center gap-8">
        <div className="p-5 bg-white/10 rounded-3xl shrink-0">
          <Zap className="h-8 w-8 text-indigo-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black uppercase italic tracking-tighter mb-3">Queue Background Job</h4>
          <p className="text-sm font-medium opacity-60 leading-relaxed italic">
            File CSV lớn hơn <strong>2MB hoặc 500 dòng</strong> sẽ tự động được đẩy vào Queue (Hangfire/.NET).
            Giao diện sẽ không bị treo — người dùng nhận thông báo email khi quá trình hoàn tất.
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Đang xử lý</p>
          <p className="text-3xl font-black italic tracking-tighter">2 <span className="text-sm opacity-40">jobs</span></p>
        </div>
      </div>
    </div>
  );
}
