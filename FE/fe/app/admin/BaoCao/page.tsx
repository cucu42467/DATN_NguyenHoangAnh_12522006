"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CreditCard,
  Bell,
  ShieldAlert,
  Download,
  Calendar,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  UsersRound,
  Smartphone,
  Globe,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Database,
  Shield,
  Eye,
  Mail,
  Phone,
  Fingerprint,
  Monitor,
  Tablet,
  Activity,
  LogIn,
  Settings,
  Trash2,
  Edit,
  Plus,
  RefreshCcw,
  PieChart
} from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  layDashboardTongHop,
  layThongKeNguoiDungFull,
  layNguoiDungMoiTheoThoiGian,
  layThongKeThietBi,
  layDAUMAU,
  layNguoiDungKhongHoatDong,
  layThongKeGiaoDichFull,
  layGiaoDichTheoDanhMuc,
  layGiaoDichDinhKyThongKe,
  layThongKeThongBao,
  layThongKePhanHoi,
  layThongKeBaoMat,
  layDangNhapThatBai,
  layHoatDongBatThuong,
} from '@/services/admin/baocao';
import { layThongKeGiaoDich6Thang, layChiTieuDanhMuc } from '@/services/admin/dashboard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Màu sắc
const COLORS = {
  primary: '#494fdf',
  success: '#00a87e',
  danger: '#e23b4a',
  warning: '#ec7e00',
  purple: '#7c3aed'
};

const PIE_COLORS = ['#494fdf', '#00a87e', '#e23b4a', '#ec7e00', '#7c3aed', '#f59e0b'];

// Định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

// Định dạng số
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

const tabs = [
  { id: 'nguoi-dung', label: 'Người dùng', icon: <Users className="h-5 w-5" /> },
  { id: 'giao-dich', label: 'Giao dịch', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'thong-bao', label: 'Thông báo & Phản hồi', icon: <Bell className="h-5 w-5" /> },
  { id: 'bao-mat', label: 'Bảo mật & Audit', icon: <ShieldAlert className="h-5 w-5" /> },
];

export default function BaoCaoPage() {
  const [activeTab, setActiveTab] = useState('nguoi-dung');
  const [dateRange, setDateRange] = useState('thang-nay');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 1500);
  };

  const dateRangeOptions = [
    { value: 'hom-nay', label: 'Hôm nay' },
    { value: 'tuan-nay', label: 'Tuần này' },
    { value: 'thang-nay', label: 'Tháng này' },
    { value: 'quy-nay', label: 'Quý này' },
    { value: 'nam-nay', label: 'Năm này' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-medium uppercase tracking-tight leading-none text-[#191c1f]"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            Báo cáo <span className="text-[#494fdf]">& Thống kê</span>
          </h1>
          <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-2 mt-2">
            <FileText className="h-4 w-4 text-[#494fdf]" />
            Phân tích toàn diện hệ thống tài chính
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-[#c9c9cd] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[#191c1f] focus:outline-none focus:ring-2 focus:ring-[#494fdf]/30 focus:border-[#494fdf] cursor-pointer hover:border-[#494fdf]/50 transition-all"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8d969e] pointer-events-none" />
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#494fdf] text-white rounded-xl text-sm font-medium hover:bg-[#3d40c9] disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {isExporting ? <><RefreshCw className="h-4 w-4 animate-spin" /> Đang xuất...</> : <><Download className="h-4 w-4" /> Xuất báo cáo</>}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#e5e7eb]">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-[#494fdf]' : 'text-[#8d969e] hover:text-[#191c1f]'}`}
            >
              <span className={activeTab === tab.id ? 'text-[#494fdf]' : 'text-[#8d969e]'}>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#494fdf] rounded-full" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'nguoi-dung' && <NguoiDungTabContent />}
        {activeTab === 'giao-dich' && <GiaoDichTabContent />}
        {activeTab === 'thong-bao' && <ThongBaoPhanHoiTabContent />}
        {activeTab === 'bao-mat' && <BaoMatAuditTabContent />}
      </div>
    </div>
  );
}

// ==================== COMPONENTS ====================

function StatCard({ title, value, icon, bgColor, trend }: any) {
  return (
    <div className="fe-card-fe p-5 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-[#8d969e] uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-[#191c1f] mt-1">{value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-[#00a87e]' : 'text-[#e23b4a]'}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
    </div>
  );
}

function DeviceBar({ name, value, percent, color }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs font-medium text-[#8d969e] truncate">{name}</div>
      <div className="flex-1 h-6 bg-[#f3f4f6] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
      <div className="w-20 text-right">
        <span className="text-xs font-semibold text-[#191c1f]">{value}</span>
        <span className="text-xs text-[#8d969e] ml-1">({percent}%)</span>
      </div>
    </div>
  );
}

// ==================== TAB: NGƯỜI DÙNG ====================

function NguoiDungTabContent() {
  const [loading, setLoading] = useState(true);
  const [thongKe, setThongKe] = useState<any>(null);
  const [nguoiDungMoi, setNguoiDungMoi] = useState<any[]>([]);
  const [thietBi, setThietBi] = useState<any[]>([]);
  const [dauMau, setDauMau] = useState<any>(null);
  const [khongHoatDong, setKhongHoatDong] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tk, ndm, tb, dm, khd] = await Promise.all([
        layThongKeNguoiDungFull(),
        layNguoiDungMoiTheoThoiGian('thang'),
        layThongKeThietBi(),
        layDAUMAU(),
        layNguoiDungKhongHoatDong(30),
      ]);
      setThongKe(tk);
      setNguoiDungMoi(ndm);
      setThietBi(tb);
      setDauMau(dm);
      setKhongHoatDong(khd);
    } catch (error) {
      console.error('Lỗi tải dữ liệu người dùng:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const chartOptions: any = {
    chart: { type: 'area', height: 280, toolbar: { show: false }, sparkline: { enabled: false } },
    colors: [COLORS.primary],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 100] } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { labels: { show: true }, axisBorder: { show: false } },
    yaxis: { labels: { formatter: (val: number) => Math.round(val).toString() } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
    tooltip: { theme: 'light' },
  };

  const pieOptions: any = {
    chart: { type: 'donut', height: 280 },
    colors: PIE_COLORS,
    labels: thietBi.map((x: any) => x.Ten),
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: { pie: { donut: { size: '70%' } } },
    legend: { position: 'right', fontSize: '12px' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-[#494fdf]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng người dùng" value={formatNumber(thongKe?.TongNguoiDung || 0)} icon={<Users className="h-5 w-5 text-[#494fdf]" />} bgColor="bg-[#494fdf]/10" />
        <StatCard title="Đang hoạt động" value={formatNumber(thongKe?.DangHoatDong || 0)} icon={<UsersRound className="h-5 w-5 text-[#00a87e]" />} bgColor="bg-[#00a87e]/10" />
        <StatCard title="Đã xác thực Email" value={formatNumber(thongKe?.EmailDaXacThuc || 0)} icon={<CheckCircle className="h-5 w-5 text-[#ec7e00]" />} bgColor="bg-[#ec7e00]/10" />
        <StatCard title="Bật 2FA" value={formatNumber(thongKe?.Dang2FA || 0)} icon={<Fingerprint className="h-5 w-5 text-[#7c3aed]" />} bgColor="bg-[#7c3aed]/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#494fdf]" />
            Người dùng mới theo tháng
          </h3>
          {nguoiDungMoi.length > 0 ? (
            <Chart
              options={{ ...chartOptions, xaxis: { ...chartOptions.xaxis, categories: nguoiDungMoi.map((x: any) => x.Thang || x.Ngay || x.Tuan) } }}
              series={[{ name: 'Người dùng mới', data: nguoiDungMoi.map((x: any) => x.SoLuong) }]}
              type="area"
              height={280}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#8d969e] bg-[#fafafa] rounded-xl border-2 border-dashed border-[#e5e7eb]">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Device Distribution */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#00a87e]" />
            Thiết bị & Hệ điều hành
          </h3>
          {thietBi.length > 0 ? (
            <Chart
              options={pieOptions}
              series={thietBi.map((x: any) => x.SoLuong)}
              type="donut"
              height={280}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#8d969e] bg-[#fafafa] rounded-xl border-2 border-dashed border-[#e5e7eb]">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Login */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4">Đăng nhập Social</h3>
          <div className="space-y-4">
            <DeviceBar name="Google" value={thongKe?.Google || 0} percent={thongKe?.TongNguoiDung ? Math.round((thongKe.Google / thongKe.TongNguoiDung) * 100) : 0} color={COLORS.danger} />
            <DeviceBar name="Facebook" value={thongKe?.Facebook || 0} percent={thongKe?.TongNguoiDung ? Math.round((thongKe.Facebook / thongKe.TongNguoiDung) * 100) : 0} color={COLORS.primary} />
          </div>
          <div className="mt-4 p-3 bg-[#fafafa] rounded-xl">
            <p className="text-sm text-[#8d969e]">Tổng social logins</p>
            <p className="text-xl font-bold text-[#494fdf]">{formatNumber(thongKe?.TongSocial || 0)}</p>
          </div>
        </div>

        {/* DAU/MAU */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4">DAU/MAU</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8d969e]">DAU (Hôm nay)</span>
              <span className="text-xl font-bold text-[#494fdf]">{formatNumber(dauMau?.DAU || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8d969e]">MAU (Tháng này)</span>
              <span className="text-xl font-bold text-[#00a87e]">{formatNumber(dauMau?.MAU || 0)}</span>
            </div>
            <div className="pt-3 border-t border-[#e5e7eb]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#8d969e]">Tỷ lệ DAU/MAU</span>
                <span className="text-lg font-bold text-[#ec7e00]">{dauMau?.TyLe || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4">Xác thực</h3>
          <div className="space-y-4">
            <DeviceBar name="Email" value={thongKe?.EmailDaXacThuc || 0} percent={thongKe?.TongNguoiDung ? Math.round((thongKe.EmailDaXacThuc / thongKe.TongNguoiDung) * 100) : 0} color={COLORS.primary} />
            <DeviceBar name="SĐT" value={thongKe?.SDTDaXacThuc || 0} percent={thongKe?.TongNguoiDung ? Math.round((thongKe.SDTDaXacThuc / thongKe.TongNguoiDung) * 100) : 0} color={COLORS.success} />
            <DeviceBar name="2FA" value={thongKe?.Dang2FA || 0} percent={thongKe?.TongNguoiDung ? Math.round((thongKe.Dang2FA / thongKe.TongNguoiDung) * 100) : 0} color={COLORS.purple} />
          </div>
        </div>
      </div>

      {/* Inactive Users Table */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
          <UserX className="h-5 w-5 text-[#e23b4a]" />
          Người dùng không hoạt động ({khongHoatDong.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left py-3 px-4 font-medium text-[#8d969e]">Họ tên</th>
                <th className="text-left py-3 px-4 font-medium text-[#8d969e]">Email</th>
                <th className="text-left py-3 px-4 font-medium text-[#8d969e]">Đăng nhập cuối</th>
                <th className="text-right py-3 px-4 font-medium text-[#8d969e]">Số ngày</th>
              </tr>
            </thead>
            <tbody>
              {khongHoatDong.slice(0, 10).map((user: any) => (
                <tr key={user.NguoiDungId} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                  <td className="py-3 px-4 font-medium text-[#191c1f]">{user.HoTen}</td>
                  <td className="py-3 px-4 text-[#8d969e]">{user.Email}</td>
                  <td className="py-3 px-4 text-[#8d969e]">{user.LanDangNhapCuoi}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.SoNgayKhongHoatDong > 90 ? 'bg-[#e23b4a]/10 text-[#e23b4a]' : user.SoNgayKhongHoatDong > 60 ? 'bg-[#ec7e00]/10 text-[#ec7e00]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'}`}>
                      {user.SoNgayKhongHoatDong} ngày
                    </span>
                  </td>
                </tr>
              ))}
              {khongHoatDong.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-[#8d969e]">Không có người dùng không hoạt động</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB: GIAO DỊCH ====================

function GiaoDichTabContent() {
  const [loading, setLoading] = useState(true);
  const [thongKe, setThongKe] = useState<any>(null);
  const [giaoDichTheoDM, setGiaoDichTheoDM] = useState<any[]>([]);
  const [giaoDich6Thang, setGiaoDich6Thang] = useState<any[]>([]);
  const [dinhKy, setDinhKy] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tk, gdm, gd6t, dk] = await Promise.all([
        layThongKeGiaoDichFull(),
        layGiaoDichTheoDanhMuc(),
        layThongKeGiaoDich6Thang(),
        layGiaoDichDinhKyThongKe(),
      ]);
      setThongKe(tk);
      setGiaoDichTheoDM(gdm);
      setGiaoDich6Thang(gd6t);
      setDinhKy(dk);
    } catch (error) {
      console.error('Lỗi tải dữ liệu giao dịch:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const barOptions: any = {
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    colors: [COLORS.success, COLORS.danger],
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', endingShape: 'rounded' } },
    dataLabels: { enabled: false },
    xaxis: { labels: { rotate: -45 }, categories: giaoDich6Thang.map((x: any) => x.Thang) },
    yaxis: { labels: { formatter: (val: number) => formatCurrency(val) } },
    grid: { borderColor: '#f3f4f6' },
    legend: { position: 'top' },
  };

  const pieOptions: any = {
    chart: { type: 'donut', height: 300 },
    colors: PIE_COLORS,
    labels: giaoDichTheoDM.map((x: any) => x.TenDanhMuc),
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    plotOptions: { pie: { donut: { size: '65%' } } },
    legend: { position: 'right', fontSize: '11px' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-[#494fdf]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng giao dịch" value={formatNumber(thongKe?.TongGiaoDich || 0)} icon={<CreditCard className="h-5 w-5 text-[#494fdf]" />} bgColor="bg-[#494fdf]/10" />
        <StatCard title="Thành công" value={formatNumber(thongKe?.GiaoDichThanhCong || 0)} icon={<CheckCircle className="h-5 w-5 text-[#00a87e]" />} bgColor="bg-[#00a87e]/10" />
        <StatCard title="Tổng thu" value={formatCurrency(thongKe?.TongThu || 0)} icon={<TrendingUp className="h-5 w-5 text-[#ec7e00]" />} bgColor="bg-[#ec7e00]/10" />
        <StatCard title="Tổng chi" value={formatCurrency(thongKe?.TongChi || 0)} icon={<TrendingDown className="h-5 w-5 text-[#e23b4a]" />} bgColor="bg-[#e23b4a]/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction History */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#494fdf]" />
            Thu/Chi 6 tháng gần nhất
          </h3>
          {giaoDich6Thang.length > 0 ? (
            <Chart
              options={barOptions}
              series={[{ name: 'Thu', data: giaoDich6Thang.map((x: any) => x.TongThu) }, { name: 'Chi', data: giaoDich6Thang.map((x: any) => x.TongChi) }]}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-[#8d969e] bg-[#fafafa] rounded-xl border-2 border-dashed border-[#e5e7eb]">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#00a87e]" />
            Phân bổ theo danh mục
          </h3>
          {giaoDichTheoDM.length > 0 ? (
            <Chart options={pieOptions} series={giaoDichTheoDM.map((x: any) => x.TongTien)} type="donut" height={300} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-[#8d969e] bg-[#fafafa] rounded-xl border-2 border-dashed border-[#e5e7eb]">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>
      </div>

      {/* Source Distribution */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4">Phân bổ theo nguồn tạo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#494fdf]/5 rounded-xl text-center">
            <Monitor className="h-8 w-8 text-[#494fdf] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#191c1f]">{formatNumber(thongKe?.Web || 0)}</p>
            <p className="text-xs text-[#8d969e]">Web</p>
          </div>
          <div className="p-4 bg-[#00a87e]/5 rounded-xl text-center">
            <Smartphone className="h-8 w-8 text-[#00a87e] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#191c1f]">{formatNumber(thongKe?.Mobile || 0)}</p>
            <p className="text-xs text-[#8d969e]">Mobile</p>
          </div>
          <div className="p-4 bg-[#ec7e00]/5 rounded-xl text-center">
            <Activity className="h-8 w-8 text-[#ec7e00] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#191c1f]">{formatNumber(thongKe?.AI || 0)}</p>
            <p className="text-xs text-[#8d969e]">AI</p>
          </div>
          <div className="p-4 bg-[#7c3aed]/5 rounded-xl text-center">
            <Database className="h-8 w-8 text-[#7c3aed] mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#191c1f]">{formatNumber(thongKe?.Import || 0)}</p>
            <p className="text-xs text-[#8d969e]">Import</p>
          </div>
        </div>
      </div>

      {/* Regular Transaction Stats */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4">Giao dịch định kỳ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#00a87e]/5 rounded-xl">
            <p className="text-sm text-[#8d969e]">Đang hoạt động</p>
            <p className="text-3xl font-bold text-[#00a87e]">{formatNumber(dinhKy?.TongDangHoatDong || 0)}</p>
          </div>
          <div className="p-4 bg-[#e23b4a]/5 rounded-xl">
            <p className="text-sm text-[#8d969e]">Đã ngừng</p>
            <p className="text-3xl font-bold text-[#e23b4a]">{formatNumber(dinhKy?.TongNgungHoatDong || 0)}</p>
          </div>
          <div className="p-4 bg-[#494fdf]/5 rounded-xl">
            <p className="text-sm text-[#8d969e]">Người dùng sử dụng</p>
            <p className="text-3xl font-bold text-[#494fdf]">{formatNumber(dinhKy?.TongNguoiDungSuDung || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB: THÔNG BÁO & PHẢN HỒI ====================

function ThongBaoPhanHoiTabContent() {
  const [loading, setLoading] = useState(true);
  const [thongBao, setThongBao] = useState<any>(null);
  const [phanHoi, setPhanHoi] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tb, ph] = await Promise.all([
        layThongKeThongBao(),
        layThongKePhanHoi(),
      ]);
      setThongBao(tb);
      setPhanHoi(ph);
    } catch (error) {
      console.error('Lỗi tải dữ liệu thông báo:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-[#494fdf]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng thông báo" value={formatNumber(thongBao?.TongThongBao || 0)} icon={<Bell className="h-5 w-5 text-[#494fdf]" />} bgColor="bg-[#494fdf]/10" />
        <StatCard title="Đã đọc" value={formatNumber(thongBao?.DaDoc || 0)} icon={<Eye className="h-5 w-5 text-[#00a87e]" />} bgColor="bg-[#00a87e]/10" />
        <StatCard title="Chưa đọc" value={formatNumber(thongBao?.ChuaDoc || 0)} icon={<Clock className="h-5 w-5 text-[#ec7e00]" />} bgColor="bg-[#ec7e00]/10" />
        <StatCard title="Tỷ lệ đọc" value={`${thongBao?.TyLeDoc || 0}%`} icon={<CheckCircle className="h-5 w-5 text-[#7c3aed]" />} bgColor="bg-[#7c3aed]/10" />
      </div>

      {/* Notification by Type */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4">Tỷ lệ đọc theo loại thông báo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thongBao?.TheoLoai?.map((item: any, idx: number) => (
            <div key={idx} className="p-4 bg-[#fafafa] rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#191c1f]">{item.Loai}</span>
                <span className="text-lg font-bold" style={{ color: PIE_COLORS[idx % PIE_COLORS.length] }}>{item.TongSo}</span>
              </div>
              <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.TyLeDoc}%`, backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
              </div>
              <p className="text-xs text-[#8d969e] mt-1">{item.TyLeDoc}% đã đọc</p>
            </div>
          ))}
          {(!thongBao?.TheoLoai || thongBao.TheoLoai.length === 0) && (
            <p className="col-span-3 text-center py-8 text-[#8d969e]">Chưa có dữ liệu thông báo</p>
          )}
        </div>
      </div>

      {/* Feedback Stats */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4">Phản hồi & Góp ý</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-[#494fdf]/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#494fdf]">{formatNumber(phanHoi?.TongSo || 0)}</p>
            <p className="text-xs text-[#8d969e] mt-1">Tổng số</p>
          </div>
          <div className="p-4 bg-[#ec7e00]/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#ec7e00]">{formatNumber(phanHoi?.ChoXuLy || 0)}</p>
            <p className="text-xs text-[#8d969e] mt-1">Chờ xử lý</p>
          </div>
          <div className="p-4 bg-[#494fdf]/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#494fdf]">{formatNumber(phanHoi?.DangXuLy || 0)}</p>
            <p className="text-xs text-[#8d969e] mt-1">Đang xử lý</p>
          </div>
          <div className="p-4 bg-[#00a87e]/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#00a87e]">{formatNumber(phanHoi?.DaGiaiQuyet || 0)}</p>
            <p className="text-xs text-[#8d969e] mt-1">Đã giải quyết</p>
          </div>
          <div className="p-4 bg-[#e23b4a]/5 rounded-xl text-center">
            <p className="text-3xl font-bold text-[#e23b4a]">{formatNumber(phanHoi?.TuChoi || 0)}</p>
            <p className="text-xs text-[#8d969e] mt-1">Từ chối</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-[#fafafa] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8d969e]">Thời gian xử lý trung bình</span>
            <span className="text-lg font-bold text-[#494fdf]">{phanHoi?.ThoiGianXuLyTrungBinh || 0} giờ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TAB: BẢO MẬT & AUDIT ====================

function BaoMatAuditTabContent() {
  const [loading, setLoading] = useState(true);
  const [baoMat, setBaoMat] = useState<any>(null);
  const [dangNhapLoi, setDangNhapLoi] = useState<any[]>([]);
  const [batThuong, setBatThuong] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bm, dnLoi, bt] = await Promise.all([
        layThongKeBaoMat(),
        layDangNhapThatBai(20),
        layHoatDongBatThuong(),
      ]);
      setBaoMat(bm);
      setDangNhapLoi(dnLoi);
      setBatThuong(bt);
    } catch (error) {
      console.error('Lỗi tải dữ liệu bảo mật:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pieOptions: any = {
    chart: { type: 'pie', height: 280 },
    colors: [COLORS.success, COLORS.danger],
    labels: ['Thành công', 'Thất bại'],
    dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
    legend: { position: 'bottom' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-[#494fdf]" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng đăng nhập" value={formatNumber(baoMat?.TongDangNhap || 0)} icon={<LogIn className="h-5 w-5 text-[#494fdf]" />} bgColor="bg-[#494fdf]/10" />
        <StatCard title="Thành công" value={formatNumber(baoMat?.ThanhCong || 0)} icon={<Shield className="h-5 w-5 text-[#00a87e]" />} bgColor="bg-[#00a87e]/10" />
        <StatCard title="Thất bại" value={formatNumber(baoMat?.ThatBai || 0)} icon={<XCircle className="h-5 w-5 text-[#e23b4a]" />} bgColor="bg-[#e23b4a]/10" />
        <StatCard title="Tỷ lệ thất bại" value={`${baoMat?.TyLeThatBai || 0}%`} icon={<AlertTriangle className="h-5 w-5 text-[#ec7e00]" />} bgColor="bg-[#ec7e00]/10" />
      </div>

      {/* Login Success Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4">Tỷ lệ đăng nhập</h3>
          {baoMat?.TongDangNhap > 0 ? (
            <Chart
              options={pieOptions}
              series={[baoMat.ThanhCong, baoMat.ThatBai]}
              type="pie"
              height={280}
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#8d969e] bg-[#fafafa] rounded-xl border-2 border-dashed border-[#e5e7eb]">
              <p>Chưa có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Failed Login Attempts */}
        <div className="fe-card-fe p-6">
          <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#e23b4a]" />
            Đăng nhập thất bại gần đây
          </h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {dangNhapLoi.slice(0, 10).map((item: any) => (
              <div key={item.Id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-xl">
                <div>
                  <p className="text-sm font-medium text-[#191c1f]">{item.HoTen || 'Không xác định'}</p>
                  <p className="text-xs text-[#8d969e]">{item.Email || 'N/A'} • {item.IpAddress || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8d969e]">{item.ThoiGian}</p>
                  <p className="text-xs text-[#e23b4a]">{item.ThietBi || 'N/A'}</p>
                </div>
              </div>
            ))}
            {dangNhapLoi.length === 0 && <p className="text-center py-8 text-[#8d969e]">Không có đăng nhập thất bại</p>}
          </div>
        </div>
      </div>

      {/* Unusual Activity */}
      <div className="fe-card-fe p-6">
        <h3 className="text-lg font-medium text-[#191c1f] mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#ec7e00]" />
          Hoạt động bất thường ({batThuong.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="text-left py-3 px-4 font-medium text-[#8d969e]">Người dùng</th>
                <th className="text-right py-3 px-4 font-medium text-[#8d969e]">Số IP khác nhau</th>
                <th className="text-right py-3 px-4 font-medium text-[#8d969e]">Số đăng nhập/ngày</th>
                <th className="text-left py-3 px-4 font-medium text-[#8d969e]">Danh sách IP</th>
              </tr>
            </thead>
            <tbody>
              {batThuong.map((item: any) => (
                <tr key={item.NguoiDungId} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#191c1f]">{item.HoTen}</p>
                    <p className="text-xs text-[#8d969e]">{item.Email}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 bg-[#ec7e00]/10 text-[#ec7e00] rounded-full text-xs font-medium">{item.SoIPKhacNhau}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 bg-[#494fdf]/10 text-[#494fdf] rounded-full text-xs font-medium">{item.SoDangNhapTrongNgay}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.DanhSachIP?.slice(0, 3).map((ip: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#f3f4f6] rounded text-xs font-mono">{ip}</span>
                      ))}
                      {item.DanhSachIP?.length > 3 && (
                        <span className="px-2 py-0.5 bg-[#e5e7eb] rounded text-xs">+{item.DanhSachIP.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {batThuong.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-[#8d969e]">Không có hoạt động bất thường</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
