"use client";

import React, { useEffect, useState, use } from "react";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { AcceptanceModal } from "@/components/proposal/AcceptanceModal";
import { Download, Printer, CheckCircle2, ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";
import { ProposalFormData } from "@/types/proposal";
import { useToast } from "@/components/ui/Toast";
import {
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "@/lib/catalog-data";

export default function PublicProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const toast = useToast();
  const [proposalData, setProposalData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadPublicProposal() {
      try {
        const query = typeof window !== "undefined" ? window.location.search : "";
        const url = `/api/public/proposals/${slug}${query ? query + "&" : "?"}t=${Date.now()}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          setError("Esta propuesta no existe, no está publicada o ha sido retirada.");
          return;
        }
        const data = await res.json();
        setProposalData(data);

        // Registrar evento de vista pública silencioso
        fetch(`/api/public/proposals/${slug}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "proposal_viewed",
            landingUrl: window.location.href,
          }),
        }).catch(() => {});
      } catch {
        setError("Error al cargar la propuesta.");
      } finally {
        setLoading(false);
      }
    }

    loadPublicProposal();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030A0E] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Cargando propuesta comercial...</span>
        </div>
      </div>
    );
  }

  if (error || !proposalData) {
    return (
      <div className="min-h-screen bg-[#030A0E] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="text-4xl">📄</div>
          <h1 className="text-xl font-bold text-white font-heading">
            Propuesta no disponible
          </h1>
          <p className="text-sm text-slate-400">
            {error || "El enlace consultado no se encuentra disponible actualmente."}
          </p>
          <a
            href="https://netandsoft.com.ve/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-cyan-400 text-sm font-semibold rounded-xl transition-colors mt-4"
          >
            Ir al sitio web de Net &amp; Soft Solutions
          </a>
        </div>
      </div>
    );
  }

  const isHistorical = Boolean(proposalData.isHistorical);
  const snapshot = proposalData.snapshot || {};
  const proposal = proposalData.proposal || {};
  let rawScope = isHistorical ? snapshot : (proposal.scopeData || snapshot || {});
  if (typeof rawScope === "string") {
    try {
      rawScope = JSON.parse(rawScope);
    } catch {
      rawScope = {};
    }
  }
  const scopeData = rawScope;

  const includedServices = Array.isArray(scopeData.includedServices)
    ? scopeData.includedServices
    : Array.isArray(snapshot.includedServices)
    ? snapshot.includedServices
    : INITIAL_INCLUDED_SERVICES;

  const excludedServices = Array.isArray(scopeData.excludedServices)
    ? scopeData.excludedServices
    : Array.isArray(snapshot.excludedServices)
    ? snapshot.excludedServices
    : INITIAL_EXCLUDED_SERVICES;

  const termsAndConditions = Array.isArray(scopeData.termsAndConditions)
    ? scopeData.termsAndConditions
    : Array.isArray(snapshot.termsAndConditions)
    ? snapshot.termsAndConditions
    : INITIAL_TERMS;

  const tools = Array.isArray(proposal.tools) && proposal.tools.length > 0
    ? proposal.tools
    : (Array.isArray(snapshot.tools) ? snapshot.tools : []);
  const activities = Array.isArray(proposal.activities) && proposal.activities.length > 0
    ? proposal.activities
    : (Array.isArray(snapshot.activities) ? snapshot.activities : []);

  const mergedData: any = isHistorical
    ? {
        ...proposal,
        ...snapshot,
        proposalCode: snapshot.proposalCode || proposal.proposalCode,
        title: snapshot.title || proposal.title,
        monthlyPrice: Number(snapshot.monthlyPrice ?? snapshot.pricing?.monthlyPrice ?? proposal.monthlyPrice ?? 0),
        includedHours: Number(snapshot.includedHours ?? snapshot.pricing?.includedHours ?? proposal.includedHours ?? 0),
        extraHourPrice: Number(snapshot.extraHourPrice ?? snapshot.pricing?.extraHourPrice ?? proposal.extraHourPrice ?? 0),
        alertPercentage: snapshot.alertPercentage ?? snapshot.pricing?.alertPercentage ?? proposal.alertPercentage ?? 80,
        currency: snapshot.currency ?? snapshot.pricing?.currency ?? proposal.currency ?? "USD",
        billingFrequency: snapshot.billingFrequency ?? snapshot.pricing?.billingFrequency ?? proposal.billingFrequency ?? "Mensual",
        paymentTerms: snapshot.paymentTerms ?? snapshot.pricing?.paymentTerms ?? proposal.paymentTerms ?? "Prepago los primeros 5 días",
        validityDays: snapshot.validityDays ?? snapshot.pricing?.validityDays ?? proposal.validityDays ?? 15,
        currentVersion: snapshot.version || proposal.currentVersion || 1,
        client: snapshot.client || proposal.client,
        tools: snapshot.tools?.length ? snapshot.tools : tools,
        activities: snapshot.activities?.length ? snapshot.activities : activities,
        includedServices: Array.isArray(snapshot.includedServices) ? snapshot.includedServices : includedServices,
        excludedServices: Array.isArray(snapshot.excludedServices) ? snapshot.excludedServices : excludedServices,
        termsAndConditions: Array.isArray(snapshot.termsAndConditions) ? snapshot.termsAndConditions : termsAndConditions,
      }
    : {
        ...snapshot,
        ...proposal,
        proposalCode: proposal.proposalCode || snapshot.proposalCode,
        title: proposal.title || snapshot.title,
        monthlyPrice: Number(proposal.monthlyPrice ?? snapshot.monthlyPrice ?? snapshot.pricing?.monthlyPrice ?? 0),
        includedHours: Number(proposal.includedHours ?? snapshot.includedHours ?? snapshot.pricing?.includedHours ?? 0),
        extraHourPrice: Number(proposal.extraHourPrice ?? snapshot.extraHourPrice ?? snapshot.pricing?.extraHourPrice ?? 0),
        alertPercentage: proposal.alertPercentage ?? snapshot.alertPercentage ?? snapshot.pricing?.alertPercentage ?? 80,
        currency: proposal.currency || snapshot.currency || snapshot.pricing?.currency || "USD",
        billingFrequency: proposal.billingFrequency || snapshot.billingFrequency || snapshot.pricing?.billingFrequency || "Mensual",
        paymentTerms: proposal.paymentTerms || snapshot.paymentTerms || snapshot.pricing?.paymentTerms || "Prepago los primeros 5 días",
        validityDays: proposal.validityDays || snapshot.validityDays || snapshot.pricing?.validityDays || 15,
        currentVersion: proposal.currentVersion || snapshot.version || 1,
        client: proposal.client || snapshot.client,
        tools: tools,
        activities: activities,
        includedServices: includedServices,
        excludedServices: excludedServices,
        termsAndConditions: termsAndConditions,
      };

  return (
    <div className="min-h-screen bg-[#030A0E] relative">
      {/* Floating Action Bar (Top or Bottom) */}
      <div className="sticky top-0 z-30 bg-[#06131A]/95 backdrop-blur-md border-b border-[#133E50] py-2 px-3 sm:px-8 flex items-center justify-between gap-2 no-print">
        <div className="text-xs text-slate-400 font-mono hidden sm:block truncate">
          {mergedData.proposalCode} • v{mergedData.currentVersion || 1}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Enlace de la propuesta copiado al portapapeles.", "Enlace Copiado");
            }}
            className="p-2 sm:px-3 sm:py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Copiar enlace de la propuesta"
          >
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Enlace</span>
          </button>

          <a
            href={`/api/public/proposals/${slug}/export?format=html`}
            target="_blank"
            download
            className="p-2 sm:px-3 sm:py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Descargar archivo HTML independiente"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">HTML</span>
          </a>

          <button
            onClick={() => window.print()}
            className="p-2 sm:px-3 sm:py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-cyan-950/40 flex items-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Gestionar <span className="hidden sm:inline">Propuesta</span></span>
          </button>
        </div>
      </div>

      {/* Main Document Component */}
      <ProposalDocument
        data={mergedData}
        onOpenAcceptance={() => setModalOpen(true)}
      />

      {/* Acceptance Modal */}
      <AcceptanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        proposalSlug={slug}
        defaultCompany={mergedData.client?.tradeName}
        defaultContact={mergedData.client?.contactName}
        defaultEmail={mergedData.client?.email}
        defaultPhone={mergedData.client?.phone}
      />
    </div>
  );
}
