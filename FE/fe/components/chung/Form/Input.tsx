"use client";

import React, { forwardRef, useId } from "react";
import { LucideIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  rightIconClick?: () => void;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      rightIcon: RightIcon,
      rightIconClick,
      required,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {/* Label - luon nam tren input */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input wrapper */}
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

          {/* Right Icon Button */}
          {RightIcon && rightIconClick && (
            <button
              type="button"
              onClick={rightIconClick}
              className={cn(
                "absolute inset-y-0 right-0 flex items-center pr-4",
                "text-gray-400 hover:text-gray-600 transition-colors",
                "focus:outline-none"
              )}
              tabIndex={-1}
              aria-label="Toggle visibility"
            >
              <RightIcon className="h-5 w-5" />
            </button>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex h-12 w-full rounded-xl border bg-white px-4",
              "text-sm font-medium text-gray-900",
              "placeholder:text-gray-400",
              "transition-all duration-200",
              "focus:outline-none focus:ring-4",
              Icon ? "pl-12" : "pl-4",
              RightIcon ? "pr-12" : "pr-4",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10 hover:border-gray-300",
              className
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>

        {/* Error message - hien thi ngay duoi input */}
        {error && (
          <div
            id={`${inputId}-error`}
            className="mt-2 flex items-center gap-1.5 text-sm text-red-500"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hint - thong tin them */}
        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="mt-2 text-sm text-gray-500"
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
export type { InputProps };
