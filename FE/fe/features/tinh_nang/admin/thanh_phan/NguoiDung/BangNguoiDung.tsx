"use client";

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Lock,
  Unlock,
  Eye,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  Clock,
  MoreVertical,
  UserCheck,
  UserMinus,
  FilterX
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { layDanhSachNguoiDungQt, type NguoiDungItem } from '@/services/qt/nguoidung';
import Link from 'next/link';
import XacNhanHanhDong from '../Chung/XacNhanHanhDong';

// Map từ API response sang component User type
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Locked';
  createdAt: string;
  avatar?: string;
}

const mapApiToUser = (item: NguoiDungItem): User => ({
  id: item.nguoiDungId?.toString() || '',
  name: item.hoTen || 'Unknown',
  email: item.email || '',
  phone: item.soDienThoai || '',
  role: item.vaiTro?.some(r => r.toUpperCase() === 'ADMIN') ? 'Admin' : 'User',
  status: (item.trangThai ?? true) ? 'Active' : 'Locked',
  createdAt: item.ngayTao || new Date().toISOString().split('T')[0],
  avatar: item.anhDaiDien ? `/Anh/${item.anhDaiDien}` : `https://i.pravatar.cc/150?u=${item.nguoiDungId}`
});

export default function BangNguoiDung() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<'All' | 'Admin' | 'User'>('All');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await layDanhSachNguoiDungQt(page, 20, searchTerm || undefined);
        setUsers(result.items.map(mapApiToUser));
        setTotalCount(result.totalCount);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải dữ liệu');
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const filteredUsers = useMemo(() => {
    if (loading || error) return [];
    return users.filter(user =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === 'All' || user.role === filterRole)
    );
  }, [users, searchTerm, filterRole, loading, error]);

  const handleToggleRequest = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    setIsLoading(selectedUser.id);
    setModalOpen(false);

    // Giả lập xử lý API
    await new Promise(resolve => setTimeout(resolve, 800));
    setUsers(prev => prev.map(user =>
      user.id === selectedUser.id ? { ...user, status: user.status === 'Active' ? 'Locked' : 'Active' } : user
    ));
    setIsLoading(null);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-700">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <input type="date" className="bg-transparent text-[11px] font-bold uppercase tracking-wider focus:outline-none text-zinc-600 dark:text-zinc-300" />
              <span className="text-zinc-300">/</span>
              <input type="date" className="bg-transparent text-[11px] font-bold uppercase tracking-wider focus:outline-none text-zinc-600 dark:text-zinc-300" />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold text-[11px] uppercase tracking-widest focus:outline-none hover:bg-zinc-50 transition-all"
            >
              <option value="All">Mọi vai trò</option>
              <option value="Admin">Admin</option>
              <option value="User">Thành viên</option>
            </select>

            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">
              <UserPlus className="h-5 w-5" /> Thêm mới
            </button>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu chính */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th className="px-10 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                Thành viên
              </th>
              <th className="px-10 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                Phân quyền
              </th>
              <th className="px-10 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                Ngày tạo
              </th>
              <th className="px-10 py-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                Trạng thái
              </th>
              <th className="px-10 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-10 py-9 bg-white dark:bg-zinc-900 border-y border-l border-zinc-100 dark:border-zinc-800 first:rounded-l-[2.5rem]">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 bg-zinc-100 rounded-2xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-zinc-100 rounded animate-pulse"></div>
                        <div className="h-2 w-40 bg-zinc-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-9 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
                    <div className="h-6 w-24 bg-zinc-100 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-10 py-9 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
                    <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse"></div>
                  </td>
                  <td className="px-10 py-9 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
                    <div className="h-6 w-12 bg-zinc-100 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-10 py-9 bg-white dark:bg-zinc-900 border-y border-r border-zinc-100 dark:border-zinc-800 last:rounded-r-[2.5rem] text-right">
                    <div className="h-10 w-10 bg-zinc-100 rounded-full animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-32 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full">
                      <FilterX className="h-8 w-8 text-zinc-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest italic">Không tìm thấy kết quả</p>
                      <p className="text-xs text-zinc-400 font-medium">Vui lòng kiểm tra lại từ khóa hoặc bộ lọc của bạn.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr key={user.id} className="group transition-all duration-500 hover:translate-x-2">
                  <td className="px-10 py-8 bg-white dark:bg-zinc-900 border-y border-l border-zinc-100 dark:border-zinc-800 first:rounded-l-[2.5rem] shadow-sm group-hover:shadow-indigo-500/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-12 w-12 rounded-[1.25rem] object-cover group-hover:scale-110 transition-transform duration-500 shadow-sm"
                        />
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {user.status === 'Active' && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40"></span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter mb-1 group-hover:text-indigo-600 transition-colors leading-none">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 opacity-70 leading-none">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:shadow-indigo-500/10 transition-all">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${user.role === 'Admin'
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50 text-indigo-600'
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500'
                      }`}>
                      <Shield className="h-3 w-3" /> {user.role === 'Admin' ? 'Admin' : 'Member'}
                    </div>
                  </td>
                  <td className="px-10 py-8 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:shadow-indigo-500/10 transition-all">
                    <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase italic tracking-tighter flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 opacity-40" /> {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td className="px-10 py-8 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:shadow-indigo-500/10 transition-all">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleRequest(user)}
                        disabled={isLoading === user.id}
                        className={`relative w-9 h-5 rounded-full transition-all duration-500 focus:outline-none border ${user.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                          }`}
                      >
                        <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow-sm transition-all duration-500 flex items-center justify-center ${user.status === 'Active' ? 'translate-x-4.5 bg-emerald-500' : 'translate-x-0.5 bg-zinc-400'
                          }`}>
                          {isLoading === user.id && <div className="h-2 w-2 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                        </div>
                      </button>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                          : 'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'
                        }`}>
                        <span className={`h-1 w-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                        {user.status === 'Active' ? 'Active' : 'Locked'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 bg-white dark:bg-zinc-900 border-y border-r border-zinc-100 dark:border-zinc-800 last:rounded-r-[2.5rem] shadow-sm group-hover:shadow-indigo-500/10 transition-all text-right">
                    <Link
                      href={`/admin/NguoiDung/${user.id}`}
                      className="inline-flex items-center justify-center h-10 w-10 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 rounded-xl transition-all active:scale-90"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer phân trang */}
      <div className="mt-8 px-8 py-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center shadow-sm gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">
            {loading ? 'Đang tải...' : error ? `Lỗi: ${error}` : `Hiển thị ${filteredUsers.length} trên tổng số ${totalCount} người dùng`}
          </p>
          <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest italic">
            <Download className="h-4 w-4" /> Kết xuất báo cáo Identity
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-indigo-600 transition-all disabled:opacity-30"
            disabled={page === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1">
            {/* Giả lập list trang */}
            {[page, page + 1, page + 2].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 w-10 rounded-xl font-black text-xs transition-all ${page === p ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' : 'bg-transparent text-zinc-400 hover:bg-zinc-100'
                  }`}
              >
                {p}
              </button>
            )).filter((_, i) => page + i <= Math.ceil(totalCount / 20))}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            className="h-10 w-10 rounded-full bg-white border border-[#c9c9cd] flex items-center justify-center text-[#8d969e] hover:text-[#494fdf] transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal xác nhận */}
      <XacNhanHanhDong
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmToggleStatus}
        type={selectedUser?.status === 'Active' ? 'danger' : 'info'}
        title={selectedUser?.status === 'Active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
        message={
          selectedUser?.status === 'Active'
            ? `Hành động này sẽ ngăn chặn người dùng ${selectedUser?.name} truy cập vào hệ thống ngay lập tức.`
            : `Hành động này sẽ khôi phục quyền truy cập cho người dùng ${selectedUser?.name}.`
        }
        confirmLabel={selectedUser?.status === 'Active' ? 'Đồng ý khóa' : 'Kích hoạt ngay'}
        isLoading={isLoading === selectedUser?.id}
      />
    </div>
  );
}
