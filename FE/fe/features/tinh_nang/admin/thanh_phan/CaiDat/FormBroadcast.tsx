"use client";

import React, { useState } from 'react';
import { 
  Megaphone, Send, Eye, Users, ShieldAlert, Info, AlertTriangle,
  History, Clock, CheckCircle2, BellRing, Calendar, X, Check,
  Zap, BarChart2, Radio, Edit3, Trash2
} from 'lucide-react';

type Urgency = 'info' | 'warning' | 'critical' | 'maintenance' | 'feature';
type SendMode = 'instant' | 'scheduled';

interface SentNotification {
  id: string;
  title: string;
  type: Urgency;
  target: string;
  sentAt: string;
  readCount: number;
  totalTarget: number;
}

const mockHistory: SentNotification[] = [
  { id: 'N1', title: 'Hệ thống bảo trì v2.4 — 04:00 sáng 10/04', type: 'maintenance', target: 'Tất cả', sentAt: '2h trước', readCount: 8420, totalTarget: 12840 },
  { id: 'N2', title: 'Tính năng mới: Dự đoán chi tiêu AI v2', type: 'feature', target: 'Tất cả', sentAt: 'Hôm qua', readCount: 11200, totalTarget: 12840 },
  { id: 'N3', title: 'Tool mới cho Admin Panel', type: 'info', target: 'Admin only', sentAt: '3 ngày trước', readCount: 12, totalTarget: 15 },
  { id: 'N4', title: 'Cảnh báo: Tỷ giá USD biến động mạnh', type: 'warning', target: 'Tất cả', sentAt: '1 tuần trước', readCount: 9800, totalTarget: 12840 },
];

const TYPE_CONFIG: Record<Urgency, { label: string; icon: React.ElementType; border: string; bg: string; textColor: string; previewBg: string; previewBorder: string }> = {
  info:        { label: 'Thông tin',  icon: Info,        border: 'border-blue-500',   bg: 'bg-blue-600',   textColor: 'text-blue-900', previewBg: 'bg-blue-50',   previewBorder: 'border-l-blue-500' },
  warning:     { label: 'Cảnh báo',  icon: AlertTriangle,border: 'border-amber-500',  bg: 'bg-amber-500',  textColor: 'text-amber-900',previewBg: 'bg-amber-50',  previewBorder: 'border-l-amber-500' },
  critical:    { label: 'Khẩn cấp',  icon: ShieldAlert,  border: 'border-rose-500',   bg: 'bg-rose-600',   textColor: 'text-rose-900', previewBg: 'bg-rose-50',   previewBorder: 'border-l-rose-500' },
  maintenance: { label: 'Bảo trì',   icon: Zap,          border: 'border-indigo-500', bg: 'bg-indigo-600', textColor: 'text-indigo-900',previewBg:'bg-indigo-50', previewBorder:'border-l-indigo-500'},
  feature:     { label: 'Tính năng', icon: CheckCircle2, border: 'border-emerald-500',bg: 'bg-emerald-600',textColor:'text-emerald-900',previewBg:'bg-emerald-50',previewBorder:'border-l-emerald-500'},
};

export default function FormBroadcast() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('info');
  const [target, setTarget] = useState('all');
  const [sendMode, setSendMode] = useState<SendMode>('instant');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    setIsSending(true);
    setTimeout(() => { setIsSending(false); setSent(true); setTimeout(() => setSent(false), 3000); }, 1500);
  };

  const cfg = TYPE_CONFIG[urgency];

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* SignalR Note Banner */}
      <div className="flex items-center gap-6 p-6 bg-indigo-950 text-white rounded-[2rem]">
        <div className="p-3 bg-white/10 rounded-2xl shrink-0"><Radio className="h-5 w-5 text-indigo-400 animate-pulse" /></div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1">SignalR Real-time Push</p>
          <p className="text-xs font-bold opacity-60 italic">Thông báo được đẩy ngay lập tức đến trình duyệt người dùng qua WebSocket — không cần reload trang. Lưu vào bảng <code className="bg-white/10 px-2 py-0.5 rounded font-mono">GlobalNotifications</code> với cột <code className="bg-white/10 px-2 py-0.5 rounded font-mono">IsRead</code> cho từng user.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Editor (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-600/20">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Soạn thông báo hệ thống</h3>
                <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest opacity-60 mt-1 italic">Broadcast đến {target === 'all' ? '12,840' : target === 'premium' ? '~3,200' : '15'} người dùng</p>
              </div>
            </div>

            {/* Type Selector */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Loại thông báo</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {(Object.entries(TYPE_CONFIG) as [Urgency, typeof cfg][]).map(([key, v]) => (
                  <button key={key} onClick={() => setUrgency(key)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all text-[9px] font-black uppercase tracking-widest ${
                      urgency === key ? `border-zinc-800 ${v.bg} text-white` : 'border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-800'
                    }`}>
                    <v.icon className="h-4 w-4" /> {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Tiêu đề</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: Hệ thống bảo trì từ 2h00 đến 4h00 sáng ngày 10/04/2024"
                className="w-full px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
            </div>

            {/* Body */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Nội dung chi tiết</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Chi tiết thông báo..."
                rows={5}
                className="w-full p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium leading-relaxed italic resize-none" />
            </div>

            {/* Target + Schedule + Send */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Đối tượng nhận</label>
                <select value={target} onChange={e => setTarget(e.target.value)}
                  className="w-full p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
                  <option value="all">Tất cả người dùng (12,840)</option>
                  <option value="premium">Người dùng Premium (~3,200)</option>
                  <option value="admin">Chỉ Admin (15)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Thời điểm gửi</label>
                <div className="flex gap-2">
                  {[['instant', 'Ngay bây giờ'], ['scheduled', 'Lập lịch']].map(([m, l]) => (
                    <button key={m} onClick={() => setSendMode(m as SendMode)}
                      className={`flex-1 py-3 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${sendMode === m ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sendMode === 'scheduled' && (
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic flex items-center gap-2"><Calendar className="h-4 w-4" /> Chọn khung giờ vàng</label>
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
              </div>
            )}

            <button onClick={handleSend} disabled={isSending || !title.trim() || !message.trim()}
              className={`w-full py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 ${
                sent ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 shadow-indigo-600/20'
              }`}>
              {isSending ? <><Radio className="h-5 w-5 animate-pulse" /> Đang gửi qua SignalR...</>
               : sent ? <><Check className="h-5 w-5" /> Đã phát sóng thành công!</>
               : <><Send className="h-5 w-5" /> {sendMode === 'instant' ? 'Phát sóng ngay' : 'Lên lịch gửi'}</>}
            </button>
          </div>
        </div>

        {/* Preview + History (1/3) */}
        <div className="space-y-6">
          {/* Live Preview */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="h-4 w-4 text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Preview → Real UI</span>
            </div>
            <div className={`p-6 rounded-2xl border-l-[6px] ${cfg.previewBg} ${cfg.previewBorder}`}>
              <div className="flex gap-4">
                <cfg.icon className={`h-6 w-6 mt-1 flex-shrink-0 ${cfg.textColor}`} />
                <div>
                  <h4 className={`text-xs font-black uppercase italic tracking-tighter mb-2 ${cfg.textColor}`}>
                    {title || 'Tiêu đề thông báo'}
                  </h4>
                  <p className={`text-[11px] font-medium leading-relaxed italic ${cfg.textColor} opacity-80`}>
                    {message || 'Nội dung thông báo...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sent History */}
          <div className="bg-zinc-50 dark:bg-zinc-800/20 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 space-y-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic flex items-center gap-2">
              <History className="h-4 w-4" /> Lịch sử thông báo
            </h4>
            {mockHistory.map(h => {
              const hcfg = TYPE_CONFIG[h.type];
              const readPct = Math.round((h.readCount / h.totalTarget) * 100);
              return (
                <div key={h.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-zinc-700 dark:text-zinc-300 uppercase italic tracking-tighter leading-tight truncate">{h.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500`}>{hcfg.label}</span>
                        <span className="text-[8px] text-zinc-400 font-bold italic flex items-center gap-1"><Clock className="h-2.5 w-2.5"/> {h.sentAt}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-zinc-900 dark:text-white">{readPct}%</p>
                      <p className="text-[8px] text-zinc-400 uppercase">Đã đọc</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${readPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
