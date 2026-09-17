"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES" | "VIEWER";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/internal/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/internal/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Clientes", href: "/clients", icon: Users },
    { label: "Propuestas", href: "/proposals", icon: FileText },
    { label: "Herramientas", href: "/tools", icon: Wrench },
    { label: "Auditoría", href: "/audit", icon: ShieldAlert, adminOnly: true },
    { label: "Ajustes", href: "/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030A0E] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Cargando panel de Net &amp; Soft...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030A0E] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#06131A] border-b border-[#133E50]">
        <Logo variant="dark" width={140} height={32} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-[#091D27]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-[#06131A] border-r border-[#133E50] flex flex-col transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-[#133E50]/60 hidden md:block">
          <Logo variant="dark" width={180} height={40} />
          <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-widest mt-2">
            Proposal Builder
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "ADMIN") return null;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1F7A8C] text-white shadow-lg shadow-cyan-950/40"
                    : "text-slate-400 hover:text-white hover:bg-[#091D27]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#133E50]/60 bg-[#040D12]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1F7A8C]/20 border border-[#1F7A8C]/40 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
