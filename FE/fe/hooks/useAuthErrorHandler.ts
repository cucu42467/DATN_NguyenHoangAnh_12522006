"use client";

import React from 'react';
import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/animation/Toast';
import { xoaPhienDangNhap } from '@/thu_vien/luu_tru_phien';

const AUTH_ERROR_EVENT = 'auth-error';

export function useAuthErrorHandler(enabled: boolean = true) {
  const { showToast } = useToast();
  const router = useRouter();

  const handleAuthError = useCallback(() => {
    // Clear session
    xoaPhienDangNhap();
    
    // Show notification
    showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'warning', 5000);
    
    // Redirect to login page with expired session message
    router.push('/DangNhap?session=expired');
    router.refresh();
  }, [showToast, router]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: Event) => {
      // Prevent duplicate handling
      event.stopPropagation();
      handleAuthError();
    };

    window.addEventListener(AUTH_ERROR_EVENT, handleEvent);

    return () => {
      window.removeEventListener(AUTH_ERROR_EVENT, handleEvent);
    };
  }, [enabled, handleAuthError]);
}

/**
 * Component wrapper for AuthErrorHandler
 * Place this in the root layout or user layout to handle auth errors globally
 */
export function AuthErrorHandler({ children }: { children?: React.ReactNode }) {
  useAuthErrorHandler();
  return React.createElement(React.Fragment, null, children);
}
