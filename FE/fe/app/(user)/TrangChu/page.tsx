"use client";

import { useState, useEffect, useCallback } from 'react';
import TheTongQuan from '@/features/trangchu/thanh_phan/TheTongQuan';
import BieuDoChiTieu from '@/features/trangchu/thanh_phan/BieuDoChiTieu';
import BieuDoDanhMuc from '@/features/trangchu/thanh_phan/BieuDoDanhMuc';
import MucTieuNganSach from '@/features/trangchu/thanh_phan/MucTieuNganSach';
import BangGiaoDich from '@/features/trangchu/thanh_phan/BangGiaoDich';
import SoDuTaiKhoan from '@/features/trangchu/thanh_phan/SoDuTaiKhoan';
import { layTongQuan } from '@/services/trangchu/tongquan';
import { layDanhSachTaiKhoan } from '@/services/taikhoan';
import { layGiaoDichGanNhat } from '@/services/giaodich/giaodich';
import type { TongHopThangType, NganSachType, MucTieuType } from '@/types/TrangChu';
import type { TaiKhoanDto, LoaiTaiKhoanType } from '@/types/TaiKhoan';
import type { loiKhuyenAIDto, TongQuanDto, GiaoDichDto, ThongKeDanhMucDto } from '@/types';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation';
import { Button } from '@/components/ui';

export default function TrangChuPage() {
  const [tongQuanData, setTongQuanData] = useState<TongQuanDto | null>(null);
  const [accounts, setAccounts] = useState<TaiKhoanDto[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [budgets, setBudgets] = useState<NganSachType[]>([]);
  const [goals, setGoals] = useState<MucTieuType[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<GiaoDichDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [tongquanResponse, accountsData, recentTx] = await Promise.all([
        layTongQuan(),
        layDanhSachTaiKhoan(),
        layGiaoDichGanNhat(3)
      ]);

      // Map accounts
      const accountsMapped: TaiKhoanDto[] = (Array.isArray(accountsData) ? accountsData : []).map((acc: any) => ({
        taiKhoanId: acc.taiKhoanId,
        nguoiDungId: acc.nguoiDungId ?? 0,
        tenTaiKhoan: acc.tenTaiKhoan,
        loaiTaiKhoan: acc.loaiTaiKhoan,
        soDu: acc.soDu ?? 0,
        laMacDinh: acc.laMacDinh ?? false,
        moTa: acc.moTa,
      }));

      // Map chart data
      let chartMapped: any = null;
      const bieuDoChiTieu = Array.isArray(tongquanResponse?.bieuDoChiTieu) ? tongquanResponse.bieuDoChiTieu : [];
      if (bieuDoChiTieu.length > 0) {
        const labels = bieuDoChiTieu.map((item: any) => `T${item.thang}`);
        const thuData = bieuDoChiTieu.map((item: any) => Number(item.tongThu) || 0);
        const chiData = bieuDoChiTieu.map((item: any) => Number(item.tongChi) || 0);
        chartMapped = {
          Labels: labels,
          Series: [
            { name: 'Thu', data: thuData },
            { name: 'Chi', data: chiData }
          ]
        };
      }

      // Map category chart data (chi theo danh muc - thang hien tai)
      const danhMucData = Array.isArray(tongquanResponse?.bieuDoDanhMuc) 
        ? tongquanResponse.bieuDoDanhMuc
            .map((d: ThongKeDanhMucDto) => ({
              name: d.tenDanhMuc || 'Khác',
              value: Number(d.tongTien) || 0
            }))
        : [];
      setCategoryData(danhMucData);

      // Map budgets
      const budgetsMapped: NganSachType[] = (Array.isArray(tongquanResponse?.danhSachNganSach) ? tongquanResponse.danhSachNganSach : []).map((ns: any) => ({
        nganSachId: ns.nganSachId,
        tenDanhMuc: ns.tenDanhMuc,
        hanMuc: Number(ns.hanMuc ?? 0),
        daDung: Number(ns.daDung ?? 0),
        thang: ns.thang ?? new Date().getMonth() + 1,
        nam: ns.nam ?? new Date().getFullYear(),
        mauSac: ns.mauSac,
      }));

      // Map goals
      const goalsMapped: MucTieuType[] = (Array.isArray(tongquanResponse?.danhSachMucTieu) ? tongquanResponse.danhSachMucTieu : []).map((mt: any) => ({
        mucTieuId: mt.mucTieuId,
        tenMucTieu: mt.tenMucTieu,
        soTienMucTieu: Number(mt.soTienMucTieu ?? 0),
        soTienHienTai: Number(mt.soTienHienTai ?? 0),
        ngayBatDau: mt.ngayBatDau,
        ngayKetThuc: mt.ngayKetThuc,
        icon: mt.icon,
        mauSac: mt.mauSac,
        trangThai: mt.trangThai,
      }));

      // Map recent transactions
      const recentTxMapped: GiaoDichDto[] = Array.isArray(recentTx) ? recentTx : [];

      setTongQuanData(tongquanResponse);
      setChartData(chartMapped);
      setBudgets(budgetsMapped);
      setGoals(goalsMapped);
      setAccounts(accountsMapped);
      setRecentTransactions(recentTxMapped);
    } catch (err) {
      console.error('Lỗi load dữ liệu:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="fe-page-shell space-y-12">
        <section className="space-y-4 text-center lg:text-left">
          <div className="space-y-4">
            <div className="h-4 w-40 fe-skeleton rounded"></div>
            <div className="h-12 w-96 max-w-full fe-skeleton rounded"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="h-12 w-48 fe-skeleton rounded-full"></div>
              <div className="h-12 w-44 fe-skeleton rounded-full"></div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="fe-card-fe p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 fe-skeleton rounded-[12px]"></div>
                <div className="w-16 h-6 fe-skeleton rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 fe-skeleton rounded"></div>
                <div className="h-8 w-32 fe-skeleton rounded"></div>
                <div className="h-2 w-20 fe-skeleton rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-32 fe-skeleton rounded-[20px]"></div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="fe-card-fe p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-40 fe-skeleton rounded"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 fe-skeleton rounded-full"></div>
                  <div className="h-8 w-20 fe-skeleton rounded-full"></div>
                </div>
              </div>
              <div className="flex items-end gap-2 h-64">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 fe-skeleton rounded-t"
                    style={{ height: `${45 + (i % 3) * 15}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 fe-skeleton rounded-[20px]"></div>
            <div className="h-80 fe-skeleton rounded-[20px]"></div>
          </div>
        </div>
      </div>
    );
  }

  const tongquan: TongHopThangType = {
    tongThu: tongQuanData?.tongThu ?? 0,
    tongChi: tongQuanData?.tongChi ?? 0,
    tietKiem: (tongQuanData?.tongThu ?? 0) - (tongQuanData?.tongChi ?? 0),
    soDuThuan: tongQuanData?.soDuThuan ?? 0,
  };

  return (
    <div className="fe-page-shell space-y-12">
      <section className="space-y-4 text-center lg:text-left">
        <FadeIn delay={0}>
          <p className="text-base font-medium uppercase tracking-wider"
            style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)' }}>
            Tổng quan tài chính
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 className="text-4xl lg:text-6xl font-medium uppercase tracking-tight leading-none"
            style={{ 
              fontFamily: 'Aeonik Pro, Inter, sans-serif',
              color: 'var(--text-primary)'
            }}
          >
            Theo dõi dòng tiền rõ ràng.
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/GiaoDich">
              <Button variant="success">
                Thêm giao dịch mới
              </Button>
            </Link>
            <Link href="/BaoCaoThongKe">
              <Button variant="secondary">
                Xem báo cáo
              </Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      {tongquan && <TheTongQuan data={tongquan} />}

      {<SoDuTaiKhoan accounts={accounts} />}

      <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 space-y-6">
          <FadeIn delay={0.3}>
            <BieuDoChiTieu 
              tongThu={tongQuanData?.tongThu} 
              tongChi={tongQuanData?.tongChi} 
            />
          </FadeIn>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <StaggerContainer staggerDelay={0.15}>
            <StaggerItem>
              <BieuDoDanhMuc data={categoryData} />
            </StaggerItem>
            <StaggerItem>
              <MucTieuNganSach budgets={budgets} goals={goals} />
            </StaggerItem>
            <StaggerItem>
              <BangGiaoDich transactions={recentTransactions} />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
