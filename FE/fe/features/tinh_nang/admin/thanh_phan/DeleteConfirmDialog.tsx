"use client";

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DeleteConfirmDialogProps {
  open: boolean;
  userEmail: string;
  onClose: () => void;
  onConfirm: (email: string) => void;
  title?: string;
  description?: string;
}

export default function DeleteConfirmDialog({
  open,
  userEmail,
  onClose,
  onConfirm,
  title = 'Xóa người dùng',
  description = 'Đây là thao tác xóa mềm. Người dùng sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại trong hệ thống.',
}: DeleteConfirmDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (confirmEmail.toLowerCase().trim() === userEmail.toLowerCase().trim()) {
      setStep(2);
    } else {
      setConfirmEmail('');
    }
  };

  const handleConfirm = () => {
    onConfirm(userEmail);
    setConfirmEmail('');
    setStep(1);
  };

  const handleClose = () => {
    setConfirmEmail('');
    setStep(1);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
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
          {/* Step 1: Xác nhận email */}
          {step === 1 && (
            <>
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20 mb-4">
                <Trash2 className="h-7 w-7 text-red-600" />
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

              {/* Email Confirmation */}
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Để xác nhận xóa người dùng này, vui lòng nhập lại email của họ:
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm-email"
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Email người dùng: <span className="font-semibold">{userEmail}</span>
                  </label>
                  <Input
                    id="confirm-email"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Nhập email để xác nhận..."
                    className="w-full"
                  />
                  {confirmEmail && confirmEmail.toLowerCase().trim() !== userEmail.toLowerCase().trim() && (
                    <p className="text-xs text-red-500">Email không khớp. Vui lòng nhập chính xác.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    style={{
                      background: confirmEmail.toLowerCase().trim() === userEmail.toLowerCase().trim()
                        ? 'var(--color-action-delete)'
                        : 'var(--text-muted)',
                      color: 'white',
                    }}
                    onClick={handleNextStep}
                    disabled={confirmEmail.toLowerCase().trim() !== userEmail.toLowerCase().trim()}
                  >
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Xác nhận cuối cùng */}
          {step === 2 && (
            <>
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20 mb-4">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Xác nhận xóa người dùng
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Bạn đã xác nhận email chính xác. Nhấn "Xóa người dùng" để hoàn tất thao tác xóa mềm.
                </p>
              </div>

              {/* User Info */}
              <div className="p-3 rounded-xl mb-4" style={{ background: 'var(--surface-secondary)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Người dùng bị xóa:
                </p>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {userEmail}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  style={{
                    background: 'var(--color-action-delete)',
                    color: 'white',
                  }}
                  onClick={handleConfirm}
                >
                  Xóa người dùng
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
