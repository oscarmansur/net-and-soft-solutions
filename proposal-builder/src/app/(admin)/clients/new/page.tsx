"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, Building2, User, Mail, Phone, MapPin, Monitor } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    legalName: "",
    tradeName: "",
    taxId: "",
    contactName: "",
    contactPosition: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    country: "Venezuela",
    state: "",
    city: "",
    address: "",
    website: "",
    instagram: "",
    industry: "",
    numberOfUsers: "",
    numberOfComputers: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/internal/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar cliente");
        toast.error(data.error || "Error al registrar cliente");
        setLoading(false);
        return;
      }

      toast.success(`Cliente "${data.client.tradeName}" registrado con éxito.`);
      router.push(`/clients/${data.client.id}`);
    } catch {
      setError("Error de red al guardar el cliente");
      toast.error("Error de red al guardar el cliente");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="p-2 text-slate-400 hover:text-white bg-[#091D27] border border-[#133E50] rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            Registrar Nuevo Cliente
          </h1>
          <p className="text-sm text-slate-400">
            Complete los datos comerciales y de infraestructura del cliente
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Identificación de la Empresa */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm border-b border-[#133E50] pb-3">
            <Building2 className="w-4 h-4" />
            Datos de la Empresa
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre Comercial *
              </label>
              <input
                type="text"
                name="tradeName"
                required
                value={formData.tradeName}
                onChange={handleChange}
                placeholder="Ej: Bimoto Imperio"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Razón Social *
              </label>
              <input
                type="text"
                name="legalName"
                required
                value={formData.legalName}
                onChange={handleChange}
                placeholder="Ej: Bimoto Imperio C.A."
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Identificación Fiscal (RIF / NIF) *
              </label>
              <input
                type="text"
                name="taxId"
                required
                value={formData.taxId}
                onChange={handleChange}
                placeholder="Ej: J-41234567-8"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Sector / Rubro
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Ej: Automotriz, Retail, Contabilidad"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contacto y Comunicaciones */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm border-b border-[#133E50] pb-3">
            <User className="w-4 h-4" />
            Contacto Principal y Comunicaciones
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre de Contacto *
              </label>
              <input
                type="text"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Ej: Carlos Mendoza"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cargo del Contacto
              </label>
              <input
                type="text"
                name="contactPosition"
                value={formData.contactPosition}
                onChange={handleChange}
                placeholder="Ej: Gerente General"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contacto@empresa.com"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Teléfono Principal *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+58 414 1234567"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Infraestructura y Equipos */}
        <div className="bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm border-b border-[#133E50] pb-3">
            <Monitor className="w-4 h-4" />
            Infraestructura Estimada y Notas
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cantidad de Usuarios
              </label>
              <input
                type="number"
                name="numberOfUsers"
                value={formData.numberOfUsers}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cantidad de Equipos / Computadoras
              </label>
              <input
                type="number"
                name="numberOfComputers"
                value={formData.numberOfComputers}
                onChange={handleChange}
                placeholder="15"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Dirección Física
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Av. Principal, Edificio Corporativo, Piso 3"
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notas Internas
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Información sobre sistemas contables utilizados, requerimientos específicos..."
                className="w-full px-3.5 py-2.5 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/clients"
            className="px-5 py-2.5 bg-[#06131A] hover:bg-[#133E50] text-slate-300 text-sm font-medium rounded-xl transition-colors border border-[#133E50]"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : "Guardar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
