"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Wallet,
  PieChart,
  Target,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  PiggyBank,
  CreditCard,
  Layers,
  AlertCircle,
  History,
  Smartphone,
  Globe,
  Bot,
  Upload,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  layBaoCaoTongHop,
  layBaoCaoBieuDo,
  layBaoCaoPhanBoDanhMuc,
  layBaoCaoTaiKhoan,
  layBaoCaoDanhMuc,
  layBaoCaoNganSach,
  layBaoCaoMucTieu,
  DurationType,
} from '@/dich_vu/baocao/baocao';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const COLORS = {
  primary: '#494fdf',
  success: '#00a87e',
  danger: '#e23b4a',
  warning: '#ec7e00',
  purple: '#7c3aed',
};

const PIE_COLORS = ['#494fdf', '#00a87e', '#e23b4a', '#ec7e00', '#7c3aed', '#f59e0b', '#06b6d4', '#8b5cf6'];

const formatCurrency = (amount: number, short = false) => {
  if (short) {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(1) + 'B';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return (amount / 1000).toFixed(1) + 'K';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

const TABS = [
  { id: 'giao-dich', label: 'Giao dịch', icon: BarChart3 },
  { id: 'tai-khoan', label: 'Tài khoản', icon: Wallet },
  { id: 'danh-muc', label: 'Danh mục', icon: PieChart },
  { id: 'ngan-sach', label: 'Ngân sách', icon: Target },
  { id: 'muc-tieu', label: 'Mục tiêu', icon: PiggyBank },
];

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export default function BaoCaoThongKePage() {
  const [activeTab, setActiveTab] = useState('giao-dich');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date().getMonth() + 1);
    setCurrentYear(new Date().getFullYear());
  };

  return (
    <div className="fe-page-shell">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Báo cáo chi tiết
          </p>
          <h1 className="text-3xl lg:text-4xl font-medium uppercase tracking-tight"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', color: 'var(--text-primary)' }}>
            Thống kê <span style={{ color: COLORS.primary }}>& Phân tích</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
          <button onClick={goToPrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <ChevronLeft className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
          </button>
          <button onClick={goToCurrentMonth} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium"
            style={{ color: 'var(--text-primary)' }}>
            {MONTHS[currentMonth - 1]} {currentYear}
          </button>
          <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
            <ChevronRight className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ background: activeTab === tab.id ? COLORS.primary : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--text-muted)' }}>
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'giao-dich' && <GiaoDichReport month={currentMonth} year={currentYear} />}
        {activeTab === 'tai-khoan' && <TaiKhoanReport month={currentMonth} year={currentYear} />}
        {activeTab === 'danh-muc' && <DanhMucReport month={currentMonth} year={currentYear} />}
        {activeTab === 'ngan-sach' && <NganSachReport month={currentMonth} year={currentYear} />}
        {activeTab === 'muc-tieu' && <MucTieuReport />}
      </div>
    </div>
  );
}

function GiaoDichReport({ month, year }: { month: number; year: number }) {
  const [tongHop, setTongHop] = useState<any>(null);
  const [bieuDo, setBieuDo] = useState<any>({ labels: [], series: [] });
  const [phanBoChi, setPhanBoChi] = useState<any>({ labels: [], series: [] });
  const [phanBoThu, setPhanBoThu] = useState<any>({ labels: [], series: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const timeParams = { duration: 'month' as DurationType, thang: month, nam: year };
      
      const [th, bd, pc, pt] = await Promise.all([
        layBaoCaoTongHop(timeParams),
        layBaoCaoBieuDo(timeParams),
        layBaoCaoPhanBoDanhMuc(timeParams, 'CHI'),
        layBaoCaoPhanBoDanhMuc(timeParams, 'THU'),
      ]);
      
      setTongHop(th);
      setBieuDo(bd && typeof bd === 'object' ? bd : { labels: [], series: [] });
      setPhanBoChi(pc && typeof pc === 'object' ? pc : { labels: [], series: [] });
      setPhanBoThu(pt && typeof pt === 'object' ? pt : { labels: [], series: [] });
    } catch (error) {
      console.error('Lỗi tải báo cáo giao dịch:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const chartOptions = {
    chart: { type: 'line' as const, height: 300, toolbar: { show: false }, zoom: { enabled: false } },
    colors: [COLORS.success, COLORS.danger],
    stroke: { curve: 'smooth' as const, width: 3 },
    fill: { type: 'gradient' as const, gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: true }, axisBorder: { show: false } },
    yaxis: { labels: { formatter: (val: number) => formatCurrency(val, true) } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
    tooltip: { theme: 'light', y: { formatter: (val: number) => formatCurrency(val) } },
  };

  const pieOptions = (labels: string[], series: number[]) => ({
    chart: { type: 'donut' as const, height: 280 },
    colors: PIE_COLORS,
    labels: labels,
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: { pie: { donut: { size: '70%' } } },
    legend: { position: 'right' as const, fontSize: '11px' },
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin" style={{ color: COLORS.primary }} /></div>;
  }

  const tienKiem = (tongHop?.tongThu || 0) - (tongHop?.tongChi || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Tổng thu" value={tongHop?.tongThu || 0} icon={<TrendingUp className="h-5 w-5" />} color={COLORS.success} isCurrency />
        <SummaryCard title="Tổng chi" value={tongHop?.tongChi || 0} icon={<TrendingDown className="h-5 w-5" />} color={COLORS.danger} isCurrency />
        <SummaryCard title="Tiết kiệm" value={tienKiem} icon={<PiggyBank className="h-5 w-5" />} color={COLORS.primary} isCurrency />
        <SummaryCard title="Số giao dịch" value={tongHop?.soGiaoDich || 0} icon={<BarChart3 className="h-5 w-5" />} color={COLORS.purple} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="h-5 w-5" style={{ color: COLORS.primary }} />
            Thu/Chi theo tháng
          </h3>
          {bieuDo.labels?.length > 0 ? (
            <Chart options={{ ...chartOptions, xaxis: { ...chartOptions.xaxis, categories: bieuDo.labels } }} series={bieuDo.series || []} type="area" height={280} />
          ) : (
            <EmptyChart />
          )}
        </div>

        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <PieChart className="h-5 w-5" style={{ color: COLORS.primary }} />
            Phân bổ nguồn tạo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <SourceCard icon={<Globe className="h-6 w-6" />} label="Web" value={0} color={COLORS.primary} />
            <SourceCard icon={<Smartphone className="h-6 w-6" />} label="Mobile" value={0} color={COLORS.success} />
            <SourceCard icon={<Bot className="h-6 w-6" />} label="AI" value={0} color={COLORS.warning} />
            <SourceCard icon={<Upload className="h-6 w-6" />} label="Import" value={0} color={COLORS.purple} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingDown className="h-5 w-5" style={{ color: COLORS.danger }} />
            Chi theo danh mục
          </h3>
          {phanBoChi.labels?.length > 0 ? (
            <Chart options={pieOptions(phanBoChi.labels, phanBoChi.series)} series={phanBoChi.series} type="donut" height={280} />
          ) : (
            <EmptyChart label="Chưa có chi tiêu" />
          )}
        </div>

        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp className="h-5 w-5" style={{ color: COLORS.success }} />
            Thu theo danh mục
          </h3>
          {phanBoThu.labels?.length > 0 ? (
            <Chart options={pieOptions(phanBoThu.labels, phanBoThu.series)} series={phanBoThu.series} type="donut" height={280} />
          ) : (
            <EmptyChart label="Chưa có thu nhập" />
          )}
        </div>
      </div>
    </div>
  );
}

function TaiKhoanReport({ month, year }: { month: number; year: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const timeParams = { duration: 'month' as DurationType, thang: month, nam: year };
      const baoCao = await layBaoCaoTaiKhoan(timeParams);
      setData(baoCao);
    } catch (error) {
      console.error('Lỗi tải báo cáo tài khoản:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pieOptions = {
    chart: { type: 'donut' as const, height: 280 },
    colors: PIE_COLORS,
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: { pie: { donut: { size: '70%' } } },
    legend: { position: 'right' as const },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin" style={{ color: COLORS.primary }} /></div>;
  }

  const phanBo = data?.phanBoTheoLoai || [];
  const danhSach = data?.danhSachTaiKhoan || [];

  return (
    <div className="space-y-6">
      <div className="fe-card-fe p-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl" style={{ background: COLORS.primary + '20' }}>
            <Wallet className="h-8 w-8" style={{ color: COLORS.primary }} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Tổng tài sản</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(data?.tongTaiSan || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <PieChart className="h-5 w-5" style={{ color: COLORS.primary }} />
            Phân bổ theo loại tài khoản
          </h3>
          {phanBo.length > 0 ? (
            <Chart options={{ ...pieOptions, labels: phanBo.map((x: any) => x.tenLoai) }} series={phanBo.map((x: any) => x.tongSoDu)} type="donut" height={280} />
          ) : (
            <EmptyChart label="Chưa có tài khoản" />
          )}
        </div>

        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CreditCard className="h-5 w-5" style={{ color: COLORS.primary }} />
            Danh sách tài khoản
          </h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {danhSach.length > 0 ? danhSach.map((acc: any) => (
              <div key={acc.taiKhoanId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{acc.tenTaiKhoan}</p>
                  <p className="text-xs text-muted-foreground">{acc.tenLoaiTaiKhoan}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: COLORS.success }}>{formatCurrency(acc.soDuHienTai)}</p>
                  <p className={`text-xs ${acc.bienDong >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {acc.bienDong >= 0 ? '+' : ''}{formatCurrency(acc.bienDong)}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center py-8 text-muted-foreground">Chưa có tài khoản</p>
            )}
          </div>
        </div>
      </div>

      {danhSach.some((a: any) => a.hanMuc) && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertCircle className="h-5 w-5" style={{ color: COLORS.warning }} />
            Tỷ lệ sử dụng hạn mức thẻ tín dụng
          </h3>
          <div className="space-y-4">
            {danhSach.filter((a: any) => a.hanMuc).map((acc: any) => (
              <div key={acc.taiKhoanId} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-primary)' }}>{acc.tenTaiKhoan}</span>
                  <span className="font-medium" style={{ color: COLORS.primary }}>
                    {formatCurrency(acc.daSuDung)} / {formatCurrency(acc.hanMuc)} ({acc.tyLeSuDung}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(acc.tyLeSuDung, 100)}%`,
                      background: acc.tyLeSuDung > 80 ? COLORS.danger : acc.tyLeSuDung > 50 ? COLORS.warning : COLORS.success,
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DanhMucReport({ month, year }: { month: number; year: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedParent, setExpandedParent] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const timeParams = { duration: 'month' as DurationType, thang: month, nam: year };
      const baoCao = await layBaoCaoDanhMuc(timeParams);
      setData(baoCao);
    } catch (error) {
      console.error('Lỗi tải báo cáo danh mục:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin" style={{ color: COLORS.primary }} /></div>;
  }

  const chiTieu = data?.chiTieuTheoDanhMuc || [];
  const soSanh = data?.soSanhThangTruoc || [];
  const danhMucCha = data?.danhMucCha || [];
  const topDanhMuc = data?.topDanhMuc || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="fe-card-fe p-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Tổng chi tiêu</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.danger }}>{formatCurrency(data?.tongChiTieu || 0)}</p>
        </div>
        <div className="fe-card-fe p-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Số giao dịch</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{formatNumber(data?.soGiaoDich || 0)}</p>
        </div>
      </div>

      {topDanhMuc.length > 0 && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingDown className="h-5 w-5" style={{ color: COLORS.danger }} />
            Top 5 danh mục chi nhiều nhất
          </h3>
          <div className="space-y-3">
            {topDanhMuc.slice(0, 5).map((item: any, idx: number) => (
              <div key={item.danhMucId} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.tenDanhMuc}</span>
                    <span className="font-semibold" style={{ color: COLORS.danger }}>{formatCurrency(item.tongTien)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.tyLe}%`, background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{item.tyLe}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {soSanh.length > 0 && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ArrowRight className="h-5 w-5" style={{ color: COLORS.primary }} />
            So sánh với tháng trước
          </h3>
          <div className="space-y-3">
            {soSanh.map((item: any) => {
              const isIncrease = item.chenhLech > 0;
              return (
                <div key={item.danhMucId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.tenDanhMuc}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatCurrency(item.tienThangTruoc)} → {formatCurrency(item.tienThangNay)}</span>
                    <span className={`flex items-center gap-1 text-sm font-medium ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                      {isIncrease ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {Math.abs(item.tyLeThayDoi).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {danhMucCha.length > 0 && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Layers className="h-5 w-5" style={{ color: COLORS.primary }} />
            Chi tiết theo danh mục cha-con
          </h3>
          <div className="space-y-2">
            {danhMucCha.map((parent: any) => (
              <div key={parent.danhMucId} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedParent(expandedParent === parent.danhMucId ? null : parent.danhMucId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{parent.tenDanhMuc}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {parent.danhMucCon?.length || 0} danh mục con
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold" style={{ color: COLORS.danger }}>{formatCurrency(parent.tongTien)}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${expandedParent === parent.danhMucId ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedParent === parent.danhMucId && parent.danhMucCon?.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    {parent.danhMucCon.map((child: any) => (
                      <div key={child.danhMucId} className="flex items-center justify-between py-2">
                        <span className="text-sm pl-4" style={{ color: 'var(--text-primary)' }}>{child.tenDanhMuc}</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">{child.soGiaoDich} GD</span>
                          <span className="font-medium" style={{ color: COLORS.danger }}>{formatCurrency(child.tongTien)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {chiTieu.length === 0 && soSanh.length === 0 && danhMucCha.length === 0 && (
        <EmptyChart label="Chưa có dữ liệu chi tiêu" />
      )}
    </div>
  );
}

function NganSachReport({ month, year }: { month: number; year: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const baoCao = await layBaoCaoNganSach(month, year);
      setData(baoCao);
    } catch (error) {
      console.error('Lỗi tải báo cáo ngân sách:', error);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin" style={{ color: COLORS.primary }} /></div>;
  }

  const chiTiet = data?.chiTietNganSach || [];
  const canhBao = data?.canhBao || [];
  const lichSu = data?.lichSuThucHien || [];
  const tyLe = data?.tyLeTuanThu || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="fe-card-fe p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Tổng hạn mức</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(data?.tongHanMuc || 0)}</p>
        </div>
        <div className="fe-card-fe p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Đã sử dụng</p>
          <p className="text-2xl font-bold" style={{ color: COLORS.danger }}>{formatCurrency(data?.tongDaSuDung || 0)}</p>
        </div>
        <div className="fe-card-fe p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Còn lại</p>
          <p className="text-2xl font-bold" style={{ color: COLORS.success }}>{formatCurrency(data?.tongConLai || 0)}</p>
        </div>
        <div className="fe-card-fe p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Tỷ lệ tuân thủ</p>
          <p className="text-2xl font-bold" style={{ color: tyLe >= 80 ? COLORS.success : tyLe >= 50 ? COLORS.warning : COLORS.danger }}>{tyLe}%</p>
        </div>
      </div>

      {chiTiet.length > 0 && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Target className="h-5 w-5" style={{ color: COLORS.primary }} />
            Tiến độ ngân sách tháng
          </h3>
          <div className="space-y-4">
            {chiTiet.map((item: any) => {
              const isOver = item.laVuot;
              const isWarning = item.tyLeSuDung >= 80 && !isOver;
              return (
                <div key={item.nganSachId} className={`p-4 rounded-xl ${isOver ? 'bg-red-50 dark:bg-red-900/20' : isWarning ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.tenDanhMuc}</span>
                    <span className="text-sm font-medium" style={{ color: isOver ? COLORS.danger : 'var(--text-muted)' }}>
                      {formatCurrency(item.daSuDung)} / {formatCurrency(item.hanMuc)}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(item.tyLeSuDung, 100)}%`,
                        background: isOver ? COLORS.danger : isWarning ? COLORS.warning : COLORS.success,
                      }} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={isOver ? 'text-red-500 font-medium' : 'text-muted-foreground'}>{item.tyLeSuDung.toFixed(1)}% đã dùng</span>
                    <span className={isOver ? 'text-red-500 font-medium' : 'text-green-500'}>
                      {isOver ? 'Đã vượt ' + formatCurrency(Math.abs(item.conLai)) : 'Còn ' + formatCurrency(item.conLai)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {canhBao.length > 0 && (
        <div className="fe-card-fe p-6 border-l-4" style={{ borderColor: COLORS.warning }}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: COLORS.warning }}>
            <AlertTriangle className="h-5 w-5" />
            Cảnh báo vượt ngân sách
          </h3>
          <div className="space-y-2">
            {canhBao.map((item: any) => (
              <div key={item.danhMucId} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.tenDanhMuc}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.mucDo === 'VUOT' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                }`}>
                  {item.mucDo === 'VUOT' ? 'Đã vượt' : 'Gần vượt'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lichSu.length > 0 && (
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <History className="h-5 w-5" style={{ color: COLORS.primary }} />
            Lịch sử thực hiện ngân sách
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tháng</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Hạn mức</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Đã dùng</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {lichSu.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>Tháng {item.thang}/{item.nam}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.tongHanMuc)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(item.tongDaSuDung)}</td>
                    <td className="py-3 px-4 text-center">
                      {item.coVuot ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-full text-xs font-medium">Vượt</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full text-xs font-medium">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {chiTiet.length === 0 && canhBao.length === 0 && (
        <EmptyChart label="Chưa có ngân sách" />
      )}
    </div>
  );
}

function MucTieuReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const baoCao = await layBaoCaoMucTieu();
      setData(baoCao);
    } catch (error) {
      console.error('Lỗi tải báo cáo mục tiêu:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin" style={{ color: COLORS.primary }} /></div>;
  }

  const danhSach = data?.danhSachMucTieu || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fe-card-fe p-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Tổng mục tiêu</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{data?.tongMucTieu || 0}</p>
        </div>
        <div className="fe-card-fe p-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Đã hoàn thành</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.success }}>{data?.mucTieuHoanThanh || 0}</p>
        </div>
        <div className="fe-card-fe p-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Tổng đã tiết kiệm</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>{formatCurrency(data?.tongDaTietKiem || 0)}</p>
        </div>
      </div>

      {danhSach.length > 0 ? (
        <div className="space-y-4">
          {danhSach.map((goal: any) => {
            const progressColor = goal.daHoanThanh ? COLORS.success : goal.tyLeHoanThanh >= 50 ? COLORS.warning : COLORS.primary;
            return (
              <div key={goal.mucTieuId} className="fe-card-fe p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{goal.tenMucTieu}</h3>
                    <p className="text-sm text-muted-foreground">{goal.moTa || 'Không có mô tả'}</p>
                  </div>
                  {goal.daHoanThanh && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Hoàn thành
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: COLORS.success }}>{formatCurrency(goal.daDat)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(goal.mucTieu)}</span>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(goal.tyLeHoanThanh, 100)}%`, background: progressColor }} />
                  </div>
                  <p className="text-xs text-right mt-1" style={{ color: progressColor }}>{goal.tyLeHoanThanh.toFixed(1)}% hoàn thành</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-muted-foreground">Còn thiếu</p>
                    <p className="font-semibold" style={{ color: COLORS.danger }}>{formatCurrency(goal.conLai)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-muted-foreground">Tr.bình/tháng</p>
                    <p className="font-semibold" style={{ color: COLORS.primary }}>{formatCurrency(goal.trungBinhThang)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-muted-foreground">Hạn chót</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {goal.hanChot ? new Date(goal.hanChot).toLocaleDateString('vi-VN') : 'Không có'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-muted-foreground">Dự kiến đạt</p>
                    <p className="font-semibold" style={{ color: goal.ngayDuKien ? COLORS.success : COLORS.warning }}>
                      {goal.ngayDuKien ? new Date(goal.ngayDuKien).toLocaleDateString('vi-VN') : 'Chậm'}
                    </p>
                  </div>
                </div>

                {goal.lichSuDongGop?.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      <History className="h-4 w-4 inline mr-1" />
                      Lịch sử đóng góp
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {goal.lichSuDongGop.map((log: any, idx: number) => (
                        <div key={log.dongGopId || idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-muted-foreground">{new Date(log.ngayTao).toLocaleDateString('vi-VN')}</span>
                          <span className="font-medium" style={{ color: COLORS.success }}>+{formatCurrency(log.soTien)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyChart label="Chưa có mục tiêu tiết kiệm" />
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color, isCurrency }: {
  title: string; value: number; icon: React.ReactNode; color: string; isCurrency?: boolean;
}) {
  return (
    <div className="fe-card-fe p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {isCurrency ? formatCurrency(value) : formatNumber(value)}
          </p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: color + '20' }}>{icon}</div>
      </div>
    </div>
  );
}

function SourceCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-xl text-center" style={{ background: color + '10' }}>
      <div className="mx-auto mb-2" style={{ color }}>{icon}</div>
      <p className="text-2xl font-bold" style={{ color }}>{formatNumber(value)}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyChart({ label = 'Chưa có dữ liệu' }: { label?: string }) {
  return (
    <div className="h-[280px] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
      <BarChart3 className="h-12 w-12 mb-3 text-gray-300 dark:text-gray-600" />
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
