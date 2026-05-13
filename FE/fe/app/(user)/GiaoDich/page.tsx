"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Plus, Sparkles } from 'lucide-react';
import BoLocGiaoDich from '@/components/user/GiaoDich/BoLocGiaoDich';
import BangLichSu from '@/components/user/GiaoDich/BangLichSu';
import type { LocGiaoDichDto } from '@/types';
import { useSearchParams } from 'next/navigation';
import FormGiaoDich from '@/components/user/GiaoDich/FormGiaoDich';
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/animation';
import { useDanhSachGiaoDichQuery, useTongQuanGiaoDichQuery } from '@/hooks/query/giaodich/useGiaoDichQueries';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';

export default function DanhSachGiaoDichPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const mode = searchParams.get('form') as 'THEM' | 'CHINH_SUA' | null;
  const isFormOpen = Boolean(mode);
  const [filter, setFilter] = useState<LocGiaoDichDto>({ page: 1, pageSize: 20 });
  const [sortBy, setSortBy] = useState<'ngayGiaoDich' | 'soTien' | 'giaoDichId'>('ngayGiaoDich');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data: pagedData,
    isLoading: isDanhSachLoading,
    refetch: refetchDanhSach,
  } = useDanhSachGiaoDichQuery({ ...filter, sortBy, sortOrder });

  const {
    data: tongQuan,
    isLoading: isTongQuanLoading,
    refetch: refetchTongQuan,
  } = useTongQuanGiaoDichQuery();

  const loading = isDanhSachLoading || isTongQuanLoading;

  const dinhDangTien = (soTien: number) =>
    `${soTien < 0 ? '-' : ''}${Math.abs(soTien).toLocaleString('vi-VN')} đ`;

  // Get transactions and pagination info from paged response
  const transactions = pagedData?.items ?? [];
  const pagination = pagedData ? {
    page: pagedData.page,
    pageSize: pagedData.pageSize,
    totalCount: pagedData.totalCount,
    totalPages: pagedData.totalPages,
    hasNextPage: pagedData.hasNextPage ?? false,
    hasPreviousPage: pagedData.hasPreviousPage ?? false,
  } : undefined;

  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({ ...prev, page: newPage }));
  };

  const handleSort = (column: string, order: 'asc' | 'desc') => {
    setSortBy(column as 'ngayGiaoDich' | 'soTien' | 'giaoDichId');
    setSortOrder(order);
  };

  const handleRefresh = async () => {
    await Promise.all([refetchDanhSach(), refetchTongQuan()]);
  };

  const theThongKe = [
    {
      nhan: 'Tổng thu',
      moTa: 'Dòng tiền vào trong kỳ hiện tại',
      giaTri: dinhDangTien(tongQuan?.tongThu ?? 0),
      mauNen: 'bg-green-50',
      mauChu: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      nhan: 'Tổng chi',
      moTa: 'Dòng tiền ra trong kỳ hiện tại',
      giaTri: dinhDangTien(-(tongQuan?.tongChi ?? 0)),
      mauNen: 'bg-red-50',
      mauChu: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    {
      nhan: 'tiết kiệm',
      moTa: 'Số dư tiết kiệm trong kỳ hiện tại',
      giaTri: dinhDangTien((tongQuan?.tongThu ?? 0) - (tongQuan?.tongChi ?? 0)),
      mauNen: 'bg-blue-50',
      mauChu: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <div className="fe-page-shell space-y-8">
      {/* Hero Header */}
      <FadeIn>
        <section className="fe-card-fe p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider mb-4"
                style={{ 
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-secondary)'
                }}>
                Quản lý giao dịch
              </div>
              <h1 className="max-w-2xl text-3xl lg:text-4xl font-semibold tracking-tight"
                style={{ color: 'var(--text-primary)' }}>
                Lịch sử giao dịch
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}>
                Theo dõi toàn bộ dòng tiền với giao diện gọn gàng, dễ quét và tập trung vào những con số quan trọng nhất.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/GiaoDich/NhapDuLieu"
                className="inline-flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-medium transition-all"
                style={{ 
                  borderColor: 'var(--input-border)',
                  background: 'var(--surface-primary)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Link>
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('form', 'THEM');
                  const q = params.toString();
                  window.history.pushState({}, '', `${window.location.pathname}?${q}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600 transition-all shadow-lg shadow-green-500/25"
              >
                <Plus className="h-4 w-4" />
                Thêm giao dịch
                <Sparkles className="h-4 w-4 opacity-80" />
              </button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Stats Cards - Bức tranh tài chính */}
      <SlideUp delay={0.1}>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Stats Grid */}
          <div className="fe-card-fe p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 w-16 fe-skeleton rounded"></div>
                  <div className="h-6 w-48 fe-skeleton rounded"></div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      Tổng quan
                    </p>
                    <h2 className="mt-2 text-xl lg:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Bức tranh tài chính hiện tại
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                    Dữ liệu được đồng bộ trực tiếp từ hệ thống giao dịch của bạn.
                  </p>
                </>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="fe-card-fe p-5 space-y-3">
                    <div className="h-6 w-20 fe-skeleton rounded-full"></div>
                    <div className="h-7 w-28 fe-skeleton rounded"></div>
                    <div className="h-4 w-full fe-skeleton rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <StaggerContainer staggerDelay={0.1}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {theThongKe.map((the) => (
                    <StaggerItem key={the.nhan}>
                      <div className="fe-card-fe p-5">
                        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${the.mauNen} ${the.mauChu}`}>
                          {the.nhan}
                        </div>
                        <p className={`mt-4 text-xl font-semibold ${the.mauChu}`}>
                          {the.giaTri}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {the.moTa}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </div>

          {/* Quick Actions */}
          <div className="fe-card-fe p-6 lg:p-8">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Điều hướng nhanh
            </p>
            <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Thao tác thường dùng
            </h2>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('form', 'THEM');
                  params.delete('id');
                  const q = params.toString();
                  window.history.pushState({}, '', `${window.location.pathname}?${q}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
                className="inline-flex items-center justify-center rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-white hover:bg-green-600 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo giao dịch mới
              </button>
              <Link
                href=""
                className="inline-flex items-center justify-center rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all"
                style={{ 
                  borderColor: 'var(--text-primary)',
                  color: 'var(--text-primary)',
                  background: 'var(--surface-primary)'
                }}
              >
                Xuất dữ liệu
              </Link>
            </div>
            <div className="mt-6 fe-card-fe p-5">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Luôn nắm rõ biến động
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Sử dụng bộ lọc bên dưới để rà soát giao dịch theo khoảng thời gian, danh mục hoặc trạng thái cần quan tâm.
              </p>
            </div>
          </div>
        </section>
      </SlideUp>

      {/* Filters */}
      <FadeIn delay={0.2}>
        <section className="fe-card-fe p-5">
          <BoLocGiaoDich filter={filter} onFilterChange={setFilter} />
        </section>
      </FadeIn>

      {/* Transaction Table with Delete Dialog */}
      <FadeIn delay={0.3}>
        <BangLichSu 
          transactions={transactions} 
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={handleRefresh}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </FadeIn>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'var(--overlay-bg)' }}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete('form');
              params.delete('id');
              const q = params.toString();
              window.history.pushState({}, '', `${window.location.pathname}${q ? `?${q}` : ''}`);
              window.dispatchEvent(new Event('popstate'));
            }}
          />

          <div className="relative w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="rounded-3xl border shadow-xl p-6"
              style={{ 
                background: 'var(--modal-bg)',
                borderColor: 'var(--card-border)'
              }}>
              <FormGiaoDich
                type={mode || 'THEM'}
                initialData={
                  mode === 'CHINH_SUA' ? { giaoDichId: Number(searchParams.get('id')) } : undefined
                }
                onClose={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.delete('form');
                  params.delete('id');
                  const q = params.toString();
                  window.history.pushState({}, '', `${window.location.pathname}${q ? `?${q}` : ''}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
                onSubmitSuccess={(updatedData: any) => {
                  // Cập nhật cache tức thì (Optimistic Update)
                  if (mode === 'CHINH_SUA' && updatedData) {
                    const giaoDichId = Number(searchParams.get('id'));
                    
                    // Cập nhật danh sách giao dịch
                    queryClient.setQueriesData({ queryKey: queryKeys.giaoDich.all }, (old: any) => {
                      if (!old || !old.items) return old;
                      return {
                        ...old,
                        items: old.items.map((item: any) => 
                          item.giaoDichId === giaoDichId 
                            ? { ...item, ...updatedData, 
                                soTien: updatedData.soTien,
                                ghiChu: updatedData.ghiChu,
                                ngayGiaoDich: updatedData.ngayGiaoDich,
                              } 
                            : item
                        )
                      };
                    });
                  }

                  // Refresh danh sách giao dịch và tổng quan
                  handleRefresh();
                  
                  // QUAN TRỌNG: Invalidate query tài khoản để cập nhật số dư mới
                  queryClient.invalidateQueries({ queryKey: queryKeys.taiKhoan.all });
                  
                  // Reload trang để cập nhật dữ liệu ở tất cả các trang (TrangChu, v.v.)
                  // Sử dụng setTimeout để đảm bảo UI đã đóng form trước khi reload
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                  
                  const params = new URLSearchParams(window.location.search);
                  params.delete('form');
                  params.delete('id');
                  const q = params.toString();
                  window.history.pushState({}, '', `${window.location.pathname}${q ? `?${q}` : ''}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
