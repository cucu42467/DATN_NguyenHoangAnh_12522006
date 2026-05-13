"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib';

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  value?: number | string;
  onChange?: (value: number) => void;
  currency?: string;
  min?: number;
  max?: number;
  quickAmounts?: number[];
}

export default function AmountInput({
  label,
  error,
  hint,
  placeholder = "0",
  required,
  value,
  onChange,
  currency = "VND",
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  quickAmounts,
  disabled,
  className,
  ...props
}: AmountInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);
  const previousValueRef = useRef<string>('');

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  // Convert display cursor position to raw cursor position (ignoring dots)
  const displayToRawPosition = (displayValue: string, displayPos: number): number => {
    let rawPos = 0;
    let displayCount = 0;
    for (let i = 0; i < displayValue.length; i++) {
      if (/\d/.test(displayValue[i])) {
        displayCount++;
        if (displayCount >= displayPos) {
          return rawPos + 1;
        }
      }
      rawPos++;
    }
    return rawPos;
  };

  // Convert raw cursor position to display cursor position
  const rawToDisplayPosition = useCallback((displayValue: string, rawPos: number): number => {
    let displayPos = 0;
    let rawCount = 0;
    for (let i = 0; i < displayValue.length; i++) {
      if (/\d/.test(displayValue[i])) {
        if (rawCount < rawPos) {
          displayPos = i + 1;
        }
        rawCount++;
        if (rawCount >= rawPos) {
          return displayPos;
        }
      }
    }
    return displayValue.length;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const displayValue = input.value;
    const selectionStart = input.selectionStart || 0;

    // Lưu raw position trước khi thay đổi
    const rawPos = displayToRawPosition(displayValue, selectionStart);
    cursorPositionRef.current = rawPos;
    previousValueRef.current = displayValue.replace(/[^\d]/g, '');

    const rawValue = displayValue.replace(/[^\d]/g, '');
    const numValue = parseInt(rawValue, 10) || 0;
    onChange?.(numValue);
  };

  // Restore cursor position sau khi value thay đổi
  useEffect(() => {
    if (isFocused && inputRef.current) {
      const input = inputRef.current;
      const displayValue = input.value;
      const rawValue = String(value || '');
      const currentLength = rawValue.length;
      const previousLength = previousValueRef.current.length;

      let targetRawPos: number;

      if (currentLength > previousLength) {
        // Đang nhập thêm → đặt ở cuối
        targetRawPos = currentLength;
      } else {
        // Đang xóa → giữ nguyên vị trí
        targetRawPos = Math.max(0, Math.min(cursorPositionRef.current, currentLength));
      }

      const newDisplayPos = rawToDisplayPosition(displayValue, targetRawPos);

      // Restore cursor bằng native method
      const setCursor = () => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newDisplayPos, newDisplayPos);
        }
      };

      // Delay nhỏ để đảm bảo DOM đã cập nhật
      const timeoutId = setTimeout(setCursor, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [value, isFocused, rawToDisplayPosition]);

  const handleQuickAmount = (amount: number) => {
    const currentValue = value !== undefined && value !== null && value !== ''
      ? parseNumber(String(value))
      : 0;
    onChange?.(currentValue + amount);
  };

  const displayValue = value !== undefined && value !== null && value !== ''
    ? formatNumber(Number(value))
    : '';

  const placeholderText = isFocused ? "" : placeholder;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className={cn(
            "text-sm font-medium",
            error ? "text-red-500" : "text-gray-400 dark:text-gray-500"
          )}>
            {currency === "VND" ? "₫" : currency}
          </span>
        </div>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder={placeholderText}
          value={displayValue}
          onChange={handleChange}
          onFocus={(e) => {
            if (!disabled) {
              setIsFocused(true);
              const rawPos = displayToRawPosition(e.target.value, e.target.selectionStart || 0);
              cursorPositionRef.current = rawPos;
              previousValueRef.current = String(value || '');
            }
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (!disabled) {
              const input = e.currentTarget;
              const rawPos = displayToRawPosition(input.value, input.selectionStart || 0);
              cursorPositionRef.current = rawPos;
            }
          }}
          disabled={disabled}
          className={cn(
            "flex h-12 w-full rounded-xl border bg-white dark:bg-zinc-900 pl-10 pr-4",
            "text-sm font-medium text-right",
            "placeholder:text-gray-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-4",
            disabled && "bg-gray-50 dark:bg-zinc-800 cursor-not-allowed",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              : "border-gray-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/10 hover:border-gray-300 dark:hover:border-zinc-600",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
      </div>

      {quickAmounts && quickAmounts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAmount(amount)}
              disabled={disabled}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                disabled
                  ? "border border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "border border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
            >
              {formatNumber(amount)}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-red-500" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
