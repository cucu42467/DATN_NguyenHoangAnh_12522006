"use client";

import React, { useEffect, useState } from "react";
import { useUserSession } from '@/hooks/useUserSession';
import PhanDau from "@/components/chung/PhanDau";
import ThanhBenAdmin from "@/features/admin/thanh_phan/ThanhBenAdmin-fixed";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { user: sessionUser, logout } = useUserSession();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((currentMode) => !currentMode);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <div 
      className="flex h-screen bg-[#f8f9fa] dark:bg-zinc-950 transition-colors duration-300 overflow-hidden"
      style={{ '--fe-sidebar-width': sidebarWidth } as React.CSSProperties}
    >
      {/* Integrated Sidebar - Always visible, collapsible */}
      <aside className="flex-shrink-0 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl shadow-xl flex flex-col transition-all duration-300 z-30" style={{ width: sidebarWidth }}>
        <ThanhBenAdmin 
          isCollapsed={isCollapsed} 
          onToggleCollapse={toggleCollapse}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md flex-shrink-0 sticky top-0 z-20 transition-all">
          <PhanDau
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            user={sessionUser}
            onLogout={logout}
          />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
