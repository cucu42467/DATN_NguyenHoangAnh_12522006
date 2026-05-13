"use client";

import { FadeIn } from '@/components/animation';
import QuanLyDanhMuc from '@/features/danhmuc/thanh_phan/QuanLyDanhMuc';

export default function DanhMucPage() {
  return (
    <div className="fe-page-shell space-y-8">
      {/* Hero Section */}
      <FadeIn>
        <section className="fe-card-fe p-8 space-y-4">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              Quản lý danh mục
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
              Sắp xếp danh mục thông minh
            </h1>
            <p className="max-w-2xl text-base text-gray-500 leading-relaxed">
              Tổ chức nhóm thu chi theo cấu trúc gọn gàng. Sử dụng bề mặt phẳng, khoảng cách rộng và biểu tượng rõ ràng để quản lý danh mục trở nên dễ dàng và hiệu quả.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* Danh sách danh mục */}
      <QuanLyDanhMuc />
    </div>
  );
}
