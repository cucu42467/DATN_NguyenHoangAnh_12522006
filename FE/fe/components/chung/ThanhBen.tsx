"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X, LayoutDashboard, Wallet, ArrowLeftRight,
  PieChart, ChevronDown, ChevronRight, ShieldCheck, Menu
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: { title: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Tổng quan',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/TrangChu',
  },
  {
    title: 'Giao dịch',
    icon: <ArrowLeftRight className="h-5 w-5" />,
    children: [
      { title: 'Lịch sử giao dịch', href: '/GiaoDich' },
      { title: 'Nhập dữ liệu AI', href: '/GiaoDich/NhapDuLieu' },
    ],
  },
  {
    title: 'Quản lý tài chính',
    icon: <Wallet className="h-5 w-5" />,
    children: [
      { title: 'Tài khoản', href: '/TaiKhoan' },
      { title: 'Ngân sách', href: '/NganSach' },
      { title: 'Danh mục', href: '/DanhMuc' },
      { title: 'Mục tiêu tiết kiệm', href: '/MucTieu' },
    ],
  },
  {
    title: 'Báo cáo & Phân tích',
    icon: <PieChart className="h-5 w-5" />,
    children: [
      { title: 'Báo Cáo', href: '/BaoCaoThongKe' },
      { title: 'Phân tích thông minh', href: '/TrungTamAI' },
    ],
  },
];

interface ThanhBenProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleSidebar?: () => void;
}

export default function ThanhBen({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse, onToggleSidebar }: ThanhBenProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Giao dịch', 'Quản lý tài chính']);
  const visibleText = !isCollapsed;

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(i => i !== title) : [...prev, title]
    );
  };

  const sidebarWidthClass = isCollapsed ? 'w-16' : 'w-56 lg:w-64';

  return (
    <>
      {isOpen && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        ${sidebarWidthClass} flex-shrink-0 flex flex-col transition-all duration-300
        ${isOpen && !isCollapsed ? 'fixed inset-y-0 left-0 z-50 translate-x-0 lg:relative lg:translate-x-0' : 'relative'}
        lg:translate-x-0
      `}
      style={{ 
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)'
      }}>
        {/* Sidebar Header - Hamburger Menu */}
        <div className="flex items-center h-20" style={{ 
          background: 'var(--sidebar-bg)',
          borderBottom: '1px solid var(--sidebar-border)'
        }}>
          <button
            onClick={onToggleSidebar || onToggleCollapse}
            className="flex items-center justify-center w-full h-full transition-colors"
            style={{ color: 'var(--sidebar-text-muted)' }}
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <Menu className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-90' : ''}`} />
          </button>
          {!isCollapsed && (
            <button
              onClick={onClose}
              className="p-2 lg:hidden rounded-xl transition-all mr-2"
              style={{ color: 'var(--text-muted)', background: 'transparent' }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="custom-scrollbar flex-1 overflow-y-auto py-3 px-2 lg:px-4 space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.title} className="space-y-0.5">
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => window.innerWidth < 1024 && !isCollapsed && onClose?.()}
                  className={`
                    group flex items-center rounded-xl transition-all duration-300
                    ${isCollapsed ? 'justify-center py-2.5 px-0 w-full' : 'px-3 lg:px-5 py-3 lg:py-4'}
                    ${pathname === item.href
                      ? 'fe-sidebar-active shadow-lg'
                      : 'hover:shadow-lg'
                    }
                  `}
                  style={pathname !== item.href ? {
                    color: 'var(--sidebar-text)',
                    background: 'transparent'
                  } : undefined}
                >
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                  {visibleText && (
                    <div className="flex-1 min-w-0 ml-2 lg:ml-3 truncate">
                      <span className="font-semibold text-xs lg:text-sm">{item.title}</span>
                    </div>
                  )}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`
                      group flex w-full items-center rounded-xl transition-all duration-300
                      ${isCollapsed ? 'justify-center py-2.5 px-0 w-full' : 'px-2 lg:px-4 py-3 lg:py-3.5 justify-between'}
                      font-semibold text-xs lg:text-sm
                    `}
                    style={{ color: 'var(--sidebar-text-muted)' }}
                    disabled={isCollapsed}
                  >
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>
                    {visibleText && <span className="truncate flex-1 ml-2 lg:ml-3 text-left">{item.title}</span>}
                    {visibleText && (
                      <span className={`h-3 w-3 transition-transform duration-300 flex-shrink-0`}>
                        <ChevronDown className="h-3 w-3 opacity-70" />
                      </span>
                    )}
                  </button>

                  {visibleText && expandedItems.includes(item.title) && item.children && (
                    <div className="mt-0.5 ml-0 lg:ml-6 space-y-0.5 pl-2 lg:pl-4 animate-in slide-in-from-top-4 duration-300"
                      style={{ borderLeft: '2px solid var(--sidebar-active-bg)' }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => window.innerWidth < 1024 && !isCollapsed && onClose?.()}
                          className={`
                            block rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md
                            ${isCollapsed ? 'px-0 py-2.5' : 'px-3 lg:px-5 py-2.5 lg:py-3'}
                            text-xs lg:text-sm font-semibold
                          `}
                          style={pathname !== child.href ? {
                            background: 'var(--surface-secondary)',
                            color: 'var(--sidebar-text)'
                          } : {
                            background: 'var(--sidebar-active-bg)',
                            color: 'var(--sidebar-active-text)'
                          }}
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

        {visibleText && (
          <div className="p-3 lg:p-4 mt-auto" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
            <div className="group relative overflow-hidden rounded-2xl p-4 text-white" style={{ background: 'var(--revolut-blue)' }}>
              <div className="relative z-10">
                <p className="text-[9px] font-medium opacity-80 mb-0.5 uppercase tracking-wider"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  TRẢI NGHIỆM TỐT HƠN
                </p>
                <h4 className="text-xs font-medium mb-2 italic"
                  style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                  Nâng cấp bản PRO
                </h4>
                <button className="w-full py-2 rounded-full text-[9px] font-medium uppercase tracking-wider transition-colors"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    background: 'var(--revolut-dark)',
                    color: 'var(--revolut-white)'
                  }}>
                  Nâng cấp ngay
                </button>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-black/10 rounded-full group-hover:translate-x-3 transition-transform duration-700"></div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-1.5 pt-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg animate-pulse"></div>
              <p className="text-[9px] font-bold uppercase tracking-widest flex-1 truncate"
                style={{ color: 'var(--sidebar-text-muted)' }}>Online</p>
            </div>
          </div>
        )}
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(161, 161, 170, 0.2);
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.3);
        }
      `}</style>
    </>
  );
}
