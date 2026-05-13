"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  ExternalLink,
  BrainCircuit,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  FileSpreadsheet,
  Download,
  X,
  Check,
} from 'lucide-react';
import type { GiaoDichDto } from '@/kieu_du_lieu';
import { LoaiGiaoDich, LoaiGiaoDichEnum } from '@/kieu_du_lieu';
import { motion, useReducedMotion } from 'framer-motion';
import { ActionButton, ActionButtons, StatusBadge } from '@/thanh_phan/ui';
import { Button } from '@/thanh_phan/ui';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';
import { xoaGiaoDich, xuatExcelGiaoDich } from '@/services';
import FormGiaoDichDinhKy from './FormGiaoDichDinhKy';
import { layCoSoApi } from '@/thu_vien/co_so_api';

interface BangLichSuProps {
  transactions?: GiaoDichDto[];
  loading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export default function BangLichSu({
  transactions = [],
  loading,
  pagination,
  onPageChange,
  onRefresh,
  sortBy,
  sortOrder,
  onSort,
}: BangLichSuProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selection state for export
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDinhKyModal, setShowDinhKyModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === safeTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(safeTransactions.map(t => t.giaoDichId)));
    }
  };

  const toggleSelectOne = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    if (selectedIds.size === 0) {
      showToast('Vui lòng chọn ít nhất một giao dịch để xuất!', 'warning');
      return;
    }

    setIsExporting(true);
    try {
      const coSoApi = layCoSoApi();
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

      if (format === 'csv') {
        // CSV export with POST body
        const response = await fetch(`${coSoApi}/api/giao-dich/xuat-csv`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            giaoDichIds: Array.from(selectedIds),
          }),
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `giaodich_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Excel export with POST body
        const response = await fetch(`${coSoApi}/api/giao-dich/xuat-excel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            giaoDichIds: Array.from(selectedIds),
          }),
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `giaodich_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      showToast(`Xuất ${format.toUpperCase()} thành công!`, 'success');
      setShowExportModal(false);
    } catch (error) {
      showToast('Không thể xuất file. Vui lòng thử lại.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const prefersReducedMotion = useReducedMotion();

  // Sort helper functions
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ChevronsUpDown className="h-4 w-4 text-zinc-400" />;
    if (sortOrder === 'asc') return <ChevronUp className="h-4 w-4 text-indigo-600" />;
    return <ChevronDown className="h-4 w-4 text-indigo-600" />;
  };

  const handleSort = (column: string) => {
    if (!onSort) return;
    if (sortBy === column) {
      onSort(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  // Map frontend column keys to backend sortBy values
  const sortColumnMap: Record<string, string> = {
    'ghichu': 'ghichu',
    'loai': 'loai',
    'taikhoan': 'taikhoan',
    'sotien': 'sotien',
    'ngay': 'ngayGiaoDich',
  };

  const SortableHeader = ({ column, label, align = 'left' }: { column: string; label: string; align?: 'left' | 'right' | 'center' }) => (
    <th
      className={`cursor-pointer px-6 py-4 text-${align} select-none transition-colors hover:bg-zinc-300`}
      onClick={() => handleSort(sortColumnMap[column] || column)}
    >
      <div className={`inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {getSortIcon(sortColumnMap[column] || column)}
      </div>
    </th>
  );

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await xoaGiaoDich(deleteId);
      showToast("Giao dịch đã được xóa thành công!", "success");
      setDeleteId(null);
      onRefresh?.();
    } catch (error) {
      showToast("Không thể xóa giao dịch. Vui lòng thử lại.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/GiaoDich/${id}/Sua`);
  };


  // Xác định loại giao dịch dựa vào tenLoaiDanhMuc thay vì loaiGiaoDich
  // tenLoaiDanhMuc: "Thu nhập" = THU, "Chi tiêu" = CHI, null/undefined = dựa vào loaiGiaoDich
  const mapApiLoaiToStandard = (loai: GiaoDichDto['loaiGiaoDich'], tenLoaiDanhMuc?: string): 'THU' | 'CHI' | 'CHUYEN_KHOAN' | null => {
    // Ưu tiên tenLoaiDanhMuc nếu có
    if (tenLoaiDanhMuc) {
      if (tenLoaiDanhMuc === 'Thu nhập') return 'THU';
      if (tenLoaiDanhMuc === 'Chi tiêu') return 'CHI';
    }

    // Fallback về loaiGiaoDich
    const v: number | string | null | undefined = loai as number | string | null | undefined;
    if (v === 1 || v === '1' || v === LoaiGiaoDichEnum.Thu) return 'THU';
    if (v === 2 || v === '2' || v === LoaiGiaoDichEnum.Chi) return 'CHI';
    if (v === 3 || v === '3' || v === LoaiGiaoDichEnum.ChuyenKhoan) return 'CHUYEN_KHOAN';

    if (String(v) === LoaiGiaoDich.THU) return 'THU';
    if (String(v) === LoaiGiaoDich.CHI) return 'CHI';
    if (String(v) === LoaiGiaoDich.CHUYEN_KHOAN) return 'CHUYEN_KHOAN';

    return null;
  };

  const getTypeIcon = (loai: GiaoDichDto['loaiGiaoDich'], tenLoaiDanhMuc?: string) => {
    const standard = mapApiLoaiToStandard(loai, tenLoaiDanhMuc);
    switch (standard) {
      case 'THU':
        return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
      case 'CHI':
        return <ArrowDownCircle className="h-5 w-5 text-red-600" />;
      case 'CHUYEN_KHOAN':
        return <RefreshCcw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getLoaiText = (loai: GiaoDichDto['loaiGiaoDich'], tenLoaiDanhMuc?: string) => {
    const standard = mapApiLoaiToStandard(loai, tenLoaiDanhMuc);
    switch (standard) {
      case 'THU':
        return 'Thu nhập';
      case 'CHI':
        return 'Chi tiêu';
      case 'CHUYEN_KHOAN':
        return 'Chuyển khoản';
      default:
        return '';
    }
  };

  const getLoaiChipClass = (loai: GiaoDichDto['loaiGiaoDich'], tenLoaiDanhMuc?: string) => {
    const standard = mapApiLoaiToStandard(loai, tenLoaiDanhMuc);
    switch (standard) {
      case 'THU':
        return 'border border-green-200 bg-green-50 text-green-700';
      case 'CHI':
        return 'border border-red-200 bg-red-50 text-red-700';
      case 'CHUYEN_KHOAN':
        return 'border border-blue-200 bg-blue-50 text-blue-700';
      default:
        return 'border border-gray-200 bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-[20px] border" style={{ background: 'var(--table-row-bg)', borderColor: 'var(--table-border)' }}>
        <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--table-border)' }}>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
              Bảng dữ liệu
            </p>
            <h3 className="mt-2 text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Lịch sử giao dịch gần đây
            </h3>
          </div>
        </div>
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[920px]">
          <thead style={{ background: 'var(--surface-secondary)' }}>
            <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
              <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Giao dịch
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Loại / Danh mục
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Tài khoản
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Số tiền
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Ngày
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                AI / Nguồn
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Thao tác
              </th>
            </tr>
          </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td className="px-6 py-5">
                    <div className="h-4 w-40 rounded animate-pulse fe-skeleton"></div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full animate-pulse fe-skeleton"></div>
                      <div className="h-6 w-24 rounded-full animate-pulse fe-skeleton"></div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="h-4 w-32 rounded animate-pulse fe-skeleton"></div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="h-4 w-24 rounded animate-pulse fe-skeleton ml-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-4 w-16 rounded animate-pulse fe-skeleton mx-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="h-6 w-12 rounded-full animate-pulse fe-skeleton mx-auto"></div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 rounded-full animate-pulse fe-skeleton"></div>
                      <div className="h-8 w-8 rounded-full animate-pulse fe-skeleton"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--table-header-bg)', borderTop: '1px solid var(--table-border)' }}>
          <div className="h-4 w-32 rounded animate-pulse fe-skeleton"></div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-16 rounded animate-pulse fe-skeleton"></div>
            <div className="h-8 w-16 rounded animate-pulse fe-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  if (safeTransactions.length === 0) {
    return (
      <div className="overflow-hidden rounded-[20px] border" style={{ background: 'var(--table-row-bg)', borderColor: 'var(--table-border)' }}>
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--surface-secondary)', color: 'var(--text-muted)' }}>
            <RefreshCcw className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Chưa có giao dịch nào
            </h3>
            <p className="mx-auto max-w-md text-sm leading-6 tracking-[0.16px]" style={{ color: 'var(--text-secondary)' }}>
              Khi bạn thêm giao dịch mới, lịch sử sẽ xuất hiện tại đây để theo dõi dòng tiền rõ ràng hơn.
            </p>
          </div>
        </div>
        <div className="px-6 py-4" style={{ borderTop: '1px solid var(--table-border)', background: 'var(--surface-secondary)' }}>
          <span className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
            Hiển thị 0 giao dịch
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border" style={{ background: 'var(--table-row-bg)', borderColor: 'var(--table-border)' }}>
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--table-border)' }}>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
            Bảng dữ liệu
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Lịch sử giao dịch gần đây
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedIds.size} đã chọn
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDinhKyModal(true)}
            className="gap-2"
            style={{ borderColor: 'var(--indigo-500)', color: 'var(--indigo-600)' }}
          >
            <RefreshCcw className="h-4 w-4" />
            Tạo định kỳ
          </Button>
          <div className="inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em]" style={{ background: 'var(--surface-primary)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
            {safeTransactions.length} giao dịch
          </div>
        </div>
      </div>

      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead style={{ background: 'var(--surface-secondary)' }}>
            <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
              <th className="px-4 py-4 text-center w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.size === safeTransactions.length && safeTransactions.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ borderColor: 'var(--input-border)' }}
                />
              </th>
              <SortableHeader column="ghichu" label="Giao dịch" />
              <SortableHeader column="loai" label="Loại / Danh mục" />
              <SortableHeader column="taikhoan" label="Tài khoản" />
              <SortableHeader column="sotien" label="Số tiền" align="right" />
              <SortableHeader column="ngay" label="Ngày" align="center" />
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                AI / Nguồn
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--table-header-text)' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.05,
                  delayChildren: 0
                }
              }
            }}
          >
            {safeTransactions.map((t) => (
              <motion.tr
                key={t.giaoDichId}
                variants={itemVariants}
                className="group transition-colors"
                style={{ 
                  borderBottom: '1px solid var(--table-border)',
                  background: selectedIds.has(t.giaoDichId) ? 'var(--sidebar-active-bg)' : 'var(--table-row-bg)'
                }}
              >
                <td className="px-4 py-5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(t.giaoDichId)}
                    onChange={() => toggleSelectOne(t.giaoDichId)}
                    className="h-4 w-4 rounded cursor-pointer"
                    style={{ borderColor: 'var(--input-border)' }}
                  />
                </td>
                <td className="px-6 py-5 align-top">
                  <span className="text-sm font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {t.ghiChu || 'Không có ghi chú'}
                  </span>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--surface-secondary)' }}>
                      {getTypeIcon(t.loaiGiaoDich, t.tenLoaiDanhMuc)}
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium tracking-[0.16px] ${getLoaiChipClass(t.loaiGiaoDich, t.tenLoaiDanhMuc)}`}>
                      {t.tenDanhMuc ?? getLoaiText(t.loaiGiaoDich, t.tenLoaiDanhMuc)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 align-top">
                  <div className="flex flex-col gap-1 text-sm tracking-[0.16px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{t.tenTaiKhoanNguon}</span>
                    {mapApiLoaiToStandard(t.loaiGiaoDich, t.tenLoaiDanhMuc) === 'CHUYEN_KHOAN' && t.tenTaiKhoanDich && (
                      <span className="inline-flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: 'var(--revolut-blue)', background: 'var(--bg-save)', color: 'var(--revolut-blue)' }}>
                        → {t.tenTaiKhoanDich}
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium" style={{ color: mapApiLoaiToStandard(t.loaiGiaoDich, t.tenLoaiDanhMuc) === 'THU' ? '#00a87e' : mapApiLoaiToStandard(t.loaiGiaoDich, t.tenLoaiDanhMuc) === 'CHI' ? '#e23b4a' : '#494fdf' }}>
                  {(() => {
                    const standard = mapApiLoaiToStandard(t.loaiGiaoDich, t.tenLoaiDanhMuc);
                    if (standard === 'THU') return `+${formatCurrency(Math.abs(t.soTien))}`;
                    if (standard === 'CHI') return `-${formatCurrency(Math.abs(t.soTien))}`;
                    return `↔ ${formatCurrency(Math.abs(t.soTien))}`;
                  })()}
                </td>
                <td className="whitespace-nowrap px-6 py-5 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(t.ngayGiaoDich).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  <br />
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(t.ngayGiaoDich).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </td>
                <td className="px-6 py-5 text-center align-top">
                  <div className="flex flex-col items-center gap-1.5">
                    {t.doTinCayAI && (
                      <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--card-border)', background: 'var(--surface-secondary)', color: 'var(--text-primary)' }}>
                        <BrainCircuit className="h-3.5 w-3.5" />
                        <span>{t.doTinCayAI}%</span>
                      </div>
                    )}
                    {t.nguonTao && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {t.nguonTao === 'web' ? 'Web' : t.nguonTao === 'ai' ? 'AI' : t.nguonTao === 'import' ? 'File' : t.nguonTao}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-center align-top">
                  {(() => {
                    const status = t.trangThai ?? 1;
                    if (status === 1) return <span className="badge-success inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">Thành công</span>;
                    if (status === 2) return <span className="badge-pending inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">Đang xử lý</span>;
                    return <span className="badge-error inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">Lỗi</span>;
                  })()}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-3">
                    <ActionButton
                      variant="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        const params = new URLSearchParams(window.location.search);
                        params.set('form', 'CHINH_SUA');
                        params.set('id', String(t.giaoDichId));
                        const q = params.toString();
                        window.history.pushState({}, '', `${window.location.pathname}?${q}`);
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      title="Sửa"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={(e) => { e.stopPropagation(); setDeleteId(t.giaoDichId); }}
                      title="Xóa"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </ActionButton>
                    {t.tepDinhKem && (
                      <ActionButton
                        variant="view"
                        onClick={(e) => { 
                          e.stopPropagation();
                          const fileUrl = `${layCoSoApi()}/api/upload/tep/${t.tepDinhKem}`;
                          window.open(fileUrl, '_blank');
                        }}
                        title="Hóa đơn"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </ActionButton>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--table-header-bg)', borderTop: '1px solid var(--table-border)' }}>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Hiển thị {safeTransactions.length}{pagination?.totalCount !== undefined ? ` / ${pagination.totalCount}` : ''} giao dịch
        </span>
        {pagination && (
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Trang {pagination.page} / {pagination.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                className={`inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${pagination.hasPreviousPage
                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                style={{ borderColor: 'var(--card-border)' }}
                disabled={!pagination.hasPreviousPage}
                onClick={() => onPageChange?.(pagination.page - 1)}
              >
                Trước
              </button>
              <button
                className={`inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${pagination.hasNextPage
                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                style={{ borderColor: 'var(--card-border)' }}
                disabled={!pagination.hasNextPage}
                onClick={() => onPageChange?.(pagination.page + 1)}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa giao dịch?"
        description="Giao dịch này sẽ bị xóa vĩnh viễn. Bạn có chắc muốn tiếp tục?"
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Xuất dữ liệu giao dịch</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              {selectedIds.size === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Bạn chưa chọn giao dịch nào. Vui lòng tick chọn các giao dịch muốn xuất.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowExportModal(false)}
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Bạn đã chọn <span className="font-semibold text-indigo-600">{selectedIds.size}</span> giao dịch.
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIds(new Set())}
                      className="text-xs"
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleExport('excel')}
                      disabled={isExporting}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Xuất Excel</p>
                          <p className="text-xs text-gray-500">.xlsx - Giữ định dạng, màu sắc</p>
                        </div>
                      </div>
                      {isExporting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      ) : (
                        <Download className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleExport('csv')}
                      disabled={isExporting}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Xuất CSV</p>
                          <p className="text-xs text-gray-500">.csv - Tương thích nhiều ứng dụng</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowExportModal(false)}>
                      Hủy
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Giao Dịch Định Kỳ */}
      {showDinhKyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="animate-in zoom-in-95 fade-in duration-300 w-full max-w-2xl">
            <FormGiaoDichDinhKy
              onClose={() => setShowDinhKyModal(false)}
              onSubmitSuccess={() => {
                showToast("Tạo giao dịch định kỳ thành công!", "success");
                setShowDinhKyModal(false);
                onRefresh?.();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
