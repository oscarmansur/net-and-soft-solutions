"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Mail, Phone, Building, ExternalLink, FileText } from "lucide-react";
import { ClientData } from "@/types/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadClients = async (query = "") => {
    setLoading(true);
    try {
      const url = query ? `/api/internal/clients?search=${encodeURIComponent(query)}` : "/api/internal/clients";
      const res = await fetch(url);
      const data = await res.json();
      setClients(data.items || []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadClients(search);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Directorio de Clientes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión de empresas, contactos y cuentas corporativas
          </p>
        </div>

        <Link
          href="/clients/new"
          className="px-4 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Registrar Cliente
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-4 flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre comercial, RIF, correo o teléfono..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </form>
        <button
          onClick={() => loadClients(search)}
          className="px-4 py-2.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-sm font-medium rounded-xl transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#06131A] text-slate-400 text-xs uppercase tracking-wider border-b border-[#133E50]">
              <tr>
                <th className="py-3.5 px-5">Empresa / RIF</th>
                <th className="py-3.5 px-5">Contacto Principal</th>
                <th className="py-3.5 px-5">Comunicaciones</th>
                <th className="py-3.5 px-5 text-center">Propuestas</th>
                <th className="py-3.5 px-5 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133E50]/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Cargando directorio de clientes...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No se encontraron clientes con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id} className="hover:bg-[#061D28]/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{c.tradeName}</div>
                      <div className="text-xs text-slate-400">{c.legalName}</div>
                      <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{c.taxId}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-slate-200 font-medium">{c.contactName}</div>
                      <div className="text-xs text-slate-400">{c.contactPosition || "Representante"}</div>
                    </td>
                    <td className="py-4 px-5 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {c.proposalsCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/clients/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#06131A] hover:bg-[#133E50] border border-[#133E50] rounded-lg transition-colors"
                      >
                        Ver Perfil
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
