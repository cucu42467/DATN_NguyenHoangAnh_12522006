"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/chung/Form/Input';
import { cn } from '@/lib';
import { dangKy, type YeuCauDangKy } from '@/services/xacthuc';
import { z } from 'zod';

const registerSchema = z.object({
  hoTen: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  soDienThoai: z.string().min(10, 'Số điện thoại ít nhất 10 ký tự').optional(),
  matKhau: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  xacNhanMatKhau: z.string(),
}).refine((data) => data.matKhau === data.xacNhanMatKhau, {
  message: 'Mật khẩu không khớp',
  path: ['xacNhanMatKhau'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showMatKhau, setShowMatKhau] = useState(false);
  const [showXacNhanMatKhau, setShowXacNhanMatKhau] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { hoTen: '', email: '', soDienThoai: '', matKhau: '', xacNhanMatKhau: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    startTransition(async () => {
      try {
        await dangKy({ hoTen: data.hoTen, email: data.email, soDienThoai: data.soDienThoai, matKhau: data.matKhau, xacNhanMatKhau: data.xacNhanMatKhau } as YeuCauDangKy);
        router.push('/DangNhap?success=registered');
      } catch (err: any) {
        setError(err.message || 'Đăng ký thất bại');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-display font-medium tracking-tight text-revolut-dark">
          Tạo tài khoản mới
        </h1>
        <p className="text-sm text-revolut-muted mt-2">
          Bắt đầu quản lý tài chính cá nhân thông minh ngay hôm nay
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Họ và tên"
          icon={User}
          placeholder="Nguyễn Văn A"
          {...form.register('hoTen')}
          error={form.formState.errors.hoTen && form.formState.touchedFields.hoTen ? form.formState.errors.hoTen?.message : undefined}
        />
        <Input
          label="Email"
          icon={Mail}
          type="email"
          placeholder="your@email.com"
          {...form.register('email')}
          error={form.formState.errors.email && form.formState.touchedFields.email ? form.formState.errors.email?.message : undefined}
        />
        <Input
          label="Số điện thoại"
          icon={Phone}
          type="tel"
          pattern="[0-9]*"
          placeholder="0123456789"
          {...form.register('soDienThoai')}
          error={form.formState.errors.soDienThoai && form.formState.touchedFields.soDienThoai ? form.formState.errors.soDienThoai?.message : undefined}
        />
        <Input
          label="Mật khẩu"
          icon={Lock}
          type={showMatKhau ? 'text' : 'password'}
          placeholder="Nhập mật khẩu"
          rightIcon={showMatKhau ? EyeOff : Eye}
          rightIconClick={() => setShowMatKhau(!showMatKhau)}
          {...form.register('matKhau')}
          error={form.formState.errors.matKhau && form.formState.touchedFields.matKhau ? form.formState.errors.matKhau?.message : undefined}
        />
        <Input
          label="Xác nhận mật khẩu"
          icon={Lock}
          type={showXacNhanMatKhau ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          rightIcon={showXacNhanMatKhau ? EyeOff : Eye}
          rightIconClick={() => setShowXacNhanMatKhau(!showXacNhanMatKhau)}
          error={form.formState.errors.xacNhanMatKhau && form.formState.touchedFields.xacNhanMatKhau ? form.formState.errors.xacNhanMatKhau?.message : undefined}
          {...form.register('xacNhanMatKhau')}
        />
        <Button 
          type="submit" 
          variant="primary"
          className="w-full h-14 rounded-2xl text-base font-bold"
          disabled={isPending}
          loading={isPending}
        >
          Tạo tài khoản
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/DangNhap')}
        >
          Đã có tài khoản? Đăng nhập ngay
        </Button>
      </div>

      <div className="pt-8 text-xs text-revolut-muted text-center">
        Bằng cách tạo tài khoản, bạn đồng ý với{' '}
        <a href="/DieuKhoanDichVu" className="hover:text-revolut-blue underline">Điều khoản dịch vụ</a>
        {' '}và{' '}
        <a href="/ChinhSachBaoMat" className="hover:text-revolut-blue underline">Chính sách bảo mật</a>
        .
      </div>
    </div>
  );
}


