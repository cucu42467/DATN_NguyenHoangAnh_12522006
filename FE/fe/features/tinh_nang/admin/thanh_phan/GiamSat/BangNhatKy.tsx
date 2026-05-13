"use client";

import React, { useState, useEffect } from 'react';
import {
  User, Clock, Shield, Edit, Trash2, Plus, RefreshCw,
  ArrowRight, Search, Filter, Eye, X, ChevronRight,
  Lock, Download, AlertTriangle, Database
} from 'lucide-react';
import { layDanhSachNhatKyQt } from '@/services/qt';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'Admin' | 'User' | 'System';
  action: string;
  target: string;
  type: 'create' | 'update' | 'delete' | 'security';
  details: string;
  before?: string;
  after?: string;
}

const TYPE_FILTER = [
  { key: 'all', label: 'Tất cả' },
  { key: 'delete', label: 'Xóa', color: 'text-rose-500' },
  { key: 'security', label: 'Bảo mật', color: 'text-indigo-500' },
  { key: 'update', label: 'Sửa đổi', color: 'text-amber-500' },
  { key: 'create', label: 'Tạo mới', color: 'text-emerald-500' },
];

const mapApiToAuditLog = (item: any): AuditLog => ({
  id: item.id?.toString() || '',
  timestamp: item.thoiGian ? new Date(item.thoiGian).toLocaleString('vi-VN') : '',
  actor: item.tenNguoiDung || item.hoTen || 'System',
  actorRole: item.vaiTro?.includes('ADMIN') ? 'Admin' : 'User',
  action: item.hanhDong || '',
  target: item.tenBang || '',
  type: (item.hanhDong?.toLowerCase()?.includes('delete') ? 'delete' :
    item.hanhDong?.toLowerCase()?.includes('security') ? 'security' :
      item.hanhDong?.toLowerCase()?.includes('update') ? 'update' : 'create') as AuditLog['type'],
  details: item.moTa || item.hanhDong || '',
});

export default function BangNhatKy() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [diffLog, setDiffLog] = useState<AuditLog | null>(null);

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);
        const data = await layDanhSachNhatKyQt();
        setLogs(Array.isArray(data) ? data.map(mapApiToAuditLog) : []);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải nhật ký');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = loading || error ? [] : logs.filter(log =>
    (log.actor.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === 'all' || log.type === typeFilter)
  );

  const typeStyle = (type: string) => ({
    create: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 border-emerald-100',
    delete: 'bg-rose-50 dark:bg-rose-950/30 text-rose-500 border-rose-100',
    security: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 border-indigo-100',
    update: 'bg-amber-50 dark:bg-amber-950/30 text-amber-500 border-amber-100',
  }[type] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200');

  const typeIcon = (type: string) => ({
    create: <Plus className="h-5 w-5" />,
    delete: <Trash2 className="h-5 w-5" />,
    security: <Shield className="h-5 w-5" />,
    update: <RefreshCw className="h-5 w-5" />,
  }[type] ?? <Clock className="h-5 w-5" />);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">

      {/* ReadOnly Warning Banner */}
      <div className="flex items-center gap-6 p-6 bg-zinc-950 text-white rounded-[2rem]">
        <div className="p-3 bg-white/10 rounded-2xl shrink-0"><Lock className="h-5 w-5" /></div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Chế độ ReadOnly</p>
          <p className="text-xs font-bold opacity-80 italic">Dữ liệu nhật ký <strong>không thể sửa hoặc xóa</strong> — kể cả Admin. Mọi log được ghi bất đồng bộ (Async Logging) để không ảnh hưởng hiệu năng hệ thống.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition shrink-0">
          <Download className="h-4 w-4" /> Xuất CSV
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm theo actor, hành động..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all text-sm font-medium"
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 flex-wrap items-center">
          {TYPE_FILTER.map(f => (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${typeFilter === f.key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xl'
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 dark:border-zinc-800">
                <th className="px-10 py-8 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Thời gian / Actor</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Loại hành động</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Đối tượng</th>
                <th className="px-10 py-8 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Mô tả</th>
                <th className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {filtered.map((log) => (
                <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl flex items-center justify-center border ${typeStyle(log.type)}`}>
                        {typeIcon(log.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">{log.actor}</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${log.actorRole === 'Admin' ? 'bg-amber-50 text-amber-600' :
                              log.actorRole === 'System' ? 'bg-indigo-50 text-indigo-500' :
                                'bg-zinc-100 text-zinc-500'
                            }`}>{log.actorRole}</span>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-400 italic flex items-center gap-1.5 uppercase tracking-widest">
                          <Clock className="h-3 w-3" /> {log.timestamp}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border ${typeStyle(log.type)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter italic opacity-70">{log.target}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed border-l-4 border-zinc-100 dark:border-zinc-700 pl-4 italic max-w-xs">
                      {log.details}
                    </p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {(log.before || log.after) ? (
                      <button
                        onClick={() => setDiffLog(log)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Eye className="h-4 w-4" /> Diff
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-zinc-300 uppercase italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-10 py-8 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-400" /> {filtered.length} bản ghi • Async Logging đang hoạt động
          </p>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2 italic">
            Xem lịch sử 30 ngày <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Diff View Modal */}
      {diffLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8" onClick={() => setDiffLog(null)}>
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3.5rem] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-12 py-10 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Diff View — ReadOnly</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">{diffLog.action}</h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-2 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {diffLog.timestamp} • {diffLog.actor}
                </p>
              </div>
              <button onClick={() => setDiffLog(null)} className="h-12 w-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
            <div className="p-12 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> Trước (Before)
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/40 rounded-2xl p-6">
                  <p className="font-mono text-xs text-rose-700 dark:text-rose-300 leading-relaxed whitespace-pre-wrap">
                    {diffLog.before ?? '(không có dữ liệu)'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Sau (After)
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-6">
                  <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed whitespace-pre-wrap">
                    {diffLog.after ?? '(không có dữ liệu)'}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-12 pb-10 text-center">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" /> Nhật ký này không thể chỉnh sửa hoặc xóa
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
