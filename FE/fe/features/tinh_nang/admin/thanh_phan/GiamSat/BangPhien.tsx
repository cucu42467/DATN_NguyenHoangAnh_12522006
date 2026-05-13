"use client";

import React, { useState, useEffect } from 'react';
import { layDanhSachPhienQt, revokePhien } from '@/services/qt';
import {
  User, Smartphone, Globe, MapPin, Clock, ShieldX, RefreshCw,
  Search, Monitor, Activity, AlertTriangle, Wifi, WifiOff,
  ChevronRight, Crosshair, Radio
} from 'lucide-react';
import XacNhanHanhDong from '../Chung/XacNhanHanhDong';

type SessionStatus = 'Online' | 'Away' | 'Inactive';
type RiskLevel = 'high' | 'medium' | 'normal';

interface Session {
  id: string;
  user: string;
  email: string;
  device: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  status: SessionStatus;
  risk: RiskLevel;
  riskReason?: string;
  loginCount: number;
}

// Mock data removed - using API layDanhSachPhienQt()


const mapApiToSession = (item: any): Session => ({
  id: item.phienId || item.id || '',
  user: item.hoTen || item.userName || 'Unknown',
  email: item.email || '',
  device: item.device || item.userAgent || 'Unknown',
  os: item.os || 'Unknown',
  ip: item.ip || 'Unknown',
  location: item.location || 'Unknown',
  lastActive: item.lastActive || item.ngayHoatDongCuoi || 'Unknown',
  status: (item.status || 'online') as SessionStatus,
  risk: (item.risk || 'normal') as RiskLevel,
  riskReason: item.riskReason || item.lyDoRuiRo || '',
  loginCount: item.loginCount || 1
});

export default function BangPhien() {
  const [sessions, setSessions] = useState<Session[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Session | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await layDanhSachPhienQt(riskFilter);
        setSessions(data.map(mapApiToSession));
      } catch (err: any) {
        setError(err.message || 'Lỗi tải phiên');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [riskFilter]);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm flex items-center gap-6">
            <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-8 rounded-[3rem] border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-full bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-12 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div className="p-20 text-center text-red-500">Lỗi: {error}</div>;

  const displayed = sessions.filter(s =>
    riskFilter === 'all' ? true : s.risk === riskFilter
  );

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    setIsRevoking(true);
    try {
      await revokePhien(revokeTarget.id);
      setSessions(prev => prev.filter(s => s.id !== revokeTarget.id));
    } catch (err) {
      console.error('Lỗi revoke phiên:', err);
    } finally {
      setIsRevoking(false);
      setRevokeTarget(null);
    }
  };

  const riskStyle = (risk: RiskLevel) => ({
    high: 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/10',
    medium: 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/10',
    normal: 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900',
  }[risk]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Real-time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Đang Online', value: sessions.filter(s => s.status === 'Online').length.toString(), icon: Radio, color: 'text-emerald-500', pulse: true },
          { label: 'Tổng phiên hoạt động', value: sessions.length.toString(), icon: Monitor, color: 'text-indigo-500', pulse: false },
          { label: 'Phiên rủi ro cao', value: sessions.filter(s => s.risk === 'high').length.toString(), icon: AlertTriangle, color: 'text-rose-500', pulse: true },
          { label: 'Brute-force', value: sessions.filter(s => s.risk === 'medium').length.toString(), icon: ShieldX, color: 'text-amber-500', pulse: false },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-50 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
            <div className={`relative p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${stat.color} group-hover:rotate-12 transition-transform`}>
              <stat.icon className="h-6 w-6" />
              {stat.pulse && <span className="absolute -top-1 -right-1 h-3 w-3 bg-current rounded-full animate-ping opacity-60" />}
            </div>
            <div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">{stat.label}</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Filter */}
      <div className="flex items-center gap-3">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] shrink-0">Lọc rủi ro:</p>
        {[
          { key: 'all', label: 'Tất cả phiên' },
          { key: 'high', label: '🔴 Rủi ro cao' },
          { key: 'medium', label: '🟡 Brute-force' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setRiskFilter(f.key as any)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${riskFilter === f.key
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-xl'
                : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-300'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Session Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayed.map((session, index) => (
          <div key={session.id || index} className={`p-8 rounded-[3rem] border-2 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all ${riskStyle(session.risk)}`}>
            {/* Risk Banner */}
            {session.risk !== 'normal' && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl mb-6 ${session.risk === 'high' ? 'bg-rose-100/80 dark:bg-rose-950/30 border border-rose-200' : 'bg-amber-100/80 dark:bg-amber-950/30 border border-amber-200'
                }`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${session.risk === 'high' ? 'text-rose-600' : 'text-amber-600'}`} />
                <p className={`text-[10px] font-black leading-relaxed italic ${session.risk === 'high' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {session.riskReason}
                </p>
              </div>
            )}

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                    {session.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic leading-none">{session.user}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5">{session.email}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${session.status === 'Online' ? 'bg-emerald-50 text-emerald-500' :
                    session.status === 'Away' ? 'bg-amber-50 text-amber-500' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${session.status === 'Online' ? 'bg-emerald-500 animate-pulse' :
                      session.status === 'Away' ? 'bg-amber-500' : 'bg-zinc-400'
                    }`} />
                  {session.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Smartphone, text: `${session.device} • ${session.os}` },
                  { icon: Globe, text: session.ip },
                  { icon: MapPin, text: session.location },
                  { icon: Clock, text: session.lastActive },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-500 dark:text-zinc-400 italic">
                    <row.icon className="h-4 w-4 opacity-40 text-indigo-500 shrink-0" />
                    <span className="truncate">{row.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setRevokeTarget(session)}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${session.risk === 'high'
                      ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700'
                      : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm'
                    }`}
                >
                  <ShieldX className="h-4 w-4" /> Kill Session
                </button>
                <button className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]">
              <Crosshair className="h-32 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <XacNhanHanhDong
        isOpen={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={confirmRevoke}
        type={revokeTarget?.risk === 'high' ? 'danger' : 'warning'}
        title="Kill Session & Revoke Token?"
        message={`Token của ${revokeTarget?.user} (IP: ${revokeTarget?.ip}) sẽ bị xóa khỏi Redis WhiteList ngay lập tức. Người dùng sẽ bị đăng xuất trên tất cả thiết bị.`}
        confirmLabel="Đồng ý Revoke"
        isLoading={isRevoking}
      />
    </div>
  );
}
