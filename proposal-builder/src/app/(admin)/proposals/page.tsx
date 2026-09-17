"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Download,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
} from "lucide-react";
import { ProposalStatus } from "@/types/proposal";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Link2 } from "lucide-react";

interface ProposalRow {
  id: string;
  proposalCode: string;
  slug: string;
  title: string;
  status: ProposalStatus;
  currentVersion: number;
  monthlyPrice: number;
  includedHours: number;
  client: { tradeName: string; email: string };
  updatedAt: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [duplicateTarget, setDuplicateTarget] = useState<ProposalRow | null>(null);
  const [duplicating, setDuplicating] = useState(false);
  const toast = useToast();

  const loadProposals = async (q = search, st = statusFilter) => {
    setLoading(true);
    try {
      let url = `/api/internal/proposals?page=1&limit=50`;
      if (q) url += `&search=${encodeURIComponent(q)}`;
      if (st && st !== "ALL") url += `&status=${st}`;

      const res = await fetch(url);
      const data = await res.json();
      setProposals(data.items || []);
    } catch (err) {
      console.error("Error loading proposals:", err);
      toast.error("Error al cargar las propuestas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [statusFilter]);

  const executeDuplicate = async () => {
    if (!duplicateTarget) return;
    setDuplicating(true);
    try {
      const res = await fetch(`/api/internal/proposals/${duplicateTarget.id}?action=duplicate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Propuesta duplicada exitosamente como borrador.`);
        setDuplicateTarget(null);
        loadProposals();
      } else {
        toast.error(data.error || "No se pudo duplicar la propuesta.");
      }
    } catch (err) {
      console.error("Duplicate failed:", err);
      toast.error("Error de conexión al duplicar la propuesta.");
    } finally {
      setDuplicating(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Enlace público copiado al portapapeles.", "Enlace Copiado");
  };

  const statusBadge = (st: ProposalStatus) => {
    switch (st) {
      case "PUBLISHED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Publicada
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Aceptada
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Rechazada
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Borrador
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Propuestas Comerciales
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Administre cotizaciones, versiones inmutables y estados de aceptación
          </p>
        </div>

        <Link
          href="/proposals/new"
          className="px-4 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nueva Propuesta
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: "Todas", val: "ALL" },
            { label: "Borradores", val: "DRAFT" },
            { label: "Publicadas", val: "PUBLISHED" },
            { label: "Aceptadas", val: "ACCEPTED" },
            { label: "Rechazadas", val: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.val
                  ? "bg-[#1F7A8C] text-white"
                  : "text-slate-400 hover:text-white hover:bg-[#06131A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadProposals(search);
          }}
          className="relative w-full md:w-80"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código o cliente..."
            className="w-full pl-10 pr-4 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </form>
      </div>

      {/* Proposals Table */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#06131A] text-slate-400 text-xs uppercase tracking-wider border-b border-[#133E50]">
              <tr>
                <th className="py-3.5 px-5">Código / Cliente</th>
                <th className="py-3.5 px-5">Título</th>
                <th className="py-3.5 px-5">Inversión Mensual</th>
                <th className="py-3.5 px-5">Horas</th>
                <th className="py-3.5 px-5">Versión / Estado</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133E50]/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Cargando propuestas comerciales...
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No se encontraron propuestas con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                proposals.map((p) => (
                  <tr key={p.id} className="hover:bg-[#061D28]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{p.client?.tradeName || "Cliente"}</div>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">{p.proposalCode}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-300 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-200">
                      USD {p.monthlyPrice}
                    </td>
                    <td className="py-4 px-5 text-slate-300 text-xs">
                      {p.includedHours} horas
                    </td>
                    <td className="py-4 px-5 space-y-1">
                      <div>{statusBadge(p.status)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">v{p.currentVersion}</div>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/p/${p.slug}`}
                        target="_blank"
                        title="Ver enlace público"
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-white bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/api/public/proposals/${p.slug}/export?format=html`}
                        target="_blank"
                        title="Exportar HTML autónomo"
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-cyan-300 bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleCopyLink(p.slug)}
                        title="Copiar enlace público"
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-cyan-300 bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDuplicateTarget(p)}
                        title="Duplicar propuesta"
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-amber-300 bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/proposals/${p.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[#1F7A8C] hover:bg-[#196270] rounded-lg transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación para duplicar */}
      <ConfirmModal
        isOpen={!!duplicateTarget}
        onClose={() => setDuplicateTarget(null)}
        onConfirm={executeDuplicate}
        title="¿Duplicar Propuesta Comercial?"
        description={`Se generará un nuevo borrador editable a partir de "${duplicateTarget?.title || ""}" con un nuevo código correlativo.`}
        confirmText="Duplicar Propuesta"
        cancelText="Cancelar"
        variant="primary"
        loading={duplicating}
      />
    </div>
  );
}
