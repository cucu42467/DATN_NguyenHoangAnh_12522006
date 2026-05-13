"use client";

import { FileText, Shield, Scale, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/thanh_phan/ui/Button';
import { useRouter } from 'next/navigation';

export default function DieuKhoanDichVuPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-5">
          <FileText className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-revolut-dark">
          Điều khoản dịch vụ
        </h1>
        <p className="text-base text-revolut-muted mt-3">
          Cập nhật lần cuối: Tháng 5 năm 2026
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Scale className="w-6 h-6 text-indigo-600" />
            1. Chấp nhận các điều khoản
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Bằng việc truy cập và sử dụng ứng dụng FinanceAI, bạn đồng ý tuân thủ và bị ràng buộc bởi 
            các Điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
            vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-600" />
            2. Mô tả dịch vụ
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            FinanceAI là ứng dụng quản lý tài chính cá nhân thông minh, cung cấp các tính năng:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Theo dõi thu chi cá nhân</li>
            <li>Đặt và quản lý mục tiêu tài chính</li>
            <li>Lập kế hoạch ngân sách</li>
            <li>Phân tích chi tiêu với AI</li>
            <li>Dự đoán xu hướng tài chính</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            3. Quyền sử dụng
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi cấp cho bạn quyền sử dụng ứng dụng với các điều kiện sau:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Bạn phải từ 16 tuổi trở lên để sử dụng dịch vụ</li>
            <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập</li>
            <li>Bạn đồng ý không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            <li>Bạn không được phép sao chép, sửa đổi hoặc phân phối lại phần mềm</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            4. Giới hạn trách nhiệm
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            FinanceAI không chịu trách nhiệm cho:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Các quyết định tài chính của người dùng dựa trên gợi ý của ứng dụng</li>
            <li>Thua lỗ tài chính phát sinh từ việc sử dụng dịch vụ</li>
            <li>Gián đoạn dịch vụ do lỗi kỹ thuật không nằm trong tầm kiểm soát</li>
            <li>Dữ liệu bị mất do sao lưu không đầy đủ từ phía người dùng</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Shield className="w-6 h-6 text-rose-600" />
            5. Quyền sở hữu trí tuệ
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Tất cả nội dung, tính năng và chức năng của ứng dụng FinanceAI, bao gồm nhưng không giới hạn ở 
            văn bản, đồ họa, logo, hình ảnh, clip âm thanh, clip video, mã nguồn và phần mềm, là tài sản 
            của FinanceAI và được bảo vệ bởi luật sở hữu trí tuệ.
          </p>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark">
            6. Sửa đổi điều khoản
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi reserve quyền sửa đổi các Điều khoản dịch vụ này bất cứ lúc nào. 
            Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng thông qua email hoặc 
            thông báo trong ứng dụng. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi 
            đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>
        </section>

        <section className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark">
            7. Liên hệ
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi qua:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Email: support@financeai.app</li>
            <li>Hotline: 1900 1234</li>
          </ul>
        </section>
      </div>

      <div className="pt-6">
        <Button
          variant="secondary"
          className="w-full h-12 text-base"
          onClick={() => router.back()}
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
}
