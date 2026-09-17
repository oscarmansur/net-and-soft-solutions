"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/internal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión.");
        setLoading(false);
        return;
      }

      // Redireccionar al panel administrativo
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión con el servidor de autenticación.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#021822] via-[#030A0E] to-[#011117] relative overflow-hidden">
      {/* Background glowing atmospheric circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#1F7A8C]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Card */}
        <div className="bg-[#091D27]/80 backdrop-blur-xl border border-[#133E50] rounded-2xl p-8 shadow-2xl shadow-black/60">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-5">
              <Logo variant="dark" height={42} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Proposal Builder
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Acceso exclusivo para el equipo de Net &amp; Soft Solutions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@netandsoft.com.ve"
                  className="w-full pl-10 pr-4 py-3 bg-[#06131A] border border-[#133E50] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#06131A] border border-[#133E50] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                <>
                  Ingresar al Sistema
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#133E50]/50 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Protección Argon2id
            </span>
            <span>Dominio: netandsoft.com.ve</span>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-600">
          © {new Date().getFullYear()} Net &amp; Soft Solutions C.A. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
