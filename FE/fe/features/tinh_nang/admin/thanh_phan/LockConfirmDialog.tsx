"use client";

import { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LockConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  title?: string;
  description?: string;
}

export default function LockConfirmDialog({
  open,
  onClose,
  onConfirm,
  reason,
  onReasonChange,
  title = 'Khóa tài khoản',
  description = 'Vui lòng nhập lý do khóa tài khoản này. Lý do này sẽ được ghi lại trong nhật ký hệ thống.',
}: LockConfirmDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm transition-opacity"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        />

        {/* Dialog */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200"
          style={{ background: 'var(--modal-bg)' }}
          role="dialog"
          aria-modal="true"
        >
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20 mb-4">
            <Lock className="h-7 w-7 text-amber-600" />
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {description}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="lock-reason"
                className="text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Lý do khóa <span className="text-red-500">*</span>
              </label>
              <textarea
                id="lock-reason"
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Nhập lý do khóa tài khoản..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border resize-none"
                style={{
                  background: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-text)',
                }}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onClose}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="flex-1"
                style={{
                  background: 'var(--color-action-edit)',
                  color: 'white',
                }}
                disabled={!reason.trim()}
              >
                Xác nhận khóa
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
