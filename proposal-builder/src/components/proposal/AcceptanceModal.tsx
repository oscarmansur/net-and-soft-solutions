"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Edit3 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalSlug: string;
  defaultCompany?: string;
  defaultContact?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  onSuccess?: (actionType: string, message: string) => void;
}

export function AcceptanceModal({
  isOpen,
  onClose,
  proposalSlug,
  defaultCompany = "",
  defaultContact = "",
  defaultEmail = "",
  defaultPhone = "",
  onSuccess,
}: AcceptanceModalProps) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    representativeName: defaultContact,
    companyName: defaultCompany,
    email: defaultEmail,
    phone: defaultPhone,
    acceptedTerms: true,
    comments: "",
    signatureData: "",
    company_website: "", // Honeypot field (hidden from humans, real HTML input)
  });

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Solicitar token firmado al abrir el modal
  useEffect(() => {
    if (isOpen && proposalSlug) {
      fetch(`/api/public/proposals/${proposalSlug}/nonce`)
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            setToken(data.token);
          }
        })
        .catch((err) => console.error("Error fetching nonce:", err));
    }
  }, [isOpen, proposalSlug]);

  if (!isOpen) return null;

  const handleSubmit = async (actionType: "ACCEPT" | "REQUEST_CHANGES" | "REJECT") => {
    setError(null);
    setLoading(true);

    if (!token) {
      setError("Token de seguridad no disponible. Por favor recargue la página.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/public/proposals/${proposalSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          actionType,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo procesar la solicitud.");
        toast.error(data.error || "No se pudo procesar la solicitud.");
        setLoading(false);
        return;
      }

      setSubmittedMessage(data.message);
      toast.success(data.message, "Respuesta Registrada");
      if (onSuccess) {
        onSuccess(actionType, data.message);
      }
    } catch {
      setError("Error de comunicación con el servidor.");
      toast.error("Error de comunicación con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#091D27] border border-[#133E50] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-[#06131A] border border-[#133E50]/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedMessage ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">
              Respuesta Registrada
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {submittedMessage}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#1F7A8C] hover:bg-[#196270] text-white font-semibold text-sm rounded-xl transition-all"
            >
              Cerrar Ventana
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Gestionar Propuesta Comercial
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Indique su decisión para formalizar los siguientes pasos
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("ACCEPT");
              }}
              className="space-y-4"
            >
              {/* =========================================================
                  HONEYPOT FIELD OBLIGATORIO
                  Invisible para humanos por CSS, en el flujo real para bots
                 ========================================================= */}
              <div className="form-trap" aria-hidden="true">
                <label htmlFor="company_website">Sitio web de la empresa</label>
                <input
                  id="company_website"
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company_website}
                  onChange={(e) =>
                    setFormData({ ...formData, company_website: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Representante *
                </label>
                <input
                  type="text"
                  required
                  value={formData.representativeName}
                  onChange={(e) =>
                    setFormData({ ...formData, representativeName: e.target.value })
                  }
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Ej: Bimoto Imperio C.A."
                  className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="contacto@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+58 414 1234567"
                    className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Comentario o Solicitud de Ajuste (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  placeholder="Escriba aquí si requiere alguna modificación o nota para el equipo comercial..."
                  className="w-full px-3.5 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Firma Electrónica Simple (Nombre completo para constancia)
                </label>
                <div className="relative">
                  <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.signatureData}
                    onChange={(e) =>
                      setFormData({ ...formData, signatureData: e.target.value })
                    }
                    placeholder="Escriba su nombre y apellido completos como firma"
                    className="w-full pl-9 pr-3.5 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="acceptedTerms"
                  required
                  checked={formData.acceptedTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptedTerms: e.target.checked })
                  }
                  className="mt-0.5 rounded bg-[#06131A] border-[#133E50] text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="acceptedTerms" className="text-[11px] text-slate-300 leading-tight">
                  He revisado y acepto las condiciones de servicio, el régimen de consumo de horas y las especificaciones descritas en la propuesta.
                </label>
              </div>

              {/* Action Buttons — UX hierarchy: activate > request changes > reject (subtle) */}
              <div className="pt-3 space-y-3">
                {/* PRIMARY: Activate */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("ACCEPT")}
                  className="w-full py-3 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Solicitar Activación de la Propuesta
                </button>

                {/* SECONDARY: Request changes — framed as a helpful, motivating option */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-300 leading-snug">
                      ¿Algo no cuadra? Podemos ajustarlo
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                      Nuestro equipo revisará su comentario y le presentará una propuesta adaptada.
                    </p>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSubmit("REQUEST_CHANGES")}
                      className="mt-2 py-1.5 px-3.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                      Solicitar modificaciones
                    </button>
                  </div>
                </div>

                {/* TERTIARY: Reject — minimal and subtle */}
                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmit("REJECT")}
                    className="text-[10px] text-slate-600 hover:text-rose-400 underline underline-offset-2 transition-colors disabled:opacity-40"
                  >
                    No deseo continuar con esta propuesta
                  </button>
                </div>
              </div>

              <div className="pt-1 text-center text-[10px] text-slate-500">
                Esta solicitud confirma la intención de continuar. No realiza cargos automáticos.
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
