"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  LogIn,
  UserX,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  PieChart,
  BarChart3,
  MessageSquare,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Database,
  Plus
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  layDashboardTongHop,
  layThongKeNguoiDung,
  layThongKeGiaoDich6Thang,
  layChiTieuDanhMuc,
  layCanhBaoNganSach,
  layHoatDongGanDay,
  DashboardTongQuanDto,
  ThongKeNguoiDungDto,
  ThongKeGiaoDichThangDto,
  ChiTieuTheoDanhMucDto,
  CanhBaoNganSachAdminDto,
  AdminAuditLogDto
} from '@/services/admin/dashboard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Màu sắc cho biểu đồ
const COLORS = {
  primary: '#494fdf',
  success: '#00a87e',
  danger: '#e23b4a',
  warning: '#ec7e00',
  purple: '#7c3aed'
};

// Màu sắc cho Pie Chart
const PIE_COLORS = ['#494fdf', '#00a87e', '#e23b4a', '#ec7e00', '#7c3aed', '#f59e0b'];

// Hàm định dạng số tiền
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export default function AdminDashboardPage() {
  const [tongQuan, setTongQuan] = useState<DashboardTongQuanDto | null>(null);
  const [tangTruongNguoiDung, setTangTruongNguoiDung] = useState<ThongKeNguoiDungDto | null>(null);
  const [giaoDich6Thang, setGiaoDich6Thang] = useState<ThongKeGiaoDichThangDto[]>([]);
  const [chiTieuDanhMuc, setChiTieuDanhMuc] = useState<ChiTieuTheoDanhMucDto[]>([]);
  const [canhBaoNganSach, setCanhBaoNganSach] = useState<CanhBaoNganSachAdminDto[]>([]);
  const [hoatDongGanDay, setHoatDongGanDay] = useState<AdminAuditLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  // Fetch data từ 3 API song song
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tongHopRes, giaoDichRes, hoatDongRes] = await Promise.all([
        layDashboardTongHop(),
        layThongKeGiaoDich6Thang(),
        layHoatDongGanDay(10)
      ]);

      // Tổng quan từ API tổng hợp
      if (tongHopRes) {
        setTongQuan(tongHopRes.TongQuan);
        setTangTruongNguoiDung(tongHopRes.TangTruongNguoiDung);
        setChiTieuDanhMuc(tongHopRes.ChiTieuDanhMuc);
        setCanhBaoNganSach(tongHopRes.CanhBaoNganSach);
      }

      // Giao dịch 6 tháng
      setGiaoDich6Thang(giaoDichRes);

      // Hoạt động gần đây
      setHoatDongGanDay(hoatDongRes);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu dashboard:', error);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart options cho Line Chart (tăng trưởng người dùng)
  const lineChartOptions: any = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    colors: [COLORS.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    xaxis: {
      categories: tangTruongNguoiDung?.Labels || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#8d969e', fontSize: '12px' } }
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: '#8d969e', fontSize: '12px' },
        formatter: (val: number) => Math.round(val).toString()
      }
    },
    grid: { show: false },
    tooltip: { theme: 'dark' }
  };

  const lineChartSeries = [{
    name: 'Người dùng mới',
    data: tangTruongNguoiDung?.Data || []
  }];

  // Chart options cho Bar Chart (giao dịch 6 tháng)
  const barChartOptions: any = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 6,
        borderRadiusApplication: 'end'
      }
    },
    colors: [COLORS.success, COLORS.danger],
    xaxis: {
      categories: giaoDich6Thang?.map((g: ThongKeGiaoDichThangDto) => g.Thang) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#8d969e', fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#8d969e', fontSize: '12px' },
        formatter: (val: number) => formatCurrency(val)
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#8d969e' }
    },
    grid: {
      show: true,
      borderColor: '#f4f4f4',
      strokeDashArray: 4
    },
    tooltip: { theme: 'dark' }
  };

  const barChartSeries = [
    { name: 'Thu', data: giaoDich6Thang?.map((g: ThongKeGiaoDichThangDto) => g.TongThu) || [] },
    { name: 'Chi', data: giaoDich6Thang?.map((g: ThongKeGiaoDichThangDto) => g.TongChi) || [] }
  ];

  // Pie Chart options
  const pieChartOptions: any = {
    chart: {
      type: 'donut',
      height: 280,
    },
    labels: chiTieuDanhMuc?.map((c: ChiTieuTheoDanhMucDto) => c.TenDanhMuc) || [],
    colors: PIE_COLORS,
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 500 },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              formatter: (val: string) => `${Math.round(Number(val))}%`
            },
            total: {
              show: true,
              label: 'Tổng',
              fontSize: '14px',
              fontWeight: 500,
              color: '#8d969e'
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '12px',
      labels: { colors: '#8d969e' }
    },
    stroke: { show: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => `${val.toFixed(1)}%` }
    }
  };

  const pieChartSeries = chiTieuDanhMuc?.map((c: ChiTieuTheoDanhMucDto) => c.PhanTram) || [];

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="h-8 w-64 fe-skeleton rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="fe-card-fe p-6 h-32 fe-skeleton rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-medium uppercase tracking-tight leading-none mb-2 text-[#191c1f]"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            Bảng <span className="text-[#494fdf]">Điều Khiển</span>
          </h1>
          <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <ShieldCheck className="h-4 w-4 text-[#00a87e]" /> Trung tâm điều hành FINANCE AI v4.0.2
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-[#c9c9cd] rounded-xl flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00a87e] animate-pulse"></div>
            <span className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider">
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* === THỐNG KÊ NGƯỜI DÙNG === */}
      <div>
        <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] mb-4 flex items-center gap-2"
          style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
          <Users className="h-5 w-5 text-[#494fdf]" /> Thống kê người dùng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Tổng người dùng hoạt động */}
          <div className="fe-card-fe p-5 group hover:border-[#494fdf] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#494fdf]/10">
                <Users className="h-5 w-5 text-[#494fdf]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Người dùng hoạt động
            </p>
            <p className="text-2xl font-medium text-[#191c1f] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {tongQuan?.TongNguoiDungHoatDong?.toLocaleString('vi-VN') ?? 0}
            </p>
          </div>

          {/* Người dùng mới 7 ngày */}
          <div className="fe-card-fe p-5 group hover:border-[#00a87e] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#00a87e]/10">
                <UserPlus className="h-5 w-5 text-[#00a87e]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Người dùng mới (7 ngày)
            </p>
            <p className="text-2xl font-medium text-[#191c1f] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              +{tongQuan?.NguoiDungMoi7Ngay?.toLocaleString('vi-VN') ?? 0}
            </p>
          </div>

          {/* Đăng nhập hôm nay */}
          <div className="fe-card-fe p-5 group hover:border-[#ec7e00] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#ec7e00]/10">
                <LogIn className="h-5 w-5 text-[#ec7e00]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Đăng nhập hôm nay
            </p>
            <p className="text-2xl font-medium text-[#191c1f] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {tongQuan?.NguoiDungDangNhapHomNay?.toLocaleString('vi-VN') ?? 0}
            </p>
          </div>

          {/* Tài khoản bị vô hiệu hóa */}
          <div className="fe-card-fe p-5 group hover:border-[#e23b4a] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#e23b4a]/10">
                <UserX className="h-5 w-5 text-[#e23b4a]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Tài khoản bị vô hiệu hóa
            </p>
            <p className="text-2xl font-medium text-[#191c1f] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {tongQuan?.TongNguoiDungBiVoHieuHoa?.toLocaleString('vi-VN') ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ tăng trưởng người dùng */}
      <div className="fe-card-fe p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] flex items-center gap-2"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              Tăng trưởng người dùng {currentYear}
              <ArrowUpRight className="h-4 w-4 text-[#494fdf]" />
            </h3>
            <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-1">
              Số người dùng mới theo từng tháng
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          {tangTruongNguoiDung && tangTruongNguoiDung.Labels.length > 0 ? (
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height="100%" />
          ) : (
            <div className="h-full flex items-center justify-center text-[#8d969e]">Đang tải...</div>
          )}
        </div>
      </div>

      {/* === THỐNG KÊ GIAO DỊCH === */}
      <div>
        <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] mb-4 flex items-center gap-2"
          style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
          <Wallet className="h-5 w-5 text-[#00a87e]" /> Thống kê giao dịch
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tổng giao dịch */}
          <div className="fe-card-fe p-5 group hover:border-[#494fdf] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#494fdf]/10">
                <Database className="h-5 w-5 text-[#494fdf]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Tổng giao dịch hệ thống
            </p>
            <p className="text-2xl font-medium text-[#191c1f] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {tongQuan?.TongGiaoDichHeThong?.toLocaleString('vi-VN') ?? 0}
            </p>
          </div>

          {/* Tổng thu tháng */}
          <div className="fe-card-fe p-5 group hover:border-[#00a87e] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#00a87e]/10">
                <TrendingUp className="h-5 w-5 text-[#00a87e]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Tổng thu tháng hiện tại
            </p>
            <p className="text-2xl font-medium text-[#00a87e] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {formatCurrency(tongQuan?.TongThuThangHienTai ?? 0)}
            </p>
          </div>

          {/* Tổng chi tháng */}
          <div className="fe-card-fe p-5 group hover:border-[#e23b4a] transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 rounded-xl bg-[#e23b4a]/10">
                <TrendingDown className="h-5 w-5 text-[#e23b4a]" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider mb-1">
              Tổng chi tháng hiện tại
            </p>
            <p className="text-2xl font-medium text-[#e23b4a] tracking-tight leading-none"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              {formatCurrency(tongQuan?.TongChiThangHienTai ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ giao dịch + Phân bố chi tiêu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ cột kép - Thu Chi 6 tháng */}
        <div className="fe-card-fe p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] flex items-center gap-2"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              <BarChart3 className="h-5 w-5 text-[#494fdf]" /> Thu & Chi 6 tháng gần nhất
            </h3>
            <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-1">
              So sánh tổng thu và tổng chi
            </p>
          </div>
          <div className="h-[300px]">
            {giaoDich6Thang && giaoDich6Thang.length > 0 ? (
              <Chart options={barChartOptions} series={barChartSeries} type="bar" height="100%" />
            ) : (
              <div className="h-full flex items-center justify-center text-[#8d969e]">Đang tải...</div>
            )}
          </div>
        </div>

        {/* Biểu đồ tròn - Phân bố chi tiêu */}
        <div className="fe-card-fe p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] flex items-center gap-2"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              <PieChart className="h-5 w-5 text-[#ec7e00]" /> Chi tiêu theo danh mục
            </h3>
            <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-1">
              Top 6 danh mục phổ biến nhất
            </p>
          </div>
          {chiTieuDanhMuc && chiTieuDanhMuc.length > 0 ? (
            <div className="h-[280px]">
              <Chart options={pieChartOptions} series={pieChartSeries} type="donut" height="100%" />
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#8d969e] text-sm">
              Chưa có dữ liệu chi tiêu
            </div>
          )}
        </div>
      </div>

      {/* === HOẠT ĐỘNG GẦN ĐÂY === */}
      <div className="fe-card-fe p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-tight text-[#191c1f] flex items-center gap-2"
              style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
              <Clock className="h-5 w-5 text-[#7c3aed]" /> Hoạt động gần đây
            </h3>
            <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-1">
              10 hoạt động mới nhất trên hệ thống
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f4f4f4]">
                <th className="text-left py-3 px-4 text-[10px] font-medium text-[#8d969e] uppercase tracking-wider">Thời gian</th>
                <th className="text-left py-3 px-4 text-[10px] font-medium text-[#8d969e] uppercase tracking-wider">Bảng</th>
                <th className="text-left py-3 px-4 text-[10px] font-medium text-[#8d969e] uppercase tracking-wider">Hành động</th>
                <th className="text-left py-3 px-4 text-[10px] font-medium text-[#8d969e] uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody>
              {hoatDongGanDay && hoatDongGanDay.length > 0 ? (
                hoatDongGanDay.map((log: AdminAuditLogDto, index: number) => (
                  <tr key={index} className="border-b border-[#f4f4f4] hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3 px-4 text-sm text-[#191c1f]">
                      {log.ThoiGian ? new Date(log.ThoiGian).toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#191c1f]">
                      <span className="px-2 py-1 bg-[#f4f4f4] rounded-md text-xs font-medium">
                        {log.TenBang}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        log.HanhDong === 'INSERT' ? 'bg-[#00a87e]/10 text-[#00a87e]' :
                        log.HanhDong === 'UPDATE' ? 'bg-[#ec7e00]/10 text-[#ec7e00]' :
                        log.HanhDong === 'DELETE' ? 'bg-[#e23b4a]/10 text-[#e23b4a]' :
                        'bg-[#494fdf]/10 text-[#494fdf]'
                      }`}>
                        {log.HanhDong}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8d969e]">
                      {log.IpAddress || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#8d969e] text-sm">
                    Chưa có hoạt động nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === CẢNH BÁO NGÂN SÁCH === */}
      {canhBaoNganSach && canhBaoNganSach.length > 0 && (
        <div className="fe-card-fe p-6 border-[#e23b4a]/30">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium uppercase tracking-tight text-[#e23b4a] flex items-center gap-2"
                style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif' }}>
                <AlertTriangle className="h-5 w-5" /> Cảnh báo ngân sách vượt mức
              </h3>
              <p className="text-[10px] text-[#8d969e] uppercase tracking-wider mt-1">
                {canhBaoNganSach.length} cảnh báo
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {canhBaoNganSach.map((item: CanhBaoNganSachAdminDto, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-[#e23b4a]" />
                  <div>
                    <p className="text-sm font-medium text-[#191c1f]">{item.HoTen}</p>
                    <p className="text-xs text-[#8d969e]">
                      {item.TenDanhMuc} • {item.ThangNam}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#e23b4a]">
                    {item.PhanTramDaDung.toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-[#8d969e] uppercase">đã sử dụng</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === PHẢN HỒI CHỜ XỬ LÝ === */}
      <div>
        {(tongQuan?.PhanHoiChoXuLy ?? 0) > 0 ? (
          <Link href="/admin/CaiDat/ThongBao">
            <div className={`fe-card-fe p-6 border-2 border-orange-400 cursor-pointer hover:shadow-lg transition-all bg-orange-50/30`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-100 relative">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {tongQuan?.PhanHoiChoXuLy}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#191c1f]">
                      Phản hồi chờ xử lý
                    </h3>
                    <p className="text-sm text-[#8d969e]">
                      Có <span className="font-bold text-orange-600">{tongQuan?.PhanHoiChoXuLy}</span> phản hồi chưa được xử lý
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-600 font-medium">
                  <span>Xem tất cả</span>
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="fe-card-fe p-6 opacity-60">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#f4f4f4]">
                <MessageSquare className="h-6 w-6 text-[#8d969e]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#191c1f]">
                  Phản hồi chờ xử lý
                </h3>
                <p className="text-sm text-[#8d969e]">
                  Không có phản hồi nào chờ xử lý
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
