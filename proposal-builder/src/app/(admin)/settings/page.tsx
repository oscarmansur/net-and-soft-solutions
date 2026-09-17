"use client";

import React from "react";
import { Settings, Shield, Globe, Send, Key, Database, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
          Ajustes del Sistema
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Parámetros de despliegue, seguridad y canales de integración
        </p>
      </div>

      <div className="space-y-6">
        {/* Dominio y Subdominio */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Entorno y Dominios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#06131A] rounded-xl border border-[#133E50]">
              <span className="text-slate-400 block">Dominio Corporativo Principal:</span>
              <span className="text-white font-semibold">https://netandsoft.com.ve/</span>
            </div>
            <div className="p-3.5 bg-[#06131A] rounded-xl border border-[#133E50]">
              <span className="text-slate-400 block">Subdominio de la Aplicación:</span>
              <span className="text-cyan-400 font-semibold">https://cotiza.netandsoft.com.ve</span>
            </div>
          </div>
        </div>

        {/* Seguridad Activa */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Capas de Seguridad Activas
          </h2>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2.5 bg-[#06131A] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Honeypot Indetectable:</strong> Campo <code className="text-cyan-400 font-mono">company_website</code> con CSS absoluto fuera de pantalla.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#06131A] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Tokens Firmados HMAC-SHA256:</strong> Con comprobación de tiempo mínimo de llenado (&gt;= 3 segundos).</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#06131A] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Argon2id:</strong> Hashing criptográfico de contraseñas (64MB, 3 iteraciones, 1 hilo).</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#06131A] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Protección contra Fuerza Bruta:</strong> Bloqueo automático por 15 minutos tras 5 intentos fallidos.</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-[#06131A] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Rate Limiting:</strong> 5 intentos / 10 min por IP y propuesta; 10 / hora global.</span>
            </div>
          </div>
        </div>

        {/* Integración GoHighLevel */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            Integración con GoHighLevel
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            La integración con GoHighLevel se gestiona de forma estricta y segura a través de Route Handlers en el backend con claves de idempotencia para evitar duplicados. Se activa configurando <code className="text-cyan-400 font-mono">GHL_ENABLED=true</code> en las variables de entorno del servidor.
          </p>
        </div>
      </div>
    </div>
  );
}
