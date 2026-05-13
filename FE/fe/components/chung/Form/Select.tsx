"use client";

import React, { forwardRef } from "react";
import { LucideIcon, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon;
  options: Option[];
  error?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  isLoading?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      icon: Icon,
      options,
      error,
      hint,
      placeholder,
      required,
      isLoading,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="w-full">
        {/* Label - luon nam tren input */}
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Select wrapper */}
        <div className="relative group">
          {/* Left Icon */}
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  error ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"
                )}
              />
            </div>
          )}

          {/* Select */}
          <select
            ref={ref}
            id={selectId}
            disabled={props.disabled || isLoading}
            className={cn(
              "appearance-none flex h-12 w-full rounded-xl border bg-white px-4",
              "text-sm font-medium",
              props.disabled || isLoading ? "text-gray-400 bg-gray-50 cursor-not-allowed" : "text-gray-900",
              "transition-all duration-200",
              "focus:outline-none focus:ring-4 focus:ring-blue-500/10",
              Icon ? "pl-12" : "pl-4",
              "pr-10",
              error
                ? "border-red-500 focus:border-red-500"
                : props.disabled || isLoading
                  ? "border-gray-200"
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
          >
            <option value="" disabled>
              {isLoading ? "Đang tải..." : (placeholder || `Chọn ${label || 'một giá trị'}`)}
            </option>
            {!isLoading && options.map((opt, index) => (
              <option key={`${opt.value}-${index}`} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Dropdown icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-300 group-focus-within:rotate-180" />
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            id={`${selectId}-error`}
            className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hint */}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-2 text-sm text-gray-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
export type { SelectProps, Option };
