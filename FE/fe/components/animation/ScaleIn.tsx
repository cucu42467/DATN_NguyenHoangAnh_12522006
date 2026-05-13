"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
  className = "",
  once = true,
}: ScaleInProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      initial={false}
      whileInView="visible"
      viewport={{ once }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimateWidthProps {
  width: number;
  delay?: number;
  duration?: number;
  className?: string;
  showLabel?: boolean;
  formatLabel?: (value: number) => string;
}

export function AnimateWidth({
  width,
  delay = 0,
  duration = 1,
  className = "",
  showLabel = true,
  formatLabel = (v) => `${v.toFixed(0)}%`,
}: AnimateWidthProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerStyle: CSSProperties = {
    width: "100%",
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    overflow: "hidden",
  };

  const barStyle: CSSProperties = {
    height: "100%",
    borderRadius: "9999px",
    width: prefersReducedMotion ? `${width}%` : "0%",
    transition: prefersReducedMotion ? "none" : `width ${duration}s ease-out ${delay}s`,
  };

  return (
    <div className={className}>
      <div style={containerStyle}>
        <motion.div
          style={barStyle}
          initial={false}
          animate={{ width: `${width}%` }}
          transition={{
            duration: prefersReducedMotion ? 0 : duration,
            delay: prefersReducedMotion ? 0 : delay,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>
      {showLabel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : delay + duration * 0.5 }}
          className="mt-1 text-sm text-gray-600"
        >
          {formatLabel(width)}
        </motion.p>
      )}
    </div>
  );
}
