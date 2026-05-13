"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ModalHoTro from './ModalHoTro';
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Info,
  ShieldCheck,
  Wallet,
  MessageCircleQuestion
} from 'lucide-react';
import { HeaderProps } from '@/types/chung';
import { laySoLuongChuaDoc } from '@/services/thongbao';
import { demTraLoiChuaDoc } from '@/services/phanhoi';

export default function PhanDau({ toggleTheme, isDarkMode, user, onLogout }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [soLuongThongBao, setSoLuongThongBao] = useState(0);
  const [soPhanHoiChuaDoc, setSoPhanHoiChuaDoc] = useState(0);
  const [isThongBaoOpen, setIsThongBaoOpen] = useState(false);
  const [isHoTroOpen, setIsHoTroOpen] = useState(false);

  const taiSoLuongThongBao = useCallback(async () => {
    try {
      const count = await laySoLuongChuaDoc();
      setSoLuongThongBao(count);
    } catch (error) {
      console.error('Lỗi khi tải số lượng thông báo:', error);
    }
  }, []);

  const taiSoPhanHoiChuaDoc = useCallback(async () => {
    if (!user?.nguoiDungId) return;
    try {
      const res = await demTraLoiChuaDoc(user.nguoiDungId);
      if (res.success && res.data !== undefined) {
        setSoPhanHoiChuaDoc(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải số phản hồi chưa đọc:', error);
    }
  }, [user?.nguoiDungId]);

  useEffect(() => {
    taiSoLuongThongBao();
    // taiSoPhanHoiChuaDoc(); // Tạm tắt - backend API_ND chưa chạy
    // const interval = setInterval(() => {
    //   taiSoLuongThongBao();
    //   taiSoPhanHoiChuaDoc();
    // }, 30000);
    // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="fe-topbar">
      <div className="fe-topbar-shell flex items-center justify-between gap-4 lg:max-w-[calc(100vw-var(--fe-sidebar-width))] mx-auto">
        {/* Brand Section - Logo & Name */}
        <div className="group flex items-center gap-3 sm:gap-4">
          {/* Logo Container - Cao bằng header */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#494fdf] via-[#6366f1] to-[#8b5cf6] shadow-xl shadow-indigo-500/30">
              <ShieldCheck className="h-6 w-6 text-white drop-shadow-lg" />
              {/* Decorative shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </div>

            <div className="hidden sm:block">
              <h1
                className="text-xl lg:text-2xl font-black uppercase tracking-tighter"
                style={{ 
                  fontFamily: 'Aeonik Pro, Inter, sans-serif',
                  color: 'var(--text-primary)'
                }}
              >
                Finance AI
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm" />
                <p
                  className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--text-muted)'
                  }}
                >
                  Quản lý thông minh
                </p>
              </div>
            </div>
          </div>

          {/* Divider - Only on larger screens */}
          <div className="hidden lg:block h-10 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />
        </div>

        {/* Search Bar - Center */}
        <div className="group relative hidden flex-1 max-w-xl md:flex lg:max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors"
            style={{ color: 'var(--topbar-text-muted)' }}
          >
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="h-11 w-full rounded-2xl pl-11 pr-4 text-sm outline-none transition-all"
            style={{ 
              background: 'var(--surface-secondary)',
              border: '1px solid var(--input-border)',
              color: 'var(--text-primary)',
            }}
            placeholder="Tìm kiếm giao dịch (VD: Tiền điện tháng 3)..."
          />
        </div>

        {/* Actions Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2.5 transition-all"
            style={{ color: 'var(--topbar-text-muted)', background: 'transparent' }}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Hỗ trợ Button */}
          <div className="relative">
            <button
              onClick={() => setIsHoTroOpen(true)}
              className="rounded-xl p-2.5 transition-all"
              style={{ color: 'var(--topbar-text-muted)', background: 'transparent' }}
              aria-label="Hỗ trợ"
              title="Hỗ trợ & Phản hồi"
            >
              <MessageCircleQuestion className="h-5 w-5" />
              {soPhanHoiChuaDoc > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-900 shadow-lg animate-pulse">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsThongBaoOpen(!isThongBaoOpen)}
              className="relative rounded-xl p-2.5 transition-all"
              style={{ color: 'var(--topbar-text-muted)', background: 'transparent' }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {soLuongThongBao > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-lg"
                  style={{ background: 'var(--danger)' }}>
                  {soLuongThongBao > 99 ? '99+' : soLuongThongBao}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isThongBaoOpen && (
              <div className="z-modal absolute right-0 mt-3 w-80 overflow-hidden rounded-[20px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ 
                  background: 'var(--dropdown-bg)',
                  border: '1px solid var(--dropdown-border)'
                }}>
                <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--dropdown-border)' }}>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Thông báo</h3>
                  <Link
                    href="/ThongBao"
                    onClick={() => setIsThongBaoOpen(false)}
                    className="text-xs font-medium transition-colors"
                    style={{ color: 'var(--revolut-blue)' }}
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {soLuongThongBao === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 mb-2" style={{ color: 'var(--text-muted)' }} />
                      <p style={{ color: 'var(--text-secondary)' }}>Không có thông báo mới</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/ThongBao"
                        onClick={() => setIsThongBaoOpen(false)}
                        className="flex items-start gap-3 rounded-xl p-3 transition-all"
                        style={{ background: 'transparent' }}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--badge-pending-bg)' }}>
                          <AlertTriangle className="h-5 w-5" style={{ color: 'var(--badge-pending-text)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>Cảnh báo chi tiêu</p>
                          <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>Bạn đã vượt ngân sách tháng này</p>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mx-1 hidden h-8 w-px sm:block" style={{ background: 'var(--border)' }}></div>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 rounded-full p-1.5 pr-3 transition-all ${
                isProfileOpen ? '' : ''
              }`}
              style={{ background: 'transparent' }}
            >
              <div className="relative">
                <img
                  className="h-9 w-9 rounded-full border-2 object-cover shadow-sm"
                  src={user?.anhDaiDien ? `/Anh/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'User')}&background=494fdf&color=fff&bold=true`}
                  alt={user?.hoTen || 'Hồ sơ cá nhân'}
                />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2" style={{ background: '#00a87e', borderColor: 'var(--surface-primary)' }} />
              </div>
              <div className="hidden text-left lg:block">
                <p
                  className="flex items-center gap-1 text-sm font-semibold"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--text-primary)'
                  }}
                >
                  {user?.hoTen || 'User'}
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--text-muted)'
                  }}
                >
                  {user?.vaiTro?.[0] ? `${user.vaiTro[0]} Pro` : 'User'}
                </p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="z-modal absolute right-0 mt-3 w-56 overflow-hidden rounded-[20px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ 
                  background: 'var(--dropdown-bg)',
                  border: '1px solid var(--dropdown-border)'
                }}>
                <div className="space-y-1 p-3">
                  <Link
                    href="/HoSo"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-[12px] p-3 text-sm font-medium transition-all"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <div className="rounded-[8px] p-2" style={{ background: 'var(--surface-secondary)' }}>
                      <User className="h-4 w-4" />
                    </div>
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/CaiDat"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-[12px] p-3 text-sm font-medium transition-all"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <div className="rounded-[8px] p-2" style={{ background: 'var(--surface-secondary)' }}>
                      <Settings className="h-4 w-4" />
                    </div>
                    Thiết lập tài khoản
                  </Link>
                  <div className="mx-3 my-2 h-px" style={{ background: 'var(--border)' }}></div>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 rounded-[12px] p-3 text-sm font-medium transition-all"
                    style={{ color: 'var(--danger)' }}
                  >
                    <div className="rounded-[8px] p-2" style={{ background: 'var(--surface-secondary)' }}>
                      <LogOut className="h-4 w-4" />
                    </div>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Hỗ trợ - Đặt ngoài header để hiển thị đúng giữa màn hình */}
      <ModalHoTro isOpen={isHoTroOpen} onClose={() => setIsHoTroOpen(false)} />
    </header>
  );
}
