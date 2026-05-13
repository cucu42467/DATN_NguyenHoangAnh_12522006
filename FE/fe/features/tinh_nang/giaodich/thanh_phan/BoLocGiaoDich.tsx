"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Calendar,
  XCircle,
  RefreshCw,
  Check,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { LocGiaoDichDto } from '@/types';
import { SlideUp } from '@/thanh_phan/animation';
import { useDanhSachDanhMucQuery } from '@/hooks/query/danhmuc/useDanhMucQueries';
import { layDanhSachTaiKhoan } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface BoLocGiaoDichProps {
  filter: LocGiaoDichDto;
  onFilterChange: (filter: LocGiaoDichDto) => void;
}

export default function BoLocGiaoDich({ filter, onFilterChange }: BoLocGiaoDichProps) {
  const [searchText, setSearchText] = useState(filter.ghiChu || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load categories - phân theo loại dựa vào filter loaiDanhMuc
  const loaiDanhMuc = useMemo(() => {
    if (filter.tenLoaiDanhMuc === 'Thu nhập') return 'THU';
    if (filter.tenLoaiDanhMuc === 'Chi tiêu') return 'CHI';
    return undefined;
  }, [filter.tenLoaiDanhMuc]);

  const { data: danhMucList = [] } = useDanhSachDanhMucQuery(loaiDanhMuc, true);

  // Load accounts
  const { data: taiKhoanList = [] } = useQuery({
    queryKey: ['tai-khoan', 'list-all'],
    queryFn: layDanhSachTaiKhoan,
    staleTime: 5 * 60 * 1000,
  });

  const handleChange = (key: keyof LocGiaoDichDto, value: any) => {
    onFilterChange({ ...filter, [key]: value, page: 1 });
  };

  // Khi đổi loại danh mục -> reset danh mục
  useEffect(() => {
    if (filter.danhMucId) {
      const exists = danhMucList.some(d => d.danhMucId === filter.danhMucId);
      if (!exists) {
        handleChange('danhMucId', undefined);
      }
    }
  }, [filter.tenLoaiDanhMuc, danhMucList]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    handleChange('ghiChu', value || undefined);
  };

  const handleDatePreset = (preset: 'today' | 'week' | 'month' | '3months' | 'year' | 'all') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let newFilter: LocGiaoDichDto = { ...filter };

    switch (preset) {
      case 'all':
        newFilter.tuNgay = undefined;
        newFilter.denNgay = undefined;
        break;
      case 'today':
        newFilter.tuNgay = todayStr;
        newFilter.denNgay = todayStr;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        newFilter.tuNgay = weekAgo.toISOString().split('T')[0];
        newFilter.denNgay = todayStr;
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        newFilter.tuNgay = monthStart.toISOString().split('T')[0];
        newFilter.denNgay = todayStr;
        break;
      case '3months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        newFilter.tuNgay = threeMonthsAgo.toISOString().split('T')[0];
        newFilter.denNgay = todayStr;
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        newFilter.tuNgay = yearStart.toISOString().split('T')[0];
        newFilter.denNgay = todayStr;
        break;
    }

    newFilter.page = 1; // Reset về trang 1
    onFilterChange(newFilter);
  };

  const resetFilter = () => {
    setSearchText('');
    setShowAdvanced(false);
    onFilterChange({ page: 1, pageSize: 20 });
  };

  const getDateLabel = () => {
    if (!filter.tuNgay && !filter.denNgay) return 'Tất cả thời gian';
    if (filter.tuNgay && filter.denNgay) {
      if (filter.tuNgay === filter.denNgay) {
        return new Date(filter.tuNgay).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      const tu = new Date(filter.tuNgay).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
      const den = new Date(filter.denNgay).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${tu} - ${den}`;
    }
    if (filter.tuNgay) return `Từ ${new Date(filter.tuNgay).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    if (filter.denNgay) return `Đến ${new Date(filter.denNgay).toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    return 'Tất cả thời gian';
  };

  const hasActiveFilters = useMemo(() => {
    return filter.ghiChu || filter.tuNgay || filter.denNgay || filter.danhMucId || filter.tenLoaiDanhMuc || filter.taiKhoanNguonId || filter.soTienTu || filter.soTienDen;
  }, [filter]);

  const datePresets = [
    { key: 'all', label: 'Tất cả' },
    { key: 'today', label: 'Hôm nay' },
    { key: 'week', label: '7 ngày' },
    { key: 'month', label: 'Tháng này' },
    { key: '3months', label: '3 tháng' },
    { key: 'year', label: 'Năm nay' },
  ] as const;

  const getActiveDatePreset = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsAgoStr = threeMonthsAgo.toISOString().split('T')[0];
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const yearStartStr = yearStart.toISOString().split('T')[0];

    if (!filter.tuNgay && !filter.denNgay) return 'all';
    if (filter.tuNgay === todayStr && filter.denNgay === todayStr) return 'today';
    if (filter.tuNgay === weekAgoStr && filter.denNgay === todayStr) return 'week';
    if (filter.tuNgay === monthStartStr && filter.denNgay === todayStr) return 'month';
    if (filter.tuNgay === threeMonthsAgoStr && filter.denNgay === todayStr) return '3months';
    if (filter.tuNgay === yearStartStr && filter.denNgay === todayStr) return 'year';
    return '';
  };

  const activeDatePreset = getActiveDatePreset();

  return (
    <SlideUp>
      <div className="rounded-2xl border border-zinc-200 bg-white">
        {/* Header với Search */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Search className="h-6 w-6" />
            </div>
            
            {/* Search Input - To hơn */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo ghi chú, số tiền, danh mục, tài khoản..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 py-4 pl-13 pr-12 text-base text-[#191c1f] outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-500/10"
                style={{ paddingLeft: '3.25rem', paddingRight: '3rem' }}
              />
              {searchText ? (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-200 rounded-full transition-colors"
                >
                  <XCircle className="h-5 w-5 text-zinc-400" />
                </button>
              ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="rounded-lg bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-500">⌘K</span>
                </div>
              )}
            </div>

            {/* Toggle Advanced Filter */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex h-12 items-center gap-2 rounded-xl px-5 font-medium transition-all ${
                showAdvanced || hasActiveFilters
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'border-2 border-zinc-200 text-zinc-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Lọc</span>
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-500">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {datePresets.map((p) => (
              <button
                key={p.key}
                onClick={() => handleDatePreset(p.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  activeDatePreset === p.key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
            
            {/* Custom Date Range */}
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 p-1.5">
              <Calendar className="ml-2 h-4 w-4 text-zinc-500" />
              <input
                type="date"
                value={filter.tuNgay || ''}
                onChange={(e) => {
                  handleDatePreset('all'); // Clear preset
                  handleChange('tuNgay', e.target.value || undefined);
                }}
                className="rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none"
              />
              <span className="text-zinc-400">→</span>
              <input
                type="date"
                value={filter.denNgay || ''}
                onChange={(e) => {
                  handleDatePreset('all'); // Clear preset
                  handleChange('denNgay', e.target.value || undefined);
                }}
                className="rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="border-t border-zinc-100 p-5 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-700">
                <Filter className="mr-2 inline h-4 w-4" />
                Bộ lọc nâng cao
              </h4>
              {hasActiveFilters && (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Đặt lại
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Loại giao dịch */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Loại giao dịch</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChange('tenLoaiDanhMuc', filter.tenLoaiDanhMuc === 'Thu nhập' ? undefined : 'Thu nhập')}
                    className={`flex-1 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      filter.tenLoaiDanhMuc === 'Thu nhập'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-500/20'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                  >
                    {filter.tenLoaiDanhMuc === 'Thu nhập' && <Check className="h-4 w-4" />}
                    <span>Thu</span>
                    <span className="text-green-600">↑</span>
                  </button>
                  <button
                    onClick={() => handleChange('tenLoaiDanhMuc', filter.tenLoaiDanhMuc === 'Chi tiêu' ? undefined : 'Chi tiêu')}
                    className={`flex-1 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      filter.tenLoaiDanhMuc === 'Chi tiêu'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-500/20'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    {filter.tenLoaiDanhMuc === 'Chi tiêu' && <Check className="h-4 w-4" />}
                    <span>Chi</span>
                    <span className="text-red-600">↓</span>
                  </button>
                </div>
              </div>

              {/* Danh mục */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Danh mục</label>
                <select
                  className="w-full rounded-xl border-2 border-zinc-200 bg-white py-3 px-3 text-sm font-medium text-[#191c1f] outline-none transition-all focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10 cursor-pointer"
                  value={filter.danhMucId || ''}
                  onChange={(e) => handleChange('danhMucId', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">Tất cả danh mục</option>
                  {danhMucList.map((dm) => (
                    <option key={dm.danhMucId} value={dm.danhMucId}>
                      {dm.tenDanhMuc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tài khoản nguồn */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Tài khoản</label>
                <select
                  className="w-full rounded-xl border-2 border-zinc-200 bg-white py-3 px-3 text-sm font-medium text-[#191c1f] outline-none transition-all focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10 cursor-pointer"
                  value={filter.taiKhoanNguonId || ''}
                  onChange={(e) => handleChange('taiKhoanNguonId', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">Tất cả tài khoản</option>
                  {taiKhoanList.map((tk: any) => (
                    <option key={tk.taiKhoanId} value={tk.taiKhoanId}>
                      {tk.tenTaiKhoan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Số tiền */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Khoảng số tiền</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filter.soTienTu || ''}
                    onChange={(e) => handleChange('soTienTu', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white py-3 px-3 text-sm outline-none transition-all focus:border-indigo-500 placeholder:text-zinc-400"
                  />
                  <span className="text-zinc-400 font-medium">→</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filter.soTienDen || ''}
                    onChange={(e) => handleChange('soTienDen', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-xl border-2 border-zinc-200 bg-white py-3 px-3 text-sm outline-none transition-all focus:border-indigo-500 placeholder:text-zinc-400"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="mt-5 flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Đang lọc:</span>
                
              {filter.tenLoaiDanhMuc && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                      filter.tenLoaiDanhMuc === 'Thu nhập' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {filter.tenLoaiDanhMuc === 'Thu nhập' ? '↑ Thu nhập' : '↓ Chi tiêu'}
                      <button onClick={() => handleChange('tenLoaiDanhMuc', undefined)} className="ml-1 hover:opacity-70">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </span>
                  )}
                
                {filter.danhMucId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-700 border border-purple-200">
                    📁 {danhMucList.find(d => d.danhMucId === filter.danhMucId)?.tenDanhMuc || filter.danhMucId}
                    <button onClick={() => handleChange('danhMucId', undefined)} className="ml-1 hover:opacity-70">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                )}
                
                {filter.taiKhoanNguonId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-semibold text-cyan-700 border border-cyan-200">
                    💳 {taiKhoanList.find((tk: any) => tk.taiKhoanId === filter.taiKhoanNguonId)?.tenTaiKhoan || filter.taiKhoanNguonId}
                    <button onClick={() => handleChange('taiKhoanNguonId', undefined)} className="ml-1 hover:opacity-70">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                )}
                
                {(filter.soTienTu || filter.soTienDen) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700 border border-amber-200">
                    💰 {filter.soTienTu?.toLocaleString() || '0'} - {filter.soTienDen?.toLocaleString() || '∞'} đ
                    <button onClick={() => { handleChange('soTienTu', undefined); handleChange('soTienDen', undefined); }} className="ml-1 hover:opacity-70">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                )}
                
                {(filter.tuNgay || filter.denNgay) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-200">
                    📅 {getDateLabel()}
                    <button onClick={() => { handleChange('tuNgay', undefined); handleChange('denNgay', undefined); }} className="ml-1 hover:opacity-70">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={resetFilter}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-zinc-300 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  <RefreshCw className="h-4 w-4" />
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        )}

        {/* Current Filter Summary (khi không mở advanced) */}
        {!showAdvanced && hasActiveFilters && (
          <div className="px-5 pb-4 pt-2 border-t border-zinc-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Lọc:</span>
              {filter.tenLoaiDanhMuc && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  filter.tenLoaiDanhMuc === 'Thu nhập' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {filter.tenLoaiDanhMuc === 'Thu nhập' ? '↑ Thu nhập' : '↓ Chi tiêu'}
                </span>
              )}
              {filter.danhMucId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                  📁 {danhMucList.find(d => d.danhMucId === filter.danhMucId)?.tenDanhMuc}
                </span>
              )}
              {filter.taiKhoanNguonId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                  💳 {taiKhoanList.find((tk: any) => tk.taiKhoanId === filter.taiKhoanNguonId)?.tenTaiKhoan}
                </span>
              )}
              {(filter.soTienTu || filter.soTienDen) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  💰 {filter.soTienTu?.toLocaleString() || '0'} - {filter.soTienDen?.toLocaleString() || '∞'}
                </span>
              )}
              {getDateLabel() !== 'Tất cả thời gian' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  📅 {getDateLabel()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </SlideUp>
  );
}
