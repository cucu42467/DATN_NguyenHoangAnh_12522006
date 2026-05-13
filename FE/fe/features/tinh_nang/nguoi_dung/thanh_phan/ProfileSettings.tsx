"use client";

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, ShieldCheck, ShieldOff, Lock, Globe, DollarSign, Bell, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { layThongTinCaNhan, capNhatThongTinCaNhan, doiMatKhau, capNhatCaiDatBaoMat } from '@/services/nguoidung';
import { layLichSuDangNhapTheoNguoiDung } from '@/services/lich_su_dang_nhap';
import { guiOtpEmail, xacThucOtp } from '@/services/xacthuc/xacthuc';
import { toast } from 'sonner';
import type { NguoiDungDto, LichSuDangNhapDto } from '@/types';

export default function ProfileSettings() {
  const [user, setUser] = useState<NguoiDungDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [loginHistory, setLoginHistory] = useState<LichSuDangNhapDto[]>([]);
  const [allLoginHistory, setAllLoginHistory] = useState<any[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const PAGE_SIZE = 5;

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');

  // Form states
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  
  // Password states
  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [showMatKhauCu, setShowMatKhauCu] = useState(false);
  const [showMatKhauMoi, setShowMatKhauMoi] = useState(false);
  const [showXacNhanMatKhau, setShowXacNhanMatKhau] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await layThongTinCaNhan();
      if (res.success) {
        setUser(res.data);
        setHoTen(res.data.hoTen);
        setSoDienThoai(res.data.soDienThoai || '');
      }

      try {
        const nguoiDungId = res.data?.nguoiDungId;
        if (nguoiDungId) {
          const historyRes = await layLichSuDangNhapTheoNguoiDung(nguoiDungId);
          if (Array.isArray(historyRes) && historyRes.length > 0) {
            setAllLoginHistory(historyRes);
            const mapped: LichSuDangNhapDto[] = historyRes.slice(0, PAGE_SIZE).map((item) => ({
              lichSuId: item.id,
              thoiGian: item.thoiGian,
              diaChiIp: item.ipAddress || 'N/A',
              thietBi: item.thietBi || 'Không rõ thiết bị',
              trangThai: item.thanhCong ? 1 : 0,
            }));
            setLoginHistory(mapped);
            setHasMoreHistory(historyRes.length > PAGE_SIZE);
            setHistoryPage(1);
          }
        }
      } catch (e) {
        console.error("Could not fetch login history", e);
      }
    } catch (err) {
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreHistory = () => {
    const nextPage = historyPage + 1;
    const mapped: LichSuDangNhapDto[] = allLoginHistory.slice(0, nextPage * PAGE_SIZE).map((item: any) => ({
      lichSuId: item.id,
      thoiGian: item.thoiGian,
      diaChiIp: item.ipAddress || 'N/A',
      thietBi: item.thietBi || 'Không rõ thiết bị',
      trangThai: item.thanhCong ? 1 : 0,
    }));
    setLoginHistory(mapped);
    setHistoryPage(nextPage);
    setHasMoreHistory(allLoginHistory.length > nextPage * PAGE_SIZE);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await capNhatThongTinCaNhan({ hoTen, soDienThoai });
      if (res.success) {
        toast.success('Cập nhật thông tin thành công');
        fetchProfile();
      } else {
        toast.error(res.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (matKhauMoi !== xacNhanMatKhau) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setSubmitting(true);
    try {
      const res = await doiMatKhau({ matKhauCu, matKhauMoi });
      if (res.success) {
        toast.success('Đổi mật khẩu thành công');
        setMatKhauCu('');
        setMatKhauMoi('');
        setXacNhanMatKhau('');
      } else {
        toast.error(res.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const toggle2FA = async () => {
    if (!user) return;
    try {
      if (!user.dang2FA) {
        // Tắt -> Bật: Yêu cầu OTP
        setSubmitting(true);
        const res = await guiOtpEmail(user.email);
        if (res.thanhCong || res.thongDiep?.includes("Gửi") || res.otpId) {
          toast.success(`Đã gửi mã OTP đến email ${user.email}`);
          setShowOtpModal(true);
        } else {
          toast.error(res.thongDiep || 'Gửi OTP thất bại');
        }
      } else {
        // Đang Bật -> Tắt
        const res = await capNhatCaiDatBaoMat({ dang2FA: false });
        if (res.success) {
          toast.success('Đã tắt xác thực 2 lớp (2FA)');
          fetchProfile();
        }
      }
    } catch (err) {
      toast.error('Lỗi thao tác 2FA');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !otp) return;
    setSubmitting(true);
    try {
      const res = await xacThucOtp({ email: user.email, otp });
      if (res.thanhCong || res.thongDiep?.includes("Thành công")) {
        const resUpdate = await capNhatCaiDatBaoMat({ dang2FA: true });
        if (resUpdate.success) {
          toast.success('Bật xác thực 2 lớp thành công!');
          setShowOtpModal(false);
          setOtp('');
          fetchProfile();
        }
      } else {
        toast.error(res.thongDiep || 'Mã OTP không hợp lệ');
      }
    } catch (err) {
      toast.error('Lỗi xác thực OTP');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cột trái: Thông tin tổng quan */}
      <div className="lg:col-span-1 space-y-6">
        <div className="fe-card-fe p-6 text-center space-y-4">
          <div className="relative mx-auto h-24 w-24">
            <img
              src={user?.anhDaiDien ? `/Anh/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || 'User')}&size=256&background=10b981&color=fff&bold=true`}
              alt="Avatar"
              className="h-full w-full rounded-2xl object-cover border-2 border-emerald-500/20"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.hoTen}</h2>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
          <div className="flex justify-center gap-2">
            {user?.emailDaXacThuc ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Đã xác thực
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                <XCircle className="h-3 w-3" /> Chưa xác thực
              </span>
            )}
          </div>
        </div>

        <div className="fe-card-fe p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Bảo mật & Tùy chọn
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <div className="text-sm font-medium">Xác thực 2 lớp (2FA)</div>
              </div>
              <button 
                onClick={toggle2FA}
                disabled={submitting}
                className={`w-14 h-7 rounded-full transition-all relative border-2 ${
                  user?.dang2FA === 1 
                    ? 'bg-blue-500 border-blue-600' 
                    : 'bg-zinc-200 dark:bg-zinc-700 border-zinc-400 dark:border-zinc-500'
                }`}
              >
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                    user?.dang2FA === 1 ? 'left-[36px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-sm font-medium">Trạng thái xác thực Email</div>
              <div className={`px-2 py-1 text-xs rounded-full ${user?.emailDaXacThuc === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user?.emailDaXacThuc === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-sm font-medium">Trạng thái xác thực SĐT</div>
              <div className={`px-2 py-1 text-xs rounded-full ${user?.soDienThoaiDaXacThuc === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user?.soDienThoaiDaXacThuc === 1 ? 'Đã xác thực' : 'Chưa xác thực'}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-sm font-medium">Trạng thái tài khoản</div>
              <div className={`px-2 py-1 text-xs rounded-full ${user?.trangThai === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {user?.trangThai === 1 ? 'Hoạt động' : 'Bị khóa'}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-500">Ngày tạo</div>
              <div className="text-sm font-medium">
                {user?.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN') : 'Không rõ'}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-500 mb-2">Lịch sử đăng nhập gần đây</div>
              {loginHistory.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {loginHistory.map((lh, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-700 dark:text-zinc-300">{new Date(lh.thoiGian).toLocaleString('vi-VN')}</p>
                        <p className="text-zinc-500 truncate">{lh.thietBi || 'Không rõ thiết bị'}</p>
                        <p className="text-zinc-400">IP: {lh.diaChiIp || 'N/A'}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-md ml-2 ${lh.trangThai === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {lh.trangThai === 1 ? 'Thành công' : 'Thất bại'}
                      </div>
                    </div>
                  ))}
                  {hasMoreHistory && (
                    <button
                      onClick={handleLoadMoreHistory}
                      className="w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-sm font-medium text-center py-2 text-zinc-500">
                  {user?.lanDangNhapCuoi ? `Đăng nhập lần cuối: ${new Date(user.lanDangNhapCuoi).toLocaleString('vi-VN')}` : 'Chưa có lịch sử đăng nhập'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Form chỉnh sửa */}
      <div className="lg:col-span-2 space-y-8">
        {/* Form thông tin cơ bản */}
        <div className="fe-card-fe p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-500" /> Cập nhật thông tin cá nhân
          </h3>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Họ và tên</label>
                <Input 
                  value={hoTen} 
                  onChange={(e: any) => setHoTen(e.target.value)} 
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Số điện thoại</label>
                <Input 
                  value={soDienThoai} 
                  onChange={(e: any) => setSoDienThoai(e.target.value)} 
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="success" loading={submitting}>
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>

        {/* Form đổi mật khẩu */}
        <div className="fe-card-fe p-8 border-amber-500/20">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" /> Đổi mật khẩu
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Mật khẩu hiện tại</label>
              <div className="flex items-center gap-2">
                <Input 
                  type={showMatKhauCu ? "text" : "password"}
                  value={matKhauCu} 
                  onChange={(e: any) => setMatKhauCu(e.target.value)} 
                  required
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowMatKhauCu(!showMatKhauCu)}
                  className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {showMatKhauCu ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Mật khẩu mới</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type={showMatKhauMoi ? "text" : "password"}
                    value={matKhauMoi} 
                    onChange={(e: any) => setMatKhauMoi(e.target.value)} 
                    required
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMatKhauMoi(!showMatKhauMoi)}
                    className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {showMatKhauMoi ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Xác nhận mật khẩu mới</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type={showXacNhanMatKhau ? "text" : "password"}
                    value={xacNhanMatKhau} 
                    onChange={(e: any) => setXacNhanMatKhau(e.target.value)} 
                    required
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowXacNhanMatKhau(!showXacNhanMatKhau)}
                    className="p-2.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    {showXacNhanMatKhau ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="warning" loading={submitting}>
                Cập nhật mật khẩu
              </Button>
            </div>
          </form>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl relative">
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="text-center space-y-4 mb-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Xác thực OTP</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Nhập mã xác nhận được gửi đến email <br/>
                <span className="font-semibold text-emerald-600">{user?.email}</span>
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input
                type="text"
                placeholder="Nhập mã OTP..."
                value={otp}
                onChange={(e: any) => setOtp(e.target.value)}
                required
                className="text-center text-2xl tracking-widest font-bold"
                maxLength={6}
              />
              <Button type="submit" disabled={submitting || !otp} className="w-full h-12 text-base">
                {submitting ? 'Đang xác thực...' : 'Xác nhận bật 2FA'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
