"use client";

import { Shield, Lock, Eye, Database, UserCheck, FileText, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ChinhSachBaoMatPage() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
          <Shield className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-revolut-dark">
          Chính sách bảo mật
        </h1>
        <p className="text-base text-revolut-muted mt-3">
          Cập nhật lần cuối: Tháng 5 năm 2026
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Lock className="w-6 h-6 text-emerald-600" />
            1. Thông tin chúng tôi thu thập
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            FinanceAI thu thập các thông tin sau để cung cấp dịch vụ tốt nhất cho bạn:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li><strong>Thông tin đăng ký:</strong> Họ tên, email, số điện thoại</li>
            <li><strong>Dữ liệu giao dịch:</strong> Thu chi, danh mục, ghi chú</li>
            <li><strong>Thông tin tài khoản:</strong> Số dư, lịch sử giao dịch</li>
            <li><strong>Dữ liệu sử dụng:</strong> Thiết bị, IP, thời gian truy cập</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-600" />
            2. Cách chúng tôi sử dụng thông tin
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi sử dụng thông tin của bạn để:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Cung cấp và duy trì dịch vụ quản lý tài chính</li>
            <li>Phân tích chi tiêu và đưa ra gợi ý thông minh</li>
            <li>Cải thiện trải nghiệm người dùng</li>
            <li>Gửi thông báo về tài khoản và bảo mật</li>
            <li>Hỗ trợ khách hàng khi cần thiết</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Database className="w-6 h-6 text-purple-600" />
            3. Lưu trữ và bảo mật dữ liệu
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi cam kết bảo vệ dữ liệu của bạn:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Mã hóa dữ liệu bằng công nghệ SSL/TLS 256-bit</li>
            <li>Lưu trữ dữ liệu trên máy chủ cloud an toàn</li>
            <li>Áp dụng các biện pháp bảo mật theo tiêu chuẩn quốc tế</li>
            <li>Giới hạn quyền truy cập dữ liệu chỉ cho nhân viên được ủy quyền</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-amber-600" />
            4. Quyền của bạn
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Bạn có quyền:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Truy cập và xem dữ liệu cá nhân của bạn</li>
            <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
            <li>Yêu cầu xóa tài khoản và dữ liệu</li>
            <li>Xuất dữ liệu của bạn ở định dạng có thể đọc được</li>
            <li>Rút lại sự đồng ý khi có thể</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-rose-50 to-transparent dark:from-rose-950/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <FileText className="w-6 h-6 text-rose-600" />
            5. Chia sẻ dữ liệu
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi không bán dữ liệu cá nhân của bạn. Dữ liệu chỉ được chia sẻ trong các trường hợp:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Khi có yêu cầu pháp lý từ cơ quan chức năng</li>
            <li>Với các nhà cung cấp dịch vụ hỗ trợ vận hành (theo hợp đồng bảo mật)</li>
            <li>Khi bạn cho phép rõ ràng</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 p-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Bell className="w-6 h-6 text-cyan-600" />
            6. Thông báo bảo mật
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi sẽ thông báo cho bạn ngay lập tức nếu:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Phát hiện vi phạm dữ liệu ảnh hưởng đến thông tin của bạn</li>
            <li>Có thay đổi quan trọng trong chính sách bảo mật</li>
            <li>Phát hiện hoạt động đăng nhập bất thường</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-indigo-600" />
            7. Xóa dữ liệu
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Khi bạn xóa tài khoản:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Dữ liệu sẽ được xóa trong vòng 30 ngày</li>
            <li>Bản sao lưu sẽ được xóa trong vòng 90 ngày</li>
            <li>Một số dữ liệu có thể được lưu giữ theo yêu cầu pháp lý</li>
          </ul>
        </section>

        <section className="bg-gradient-to-r from-teal-50 to-transparent dark:from-teal-950/20 p-6 rounded-2xl border border-teal-100 dark:border-teal-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark">
            8. Cookie và công nghệ theo dõi
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Chúng tôi sử dụng cookie để:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Duy trì phiên đăng nhập</li>
            <li>Ghi nhớ tùy chọn của bạn</li>
            <li>Phân tích lưu lượng truy cập</li>
          </ul>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Bạn có thể từ chối cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến trải nghiệm sử dụng.
          </p>
        </section>

        <section className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 p-6 rounded-2xl border border-green-100 dark:border-green-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark">
            9. Cam kết của chúng tôi
          </h2>
          <div className="flex items-start gap-3 mt-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-1" />
            <p className="text-revolut-muted text-base leading-relaxed">
              Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và tuân thủ các quy định về bảo vệ dữ liệu cá nhân hiện hành.
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-900/50">
          <h2 className="text-xl font-semibold text-revolut-dark">
            10. Liên hệ
          </h2>
          <p className="text-revolut-muted mt-3 text-base leading-relaxed">
            Nếu bạn có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ:
          </p>
          <ul className="list-disc list-inside text-revolut-muted mt-3 space-y-2 text-base">
            <li>Email: privacy@financeai.app</li>
            <li>Hotline: 1900 5678</li>
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
