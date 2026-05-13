"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import ThanhBen from "@/components/chung/ThanhBen";
import PhanDau from "@/components/chung/PhanDau";
import { useUserSession } from '@/hooks/useUserSession';
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';
import TroLyAI from '@/features/trangchu/thanh_phan/TroLyAI';
import { useDarkMode } from '@/contexts/DarkModeContext';

function UserLayoutContent({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user: sessionUser, logout } = useUserSession();
  const { isDarkMode, toggleTheme } = useDarkMode();
  const hienTroLyAI = !["/TrungTamAI", "/CaiDat", "/HoSo"].includes(pathname);
  useAuthErrorHandler();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-56 lg:w-64';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--app-shell-bg)' }}>
      {/* Sidebar - Always visible, collapsible */}
      <aside className={`${sidebarWidth} flex-shrink-0 flex flex-col transition-all duration-300 z-30 fe-sidebar border-r`}
        style={{ borderColor: 'var(--sidebar-border)' }}>
        <ThanhBen 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          onClose={() => {}}
          onToggleSidebar={toggleCollapse}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex-shrink-0 sticky top-0 z-20">
          <PhanDau
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            user={sessionUser}
            onLogout={logout}
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto space-y-10">
            {children}
          </div>
        </main>
      </div>

      {hienTroLyAI ? <TroLyAI /> : null}
    </div>
  );
}

export default function UserLayout({ children }: { children: ReactNode }) {
  return <UserLayoutContent>{children}</UserLayoutContent>;
}
