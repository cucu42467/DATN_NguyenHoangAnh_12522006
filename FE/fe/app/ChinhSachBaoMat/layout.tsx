"use client";

import { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-revolut-white via-revolut-surface to-revolut-dark/5 text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <div className="rounded-[32px] border border-revolut-gray-tone/20 bg-revolut-white/95 p-10 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-12 lg:p-14">
            {children}
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-revolut-muted">
        </div>
      </div>
    </div>
  );
}
