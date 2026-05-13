"use client";

import React, { useState } from 'react';
import { 
  Database, FileText, Image as ImageIcon, HardDrive, Trash2, Search, 
  ArrowRight, Download, AlertCircle, Settings2, User, Calendar,
  SlidersHorizontal, Cloud, BarChart3, Zap, Check, X
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StorageFile {
  id: string;
  name: string;
  type: 'Image' | 'Document' | 'CSV' | 'Archive';
  size: string;
  sizeBytes: number;
  uploader: string;
  date: string;
  flagged?: boolean;
}

const mockFiles: StorageFile[] = [
  { id: 'F1', name: 'Receipt_Lunch_VCB.png', type: 'Image', size: '1.2 MB', sizeBytes: 1200000, uploader: 'Nguyễn Văn Anh', date: '2024-04-07' },
  { id: 'F2', name: 'Invoice_April_Amazon.pdf', type: 'Document', size: '2.5 MB', sizeBytes: 2500000, uploader: 'Trần Thị Bình', date: '2024-04-06' },
  { id: 'F3', name: 'Export_TPBank_April.csv', type: 'CSV', size: '480 KB', sizeBytes: 480000, uploader: 'Lê Văn Cường', date: '2024-04-05' },
  { id: 'F4', name: 'Identity_Card_Front.jpg', type: 'Image', size: '850 KB', sizeBytes: 850000, uploader: 'Phạm Minh Đức', date: '2024-04-04', flagged: true },
  { id: 'F5', name: 'Transactions_Backup.zip', type: 'Archive', size: '42.8 MB', sizeBytes: 42800000, uploader: 'system', date: '2024-04-03' },
];

const donutSeries = [28.4, 9.2, 3.1, 1.8];
const donutOptions: ApexOptions = {
  chart: { type: 'donut', height: 220, background: 'transparent' },
  colors: ['#6366f1', '#f59e0b', '#10b981', '#ec4899'],
  labels: ['Ảnh hóa đơn', 'File CSV', 'Tài liệu PDF', 'Khác'],
  legend: { show: false },
  plotOptions: { pie: { donut: { size: '65%', labels: { show: true, total: { show: true, label: 'Tổng GB', fontSize: '10px', fontWeight: 800, color: '#94a3b8', formatter: () => '42.5' } } } } },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light' },
};

export default function QuanLyLuuTru() {
  const [files, setFiles] = useState<StorageFile[]>(mockFiles);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | StorageFile['type']>('All');
  const [userLimit, setUserLimit] = useState(100);
  const [savingLimit, setSavingLimit] = useState(false);

  const displayed = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === 'All' || f.type === typeFilter)
  );

  const typeIcon = (t: string) => ({ Image: <ImageIcon className="h-4 w-4" />, Document: <FileText className="h-4 w-4" />, CSV: <Database className="h-4 w-4" />, Archive: <HardDrive className="h-4 w-4" /> }[t] ?? <FileText className="h-4 w-4" />);
  const typeBg   = (t: string) => ({ Image: 'bg-indigo-50 text-indigo-500', Document: 'bg-amber-50 text-amber-500', CSV: 'bg-emerald-50 text-emerald-500', Archive: 'bg-zinc-100 text-zinc-500' }[t] ?? 'bg-zinc-100 text-zinc-400');

  const handleSaveLimit = () => { setSavingLimit(true); setTimeout(() => setSavingLimit(false), 1200); };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">

      {/* Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar (2/3) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 rounded-2xl shadow-xl"><HardDrive className="h-6 w-6" /></div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Tổng dung lượng Cloud</h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic opacity-60 mt-1">Cloudinary / AWS S3</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest opacity-60 mb-1">Đã sử dụng</p>
              <p className="text-3xl font-black italic tracking-tighter text-zinc-900 dark:text-white">42.5 <span className="text-sm opacity-40">/ 100 GB</span></p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-indigo-500 rounded-l-full" style={{ width: '28.4%' }} title="Ảnh hóa đơn" />
              <div className="h-full bg-amber-500" style={{ width: '9.2%' }} title="File CSV" />
              <div className="h-full bg-emerald-500" style={{ width: '3.1%' }} title="PDF" />
              <div className="h-full bg-pink-500 rounded-r-full" style={{ width: '1.8%' }} title="Khác" />
            </div>
            <div className="flex gap-6 flex-wrap">
              {[['Ảnh hóa đơn', '28.4 GB', '#6366f1'], ['File CSV', '9.2 GB', '#f59e0b'], ['Tài liệu PDF', '3.1 GB', '#10b981'], ['Khác', '1.8 GB', '#ec4899']].map(([l, v, c]) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c }} />
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{l}: <strong>{v}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Tổng file', value: '48,231', icon: FileText, color: 'text-indigo-500' },
              { label: 'File hóa đơn', value: '31,480', icon: ImageIcon, color: 'text-amber-500' },
              { label: 'File rác (xóa mềm)', value: '840 MB', icon: Trash2, color: 'text-rose-500' },
            ].map((s, i) => (
              <div key={i} className="bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-2xl flex items-center gap-4">
                <s.icon className={`h-5 w-5 ${s.color} shrink-0`} />
                <div>
                  <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest opacity-60 italic">{s.label}</p>
                  <p className="text-sm font-black text-zinc-900 dark:text-white tracking-tighter italic">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel (1/3) */}
        <div className="space-y-6">
          {/* Donut */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[3rem] shadow-sm">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-60 mb-4">Phân tích theo loại</h4>
            <Chart options={donutOptions} series={donutSeries} type="donut" height={200} />
          </div>

          {/* User Limit Config */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 rounded-[3rem] shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-amber-500" />
              <h4 className="text-sm font-black uppercase italic tracking-tighter">Giới hạn mỗi user</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black">
                <span className="text-zinc-400 uppercase italic">Dung lượng tối đa</span>
                <span className="text-amber-500">{userLimit} MB</span>
              </div>
              <input type="range" min={10} max={500} step={10} value={userLimit} onChange={e => setUserLimit(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              <div className="flex justify-between text-[8px] text-zinc-300 uppercase font-bold"><span>10MB</span><span>500MB</span></div>
            </div>
            <button onClick={handleSaveLimit}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${savingLimit ? 'bg-emerald-500 text-white' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}>
              {savingLimit ? <><Check className="h-4 w-4" /> Đã lưu!</> : <><Zap className="h-4 w-4" /> Lưu cấu hình</>}
            </button>
            <p className="text-[9px] text-zinc-400 italic opacity-60 text-center">Lưu vào SystemConfigs · Hiệu lực ngay · Nén ảnh qua ImageSharp trước khi lưu</p>
          </div>

          {/* Cleanup */}
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-8 rounded-[2.5rem] flex flex-col gap-4">
            <AlertCircle className="h-7 w-7 text-rose-500" />
            <div>
              <h4 className="text-sm font-black text-rose-900 dark:text-rose-100 uppercase italic tracking-tighter mb-1">840 MB file rác cần dọn</h4>
              <p className="text-[10px] font-bold text-rose-800 dark:text-rose-200 opacity-60 leading-relaxed italic">Dữ liệu từ giao dịch đã xóa mềm → chưa được purge vật lý.</p>
            </div>
            <button className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2">
              <Trash2 className="h-4 w-4" /> Dọn dẹp ngay
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-zinc-50 dark:border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-50/30">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
            <FileText className="h-4 w-4" /> Tệp tin tải lên gần đây
          </h3>
          <div className="flex gap-3 items-center flex-wrap">
            {(['All', 'Image', 'Document', 'CSV', 'Archive'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${typeFilter === t ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent' : 'border-zinc-100 dark:border-zinc-800 text-zinc-400'}`}>
                {t}
              </button>
            ))}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input type="text" placeholder="Tìm file..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-50 dark:border-zinc-800">
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Tên tệp / Loại</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Dung lượng</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Chủ sở hữu</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {displayed.map(f => (
                <tr key={f.id} className={`group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors ${f.flagged ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform ${typeBg(f.type)}`}>{typeIcon(f.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase italic tracking-tighter truncate max-w-[240px]">{f.name}</p>
                          {f.flagged && <span className="text-[8px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Flagged</span>}
                        </div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1 opacity-60">{f.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-[10px] font-black text-zinc-500 italic uppercase bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-100 dark:border-zinc-700">{f.size}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-zinc-300" />
                      <p className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase italic">{f.uploader}</p>
                    </div>
                    <p className="text-[9px] font-bold text-zinc-400 mt-1 flex items-center gap-1.5 italic uppercase tracking-widest opacity-60"><Calendar className="h-3 w-3"/>{f.date}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Download className="h-4 w-4" /></button>
                      <button onClick={() => setFiles(p => p.filter(x => x.id !== f.id))}
                        className="p-3 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-10 py-8 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic flex items-center justify-center gap-2">
            <Cloud className="h-4 w-4 text-indigo-400" /> Lưu trữ qua Cloudinary / AWS S3 · Nén ảnh bằng ImageSharp (.NET) trước khi lưu chính thức
          </p>
        </div>
      </div>
    </div>
  );
}
