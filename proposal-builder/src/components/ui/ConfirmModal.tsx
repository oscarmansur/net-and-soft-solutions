"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Info, CheckCircle2, X, Loader2 } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "warning" | "danger" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
  loading = false,
}: ConfirmModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const config = {
    primary: {
      icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
      iconBg: "bg-cyan-500/10 border-cyan-500/30",
      btnConfirm:
        "bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white shadow-cyan-950/40",
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      iconBg: "bg-amber-500/10 border-amber-500/30",
      btnConfirm:
        "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-amber-950/40",
    },
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
      iconBg: "bg-rose-500/10 border-rose-500/30",
      btnConfirm:
        "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white shadow-rose-950/40",
    },
    info: {
      icon: <Info className="w-6 h-6 text-cyan-400" />,
      iconBg: "bg-cyan-500/10 border-cyan-500/30",
      btnConfirm:
        "bg-[#1F7A8C] hover:bg-[#196270] text-white shadow-cyan-950/40",
    },
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-[#091D27] border border-[#133E50] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/90 space-y-5 animate-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl bg-[#06131A] border border-[#133E50]/60 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${config.iconBg}`}
          >
            {config.icon}
          </div>

          <div className="space-y-1.5 pr-6">
            <h3 id="modal-title" className="text-base font-bold text-white font-heading">
              {title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2.5 bg-[#06131A] hover:bg-[#0c2431] border border-[#133E50] text-slate-300 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm()}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 ${config.btnConfirm}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
