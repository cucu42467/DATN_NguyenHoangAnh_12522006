"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  BrainCircuit,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Zap,
  Lock,
  BarChart3,
  Bell,
  RefreshCw,
  Lightbulb,
  Construction
} from 'lucide-react';
import { CoVanAIChuyenSau, GeminiPhanTich, BieuDoDuDoan, LoiKhuyenAI } from '@/features/tinh_nang/trungtam_ai/thanh_phan';
import { FadeIn } from '@/components/animation';
import { layThongBao, laySoLuongChuaDoc, ThongBaoDto } from '@/services/thongbao';
import { goiApiPost } from '@/thu_vien/goi_api';

type TabType = 'du-doan' | 'phan-tich' | 'chat';

export default function TrungTamAIPage() {
  const [activeTab, setActiveTab] = useState<TabType>('phan-tich');
  const [isCoVanAIOpen, setIsCoVanAIOpen] = useState(false);
  const [thongBaos, setThongBaos] = useState<ThongBaoDto[]>([]);
  const [soLuongChuaDoc, setSoLuongChuaDoc] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);

  // Tải thông báo
  const taiThongBao = useCallback(async () => {
    try {
      const [data, count] = await Promise.all([
        layThongBao(1, 20),
        laySoLuongChuaDoc()
      ]);
      setThongBaos(data);
      setSoLuongChuaDoc(count);
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    }
  }, []);

  useEffect(() => {
    taiThongBao();
  }, [taiThongBao]);

  // Tạo dữ liệu AI và thông báo
  const handleTaoDuLieuAI = async () => {
    try {
      setIsGenerating(true);
      setGenerationMessage('Đang tạo dữ liệu AI...');
      const response = await goiApiPost<any>('/api/ai/tao-du-lieu', {});
      if (response?.success) {
        setGenerationMessage(`Đã tạo ${response.message}`);
        await taiThongBao();
      } else {
        setGenerationMessage(response?.message || 'Có lỗi xảy ra');
      }
      setTimeout(() => setGenerationMessage(null), 3000);
    } catch (err) {
      console.error('Lỗi khi tạo dữ liệu AI:', err);
      setGenerationMessage('Lỗi kết nối');
      setTimeout(() => setGenerationMessage(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const thongBaoMoi = thongBaos.filter(tb => !tb.daDoc).slice(0, 5);

  const tabs = [
    { id: 'du-doan', label: 'Dự Đoán', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'phan-tich', label: 'Phân Tích AI', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'chat', label: 'Hỏi Đáp', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const openCoVanAI = () => {
    setIsCoVanAIOpen(true);
    setActiveTab('chat');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fe-page-shell animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div className="flex items-center gap-8">
           <div className="p-6 bg-indigo-600 text-white rounded-[2.5rem] border border-indigo-500/30 relative">
              <BrainCircuit className="h-12 w-12" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white dark:border-zinc-900 animate-ping"></div>
           </div>
           <div>
              <h1 className="text-5xl font-medium text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-3">Trung Tâm AI Insights</h1>
              <div className="flex items-center gap-3">
                 <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 uppercase tracking-wider text-[10px] font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Phân tích bởi NVIDIA Nemotron 3 Super
                 </p>
                 <span className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></span>
                 <p className="text-indigo-600 text-[10px] uppercase tracking-wider font-medium animate-pulse">System Active</p>
              </div>
           </div>
        </div>
        <button 
          onClick={openCoVanAI}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[2.5rem] text-xs font-medium border border-indigo-500/30 hover:opacity-90 transition-all flex items-center gap-3 group shadow-lg shadow-indigo-500/30"
        >
           <Sparkles className="h-5 w-5 text-amber-400" /> HỎI ĐÁP AI CHUYÊN SÂU <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <FadeIn>
        {activeTab === 'du-doan' && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Construction className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Tính Năng Đang Phát Triển
                  </h1>
                  <p className="text-amber-100">
                    Dự đoán chi tiêu bằng AI
                  </p>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-8">
              <p className="text-amber-800 dark:text-amber-200 text-center mb-8 max-w-2xl mx-auto">
                Chúng tôi đang xây dựng tính năng dự đoán chi tiêu bằng AI. 
                Dưới đây là những gì bạn sẽ có thể làm khi tính năng hoàn thiện:
              </p>

              {/* Grid tính năng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: TrendingUp, title: 'Dự đoán xu hướng', description: 'AI phân tích lịch sử chi tiêu và dự đoán chi tiêu tháng tới dựa trên xu hướng hiện tại', color: 'bg-blue-100 text-blue-600' },
                  { icon: BarChart3, title: 'Biểu đồ dự báo', description: 'Trực quan hóa chi tiêu thực tế và dự đoán trên cùng biểu đồ để bạn so sánh dễ dàng', color: 'bg-purple-100 text-purple-600' },
                  { icon: Lightbulb, title: 'Cảnh báo vượt ngân sách', description: 'Nhận thông báo khi dự đoán cho thấy bạn có thể vượt ngân sách trong tháng', color: 'bg-emerald-100 text-emerald-600' },
                  { icon: Sparkles, title: 'Độ chính xác cao', description: 'Độ chính xác dự đoán tăng theo thời gian khi AI học được thói quen chi tiêu của bạn', color: 'bg-amber-100 text-amber-600' },
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-white/80 dark:bg-zinc-900/50 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phan-tich' && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Construction className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Tính Năng Đang Phát Triển
                  </h1>
                  <p className="text-amber-100">
                    Phân tích thông minh bằng AI
                  </p>
                </div>
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-8">
              <p className="text-amber-800 dark:text-amber-200 text-center mb-8 max-w-2xl mx-auto">
                Chúng tôi đang xây dựng tính năng phân tích thông minh bằng AI. 
                Dưới đây là những gì bạn sẽ có thể làm khi tính năng hoàn thiện:
              </p>

              {/* Grid tính năng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: TrendingUp, title: 'Dự đoán xu hướng', description: 'AI phân tích lịch sử chi tiêu và dự đoán xu hướng tài chính của bạn trong tương lai', color: 'bg-blue-100 text-blue-600' },
                  { icon: BarChart3, title: 'Phân tích chi tiết', description: 'Trực quan hóa dữ liệu tài chính với biểu đồ thông minh giúp bạn hiểu rõ hơn về thói quen chi tiêu', color: 'bg-purple-100 text-purple-600' },
                  { icon: Lightbulb, title: 'Gợi ý tiết kiệm', description: 'AI đề xuất các khoản có thể cắt giảm dựa trên phân tích thói quen chi tiêu của bạn', color: 'bg-emerald-100 text-emerald-600' },
                  { icon: Sparkles, title: 'Cảnh báo thông minh', description: 'Nhận thông báo kịp thời khi có dấu hiệu chi tiêu bất thường hoặc ngân sách sắp vượt', color: 'bg-amber-100 text-amber-600' },
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-white/80 dark:bg-zinc-900/50 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-16 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="h-48 w-48 text-white" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-medium text-white mb-3">
                Cố Vấn NVIDIA Nemotron 3 Super
              </h3>
              <p className="text-indigo-200 mb-8 max-w-md mx-auto">
                Hỏi về bất kỳ kế hoạch tài chính nào, AI sẽ phân tích dựa trên dữ liệu thật của bạn và đưa ra lời khuyên cá nhân hóa.
              </p>
              <button 
                onClick={() => setIsCoVanAIOpen(true)}
                className="px-10 py-5 bg-white text-indigo-600 rounded-[2.5rem] text-sm font-semibold hover:bg-indigo-50 transition flex items-center gap-3 mx-auto shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                Bắt Đầu Trò Chuyện Ngay
              </button>
            </div>
          </div>
        )}
      </FadeIn>

      {/* Co Van AI Chat Modal */}
      <CoVanAIChuyenSau 
        isOpen={isCoVanAIOpen} 
        onClose={() => setIsCoVanAIOpen(false)} 
      />
    </div>
  );
}
