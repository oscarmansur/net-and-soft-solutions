"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  show: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalToastHandler: ToastContextType | null = null;

/**
 * Función utilitaria global para invocar toasts fuera de hooks de React si fuera necesario
 */
export const toast = {
  success: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.success(message, title, duration) || "",
  error: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.error(message, title, duration) || "",
  warning: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.warning(message, title, duration) || "",
  info: (message: string, title?: string, duration?: number) =>
    globalToastHandler?.info(message, title, duration) || "",
  dismiss: (id: string) => globalToastHandler?.dismiss(id),
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de un <ToastProvider />");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Mantener máximo 5 toasts simultáneos
      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) =>
      show({ type: "success", title, message, duration }),
    [show]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) =>
      show({ type: "error", title, message, duration: duration || 6000 }),
    [show]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) =>
      show({ type: "warning", title, message, duration: duration || 5000 }),
    [show]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) =>
      show({ type: "info", title, message, duration }),
    [show]
  );

  const contextValue: ToastContextType = {
    toasts,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  };

  useEffect(() => {
    globalToastHandler = contextValue;
    return () => {
      globalToastHandler = null;
    };
  }, [contextValue]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Floating Toasts Viewport Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none p-3 sm:p-0 no-print"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const duration = item.duration || 4500;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingRef = useRef<number>(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingRef.current - elapsed);
      const pct = (currentRemaining / duration) * 100;
      setProgress(pct);

      if (currentRemaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startTimeRef.current));
    };
  }, [isPaused, duration, onDismiss]);

  const config = {
    success: {
      border: "border-emerald-500/40",
      glow: "shadow-emerald-950/30",
      bgBar: "bg-emerald-400",
      badge: "text-emerald-400",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      defaultTitle: "Operación Exitosa",
    },
    error: {
      border: "border-rose-500/50",
      glow: "shadow-rose-950/40",
      bgBar: "bg-rose-400",
      badge: "text-rose-400",
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      defaultTitle: "Atención requerida",
    },
    warning: {
      border: "border-amber-500/40",
      glow: "shadow-amber-950/30",
      bgBar: "bg-amber-400",
      badge: "text-amber-400",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      defaultTitle: "Aviso",
    },
    info: {
      border: "border-cyan-500/40",
      glow: "shadow-cyan-950/30",
      bgBar: "bg-cyan-400",
      badge: "text-cyan-400",
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
      defaultTitle: "Información",
    },
  }[item.type];

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden w-full rounded-2xl bg-[#091D27]/95 backdrop-blur-xl border ${config.border} p-4 shadow-2xl ${config.glow} transition-all duration-200 transform translate-y-0 animate-in slide-in-from-bottom-3 fade-in`}
    >
      <div className="flex items-start gap-3">
        {config.icon}

        <div className="flex-1 min-w-0 pr-2">
          <div className={`text-xs font-bold font-heading ${config.badge}`}>
            {item.title || config.defaultTitle}
          </div>
          <div className="text-xs text-slate-200 mt-0.5 leading-relaxed break-words">
            {item.message}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#06131A] transition-colors shrink-0"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso de auto-descarte */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#06131A]">
        <div
          className={`h-full ${config.bgBar} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
