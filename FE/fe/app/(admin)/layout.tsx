"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, Users, FileText, Settings, BarChart3 } from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';
import { Button } from '@/thanh_phan/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useUserSession();

  if (loading) return <div>Loading...</div>;
  if (!user?.vaiTro.includes('ADMIN')) {
    return <div>Access denied. Admin only.</div>;
  }

  const adminNav = [
    { href: '/admin/danhmuc', icon: List, label: 'Danh mục' },
    { href: '/admin/giaodich', icon: BarChart3, label: 'Giao dịch' },
    { href: '/admin/tongquan', icon: LayoutDashboard, label: 'Tổng quan' },
    { href: '/admin/nguoidung', icon: Users, label: 'Người dùng' },
    { href: '/admin/auditlog', icon: FileText, label: 'Audit Log' },
    { href: '/admin/cauhinh', icon: Settings, label: 'Cấu hình' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 p-4 space-y-4">
          <div className="font-bold text-lg uppercase tracking-tight text-slate-900">Admin Panel</div>
          <nav className="space-y-0.5">
            {adminNav.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <Button variant={pathname.startsWith(href) ? 'secondary' : 'ghost'} className="w-full justify-start text-sm py-2">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

