"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface DashboardStats {
  proposalsCount: number;
  acceptedCount: number;
  clientsCount: number;
  totalMonthlyVolume: number;
}

interface ProposalItem {
  id: string;
  proposalCode: string;
  slug: string;
  title: string;
  status: string;
  monthlyPrice: number;
  includedHours: number;
  client: { tradeName: string };
  updatedAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    proposalsCount: 0,
    acceptedCount: 0,
    clientsCount: 0,
    totalMonthlyVolume: 0,
  });
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [propRes, clientRes] = await Promise.all([
          fetch("/api/internal/proposals?limit=6"),
          fetch("/api/internal/clients?limit=1"),
        ]);

        const propData = await propRes.json();
        const clientData = await clientRes.json();

        const items: ProposalItem[] = propData.items || [];
        setProposals(items);

        const accepted = items.filter((p) => p.status === "ACCEPTED").length;
        const volume = items.reduce((acc, p) => acc + Number(p.monthlyPrice || 0), 0);

        setStats({
          proposalsCount: propData.total || items.length,
          acceptedCount: accepted,
          clientsCount: clientData.total || 0,
          totalMonthlyVolume: volume,
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Panel de Control
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión comercial y propuestas interactivas de Net &amp; Soft Solutions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/clients/new"
            className="px-4 py-2.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-200 text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            Nuevo Cliente
          </Link>
          <Link
            href="/proposals/new"
            className="px-4 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Propuesta
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Propuestas Creadas</span>
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {loading ? "..." : stats.proposalsCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Registradas en el sistema</div>
        </div>

        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Aceptaciones</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-heading">
            {loading ? "..." : stats.acceptedCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Confirmadas por clientes</div>
        </div>

        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Clientes CRM</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {loading ? "..." : stats.clientsCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Empresas registradas</div>
        </div>

        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Volumen Cotizado</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-heading">
            {loading ? "..." : `USD ${stats.totalMonthlyVolume.toLocaleString()}`}
          </div>
          <div className="text-xs text-slate-400 mt-1">Suma de precios mensuales</div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-5 border-b border-[#133E50] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Propuestas Recientes</h2>
            <p className="text-xs text-slate-400">Últimas cotizaciones preparadas y publicadas</p>
          </div>
          <Link
            href="/proposals"
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#06131A] text-slate-400 text-xs uppercase tracking-wider border-b border-[#133E50]">
              <tr>
                <th className="py-3.5 px-5">Código / Cliente</th>
                <th className="py-3.5 px-5">Precio Mensual</th>
                <th className="py-3.5 px-5">Horas</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133E50]/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Cargando propuestas...
                  </td>
                </tr>
              ) : proposals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No hay propuestas registradas. Cree una nueva para comenzar.
                  </td>
                </tr>
              ) : (
                proposals.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#061D28]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{prop.client.tradeName}</div>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">{prop.proposalCode}</div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-200">
                      USD {prop.monthlyPrice}
                    </td>
                    <td className="py-4 px-5 text-slate-300">
                      {prop.includedHours} horas
                    </td>
                    <td className="py-4 px-5">
                      {statusBadge(prop.status)}
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <Link
                        href={`/p/${prop.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Pública
                      </Link>
                      <Link
                        href={`/proposals/${prop.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#1F7A8C] hover:bg-[#196270] rounded-lg transition-colors"
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
    </div>
  );
}
