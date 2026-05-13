"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus, ChevronRight, ChevronDown, Palette, Smile,
  Edit2, Trash2, Zap, TrendingUp, TrendingDown,
  Check, X, GripVertical, Settings2, RefreshCw
} from 'lucide-react';
import { layDanhSachDanhMucQt } from '@/services/qt';

type CategoryType = 'expense' | 'income';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  count?: number;
  syncToNew?: boolean;
  children?: Category[];
}

// Revolut Color Palette
const REVOLUT_COLORS = {
  dark: '#191c1f',
  white: '#ffffff',
  lightSurface: '#f4f4f4',
  blue: '#494fdf',
  danger: '#e23b4a',
  teal: '#00a87e',
  textSecondary: '#505a63',
  textMuted: '#8d969e',
  border: '#c9c9cd',
};

const COLOR_PALETTE = [
  '#494fdf', '#00a87e', '#e23b4a', '#ec7e00', '#b09000',
  '#e61e49', '#428619', '#936d62', '#007bc2', '#8b0000',
];

// Build tree từ flat list
const buildCategoryTree = (items: any[]): Category[] => {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  items.forEach((item) => {
    const type: CategoryType = item.loaiDanhMuc === 'THU' ? 'income' : 'expense';
    map.set(item.danhMucId, {
      id: item.danhMucId.toString(),
      name: item.tenDanhMuc,
      icon: item.icon || '',
      color: item.mauSac || REVOLUT_COLORS.blue,
      type: type,
      syncToNew: item.laHeThong || false,
      children: []
    });
  });

  items.forEach((item) => {
    const category = map.get(item.danhMucId)!;
    if (item.chaId && map.has(item.chaId)) {
      const parent = map.get(item.chaId)!;
      parent.children = parent.children || [];
      parent.children.push(category);
    } else {
      roots.push(category);
    }
  });

  return roots;
};

export default function BangDanhMuc() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [newChild, setNewChild] = useState<{ parentId: string; name: string; color: string; icon: string; type: CategoryType }>({
    parentId: '', name: '', color: REVOLUT_COLORS.blue, icon: '', type: 'expense'
  });

  // Fetch categories từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await layDanhSachDanhMucQt(undefined, true);
        const tree = buildCategoryTree(data);
        setCategories(tree);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#494fdf]">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const startAddChild = (parentId: string, parentType: CategoryType) => {
    setAddingChildTo(parentId);
    setNewChild({ parentId, name: '', color: REVOLUT_COLORS.blue, icon: '', type: parentType });
  };

  const confirmAddChild = (parentId: string) => {
    if (!newChild.name.trim()) return;
    const child: Category = {
      id: `${parentId}-${Date.now()}`,
      name: newChild.name,
      icon: newChild.icon,
      color: newChild.color,
      type: newChild.type,
    };
    setCategories(prev => prev.map(p =>
      p.id === parentId ? { ...p, children: [...(p.children || []), child] } : p
    ));
    setAddingChildTo(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {categories.map((parent) => (
        <div key={parent.id} className="bg-white rounded-[20px] border border-[#c9c9cd] overflow-hidden group">
          {/* Parent Row */}
          <div
            className={`flex items-center justify-between p-6 cursor-pointer hover:bg-[#f4f4f4] transition-all ${expanded.includes(parent.id) ? 'border-b border-[#c9c9cd]' : ''}`}
            onClick={() => toggleExpand(parent.id)}
          >
            <div className="flex items-center gap-4">
              {parent.icon && parent.icon.includes('/') ? (
                <img
                  src={parent.icon}
                  alt={parent.name}
                  className="h-14 w-14 rounded-[12px] object-cover border-2 border-[#191c1f] group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div
                className={`h-14 w-14 rounded-[12px] flex items-center justify-center text-2xl border-2 border-[#191c1f] group-hover:scale-105 transition-all duration-300 ${parent.icon && parent.icon.includes('/') ? 'hidden' : ''}`}
                style={{ backgroundColor: parent.color + '20' }}
              >
                {parent.icon && !parent.icon.includes('/') ? parent.icon : parent.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium uppercase tracking-tight text-[#191c1f]" style={{ fontFamily: 'Aeonik Pro, Inter, sans-serif', fontWeight: 500 }}>
                    {parent.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${parent.type === 'expense'
                      ? 'bg-[#f4f4f4] border-[#c9c9cd] text-[#e23b4a]'
                      : 'bg-[#f4f4f4] border-[#c9c9cd] text-[#00a87e]'
                    }`}>
                    {parent.type === 'expense' ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {parent.type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-[#8d969e] font-medium uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {parent.children?.length || 0} danh mục con
                  </p>
                  {parent.syncToNew && (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-[#494fdf] uppercase tracking-wider bg-[#f4f4f4] px-2.5 py-0.5 rounded-full">
                      <RefreshCw className="h-3 w-3" /> Sync cho User mới
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <div className="w-6 h-6 rounded-lg border-2 border-[#191c1f] cursor-pointer" style={{ backgroundColor: parent.color }} title="Màu sắc danh mục" />
              <button className="p-2 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#f4f4f4] rounded-full transition-all">
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="p-2 text-[#8d969e] hover:text-[#e23b4a] hover:bg-[#f4f4f4] rounded-full transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="w-px h-5 bg-[#c9c9cd] mx-1" />
              {expanded.includes(parent.id) ? <ChevronDown className="h-4 w-4 text-[#8d969e]" /> : <ChevronRight className="h-4 w-4 text-[#8d969e]" />}
            </div>
          </div>

          {/* Children Section */}
          {expanded.includes(parent.id) && (
            <div className="p-4 bg-[#f4f4f4] space-y-2">
              {parent.children?.map((child) => (
                <div key={child.id} className="flex items-center justify-between bg-white p-4 rounded-[12px] border border-[#c9c9cd] hover:border-[#494fdf] transition-all group/child">
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-4 w-4 text-[#c9c9cd] hidden group-hover/child:block cursor-grab" />
                    {child.icon && child.icon.includes('/') ? (
                      <img
                        src={child.icon}
                        alt={child.name}
                        className="h-9 w-9 rounded-[8px] object-cover border-2 border-[#191c1f]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-9 w-9 rounded-[8px] flex items-center justify-center text-lg border-2 border-[#191c1f] ${child.icon && child.icon.includes('/') ? 'hidden' : ''}`}
                      style={{ backgroundColor: child.color + '20' }}
                    >
                      {child.icon && !child.icon.includes('/') ? child.icon : child.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium uppercase tracking-wide text-[#191c1f]">{child.name}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${child.type === 'expense' ? 'bg-[#f4f4f4] border-[#c9c9cd] text-[#e23b4a]' : 'bg-[#f4f4f4] border-[#c9c9cd] text-[#00a87e]'
                      }`}>
                      {child.type === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-sm border border-[#c9c9cd]" style={{ backgroundColor: child.color }} />
                    <span className="text-[10px] font-mono text-[#8d969e] uppercase tracking-wider hidden md:block">{child.color}</span>
                    <button className="p-1.5 text-[#8d969e] hover:text-[#494fdf] hover:bg-[#f4f4f4] rounded-full transition-all">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 text-[#8d969e] hover:text-[#e23b4a] hover:bg-[#f4f4f4] rounded-full transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Child Form */}
              {addingChildTo === parent.id ? (
                <div className="bg-white border-2 border-[#494fdf] rounded-[20px] p-6 space-y-4">
                  <p className="text-[10px] font-medium text-[#494fdf] uppercase tracking-wider flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Danh mục con mới trong: <strong>{parent.name}</strong>
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <input
                          value={newChild.icon}
                          onChange={e => setNewChild(p => ({ ...p, icon: e.target.value }))}
                          placeholder="Tên file icon (VD: food.png)"
                          className="w-40 px-4 py-2.5 text-sm rounded-[12px] border border-[#c9c9cd] bg-[#f4f4f4] focus:outline-none focus:border-[#494fdf] font-medium"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                        {newChild.icon && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[9px] text-[#8d969e] uppercase">Preview:</span>
                            <img
                              src={`/ICON/${newChild.icon}`}
                              alt="preview"
                              className="h-8 w-8 rounded-lg object-cover border border-[#c9c9cd]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = '0.3';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <input
                        autoFocus
                        value={newChild.name}
                        onChange={e => setNewChild(p => ({ ...p, name: e.target.value }))}
                        placeholder="Tên danh mục..."
                        className="flex-1 px-6 py-2.5 rounded-[12px] border border-[#c9c9cd] bg-white focus:outline-none focus:border-[#494fdf] font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center gap-1">
                        <Palette className="h-3 w-3" /> Chọn màu
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {COLOR_PALETTE.map(c => (
                          <button
                            key={c}
                            onClick={() => setNewChild(p => ({ ...p, color: c }))}
                            className={`w-7 h-7 rounded-full border-2 transition-all ${newChild.color === c ? 'scale-110 border-[#191c1f]' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                        <label className="w-7 h-7 rounded-full border-2 border-dashed border-[#c9c9cd] flex items-center justify-center cursor-pointer hover:border-[#494fdf] transition-colors">
                          <Palette className="h-3.5 w-3.5 text-[#8d969e]" />
                          <input type="color" className="sr-only" onChange={e => setNewChild(p => ({ ...p, color: e.target.value }))} />
                        </label>
                      </div>
                    </div>

                    {/* Type selector */}
                    <div className="flex gap-3">
                      {([['expense', 'Chi tiêu', TrendingDown], ['income', 'Thu nhập', TrendingUp]] as const).map(([val, label, Icon]) => (
                        <button
                          key={val}
                          onClick={() => setNewChild(p => ({ ...p, type: val }))}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border-2 text-xs font-medium uppercase tracking-wider transition-all ${newChild.type === val
                              ? val === 'expense'
                                ? 'border-[#e23b4a] bg-white text-[#e23b4a]'
                                : 'border-[#00a87e] bg-white text-[#00a87e]'
                              : 'border-[#c9c9cd] text-[#8d969e] bg-[#f4f4f4]'
                            }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <Icon className="h-4 w-4" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setAddingChildTo(null)} className="flex-1 py-2.5 bg-[#f4f4f4] text-[#8d969e] rounded-full font-medium text-xs uppercase tracking-wider hover:bg-[#e5e5e5] transition-all flex items-center justify-center gap-2">
                      <X className="h-4 w-4" /> Hủy
                    </button>
                    <button onClick={() => confirmAddChild(parent.id)} className="flex-[2] py-2.5 bg-[#191c1f] text-white rounded-full font-medium text-xs uppercase tracking-wider hover:bg-[#2d3033] transition-all flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" /> Lưu danh mục
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startAddChild(parent.id, parent.type)}
                  className="w-full py-4 border-2 border-dashed border-[#c9c9cd] rounded-[12px] text-[10px] font-medium text-[#8d969e] uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#494fdf] hover:text-[#494fdf] hover:bg-[#f4f4f4] transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Plus className="h-4 w-4" /> Thêm danh mục con vào "{parent.name}"
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add Parent Button */}
      <button className="w-full py-4 border-2 border-dashed border-[#c9c9cd] rounded-[12px] text-base font-medium text-[#8d969e] uppercase tracking-wider flex items-center justify-center gap-3 hover:border-[#494fdf] hover:text-[#191c1f] hover:bg-[#f4f4f4] transition-all group"
        style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="h-10 w-10 rounded-full bg-[#f4f4f4] flex items-center justify-center group-hover:bg-[#191c1f] group-hover:text-white transition-colors">
          <Plus className="h-5 w-5" />
        </div>
        Thêm danh mục cha mới
      </button>
    </div>
  );
}
