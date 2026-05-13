import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { GiaoDichDto } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import { LoaiGiaoDichEnum } from '@/kieu_du_lieu/TrangChu';
import { Button } from '@/thanh_phan/ui';
import { FadeIn } from '@/thanh_phan/animation';

interface BangGiaoDichProps {
  transactions: GiaoDichDto[];
  loading?: boolean;
}

export default function BangGiaoDich({ transactions = [], loading = false }: BangGiaoDichProps) {
  const prefersReducedMotion = useReducedMotion();

  const mapApiLoaiToStandard = (loai: GiaoDichDto['loaiGiaoDich']): 'THU' | 'CHI' | 'CHUYEN_KHOAN' | null => {
    const v = loai as any;
    if (v === 1 || v === '1' || v === LoaiGiaoDichEnum.Thu || v === 'Thu') return 'THU';
    if (v === 2 || v === '2' || v === LoaiGiaoDichEnum.Chi || v === 'Chi') return 'CHI';
    if (v === 3 || v === '3' || v === LoaiGiaoDichEnum.ChuyenKhoan || v === 'ChuyenKhoan') return 'CHUYEN_KHOAN';
    return null;
  };

  const getAmountColor = (loai: GiaoDichDto['loaiGiaoDich']) => {
    const standard = mapApiLoaiToStandard(loai);
    if (standard === 'THU') return 'text-[#00a87e]';
    if (standard === 'CHUYEN_KHOAN') return 'text-[#494fdf]';
    return 'text-[#191c1f]';
  };

  const getAmountPrefix = (loai: GiaoDichDto['loaiGiaoDich']) => {
    const standard = mapApiLoaiToStandard(loai);
    if (standard === 'THU') return '+';
    if (standard === 'CHUYEN_KHOAN') return '↔ ';
    return '-';
  };

  return (
    <div className="fe-card-fe overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-[#c9c9cd]">
        <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f]"
          style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
          Giao dịch gần đây
        </h2>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f4f4f4] text-[10px] font-medium uppercase tracking-wider text-[#8d969e]"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <th className="px-6 py-4">Giao dịch</th>
              <th className="px-6 py-4 hidden sm:table-cell">Hạng mục</th>
              <th className="px-6 py-4 hidden sm:table-cell">Độ tin cậy</th>
              <th className="px-6 py-4 text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c9cd] text-sm">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-gray-200 rounded-[12px] animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#8d969e]">Chưa có giao dịch để hiển thị.</td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.giaoDichId}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.4, ease: 'easeOut' }}
                  className="hover:bg-[#f4f4f4] transition-colors group cursor-pointer"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={() => window.location.href = '/GiaoDich'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-[12px] bg-[#f4f4f4] text-[#8d969e]">
                        <span className="text-xs font-medium">{tx.tenDanhMuc?.charAt(0) ?? 'G'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-[#191c1f]">{tx.ghiChu || tx.tenDanhMuc || 'Không có mô tả'}</p>
                        <p className="text-[10px] text-[#8d969e] mt-0.5 uppercase tracking-wider">
                          {new Date(tx.ngayGiaoDich).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f4f4f4] text-[#505a63] border border-[#c9c9cd]">
                      {tx.tenDanhMuc || 'Không phân loại'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {tx.doTinCayAI ? (
                      <span className="text-xs font-medium text-[#8d969e]">AI {(tx.doTinCayAI * 100).toFixed(0)}%</span>
                    ) : (
                      <span className="text-xs text-[#c9c9cd]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium whitespace-nowrap"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span className={getAmountColor(tx.loaiGiaoDich)}>
                      {getAmountPrefix(tx.loaiGiaoDich)}
                      {Math.abs(tx.soTien).toLocaleString('vi-VN')}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#c9c9cd] bg-[#f4f4f4]">
        <Link href="/GiaoDich" className="block">
          <Button variant="neutral" className="w-full">
            <span>Xem tất cả giao dịch</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
