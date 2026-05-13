"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
   Shield,
   User,
   History,
   Key,
   Smartphone,
   Globe,
   CheckCircle2,
   AlertCircle,
   Hash,
   ArrowLeft,
   Mail,
   Calendar,
   Lock,
   ChevronRight,
   Wallet,
   ArrowUpRight,
   Activity,
   FileText,
   Clock,
   Eye,
   Unlock,
   X,
   RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import XacNhanHanhDong from '../Chung/XacNhanHanhDong';
import { layChiTietNguoiDungQt, toggleTrangThaiNguoiDungQt, capNhatVaiTroNguoiDungQt, layPhienTheoNguoiDung } from '@/services/qt';
import { layDanhSachGiaoDichQt, type GiaoDichData } from '@/services/qt/giaodich';
import { layDanhSachTaiKhoan } from '@/services/taikhoan/taikhoan';
import { Skeleton } from '@/thanh_phan/animation';

interface LoginHistory {
   date: string;
   ip: string;
   device: string;
   status: 'Thành công' | 'Thất bại';
}

interface AuditLog {
   action: string;
   admin: string;
   time: string;
   details: string;
}

interface ThongKeNguoiDungDto {
   soVi: number;
   tongGiaoDich: number;
   tongThu: number;
   tongChi: number;
}

export default function ChiTietNguoiDung({ userId }: { userId: string }) {
   const [loading, setLoading] = useState(true);
   const [userData, setUserData] = useState<any>(null);
   const [sessions, setSessions] = useState<any[]>([]);
   const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
   const [thongKe, setThongKe] = useState<ThongKeNguoiDungDto>({ soVi: 0, tongGiaoDich: 0, tongThu: 0, tongChi: 0 });

   // UI State
   const [role, setRole] = useState<'Admin' | 'User'>('User');
   const [status, setStatus] = useState<'Active' | 'Locked'>('Active');

   // Modal State
   const [modalType, setModalType] = useState<'reset' | 'lock' | 'role' | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   const fetchData = useCallback(async () => {
      try {
         setLoading(true);
         const id = parseInt(userId);

         // Gọi API lấy chi tiết user
         const userResponse = await layChiTietNguoiDungQt(id);
         setUserData(userResponse);

         // Cập nhật UI state từ data
         setRole(userResponse?.vaiTro?.includes('ADMIN') ? 'Admin' : 'User');
         setStatus(userResponse?.trangThai === 1 ? 'Active' : 'Locked');

         // Gọi API lấy thống kê người dùng (từ API có sẵn)
         try {
            // Lấy danh sách giao dịch của user để tính stats
            const giaoDichData = await layDanhSachGiaoDichQt({ userId: id, pageSize: 1000 });
            const giaoDichs: GiaoDichData[] = giaoDichData.items || [];

            // Đếm giao dịch và tính tổng thu/chi
            let tongThu = 0;
            let tongChi = 0;
            giaoDichs.forEach((gd) => {
               if (gd.loaiGiaoDich === 1) { // THU
                  tongThu += gd.soTien;
               } else if (gd.loaiGiaoDich === 0) { // CHI
                  tongChi += gd.soTien;
               }
            });

            setThongKe({
               soVi: 0, // Sẽ cập nhật sau khi có API đếm ví
               tongGiaoDich: giaoDichData.totalCount || 0,
               tongThu,
               tongChi,
            });
         } catch {
            setThongKe({ soVi: 0, tongGiaoDich: 0, tongThu: 0, tongChi: 0 });
         }

         // Gọi API lấy phiên đăng nhập của user này
         try {
            const sessionsData = await layPhienTheoNguoiDung(id);
            setSessions(Array.isArray(sessionsData) ? sessionsData.slice(0, 10) : []);
         } catch {
            setSessions([]);
         }

         // Mock audit logs (vì chưa có API)
         setAuditLogs([
            { action: 'Khởi tạo tài khoản', admin: 'Hệ thống', time: userResponse?.ngayTao ? new Date(userResponse.ngayTao).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'), details: 'Đăng ký tài khoản mới' }
         ]);

      } catch (error) {
         console.error('Lỗi tải dữ liệu:', error);
      } finally {
         setLoading(false);
      }
   }, [userId]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const confirmAction = async () => {
      setIsProcessing(true);
      const id = parseInt(userId);

      try {
         if (modalType === 'reset') {
            // Reset password - chưa có API cụ thể, chỉ mock UI
            setAuditLogs(prev => [
               { action: 'Reset Mật khẩu', admin: 'Admin', time: new Date().toLocaleString('vi-VN'), details: 'Cấp mật khẩu tạm thời' },
               ...prev
            ]);
         } else if (modalType === 'lock') {
            const newStatus = status === 'Active';
            await toggleTrangThaiNguoiDungQt(id, newStatus);
            setStatus(newStatus ? 'Active' : 'Locked');
            setAuditLogs(prev => [
               { action: newStatus ? 'Mở khóa tài khoản' : 'Khóa tài khoản', admin: 'Admin', time: new Date().toLocaleString('vi-VN'), details: newStatus ? 'Khôi phục quyền truy cập' : 'Vi phạm chính sách' },
               ...prev
            ]);
         } else if (modalType === 'role') {
            const newRole = role === 'Admin' ? 'User' : 'Admin';
            await capNhatVaiTroNguoiDungQt(id, newRole);
            setRole(newRole);
            setAuditLogs(prev => [
               { action: `Đổi vai trò thành ${newRole}`, admin: 'Admin', time: new Date().toLocaleString('vi-VN'), details: `Vai trò thay đổi từ ${role} sang ${newRole}` },
               ...prev
            ]);
         }
      } catch (error) {
         console.error('Lỗi thực hiện action:', error);
      } finally {
         setIsProcessing(false);
         setModalType(null);
      }
   };

   const claims = [
      { title: 'Truy cập Dashboard Admin', active: role === 'Admin' },
      { title: 'Quản lý người dùng toàn cục', active: role === 'Admin' },
      { title: 'Tạo ví cá nhân (Tối đa 10)', active: true },
      { title: 'Đồng bộ AI Insights', active: true },
      { title: 'Xuất báo cáo tài chính PDF', active: true },
   ];

   if (loading) {
      return (
         <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex items-center gap-4">
               <div className="h-12 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                     <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                        <div className="space-y-2">
                           <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                           <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               <div className="bg-white p-10 rounded-[3.5rem] border shadow-sm">
                  <div className="h-40 w-40 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                  <div className="h-8 w-40 bg-gray-200 rounded mx-auto mt-6 animate-pulse"></div>
               </div>
               <div className="xl:col-span-2 space-y-6">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] border shadow-sm">
                        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-12 animate-in fade-in duration-1000">
         {/* Top Navigation & Fast Actions */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Link
               href="/admin/NguoiDung"
               className="flex items-center gap-4 text-zinc-400 hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] transition-all group"
            >
               <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 group-hover:-translate-x-2 transition-transform">
                  <ArrowLeft className="h-5 w-5" />
               </div>
               Quay lại Danh sách
            </Link>
            <div className="flex gap-4 w-full md:w-auto">
               <button
                  onClick={() => setModalType('reset')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-xl shadow-zinc-200/10 active:scale-95"
               >
                  <Key className="h-4 w-4" /> Reset mật khẩu
               </button>
               <button
                  onClick={() => setModalType('lock')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${status === 'Active'
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-rose-600/10'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-emerald-600/10'
                     }`}
               >
                  {status === 'Active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  {status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa ngay'}
               </button>
            </div>
         </div>

         {/* Profile Overview Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
               { label: 'Tổng số Ví', value: thongKe.soVi?.toString() || '0', icon: Wallet, color: 'text-indigo-500' },
               { label: 'Tổng Giao dịch', value: thongKe.tongGiaoDich?.toLocaleString('vi-VN') || '0', icon: Activity, color: 'text-emerald-500' },
               { label: 'Tổng Chi tiêu', value: thongKe.tongChi ? `${(thongKe.tongChi / 1000000).toFixed(1)}M` : '0', icon: ArrowUpRight, color: 'text-rose-500' },
            ].map((stat, idx) => (
               <div key={idx} className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 group transition-all w-full">
                  <div className={`p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 ${stat.color} transition-transform`}>
                     <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">{stat.label}</span>
                     <p className="text-xl font-black text-zinc-900 dark:text-white uppercase leading-none italic tracking-tighter">{stat.value}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 items-start">
            {/* Left Column: User Profile (2/4 - wider) */}
            <div className="xl:col-span-2 space-y-8">
               <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                     <div className="flex flex-col items-center text-center mb-10">
                        <div className="relative mb-8">
                           <div className="relative inline-block">
                              <img
                                 src={userData?.anhDaiDien ? `/Anh/${userData.anhDaiDien}` : `https://i.pravatar.cc/150?u=${userData?.nguoiDungId || userId}`}
                                 className="h-40 w-40 rounded-[3rem] object-cover shadow-[0_20px_50px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-transform duration-700 hover-scale-safe"
                                 alt="Avatar"
                              />

                              <div className={`absolute -bottom-2 right-0 left-0 mx-auto w-fit px-5 py-2 rounded-full border-4 border-white dark:border-zinc-900 text-[9px] font-black uppercase tracking-widest shadow-xl z-20 flex items-center gap-2 ${status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-zinc-500 text-white'
                                 }`}>
                                 {status === 'Active' && (
                                    <span className="relative flex h-2 w-2">
                                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                       <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                 )}
                                 {status === 'Active' ? 'Active' : 'Locked'}
                              </div>
                           </div>
                        </div>
                        <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-3 italic">{userData?.hoTen || userData?.tenDangNhap || 'Người dùng'}</h2>
                        <div className="flex items-center gap-3 px-6 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                           <Shield className="h-5 w-5 text-indigo-500" />
                           <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">{role} ACCOUNT</span>
                        </div>
                     </div>

                     <div className="space-y-5">
                        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/20 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 group/item hover:border-indigo-500 transition-colors">
                           <Mail className="h-6 w-6 text-zinc-400 group-hover/item:text-indigo-500 transition-colors" />
                           <div>
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic opacity-60">Email Address</p>
                              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{userData?.email || 'Chưa cập nhật'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/20 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 group/item hover:border-indigo-500 transition-colors">
                           <Calendar className="h-6 w-6 text-zinc-400 group-hover/item:text-indigo-500 transition-colors" />
                           <div>
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic opacity-60">Member Since</p>
                              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                 {userData?.ngayTao ? new Date(userData.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Claims & Permissions List */}
               <div className="bg-zinc-950 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                           <Shield className="h-10 w-10 text-indigo-400" />
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">System Claims</h3>
                        </div>
                        <button
                           onClick={() => setModalType('role')}
                           className="bg-white/10 border border-white/20 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                           Đổi vai trò
                        </button>
                     </div>

                     <div className="space-y-5">
                        {claims.map((claim, idx) => (
                           <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl border ${claim.active ? 'bg-white/10 border-white/10' : 'bg-transparent border-white/5 opacity-20'
                              }`}>
                              <span className="text-sm font-black uppercase tracking-widest opacity-80">{claim.title}</span>
                              {claim.active ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5 text-rose-400" />}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Audit Trail & Login History (2/4 - narrower) */}
            <div className="xl:col-span-2 space-y-10">
               {/* Section: Audit Trail */}
               <div className="space-y-6">
                  <div className="flex items-center gap-4 px-4">
                     <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/10">
                        <FileText className="h-8 w-8" />
                     </div>
                     <h2 className="text-4xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">System logs / Audit Trail</h2>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm p-10 md:p-14 space-y-10">
                     {auditLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-8 relative group">
                           {idx !== auditLogs.length - 1 && <div className="absolute left-[32px] top-16 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-500 transition-colors" />}
                           <div className="h-16 w-16 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                              <Clock className="h-7 w-7" />
                           </div>
                           <div className="flex-1 pt-2">
                              <div className="flex justify-between items-center mb-3">
                                 <h4 className="text-base font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">{log.action}</h4>
                                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">{log.time}</span>
                              </div>
                              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 italic opacity-60 mb-3">{log.details}</p>
                              <div className="flex items-center gap-3">
                                 <User className="h-4 w-4 text-indigo-500" />
                                 <span className="text-xs font-black uppercase text-indigo-600 italic">Thực hiện bởi: {log.admin}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Section: Login History */}
               <div className="space-y-6">
                  <div className="flex items-center gap-4 px-4">
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/10">
                        <History className="h-7 w-7" />
                     </div>
                     <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">Phiên đăng nhập gần đây</h2>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 min-h-[450px]">
                     <div className="overflow-x-auto w-full">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                 <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Thời gian</th>
                                 <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Địa chỉ IP</th>
                                 <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Thiết bị</th>
                                 <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Trạng thái</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                              {sessions.length === 0 ? (
                                 <tr>
                                    <td colSpan={4} className="px-8 py-16 text-center text-zinc-400 text-sm font-medium">Không có dữ liệu phiên đăng nhập</td>
                                 </tr>
                              ) : sessions.map((session, idx) => (
                                 <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-8 py-8 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 italic opacity-70 font-mono tracking-tight">
                                       {session.lanDangNhapGanNhat ? new Date(session.lanDangNhapGanNhat).toLocaleString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="px-8 py-8 font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-4 text-xs">
                                       <Globe className="h-4 w-4 opacity-50" /> {session.ipAddress || 'N/A'}
                                    </td>
                                    <td className="px-8 py-8 max-w-[250px]">
                                       <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 italic truncate" title={session.thietBi}>
                                          <Smartphone className="h-4 w-4 opacity-30 shrink-0" /> {session.thietBi || 'Unknown'}
                                       </span>
                                    </td>
                                    <td className="px-8 py-8">
                                       <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${session.ketQuaDangNhap === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                          }`}>
                                          <span className={`h-1 w-1 rounded-full ${session.ketQuaDangNhap === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                          {session.ketQuaDangNhap === 1 ? 'Thành công' : 'Thất bại'}
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <div className="px-12 py-10 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 text-center">
                        <button className="text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-3 mx-auto italic">
                           Tải xuống nhật ký JSON <ArrowUpRight className="h-5 w-5" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* High-Risk Account Policy Notification */}
               <div className="p-10 bg-indigo-600 text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                     <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Chính sách bảo mật Identity</h3>
                        <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                           Mọi hành động Reset mật khẩu hoặc Thay đổi vai trò đều được giám sát chặt chẽ. Hệ thống sẽ tự động gửi thông báo OTP về thiết bị chính của người dùng để xác nhận quyền sở hữu sau khi Admin hoàn tất thay đổi.
                        </p>
                     </div>
                     <button className="px-10 py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                        View Policy CM
                     </button>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/20 blur-[100px] pointer-events-none animate-pulse"></div>
               </div>
            </div>
         </div>

         {/* Confirmation Modals */}
         <XacNhanHanhDong
            isOpen={modalType === 'reset'}
            onClose={() => setModalType(null)}
            onConfirm={confirmAction}
            type="warning"
            title="Reset mật khẩu?"
            message={`Bạn có chắc chắn muốn cung cấp mật khẩu tạm thời cho người dùng này? Mật khẩu cũ sẽ bị vô hiệu hóa ngay lập tức.`}
            confirmLabel="Đồng ý Reset"
            isLoading={isProcessing}
         />
         <XacNhanHanhDong
            isOpen={modalType === 'lock'}
            onClose={() => setModalType(null)}
            onConfirm={confirmAction}
            type={status === 'Active' ? 'danger' : 'info'}
            title={status === 'Active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
            message={
               status === 'Active'
                  ? "Mọi phiên đăng nhập hiện tại sẽ bị xóa bỏ và người dùng không thể truy cập lại."
                  : "Người dùng sẽ có thể đăng nhập lại bình thường sau hành động này."
            }
            confirmLabel={status === 'Active' ? 'Đồng ý khóa' : 'Mở khóa ngay'}
            isLoading={isProcessing}
         />
         <XacNhanHanhDong
            isOpen={modalType === 'role'}
            onClose={() => setModalType(null)}
            onConfirm={confirmAction}
            type="info"
            title="Đổi vai trò?"
            message={`Bạn có chắc muốn đổi vai trò của người dùng này từ ${role} thành ${role === 'Admin' ? 'User' : 'Admin'}?`}
            confirmLabel="Đồng ý đổi vai trò"
            isLoading={isProcessing}
         />
      </div>
   );
}
