"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, X, Loader2 } from 'lucide-react';
import { layDanhSachGoiYAI, layDuDoanAI, layNgucCanhAICuaNguoiDung} from '@/services/ai';
import type { LoiKhuyenAIType } from '@/types/TrungTamAI';
import type { LoiKhuyenAIDto } from '@/types';
import type { GeminiChatDataDto } from '@/types/GeminiAI';
import CoVanAIChuyenSau from '@/components/user/TrungTamAI/CoVanAIChuyenSau';

export default function TroLyAI() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [troLyData, setTroLyData] = useState<LoiKhuyenAIType[]>([]);
  const [userContext, setUserContext] = useState<GeminiChatDataDto | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUserContext();
    }
  }, [isOpen]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const aiData = await layDanhSachGoiYAI();
      const aiMapped: LoiKhuyenAIType[] = (aiData as LoiKhuyenAIDto[]).map(item => ({
        id: item.id,
        tieuDe: item.tieuDe,
        noiDung: item.noiDung,
        loai: item.loai as 'CANH_BAO' | 'GOI_Y' | 'KHICH_LE',
        ngayTao: item.ngayTao
      }));
      setTroLyData(aiMapped);
      setHasNotification(aiMapped.length > 0);
    } catch (err) {
      console.error('Lỗi tải gợi ý AI:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserContext = async () => {
    try {
      const context = await layNgucCanhAICuaNguoiDung();
      setUserContext(context);
    } catch (err) {
      console.error('Lỗi tải ngữ cảnh AI:', err);
    }
  };

  const getBubbleStyle = (loai: string) => {
    switch (loai) {
      case 'CANH_BAO': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 border-amber-100 dark:border-amber-800/40';
      case 'KHICH_LE': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 border-emerald-100 dark:border-emerald-800/40';
      default: return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 border-indigo-100 dark:border-indigo-800/40';
    }
  };

  if (!mounted) return null;

  return (
    <>
      <CoVanAIChuyenSau isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="fixed bottom-4 right-4 z-[9999] lg:bottom-6 lg:right-6 shadow-2xl pointer-events-auto">
        {!isOpen && hasNotification && (
          <div 
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto mb-4 mr-2 hidden max-w-[220px] cursor-pointer rounded-2xl rounded-br-none border border-indigo-100 bg-white p-3 shadow-lg dark:border-indigo-900/50 dark:bg-zinc-800 md:block"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Có {troLyData.length} gợi ý AI mới</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Nhấp để mở trợ lý và xem đề xuất.</p>
              </div>
            </div>
          </div>
        )}

        {!isOpen && userContext && (
          <div className="pointer-events-auto mb-4 mr-2 hidden max-w-[260px] rounded-2xl border border-indigo-100 bg-indigo-50 p-3 text-[11px] text-zinc-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-zinc-200 xl:block">
            <p className="font-semibold mb-2">Tổng quan tài chính</p>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span>Thu: {userContext.thuNhap.toLocaleString('vi-VN')} đ</span>
              <span>Chi: {userContext.tongChi.toLocaleString('vi-VN')} đ</span>
              <span>Số dư: {userContext.soDu.toLocaleString('vi-VN')} đ</span>
              <span>Mục tiêu: {userContext.mucTieu.length}</span>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setHasNotification(false);
          }}
          className={`pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-indigo-600 text-white'
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}

          {!isOpen && hasNotification && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-zinc-900 text-[10px] font-bold flex items-center justify-center">{troLyData.length}</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
