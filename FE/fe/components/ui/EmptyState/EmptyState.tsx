"use client";

import React from 'react';
import { LucideIcon, Inbox, FileQuestion, Search } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '../Button';

type EmptyStateIcon = 'inbox' | 'search' | 'question' | 'custom';

interface EmptyStateProps {
  icon?: EmptyStateIcon | LucideIcon;
  customIcon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const defaultIcons: Record<EmptyStateIcon, LucideIcon> = {
  inbox: Inbox,
  search: Search,
  question: FileQuestion,
  custom: Inbox,
};

export function EmptyState({
  icon = 'inbox',
  customIcon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? defaultIcons[icon] : icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--surface-secondary)', color: 'var(--text-muted)' }}>
        {customIcon || <IconComponent className="h-6 w-6" />}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

// Pre-built EmptyState for Transactions
export function EmptyTransactions({ onAddNew }: { onAddNew?: () => void }) {
  return (
    <EmptyState
      icon="inbox"
      title="Chưa có giao dịch nào"
      description="Khi bạn thêm giao dịch mới, lịch sử sẽ xuất hiện tại đây để theo dõi dòng tiền rõ ràng hơn."
      action={
        onAddNew ? (
          <Button variant="success" onClick={onAddNew}>
            Thêm giao dịch
          </Button>
        ) : undefined
      }
    />
  );
}

// Pre-built EmptyState for Search
export function EmptySearch({ keyword }: { keyword?: string }) {
  return (
    <EmptyState
      icon="search"
      title="Không tìm thấy kết quả"
      description={
        keyword
          ? `Không có kết quả nào cho "${keyword}". Vui lòng thử từ khóa khác.`
          : "Không có kết quả nào phù hợp với bộ lọc của bạn."
      }
    />
  );
}

// Pre-built EmptyState for No Data
export function EmptyData({ entity = "dữ liệu" }: { entity?: string }) {
  return (
    <EmptyState
      icon="inbox"
      title={`Chưa có ${entity} nào`}
      description={`Danh sách ${entity} của bạn đang trống. Hãy bắt đầu bằng việc thêm mới.`}
    />
  );
}

export default EmptyState;
