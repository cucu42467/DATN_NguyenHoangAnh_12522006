"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X, LayoutDashboard, Users, ShieldCheck,
  ArrowLeftRight, Settings, ChevronDown,
  ChevronLeft, Activity, BrainCircuit, Menu, BarChart3
} from 'lucide-react';
import { layThongKeTongQuanNguoiDung } from '@/services/qt/nguoidung';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: { title: string; href: string }[];
}

const adminMenuItems: MenuItem[] = [
  {
    title: 'Bảng điều khiển',
    icon: <LayoutDashboard className="h-6 w-6" />,
    href: '/admin',
  },
  {
    title: 'Quản lý Người dùng',
    icon: <Users className="h-6 w-6" />,
    href: '/admin/NguoiDung',
  },
  {
    title: 'Hệ thống tài chính',
    icon: <ArrowLeftRight className="h-6 w-6" />,
    children: [
      { title: 'Toàn bộ giao dịch', href: '/admin/GiaoDich' },
      { title: 'Danh mục toàn cầu', href: '/admin/DanhMuc' },
    ],
  },
  {
    title: 'Báo cáo & Thống kê',
    icon: <BarChart3 className="h-6 w-6" />,
    href: '/admin/BaoCao',
  },
  {
    title: 'Giám sát hệ thống',
    icon: <Activity className="h-6 w-6" />,
    children: [
      { title: 'Nhật ký hoạt động', href: '/admin/GiamSat/NhatKy' },
      { title: 'Giám sát phiên', href: '/admin/GiamSat/Phien' },
      { title: 'Lịch sử Import', href: '/admin/GiamSat/Import' },
    ],
  },
  {
    title: 'Quản lý AI & Gợi ý',
    icon: <BrainCircuit className="h-6 w-6" />,
    children: [
      { title: 'Quản lý Model AI', href: '/admin/AI/Model' },
      { title: 'Cấu hình Gợi ý AI', href: '/admin/AI/GoiY' },
      { title: 'Thống kê & Dự đoán', href: '/admin/AI/ThongKe' },
      { title: 'Điều chỉnh Ưu tiên', href: '/admin/AI/UuTien' },
    ],
  },
  {
    title: 'Cài đặt & Bảo mật',
    icon: <Settings className="h-6 w-6" />,
    children: [
      { title: 'Tiền tệ & Tỷ giá', href: '/admin/CaiDat/TienTe' },
      { title: 'Thông báo hệ thống', href: '/admin/CaiDat/ThongBao' },
      { title: 'Quản lý tài nguyên', href: '/admin/CaiDat/TaiNguyen' },
      { title: 'Sao lưu & Khôi phục', href: '/admin/CaiDat/SaoLuu' },
    ],
  },
];

interface ThanhBenAdminProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ThanhBenAdmin({ isCollapsed, onToggleCollapse }: ThanhBenAdminProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Hệ thống tài chính']);
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const stats = await layThongKeTongQuanNguoiDung();
        setUserCount(stats.tongNguoiDung);
      } catch (error) {
        console.error('Lỗi khi lấy số lượng người dùng:', error);
      }
    };
    fetchUserCount();
  }, []);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(i => i !== title) : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return href === '/admin' ? pathname === href : pathname?.startsWith(href);
  };

  const visibleText = !isCollapsed;

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-20 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 lg:px-6 bg-white/50 dark:bg-transparent">
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-[#494fdf] flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <ShieldCheck className="h-7 w-7 text-white drop-shadow-lg" />
          </div>
          {visibleText && (
            <div className="min-w-0 flex-1">
              <span className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter truncate block leading-tight">
                ADMIN PRO
              </span>
              <p className="text-[10px] font-bold text-[#8d969e] uppercase tracking-widest leading-none">Management</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center h-full px-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all hover:scale-110 active:scale-95 flex-shrink-0"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <Menu className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 overflow-y-auto py-4 px-2 lg:px-6 space-y-2 lg:space-y-3">
        {adminMenuItems.map((item) => (
          <div key={item.title} className="space-y-1">
            {item.href ? (
              <Link
                href={item.href}
                className={`
                  group flex items-center rounded-2xl px-3 lg:px-6 py-4 lg:py-5 transition-all duration-300 hover:shadow-lg
                  ${isActive(item.href)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl ring-2 ring-indigo-200/50 dark:ring-indigo-800/50 scale-[1.02]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                  } ${isCollapsed ? 'justify-center py-5' : 'justify-start'}
                `}
              >
                <span className={`flex-shrink-0 ${isCollapsed ? 'p-2 bg-zinc-100/50 rounded-lg group-hover:bg-white/50' : ''}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 ml-3 lg:ml-4 truncate">
                    <span className="font-bold text-sm lg:text-base">{item.title}</span>
                  </div>
                )}
                {item.href === '/admin/NguoiDung' && userCount > 0 && !isCollapsed && (
                  <span className="ml-2 text-xs px-2.5 py-1 rounded-full font-black bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white shadow-md whitespace-nowrap">
                    {userCount}
                  </span>
                )}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={`
                    group flex w-full items-center justify-between rounded-2xl px-3 lg:px-6 py-4 lg:py-5 transition-all duration-300 hover:shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-800
                    text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-sm lg:text-base
                    ${isCollapsed ? 'justify-center py-5' : ''}
                  `}
                  disabled={isCollapsed}
                >
                  <div className={`flex items-center ${isCollapsed ? '' : 'gap-4'}`}>
                    <span className={`flex-shrink-0 ${isCollapsed ? 'p-2 bg-zinc-100/50 rounded-lg group-hover:bg-white/50' : ''}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className={`h-4 w-4 transition-transform duration-300 ${
                      expandedItems.includes(item.title) ? 'rotate-180' : ''
                    }`}>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </span>
                  )}
                </button>

                {!isCollapsed && expandedItems.includes(item.title) && item.children && (
                  <div className="mt-1.5 ml-0 lg:ml-8 space-y-1 border-l-2 border-indigo-200/50 dark:border-indigo-800/50 pl-3 lg:pl-6 animate-in slide-in-from-top-4 duration-300">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`
                          block px-3 lg:px-5 py-3.5 lg:py-4 text-xs lg:text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-md
                          ${pathname === child.href
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/20 shadow-lg scale-[1.01]'
                            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-50/40 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                          }
                        `}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="p-4 lg:p-6 mt-auto border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href="/TrangChu"
            className="w-full flex items-center justify-center gap-3 py-4 lg:py-5 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all duration-300 shadow-xl hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-2xl hover:scale-[1.02] active:scale-98 group"
          >
            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại Dashboard
          </Link>
          <div className="mt-4 flex items-center gap-2 px-2 pt-2 border-t border-zinc-200/30 dark:border-zinc-700/30">
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg animate-pulse"></div>
            <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex-1 truncate">Online</p>
            <Activity className="h-3 w-3 text-emerald-500 opacity-70" />
          </div>
        </div>
      )}
    </div>
  );
}
