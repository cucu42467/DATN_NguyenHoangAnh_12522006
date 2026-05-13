"use client";

import React from 'react';
import { cn } from '@/lib';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("mb-8", className)}>
      {/* Section title */}
      {title && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      
      {/* Section content */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

interface FormGridProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn(
      "flex items-center justify-end gap-3",
      "pt-6 mt-6 border-t border-gray-200",
      className
    )}>
      {children}
    </div>
  );
}

// Required indicator
interface RequiredIndicatorProps {
  className?: string;
}

export function RequiredIndicator({ className }: RequiredIndicatorProps) {
  return (
    <span className={cn("ml-1 text-red-500", className)} aria-hidden="true">
      *
    </span>
  );
}

// Form hint text
interface FormHintProps {
  children: React.ReactNode;
  className?: string;
}

export function FormHint({ children, className }: FormHintProps) {
  return (
    <p className={cn("mt-1 text-sm text-gray-500", className)}>
      {children}
    </p>
  );
}

export default FormSection;
