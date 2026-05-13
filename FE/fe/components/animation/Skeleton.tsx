"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({
  className = "",
  width = "100%",
  height = "1rem",
  borderRadius = "0.5rem",
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      animate={prefersReducedMotion ? {} : {
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height="2.5rem"
              width="85%"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ShimmerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function Shimmer({ children, className = "", duration = 2 }: ShimmerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            translateX: ["0%", "200%"],
          }}
          transition={{
            duration,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white border border-[#c9c9cd] rounded-[20px] p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="3rem" height="3rem" borderRadius="12px" />
        <Skeleton width="3rem" height="1.5rem" borderRadius="9999px" />
      </div>
      <Skeleton width="60%" height="0.75rem" className="mb-2" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="40%" height="0.625rem" className="mt-2" />
    </div>
  );
}

export function SkeletonStatsRow({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white border border-[#c9c9cd] rounded-[20px] p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <Skeleton width="12rem" height="1.5rem" />
        <div className="flex gap-2">
          <Skeleton width="5rem" height="2rem" borderRadius="9999px" />
          <Skeleton width="5rem" height="2rem" borderRadius="9999px" />
        </div>
      </div>
      <div className="flex items-end gap-4 h-64">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            width={`${100 / 12}%`}
            height={`${40 + (i % 4) * 15}%`}
            borderRadius="8px 8px 0 0"
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHeroSection() {
  return (
    <div className="space-y-4">
      <Skeleton width="8rem" height="1rem" />
      <Skeleton width="24rem" height="3rem" />
      <div className="flex gap-4 mt-6">
        <Skeleton width="10rem" height="3rem" borderRadius="9999px" />
        <Skeleton width="10rem" height="3rem" borderRadius="9999px" />
      </div>
    </div>
  );
}

export function SkeletonPageShell({ hasCharts = false }: { hasCharts?: boolean }) {
  return (
    <div className="fe-page-shell space-y-12">
      <SkeletonHeroSection />
      <SkeletonStatsRow count={4} />
      {hasCharts && (
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <SkeletonChart />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Skeleton width="100%" height="20rem" borderRadius="20px" />
            <Skeleton width="100%" height="20rem" borderRadius="20px" />
          </div>
        </div>
      )}
    </div>
  );
}
