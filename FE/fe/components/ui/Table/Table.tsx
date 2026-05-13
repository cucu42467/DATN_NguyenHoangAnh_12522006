"use client";

import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib';
import { Button, ActionButton } from '../Button';

// ============================================
// TABLE COMPONENT
// ============================================

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border", className)}
      style={{ 
        background: 'var(--table-row-bg)',
        borderColor: 'var(--table-border)'
      }}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {children}
        </table>
      </div>
    </div>
  );
}

// ============================================
// TABLE HEADER
// ============================================

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableHeaderProps {
  columns: TableColumn[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--table-border)' }}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              "px-6 py-4 text-xs font-semibold uppercase tracking-wider",
              column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left',
              column.width
            )}
            style={{ color: 'var(--table-header-text)' }}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ============================================
// TABLE BODY
// ============================================

export interface TableBodyProps {
  children: React.ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody style={{ borderColor: 'var(--table-border)' }}>
      {children}
    </tbody>
  );
}

// ============================================
// TABLE ROW
// ============================================

export interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{ 
        background: 'var(--table-row-bg)',
        borderBottom: '1px solid var(--table-border)'
      }}
    >
      {children}
    </tr>
  );
}

// ============================================
// TABLE CELL
// ============================================

export interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function TableCell({ children, align = 'left', className }: TableCellProps) {
  return (
    <td
      className={cn(
        "px-6 py-4 text-sm",
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      style={{ color: 'var(--table-cell-text)' }}
    >
      {children}
    </td>
  );
}

// ============================================
// TABLE ACTIONS CELL
// ============================================

export interface TableActionsProps {
  children: React.ReactNode;
}

export function TableActions({ children }: TableActionsProps) {
  return (
    <td className="px-6 py-4">
      <div className="flex items-center justify-center gap-2">
        {children}
      </div>
    </td>
  );
}

// ============================================
// TABLE PAGINATION
// ============================================

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TablePaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
}

export function TablePagination({
  pagination,
  onPageChange,
  showPageNumbers = true,
}: TablePaginationProps) {
  const { page, totalPages, totalCount, hasPreviousPage, hasNextPage } = pagination;
  
  // Calculate display range for page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(page * pagination.pageSize, totalCount);

  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ 
        background: 'var(--table-header-bg)',
        borderTop: '1px solid var(--table-border)',
        color: 'var(--text-secondary)'
      }}>
      {/* Summary */}
      <div className="text-sm">
        Hiển thị {startItem} - {endItem} của {totalCount} kết quả
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, i) => (
              typeof p === 'number' ? (
                <Button
                  key={i}
                  variant={p === page ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(p)}
                  className="w-9 px-0"
                >
                  {p}
                </Button>
              ) : (
                <span key={i} className="px-2" style={{ color: 'var(--text-muted)' }}>
                  {p}
                </span>
              )
            ))}
          </div>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="gap-1"
        >
          Tiếp
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// TABLE FOOTER (simple)
// ============================================

export interface TableFooterProps {
  children: ReactNode;
}

export function TableFooter({ children }: TableFooterProps) {
  return (
    <tfoot style={{ borderTop: '1px solid var(--table-border)', background: 'var(--table-header-bg)' }}>
      <tr>
        <td colSpan={999} className="px-6 py-4">
          {children}
        </td>
      </tr>
    </tfoot>
  );
}

// ============================================
// ACTION BUTTONS SHORTCUT
// ============================================

export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onClick?: () => void;
  editTitle?: string;
  deleteTitle?: string;
  viewTitle?: string;
}

export function ActionButtons({
  onEdit,
  onDelete,
  onView,
  onClick,
  editTitle = "Sửa",
  deleteTitle = "Xóa",
  viewTitle = "Xem chi tiết",
}: ActionButtonsProps) {
  if (onClick) {
    // Simple click row - no action buttons
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {onEdit && (
        <ActionButton
          variant="edit"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title={editTitle}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </ActionButton>
      )}
      {onDelete && (
        <ActionButton
          variant="delete"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title={deleteTitle}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </ActionButton>
      )}
      {onView && (
        <ActionButton
          variant="view"
          onClick={(e) => { e.stopPropagation(); onView(); }}
          title={viewTitle}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </ActionButton>
      )}
    </div>
  );
}

export default Table;
