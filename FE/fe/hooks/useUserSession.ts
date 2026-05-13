import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { NguoiDungTomTat } from '@/thu_vien/kieu_giao_tiep';
import {
  layNguoiDungLuu,
  layRefreshToken,
  xoaPhienDangNhap,
  daDangNhap
} from '@/thu_vien/luu_tru_phien';
import { dangXuat } from '@/services/xacthuc';

export function useUserSession() {
  const [user, setUser] = useState<NguoiDungTomTat | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const storedUser = layNguoiDungLuu();
    setUser(storedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = layRefreshToken();
      if (refreshToken) {
        await dangXuat(refreshToken);
      }
    } catch (error) {
      console.warn('Logout API failed, clearing local storage:', error);
    } finally {
      xoaPhienDangNhap();
      setUser(null);
      router.push('/DangNhap');
      router.refresh();
    }
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: daDangNhap(),
    refreshUser,
    logout,
  };
}
