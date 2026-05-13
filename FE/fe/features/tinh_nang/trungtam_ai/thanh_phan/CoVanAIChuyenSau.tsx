'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Loader2,
  RefreshCw,
  ChevronDown,
  TrendingUp,
  PiggyBank,
  Target,
  AlertTriangle,
  Lightbulb,
  Calendar,
  DollarSign,
  BarChart3,
  MessageSquare,
  ArrowRight,
  GripVertical,
  Bell,
  BellOff,
  Wallet,
  PieChart,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { FadeIn, SlideUp } from '@/thanh_phan/animation';
import { useToast } from '@/thanh_phan/animation/Toast';
import { useRouter } from 'next/navigation';
import { geminiChat } from '@/services/ai/gemini';
import type { GeminiChatMessage, GeminiChatResponse, GeminiGoiYHanDong, GeminiDuLieuBieuDo, GeminiDuLieuDanhSach, GeminiMucDanhSach } from '@/types/GeminiAI';
import BieuDoAI from './BieuDoAI';

interface CoVanAIProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'TEXT' | 'SUGGESTION' | 'ACTION' | 'WARNING' | 'LIST';
  actions?: GeminiGoiYHanDong[];
  duLieuBieuDo?: GeminiDuLieuBieuDo;
  duLieuDanhSach?: DuLieuDanhSach;
}

interface DuLieuDanhSach {
  tieuDe: string;
  loai: 'THONG_BAO' | 'GIAO_DICH' | 'TAI_KHOAN' | 'NGAN_SACH' | 'MUC_TIEU' | 'CANH_BAO' | 'GOI_Y' | 'KHAC';
  cacMuc: MucDanhSach[];
}

interface MucDanhSach {
  tieuDe: string;
  moTa?: string;
  giaTri?: string;
  ngay?: string;
  trangThai?: string;
  icon?: string;
  mauSac?: string;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  type: 'TU_DO' | 'PHAN_TICH_CHI_TIEU' | 'GOI_Y_TIET_KIEM' | 'LAP_KHOACH_TAI_CHINH' | 'TRA_LOI_CAU_HOI';
}

const quickActions: QuickAction[] = [
  {
    id: 'phan-tich',
    icon: <BarChart3 className="h-5 w-5" />,
    label: 'Phân tích chi tiêu',
    prompt: 'Hãy phân tích chi tiêu tháng này của tôi và đưa ra nhận xét.',
    type: 'PHAN_TICH_CHI_TIEU'
  },
  {
    id: 'bieu-do',
    icon: <BarChart3 className="h-5 w-5" />,
    label: 'Xem biểu đồ chi tiêu',
    prompt: 'Hãy tạo biểu đồ tròn cho thấy chi tiêu theo danh mục của tôi trong tháng này.',
    type: 'TU_DO'
  },
  {
    id: 'tiet-kiem',
    icon: <PiggyBank className="h-5 w-5" />,
    label: 'Gợi ý tiết kiệm',
    prompt: 'Tôi muốn tiết kiệm nhiều hơn. Bạn có gợi ý gì không?',
    type: 'GOI_Y_TIET_KIEM'
  },
  {
    id: 'ke-hoach',
    icon: <Target className="h-5 w-5" />,
    label: 'Lập kế hoạch',
    prompt: 'Giúp tôi lập kế hoạch tài chính ngắn hạn và dài hạn.',
    type: 'LAP_KHOACH_TAI_CHINH'
  },
  {
    id: 'tu-van',
    icon: <Lightbulb className="h-5 w-5" />,
    label: 'Tư vấn đầu tư',
    prompt: 'Với thu nhập hiện tại, tôi nên đầu tư gì để sinh lời?',
    type: 'TRA_LOI_CAU_HOI'
  }
];

export default function CoVanAIChuyenSau({ isOpen, onClose }: CoVanAIProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Resize state
  const [chatSize, setChatSize] = useState({ width: 900, height: 700 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: chatSize.width,
      height: chatSize.height
    };
  }, [chatSize]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      
      setChatSize({
        width: Math.max(500, Math.min(1400, resizeStart.current.width + deltaX)),
        height: Math.max(400, Math.min(900, resizeStart.current.height + deltaY))
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Xin chào! 👋 Tôi là **Cố Vấn Tài Chính AI** của bạn.

Tôi có thể giúp bạn:
- 📊 Phân tích chi tiêu chi tiết
- 💰 Đưa ra gợi ý tiết kiệm cụ thể
- 🎯 Lập kế hoạch tài chính dài hạn
- 📈 Tư vấn đầu tư phù hợp

**Hãy hỏi tôi bất cứ điều gì về tài chính của bạn!**`,
        timestamp: new Date(),
        type: 'TEXT'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const sendMessage = async (text: string, type: QuickAction['type'] = 'TU_DO') => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowQuickActions(false);

    const history: GeminiChatMessage[] = messages.slice(-10).map(m => ({
      vaiTro: m.role === 'user' ? 'user' : 'model',
      noiDung: m.content
    }));

    try {
      const response = await geminiChat(text, history, type);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.phanHoi,
        timestamp: new Date(),
        type: response.loaiPhanHoi as ChatMessage['type'],
        actions: response.goiYHanDong,
        duLieuBieuDo: response.duLieuBieuDo,
        duLieuDanhSach: response.duLieuDanhSach
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Lỗi chat:', error);
      
      let errorMessage = 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn.';
      if (error.status === 401) {
        toast({
          title: "Phiên hết hạn",
          description: "Đang chuyển về đăng nhập...",
          type: "error"
        });
        router.push('/DangNhap?session=expired');
        router.refresh();
        return;
      } else if (error.status === 403) {
        errorMessage = 'Bạn không có quyền sử dụng tính năng này.';
      }

      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        type: 'WARNING'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt, action.type);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'WARNING':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100';
      case 'ACTION':
        return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100';
      case 'SUGGESTION':
        return 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case 'TAO_NGAN_SACH':
        return <PiggyBank className="h-4 w-4" />;
      case 'THEM_GIAO_DICH':
        return <DollarSign className="h-4 w-4" />;
      case 'XEM_BAO_CAO':
        return <BarChart3 className="h-4 w-4" />;
      case 'TAO_MUC_TIEU':
        return <Target className="h-4 w-4" />;
      case 'DAU_TU':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  const getListIcon = (icon?: string) => {
    switch (icon?.toLowerCase()) {
      case 'bell':
      case 'thongbao':
        return <Bell className="h-4 w-4" />;
      case 'bell-off':
      case 'chua-doc':
        return <BellOff className="h-4 w-4" />;
      case 'wallet':
      case 'taikhoan':
        return <Wallet className="h-4 w-4" />;
      case 'pie-chart':
      case 'ngansach':
        return <PieChart className="h-4 w-4" />;
      case 'arrow-down':
      case 'thu':
        return <ArrowDown className="h-4 w-4" />;
      case 'arrow-up':
      case 'chi':
        return <ArrowUp className="h-4 w-4" />;
      case 'alert-triangle':
      case 'canhbao':
        return <AlertTriangle className="h-4 w-4" />;
      case 'lightbulb':
      case 'goiy':
        return <Lightbulb className="h-4 w-4" />;
      case 'target':
      case 'muctieu':
        return <Target className="h-4 w-4" />;
      case 'check-circle':
        return <CheckCircle className="h-4 w-4" />;
      case 'alert-circle':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getListColor = (color?: string) => {
    switch (color?.toLowerCase()) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'green':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'indigo':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'gray':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
    }
  };

  // Parse structured content: ##TIEUDE##, ###SUBTIEUDE###, -ITEM~, NUMBER.
  const parseContent = (content: string) => {
    const parts: { type: 'title' | 'subtitle' | 'item' | 'numbered' | 'quote' | 'text'; content: string }[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('##TIEUDE##')) {
        parts.push({ type: 'title', content: trimmed.replace('##TIEUDE##', '').trim() });
      } else if (trimmed.startsWith('###SUBTIEUDE###')) {
        parts.push({ type: 'subtitle', content: trimmed.replace('###SUBTIEUDE###', '').trim() });
      } else if (trimmed.startsWith('-ITEM~')) {
        parts.push({ type: 'item', content: trimmed.replace('-ITEM~', '').trim() });
      } else if (/^NUMBER\./.test(trimmed)) {
        parts.push({ type: 'numbered', content: trimmed.replace(/^NUMBER\./, '').trim() });
      } else if (trimmed.startsWith('>')) {
        parts.push({ type: 'quote', content: trimmed.replace(/^>\s*/, '').trim() });
      } else {
        parts.push({ type: 'text', content: trimmed });
      }
    }

    return parts;
  };

  const renderStructuredContent = (content: string) => {
    const parts = parseContent(content);

    return (
      <div className="space-y-2">
        {parts.map((part, idx) => {
          switch (part.type) {
            case 'title':
              return (
                <p key={idx} className="text-base font-bold text-indigo-700 dark:text-indigo-300 mt-3 first:mt-0">
                  {part.content}
                </p>
              );
            case 'subtitle':
              return (
                <p key={idx} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-2">
                  {part.content}
                </p>
              );
            case 'item':
              return (
                <p key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 pl-3 border-l-2 border-zinc-200 dark:border-zinc-700">
                  {part.content}
                </p>
              );
            case 'numbered':
              return (
                <p key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 pl-4">
                  {part.content}
                </p>
              );
            case 'quote':
              return (
                <p key={idx} className="text-xs italic text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded border-l-2 border-amber-300 dark:border-amber-700">
                  {part.content}
                </p>
              );
            default:
              return (
                <p key={idx} className="text-sm text-zinc-600 dark:text-zinc-400">
                  {part.content}
                </p>
              );
          }
        })}
      </div>
    );
  };

  const renderDanhSach = (danhSach: DuLieuDanhSach) => {
    return (
      <div className="space-y-2 mt-2">
        {danhSach.cacMuc.map((muc, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
          >
            <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${getListColor(muc.mauSac)}`}>
              {getListIcon(muc.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {muc.tieuDe}
                </p>
                {muc.giaTri && (
                  <span className={`shrink-0 text-sm font-semibold ${
                    muc.giaTri.startsWith('+') ? 'text-emerald-600' :
                    muc.giaTri.startsWith('-') ? 'text-red-600' : 'text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {muc.giaTri}
                  </span>
                )}
              </div>
              {muc.moTa && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                  {muc.moTa}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                {muc.ngay && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {muc.ngay}
                  </span>
                )}
                {muc.trangThai && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                    muc.trangThai.includes('Chưa') || muc.trangThai.includes('Cao') || muc.trangThai.includes('Thấp')
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500'
                  }`}>
                    {muc.trangThai}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <FadeIn>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div 
          ref={chatContainerRef}
          className={`relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ${isResizing ? 'select-none' : ''}`}
          style={{ 
            width: `${chatSize.width}px`,
            height: `${chatSize.height}px`,
            maxWidth: '95vw',
            maxHeight: '95vh'
          }}
        >
          
          {/* Resize Handle - Bottom Right Corner */}
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-10 flex items-center justify-center"
            onMouseDown={handleResizeStart}
          >
            <GripVertical className="h-5 w-5 text-zinc-300 dark:text-zinc-600 hover:text-indigo-400 transition-colors" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-white font-bold text-base">Cố Vấn NVIDIA Nemotron 3 Super</h2>
                <p className="text-indigo-200 text-xs">Chuyên gia tài chính 24/7</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <SlideUp delay={0.1}>
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chọn một chủ đề hoặc hỏi tự do
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all group"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </SlideUp>
          )}

          {/* Messages - Scrollable */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/50 scroll-smooth"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg) => (
              <SlideUp key={msg.id} delay={0.05}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      }`}>
                        {msg.role === 'user' ? (
                          <span className="text-xs font-bold">B</span>
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>
                        <div className="space-y-2">
                        <div className={`px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-md'
                            : `${getMessageStyle(msg.type)} rounded-tl-md`
                        }`}>
                          <div className="text-sm leading-relaxed">
                            {msg.role === 'assistant' && msg.content.includes('##TIEUDE##')
                              ? renderStructuredContent(msg.content)
                              : <p className="whitespace-pre-wrap">{msg.content}</p>
                            }
                          </div>
                        </div>

                        {/* Danh sách đẹp */}
                        {msg.type === 'LIST' && msg.duLieuDanhSach && (
                          renderDanhSach(msg.duLieuDanhSach)
                        )}

                        {/* Biểu đồ nếu có */}
                        {msg.duLieuBieuDo && (
                          <BieuDoAI duLieu={msg.duLieuBieuDo} />
                        )}

                        {/* Action buttons */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {msg.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendMessage(action.noiDung, 'TU_DO')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                              >
                                {getActionIcon(action.hanhDong)}
                                <span>{action.hanhDong.replace(/_/g, ' ')}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <p className={`text-[10px] text-zinc-400 ${msg.role === 'user' ? 'text-right' : ''}`}>
                          {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <SlideUp>
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                      <span className="text-sm text-zinc-500">AI đang suy nghĩ...</span>
                    </div>
                  </div>
                </div>
              </SlideUp>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về tài chính của bạn..."
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm outline-none focus:border-indigo-400 dark:focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all placeholder:text-zinc-400"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-2xl font-medium text-sm transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Gửi
                  </>
                )}
              </button>
            </div>
            
            {/* Suggestions when input is empty */}
            {!inputValue && !isLoading && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setInputValue('Tình hình tài chính tháng này của tôi như thế nào?')}
                  className="shrink-0 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Phân tích chi tiêu
                </button>
                <button
                  onClick={() => setInputValue('Top 3 danh mục chi tiêu nhiều nhất của tôi là gì?')}
                  className="shrink-0 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Top chi tiêu
                </button>
                <button
                  onClick={() => setInputValue('Tôi nên tiết kiệm bao nhiêu % thu nhập?')}
                  className="shrink-0 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Tỷ lệ tiết kiệm
                </button>
                <button
                  onClick={() => setInputValue('Gợi ý đầu tư cho người mới bắt đầu')}
                  className="shrink-0 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-600 dark:text-zinc-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Đầu tư
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
