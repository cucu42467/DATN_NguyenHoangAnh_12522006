"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Plus } from 'lucide-react';
import DanhSachTaiKhoan from '@/features/taikhoan/thanh_phan/DanhSachTaiKhoan';
import { layDanhSachTaiKhoan } from '@/services/taikhoan';
import type { TaiKhoanDto } from '@/types';
import { FadeIn, SlideUp } from '@/components/animation';
import { Button } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import FormTaiKhoan from '@/features/taikhoan/thanh_phan/FormTaiKhoan';
import { useSearchParams } from 'next/navigation';

export default function TaiKhoanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('form') as 'THEM' | 'CHINH_SUA' | null;
  const taiKhoanId = searchParams.get('id');

  const editRaw = searchParams.get('edit');
  let initialEditData: any | undefined = undefined;
  try {
    if (editRaw) {
      initialEditData = JSON.parse(decodeURIComponent(editRaw));
    }
  } catch {
    initialEditData = taiKhoanId ? { taiKhoanId } : undefined;
  }
  const isFormOpen = Boolean(mode);

  const [accounts, setAccounts] = useState<TaiKhoanDto[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await layDanhSachTaiKhoan();
      setAccounts(data || []);
    } catch (error) {
      console.error('Lỗi tải tài khoản:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.soDu || 0), 0);

  if (loading) {
    return (
      <div className="fe-page-shell space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Cards skeleton */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fe-page-shell space-y-8">
      {/* Hero Header */}
      <FadeIn>
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80 mb-3">
                Tài khoản
              </div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
                Quản lý tài khoản
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/70 leading-relaxed">
                Theo dõi các ví, tài khoản ngân hàng và nguồn tiền trong bố cục sáng sủa.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchAccounts}
                className="p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
                title="Làm mới"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <Button
                variant="success"
                onClick={() => router.push('/TaiKhoan?form=THEM')}
              >
                <Plus className="h-4 w-4" />
                Thêm tài khoản
              </Button>
            </div>
          </div>

          {/* Total Balance */}
          <div className="mt-6 p-5 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Tổng số dư</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
              </div>
              <p className="text-sm text-white/60">
                {accounts.length} tài khoản
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Account Cards */}
      <SlideUp>
        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8">
            <EmptyState
              icon="inbox"
              title="Chưa có tài khoản nào"
              description="Thêm tài khoản ngân hàng hoặc ví điện tử để bắt đầu quản lý tài chính."
              action={
                <Button
                  variant="success"
                  onClick={() => router.push('/TaiKhoan?form=THEM')}
                >
                  <Plus className="h-4 w-4" />
                  Thêm tài khoản
                </Button>
              }
            />
          </div>
        ) : (
          <DanhSachTaiKhoan accounts={accounts as any} onRefresh={fetchAccounts} />
        )}
      </SlideUp>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
          {/* bỏ hoàn toàn lớp nền mờ xung quanh form */}
          {/* <div className="absolute inset-0 bg-zinc-50/70" /> */}

          {/* khung form nằm trong khối vừa màn hình đang hiển thị */}
          <div className="relative w-fit max-w-3xl mt-10 max-h-[calc(100vh-120px)] overflow-y-auto">

            <FormTaiKhoan
              type={mode || 'THEM'}
              initialData={mode === 'CHINH_SUA' ? initialEditData : undefined}
              onClose={() => router.push('/TaiKhoan')}
              onSubmitSuccess={() => {
                console.log('Submit thành công, đang fetch lại...');
                fetchAccounts();
                router.push('/TaiKhoan');
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}

