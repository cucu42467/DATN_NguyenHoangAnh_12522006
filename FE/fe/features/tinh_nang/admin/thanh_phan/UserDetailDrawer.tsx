"use client";

import { useState, useEffect } from 'react';
import {
  X, User, Mail, Phone, Shield, ShieldCheck, ShieldOff,
  Lock, Globe, DollarSign, Bell, CheckCircle2, XCircle,
  Monitor, Smartphone, Globe as GlobeIcon, Calendar, Clock,
  Key, Settings, CreditCard, Receipt, TrendingUp, TrendingDown,
  RefreshCw, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import {
  layChiTietNguoiDungQt,
  layLichSuDangNhapNguoiDung,
  guiEmailResetMatKhauQt,
  type NguoiDungChiTietDto,
  type LichSuDangNhapNguoiDungDto,
  type VaiTroDto,
} from '@/services/qt/nguoidung';
import { layDanhSachVaiTro } from '@/services/qt/vaitro';

interface UserDetailDrawerProps {
  userId: number;
  open: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'financial' | 'login-history' | 'settings';

export default function UserDetailDrawer({ userId, open, onClose }: UserDetailDrawerProps) {
  const [user, setUser] = useState<NguoiDungChiTietDto | null>(null);
  const [loginHistory, setLoginHistory] = useState<LichSuDangNhapNguoiDungDto[]>([]);
  const [roles, setRoles] = useState<VaiTroDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetchUserDetails();
      fetchLoginHistory();
    }
  }, [open, userId]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const data = await layChiTietNguoiDungQt(userId);
      setUser(data);
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const data = await layLichSuDangNhapNguoiDung(userId, 1, 10);
      setLoginHistory(data.items || []);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đăng nhập:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await layDanhSachVaiTro();
      setRoles(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy vai trò:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!user) return;
    setResettingPassword(true);
    try {
      await guiEmailResetMatKhauQt(user.email);
      toast.success(`Đã gửi email đặt lại mật khẩu đến ${user.email}`);
    } catch (error) {
      toast.error('Không thể gửi email đặt lại mật khẩu');
    } finally {
      setResettingPassword(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getRoleBadgeVariant = (role: string) => {
    const lower = role.toLowerCase();
    if (lower === 'admin' || lower === 'quanly') return 'error';
    if (lower === 'user' || lower === 'nguoidung') return 'income';
    return 'default';
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-xl z-50 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        style={{ background: 'var(--modal-bg)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Chi tiết người dùng
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'info' 
                ? 'border-b-2 border-emerald-500 text-emerald-600' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            style={{ color: activeTab === 'info' ? undefined : 'var(--text-secondary)' }}
          >
            Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'financial' 
                ? 'border-b-2 border-emerald-500 text-emerald-600' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            style={{ color: activeTab === 'financial' ? undefined : 'var(--text-secondary)' }}
          >
            Tài chính
          </button>
          <button
            onClick={() => setActiveTab('login-history')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'login-history' 
                ? 'border-b-2 border-emerald-500 text-emerald-600' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            style={{ color: activeTab === 'login-history' ? undefined : 'var(--text-secondary)' }}
          >
            Lịch sử đăng nhập
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'settings' 
                ? 'border-b-2 border-emerald-500 text-emerald-600' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            style={{ color: activeTab === 'settings' ? undefined : 'var(--text-secondary)' }}
          >
            Cài đặt
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-120px)] overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" style={{ color: 'var(--text-muted)' }} />
            </div>
          ) : !user ? (
            <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
              Không tìm thấy thông tin người dùng
            </div>
          ) : (
            <>
              {/* Tab: Thông tin cơ bản */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={user.anhDaiDien ? `/Anh/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen)}&size=128&background=10b981&color=fff&bold=true`}
                      alt={user.hoTen}
                      className="h-24 w-24 rounded-full object-cover border-4 border-emerald-100"
                    />
                    <h3 className="text-xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>
                      {user.hoTen}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </p>

                    {/* Status & Role */}
                    <div className="flex items-center gap-2 mt-3">
                      {user.daXoa === 1 ? (
                        <StatusBadge status="INACTIVE" />
                      ) : user.trangThai === 0 ? (
                        <StatusBadge status="LOCKED" />
                      ) : (
                        <StatusBadge status="ACTIVE" />
                      )}
                      {user.vaiTro.map((role, index) => (
                        <Badge key={index} variant={getRoleBadgeVariant(role)}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div
                    className="rounded-xl p-5 space-y-4"
                    style={{ background: 'var(--surface-secondary)' }}
                  >
                    <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
                    <InfoRow 
                      icon={<Phone className="h-4 w-4" />} 
                      label="Số điện thoại" 
                      value={user.soDienThoai || 'Chưa cập nhật'} 
                    />
                    <InfoRow 
                      icon={<Calendar className="h-4 w-4" />} 
                      label="Ngày tạo" 
                      value={user.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      }) : 'Không rõ'} 
                    />
                    <InfoRow 
                      icon={<Clock className="h-4 w-4" />} 
                      label="Đăng nhập cuối" 
                      value={user.lanDangNhapCuoi ? new Date(user.lanDangNhapCuoi).toLocaleDateString('vi-VN', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      }) : 'Chưa đăng nhập'} 
                    />
                    
                    {/* Email verification */}
                    <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Xác thực Email</span>
                      </div>
                      {user.emailDaXacThuc === 1 ? (
                        <Badge variant="success">Đã xác thực</Badge>
                      ) : (
                        <Badge variant="pending">Chưa xác thực</Badge>
                      )}
                    </div>

                    {/* Phone verification */}
                    <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Xác thực SĐT</span>
                      </div>
                      {user.soDienThoaiDaXacThuc === 1 ? (
                        <Badge variant="success">Đã xác thực</Badge>
                      ) : (
                        <Badge variant="pending">Chưa xác thực</Badge>
                      )}
                    </div>
                  </div>

                  {/* Social Logins */}
                  {user.socialLogins && user.socialLogins.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <GlobeIcon className="h-4 w-4 text-emerald-500" />
                        Liên kết mạng xã hội
                      </h4>
                      <div className="space-y-2">
                        {user.socialLogins.map((social) => (
                          <div
                            key={social.id}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: 'var(--surface-secondary)' }}
                          >
                            <div className="flex items-center gap-3">
                              {social.provider === 'GOOGLE' ? (
                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                  </svg>
                                </div>
                              ) : (
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">F</span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {social.provider === 'GOOGLE' ? 'Google' : social.provider}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {social.emailSocial}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {new Date(social.ngayLienKet).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reset Password Button */}
                  {user.daXoa !== 1 && (
                    <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <Button
                        variant="outline"
                        onClick={handleResetPassword}
                        loading={resettingPassword}
                        leftIcon={<KeyRound className="h-4 w-4" />}
                        className="w-full"
                      >
                        Gửi email đặt lại mật khẩu
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Tài chính */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  {/* Financial Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: 'var(--surface-secondary)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tài khoản</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {user.taiKhoan?.length || 0}
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: 'var(--surface-secondary)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Receipt className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Giao dịch</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {user.giaoDich?.tongGiaoDich || 0}
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Thu tháng này</span>
                      </div>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(user.giaoDich?.tongThuThang || 0)}
                      </p>
                    </div>
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Chi tháng này</span>
                      </div>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(user.giaoDich?.tongChiThang || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Account List */}
                  {user.taiKhoan && user.taiKhoan.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Danh sách tài khoản
                      </h4>
                      <div className="space-y-3">
                        {user.taiKhoan.map((account) => (
                          <div
                            key={account.taiKhoanId}
                            className="flex items-center justify-between p-4 rounded-xl"
                            style={{ background: 'var(--surface-secondary)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="h-10 w-10 rounded-full flex items-center justify-center"
                                style={{ background: account.mauSac || '#10b981' }}
                              >
                                <CreditCard className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {account.tenTaiKhoan}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {account.loaiTaiKhoan}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {formatCurrency(account.soDu)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!user.taiKhoan || user.taiKhoan.length === 0) && (
                    <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Người dùng chưa có tài khoản nào</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Lịch sử đăng nhập */}
              {activeTab === 'login-history' && (
                <div className="space-y-4">
                  {loginHistory.length > 0 ? (
                    <div className="space-y-3">
                      {loginHistory.map((history) => (
                        <div
                          key={history.id}
                          className="flex items-start gap-4 p-4 rounded-xl"
                          style={{ background: 'var(--surface-secondary)' }}
                        >
                          <div className={`p-2 rounded-full ${history.ketQua ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {history.ketQua ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${history.ketQua ? 'text-emerald-600' : 'text-red-600'}`}>
                                {history.ketQua ? 'Đăng nhập thành công' : 'Đăng nhập thất bại'}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {new Date(history.thoiGian).toLocaleString('vi-VN')}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <div className="flex items-center gap-1">
                                {history.thietBi?.includes('Mobile') || history.thietBi?.includes('iPhone') || history.thietBi?.includes('Android') ? (
                                  <Smartphone className="h-3 w-3" />
                                ) : (
                                  <Monitor className="h-3 w-3" />
                                )}
                                <span className="truncate">{history.thietBi || 'Không rõ thiết bị'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GlobeIcon className="h-3 w-3" />
                                <span className="truncate">IP: {history.ipAddress || 'N/A'}</span>
                              </div>
                              {history.heDieuHanh && (
                                <div className="flex items-center gap-1">
                                  <Settings className="h-3 w-3" />
                                  <span className="truncate">{history.heDieuHanh}</span>
                                </div>
                              )}
                              {history.viTri && (
                                <div className="flex items-center gap-1">
                                  <GlobeIcon className="h-3 w-3" />
                                  <span className="truncate">{history.viTri}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có lịch sử đăng nhập</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Cài đặt */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {user.caiDat ? (
                    <>
                      <div
                        className="rounded-xl p-5 space-y-4"
                        style={{ background: 'var(--surface-secondary)' }}
                      >
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <Globe className="h-4 w-4 text-emerald-500" />
                          Ngôn ngữ & Định dạng
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Ngôn ngữ</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {user.caiDat.ngonNgu === 'vi' ? 'Tiếng Việt' : user.caiDat.ngonNgu === 'en' ? 'English' : 'Không rõ'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Định dạng ngày</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {user.caiDat.dinhDangNgay || 'dd/MM/yyyy'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Tiền tệ</p>
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {user.caiDat.tienTe || 'VND'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className="rounded-xl p-5 space-y-4"
                        style={{ background: 'var(--surface-secondary)' }}
                      >
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <Bell className="h-4 w-4 text-emerald-500" />
                          Thông báo
                        </h4>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Nhận thông báo
                          </span>
                          {user.caiDat.nhanThongBao ? (
                            <Badge variant="success">Bật</Badge>
                          ) : (
                            <Badge variant="inactive">Tắt</Badge>
                          )}
                        </div>
                      </div>

                      <div
                        className="rounded-xl p-5 space-y-4"
                        style={{ background: 'var(--surface-secondary)' }}
                      >
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                          <Settings className="h-4 w-4 text-emerald-500" />
                          Giao diện
                        </h4>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Chế độ tối
                          </span>
                          {user.caiDat.cheDoToi ? (
                            <Badge variant="default">Bật</Badge>
                          ) : (
                            <Badge variant="inactive">Tắt</Badge>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
                      <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Người dùng chưa có cài đặt</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ============ INFO ROW COMPONENT ============
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
