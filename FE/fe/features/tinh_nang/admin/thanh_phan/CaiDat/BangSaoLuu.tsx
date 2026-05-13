"use client";

import React, { useState } from 'react';
import {
  Database, History, Download, RefreshCw, Trash2, ShieldCheck,
  Zap, Calendar, AlertTriangle, ArrowRight, Lock, Cloud,
  X, Check, Clock, HardDrive, ShieldAlert, Settings2
} from 'lucide-react';
import XacNhanHanhDong from '../Chung/XacNhanHanhDong';

interface Backup {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'Auto' | 'Manual';
  status: 'Healthy' | 'Corrupted' | 'In Progress';
  encrypted: boolean;
  cloud: 'AWS S3' | 'Google Drive' | 'OneDrive' | 'Local';
}

const mockBackups: Backup[] = [
  { id: 'B1', name: 'finance_db_snapshot_20240407.bak', size: '124.5 MB', date: '2024-04-07 02:00', type: 'Auto', status: 'Healthy', encrypted: true, cloud: 'AWS S3' },
  { id: 'B2', name: 'manual_backup_before_v2update.sql', size: '122.8 MB', date: '2024-04-06 22:15', type: 'Manual', status: 'Healthy', encrypted: true, cloud: 'Google Drive' },
  { id: 'B3', name: 'finance_db_snapshot_20240406.bak', size: '120.2 MB', date: '2024-04-06 02:00', type: 'Auto', status: 'Healthy', encrypted: true, cloud: 'AWS S3' },
  { id: 'B4', name: 'finance_db_snapshot_20240405.bak', size: '118.9 MB', date: '2024-04-05 02:00', type: 'Auto', status: 'Corrupted', encrypted: false, cloud: 'AWS S3' },
  { id: 'B5', name: 'onedrive_weekly_20240401.bak', size: '115.1 MB', date: '2024-04-01 02:00', type: 'Auto', status: 'Healthy', encrypted: true, cloud: 'OneDrive' },
];

type AutoSchedule = { frequency: 'daily' | 'weekly'; time: string; cloud: Backup['cloud'] };

export default function BangSaoLuu() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups);
  const [restoreTarget, setRestoreTarget] = useState<Backup | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupDone, setBackupDone] = useState(false);
  const [schedule, setSchedule] = useState<AutoSchedule>({ frequency: 'daily', time: '02:00', cloud: 'AWS S3' });
  const [savingSchedule, setSavingSchedule] = useState(false);

  const handleManualBackup = () => {
    setIsBackingUp(true); setBackupDone(false);
    setTimeout(() => { setIsBackingUp(false); setBackupDone(true); }, 2500);
  };

  const confirmRestore = () => {
    if (!restoreTarget) return;
    setIsRestoring(true);
    setTimeout(() => { setIsRestoring(false); setRestoreTarget(null); }, 2000);
  };

  const handleSaveSchedule = () => {
    setSavingSchedule(true);
    setTimeout(() => setSavingSchedule(false), 1200);
  };

  const cloudIcon = (c: Backup['cloud']) => ({ 'AWS S3': '🪣', 'Google Drive': '📁', 'OneDrive': '☁️', 'Local': '💾' }[c]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">

      {/* Disaster Recovery Banner */}
      <div className="flex items-center gap-6 p-8 bg-[#191c1f] text-white rounded-[24px]">
        <div className="p-4 bg-white/10 rounded-[12px] shrink-0"><ShieldCheck className="h-8 w-8 text-[#494fdf]" /></div>
        <div className="flex-1">
          <p className="text-[9px] font-medium uppercase tracking-wider mb-1.5 opacity-80">Disaster Recovery Strategy</p>
          <p className="text-sm font-medium leading-relaxed opacity-80"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            File backup được <strong className="opacity-100">mã hóa AES-256</strong> trước khi đẩy lên Cloud. Mọi lệnh Restore phải qua xác nhận 2 bước. Backend thực thi qua <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-[10px]">SQL BACKUP DATABASE</code>.
          </p>
        </div>
      </div>

      {/* Top Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manual + Status (2/3) */}
        <div className="lg:col-span-2 bg-[#191c1f] text-white p-10 rounded-[24px] relative overflow-hidden border border-[#c9c9cd]">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[20px] bg-white/10 flex items-center justify-center text-[#494fdf] border border-white/10">
                <Database className={`h-10 w-10 ${isBackingUp ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h3 className="text-2xl font-medium uppercase tracking-tight italic mb-2"
                  style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                  DB Snapshots
                </h3>
                <p className="text-sm font-medium opacity-80 italic leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tự động backup vào lúc <strong className="opacity-100">{schedule.time}</strong> · Push lên <strong className="opacity-100">{schedule.cloud}</strong>
                </p>
                {backupDone && (
                  <div className="flex items-center gap-2 text-[#00a87e] text-[10px] font-medium uppercase tracking-wider mt-3"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Check className="h-4 w-4" /> Backup hoàn thành vừa xong
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleManualBackup} disabled={isBackingUp}
              className="px-8 py-3 bg-[#494fdf] text-white rounded-full font-medium text-[10px] uppercase tracking-wider hover:bg-[#3d42d1] transition-all shrink-0 hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-60 disabled:scale-100"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {isBackingUp ? <><RefreshCw className="h-4 w-4 animate-spin" /> Đang tạo bản sao...</> : <><Zap className="h-4 w-4" /> Tạo bản sao ngay</>}
            </button>
          </div>
        </div>

        {/* Auto Schedule Config (1/3) */}
        <div className="bg-white border border-[#c9c9cd] p-8 rounded-[24px] space-y-6">
          <div className="flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-[#ec7e00]" />
            <h4 className="text-sm font-medium uppercase tracking-tight italic"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
              Lịch tự động
            </h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider"
                style={{ fontFamily: 'Inter, sans-serif' }}>Tần suất</label>
              <div className="flex gap-2">
                {(['daily', 'weekly'] as const).map(f => (
                  <button key={f} onClick={() => setSchedule(p => ({ ...p, frequency: f }))}
                    className={`flex-1 py-2.5 rounded-[12px] text-[9px] font-medium uppercase tracking-wider border transition-all ${schedule.frequency === f ? 'bg-[#191c1f] text-white border-[#191c1f]' : 'bg-white border-[#c9c9cd] text-[#8d969e]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {f === 'daily' ? '24h/lần' : 'Hàng tuần'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Clock className="h-3 w-3" /> Giờ thực thi
              </label>
              <input type="time" value={schedule.time} onChange={e => setSchedule(p => ({ ...p, time: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#c9c9cd] bg-white focus:outline-none focus:border-[#494fdf] transition-all text-sm font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Cloud className="h-3 w-3" /> Cloud đích
              </label>
              <select value={schedule.cloud} onChange={e => setSchedule(p => ({ ...p, cloud: e.target.value as any }))}
                className="w-full px-4 py-2.5 rounded-[12px] border border-[#c9c9cd] bg-white focus:outline-none text-sm font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <option value="AWS S3">🪣 AWS S3 Glacier</option>
                <option value="Google Drive">📁 Google Drive</option>
                <option value="OneDrive">☁️ OneDrive</option>
              </select>
            </div>
          </div>

          <button onClick={handleSaveSchedule}
            className={`w-full py-3 rounded-[12px] font-medium text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${savingSchedule ? 'bg-[#00a87e] text-white' : 'bg-[#191c1f] text-white hover:bg-[#2d3033]'}`}
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {savingSchedule ? <><Check className="h-4 w-4" /> Đã lưu lịch!</> : <><Zap className="h-4 w-4" /> Lưu lịch trình</>}
          </button>
          <p className="text-[8px] text-[#8d969e] italic opacity-50 text-center"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Hangfire Job · File mã hóa AES-256 trước khi upload
          </p>
        </div>
      </div>

      {/* Backup Table */}
      <div className="bg-white border border-[#c9c9cd] rounded-[20px] overflow-hidden">
        <div className="px-10 py-6 border-b border-[#c9c9cd] bg-[#f4f4f4] flex items-center justify-between">
          <h3 className="text-[9px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-2 italic"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <History className="h-4 w-4" /> Lịch sử Snapshot 30 ngày gần đây
          </h3>
          <button className="text-[9px] font-medium text-[#494fdf] uppercase tracking-wider hover:underline italic flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Tải toàn bộ history <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#c9c9cd]">
                <th className="px-10 py-4 text-xs font-medium uppercase tracking-wider text-[#8d969e]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Tên bản sao / Cloud</th>
                <th className="px-10 py-4 text-xs font-medium uppercase tracking-wider text-[#8d969e]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Dung lượng</th>
                <th className="px-10 py-4 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-center"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Bảo mật</th>
                <th className="px-10 py-4 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-center"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Trạng thái</th>
                <th className="px-10 py-4 text-xs font-medium uppercase tracking-wider text-[#8d969e] text-right"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9c9cd]">
              {backups.map((b) => (
                <tr key={b.id} className="group hover:bg-[#f4f4f4] transition-colors">
                  <td className="px-10 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-[12px] flex items-center justify-center text-lg group-hover:scale-105 transition-transform ${b.type === 'Auto' ? 'bg-[#f4f4f4]' : 'bg-[#f4f4f4]'}`}>
                        {cloudIcon(b.cloud)}
                      </div>
                      <div>
                        <p className={`text-xs font-medium uppercase tracking-tight ${b.status === 'Corrupted' ? 'text-[#e23b4a]' : 'text-[#191c1f]'}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}>{b.name}</p>
                        <p className="text-[9px] text-[#8d969e] italic flex items-center gap-2 opacity-60"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          <Calendar className="h-3 w-3" /> {b.date} · {b.type} · {b.cloud}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-4">
                    <span className="text-[10px] font-medium text-[#505a63] bg-[#f4f4f4] px-3 py-1 rounded-[8px]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>{b.size}</span>
                  </td>
                  <td className="px-10 py-4 text-center">
                    {b.encrypted ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[9px] font-medium bg-[#f4f4f4] text-[#00a87e] uppercase tracking-wider border border-[#c9c9cd]"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Lock className="h-3 w-3" /> AES-256
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[9px] font-medium bg-[#f4f4f4] text-[#e23b4a] uppercase tracking-wider border border-[#c9c9cd]"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <ShieldAlert className="h-3 w-3" /> Unencrypted
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-4 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] text-[9px] font-medium uppercase tracking-wider ${
                      b.status === 'Healthy' ? 'bg-[#f4f4f4] text-[#00a87e]' :
                      b.status === 'Corrupted' ? 'bg-[#f4f4f4] text-[#e23b4a]' :
                      'bg-[#f4f4f4] text-[#8d969e]'
                    }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      <div className={`h-1.5 w-1.5 rounded-full ${b.status === 'Healthy' ? 'bg-[#00a87e]' : b.status === 'Corrupted' ? 'bg-[#e23b4a]' : 'bg-[#8d969e] animate-pulse'}`} />
                      {b.status}
                    </div>
                  </td>
                  <td className="px-10 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#f4f4f4] rounded-[12px] transition-all"><Download className="h-4 w-4" /></button>
                      {b.status === 'Healthy' && (
                        <button onClick={() => setRestoreTarget(b)}
                          className="px-4 py-2.5 bg-[#191c1f] text-white rounded-[12px] text-[9px] font-medium uppercase tracking-wider hover:bg-[#2d3033] transition-all shadow-sm flex items-center gap-2"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          <RefreshCw className="h-3 w-3" /> Restore
                        </button>
                      )}
                      <button className="p-2.5 text-[#8d969e] hover:text-[#e23b4a] hover:bg-[#f4f4f4] rounded-[12px] transition-all"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-10 py-6 bg-[#f4f4f4] flex items-start gap-4 border-t border-[#c9c9cd]">
          <AlertTriangle className="h-5 w-5 text-[#e23b4a] flex-shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-[#8d969e] leading-relaxed italic"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Hành động "Restore" sẽ ghi đè toàn bộ CSDL hiện tại. Dữ liệu mới sau thời điểm tạo bản sao sẽ mất vĩnh viễn. Bắt buộc xác nhận 2 bước trước khi thực thi.
          </p>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <XacNhanHanhDong
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={confirmRestore}
        type="danger"
        title="⚠️ Xác nhận Restore Database?"
        message={`Toàn bộ CSDL sẽ bị ghi đè bằng snapshot "${restoreTarget?.name}" (${restoreTarget?.date}). Dữ liệu phát sinh sau thời điểm này sẽ mất VĨNH VIỄN và không thể khôi phục! Bạn đã sao lưu bản mới nhất chưa?`}
        confirmLabel="Tôi hiểu rủi ro — Tiến hành Restore"
        isLoading={isRestoring}
      />
    </div>
  );
}
