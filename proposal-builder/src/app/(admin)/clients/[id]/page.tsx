"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Mail, Phone, MapPin, Building, FileText, Monitor, Users, ExternalLink } from "lucide-react";

interface ClientDetail {
  id: string;
  tradeName: string;
  legalName: string;
  taxId: string;
  contactName: string;
  contactPosition: string | null;
  email: string;
  phone: string;
  secondaryPhone: string | null;
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
  industry: string | null;
  numberOfUsers: number | null;
  numberOfComputers: number | null;
  notes: string | null;
  proposals: Array<{
    id: string;
    proposalCode: string;
    slug: string;
    title: string;
    status: string;
    monthlyPrice: number;
    includedHours: number;
    updatedAt: string;
  }>;
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClient() {
      try {
        const res = await fetch(`/api/internal/clients/${id}`);
        const data = await res.json();
        if (data.success) {
          setClient(data.client);
        }
      } catch (err) {
        console.error("Error loading client:", err);
      } finally {
        setLoading(false);
      }
    }
    loadClient();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Cargando perfil del cliente...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Cliente no encontrado.</p>
        <Link href="/clients" className="text-cyan-400 mt-2 inline-block">
          Volver al directorio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="p-2 text-slate-400 hover:text-white bg-[#091D27] border border-[#133E50] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
              {client.tradeName}
            </h1>
            <p className="text-sm text-cyan-400 font-mono mt-0.5">{client.taxId} — {client.legalName}</p>
          </div>
        </div>

        <Link
          href={`/proposals/new?clientId=${client.id}`}
          className="px-4 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Crear Propuesta para {client.tradeName}
        </Link>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 border-b border-[#133E50] pb-2">
            Contacto Principal
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-white font-medium">{client.contactName}</div>
              <div className="text-xs text-slate-400">{client.contactPosition || "Representante Comercial"}</div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{client.phone}</span>
            </div>
            {client.address && (
              <div className="flex items-start gap-2 text-slate-300 text-xs pt-2 border-t border-[#133E50]/50">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{client.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Infrastructure Info */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 border-b border-[#133E50] pb-2">
            Infraestructura
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Usuarios de red
              </span>
              <span className="text-base font-bold text-white">
                {client.numberOfUsers ? `${client.numberOfUsers} usuarios` : "No especificado"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-slate-400" />
                Equipos / PCs
              </span>
              <span className="text-base font-bold text-white">
                {client.numberOfComputers ? `${client.numberOfComputers} equipos` : "No especificado"}
              </span>
            </div>
            <div className="text-xs text-slate-400 pt-2 border-t border-[#133E50]/50">
              <span className="font-semibold text-slate-300">Rubro:</span> {client.industry || "Servicios"}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 border-b border-[#133E50] pb-2">
            Notas y Contexto
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {client.notes || "Sin notas adicionales registradas para este cliente."}
          </p>
        </div>
      </div>

      {/* Associated Proposals */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        <div className="p-5 border-b border-[#133E50] flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Propuestas Asociadas ({client.proposals.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#06131A] text-slate-400 text-xs uppercase tracking-wider border-b border-[#133E50]">
              <tr>
                <th className="py-3.5 px-5">Código / Título</th>
                <th className="py-3.5 px-5">Precio Mensual</th>
                <th className="py-3.5 px-5">Horas</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133E50]/40">
              {client.proposals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Aún no hay propuestas creadas para este cliente.
                  </td>
                </tr>
              ) : (
                client.proposals.map((prop) => (
                  <tr key={prop.id} className="hover:bg-[#061D28]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{prop.title}</div>
                      <div className="text-xs text-cyan-400 font-mono mt-0.5">{prop.proposalCode}</div>
                    </td>
                    <td className="py-4 px-5 font-semibold text-slate-200">
                      USD {prop.monthlyPrice}
                    </td>
                    <td className="py-4 px-5 text-slate-300">
                      {prop.includedHours} horas
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <Link
                        href={`/p/${prop.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#06131A] border border-[#133E50] rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
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
