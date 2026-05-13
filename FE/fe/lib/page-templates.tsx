/**
 * Page Templates - Template các trang theo tiêu chuẩn UX/UI
 * 
 * Sử dụng các templates này để tạo/trang trang mới theo chuẩn:
 * - Label nằm trên input
 * - Button hierarchy đúng
 * - Validation messages cụ thể
 * - Confirm dialog cho destructive actions
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/thanh_phan/ui';
import { Input, Select, AmountInput, FormSection, FormGrid, FormActions } from '@/thanh_phan/chung/Form';
import { StatusBadge, EmptyState, EmptyData } from '@/thanh_phan/ui';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableActions, TablePagination, ActionButtons, PaginationInfo } from '@/thanh_phan/ui';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';

// ============================================
// LIST PAGE TEMPLATE
// ============================================

interface ListPageHeaderProps {
  title: string;
  description?: string;
  addButtonText?: string;
  onAddClick?: () => void;
}

export function ListPageHeader({
  title,
  description,
  addButtonText = "Thêm mới",
  onAddClick,
}: ListPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {onAddClick && (
        <Button variant="success" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row ${className || ''}`}>
      {children}
    </div>
  );
}

interface TablePageTemplateProps<T> {
  // Header
  title: string;
  description?: string;
  addButtonText?: string;
  onAddClick?: () => void;

  // Filters
  filters?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Table
  columns: { key: string; label: string; width?: string; align?: 'left' | 'center' | 'right' }[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;

  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;

  // States
  isLoading?: boolean;
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;

  // Bulk actions
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function TablePageTemplate<T>({
  title,
  description,
  addButtonText,
  onAddClick,
  filters,
  columns,
  data,
  renderRow,
  keyExtractor,
  pagination,
  onPageChange,
  isLoading,
  emptyTitle = `Chưa có ${title.toLowerCase()} nào`,
  emptyDescription = `Danh sách ${title.toLowerCase()} của bạn đang trống.`,
  emptyAction,
}: TablePageTemplateProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ListPageHeader title={title} description={description} />
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListPageHeader
        title={title}
        description={description}
        addButtonText={addButtonText}
        onAddClick={onAddClick}
      />

      {/* Filters */}
      {filters && <FilterBar>{filters}</FilterBar>}

      {/* Table or Empty State */}
      {data.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white">
          <EmptyState
            icon="inbox"
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        </div>
      ) : (
        <Table>
          <TableHeader columns={columns} />
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={keyExtractor(item)}>
                {renderRow(item, index)}
              </TableRow>
            ))}
          </TableBody>
          {pagination && onPageChange && (
            <tfoot className="border-t border-gray-200 bg-gray-50">
              <tr>
                <td colSpan={columns.length}>
                  <TablePagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      )}
    </div>
  );
}

// ============================================
// FORM PAGE TEMPLATE
// ============================================

interface FormPageTemplateProps {
  // Navigation
  backHref: string;
  backTitle?: string;

  // Header
  title: string;
  description?: string;

  // Form
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;

  // Actions
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;

  // Submit button variant (default: primary = blue)
  submitVariant?: 'primary' | 'success';
}

export function FormPageTemplate({
  backHref,
  backTitle = "Quay lại",
  title,
  description,
  children,
  onSubmit,
  isSubmitting,
  submitText = "Lưu thay đổi",
  cancelText = "Hủy bỏ",
  onCancel,
  submitVariant = 'primary',
}: FormPageTemplateProps) {
  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {backTitle}
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        {/* Form Actions - Primary button always on right */}
        <FormActions>
          <Button
            type="button"
            variant="neutral"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant={submitVariant}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : submitText}
          </Button>
        </FormActions>
      </form>
    </div>
  );
}

// ============================================
// DETAIL PAGE TEMPLATE
// ============================================

interface DetailPageHeaderProps {
  backHref: string;
  backTitle?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DetailPageHeader({
  backHref,
  backTitle = "Quay lại",
  title,
  subtitle,
  actions,
}: DetailPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backTitle}
        </Link>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

interface DetailCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailCard({ children, className }: DetailCardProps) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

interface DetailSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DetailItem({ label, value, className }: DetailItemProps) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}

// ============================================
// DELETE ACTION HOOK
// ============================================

interface UseDeleteActionOptions {
  onDelete: (id: string) => Promise<void>;
  itemName?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useDeleteAction({
  onDelete,
  itemName = "mục này",
  successMessage,
  errorMessage,
}: UseDeleteActionOptions) {
  const { showToast } = useToast();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      showToast(successMessage || `${itemName} đã được xóa thành công`, "success");
      setDeleteId(null);
    } catch (error) {
      showToast(errorMessage || `Không thể xóa ${itemName}. Vui lòng thử lại.`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return {
    deleteId,
    isDeleting,
    confirmDelete,
    cancelDelete,
    handleDelete,
    DeleteConfirmDialog: () => (
      <ConfirmDialog
        open={deleteId !== null}
        onClose={cancelDelete}
        onConfirm={handleDelete}
        title={`Xóa ${itemName}?`}
        description={`Bạn có chắc muốn xóa ${itemName} này? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />
    ),
  };
}

// ============================================
// EXPORT ALL TEMPLATES
// ============================================

export default {
  ListPageHeader,
  FilterBar,
  TablePageTemplate,
  FormPageTemplate,
  DetailPageHeader,
  DetailCard,
  DetailSection,
  DetailItem,
  useDeleteAction,
};
