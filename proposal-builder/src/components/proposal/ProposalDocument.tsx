import React from "react";
import { Logo } from "@/components/brand/Logo";
import { ProposalFormData } from "@/types/proposal";
import { calculatePricing, formatCleanNumber, formatMinutesFriendly } from "@/lib/calculations";
import {
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "@/lib/catalog-data";
import {
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  AlertTriangle,
  FileCheck,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface ProposalDocumentProps {
  data: Partial<ProposalFormData> & {
    client?: {
      tradeName?: string;
      legalName?: string;
      taxId?: string;
      contactName?: string;
      contactPosition?: string | null;
      email?: string;
      phone?: string;
      address?: string | null;
      numberOfUsers?: number | null;
      numberOfComputers?: number | null;
    };
  };
  onOpenAcceptance?: () => void;
  isStaticPreview?: boolean;
}

export function ProposalDocument({
  data,
  onOpenAcceptance,
  isStaticPreview = false,
}: ProposalDocumentProps) {
  const clientName = data.client?.tradeName || "Cliente";
  const legalName = data.client?.legalName || clientName;
  const taxId = data.client?.taxId || "J-00000000-0";
  const contact = data.client?.contactName || "Representante";
  const email = data.client?.email || "";
  const phone = data.client?.phone || "";

  const pricing = calculatePricing({
    monthlyPrice: Number(data.monthlyPrice || 0),
    includedHours: Number(data.includedHours || 0),
    extraHourPrice: Number(data.extraHourPrice || 0),
    alertPercentage: data.alertPercentage ?? 80,
    usedHours: data.usedHours ?? 0,
    currency: data.currency || "USD",
  });

  const tools = data.tools || [];
  const includedTools = tools.filter((t) => t.included);
  const excludedTools = tools.filter((t) => !t.included);
  const activities = (data.activities || []).filter((a) => a.included !== false);
  const includedServices =
    data.includedServices !== undefined
      ? data.includedServices
      : INITIAL_INCLUDED_SERVICES;
  const excludedServices =
    data.excludedServices !== undefined
      ? data.excludedServices
      : INITIAL_EXCLUDED_SERVICES;
  const terms =
    data.termsAndConditions !== undefined
      ? data.termsAndConditions
      : INITIAL_TERMS;

  return (
    <div className="w-full bg-[#030A0E] text-slate-100 font-sans">
      {/* Cover Header */}
      <header className="relative bg-gradient-to-b from-[#061D28] to-[#030A0E] border-b border-[#133E50] p-4 sm:p-8 md:p-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <Logo variant="dark" width={210} height={46} className="mb-3 sm:mb-4" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Propuesta Comercial de Soporte IT
            </div>
          </div>

          <div className="sm:text-right space-y-1 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#133E50]/40 flex flex-wrap sm:flex-col justify-between sm:justify-end items-baseline sm:items-end gap-x-3">
            <div className="text-xs text-slate-400 font-mono">
              CÓDIGO: <span className="text-white font-bold">{data.proposalCode || "NS-PROP-2026-001"}</span>
            </div>
            <div className="text-xs text-slate-400">
              Versión: <span className="text-cyan-400 font-semibold font-mono">v{data.currentVersion || 1}</span>
            </div>
            <div className="text-xs text-slate-400 flex sm:justify-end items-center gap-1.5 pt-0.5 sm:pt-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Validez: {data.validityDays || 15} días</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* Title & Client Banner */}
        <section className="bg-[#091D27]/90 border border-[#133E50] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-black/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
            Preparada exclusivamente para
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight mb-4">
            {clientName}
          </h1>

          <p className="text-base text-slate-300 max-w-3xl mb-6 leading-relaxed">
            {data.title || "Propuesta de Soporte y Continuidad Tecnológica Integral"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#133E50]/60 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block">Razón Social:</span>
              <span className="font-semibold text-white">{legalName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Identificación Fiscal:</span>
              <span className="font-semibold text-cyan-300 font-mono">{taxId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Contacto Responsable:</span>
              <span className="font-semibold text-white">{contact}</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards (Direct clear commercial terms) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Condiciones Económicas y Régimen de Horas
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Valores transparentes sin costes ocultos ni conceptos ambiguos
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded bg-[#06131A] text-cyan-400 border border-[#133E50]">
              Moneda: {pricing.currency}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Precio mensual */}
            <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Inversión Mensual
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-heading mt-2">
                  {pricing.formatted.monthlyPrice}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#133E50]/40 flex items-center justify-between">
                <span>Facturación {data.billingFrequency || "Mensual"}</span>
                <span className="text-[11px] text-slate-500">Tarifa fija de abono</span>
              </div>
            </div>

            {/* Horas incluidas + Precio por hora acuñado */}
            <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Horas Incluidas
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Tasa: ~{pricing.formatted.pricePerHour}/h
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading mt-2">
                  {pricing.formatted.includedHours}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#133E50]/40 flex flex-col gap-0.5">
                <span>Alerta al {pricing.alertPercentage}% ({pricing.formatted.alertHours})</span>
                <span className="text-[11px] text-slate-500">
                  Cálculo ref.: {pricing.formatted.monthlyPrice} / {pricing.formatted.includedHours} = {pricing.formatted.pricePerHour}/h
                </span>
              </div>
            </div>

            {/* Hora adicional */}
            <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg relative overflow-hidden sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Hora Adicional Excedente
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-heading mt-2">
                  {pricing.formatted.extraHourPrice}
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-[#133E50]/40">
                Solo facturable bajo previa aprobación del cliente
              </div>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-[#06131A] border border-[#133E50]/80 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Términos de pago: <strong>{data.paymentTerms || "Prepago los primeros 5 días"}</strong></span>
            </span>
            <span className="text-slate-400 text-[11px] sm:text-xs">
              {data.rolloverEnabled ? "✅ Horas con acumulación (Rollover)" : "❌ Horas no acumulables mes vencido"}
            </span>
          </div>
        </section>

        {/* Tools and Platform Matrix */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              Catálogo de Herramientas y Cobertura
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Plataformas supervisadas y administradas dentro del soporte tecnológico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(includedTools.length > 0 ? includedTools : tools).map((tool, idx) => (
              <div
                key={idx}
                className="bg-[#091D27] border border-[#133E50] rounded-2xl p-4 sm:p-5 space-y-3 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {tool.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-full shrink-0 ${
                      tool.included
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {tool.included ? "Plataforma incluida" : "Requiere cotización"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {tool.description}
                </p>

                {tool.notes && (
                  <div className="text-[11px] text-slate-400 italic bg-[#06131A] p-2.5 rounded-lg border border-[#133E50]/50">
                    Nota: {tool.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {includedTools.length > 0 && excludedTools.length > 0 && (
            <div className="p-4 rounded-xl bg-[#06131A] border border-[#133E50]/60 space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Otras plataformas no contempladas en este plan (requieren cotización o licenciamiento independiente):
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {excludedTools.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#091D27] border border-[#133E50] rounded-lg text-xs text-slate-400"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Activities and Operating Times */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              Tiempos Estimados y Régimen de Consumo
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Diferenciación clara de intervenciones que consumen horas versus procesos automáticos
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#091D27] border border-[#133E50] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#06131A] text-slate-400 uppercase tracking-wider border-b border-[#133E50] text-xs">
                  <tr>
                    <th className="py-3.5 px-5">Actividad / Tarea</th>
                    <th className="py-3.5 px-5">Tipo</th>
                    <th className="py-3.5 px-5">Tiempo Típico</th>
                    <th className="py-3.5 px-5 text-right">Régimen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#133E50]/40">
                  {activities.map((act, idx) => (
                    <tr key={idx} className="hover:bg-[#061D28]/40 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-white">
                        {act.name}
                        <div className="text-[11px] font-normal text-slate-400 mt-0.5">{act.description}</div>
                      </td>
                      <td className="py-3.5 px-5 text-cyan-300">
                        {act.category}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300 font-medium">
                        {act.minMinutes > 0 ? formatMinutesFriendly(act.minMinutes, act.maxMinutes) : "Proceso Desatendido"}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            act.consumesHours
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {act.consumesHours ? "Consume horas" : "No consume horas"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View (eliminates broken horizontal overflow) */}
          <div className="block md:hidden space-y-3">
            {activities.map((act, idx) => (
              <div
                key={idx}
                className="bg-[#091D27] border border-[#133E50] rounded-xl p-4 space-y-2.5 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-bold text-white text-sm leading-snug">
                    {act.name}
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10.5px] font-semibold rounded-full shrink-0 ${
                      act.consumesHours
                        ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {act.consumesHours ? "Consume horas" : "No consume horas"}
                  </span>
                </div>

                {act.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {act.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#133E50]/50 text-xs">
                  <span className="text-cyan-300 font-medium">
                    {act.category}
                  </span>
                  <span className="font-mono text-slate-300 flex items-center gap-1.5 font-semibold text-[11.5px]">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {act.minMinutes > 0 ? formatMinutesFriendly(act.minMinutes, act.maxMinutes) : "Proceso Desatendido"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scope Matrix: Included vs Excluded */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Servicios incluidos */}
          <div className="bg-[#091D27] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Servicios Incluidos en la Propuesta
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              {includedServices.map((inc) => (
                <li key={inc.id} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{inc.title}</strong>
                    <span className="text-slate-400">{inc.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios no incluidos */}
          <div className="bg-[#091D27] border border-rose-500/30 rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              Servicios No Incluidos (Requieren Cotización)
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              {excludedServices.map((exc) => (
                <li key={exc.id} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{exc.title}</strong>
                    <span className="text-slate-400">{exc.description}</span>
                    <span className="text-amber-400 font-semibold block text-[11px] mt-0.5">
                      {exc.separateQuoteNotice}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="bg-[#091D27] border border-[#133E50] rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <FileCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            Condiciones del Servicio y Garantías
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300 leading-relaxed">
            {terms.map((term, idx) => (
              <li key={idx} className="pl-1">
                <span>{term}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Call To Action Box (In public view or static preview) */}
        {!isStaticPreview && onOpenAcceptance && (
          <section className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#091D27] via-[#062432] to-[#091D27] border border-cyan-500/30 text-center space-y-4 shadow-2xl shadow-cyan-950/40">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              ¿Listo para activar su plan de soporte?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Confirme su intención de continuar para emitir el acuerdo de servicio y coordinar la sesión de inducción técnica con su equipo.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAcceptance}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-cyan-950/60 transform hover:-translate-y-0.5"
              >
                Gestionar Propuesta Comercial
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.
            </p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#133E50] py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 space-y-2">
          <Logo variant="dark" width={140} height={32} className="mx-auto opacity-70 mb-2" />
          <p>© {new Date().getFullYear()} Net &amp; Soft Solutions C.A. Todos los derechos reservados.</p>
          <p>https://netandsoft.com.ve/</p>
        </div>
      </footer>
    </div>
  );
}
