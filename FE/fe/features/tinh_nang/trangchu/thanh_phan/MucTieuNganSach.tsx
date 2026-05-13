import React from 'react';
import Link from 'next/link';
import { Target, Plus } from 'lucide-react';
import type { NganSachType, MucTieuType } from '@/kieu_du_lieu/TrangChu';
import { Button } from '@/thanh_phan/ui';

interface MucTieuNganSachProps {
  budgets?: NganSachType[];
  goals?: MucTieuType[];
}

export default function MucTieuNganSach({ budgets = [], goals = [] }: MucTieuNganSachProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-[#e23b4a]';
    if (percentage >= 70) return 'bg-[#ec7e00]';
    return 'bg-[#00a87e]';
  };

  return (
    <div className="fe-card-fe p-6 space-y-6">
      <div>
        <h3 className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}>Ngân sách tháng này</h3>
        {budgets.length === 0 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-[12px] bg-[#f4f4f4] p-4 border border-dashed border-[#c9c9cd]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-[#8d969e]">Danh mục {i}</span>
                  <span className="text-[#8d969e]">0 / 0 đ</span>
                </div>
                <div className="w-full fe-skeleton rounded-full h-2 overflow-hidden">
                  <div className="h-full fe-skeleton rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            ))}
            <Link href="/NganSach" className="block">
              <Button variant="primary" size="sm" className="w-full">
                Thiết lập ngân sách
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {budgets.map((budget) => {
              const percentage = Math.min((budget.daDung / budget.hanMuc) * 100, 100);
              const color = getProgressColor(percentage);

              return (
                <div key={budget.nganSachId}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-[#191c1f]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>{budget.tenDanhMuc}</span>
                    <span className="text-[#8d969e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      {budget.daDung.toLocaleString('vi-VN')} / {budget.hanMuc.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f4f4] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#c9c9cd]">
        <h3 className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}>Mục tiêu tích lũy</h3>
        {goals.length === 0 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 bg-[#f4f4f4] rounded-[12px] p-4 border border-dashed border-[#c9c9cd]">
                <div className="p-3 bg-white text-[#8d969e] rounded-[12px]">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#8d969e]">Mục tiêu {i}</span>
                    <span className="font-medium text-[#8d969e]">0%</span>
                  </div>
                  <div className="w-full bg-[#e5e5e5] rounded-full h-2 mt-2 overflow-hidden">
                    <div className="h-full bg-[#494fdf] rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    Còn thiếu: 0 đ
                  </p>
                </div>
              </div>
            ))}
            <Link href="/MucTieu" className="block">
              <Button variant="primary" size="sm" className="w-full">
                Tạo mục tiêu mới
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const goalPercent = Math.min((goal.soTienHienTai / goal.soTienMucTieu) * 100, 100);
              return (
                <div key={goal.mucTieuId} className="flex items-center gap-4 bg-[#f4f4f4] rounded-[12px] p-4 border border-[#c9c9cd]">
                  <div className="p-3 bg-white rounded-[12px]" style={{ color: goal.mauSac || '#494fdf' }}>
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#191c1f]"
                        style={{ fontFamily: 'Inter, sans-serif' }}>{goal.tenMucTieu}</span>
                      <span className="font-medium"
                        style={{ fontFamily: 'Inter, sans-serif', color: goal.mauSac || '#494fdf' }}>
                        {goalPercent.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#f4f4f4] rounded-full h-2 mt-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${goalPercent}%`, backgroundColor: goal.mauSac || '#494fdf' }}></div>
                    </div>
                    <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Còn thiếu: {(goal.soTienMucTieu - goal.soTienHienTai).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
