"use client";

import React, { useState, useEffect } from 'react';
import { Target, Sparkles, ExternalLink, Coins, TrendingUp } from 'lucide-react';
import DanhSachMucTieu from '@/features/muctieu/thanh_phan/DanhSachMucTieu';
import FormMucTieu from '@/features/muctieu/thanh_phan/FormMucTieu';
import FormDongGop from '@/features/muctieu/thanh_phan/FormDongGop';
import FormSuaMucTieu from '@/features/muctieu/thanh_phan/FormSuaMucTieu';
import type { MucTieuType } from '@/types/MucTieu';
import { layDanhSachMucTieu } from '@/services';
import { FadeIn, StaggerContainer, StaggerItem, SlideUp } from '@/components/animation';
import { Button } from '@/components/ui';

export default function MucTieuTietKiemPage() {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<MucTieuType | null>(null);
  const [goals, setGoals] = useState<MucTieuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await layDanhSachMucTieu();
        setGoals((data || []).map((item: any) => ({
          mucTieuId: item.MucTieuId ?? item.mucTieuId,
          nguoiDungId: item.NguoiDungId ?? item.nguoiDungId ?? 0,
          tenMucTieu: item.TenMucTieu ?? item.tenMucTieu ?? 'Mục tiêu mới',
          soTienMucTieu: Number(item.SoTienMucTieu ?? item.soTienMucTieu ?? 0),
          soTienHienTai: Number(
            item.SoTienHienCo ??
            item.soTienHienCo ??
            item.soTienHienTai ??
            0
          ),
          ngayKetThuc: item.NgayDuKien ?? item.ngayDuKien ?? item.ngayKetThuc ?? '',
          mauSac: item.MauSac ?? item.mauSac ?? '#494fdf',
          anh: item.Anh ?? item.anh ?? null,
        })));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadGoals();
  }, []);

  const refreshGoals = async () => {
    setLoading(true);
    try {
      const data = await layDanhSachMucTieu();
      setGoals((data || []).map((item: any) => ({
        mucTieuId: item.MucTieuId ?? item.mucTieuId,
        nguoiDungId: item.NguoiDungId ?? item.nguoiDungId ?? 0,
        tenMucTieu: item.TenMucTieu ?? item.tenMucTieu ?? 'Mục tiêu mới',
        soTienMucTieu: Number(item.SoTienMucTieu ?? item.soTienMucTieu ?? 0),
        soTienHienTai: Number(
          item.SoTienHienCo ??
          item.soTienHienCo ??
          item.soTienHienTai ??
          0
        ),
        ngayKetThuc: item.NgayDuKien ?? item.ngayDuKien ?? item.ngayKetThuc ?? '',
        mauSac: item.MauSac ?? item.mauSac ?? '#494fdf',
        anh: item.Anh ?? item.anh ?? null,
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const totalTarget = goals.reduce((sum, item) => sum + item.soTienMucTieu, 0);
  const totalCurrent = goals.reduce((sum, item) => sum + item.soTienHienTai, 0);
  const progressPercent = totalTarget ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const handleOpenContribution = (goal: MucTieuType) => {
    setSelectedGoal(goal);
    setIsContributionModalOpen(true);
  };

  const handleEditGoal = (goal: MucTieuType) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  return (
    <div className="fe-page-shell space-y-8">
      {/* Header Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-4 w-32 fe-skeleton rounded"></div>
          <div className="h-10 w-80 fe-skeleton rounded"></div>
        </div>
      ) : (
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 mb-3">
                Mục tiêu tài chính
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900">
                Cột mốc tài chính
              </h1>
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" /> Hiện thực hóa các ước mơ của bạn
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#22c55e] text-white hover:bg-[#16a34a] rounded-xl font-medium text-sm transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo mục tiêu mới
            </button>
          </div>
        </FadeIn>
      )}

      {/* Stats Cards Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="fe-card-fe p-6 space-y-3">
              <div className="h-3 w-20 fe-skeleton rounded"></div>
              <div className="h-8 w-32 fe-skeleton rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <SlideUp delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tổng giá trị */}
            <div className="bg-gradient-to-br from-[#494fdf] to-[#6366f1] rounded-[24px] p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5" />
                <span className="text-sm opacity-80 uppercase tracking-wider">Tổng giá trị</span>
              </div>
              <p className="text-2xl font-bold">{totalTarget.toLocaleString('vi-VN')}đ</p>
            </div>
            
            {/* Đã tích lũy */}
            <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-[10px]">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-[#8d969e] uppercase tracking-wider">Đã tích lũy</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{totalCurrent.toLocaleString('vi-VN')}đ</p>
            </div>
            
            {/* Còn lại */}
            <div className="bg-white border border-[#c9c9cd] rounded-[24px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-[10px]">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-[#8d969e] uppercase tracking-wider">Còn lại</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{(totalTarget - totalCurrent).toLocaleString('vi-VN')}đ</p>
            </div>
            
            {/* Tiến độ */}
            <div className="bg-gray-900 text-white rounded-[24px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-[10px]">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-sm opacity-80 uppercase tracking-wider">Tiến độ</span>
              </div>
              <p className="text-2xl font-bold">{progressPercent}%</p>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </SlideUp>
      )}

      {/* Goals List Skeleton */}
      {loading ? (
        <div className="fe-card-fe p-6 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 fe-skeleton rounded-xl"></div>
            <div className="h-5 w-40 fe-skeleton rounded"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="fe-skeleton rounded-2xl h-48"></div>
            ))}
          </div>
        </div>
      ) : (
        <FadeIn delay={0.2}>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách mục tiêu
              </h2>
            </div>
            <StaggerContainer staggerDelay={0.08}>
              <DanhSachMucTieu 
                goals={goals} 
                onContribute={handleOpenContribution} 
                onCreateNew={() => setIsGoalModalOpen(true)}
                onRefresh={refreshGoals}
                onEdit={handleEditGoal}
              />
            </StaggerContainer>
          </div>
        </FadeIn>
      )}

      {/* Tips */}
      {!loading && (
        <FadeIn delay={0.3}>
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Gợi ý: Hãy thiết lập tự động trích lương vào mục tiêu để đạt tiến độ nhanh hơn
            </p>
          </div>
        </FadeIn>
      )}

      {/* Create Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsGoalModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl">
            <FormMucTieu 
              onClose={() => setIsGoalModalOpen(false)} 
              onSubmitSuccess={() => {
                refreshGoals();
              }} 
            />
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {isEditModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xl">
            <FormSuaMucTieu 
              mucTieuId={selectedGoal.mucTieuId}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedGoal(null);
              }} 
              onSubmitSuccess={() => {
                refreshGoals();
              }} 
            />
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      {isContributionModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsContributionModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg">
            <FormDongGop 
              mucTieuId={selectedGoal.mucTieuId}
              goalName={selectedGoal.tenMucTieu}
              mauSac={selectedGoal.mauSac} 
              onClose={() => setIsContributionModalOpen(false)} 
              onSubmitSuccess={() => {
                refreshGoals();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
