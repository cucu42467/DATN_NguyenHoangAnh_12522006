"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Wallet,
  Banknote,
  ArrowRightLeft,
  Pencil,
  Trash2,
  Plus,
  PiggyBank,
  Smartphone,
} from 'lucide-react';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';
import { xoaTaiKhoan } from '@/services';
import type { TaiKhoanDto } from '@/types';

interface DanhSachTaiKhoanProps {
  accounts: TaiKhoanDto[];
  onRefresh?: () => void;
}

// Map loại tài khoản → icon, màu nền
const LoaiConfig: Record<string, { icon: React.ElementType; bg: string }> = {
  'Tiền mặt': { icon: Banknote, bg: 'bg-amber-100 text-amber-600' },
  'Tài khoản ngân hàng': { icon: CreditCard, bg: 'bg-blue-100 text-blue-600' },
  'Ví điện tử': { icon: Smartphone, bg: 'bg-pink-100 text-pink-600' },
  'Thẻ tín dụng': { icon: CreditCard, bg: 'bg-purple-100 text-purple-600' },
  'Tiết kiệm': { icon: PiggyBank, bg: 'bg-emerald-100 text-emerald-600' },
};

export default function DanhSachTaiKhoan({ accounts, onRefresh }: DanhSachTaiKhoanProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getIconConfig = (loai: string) => {
    return LoaiConfig[loai] || { icon: Wallet, bg: 'bg-gray-100 text-gray-600' };
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await xoaTaiKhoan(deleteId);
      showToast("Tài khoản đã được xóa thành công!", "success");
      setDeleteId(null);
      onRefresh?.();
    } catch (error) {
      showToast("Không thể xóa tài khoản. Vui lòng thử lại.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (acc: TaiKhoanDto) => {
    router.push(
      `/TaiKhoan?form=CHINH_SUA&edit=${encodeURIComponent(
        JSON.stringify({
          taiKhoanId: acc.taiKhoanId,
          tenTaiKhoan: acc.tenTaiKhoan ?? '',
          loaiTaiKhoan: acc.loaiTaiKhoan ?? '',
          soDuBanDau: acc.soDu ?? 0,
          tenNganHang: acc.tenNganHang ?? '',
          soTaiKhoan: acc.soTaiKhoan ?? '',
          hanMucTinDung: acc.hanMucTinDung ?? 0,
        })
      )}`
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc, index) => {
          const { icon: IconComponent, bg } = getIconConfig(acc.loaiTaiKhoan);
          
          return (
            <div
              key={acc.taiKhoanId ?? `acc-${index}`}
              className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${bg} transition-all`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(acc.taiKhoanId); }}
                    title="Xóa"
                    className="absolute top-6 right-6 p-0"
                  >
                    <Trash2 className="h-5 w-5 text-rose-600" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{acc.tenTaiKhoan}</h3>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {acc.loaiTaiKhoan}
                  </p>
                  {(acc.tenNganHang || acc.soTaiKhoan) && (
                    <div className="mt-2 space-y-0.5">
                      {acc.tenNganHang && <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{acc.tenNganHang}</p>}
                      {acc.soTaiKhoan && <p className="text-xs font-mono text-zinc-500">{acc.soTaiKhoan}</p>}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Số dư hiện tại</span>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(acc.soDu ?? 0)}
                  </p>
                  {acc.hanMucTinDung && acc.hanMucTinDung > 0 && (
                    <p className="mt-1 text-xs text-purple-600">
                      Hạn mức: {formatCurrency(acc.hanMucTinDung)}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all"
                    onClick={(e) => { e.stopPropagation(); handleEdit(acc); }}
                    title="Sửa"
                  >
                    <Pencil className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-600">Sửa tài khoản</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 group hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer min-h-[250px]"
          onClick={() => router.push('/TaiKhoan?form=THEM')}
        >
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all transform group-hover:scale-110">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-white" />
          </div>
          <span className="mt-4 text-sm font-medium text-gray-500 group-hover:text-green-600 transition-colors">
            Thêm tài khoản mới
          </span>
        </button>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa tài khoản?"
        description="Tài khoản này sẽ bị xóa vĩnh viễn. Bạn có chắc muốn tiếp tục?"
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />
    </>
  );
}
