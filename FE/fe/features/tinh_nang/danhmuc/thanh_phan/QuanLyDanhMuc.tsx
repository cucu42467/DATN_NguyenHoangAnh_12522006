"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Loader,
  ChevronUp,
  ChevronDown,
  Shield,
  User,
  Search,
  X
} from 'lucide-react';
import { layIconUrl } from '@/services';
import { layDanhSachDanhMuc, xoaDanhMuc, capNhatThuTuDanhMuc } from '@/services/danhmuc/danhmuc';
import * as LucideIcons from 'lucide-react';
import { ActionButton } from '@/thanh_phan/ui';
import { Button } from '@/thanh_phan/ui';
import { ConfirmDialog } from '@/thanh_phan/ui';
import { useToast } from '@/thanh_phan/animation/Toast';
import FormDanhMuc from './FormDanhMuc';

export default function QuanLyDanhMuc() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'CHI' | 'THU'>('CHI');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reordering, setReordering] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'HE_THONG' | 'CA_NHAN'>('ALL');

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  // Lọc categories theo search query
  const filteredCategories = categories.filter(cat => 
    cat.tenDanhMuc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await layDanhSachDanhMuc(activeTab);
      const mapped: any[] = (data || []).map((item: any) => ({
        danhMucId: item.danhMucId,
        tenDanhMuc: item.tenDanhMuc,
        icon: item.icon,
        mauSac: item.mauSac || '#64748b',
        loai: item.loaiDanhMuc,
        moTa: item.moTa,
        isHeThong: item.laHeThong,
        thuTu: item.thuTu ?? 0,
      }));
      // Sắp xếp theo thứ tự
      mapped.sort((a, b) => a.thuTu - b.thuTu);
      setCategories(mapped);
      setError(null);
    } catch (err) {
      setError('Lỗi tải danh mục. Vui lòng thử lại.');
      setCategories([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await xoaDanhMuc(Number(deleteId));
      showToast("Danh mục đã được ẩn khỏi danh sách!", "success");
      setDeleteId(null);
      fetchCategories();
    } catch (error) {
      showToast("Không thể ẩn danh mục. Vui lòng thử lại.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id: string, item: any) => {
    setShowEditModal(true);
    setEditingCategory(item);
  };

  const handleMoveUp = async (index: number, item: any) => {
    if (index === 0 || !item.isHeThong === false) return; // Không thể lên nếu ở đầu hoặc là hệ thống
    setReordering(item.danhMucId);
    try {
      const currentThuTu = item.thuTu;
      const prevItem = categories[index - 1];
      // Đổi thứ tự với item phía trên
      await capNhatThuTuDanhMuc(item.danhMucId, prevItem.thuTu);
      await capNhatThuTuDanhMuc(prevItem.danhMucId, currentThuTu);
      await fetchCategories();
    } catch (error) {
      showToast("Không thể sắp xếp. Vui lòng thử lại.", "error");
    } finally {
      setReordering(null);
    }
  };

  const handleMoveDown = async (index: number, item: any) => {
    if (index === categories.length - 1 || !item.isHeThong === false) return; // Không thể xuống nếu ở cuối hoặc là hệ thống
    setReordering(item.danhMucId);
    try {
      const currentThuTu = item.thuTu;
      const nextItem = categories[index + 1];
      // Đổi thứ tự với item phía dưới
      await capNhatThuTuDanhMuc(item.danhMucId, nextItem.thuTu);
      await capNhatThuTuDanhMuc(nextItem.danhMucId, currentThuTu);
      await fetchCategories();
    } catch (error) {
      showToast("Không thể sắp xếp. Vui lòng thử lại.", "error");
    } finally {
      setReordering(null);
    }
  };

  const buildIconUrl = (name?: string) => {
    if (!name) return undefined;
    const trimmed = name.trim();
    if (!trimmed) return undefined;
    // Nếu là URL đầy đủ từ API, trả về luôn
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Nếu là đường dẫn /ICON/xxx.png -> chuyển thành API URL
    if (trimmed.startsWith('/ICON/')) {
      const fileName = trimmed.replace('/ICON/', '');
      return layIconUrl(fileName);
    }
    // Ngược lại coi như là tên file -> build URL
    return layIconUrl(trimmed);
  };

  const getIcon = (name?: string) => {
    const iconUrl = buildIconUrl(name);
    if (iconUrl) {
      return (
        <img
          src={iconUrl}
          alt="icon"
          className="h-5 w-5 object-contain"
          loading="lazy"
        />
      );
    }
    try {
      const IconComponent = name ? (LucideIcons as any)[name] : null;
      return IconComponent ? <IconComponent className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />;
    } catch {
      return <Trash2 className="h-5 w-5" />;
    }
  };

  // Tách danh mục theo filter
  const heThongCategories = filteredCategories.filter(c => c.isHeThong);
  const caNhanCategories = filteredCategories.filter(c => !c.isHeThong);
  
  // Lọc theo loại
  const getFilteredSections = () => {
    const sections: { title: string; icon: React.ReactNode; items: any[]; isCaNhan: boolean }[] = [];
    
    if (filterType === 'ALL' || filterType === 'HE_THONG') {
      if (heThongCategories.length > 0) {
        sections.push({
          title: 'Danh mục hệ thống',
          icon: <Shield className="h-5 w-5 text-blue-600" />,
          items: heThongCategories,
          isCaNhan: false
        });
      }
    }
    
    if (filterType === 'ALL' || filterType === 'CA_NHAN') {
      if (caNhanCategories.length > 0) {
        sections.push({
          title: 'Danh mục cá nhân',
          icon: <User className="h-5 w-5 text-amber-600" />,
          items: caNhanCategories,
          isCaNhan: true
        });
      }
    }
    
    return sections;
  };

  const renderCategoryItem = (item: any, index: number, isCaNhanList: boolean = false) => (
    <div
      key={`danhmuc-${item.danhMucId}-${index}`}
      className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="p-2.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: item.mauSac || '#64748b' }}>
            {getIcon(item.icon)}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{item.tenDanhMuc}</h4>
            {item.moTa && <p className="text-xs text-gray-500 truncate mt-1">{item.moTa}</p>}
          </div>
        </div>

        {/* Actions - Chỉ hiển thị sửa/xóa cho danh mục cá nhân, không có sắp xếp */}
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {isCaNhanList && (
            <>
              {/* Nút sửa */}
              <ActionButton
                variant="edit"
                onClick={(e) => { e.stopPropagation(); handleEdit(item.danhMucId, item); }}
                title="Sửa"
              >
                <Edit2 className="h-5 w-5" />
              </ActionButton>
              {/* Nút xóa */}
              <ActionButton
                variant="delete"
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.danhMucId); }}
                title="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </ActionButton>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderCategorySection = (
    title: string,
    icon: React.ReactNode,
    items: any[],
    isCaNhan: boolean = false
  ) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500">({items.length})</span>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-sm text-gray-400">Chưa có danh mục nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => renderCategoryItem(item, index, isCaNhan))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('CHI' as const)}
              className={`flex-1 sm:px-6 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'CHI'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <TrendingDown className="h-4 w-4" /> Chi tiêu
            </button>
            <button
              onClick={() => setActiveTab('THU' as const)}
              className={`flex-1 sm:px-6 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'THU'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <TrendingUp className="h-4 w-4" /> Thu nhập
            </button>
          </div>

          {/* SUCCESS - Thêm mới (Green) */}
          <Button variant="success" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Search Bar với bộ lọc */}
        <div className="mt-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterType === 'ALL'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('HE_THONG')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                filterType === 'HE_THONG'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Hệ thống
            </button>
            <button
              onClick={() => setFilterType('CA_NHAN')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                filterType === 'CA_NHAN'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Cá nhân
            </button>
          </div>
        </div>
      </div>

      {/* Grid Danh sách */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
            <Loader className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-200">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            {searchQuery ? (
              <>
                <p className="text-gray-500 font-medium">Không tìm thấy danh mục nào</p>
                <p className="text-sm text-gray-400 mt-1">Với từ khóa "{searchQuery}"</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 font-medium">Chưa có danh mục nào</p>
                <p className="text-sm text-gray-400 mt-1">Nhấn nút "Thêm danh mục" để tạo danh mục đầu tiên</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {getFilteredSections().map((section, idx) => (
              <div key={section.title}>{renderCategorySection(section.title, section.icon, section.items, section.isCaNhan)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <FormDanhMuc 
              onSuccess={() => {
                showToast("Danh mục đã được thêm thành công!", "success");
                setShowAddModal(false);
                fetchCategories();
              }}
              onClose={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <FormDanhMuc 
              initialData={editingCategory}
              onSuccess={() => {
                showToast("Danh mục đã được cập nhật thành công!", "success");
                setShowEditModal(false);
                setEditingCategory(null);
                fetchCategories();
              }}
              onClose={() => {
                setShowEditModal(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Ẩn danh mục?"
        description="Danh mục này sẽ bị ẩn khỏi danh sách. Bạn có thể liên hệ admin để khôi phục."
        confirmText="Ẩn"
        cancelText="Hủy bỏ"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
