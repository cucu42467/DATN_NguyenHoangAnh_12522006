"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lightbulb,
  Trophy,
  AlertTriangle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { layDanhSachGoiYAI } from '@/services/ai';
import type { LoiKhuyenAIType } from '@/types/TrungTamAI';
import type { LoiKhuyenAIDto } from '@/types';

interface loiKhuyenAIProps {
  onOpenCoVanAI?: () => void;
}

export default function LoiKhuyenAI({ onOpenCoVanAI }: loiKhuyenAIProps) {
  const [typedText, setTypedText] = useState("");
  const [tips, setTips] = useState<LoiKhuyenAIType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const aiData = await layDanhSachGoiYAI();
        const aiMapped: LoiKhuyenAIType[] = (aiData as LoiKhuyenAIDto[]).map(item => ({
          id: item.id,
          tieuDe: item.tieuDe,
          noiDung: item.noiDung,
          loai: item.loai as 'CANH_BAO' | 'GOI_Y' | 'KHICH_LE',
          ngayTao: item.ngayTao
        }));
        setTips(aiMapped);

        // Set live analysis text based on first tip or default
        if (aiMapped.length > 0) {
          const firstTip = aiMapped[0];
          setTypedText(`AI nhận thấy: ${firstTip.tieuDe}. ${firstTip.noiDung}`);
        } else {
          setTypedText("Chưa có dữ liệu phân tích. Hãy thêm giao dịch để AI phân tích tình hình tài chính của bạn.");
        }
      } catch (err) {
        console.error('Lỗi tải gợi ý AI:', err);
        setError('Không thể tải gợi ý từ AI');
        setTypedText("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getIcon = (type: string, title: string) => {
    if (title.includes("Coffee")) return <Lightbulb className="h-5 w-5" />;
    if (title.includes("Subscription")) return <Sparkles className="h-5 w-5" />;

    switch (type) {
      case 'CANH_BAO': return <AlertTriangle className="h-5 w-5" />;
      case 'KHICH_LE': return <Trophy className="h-5 w-5" />;
      case 'GOI_Y': return <Lightbulb className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="p-8 bg-zinc-900 text-white rounded-[2.5rem] border border-white/5 flex items-center justify-center min-h-[120px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live AI Analysis Header */}
      <div className="p-8 bg-zinc-900 text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500 italic">Live AI Analysis</span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-zinc-300 min-h-[60px]">
            {typedText}<span className="animate-pulse">|</span>
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:scale-110 transition-transform">
          <Sparkles className="h-32 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tips.length === 0 ? (
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 text-center">
            <Lightbulb className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-zinc-500">Chưa có gợi ý nào từ AI. Hãy thêm giao dịch để nhận được đề xuất.</p>
          </div>
        ) : (
          tips.map((tip) => (
            <div
              key={tip.id}
              className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 flex items-start gap-6 transition-all hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer group relative overflow-hidden"
            >
              <div className={`p-5 rounded-2xl transition-all group-hover:scale-110 ${tip.loai === 'CANH_BAO' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' :
                  tip.loai === 'KHICH_LE' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' :
                    'bg-amber-50 dark:bg-amber-950/20 text-amber-500'
                }`}>
                {getIcon(tip.loai, tip.tieuDe)}
              </div>

              <div className="flex-1 pr-10">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-base font-medium uppercase tracking-tight text-zinc-900 dark:text-white">{tip.tieuDe}</h4>
                  <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{tip.ngayTao}</span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {tip.noiDung}
                </p>
              </div>

              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-200 group-hover:text-indigo-600 transition-colors">
                <ChevronRight className="h-8 w-8" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ask AI Prompt */}
      <div className="p-10 bg-indigo-600 text-white rounded-[3rem] border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-2xl font-medium uppercase tracking-tight mb-1">Cố Vấn NVIDIA Nemotron 3 Super</h3>
          <p className="text-xs opacity-80 font-medium leading-relaxed max-w-sm">Hỏi về bất kỳ kế hoạch tài chính nào, AI sẽ phân tích dựa trên dữ liệu thật của bạn.</p>
        </div>
        <button
          onClick={onOpenCoVanAI}
          className="relative z-10 px-8 py-4 bg-white text-indigo-600 rounded-[2.5rem] text-xs font-medium border border-white hover:opacity-90 transition-all flex items-center gap-3 shrink-0"
        >
          <Sparkles className="h-5 w-5" /> Bắt Đầu Ngay
        </button>
      </div>
    </div>
  );
}
