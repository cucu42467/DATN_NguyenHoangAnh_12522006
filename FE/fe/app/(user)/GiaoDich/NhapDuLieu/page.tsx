"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Construction, Camera, Sparkles, Zap, FileSpreadsheet } from 'lucide-react';

export default function NhapDuLieuCSVPage() {
  const features = [
    {
      icon: Camera,
      title: 'Nhận diện hóa đơn',
      description: 'Chụp ảnh hóa đơn, AI tự động trích xuất số tiền, ngày tháng và tên cửa hàng',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: Sparkles,
      title: 'Phân loại tự động',
      description: 'AI phân tích mô tả giao dịch và tự động gán danh mục chính xác đến 98%',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Zap,
      title: 'Xử lý hàng loạt',
      description: 'Import đồng thời hàng trăm giao dịch từ file Excel, CSV của ngân hàng',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      icon: FileSpreadsheet,
      title: 'Đồng bộ ngân hàng',
      description: 'Tự động đồng bộ lịch sử giao dịch từ các ngân hàng Vietcombank, Techcombank...',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  ];

  return (
    <div className="fe-page-shell">
      {/* Nút quay lại */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link 
          href="/GiaoDich" 
          className="inline-flex items-center gap-2 text-sm font-black text-zinc-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>
      </div>

      {/* Thông báo đang phát triển */}
      <div className="max-w-4xl mx-auto">
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
                  Nhập dữ liệu giao dịch bằng AI
                </p>
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-8">
            <p className="text-amber-800 dark:text-amber-200 text-center mb-8 max-w-2xl mx-auto">
              Chúng tôi đang xây dựng tính năng nhập dữ liệu thông minh bằng AI. 
              Dưới đây là những gì bạn sẽ có thể làm khi tính năng hoàn thiện:
            </p>

            {/* Grid tính năng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
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

            {/* Thống kê dự kiến */}
            <div className="mt-8 bg-white/60 dark:bg-zinc-900/30 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30">
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider mb-4">
                Tiết kiệm thời gian
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400">~15 phút</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">mỗi ngày</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400">98%</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">độ chính xác</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-600 dark:text-amber-400">1000+</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">giao dịch/lần</p>
                </div>
              </div>
            </div>

            {/* Nút quay lại */}
            <div className="mt-8 text-center">
              <Link 
                href="/GiaoDich" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại trang giao dịch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
