"use client";

import React from 'react';
import { AlertCircle, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface XacNhanHanhDongProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function XacNhanHanhDong({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  isLoading = false
}: XacNhanHanhDongProps) {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: ShieldAlert,
      bg: 'bg-[#f4f4f4]',
      text: 'text-[#e23b4a]',
      button: 'bg-[#e23b4a] hover:bg-[#c9303f]'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-[#f4f4f4]',
      text: 'text-[#ec7e00]',
      button: 'bg-[#191c1f] hover:bg-[#2d3033]'
    },
    info: {
      icon: CheckCircle2,
      bg: 'bg-[#f4f4f4]',
      text: 'text-[#494fdf]',
      button: 'bg-[#494fdf] hover:bg-[#3d42d1]'
    }
  };

  const theme = themes[type];
  const Icon = theme.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-lg bg-white border border-[#c9c9cd] rounded-[24px] p-10 animate-in zoom-in-95 duration-300`}>
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-[#8d969e] hover:text-[#191c1f] transition-colors"
          disabled={isLoading}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`h-20 w-20 rounded-[20px] bg-[#f4f4f4] ${theme.text} flex items-center justify-center mb-8`}>
            <Icon className="h-10 w-10" />
          </div>

          <h3 className="text-2xl font-medium uppercase tracking-tight leading-none text-[#191c1f] mb-4"
            style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>{title}</h3>
          <p className="text-base text-[#505a63] leading-relaxed mb-8 max-w-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {message}
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#f4f4f4] text-[#505a63] rounded-[12px] font-medium uppercase tracking-wider hover:bg-[#c9c9cd] transition-all"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 ${theme.button} text-white rounded-[12px] font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-3`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isLoading && <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
