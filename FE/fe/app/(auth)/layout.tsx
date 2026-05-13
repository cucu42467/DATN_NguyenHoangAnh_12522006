"use client";

import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-revolut-white via-revolut-surface to-revolut-dark/5 text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-revolut-gray-tone/30 bg-revolut-surface/20 shadow-xl shadow-revolut-blue/20 backdrop-blur-sm">
            <span className="text-3xl font-bold tracking-tight text-revolut-dark">
              FinanceAI
            </span>
          </div>
          <div className="rounded-[32px] border border-revolut-gray-tone/20 bg-revolut-white/95 p-8 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-10">
            {children}
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-revolut-muted">
        </div>
      </div>
    </div>
  );
}

