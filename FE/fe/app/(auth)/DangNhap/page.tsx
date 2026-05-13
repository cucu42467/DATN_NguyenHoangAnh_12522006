"use client";

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, AlertCircle, Shield, User, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/chung/Form/Input';
import { dangNhapBangMatKhau, dangNhapMangXaHoi, luuPhienDangNhap } from '@/services/xacthuc';
import { z } from 'zod';
import type { PhanHoiDangNhap } from '@/services/xacthuc';
import { loginGoogleIdToken } from '@/components/chung/GoogleAuth';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  matKhau: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  ghiNhoMatKhau: z.boolean(),
});

type LoginForm = z.infer<typeof loginSchema>;

// Component Loading toàn màn hình
function LoadingOverlay({ message, showSpinner = true }: { message: string; showSpinner?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 p-12 rounded-[3rem] bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800 max-w-sm mx-4">
        {/* Logo Animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Spinner */}
        {showSpinner && (
          <div className="relative">
            <Loader2 className="h-14 w-14 animate-spin text-indigo-600" />
          </div>
        )}
        
        {/* Message */}
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
            {message}
          </p>
          {showSpinner && (
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dialog chọn vai trò khi có nhiều hơn 1 vai trò
function RoleSelectionDialog({
  isOpen,
  vaiTro,
  onSelect,
  onCancel,
  onLoading,
}: {
  isOpen: boolean;
  vaiTro: string[];
  onSelect: (role: string) => void;
  onCancel: () => void;
  onLoading: (loading: boolean) => void;
}) {
  if (!isOpen) return null;

  const hasAdmin = vaiTro.includes('admin');
  const hasUser = vaiTro.includes('user');
  const soVaiTro = vaiTro.length;

  const handleSelect = (role: string) => {
    onLoading(true);
    setTimeout(() => {
      onSelect(role);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 w-full max-w-md mx-4 shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-in zoom-in-95 duration-300">
        {/* Header với Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
            Bạn có {soVaiTro} vai trò
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Hãy chọn một vai trò để tiếp tục
          </p>
        </div>

        {/* Các lựa chọn vai trò */}
        <div className="space-y-4">
          {hasAdmin && (
            <button
              onClick={() => handleSelect('admin')}
              className="w-full flex items-center gap-5 p-6 rounded-[2rem] border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-purple-900 dark:text-purple-100">Quản trị viên</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Quản lý hệ thống, người dùng và báo cáo</p>
              </div>
              <div className="text-purple-400 group-hover:text-purple-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}

          {hasUser && (
            <button
              onClick={() => handleSelect('user')}
              className="w-full flex items-center gap-5 p-6 rounded-[2rem] border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-blue-900 dark:text-blue-100">Người dùng</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Quản lý tài chính cá nhân</p>
              </div>
              <div className="text-blue-400 group-hover:text-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Nút hủy */}
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full mt-8 h-12 rounded-2xl text-sm font-medium"
        >
          Hủy bỏ
        </Button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showMatKhau, setShowMatKhau] = useState(false);
  const [googleError, setGoogleError] = useState('');
  
  // State loading chung - duy trì cho đến khi chuyển trang hoàn tất
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Đang đăng nhập...');

  // State cho dialog chọn vai trò
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState<{
    phanHoi: PhanHoiDangNhap;
    ghiNhoMatKhau: boolean;
    email: string;
    matKhau: string;
  } | null>(null);

  // Kiểm tra nếu phiên đã hết hạn
  const sessionExpired = searchParams.get('session') === 'expired';

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', matKhau: '', ghiNhoMatKhau: false },
  });

  // Prefill from localStorage if remember me was checked
  useEffect(() => {
    try {
      const saved = localStorage.getItem('loginRemember');
      if (saved) {
        const data = JSON.parse(saved);
        form.reset(data);
      }
    } catch {
      // Ignore errors
    }
  }, [form]);

  // Xử lý khi người dùng chọn vai trò từ dialog
  const handleRoleSelect = (role: string) => {
    setShowRoleDialog(false);
    setLoadingMessage('Đang chuyển hướng...');
    
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/TrangChu');
    }
    
    // Tắt loading sau khi chuyển trang
    setTimeout(() => {
      setIsLoading(false);
      router.refresh();
    }, 500);
  };

  const handleRoleCancel = () => {
    setShowRoleDialog(false);
    setPendingLoginData(null);
    setIsLoading(false);
  };

  const handleRoleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setIsLoading(true);
    setLoadingMessage('Đang đăng nhập...');
    
    startTransition(() => {
      dangNhapBangMatKhau(data.email, data.matKhau, true)
        .then((res) => {
          luuPhienDangNhap(res);

          // Save credentials if remember me checked
          if (data.ghiNhoMatKhau) {
            localStorage.setItem('loginRemember', JSON.stringify({
              email: data.email,
              matKhau: data.matKhau,
              ghiNhoMatKhau: true
            }));
          } else {
            localStorage.removeItem('loginRemember');
          }

          // Kiểm tra vai trò
          const vaiTro = res.nguoiDung.vaiTro;
          const hasAdmin = vaiTro.includes('admin');
          const hasUser = vaiTro.includes('user');

          // Nếu có 2 vai trò -> hiển thị dialog (giữ loading)
          if (hasAdmin && hasUser) {
            setLoadingMessage('Xác thực thành công!');
            setPendingLoginData({ phanHoi: res, ghiNhoMatKhau: data.ghiNhoMatKhau, email: data.email, matKhau: data.matKhau });
            setTimeout(() => {
              setShowRoleDialog(true);
              setIsLoading(true); // Vẫn giữ loading overlay
            }, 800);
          } 
          // Nếu chỉ có 1 vai trò -> chuyển trang luôn
          else if (hasAdmin && !hasUser) {
            setLoadingMessage('Đang chuyển đến trang quản trị...');
            setTimeout(() => {
              router.push('/admin');
              setTimeout(() => {
                setIsLoading(false);
                router.refresh();
              }, 500);
            }, 500);
          } else {
            setLoadingMessage('Đang chuyển đến trang chủ...');
            setTimeout(() => {
              router.push('/TrangChu');
              setTimeout(() => {
                setIsLoading(false);
                router.refresh();
              }, 500);
            }, 500);
          }
        })
        .catch((err: any) => {
          setError(err.message || 'Đăng nhập thất bại');
          setIsLoading(false);
        });
    });
  };

  const handleGoogleSuccess = useCallback(async (response: any) => {
    console.log('Google success', response);

    const token = response.credential || response.access_token;
    if (!token) {
      setGoogleError('Không nhận được thông tin từ Google');
      setIsLoading(false);
      return;
    }

    setGoogleError('');
    setIsLoading(true);
    setLoadingMessage('Đang đăng nhập Google...');

    try {
      const res = await dangNhapMangXaHoi('GOOGLE', token);
      luuPhienDangNhap(res);

      const vaiTro = res.nguoiDung.vaiTro;
      const hasAdmin = vaiTro.includes('admin');
      const hasUser = vaiTro.includes('user');

      if (hasAdmin && hasUser) {
        setLoadingMessage('Xác thực thành công!');
        setPendingLoginData({ phanHoi: res, ghiNhoMatKhau: false, email: '', matKhau: '' });
        setTimeout(() => {
          setShowRoleDialog(true);
        }, 800);
      } else if (hasAdmin && !hasUser) {
        setLoadingMessage('Đang chuyển đến trang quản trị...');
        setTimeout(() => {
          router.push('/admin');
          setTimeout(() => {
            setIsLoading(false);
            router.refresh();
          }, 500);
        }, 500);
      } else {
        setLoadingMessage('Đang chuyển đến trang chủ...');
        setTimeout(() => {
          router.push('/TrangChu');
          setTimeout(() => {
            setIsLoading(false);
            router.refresh();
          }, 500);
        }, 500);
      }
    } catch (err: any) {
      console.error('Google login failed:', err);
      setGoogleError(err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.');
      setIsLoading(false);
    }
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Loading overlay - duy trì cho đến khi chuyển trang hoặc mở dialog */}
      {isLoading && !showRoleDialog && (
        <LoadingOverlay message={loadingMessage} />
      )}

      {/* Dialog chọn vai trò - hiển thị TRÊN loading overlay */}
      <RoleSelectionDialog
        isOpen={showRoleDialog}
        vaiTro={pendingLoginData?.phanHoi.nguoiDung.vaiTro || []}
        onSelect={handleRoleSelect}
        onCancel={handleRoleCancel}
        onLoading={handleRoleLoading}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Vui lòng đăng nhập để tiếp tục quản lý tài chính
        </p>
      </div>

      {sessionExpired && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 p-4 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="font-medium">Phiên đăng nhập đã hết hạn</p>
            <p className="text-amber-700 dark:text-amber-300 mt-1">Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ.</p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {googleError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {googleError}
          </div>
        )}
        
        <div id="google-signin-button">
            <Button 
            variant="secondary" 
            className="w-full border-2 py-7 rounded-2xl h-auto"
            onClick={() =>
              loginGoogleIdToken(
                (idToken) => {
                  handleGoogleSuccess({ credential: idToken }); // ✔ FIX
                },
                (error) => {
                  setGoogleError(error);
                }
              )
            }
            disabled={isLoading}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.83l2.66-2.07z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Hoặc
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        <Input
          label="Email"
          icon={Mail}
          placeholder="your@email.com"
          type="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        <Input
          label="Mật khẩu"
          icon={Lock}
          type={showMatKhau ? "text" : "password"}
          placeholder="********"
          rightIcon={showMatKhau ? EyeOff : Eye}
          rightIconClick={() => setShowMatKhau(!showMatKhau)}
          {...form.register('matKhau')}
          error={form.formState.errors.matKhau?.message}
        />

        {/* Small remember password checkbox */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <input
              id="ghiNhoMatKhau"
              type="checkbox"
              className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
              {...form.register('ghiNhoMatKhau')}
            />
            <label 
              htmlFor="ghiNhoMatKhau"
              className="text-xs text-muted-foreground font-medium cursor-pointer select-none"
            >
              Ghi nhớ mật khẩu
            </label>
          </div>
          <button
            type="button"
            onClick={() => router.push('/QuenMatKhau')}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
          >
            Quên mật khẩu?
          </button>
        </div>
        <Button 
          type="submit" 
          variant="primary"
          className="w-full h-14 rounded-2xl text-base font-bold"
          disabled={isLoading}
          loading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/DangKy')}
        >
          Chưa có tài khoản? Tạo mới
        </Button>
      </div>

      <div className="pt-8 text-xs text-muted-foreground text-center">
        Bằng cách tiếp tục, bạn đồng ý với{' '}
        <a href="/DieuKhoanDichVu" className="hover:text-foreground underline">Điều khoản dịch vụ</a>
        {' '}và{' '}
        <a href="/ChinhSachBaoMat" className="hover:text-foreground underline">Chính sách bảo mật</a>
        .
      </div>
    </div>
  );
}
