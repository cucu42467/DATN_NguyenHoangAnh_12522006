"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles, CheckCircle2, XCircle, Edit3, Trash2, MessageSquare,
  BarChart2, Search, Plus, ThumbsUp, ThumbsDown, FlaskConical,
  Star, Send, Eye, X, Check, ChevronRight, Filter, RefreshCw, Loader2
} from 'lucide-react';

import { layDanhSachGoiYAdmin, duyetGoiYAdmin, tuChoiGoiYAdmin, xoaGoiYAdmin, layThongKeAIAdmin } from '@/services/ai';

type RecommendationStatus = 'Approved' | 'Pending' | 'Rejected';
type RecommendationType = 'warning' | 'saving' | 'investment' | 'insight';

interface Recommendation {
  id: string;
  text: string;
  textB?: string;
  segment: string;
  type: RecommendationType;
  likes: number;
  dislikes: number;
  views: number;
  ctr: string;
  status: RecommendationStatus;
  date: string;
  abTesting: boolean;
}

const TYPE_CONFIG: Record<RecommendationType, { label: string; color: string; bg: string }> = {
  warning: { label: 'Cảnh báo', color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  saving: { label: 'Tiết kiệm', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  investment: { label: 'Đầu tư', color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  insight: { label: 'Insight', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
};

export default function BangGoiY() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RecommendationStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | RecommendationType>('all');
  const [abViewId, setAbViewId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await layDanhSachGoiYAdmin();

      const mapped: Recommendation[] = data.map((item: any) => ({
        id: item.id?.toString() || item.loiKhuyenId?.toString(),
        text: (item.tieuDe || '') + '\n' + (item.noiDung || ''),
        segment: item.nhomMucTieu || 'Toàn hệ thống',
        type: (item.loai === 'CANH_BAO'
          ? 'warning'
          : item.loai === 'GOI_Y'
            ? 'saving'
            : item.loai === 'KHICH_LE'
              ? 'investment'
              : 'insight') as RecommendationType,
        likes: item.luotThich || 0,
        dislikes: item.luotKhongThich || 0,
        views: item.luotXem || 0,
        ctr: item.ctr || '0%',
        status: (item.trangThai === 'DA_DUYET'
          ? 'Approved'
          : item.trangThai === 'CHO_DUYET'
            ? 'Pending'
            : item.trangThai === 'TU_CHOI'
              ? 'Rejected'
              : 'Pending') as RecommendationStatus,
        date: item.ngayTao || new Date().toISOString().split('T')[0],
        abTesting: item.abTesting || false,
        textB: item.noiDungB || undefined,
      }));

      setRecs(mapped);
    } catch (error) {
      console.error('Lỗi tải gợi ý:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API thật
  const handleDuyet = async (id: string) => {
    try {
      await duyetGoiYAdmin(Number(id));
      setRecs(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Approved' as RecommendationStatus } : r
        )
      );
    } catch (error) {
      console.error('Lỗi duyệt:', error);
    }
  };

  const handleTuChoi = async (id: string) => {
    try {
      await tuChoiGoiYAdmin(Number(id));
      setRecs(prev =>
        prev.map(r =>
          r.id === id ? { ...r, status: 'Rejected' as RecommendationStatus } : r
        )
      );
    } catch (error) {
      console.error('Lỗi từ chối:', error);
    }
  };

  const handleXoa = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa gợi ý này?')) return;
    try {
      await xoaGoiYAdmin(Number(id));
      setRecs(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Lỗi xóa:', error);
    }
  };

  const displayed = recs.filter(r =>
    r.text.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || r.status === statusFilter) &&
    (typeFilter === 'all' || r.type === typeFilter)
  );

  const statusStyle = (s: RecommendationStatus) => ({
    Approved: 'bg-emerald-50 text-emerald-500 border border-emerald-200',
    Pending: 'bg-amber-50 text-amber-500 border border-amber-200',
    Rejected: 'bg-rose-50 text-rose-500 border border-rose-200',
  }[s]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6">
              <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng gợi ý', value: recs.length, icon: Sparkles, color: 'text-indigo-500' },
          { label: 'Đã duyệt', value: recs.filter(r => r.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Chờ duyệt', value: recs.filter(r => r.status === 'Pending').length, icon: Loader2, color: 'text-amber-500' },
          { label: 'Từ chối', value: recs.filter(r => r.status === 'Rejected').length, icon: XCircle, color: 'text-rose-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
            <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${stat.color} group-hover:rotate-12 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">{stat.label}</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm kiếm gợi ý..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium text-sm focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Từ chối</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-medium text-sm focus:outline-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="warning">Cảnh báo</option>
            <option value="saving">Tiết kiệm</option>
            <option value="investment">Đầu tư</option>
            <option value="insight">Insight</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-20 text-center">
            <Sparkles className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">Không có gợi ý nào phù hợp</p>
          </div>
        ) : displayed.map((rec) => (
          <div key={rec.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-lg transition-all">
            <div className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-2xl border ${TYPE_CONFIG[rec.type].bg}`}>
                    <Sparkles className={`h-6 w-6 ${TYPE_CONFIG[rec.type].color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${TYPE_CONFIG[rec.type].bg} ${TYPE_CONFIG[rec.type].color}`}>
                        {TYPE_CONFIG[rec.type].label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle(rec.status)}`}>
                        {rec.status === 'Approved' ? 'Đã duyệt' : rec.status === 'Pending' ? 'Chờ duyệt' : 'Từ chối'}
                      </span>
                      {rec.abTesting && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600 border border-purple-200">
                          A/B Test
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-900 dark:text-white font-medium mb-2 whitespace-pre-line">{rec.text}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {rec.likes}</span>
                      <span className="flex items-center gap-1"><ThumbsDown className="h-3 w-3" /> {rec.dislikes}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {rec.views}</span>
                      <span className="flex items-center gap-1"><BarChart2 className="h-3 w-3" /> CTR: {rec.ctr}</span>
                    </div>
                  </div>
                </div>

                {rec.status === 'Pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDuyet(rec.id)}
                      className="p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Duyệt"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleTuChoi(rec.id)}
                      className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Từ chối"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleXoa(rec.id)}
                  className="p-3 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0"
                  title="Xóa"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between text-xs text-zinc-400">
              <span>Phân khúc: {rec.segment}</span>
              <span>{rec.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
