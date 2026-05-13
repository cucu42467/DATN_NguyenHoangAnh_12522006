"use client";

import React from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '../Button';

type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
  showCloseButton?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = 'danger',
  loading = false,
  showCloseButton = true,
}: ConfirmDialogProps) {
  if (!open) return null;

  const variantConfig = {
    danger: {
      icon: <Trash2 className="h-6 w-6" />,
      iconBg: 'var(--badge-error-bg)',
      iconColor: 'var(--badge-error-text)',
      buttonBg: 'var(--color-action-delete)',
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6" />,
      iconBg: 'var(--badge-pending-bg)',
      iconColor: 'var(--badge-pending-text)',
      buttonBg: 'var(--color-action-edit)',
    },
    info: {
      icon: <Info className="h-6 w-6" />,
      iconBg: 'var(--bg-save)',
      iconColor: 'var(--color-primary)',
      buttonBg: 'var(--color-action-save)',
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        style={{ background: 'var(--overlay-bg)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl p-6 shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        style={{ background: 'var(--modal-bg)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute right-4 top-4 rounded-lg p-1.5 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            )}
            style={{ color: 'var(--text-muted)' }}
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: variantConfig.iconBg }}>
          <span style={{ color: variantConfig.iconColor }}>{variantConfig.icon}</span>
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h3
            id="confirm-dialog-title"
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
            style={{ background: variantConfig.buttonBg, color: 'white' }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
