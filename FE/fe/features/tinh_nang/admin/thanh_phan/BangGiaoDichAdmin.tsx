"use client";

import React, { useState, useEffect } from 'react';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  Edit2,
  Trash2,
  ExternalLink,
  BrainCircuit,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { GiaoDichType, LoaiGiaoDich } from '@/kieu_du_lieu/user/GiaoDich';
import { layDanhSachGiaoDichQt } from '@/services/qt/giaodich';
import Link from 'next/link';

interface AdminGiaoDichType {
  giaoDichId: number;
  nguoiDungId: number;
  hoTen: string;
  soTien: number;
  loaiGiaoDich: LoaiGiaoDich | number;
  ngayGiaoDich: string;
  moTa?: string | null;
  tenDanhMuc?: string | null;
  tenTaiKhoan?: string | null;
  ghiChu?: string;
  tepDinhKem?: string;
  doTinCayAI?: number;
  taiKhoanNguonId?: number;
  tenTaiKhoanNguon?: string;
  taiKhoanDichId?: number;
  tenTaiKhoanDich?: string;
  danhMucId?: number;
  tenLoaiDanhMuc?: string;
}

export default function BangGiaoDichAdmin() {
  const [transactions, setTransactions] = useState<AdminGiaoDichType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await layDanhSachGiaoDichQt({ page, pageSize: PAGE_SIZE });
      setTransactions(result?.items || []);
      setTotalCount(result?.totalCount || 0);
      setTotalPages(result?.totalPages || 1);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchTransactions(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  const getTypeIcon = (type: LoaiGiaoDich | number) => {
    const numType = typeof type === 'number' ? type :
      type === LoaiGiaoDich.THU ? 1 :
        type === LoaiGiaoDich.CHI ? 2 :
          type === LoaiGiaoDich.CHUYEN_KHOAN ? 3 : type;

    switch (numType) {
      case 1: // THU
        return <ArrowUpCircle className="h-5 w-5 text-[#00a87e]" />;
      case 2: // CHI
        return <ArrowDownCircle className="h-5 w-5 text-[#e23b4a]" />;
      case 3: // CHUYEN_KHOAN
        return <RefreshCcw className="h-4 w-4 text-[#494fdf]" />;
      default:
        return null;
    }
  };

  const isThu = (loai: LoaiGiaoDich | number) => {
    if (typeof loai === 'number') return loai === 1;
    return loai === LoaiGiaoDich.THU;
  };

  const isChi = (loai: LoaiGiaoDich | number) => {
    if (typeof loai === 'number') return loai === 2;
    return loai === LoaiGiaoDich.CHI;
  };

  const isChuyenKhoan = (loai: LoaiGiaoDich | number) => {
    if (typeof loai === 'number') return loai === 3;
    return loai === LoaiGiaoDich.CHUYEN_KHOAN;
  };

  if (loading) return (
    <div className="bg-white border border-[#c9c9cd] rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4]">
              <th className="px-10 py-5 text-xs font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Người dùng / Giao dịch
              </th>
              <th className="px-10 py-6 text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Loại / Danh mục
              </th>
              <th className="px-10 py-6 text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Tài khoản
              </th>
              <th className="px-10 py-6 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-right"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Số tiền
              </th>
              <th className="px-10 py-6 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                AI
              </th>
              <th className="px-10 py-6 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-right"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#e5e5e5]">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <tr key={i}>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-[12px] animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </td>
                <td className="px-10 py-8 text-center">
                  <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-20 text-center text-red-500">
      Lỗi: {error}
    </div>
  );

  return (
    <div className="bg-white border border-[#c9c9cd] rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4]">
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Người dùng / Giao dịch
              </th>
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Loại / Danh mục
              </th>
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Tài khoản
              </th>
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-right"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Số tiền
              </th>
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-center"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                AI
              </th>
              <th className="px-10 py-5 text-[9px] font-medium uppercase tracking-wider text-[#8d969e] text-right"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#e5e5e5]">
            {transactions.map((t) => (
              <tr key={t.giaoDichId} className="group hover:bg-[#f4f4f4] transition-colors">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/NguoiDung/${t.nguoiDungId}`} className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-[12px] bg-[#f4f4f4] flex items-center justify-center text-[#8d969e] group-hover:bg-[#494fdf] group-hover:text-white transition-all">
                        <User className="h-5 w-5" />
                      </div>
                    </Link>
                    <div>
                      <p className="font-medium text-[#191c1f] uppercase italic tracking-tight mb-1"
                        style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                        {t.moTa || t.ghiChu || 'Không có ghi chú'}
                      </p>
                      <p className="text-[10px] text-[#8d969e] uppercase tracking-wider flex items-center gap-1.5 italic"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <User className="h-3 w-3" /> {t.hoTen} • {t.ngayGiaoDich}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(t.loaiGiaoDich)}
                    <span className="px-3 py-1.5 bg-[#f4f4f4] text-[#505a63] rounded-[12px] text-[9px] font-medium uppercase tracking-wider border border-[#c9c9cd]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      {t.tenDanhMuc}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8 text-sm text-[#505a63] font-medium italic"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {t.tenTaiKhoan || t.tenTaiKhoanNguon}
                </td>
                <td className={`px-10 py-8 text-lg font-medium text-right ${isThu(t.loaiGiaoDich) ? 'text-[#00a87e]' :
                  isChi(t.loaiGiaoDich) ? 'text-[#e23b4a]' : 'text-[#494fdf]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {isThu(t.loaiGiaoDich) ? '+' : '-'}{formatCurrency(t.soTien)} VND
                </td>
                <td className="px-10 py-8 text-center">
                  {t.doTinCayAI && (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f4f4f4] text-[#494fdf] rounded-[12px] border border-[#c9c9cd]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      <BrainCircuit className="h-3 w-3" />
                      <span className="text-[9px] font-medium">{t.doTinCayAI}%</span>
                    </div>
                  )}
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2.5 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#f4f4f4] rounded-[12px] transition-all">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-2.5 text-[#8d969e] hover:text-[#e23b4a] hover:bg-[#f4f4f4] rounded-[12px] transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {t.tepDinhKem && (
                      <button className="p-2.5 text-[#8d969e] hover:text-[#00a87e] hover:bg-[#f4f4f4] rounded-[12px] transition-all">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-10 py-6 bg-[#f4f4f4] flex justify-between items-center border-t border-[#c9c9cd]">
        <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider italic leading-none"
          style={{ fontFamily: 'Inter, sans-serif' }}>
          Hiển thị {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, totalCount)} trên tổng số {totalCount} giao dịch
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-2 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#e5e5e5] rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#e5e5e5] rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {renderPagination().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`min-w-[36px] h-9 px-3 rounded-[8px] text-xs font-medium transition-all ${page === currentPage
                    ? 'bg-[#494fdf] text-white'
                    : 'text-[#8d969e] hover:bg-[#e5e5e5] hover:text-[#494fdf]'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-[#8d969e]">...</span>
            )
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#e5e5e5] rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-2 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#e5e5e5] rounded-[8px] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
