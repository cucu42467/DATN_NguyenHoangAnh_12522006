"use client";

import { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/chung/Form/Select';
import {
  layChiTietNguoiDungQt,
  taoNguoiDungQt,
  capNhatNguoiDungQt,
  guiEmailResetMatKhauQt,
  type VaiTroDto,
} from '@/services/qt/nguoidung';
import { layDanhSachVaiTro } from '@/services/qt/vaitro';

interface UserFormModalProps {
  open: boolean;
  userId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({ open, userId, onClose, onSuccess }: UserFormModalProps) {
  const isEditMode = !!userId;

  // Form state
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [vaiTroId, setVaiTroId] = useState<number>(0);
  const [trangThai, setTrangThai] = useState<number>(1);

  // UI state
  const [roles, setRoles] = useState<VaiTroDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Password visibility
  const [showMatKhau, setShowMatKhau] = useState(false);
  const [showXacNhanMatKhau, setShowXacNhanMatKhau] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch roles
  useEffect(() => {
    fetchRoles();
  }, []);

  // Fetch user data if editing
  useEffect(() => {
    if (open && userId) {
      fetchUserData();
    } else if (open && !userId) {
      resetForm();
    }
  }, [open, userId]);

  const fetchRoles = async () => {
    try {
      const data = await layDanhSachVaiTro();
      setRoles(data || []);
      if (data && data.length > 0 && !vaiTroId) {
        setVaiTroId(data[0].vaiTroId);
      }
    } catch (error) {
      console.error('Lỗi khi lấy vai trò:', error);
    }
  };

  const fetchUserData = async () => {
    setFetchingUser(true);
    try {
      const user = await layChiTietNguoiDungQt(userId!);
      if (user) {
        setHoTen(user.hoTen);
        setEmail(user.email);
        setSoDienThoai(user.soDienThoai || '');
        setTrangThai(user.trangThai);
        // Set role - need to match with roles list
        const roleMatch = roles.find(r => user.vaiTro.includes(r.tenVaiTro));
        if (roleMatch) {
          setVaiTroId(roleMatch.vaiTroId);
        }
      }
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setFetchingUser(false);
    }
  };

  const resetForm = () => {
    setHoTen('');
    setEmail('');
    setSoDienThoai('');
    setMatKhau('');
    setXacNhanMatKhau('');
    setTrangThai(1);
    setErrors({});
    if (roles.length > 0) {
      setVaiTroId(roles[0].vaiTroId);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hoTen.trim()) {
      newErrors.hoTen = 'Họ tên không được để trống';
    } else if (hoTen.trim().length < 2) {
      newErrors.hoTen = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!isEditMode) {
      if (!email.trim()) {
        newErrors.email = 'Email không được để trống';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Email không hợp lệ';
      }

      if (!matKhau) {
        newErrors.matKhau = 'Mật khẩu không được để trống';
      } else if (matKhau.length < 6) {
        newErrors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự';
      }

      if (matKhau !== xacNhanMatKhau) {
        newErrors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
      }
    }

    if (!vaiTroId) {
      newErrors.vaiTro = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditMode) {
        await capNhatNguoiDungQt(userId!, {
          hoTen: hoTen.trim(),
          soDienThoai: soDienThoai.trim() || undefined,
          vaiTroId: vaiTroId,
          trangThai: trangThai,
        });
        toast.success('Cập nhật người dùng thành công');
      } else {
        await taoNguoiDungQt({
          hoTen: hoTen.trim(),
          email: email.trim(),
          soDienThoai: soDienThoai.trim() || undefined,
          matKhau: matKhau,
          vaiTroId: vaiTroId,
          trangThai: trangThai,
        });
        toast.success('Thêm người dùng thành công');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || `Không thể ${isEditMode ? 'cập nhật' : 'thêm'} người dùng`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return;
    setResettingPassword(true);
    try {
      await guiEmailResetMatKhauQt(email);
      toast.success(`Đã gửi email đặt lại mật khẩu đến ${email}`);
    } catch (error) {
      toast.error('Không thể gửi email đặt lại mật khẩu');
    } finally {
      setResettingPassword(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Modal */}
        <div
          className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
          style={{ background: 'var(--modal-bg)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Họ tên */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <Input
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="pl-10"
                  disabled={fetchingUser}
                />
              </div>
              {errors.hoTen && (
                <p className="text-xs text-red-500 mt-1">{errors.hoTen}</p>
              )}
            </div>

            {/* Email - không cho sửa khi edit */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email"
                  className="pl-10"
                  disabled={isEditMode || fetchingUser}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
              {isEditMode && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Email không thể thay đổi để đảm bảo tính toàn vẹn dữ liệu
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                <Input
                  type="tel"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="pl-10"
                  disabled={fetchingUser}
                />
              </div>
              {errors.soDienThoai && (
                <p className="text-xs text-red-500 mt-1">{errors.soDienThoai}</p>
              )}
            </div>

            {/* Mật khẩu - chỉ hiển thị khi tạo mới */}
            {!isEditMode && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <Input
                      type={showMatKhau ? 'text' : 'password'}
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMatKhau(!showMatKhau)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showMatKhau ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.matKhau && (
                    <p className="text-xs text-red-500 mt-1">{errors.matKhau}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <Input
                      type={showXacNhanMatKhau ? 'text' : 'password'}
                      value={xacNhanMatKhau}
                      onChange={(e) => setXacNhanMatKhau(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowXacNhanMatKhau(!showXacNhanMatKhau)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showXacNhanMatKhau ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.xacNhanMatKhau && (
                    <p className="text-xs text-red-500 mt-1">{errors.xacNhanMatKhau}</p>
                  )}
                </div>
              </>
            )}

            {/* Reset Password Button - chỉ hiển thị khi edit */}
            {isEditMode && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetPassword}
                  loading={resettingPassword}
                  className="w-full"
                >
                  Gửi email đặt lại mật khẩu
                </Button>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Người dùng sẽ nhận được email để đặt lại mật khẩu mới
                </p>
              </div>
            )}

            {/* Vai trò */}
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={vaiTroId}
                  onChange={(e) => setVaiTroId(Number(e.target.value))}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border appearance-none"
                  style={{ 
                    background: 'var(--input-bg)',
                    borderColor: 'var(--input-border)',
                    color: 'var(--input-text)'
                  }}
                  disabled={fetchingUser}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map(role => (
                    <option key={role.vaiTroId} value={role.vaiTroId}>
                      {role.tenVaiTro}
                    </option>
                  ))}
                </select>
              </div>
              {errors.vaiTro && (
                <p className="text-xs text-red-500 mt-1">{errors.vaiTro}</p>
              )}
            </div>

            {/* Trạng thái - chỉ hiển thị khi edit */}
            {isEditMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Trạng thái tài khoản
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trangThai"
                      value={1}
                      checked={trangThai === 1}
                      onChange={() => setTrangThai(1)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      Hoạt động
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="trangThai"
                      value={0}
                      checked={trangThai === 0}
                      onChange={() => setTrangThai(0)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      Bị khóa
                    </span>
                  </label>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </Button>
            <Button
              variant={isEditMode ? 'warning' : 'success'}
              onClick={handleSubmit as any}
              loading={submitting}
            >
              {isEditMode ? 'Lưu thay đổi' : 'Thêm người dùng'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
