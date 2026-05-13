"use client";

import React, { useState, useEffect } from 'react';
import {
  Bot, Plus, Edit3, Trash2, Search, CheckCircle2, XCircle,
  Key, Globe, Cpu, Eye, EyeOff, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';

import {
  layTatCaAiModel,
  taoAiModel,
  capNhatAiModel,
  xoaAiModel
} from '@/services/ai';
import type { AiModelType } from '@/kieu_du_lieu/TrungTamAI';

const MUC_DICH_OPTIONS = [
  { value: 'chat', label: 'Chat' },
  { value: 'canh_bao', label: 'Cảnh báo' },
  { value: 'phan_tich_chi_tieu', label: 'Phân tích chi tiêu' },
  { value: 'goi_y_tiet_kiem', label: 'Gợi ý tiết kiệm' },
];

const PROVIDER_OPTIONS = [
  { value: 'OpenAI', label: 'OpenAI' },
  { value: 'Anthropic', label: 'Anthropic (Claude)' },
  { value: 'OpenRouter', label: 'OpenRouter' },
  { value: 'Google', label: 'Google (Gemini)' },
];

interface Props {
  onRefresh?: () => void;
}

export default function BangQuanLyAiModel({ onRefresh }: Props) {
  const [models, setModels] = useState<AiModelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModelType | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AiModelType>>({
    tenModel: '',
    mucDich: 'chat',
    provider: 'OpenRouter',
    apiUrl: '',
    apiKey: '',
    trangThai: 1,
  });

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await layTatCaAiModel();
      setModels(data);
    } catch (error) {
      console.error('Lỗi tải AI Model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (model?: AiModelType) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        tenModel: model.tenModel,
        mucDich: model.mucDich || 'chat',
        provider: model.provider || 'OpenRouter',
        apiUrl: model.apiUrl || '',
        apiKey: model.apiKey || '',
        trangThai: model.trangThai,
      });
    } else {
      setEditingModel(null);
      setFormData({
        tenModel: '',
        mucDich: 'chat',
        provider: 'OpenRouter',
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: '',
        trangThai: 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModel(null);
    setFormData({
      tenModel: '',
      mucDich: 'chat',
      provider: 'OpenRouter',
      apiUrl: '',
      apiKey: '',
      trangThai: 1,
    });
  };

  const handleSave = async () => {
    if (!formData.tenModel?.trim()) {
      alert('Vui lòng nhập tên model');
      return;
    }

    try {
      setSaving(true);
      if (editingModel) {
        await capNhatAiModel(editingModel.modelId, formData);
      } else {
        await taoAiModel(formData);
      }
      handleCloseModal();
      fetchModels();
      onRefresh?.();
    } catch (error) {
      console.error('Lỗi lưu AI Model:', error);
      alert('Lỗi khi lưu AI Model');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa model này?')) return;
    try {
      await xoaAiModel(id);
      fetchModels();
      onRefresh?.();
    } catch (error) {
      console.error('Lỗi xóa AI Model:', error);
      alert('Lỗi khi xóa AI Model');
    }
  };

  const toggleStatus = async (model: AiModelType) => {
    const newStatus = model.trangThai === 1 ? 0 : 1;
    try {
      await capNhatAiModel(model.modelId, { ...model, trangThai: newStatus });
      fetchModels();
      onRefresh?.();
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  const toggleShowApiKey = (id: number) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskApiKey = (key?: string) => {
    if (!key) return 'Chưa có API Key';
    if (key.length <= 8) return '***';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  const filteredModels = models.filter(m =>
    m.tenModel.toLowerCase().includes(search.toLowerCase()) ||
    m.provider?.toLowerCase().includes(search.toLowerCase()) ||
    m.mucDich?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 group-hover:rotate-12 transition-transform">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">Tổng số</span>
            <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{models.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500 group-hover:rotate-12 transition-transform">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">Đang dùng</span>
            <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{models.filter(m => m.trangThai === 1).length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:rotate-12 transition-transform">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1 opacity-60 italic">Đã tắt</span>
            <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tighter italic">{models.filter(m => m.trangThai === 0).length}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm kiếm model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-8 py-4 rounded-[2rem] bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-indigo-500/30"
        >
          <Plus className="h-5 w-5" />
          Thêm Model Mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="text-left px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Model</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mục đích</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Provider</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">API URL</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">API Key</th>
                <th className="text-center px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trạng thái</th>
                <th className="text-center px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <Bot className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500">Chưa có AI Model nào</p>
                    <button
                      onClick={() => handleOpenModal()}
                      className="mt-4 px-6 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium transition-colors"
                    >
                      Thêm model đầu tiên
                    </button>
                  </td>
                </tr>
              ) : filteredModels.map((model) => (
                <tr key={model.modelId} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">{model.tenModel}</p>
                        <p className="text-xs text-zinc-400">ID: {model.modelId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-2 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {MUC_DICH_OPTIONS.find(m => m.value === model.mucDich)?.label || model.mucDich || 'Chat'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">{model.provider || '-'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">
                      {model.apiUrl || '-'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-300 font-mono">
                        {showApiKey[model.modelId] ? model.apiKey : maskApiKey(model.apiKey)}
                      </span>
                      {model.apiKey && (
                        <button
                          onClick={() => toggleShowApiKey(model.modelId)}
                          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          title={showApiKey[model.modelId] ? 'Ẩn' : 'Hiện'}
                        >
                          {showApiKey[model.modelId] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => toggleStatus(model)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        model.trangThai === 1
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950'
                          : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800'
                      }`}
                    >
                      {model.trangThai === 1 ? 'Đang dùng' : 'Đã tắt'}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(model)}
                        className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Sửa"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(model.modelId)}
                        className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <Bot className="h-6 w-6 text-indigo-500" />
                  {editingModel ? 'Sửa AI Model' : 'Thêm AI Model Mới'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <XCircle className="h-6 w-6 text-zinc-400" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Tên Model */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Tên Model <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tenModel}
                  onChange={e => setFormData({ ...formData, tenModel: e.target.value })}
                  placeholder="Ví dụ: gpt-4o, claude-3-sonnet, nvidia/nemotron-3..."
                  className="w-full px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm"
                />
              </div>

              {/* Mục đích */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Mục đích sử dụng
                </label>
                <select
                  value={formData.mucDich}
                  onChange={e => setFormData({ ...formData, mucDich: e.target.value })}
                  className="w-full px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm"
                >
                  {MUC_DICH_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Provider (Nhà cung cấp)
                </label>
                <select
                  value={formData.provider}
                  onChange={e => {
                    const provider = e.target.value;
                    let defaultUrl = '';
                    if (provider === 'OpenRouter') {
                      defaultUrl = 'https://openrouter.ai/api/v1/chat/completions';
                    } else if (provider === 'OpenAI') {
                      defaultUrl = 'https://api.openai.com/v1/chat/completions';
                    } else if (provider === 'Anthropic') {
                      defaultUrl = 'https://api.anthropic.com/v1/messages';
                    } else if (provider === 'Google') {
                      defaultUrl = 'https://generativelanguage.googleapis.com/v1beta';
                    }
                    setFormData({ ...formData, provider, apiUrl: defaultUrl || formData.apiUrl });
                  }}
                  className="w-full px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm"
                >
                  {PROVIDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* API URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  API URL
                </label>
                <input
                  type="text"
                  value={formData.apiUrl}
                  onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-mono"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-mono"
                />
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Nên mã hóa API Key trước khi lưu vào database
                </p>
              </div>

              {/* Trạng thái */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, trangThai: formData.trangThai === 1 ? 0 : 1 })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    formData.trangThai === 1 ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    formData.trangThai === 1 ? 'left-7' : 'left-1'
                  }`} />
                </button>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {formData.trangThai === 1 ? 'Đang hoạt động' : 'Đã tắt'}
                </span>
              </div>
            </div>

            <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-8 py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
