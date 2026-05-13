"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Plus, Download, Filter, X, ChevronUp, ChevronDown,
  Users, UserCheck, UserX, UserPlus, Eye, Edit2, Lock, Unlock,
  Trash2, Check, XCircle, MoreVertical, RefreshCw, Mail, Phone,
  Calendar, Shield, Globe, Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import { Button, ActionButton } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell, TablePagination } from '@/components/ui/Table';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { Select } from '@/components/chung/Form/Select';
import {
  layDanhSachNguoiDungQt,
  layThongKeTongQuanNguoiDung,
  layThongKeTheoLoc,
  khoaTaiKhoanQt,
  moKhoaTaiKhoanQt,
  xoaMemNguoiDungQt,
  xuatExcelNguoiDungQt,
  khoaNhieuTaiKhoanQt,
  moKhoaNhieuTaiKhoanQt,
  type NguoiDungItem,
  type VaiTroDto,
  type LocNguoiDungDto,
  type ThongKeTongQuanNguoiDung,
} from '@/services/qt/nguoidung';
import { layDanhSachVaiTro } from '@/services/qt/vaitro';

// Import các modal và drawer
import UserDetailDrawer from './UserDetailDrawer';
import UserFormModal from './UserFormModal';
import LockConfirmDialog from './LockConfirmDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import FloatingActionBar from './FloatingActionBar';

interface UserManagementProps {
  onUserCreated?: () => void;
  onUserUpdated?: () => void;
}

export default function UserManagement({ onUserCreated, onUserUpdated }: UserManagementProps) {
  // ============ STATE ============
  const [users, setUsers] = useState<NguoiDungItem[]>([]);
  const [roles, setRoles] = useState<VaiTroDto[]>([]);
  const [stats, setStats] = useState<ThongKeTongQuanNguoiDung | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'' | 'HOAT_DONG' | 'KHOA' | 'DA_XOA'>('');
  const [selectedLoginMethod, setSelectedLoginMethod] = useState<'' | 'THUONG' | 'GOOGLE'>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Sorting
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Loading
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Selection (multiple)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // Modal/Drawer states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Confirm dialogs
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false);
  const [unlockConfirmOpen, setUnlockConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lockReason, setLockReason] = useState('');
  
  // Role dropdown per row
  const [roleDropdownId, setRoleDropdownId] = useState<number | null>(null);
  
  // Debounce search
  const [searchInput, setSearchInput] = useState('');

  // ============ EFFECT ============
  useEffect(() => {
    fetchRoles();
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, search, selectedRole, selectedStatus, selectedLoginMethod, dateFrom, dateTo, sortBy, sortOrder]);

  useEffect(() => {
    fetchStatsByFilter();
  }, [search, selectedRole, selectedStatus, selectedLoginMethod, dateFrom, dateTo]);

  // ============ FUNCTIONS ============
  const buildFilter = useCallback((): LocNguoiDungDto => ({
    search: search || undefined,
    vaiTro: selectedRole || undefined,
    trangThai: selectedStatus || undefined,
    phuongThucDangNhap: selectedLoginMethod || undefined,
    tuNgay: dateFrom || undefined,
    denNgay: dateTo || undefined,
    page,
    pageSize,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder,
  }), [search, selectedRole, selectedStatus, selectedLoginMethod, dateFrom, dateTo, page, pageSize, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filter = buildFilter();
      const result = await layDanhSachNguoiDungQt(filter);
      setUsers(result.items || []);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await layDanhSachVaiTro();
      setRoles(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách vai trò:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await layThongKeTongQuanNguoiDung();
      setStats(data);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
    }
  };

  const fetchStatsByFilter = async () => {
    try {
      const filter = buildFilter();
      const data = await layThongKeTheoLoc(filter);
      setStats(data);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê theo bộ lọc:', error);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map(u => u.nguoiDungId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleViewDetail = (userId: number) => {
    setSelectedUserId(userId);
    setShowDetailDrawer(true);
  };

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setShowEditModal(true);
  };

  const handleLock = (userId: number) => {
    setSelectedUserId(userId);
    setLockReason('');
    setLockConfirmOpen(true);
  };

  const handleUnlock = (userId: number) => {
    setSelectedUserId(userId);
    setUnlockConfirmOpen(true);
  };

  const handleDelete = (userId: number) => {
    setSelectedUserId(userId);
    setDeleteConfirmOpen(true);
  };

  const confirmLock = async () => {
    if (!selectedUserId) return;
    try {
      await khoaTaiKhoanQt(selectedUserId, { lyDo: lockReason });
      toast.success('Đã khóa tài khoản thành công');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Không thể khóa tài khoản');
    } finally {
      setLockConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  const confirmUnlock = async () => {
    if (!selectedUserId) return;
    try {
      await moKhoaTaiKhoanQt(selectedUserId);
      toast.success('Đã mở khóa tài khoản thành công');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Không thể mở khóa tài khoản');
    } finally {
      setUnlockConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  const confirmDelete = async (email: string) => {
    if (!selectedUserId) return;
    try {
      await xoaMemNguoiDungQt(selectedUserId, email);
      toast.success('Đã xóa người dùng thành công');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Không thể xóa người dùng');
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await import('@/services/qt/nguoidung').then(m => m.capNhatVaiTroNguoiDungQt(userId, newRole));
      toast.success('Đã cập nhật vai trò');
      setRoleDropdownId(null);
      fetchUsers();
    } catch (error) {
      toast.error('Không thể cập nhật vai trò');
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const filter = buildFilter();
      const blob = await xuatExcelNguoiDungQt(filter);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `danh_sach_nguoi_dung_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      toast.error('Không thể xuất Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleBulkLock = async (reason: string) => {
    try {
      await khoaNhieuTaiKhoanQt(selectedIds, reason);
      toast.success(`Đã khóa ${selectedIds.length} tài khoản`);
      setSelectedIds([]);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Không thể khóa hàng loạt');
    }
  };

  const handleBulkUnlock = async () => {
    try {
      await moKhoaNhieuTaiKhoanQt(selectedIds);
      toast.success(`Đã mở khóa ${selectedIds.length} tài khoản`);
      setSelectedIds([]);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Không thể mở khóa hàng loạt');
    }
  };

  const handleBulkExport = async () => {
    // Export selected users
    handleExportExcel();
  };

  const handleUserCreated = () => {
    setShowAddModal(false);
    fetchUsers();
    fetchStats();
    onUserCreated?.();
    toast.success('Thêm người dùng thành công');
  };

  const handleUserUpdated = () => {
    setShowEditModal(false);
    fetchUsers();
    onUserUpdated?.();
    toast.success('Cập nhật người dùng thành công');
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setSelectedRole('');
    setSelectedStatus('');
    setSelectedLoginMethod('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = useMemo(() => {
    return search || selectedRole || selectedStatus || selectedLoginMethod || dateFrom || dateTo;
  }, [search, selectedRole, selectedStatus, selectedLoginMethod, dateFrom, dateTo]);

  const getRoleBadgeVariant = (role: string) => {
    const lower = role.toLowerCase();
    if (lower === 'admin' || lower === 'quanly') return 'error';
    if (lower === 'user' || lower === 'nguoidung') return 'income';
    return 'default';
  };

  const getStatusChip = (user: NguoiDungItem) => {
    if (user.daXoa === 1) {
      return <StatusBadge status="INACTIVE" />;
    }
    if (user.trangThai === 0) {
      return <StatusBadge status="LOCKED" />;
    }
    return <StatusBadge status="ACTIVE" />;
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // ============ RENDER ============
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Quản lý người dùng
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Quản lý tài khoản, vai trò và trạng thái người dùng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            loading={exporting}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Xuất Excel
          </Button>
          <Button
            variant="success"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="fe-card-fe p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.tongNguoiDung ?? 0}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng người dùng</p>
            </div>
          </div>
        </div>
        <div className="fe-card-fe p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
              <UserCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.dangHoatDong ?? 0}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="fe-card-fe p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/20">
              <UserX className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.biKhoa ?? 0}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bị khóa</p>
            </div>
          </div>
        </div>
        <div className="fe-card-fe p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/20">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.dangKyThangNay ?? 0}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Đăng ký tháng này</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fe-card-fe p-4 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <Input
              placeholder="Tìm theo tên, email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map(role => (
              <option key={role.vaiTroId} value={role.tenVaiTro}>
                {role.tenVaiTro}
              </option>
            ))}
          </Select>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="min-w-[160px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="HOAT_DONG">Đang hoạt động</option>
            <option value="KHOA">Bị khóa</option>
            <option value="DA_XOA">Đã xóa</option>
          </Select>

          {/* Login Method Filter */}
          <Select
            value={selectedLoginMethod}
            onChange={(e) => setSelectedLoginMethod(e.target.value as any)}
            className="min-w-[160px]"
          >
            <option value="">Tất cả đăng nhập</option>
            <option value="THUONG">Đăng nhập thường</option>
            <option value="GOOGLE">Google</option>
          </Select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[140px]"
              placeholder="Từ ngày"
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[140px]"
              placeholder="Đến ngày"
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              leftIcon={<X className="h-4 w-4" />}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Filter className="h-4 w-4" />
            <span>Đang áp dụng bộ lọc:</span>
            {search && <Badge variant="default">{search}</Badge>}
            {selectedRole && <Badge variant="default">Vai trò: {selectedRole}</Badge>}
            {selectedStatus && <Badge variant="default">
              Trạng thái: {selectedStatus === 'HOAT_DONG' ? 'Hoạt động' : selectedStatus === 'KHOA' ? 'Khóa' : 'Đã xóa'}
            </Badge>}
            {selectedLoginMethod && <Badge variant="default">
              Đăng nhập: {selectedLoginMethod === 'THUONG' ? 'Thường' : 'Google'}
            </Badge>}
            {(dateFrom || dateTo) && <Badge variant="default">
              Ngày: {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : dateFrom || dateTo}
            </Badge>}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="fe-card-fe rounded-xl overflow-hidden">
        <Table>
          <TableHeader
            columns={[
              { key: 'checkbox', label: '', width: '40px' },
              { key: 'anhDaiDien', label: '', width: '50px' },
              { key: 'hoTen', label: 'Họ tên', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'soDienThoai', label: 'SĐT', width: '120px' },
              { key: 'vaiTro', label: 'Vai trò', width: '120px' },
              { key: 'trangThai', label: 'Trạng thái', width: '130px' },
              { key: 'emailDaXacThuc', label: 'Xác thực', width: '100px' },
              { key: 'lanDangNhapCuoi', label: 'Đăng nhập cuối', width: '140px' },
              { key: 'ngayTao', label: 'Ngày tạo', sortable: true, width: '120px' },
              { key: 'actions', label: 'Hành động', width: '180px' },
            ]}
          />
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} align="center" className="py-12">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
                    <span>Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" className="py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-12 w-12" style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Không có người dùng nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.nguoiDungId}>
                  {/* Checkbox */}
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.nguoiDungId)}
                      onChange={(e) => handleSelectOne(user.nguoiDungId, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>

                  {/* Avatar */}
                  <TableCell className="w-12">
                    <img
                      src={user.anhDaiDien ? `/Anh/${user.anhDaiDien}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen)}&size=64&background=10b981&color=fff&bold=true`}
                      alt={user.hoTen}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </TableCell>

                  {/* Họ tên */}
                  <TableCell>
                    <div className="font-medium">{user.hoTen}</div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <div className="text-sm">{user.email}</div>
                  </TableCell>

                  {/* SĐT */}
                  <TableCell>
                    <div className="text-sm">{user.soDienThoai || '-'}</div>
                  </TableCell>

                  {/* Vai trò - Badge có dropdown */}
                  <TableCell>
                    <div className="relative">
                      <button
                        onClick={() => setRoleDropdownId(roleDropdownId === user.nguoiDungId ? null : user.nguoiDungId)}
                        className="inline-block"
                      >
                        <Badge variant={getRoleBadgeVariant(user.vaiTro[0] || 'user')}>
                          {user.vaiTro[0] || 'user'}
                        </Badge>
                      </button>
                      
                      {/* Role Dropdown */}
                      {roleDropdownId === user.nguoiDungId && (
                        <div 
                          className="absolute z-50 top-full left-0 mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border py-1 min-w-[120px]"
                          onMouseLeave={() => setRoleDropdownId(null)}
                        >
                          {roles.map(role => (
                            <button
                              key={role.vaiTroId}
                              onClick={() => handleRoleChange(user.nguoiDungId, role.tenVaiTro)}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                                user.vaiTro.includes(role.tenVaiTro) ? 'font-semibold' : ''
                              }`}
                            >
                              {role.tenVaiTro}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell>
                    {getStatusChip(user)}
                  </TableCell>

                  {/* Xác thực email */}
                  <TableCell align="center">
                    {user.emailDaXacThuc === 1 ? (
                      <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                    )}
                  </TableCell>

                  {/* Đăng nhập cuối */}
                  <TableCell>
                    <div className="text-sm">
                      {user.lanDangNhapCuoi 
                        ? new Date(user.lanDangNhapCuoi).toLocaleDateString('vi-VN')
                        : 'Chưa đăng nhập'}
                    </div>
                  </TableCell>

                  {/* Ngày tạo */}
                  <TableCell>
                    <div className="text-sm">
                      {user.ngayTao 
                        ? new Date(user.ngayTao).toLocaleDateString('vi-VN')
                        : '-'}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableActions user={user} onView={handleViewDetail} onEdit={handleEdit} onLock={handleLock} onUnlock={handleUnlock} onDelete={handleDelete} />
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <TablePagination
            pagination={{
              page,
              pageSize,
              totalCount,
              totalPages,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1,
            }}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Floating Action Bar for Bulk Actions */}
      {selectedIds.length > 0 && (
        <FloatingActionBar
          count={selectedIds.length}
          onLock={(reason) => handleBulkLock(reason)}
          onUnlock={handleBulkUnlock}
          onExport={handleBulkExport}
          onClear={() => setSelectedIds([])}
        />
      )}

      {/* User Detail Drawer */}
      {showDetailDrawer && selectedUserId && (
        <UserDetailDrawer
          userId={selectedUserId}
          open={showDetailDrawer}
          onClose={() => {
            setShowDetailDrawer(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <UserFormModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUserCreated}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUserId && (
        <UserFormModal
          open={showEditModal}
          userId={selectedUserId}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUserId(null);
          }}
          onSuccess={handleUserUpdated}
        />
      )}

      {/* Lock Confirm Dialog */}
      <LockConfirmDialog
        open={lockConfirmOpen}
        onClose={() => setLockConfirmOpen(false)}
        onConfirm={confirmLock}
        reason={lockReason}
        onReasonChange={setLockReason}
      />

      {/* Unlock Confirm Dialog */}
      <ConfirmDialog
        open={unlockConfirmOpen}
        onClose={() => setUnlockConfirmOpen(false)}
        onConfirm={confirmUnlock}
        title="Mở khóa tài khoản"
        description="Bạn có chắc chắn muốn mở khóa tài khoản này? Người dùng sẽ có thể đăng nhập trở lại."
        confirmText="Mở khóa"
        variant="warning"
      />

      {/* Delete Confirm Dialog */}
      {selectedUserId && users.find(u => u.nguoiDungId === selectedUserId) && (
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          userEmail={users.find(u => u.nguoiDungId === selectedUserId)?.email || ''}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={(email) => confirmDelete(email)}
        />
      )}
    </div>
  );
}

// ============ TABLE ACTIONS COMPONENT ============
interface TableActionsProps {
  user: NguoiDungItem;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onLock: (id: number) => void;
  onUnlock: (id: number) => void;
  onDelete: (id: number) => void;
}

function TableActions({ 
  user, 
  onView, 
  onEdit, 
  onLock, 
  onUnlock, 
  onDelete 
}: TableActionsProps) {
  const isLocked = user.trangThai === 0;
  const isDeleted = user.daXoa === 1;

  return (
    <td className="px-6 py-4">
      <div className="flex items-center justify-center gap-1">
        <ActionButton variant="view" onClick={() => onView(user.nguoiDungId)} title="Xem chi tiết">
          <Eye className="h-4 w-4" />
        </ActionButton>
        
        {!isDeleted && (
          <>
            <ActionButton variant="edit" onClick={() => onEdit(user.nguoiDungId)} title="Chỉnh sửa">
              <Edit2 className="h-4 w-4" />
            </ActionButton>
            
            {!isLocked ? (
              <ActionButton variant="delete" onClick={() => onLock(user.nguoiDungId)} title="Khóa tài khoản">
                <Lock className="h-4 w-4" />
              </ActionButton>
            ) : (
              <ActionButton 
                variant="view" 
                onClick={() => onUnlock(user.nguoiDungId)} 
                title="Mở khóa tài khoản"
                style={{ 
                  background: 'var(--bg-emerald-50, #ecfdf5)',
                  border: '1px solid var(--color-emerald-200, #a7f3d0)',
                  color: '#059669'
                }}
              >
                <Unlock className="h-4 w-4" />
              </ActionButton>
            )}
            
            <ActionButton 
              variant="delete" 
              onClick={() => onDelete(user.nguoiDungId)} 
              title="Xóa người dùng"
              style={{ 
                background: 'var(--bg-red-50, #fef2f2)',
                border: '1px solid var(--color-red-200, #fecaca)',
                color: '#dc2626'
              }}
            >
              <Trash2 className="h-4 w-4" />
            </ActionButton>
          </>
        )}
      </div>
    </td>
  );
}
