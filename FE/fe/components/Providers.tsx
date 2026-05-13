"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/animation/Toast";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import QueryProvider from "@/lib/query/query-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
