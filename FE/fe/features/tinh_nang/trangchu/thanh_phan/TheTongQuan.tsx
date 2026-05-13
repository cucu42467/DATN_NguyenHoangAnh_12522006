import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import type { TongHopThangType } from '@/kieu_du_lieu/TrangChu';
import { StaggerContainer, StaggerItem } from '@/thanh_phan/animation';

interface TheTongQuanProps {
  data?: TongHopThangType | null;
}

export default function TheTongQuan({ data }: TheTongQuanProps) {
  const tongThu = data?.tongThu ?? 0;
  const tongChi = data?.tongChi ?? 0;
  const tietKiem = data?.tietKiem ?? 0;
  const soDuThuan = data?.soDuThuan ?? 0; // Sử dụng số dư thực tế từ API

  const cards = [
    {
      title: 'Số dư hiện tại',
      amount: soDuThuan.toLocaleString('vi-VN'),
      currency: 'VND',
      icon: <Wallet className="h-5 w-5" />,
      bgIcon: 'bg-[#f4f4f4]',
      iconColor: 'text-[#494fdf]',
      trend: data ? `+${((tongThu - tongChi) / Math.max(1, Math.abs(tongChi)) * 100).toFixed(1)}%` : '-',
      trendUp: true,
    },
    {
      title: 'Thu nhập tháng này',
      amount: tongThu.toLocaleString('vi-VN'),
      currency: 'VND',
      icon: <TrendingUp className="h-5 w-5" />,
      bgIcon: 'bg-[#f4f4f4]',
      iconColor: 'text-[#00a87e]',
      trend: '+',
      trendUp: true,
    },
    {
      title: 'Chi tiêu tháng này',
      amount: tongChi.toLocaleString('vi-VN'),
      currency: 'VND',
      icon: <TrendingDown className="h-5 w-5" />,
      bgIcon: 'bg-[#f4f4f4]',
      iconColor: 'text-[#e23b4a]',
      trend: '-',
      trendUp: false,
    },
    {
      title: 'Tiền tiết kiệm (Tháng)',
      amount: tietKiem.toLocaleString('vi-VN'),
      currency: 'VND',
      icon: <PiggyBank className="h-5 w-5" />,
      bgIcon: 'bg-[#f4f4f4]',
      iconColor: 'text-[#ec7e00]',
      trend: data ? '+10.0%' : '-',
      trendUp: true,
    },
  ];

  return (
    <StaggerContainer staggerDelay={0.1}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StaggerItem key={index}>
            <div
              className="relative overflow-hidden fe-card-fe p-6 group"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className={`p-3 rounded-[12px] ${card.bgIcon}`}>
                  <div className={card.iconColor}>{card.icon}</div>
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${card.trendUp ? 'text-[#00a87e]' : 'text-[#e23b4a]'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>{card.trend}</span>
                </div>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider"
                  style={{ fontFamily: 'Inter, sans-serif' }}>{card.title}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-medium text-[#191c1f] leading-none"
                    style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                    {card.amount}
                  </span>
                  <span className="text-sm font-medium text-[#8d969e]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>{card.currency}</span>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
}
