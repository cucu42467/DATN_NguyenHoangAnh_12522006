import React from 'react';
import Link from 'next/link';
import { Wallet, Banknote, CreditCard, PiggyBank } from 'lucide-react';
import type { TaiKhoanDto } from '@/types/TaiKhoan';
import { Button } from '@/thanh_phan/ui';

interface SoDuTaiKhoanProps {
  accounts: TaiKhoanDto[];
}

const getIcon = (loai: string) => {
  switch (loai) {
    case 'Tiền mặt':
    case 'TIEN_MAT':
      return <Wallet className="h-5 w-5" />;
    case 'Tài khoản ngân hàng':
    case 'NGAN_HANG':
      return <Banknote className="h-5 w-5" />;
    case 'Ví điện tử':
    case 'VI_DIEN_TU':
      return <CreditCard className="h-5 w-5" />;
    case 'Tiết kiệm':
    case 'TIET_KIEM':
      return <PiggyBank className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

const getColor = (loai: string) => {
  switch (loai) {
    case 'Tiền mặt':
    case 'TIEN_MAT':
      return 'text-[#00a87e] bg-[#f4f4f4]';
    case 'Tài khoản ngân hàng':
    case 'NGAN_HANG':
      return 'text-[#494fdf] bg-[#f4f4f4]';
    case 'Ví điện tử':
    case 'VI_DIEN_TU':
      return 'text-[#ec7e00] bg-[#f4f4f4]';
    case 'Tiết kiệm':
    case 'TIET_KIEM':
      return 'text-[#b09000] bg-[#f4f4f4]';
    default:
      return 'text-[#505a63] bg-[#f4f4f4]';
  }
};

export default function SoDuTaiKhoan({ accounts }: SoDuTaiKhoanProps) {
  // Calculate total balance - API trả về field soDu
  const tongSoDu = accounts.reduce((sum, acc) => {
    const soDu = typeof acc.soDu === 'number' ? acc.soDu : parseFloat(String(acc.soDu)) || 0;
    return sum + soDu;
  }, 0);

  return (
    <div className="fe-card-fe p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium uppercase tracking-tight text-[#191c1f]"
          style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
          Số dư tài khoản
        </h2>
        <div className="text-right">
          <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            Tổng số dư
          </p>
          <p className="text-xl font-medium text-[#191c1f] leading-none"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
            {tongSoDu.toLocaleString('vi-VN')} VND
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {accounts.length === 0 ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-[12px] bg-[#f4f4f4] border border-dashed border-[#c9c9cd]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[12px] text-[#8d969e] bg-[#e5e5e5]">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#8d969e]"
                      style={{ fontFamily: 'Inter, sans-serif' }}>Tài khoản {i}</p>
                    <p className="text-[10px] text-[#8d969e] uppercase tracking-wider"
                      style={{ fontFamily: 'Inter, sans-serif' }}>
                      Chưa có dữ liệu
                    </p>
                  </div>
                </div>
                <p className="font-medium text-[#8d969e]"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  0 VND
                </p>
              </div>
            ))}
            <Link href="/TaiKhoan" className="block">
              <Button variant="primary" size="sm" className="w-full">
                Thêm tài khoản mới
              </Button>
            </Link>
          </>
        ) : (
          accounts.map((account) => (
            <div key={account.taiKhoanId} className="flex items-center justify-between p-3 rounded-[12px] bg-[#f4f4f4]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-[12px] ${getColor(account.loaiTaiKhoan)}`}>
                  {getIcon(account.loaiTaiKhoan)}
                </div>
                <div>
                  <p className="font-medium text-[#191c1f]"
                    style={{ fontFamily: 'Inter, sans-serif' }}>{account.tenTaiKhoan}</p>
                  <p className="text-[10px] text-[#8d969e] uppercase tracking-wider"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    {account.loaiTaiKhoan || ''}
                  </p>
                </div>
              </div>
              <p className="font-medium text-[#191c1f]"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {(typeof account.soDu === 'number' ? account.soDu : parseFloat(String(account.soDu)) || 0).toLocaleString('vi-VN')} VND
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
