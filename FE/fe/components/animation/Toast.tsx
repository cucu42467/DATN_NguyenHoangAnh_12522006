"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ReactNode, createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, description: message, type, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const type = options.type || "info";
    const duration = options.duration || 3000;

    setToasts((prev) => [...prev, { id, ...options, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500",
          icon: <CheckCircle2 className="h-5 w-5" />,
        };
      case "error":
        return {
          bg: "bg-red-500",
          icon: <AlertCircle className="h-5 w-5" />,
        };
      case "warning":
        return {
          bg: "bg-amber-500",
          icon: <AlertTriangle className="h-5 w-5" />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-500",
          icon: <Info className="h-5 w-5" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : 100,
                  scale: prefersReducedMotion ? 1 : 0.8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: prefersReducedMotion ? 0 : 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : 100,
                  scale: prefersReducedMotion ? 1 : 0.8,
                  transition: {
                    duration: prefersReducedMotion ? 0 : 0.2,
                  },
                }}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ${styles.bg} text-white`}
              >
                {/* Icon */}
                <span className="flex-shrink-0 mt-0.5">{styles.icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <p className="font-semibold text-sm">{toast.title}</p>
                  )}
                  {toast.description && (
                    <p className="text-sm opacity-90 leading-relaxed">{toast.description}</p>
                  )}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  className="flex-shrink-0 rounded-lg p-1 hover:bg-white/20 transition-colors"
                  aria-label="Đóng thông báo"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Simple toast function for quick use
let toastFn: ToastContextType['showToast'] | null = null;

export function toast(message: string, type: ToastType = "info", duration?: number) {
  if (toastFn) {
    toastFn(message, type, duration);
  }
}

toast.success = (message: string, duration?: number) => toast(message, "success", duration);
toast.error = (message: string, duration?: number) => toast(message, "error", duration);
toast.warning = (message: string, duration?: number) => toast(message, "warning", duration);
toast.info = (message: string, duration?: number) => toast(message, "info", duration);

interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function ToastContainer({ position = "bottom-right" }: ToastContainerProps) {
  return null;
}

export default ToastProvider;
