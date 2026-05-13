"use client";

import { useState } from 'react';
import { X, Lock, Unlock, Download, Users, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import LockConfirmDialog from './LockConfirmDialog';

interface FloatingActionBarProps {
  count: number;
  onLock: (reason: string) => void;
  onUnlock: () => void;
  onExport: () => void;
  onClear: () => void;
}

export default function FloatingActionBar({
  count,
  onLock,
  onUnlock,
  onExport,
  onClear,
}: FloatingActionBarProps) {
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockReason, setLockReason] = useState('');

  const handleConfirmLock = () => {
    onLock(lockReason);
    setShowLockDialog(false);
    setLockReason('');
  };

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300"
      >
        <div
          className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border"
          style={{
            background: 'var(--modal-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          {/* Selection count */}
          <div className="flex items-center gap-2 pr-4 border-r" style={{ borderColor: 'var(--border-color)' }}>
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              <span className="text-lg font-bold">{count}</span>
            </div>
            <span className="font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              người dùng được chọn
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Lock */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLockDialog(true)}
              leftIcon={<Lock className="h-4 w-4" />}
              className="gap-1.5"
            >
              Khóa hàng loạt
            </Button>

            {/* Unlock */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onUnlock}
              leftIcon={<Unlock className="h-4 w-4" />}
              className="gap-1.5"
            >
              Mở khóa hàng loạt
            </Button>

            {/* Export */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              leftIcon={<Download className="h-4 w-4" />}
              className="gap-1.5"
            >
              Xuất Excel
            </Button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px mx-2" style={{ background: 'var(--border-color)' }} />

          {/* Clear */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="!p-2"
            title="Bỏ chọn tất cả"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Lock Dialog */}
      <LockConfirmDialog
        open={showLockDialog}
        onClose={() => setShowLockDialog(false)}
        onConfirm={handleConfirmLock}
        reason={lockReason}
        onReasonChange={setLockReason}
        title="Khóa hàng loạt"
        description={`Bạn đang khóa ${count} tài khoản. Vui lòng nhập lý do khóa để tiếp tục.`}
      />
    </>
  );
}
