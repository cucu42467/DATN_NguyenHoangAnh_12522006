"use client";

import React from 'react';
import { cn } from '@/lib';

type BadgeVariant = 'success' | 'inactive' | 'error' | 'pending' | 'income' | 'expense' | 'transfer' | 'default';

type StatusType = 
  | 'HOAT_DONG' | 'ACTIVE' | 'ENABLED'
  | 'DUNG' | 'INACTIVE' | 'DISABLED'
  | 'LOI' | 'ERROR' | 'FAILED'
  | 'DANG_XU_LY' | 'PENDING' | 'PROCESSING'
  | 'KHOA' | 'LOCKED'
  | 'THU' | 'INCOME'
  | 'CHI' | 'EXPENSE'
  | 'CHUYEN_KHOAN' | 'TRANSFER';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const badgeConfig: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-500',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  income: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  expense: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  transfer: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-500',
  },
};

export function Badge({ variant = 'default', children, className, dot = false }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />}
      {children}
    </span>
  );
}

// Status Badge - Tự động map theo status
interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  // Vietnamese
  HOAT_DONG: 'Hoạt động',
  DUNG: 'Ngừng',
  LOI: 'Lỗi',
  DANG_XU_LY: 'Đang xử lý',
  KHOA: 'Tạm khóa',
  THU: 'Thu nhập',
  CHI: 'Chi tiêu',
  CHUYEN_KHOAN: 'Chuyển khoản',
  // English
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng',
  ENABLED: 'Hoạt động',
  DISABLED: 'Ngừng',
  ERROR: 'Lỗi',
  FAILED: 'Thất bại',
  PENDING: 'Đang xử lý',
  PROCESSING: 'Đang xử lý',
  LOCKED: 'Tạm khóa',
  INCOME: 'Thu nhập',
  EXPENSE: 'Chi tiêu',
  TRANSFER: 'Chuyển khoản',
};

const statusVariants: Record<string, BadgeVariant> = {
  HOAT_DONG: 'success',
  ACTIVE: 'success',
  ENABLED: 'success',
  THU: 'income',
  INCOME: 'income',
  DUNG: 'inactive',
  INACTIVE: 'inactive',
  DISABLED: 'inactive',
  KHOA: 'pending',
  LOCKED: 'pending',
  LOI: 'error',
  ERROR: 'error',
  FAILED: 'error',
  DANG_XU_LY: 'pending',
  PENDING: 'pending',
  PROCESSING: 'pending',
  CHI: 'expense',
  EXPENSE: 'expense',
  CHUYEN_KHOAN: 'transfer',
  TRANSFER: 'transfer',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariants[status] || 'default';
  const label = statusLabels[status] || status;

  return (
    <Badge variant={variant} className={className} dot>
      {label}
    </Badge>
  );
}

export default Badge;
