"use client";

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/chung/Form/Input';
import { z } from 'zod';
import { guiOtpEmail, xacThucOtp, datLaiMatKhau } from '@/services/xacthuc';

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const otpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().length(6, 'Mã OTP phải 6 ký tự').regex(/^\d+$/, 'Mã OTP phải là số'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  resetToken: z.string().min(1, 'Token không hợp lệ'),
  matKhauMoi: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  xacNhanMatKhauMoi: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
}).refine((data) => data.matKhauMoi === data.xacNhanMatKhauMoi, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["xacNhanMatKhauMoi"],
});

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

// Step types
type Step = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>('EMAIL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showMatKhauMoi, setShowMatKhauMoi] = useState(false);
  const [showXacNhanMatKhauMoi, setShowXacNhanMatKhauMoi] = useState(false);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: '', otp: '' },
  });

  const passwordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '', resetToken: '', matKhauMoi: '', xacNhanMatKhauMoi: '' },
  });

  // Countdown timer for resend OTP
  const startCountdown = useCallback(() => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Step 1: Send OTP email
  const handleSendOtp = async (data: EmailForm) => {
    setError('');
    setSuccess('');
    setEmail(data.email);

    startTransition(async () => {
      try {
        const res = await guiOtpEmail(data.email);
        if (res.thanhCong) {
          setSuccess(res.thongDiep || 'Mã xác thực đã được gửi đến email của bạn');
          setOtpSent(true);
          setStep('OTP');
          otpForm.setValue('email', data.email);
          startCountdown();
        } else {
          setError(res.thongDiep || 'Gửi thất bại');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (data: OtpForm) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const res = await xacThucOtp({ email: data.email, otp: data.otp });
        if (res.thanhCong) {
          setSuccess(res.thongDiep || 'Xác thực thành công');
          setResetToken(res.resetToken || '');
          setStep('PASSWORD');
          passwordForm.setValue('email', data.email);
          passwordForm.setValue('resetToken', res.resetToken || '');
        } else {
          setError(res.thongDiep || 'Mã xác thực không đúng');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  };

  // Step 3: Reset password
  const handleResetPassword = async (data: ResetPasswordForm) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const res = await datLaiMatKhau({
          email: data.email,
          resetToken: data.resetToken,
          matKhauMoi: data.matKhauMoi,
          xacNhanMatKhauMoi: data.xacNhanMatKhauMoi,
        });
        if (res.thanhCong) {
          setStep('SUCCESS');
        } else {
          setError(res.thongDiep || 'Đặt lại mật khẩu thất bại');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setError('');
    startTransition(async () => {
      try {
        const res = await guiOtpEmail(email);
        if (res.thanhCong) {
          setSuccess('Đã gửi lại mã xác thực');
          startCountdown();
        } else {
          setError(res.thongDiep || 'Gửi lại thất bại');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra');
      }
    });
  };

  // Go back one step
  const handleGoBack = () => {
    setError('');
    setSuccess('');
    if (step === 'OTP') {
      setStep('EMAIL');
      setOtpSent(false);
    } else if (step === 'PASSWORD') {
      setStep('OTP');
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white italic animate-pulse">
              Đang xử lý...
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Enter Email */}
      {step === 'EMAIL' && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Quên mật khẩu
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Nhập email đã đăng ký để nhận mã xác thực
            </p>
          </div>

          <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
            <Input
              label="Email"
              icon={Mail}
              type="email"
              placeholder="your@email.com"
              {...emailForm.register('email')}
              error={emailForm.formState.errors.email?.message}
            />

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-bold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi mã xác thực'
              )}
            </Button>
          </form>
        </>
      )}

      {/* Step 2: Enter OTP */}
      {step === 'OTP' && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Nhập mã xác thực
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Mã xác thực đã được gửi đến<br />
              <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>

          <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
            <input type="hidden" {...otpForm.register('email')} />

            <div className="space-y-2">
              <Input
                label="Mã xác thực (6 số)"
                icon={Lock}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="______"
                className="text-center text-2xl tracking-[0.5em] font-bold"
                {...otpForm.register('otp')}
                error={otpForm.formState.errors.otp?.message}
              />
              <p className="text-xs text-muted-foreground text-center">
                Mã có hiệu lực trong 5 phút
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-bold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                'Xác thực'
              )}
            </Button>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || isPending}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500 disabled:text-muted-foreground transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${countdown > 0 ? 'animate-spin' : ''}`} />
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
              </button>
            </div>
          </form>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Nhập lại email khác
          </button>
        </>
      )}

      {/* Step 3: Set new password */}
      {step === 'PASSWORD' && (
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Đặt lại mật khẩu
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Nhập mật khẩu mới cho tài khoản<br />
              <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>

          <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <input type="hidden" {...passwordForm.register('email')} />
            <input type="hidden" {...passwordForm.register('resetToken')} />

            <Input
              label="Mật khẩu mới"
              icon={Lock}
              type={showMatKhauMoi ? "text" : "password"}
              placeholder="Ít nhất 6 ký tự"
              rightIcon={showMatKhauMoi ? EyeOff : Eye}
              rightIconClick={() => setShowMatKhauMoi(!showMatKhauMoi)}
              {...passwordForm.register('matKhauMoi')}
              error={passwordForm.formState.errors.matKhauMoi?.message}
            />

            <Input
              label="Xác nhận mật khẩu mới"
              icon={Lock}
              type={showXacNhanMatKhauMoi ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              rightIcon={showXacNhanMatKhauMoi ? EyeOff : Eye}
              rightIconClick={() => setShowXacNhanMatKhauMoi(!showXacNhanMatKhauMoi)}
              {...passwordForm.register('xacNhanMatKhauMoi')}
              error={passwordForm.formState.errors.xacNhanMatKhauMoi?.message}
            />

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base font-bold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đặt lại...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Nhập lại mã xác thực
          </button>
        </>
      )}

      {/* Step 4: Success */}
      {step === 'SUCCESS' && (
        <>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Đặt lại mật khẩu thành công!
            </h1>
            <p className="text-sm text-muted-foreground">
              Mật khẩu của bạn đã được thay đổi.<br />
              Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>

          <Button 
            onClick={() => router.push('/DangNhap')}
            className="w-full h-14 rounded-2xl text-base font-bold"
          >
            Đăng nhập ngay
          </Button>
        </>
      )}

      {/* Back to login link */}
      {step !== 'SUCCESS' && (
        <div className="text-center text-sm text-muted-foreground">
          Nhớ mật khẩu?{' '}
          <button 
            onClick={() => router.push('/DangNhap')}
            className="font-bold hover:text-foreground underline-offset-4"
          >
            Đăng nhập
          </button>
        </div>
      )}
    </div>
  );
}
