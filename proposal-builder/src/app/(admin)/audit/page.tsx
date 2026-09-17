"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, User, Clock, Filter, AlertTriangle } from "lucide-react";

interface AuditLogRow {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  anonymousIpHash: string;
  timestamp: string;
  user?: { name: string; email: string; role: string } | null;
  metadata?: any;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/internal/audit");
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Error loading audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getActionBadge = (action: string) => {
    if (action.includes("blocked") || action.includes("failed")) {
      return (
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          {action}
        </span>
      );
    }
    if (action.includes("published") || action.includes("accepted")) {
      return (
        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
        {action}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
          Bitácora de Auditoría y Seguridad
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Registro inmutable de accesos, modificaciones, publicaciones e intentos bloqueados
        </p>
      </div>

      <div className="bg-[#091D27] border border-[#133E50] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#06131A] text-slate-400 text-xs uppercase tracking-wider border-b border-[#133E50]">
              <tr>
                <th className="py-3.5 px-5">Acción</th>
                <th className="py-3.5 px-5">Entidad</th>
                <th className="py-3.5 px-5">Usuario / IP Anonimizada</th>
                <th className="py-3.5 px-5">Fecha / Hora (UTC)</th>
                <th className="py-3.5 px-5">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133E50]/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Cargando bitácora de seguridad...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No se registran eventos de auditoría recientes.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#061D28]/40 transition-colors">
                    <td className="py-3.5 px-5 font-semibold">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-300">
                      {log.entityType}
                    </td>
                    <td className="py-3.5 px-5">
                      {log.user ? (
                        <div>
                          <span className="font-semibold text-white">{log.user.name}</span>
                          <span className="text-[11px] text-slate-400 block">{log.user.email}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-cyan-400">
                          {log.anonymousIpHash.slice(0, 16)}...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
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
