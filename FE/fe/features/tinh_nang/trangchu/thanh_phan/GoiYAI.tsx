"use client";

import React from 'react';
import { Lightbulb, AlertTriangle, Trophy, ArrowRight } from 'lucide-react';
import type { loiKhuyenAIType } from '@/kieu_du_lieu/TrungTamAI';

interface GoiYAIProps {
  suggestions: loiKhuyenAIType[];
}

const getIcon = (loai: string) => {
  switch (loai) {
    case 'GOI_Y':
      return <Lightbulb className="h-5 w-5 text-[#494fdf]" />;
    case 'CANH_BAO':
      return <AlertTriangle className="h-5 w-5 text-[#e23b4a]" />;
    case 'KHICH_LE':
      return <Trophy className="h-5 w-5 text-[#00a87e]" />;
    default:
      return <Lightbulb className="h-5 w-5 text-[#505a63]" />;
  }
};

const getBgColor = (loai: string) => {
  switch (loai) {
    case 'GOI_Y':
      return 'bg-[#f4f4f4] border-[#c9c9cd]';
    case 'CANH_BAO':
      return 'bg-[#f4f4f4] border-[#c9c9cd]';
    case 'KHICH_LE':
      return 'bg-[#f4f4f4] border-[#c9c9cd]';
    default:
      return 'bg-[#f4f4f4] border-[#c9c9cd]';
  }
};

export default function GoiYAI({ suggestions }: GoiYAIProps) {
  if (suggestions.length === 0) {
    return (
      <div className="fe-card-fe p-6">
        <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] mb-4"
          style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
          Gợi ý từ AI
        </h2>
        <p className="text-sm font-medium text-[#8d969e]"
          style={{ fontFamily: 'Inter, sans-serif' }}>Không có gợi ý nào hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="fe-card-fe p-6">
      <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] mb-6"
        style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
        Gợi ý từ AI
      </h2>

      <div className="space-y-4">
        {suggestions.slice(0, 5).map((suggestion) => (
          <div key={suggestion.id} className={`p-4 rounded-[12px] border ${getBgColor(suggestion.loai)}`}>
            <div className="flex items-start gap-3">
              {getIcon(suggestion.loai)}
              <div className="flex-1">
                <h3 className="font-medium text-[#191c1f] mb-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {suggestion.tieuDe}
                </h3>
                <p className="text-sm text-[#505a63] mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {suggestion.noiDung}
                </p>
                <p className="text-[10px] text-[#8d969e] uppercase tracking-wider"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {new Date(suggestion.ngayTao).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
