"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Plus, Check, X, Shield, Settings2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ToolDef {
  id: string;
  name: string;
  category: string;
  description: string;
  supportLevel: string;
  defaultIncluded: boolean;
  defaultIncludedInHours: boolean;
  requiresApproval: boolean;
  separateQuote: boolean;
  licenseIncluded: boolean;
  isCustom: boolean;
  isActive: boolean;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "Soporte especializado",
    description: "",
    supportLevel: "Estándar",
    defaultIncluded: true,
    defaultIncludedInHours: true,
    requiresApproval: false,
    separateQuote: false,
    licenseIncluded: false,
    notes: "",
  });

  const loadTools = async () => {
    try {
      const res = await fetch("/api/internal/tools");
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err) {
      console.error("Error loading tools:", err);
      toast.error("Error al cargar el catálogo de herramientas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/internal/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(`Herramienta "${formData.name}" registrada exitosamente.`);
        setModalOpen(false);
        setFormData({
          name: "",
          category: "Soporte especializado",
          description: "",
          supportLevel: "Estándar",
          defaultIncluded: true,
          defaultIncludedInHours: true,
          requiresApproval: false,
          separateQuote: false,
          licenseIncluded: false,
          notes: "",
        });
        loadTools();
      } else {
        const d = await res.json();
        toast.error(d.error || "No se pudo registrar la herramienta.");
      }
    } catch (err) {
      console.error("Failed to create tool:", err);
      toast.error("Error de conexión al registrar la herramienta.");
    }
  };

  const toggleActive = async (tool: ToolDef) => {
    try {
      await fetch("/api/internal/tools", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tool.id, isActive: !tool.isActive }),
      });
      toast.info(!tool.isActive ? `"${tool.name}" activada.` : `"${tool.name}" desactivada.`);
      loadTools();
    } catch (err) {
      console.error("Failed to toggle tool:", err);
      toast.error("Error al cambiar el estado de la herramienta.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Catálogo Maestro de Herramientas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión de plataformas de soporte y servicios preconfigurados
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nueva Herramienta Personalizada
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Cargando catálogo...
          </div>
        ) : (
          tools.map((t) => (
            <div
              key={t.id}
              className={`bg-[#091D27] border rounded-2xl p-5 space-y-3 transition-colors ${
                t.isActive ? "border-[#133E50]" : "border-[#133E50]/40 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-base">{t.name}</h3>
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {t.category}
                  </span>
                </div>
                {t.isCustom && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Personalizada
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {t.description}
              </p>

              <div className="pt-2 border-t border-[#133E50]/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Nivel: {t.supportLevel}</span>
                <button
                  onClick={() => toggleActive(t)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    t.isActive
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {t.isActive ? "Activa" : "Inactiva"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Herramienta */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Nueva Herramienta Personalizada
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Servidor NAS Synology"
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Categoría *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ej: Almacenamiento, Respaldo, Servidores"
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descripción del Alcance *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre lo que cubre el soporte técnico de esta herramienta..."
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#06131A] text-slate-400 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1F7A8C] hover:bg-[#196270] text-white font-semibold rounded-lg"
                >
                  Crear en Base de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
