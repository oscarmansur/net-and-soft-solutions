"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { ProposalFormData, WizardStepId, ToolItem, ActivityItem } from "@/types/proposal";
import { calculatePricing, formatCleanNumber } from "@/lib/calculations";
import {
  INITIAL_TOOLS,
  INITIAL_ACTIVITIES,
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "@/lib/catalog-data";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Save,
  Send,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  RotateCcw,
  Copy,
  ExternalLink,
  Download,
  Wrench,
  Clock,
  DollarSign,
  FileText,
  Settings2,
} from "lucide-react";

interface ClientOption {
  id: string;
  tradeName: string;
  legalName: string;
  taxId: string;
  contactName: string;
  contactPosition?: string;
  email: string;
  phone: string;
}

interface ProposalWizardProps {
  initialProposal?: any;
  preselectedClientId?: string;
}

export function ProposalWizard({
  initialProposal,
  preselectedClientId,
}: ProposalWizardProps) {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStepId>(1);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);

  // Device preview mode
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Publishing modal / status
  const [publishing, setPublishing] = useState(false);
  const [changelog, setChangelog] = useState("");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const toast = useToast();

  // Custom tool modal state
  const [isCustomToolModalOpen, setIsCustomToolModalOpen] = useState(false);
  const [newCustomTool, setNewCustomTool] = useState({
    name: "",
    category: "Soporte especializado",
    description: "",
    supportLevel: "Estándar",
    included: true,
    includedInHours: true,
    notes: "",
  });

  // Custom items state for Steps 5, 6, 8
  const [newIncludedService, setNewIncludedService] = useState({
    title: "",
    description: "",
    category: "Soporte General",
  });
  const [showAddIncluded, setShowAddIncluded] = useState(false);

  const [newExcludedService, setNewExcludedService] = useState({
    title: "",
    description: "",
    separateQuoteNotice: "Requiere cotización formal y aprobación previa.",
  });
  const [showAddExcluded, setShowAddExcluded] = useState(false);

  const [newTerm, setNewTerm] = useState("");
  const [showAddTerm, setShowAddTerm] = useState(false);

  // Estados de edición en línea
  const [editingToolIndex, setEditingToolIndex] = useState<number | null>(null);
  const [editingToolData, setEditingToolData] = useState<ToolItem | null>(null);

  const [editingIncludedId, setEditingIncludedId] = useState<string | null>(null);
  const [editingIncludedData, setEditingIncludedData] = useState<{ title: string; category: string; description: string } | null>(null);

  const [editingExcludedId, setEditingExcludedId] = useState<string | null>(null);
  const [editingExcludedData, setEditingExcludedData] = useState<{ title: string; description: string; separateQuoteNotice: string } | null>(null);

  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null);
  const [editingActivityData, setEditingActivityData] = useState<ActivityItem | null>(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<ActivityItem>({
    name: "",
    category: "Soporte",
    description: "",
    minMinutes: 30,
    maxMinutes: 60,
    consumesHours: true,
    included: true,
    requiresApproval: false,
    separateQuote: false,
    displayOrder: 0,
  });

  const [editingTermIndex, setEditingTermIndex] = useState<number | null>(null);
  const [editingTermText, setEditingTermText] = useState("");

  // Form Data
  const [formData, setFormData] = useState<ProposalFormData>(() => {
    if (initialProposal) {
      return {
        id: initialProposal.id,
        proposalCode: initialProposal.proposalCode,
        slug: initialProposal.slug,
        title: initialProposal.title,
        clientId: initialProposal.clientId,
        status: initialProposal.status,
        currentVersion: initialProposal.currentVersion,
        monthlyPrice: Number(initialProposal.monthlyPrice),
        includedHours: Number(initialProposal.includedHours),
        extraHourPrice: Number(initialProposal.extraHourPrice),
        alertPercentage: initialProposal.alertPercentage,
        usedHours: Number(initialProposal.usedHours || 0),
        rolloverEnabled: initialProposal.rolloverEnabled,
        currency: initialProposal.currency || "USD",
        billingFrequency: initialProposal.billingFrequency || "Mensual",
        paymentTerms: initialProposal.paymentTerms || "Prepago los primeros 5 días",
        validityDays: initialProposal.validityDays || 15,
        publishedAt: initialProposal.publishedAt,
        expiresAt: initialProposal.expiresAt,
        tools: Array.isArray(initialProposal.tools) ? initialProposal.tools : INITIAL_TOOLS,
        activities: Array.isArray(initialProposal.activities) ? initialProposal.activities : INITIAL_ACTIVITIES,
        includedServices: Array.isArray(
          typeof (initialProposal as any).scopeData === "string"
            ? JSON.parse((initialProposal as any).scopeData || "{}").includedServices
            : (initialProposal as any).scopeData?.includedServices
        )
          ? (typeof (initialProposal as any).scopeData === "string"
              ? JSON.parse((initialProposal as any).scopeData || "{}").includedServices
              : (initialProposal as any).scopeData?.includedServices)
          : Array.isArray((initialProposal.versions?.[0]?.snapshotData as any)?.includedServices)
          ? (initialProposal.versions[0].snapshotData as any).includedServices
          : INITIAL_INCLUDED_SERVICES,
        excludedServices: Array.isArray(
          typeof (initialProposal as any).scopeData === "string"
            ? JSON.parse((initialProposal as any).scopeData || "{}").excludedServices
            : (initialProposal as any).scopeData?.excludedServices
        )
          ? (typeof (initialProposal as any).scopeData === "string"
              ? JSON.parse((initialProposal as any).scopeData || "{}").excludedServices
              : (initialProposal as any).scopeData?.excludedServices)
          : Array.isArray((initialProposal.versions?.[0]?.snapshotData as any)?.excludedServices)
          ? (initialProposal.versions[0].snapshotData as any).excludedServices
          : INITIAL_EXCLUDED_SERVICES,
        termsAndConditions: Array.isArray(
          typeof (initialProposal as any).scopeData === "string"
            ? JSON.parse((initialProposal as any).scopeData || "{}").termsAndConditions
            : (initialProposal as any).scopeData?.termsAndConditions
        )
          ? (typeof (initialProposal as any).scopeData === "string"
              ? JSON.parse((initialProposal as any).scopeData || "{}").termsAndConditions
              : (initialProposal as any).scopeData?.termsAndConditions)
          : Array.isArray((initialProposal.versions?.[0]?.snapshotData as any)?.termsAndConditions)
          ? (initialProposal.versions[0].snapshotData as any).termsAndConditions
          : INITIAL_TERMS,
        design:
          (typeof (initialProposal as any).scopeData === "string"
            ? JSON.parse((initialProposal as any).scopeData || "{}").design
            : (initialProposal as any).scopeData?.design) || {},
        ctaSettings: (initialProposal as any).scopeData?.ctaSettings || {
          enableAcceptance: true,
          enableRequestChanges: true,
          enableReject: true,
          requireSignature: false,
          disclaimerText: "Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.",
        },
      };
    }

    return {
      proposalCode: "",
      slug: "",
      title: "Propuesta de Soporte y Continuidad Tecnológica Integral",
      clientId: preselectedClientId || "",
      status: "DRAFT",
      currentVersion: 1,
      monthlyPrice: 120,
      includedHours: 20,
      extraHourPrice: 10,
      alertPercentage: 80,
      usedHours: 0,
      rolloverEnabled: false,
      currency: "USD",
      billingFrequency: "Mensual",
      paymentTerms: "Prepago dentro de los primeros 5 días del mes",
      validityDays: 15,
      tools: INITIAL_TOOLS,
      activities: INITIAL_ACTIVITIES,
      includedServices: INITIAL_INCLUDED_SERVICES,
      excludedServices: INITIAL_EXCLUDED_SERVICES,
      termsAndConditions: INITIAL_TERMS,
      design: {},
      ctaSettings: {
        enableAcceptance: true,
        enableRequestChanges: true,
        enableReject: true,
        requireSignature: false,
        disclaimerText: "Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.",
      },
    };
  });

  // Cargar clientes registrados
  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/internal/clients?limit=100");
        const data = await res.json();
        const items: ClientOption[] = data.items || [];
        setClients(items);

        if (initialProposal?.clientId) {
          const matched = items.find((c) => c.id === initialProposal.clientId);
          if (matched) setSelectedClient(matched);
        } else if (preselectedClientId) {
          const matched = items.find((c) => c.id === preselectedClientId);
          if (matched) {
            setSelectedClient(matched);
            setFormData((prev) => ({
              ...prev,
              clientId: matched.id,
              title: `Propuesta de Soporte IT para ${matched.tradeName}`,
            }));
          }
        }
      } catch (err) {
        console.error("Error loading clients in wizard:", err);
      }
    }
    loadClients();
  }, [initialProposal, preselectedClientId]);

  // Guardado inmediato síncrono (manual bajo demanda o ejecutado por autoguardado)
  const saveProposalNow = async (dataToSave: ProposalFormData, showToast = false) => {
    if (!dataToSave.clientId) {
      if (showToast) {
        toast.warning("Debe seleccionar un cliente antes de guardar el borrador.", "Cliente Requerido");
      }
      return null;
    }

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    setSaveStatus("saving");

    try {
      const res = await fetch("/api/internal/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      const result = await res.json();

      if (!res.ok) {
        setSaveStatus("error");
        setSaveError(result.error || "Error al guardar borrador");
        if (showToast) {
          toast.error(result.error || "Error al guardar borrador.", "Error al Guardar");
        }
        return null;
      }

      const savedProposal = result.proposal;
      if (savedProposal?.id && !dataToSave.id) {
        // Si era nueva propuesta, actualizar ID y slug en URL sin recargar
        setFormData((prev) => ({
          ...prev,
          id: savedProposal.id,
          proposalCode: savedProposal.proposalCode,
          slug: savedProposal.slug,
        }));
        window.history.replaceState(null, "", `/proposals/${savedProposal.id}/edit`);
      }

      setSaveStatus("saved");
      setSaveError(null);

      if (showToast) {
        toast.success("Modificaciones guardadas exitosamente en la base de datos.", "Borrador Guardado");
      }

      return savedProposal;
    } catch {
      setSaveStatus("error");
      setSaveError("Error de conexión al guardar.");
      if (showToast) {
        toast.error("Error de conexión al guardar los cambios.", "Error de Red");
      }
      return null;
    }
  };

  // Manejo de autoguardado con debounce (1000ms)
  const triggerAutoSave = (dataToSave: ProposalFormData) => {
    if (!dataToSave.clientId) return; // Requiere cliente

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setSaveStatus("saving");

    autosaveTimerRef.current = setTimeout(() => {
      saveProposalNow(dataToSave, false);
    }, 1000);
  };

  const updateFormData = (patch: Partial<ProposalFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...patch };
      triggerAutoSave(next);
      return next;
    });
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    updateFormData({
      clientId,
      title: client ? `Propuesta de Soporte IT para ${client.tradeName}` : formData.title,
    });
  };

  // Cálculo en vivo de precios
  const pricingCalculations = calculatePricing({
    monthlyPrice: Number(formData.monthlyPrice),
    includedHours: Number(formData.includedHours),
    extraHourPrice: Number(formData.extraHourPrice),
    alertPercentage: formData.alertPercentage,
    usedHours: formData.usedHours,
    currency: formData.currency,
  });

  // Publicar propuesta
  const handlePublish = async () => {
    setPublishing(true);
    try {
      // 1. Asegurar guardado previo de los cambios actuales
      const saved = await saveProposalNow(formData, false);
      const targetId = saved?.id || formData.id;

      if (!targetId) {
        toast.warning("Debe seleccionar un cliente antes de publicar.", "Publicación Requerida");
        setPublishing(false);
        return;
      }

      // 2. Enviar publicación pasando los datos actuales del formulario
      const res = await fetch(`/api/internal/proposals/${targetId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          changelog,
          proposalData: formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al publicar", "Publicación Fallida");
        setPublishing(false);
        return;
      }

      setIsPublishModalOpen(false);
      toast.success("¡Propuesta publicada exitosamente con versión inmutable!", "Propuesta Publicada");
      router.push(`/p/${data.proposal.slug}`);
    } catch {
      toast.error("Error de red al publicar.", "Error de Conexión");
      setPublishing(false);
    }
  };

  // Añadir herramienta personalizada
  const handleCreateCustomTool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/internal/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomTool),
      });
      const data = await res.json();
      if (data.success) {
        const toolToAdd: ToolItem = {
          name: data.tool.name,
          category: data.tool.category,
          description: data.tool.description,
          supportLevel: data.tool.supportLevel,
          included: data.tool.defaultIncluded,
          includedInHours: data.tool.defaultIncludedInHours,
          requiresApproval: data.tool.requiresApproval,
          separateQuote: data.tool.separateQuote,
          licenseIncluded: data.tool.licenseIncluded,
          notes: data.tool.notes || undefined,
          displayOrder: formData.tools.length + 1,
        };

        updateFormData({
          tools: [...formData.tools, toolToAdd],
        });

        setIsCustomToolModalOpen(false);
        toast.success(`Herramienta "${newCustomTool.name}" agregada.`);
        setNewCustomTool({
          name: "",
          category: "Soporte especializado",
          description: "",
          supportLevel: "Estándar",
          included: true,
          includedInHours: true,
          notes: "",
        });
      }
    } catch (err) {
      console.error("Failed to add custom tool:", err);
      toast.error("No se pudo agregar la herramienta.");
    }
  };

  // Handlers para Herramientas (Paso 4)
  const handleSaveEditTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingToolIndex === null || !editingToolData) return;
    const updated = [...formData.tools];
    updated[editingToolIndex] = { ...editingToolData };
    updateFormData({ tools: updated });
    setEditingToolIndex(null);
    setEditingToolData(null);
    toast.success(`Herramienta "${editingToolData.name}" actualizada.`);
  };

  const handleRemoveTool = (index: number) => {
    const updated = formData.tools.filter((_, idx) => idx !== index);
    updateFormData({ tools: updated });
    toast.info("Herramienta removida de la propuesta.");
  };

  const handleResetTools = () => {
    updateFormData({ tools: INITIAL_TOOLS });
    toast.success("Catálogo de herramientas restaurado a valores por defecto.");
  };

  // Handlers para Servicios Incluidos (Paso 5)
  const handleAddIncludedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncludedService.title.trim()) return;
    const newItem = {
      id: `inc-${Date.now()}`,
      title: newIncludedService.title.trim(),
      description: newIncludedService.description.trim(),
      category: newIncludedService.category.trim() || "Soporte General",
    };
    updateFormData({ includedServices: [...formData.includedServices, newItem] });
    setNewIncludedService({ title: "", description: "", category: "Soporte General" });
    setShowAddIncluded(false);
    toast.success(`Servicio "${newItem.title}" incluido en el alcance.`);
  };

  const handleSaveEditIncluded = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIncludedId || !editingIncludedData || !editingIncludedData.title.trim()) return;
    const updated = formData.includedServices.map((s) =>
      s.id === editingIncludedId
        ? {
            ...s,
            title: editingIncludedData.title.trim(),
            category: editingIncludedData.category.trim() || "Soporte General",
            description: editingIncludedData.description.trim(),
          }
        : s
    );
    updateFormData({ includedServices: updated });
    setEditingIncludedId(null);
    setEditingIncludedData(null);
    toast.success("Servicio incluido actualizado.");
  };

  const handleRemoveIncludedService = (id: string) => {
    updateFormData({
      includedServices: formData.includedServices.filter((s) => s.id !== id),
    });
    toast.info("Servicio removido del alcance.");
  };

  const handleResetIncluded = () => {
    updateFormData({ includedServices: INITIAL_INCLUDED_SERVICES });
    toast.success("Servicios incluidos restaurados a valores por defecto.");
  };

  // Handlers para Servicios No Incluidos (Paso 6)
  const handleAddExcludedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExcludedService.title.trim()) return;
    const newItem = {
      id: `exc-${Date.now()}`,
      title: newExcludedService.title.trim(),
      description: newExcludedService.description.trim(),
      separateQuoteNotice: newExcludedService.separateQuoteNotice.trim() || "Requiere cotización formal y aprobación previa.",
    };
    updateFormData({ excludedServices: [...formData.excludedServices, newItem] });
    setNewExcludedService({
      title: "",
      description: "",
      separateQuoteNotice: "Requiere cotización formal y aprobación previa.",
    });
    setShowAddExcluded(false);
    toast.info(`Exclusión "${newItem.title}" registrada.`);
  };

  const handleSaveEditExcluded = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExcludedId || !editingExcludedData || !editingExcludedData.title.trim()) return;
    const updated = formData.excludedServices.map((s) =>
      s.id === editingExcludedId
        ? {
            ...s,
            title: editingExcludedData.title.trim(),
            description: editingExcludedData.description.trim(),
            separateQuoteNotice: editingExcludedData.separateQuoteNotice.trim() || "Requiere cotización formal y aprobación previa.",
          }
        : s
    );
    updateFormData({ excludedServices: updated });
    setEditingExcludedId(null);
    setEditingExcludedData(null);
    toast.success("Exclusión de servicio actualizada.");
  };

  const handleRemoveExcludedService = (id: string) => {
    updateFormData({
      excludedServices: formData.excludedServices.filter((s) => s.id !== id),
    });
    toast.info("Exclusión removida.");
  };

  const handleResetExcluded = () => {
    updateFormData({ excludedServices: INITIAL_EXCLUDED_SERVICES });
    toast.success("Servicios excluidos restaurados a valores por defecto.");
  };

  // Handlers para Actividades y Tiempos (Paso 7)
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.name.trim()) return;
    updateFormData({
      activities: [
        ...formData.activities,
        {
          ...newActivity,
          name: newActivity.name.trim(),
          description: newActivity.description.trim(),
        },
      ],
    });
    setNewActivity({
      name: "",
      category: "Soporte",
      description: "",
      minMinutes: 30,
      maxMinutes: 60,
      consumesHours: true,
      included: true,
      requiresApproval: false,
      separateQuote: false,
      displayOrder: 0,
    });
    setShowAddActivity(false);
    toast.success(`Actividad "${newActivity.name}" añadida.`);
  };

  const handleSaveEditActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivityIndex === null || !editingActivityData || !editingActivityData.name.trim()) return;
    const updated = [...formData.activities];
    updated[editingActivityIndex] = {
      ...editingActivityData,
      name: editingActivityData.name.trim(),
      description: editingActivityData.description.trim(),
    };
    updateFormData({ activities: updated });
    setEditingActivityIndex(null);
    setEditingActivityData(null);
    toast.success("Actividad técnica actualizada.");
  };

  const handleRemoveActivity = (index: number) => {
    const updated = formData.activities.filter((_, idx) => idx !== index);
    updateFormData({ activities: updated });
    toast.info("Actividad técnica removida.");
  };

  const handleResetActivities = () => {
    updateFormData({ activities: INITIAL_ACTIVITIES });
    toast.success("Actividades restauradas a valores por defecto.");
  };

  // Handlers para Términos y Condiciones (Paso 8)
  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.trim()) return;
    updateFormData({ termsAndConditions: [...formData.termsAndConditions, newTerm.trim()] });
    setNewTerm("");
    setShowAddTerm(false);
    toast.success("Cláusula añadida a las condiciones.");
  };

  const handleSaveEditTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTermIndex === null || !editingTermText.trim()) return;
    const updated = [...formData.termsAndConditions];
    updated[editingTermIndex] = editingTermText.trim();
    updateFormData({ termsAndConditions: updated });
    setEditingTermIndex(null);
    setEditingTermText("");
    toast.success("Cláusula actualizada.");
  };

  const handleRemoveTerm = (index: number) => {
    updateFormData({
      termsAndConditions: formData.termsAndConditions.filter((_, idx) => idx !== index),
    });
    toast.info("Cláusula eliminada.");
  };

  const handleResetTerms = () => {
    updateFormData({ termsAndConditions: INITIAL_TERMS });
    toast.success("Términos y condiciones restaurados a valores por defecto.");
  };

  const stepsList = [
    { id: 1, label: "Cliente" },
    { id: 2, label: "Información" },
    { id: 3, label: "Precios & Horas" },
    { id: 4, label: "Herramientas" },
    { id: 5, label: "Servicios Incluidos" },
    { id: 6, label: "Servicios No Incluidos" },
    { id: 7, label: "Actividades & Tiempos" },
    { id: 8, label: "Condiciones" },
    { id: 9, label: "Diseño" },
    { id: 10, label: "CTA & Formulario" },
    { id: 11, label: "Vista Previa" },
    { id: 12, label: "Publicación" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Wizard Toolbar */}
      <div className="bg-[#06131A] border-b border-[#133E50] p-3 sm:px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
            {currentStep}/12
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white truncate">
              {formData.title || "Nueva Propuesta Comercial"}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>{selectedClient?.tradeName || "Sin cliente asignado"}</span>
              {formData.proposalCode && (
                <span className="text-cyan-400 font-mono">• {formData.proposalCode}</span>
              )}
            </div>
          </div>
        </div>

        {/* Autosave Badge & Manual Save Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs flex items-center gap-1.5">
            {saveStatus === "saving" && (
              <span className="text-cyan-400 flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Guardando...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guardado</span>
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-rose-400 flex items-center gap-1" title={saveError || ""}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Error al guardar</span>
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={saveStatus === "saving" || !formData.clientId}
            onClick={() => saveProposalNow(formData, true)}
            className="px-3 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-cyan-400 hover:text-cyan-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Guardar cambios inmediatamente en la base de datos"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Guardar Borrador</span>
          </button>

          {formData.slug && (
            <button
              type="button"
              onClick={async () => {
                await saveProposalNow(formData, false);
                window.open(`/p/${formData.slug}?t=${Date.now()}`, "_blank");
              }}
              className="px-3 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-300 text-xs font-medium rounded-lg transition-colors hidden sm:flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Vista Pública
            </button>
          )}
        </div>
      </div>

      {/* Step Pills Bar */}
      <div className="bg-[#040D12] border-b border-[#133E50]/60 px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
        {stepsList.map((st) => (
          <button
            key={st.id}
            onClick={() => setCurrentStep(st.id as WizardStepId)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentStep === st.id
                ? "bg-[#1F7A8C] text-white shadow-md shadow-cyan-950/30"
                : "text-slate-400 hover:text-white hover:bg-[#06131A]"
            }`}
          >
            {st.id}. {st.label}
          </button>
        ))}
      </div>

      {/* Mobile Tab Switcher (Editor vs Live Preview) */}
      <div className="lg:hidden bg-[#06131A] border-b border-[#133E50] p-2 flex items-center justify-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("form")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "form"
              ? "bg-[#1F7A8C] text-white shadow-md shadow-cyan-950/40"
              : "text-slate-400 hover:text-white bg-[#091D27] border border-[#133E50]/60"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Editar Formulario ({currentStep}/12)
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "preview"
              ? "bg-[#1F7A8C] text-white shadow-md shadow-cyan-950/40"
              : "text-slate-400 hover:text-white bg-[#091D27] border border-[#133E50]/60"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Vista Previa en Vivo
        </button>
      </div>

      {/* Main Split-View Workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Step Form Controls */}
        <div
          className={`w-full lg:w-[48%] flex flex-col border-r border-[#133E50] bg-[#06131A] overflow-hidden ${
            mobileTab === "form" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* STEP 1: CLIENTE */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 1: Seleccionar Cliente
                  </h3>
                  <p className="text-xs text-slate-400">
                    Asocie la propuesta a una empresa registrada en el CRM
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Empresa / Cliente *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Seleccionar cliente --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName} ({c.taxId})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedClient && (
                  <div className="p-4 rounded-xl bg-[#091D27] border border-[#133E50] space-y-2 text-xs text-slate-300">
                    <div className="font-bold text-white text-sm">{selectedClient.tradeName}</div>
                    <div><strong>Razón Social:</strong> {selectedClient.legalName}</div>
                    <div><strong>RIF:</strong> {selectedClient.taxId}</div>
                    <div><strong>Contacto:</strong> {selectedClient.contactName} ({selectedClient.contactPosition || "Representante"})</div>
                    <div><strong>Correo:</strong> {selectedClient.email}</div>
                    <div><strong>Teléfono:</strong> {selectedClient.phone}</div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: INFORMACIÓN DE LA PROPUESTA */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 2: Información de la Propuesta
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina el título, código y plazo de validez
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Título Comercial *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Código de Propuesta
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.proposalCode || "Se generará automáticamente"}
                      className="w-full px-3.5 py-2 bg-[#040D12] border border-[#133E50] rounded-xl text-cyan-400 font-mono text-xs cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Días de Validez
                    </label>
                    <input
                      type="number"
                      value={formData.validityDays}
                      onChange={(e) => updateFormData({ validityDays: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRECIO Y HORAS */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 3: Precio y Horas (Cálculos Transparentes)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure la tarifa mensual y las horas incluidas
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Precio mensual (USD) *
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyPrice}
                      onChange={(e) => updateFormData({ monthlyPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Horas incluidas *
                    </label>
                    <input
                      type="number"
                      value={formData.includedHours}
                      onChange={(e) => updateFormData({ includedHours: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm font-bold focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hora adicional (USD) *
                    </label>
                    <input
                      type="number"
                      value={formData.extraHourPrice}
                      onChange={(e) => updateFormData({ extraHourPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Alerta de consumo (%)
                    </label>
                    <input
                      type="number"
                      value={formData.alertPercentage}
                      onChange={(e) => updateFormData({ alertPercentage: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Resumen de Cálculos reactivos */}
                <div className="p-4 rounded-xl bg-[#091D27] border border-cyan-500/30 space-y-2 text-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Cálculos en tiempo real:
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Precio por hora:</span>
                    <strong className="text-emerald-400">{pricingCalculations.formatted.pricePerHour}</strong>
                  </div>
                  <div className="flex justify-between text-slate-200">
                    <span>Alerta se activa a las:</span>
                    <strong className="text-white">{pricingCalculations.formatted.alertHours}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: HERRAMIENTAS */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Paso 4: Catálogo de Herramientas
                    </h3>
                    <p className="text-xs text-slate-400">
                      Active, edite o elimine las plataformas y herramientas tecnológicas
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetTools}
                      className="px-2.5 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      title="Restaurar las herramientas iniciales del catálogo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomToolModalOpen(true)}
                      className="px-3 py-1.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir Herramienta
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.tools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#091D27] border border-[#133E50] space-y-3"
                    >
                      {editingToolIndex === idx && editingToolData ? (
                        <form onSubmit={handleSaveEditTool} className="space-y-3">
                          <div className="text-xs font-bold text-cyan-400">Editar Herramienta</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={editingToolData.name}
                              onChange={(e) => setEditingToolData({ ...editingToolData, name: e.target.value })}
                              placeholder="Nombre de herramienta"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                            <input
                              type="text"
                              value={editingToolData.category}
                              onChange={(e) => setEditingToolData({ ...editingToolData, category: e.target.value })}
                              placeholder="Categoría"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={editingToolData.description}
                            onChange={(e) => setEditingToolData({ ...editingToolData, description: e.target.value })}
                            placeholder="Descripción de cobertura..."
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            value={editingToolData.notes || ""}
                            onChange={(e) => setEditingToolData({ ...editingToolData, notes: e.target.value })}
                            placeholder="Notas opcionales (ej: Licenciamiento por separado)"
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingToolIndex(null);
                                setEditingToolData(null);
                              }}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              {tool.name}
                              <span className="text-[10px] text-cyan-400 font-normal">
                                ({tool.category})
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-2">
                              {tool.description}
                            </p>
                            {tool.notes && (
                              <div className="text-[10px] text-slate-400 italic">
                                Nota: {tool.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <label className="flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tool.included}
                                onChange={(e) => {
                                  const updated = [...formData.tools];
                                  updated[idx].included = e.target.checked;
                                  updateFormData({ tools: updated });
                                }}
                                className="rounded bg-[#06131A] border-[#133E50] text-cyan-500 focus:ring-0"
                              />
                              <span>Incluido</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingToolIndex(idx);
                                setEditingToolData({ ...tool });
                              }}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar herramienta"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTool(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Eliminar herramienta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.tools.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#133E50] rounded-xl">
                      No hay herramientas en esta propuesta. Haga clic en &quot;Añadir Herramienta&quot; o &quot;Restaurar&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: SERVICIOS INCLUIDOS */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Paso 5: Servicios Incluidos
                    </h3>
                    <p className="text-xs text-slate-400">
                      Definición de alcance cubierto bajo el plan de soporte
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetIncluded}
                      className="px-2.5 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      title="Restaurar servicios incluidos por defecto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddIncluded(!showAddIncluded)}
                      className="px-3 py-1.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir Servicio
                    </button>
                  </div>
                </div>

                {showAddIncluded && (
                  <form onSubmit={handleAddIncludedService} className="p-4 rounded-xl bg-[#06131A] border border-cyan-500/30 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">Nuevo Servicio Incluido</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Título del servicio (ej: Soporte Preventivo Mensual)"
                        value={newIncludedService.title}
                        onChange={(e) => setNewIncludedService({ ...newIncludedService, title: e.target.value })}
                        className="px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Categoría (ej: Mantenimiento, Seguridad)"
                        value={newIncludedService.category}
                        onChange={(e) => setNewIncludedService({ ...newIncludedService, category: e.target.value })}
                        className="px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Descripción detallada de la cobertura..."
                      value={newIncludedService.description}
                      onChange={(e) => setNewIncludedService({ ...newIncludedService, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddIncluded(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg"
                      >
                        Guardar Servicio
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {formData.includedServices.map((inc) => (
                    <div key={inc.id} className="p-3.5 rounded-xl bg-[#091D27] border border-emerald-500/20 space-y-3">
                      {editingIncludedId === inc.id && editingIncludedData ? (
                        <form onSubmit={handleSaveEditIncluded} className="space-y-3">
                          <div className="text-xs font-bold text-emerald-400">Editar Servicio Incluido</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={editingIncludedData.title}
                              onChange={(e) => setEditingIncludedData({ ...editingIncludedData, title: e.target.value })}
                              placeholder="Título del servicio"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                            <input
                              type="text"
                              value={editingIncludedData.category}
                              onChange={(e) => setEditingIncludedData({ ...editingIncludedData, category: e.target.value })}
                              placeholder="Categoría"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={editingIncludedData.description}
                            onChange={(e) => setEditingIncludedData({ ...editingIncludedData, description: e.target.value })}
                            placeholder="Descripción de la cobertura..."
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingIncludedId(null);
                                setEditingIncludedData(null);
                              }}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                              {inc.title}
                              {inc.category && (
                                <span className="text-[10px] text-slate-400 bg-[#06131A] px-2 py-0.5 rounded border border-[#133E50]">
                                  {inc.category}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-300">{inc.description}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingIncludedId(inc.id);
                                setEditingIncludedData({
                                  title: inc.title,
                                  category: inc.category || "Soporte General",
                                  description: inc.description,
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar servicio"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveIncludedService(inc.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Eliminar servicio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.includedServices.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#133E50] rounded-xl">
                      No hay servicios incluidos configurados. Haga clic en &quot;Añadir Servicio&quot; o &quot;Restaurar&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: SERVICIOS NO INCLUIDOS */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Paso 6: Servicios No Incluidos (Requieren Cotización)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Límites claros del servicio y exclusiones de infraestructura física
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetExcluded}
                      className="px-2.5 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      title="Restaurar exclusiones por defecto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddExcluded(!showAddExcluded)}
                      className="px-3 py-1.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir Exclusión
                    </button>
                  </div>
                </div>

                {showAddExcluded && (
                  <form onSubmit={handleAddExcludedService} className="p-4 rounded-xl bg-[#06131A] border border-rose-500/30 space-y-3">
                    <div className="text-xs font-bold text-rose-400">Nueva Exclusión de Servicio</div>
                    <input
                      type="text"
                      required
                      placeholder="Título de la exclusión (ej: Reparaciones físicas de hardware)"
                      value={newExcludedService.title}
                      onChange={(e) => setNewExcludedService({ ...newExcludedService, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <textarea
                      rows={2}
                      placeholder="Descripción del límite o alcance excluido..."
                      value={newExcludedService.description}
                      onChange={(e) => setNewExcludedService({ ...newExcludedService, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Aviso de cotización separada"
                      value={newExcludedService.separateQuoteNotice}
                      onChange={(e) => setNewExcludedService({ ...newExcludedService, separateQuoteNotice: e.target.value })}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-amber-300 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddExcluded(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg"
                      >
                        Guardar Exclusión
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {formData.excludedServices.map((exc) => (
                    <div key={exc.id} className="p-3.5 rounded-xl bg-[#091D27] border border-rose-500/20 space-y-3">
                      {editingExcludedId === exc.id && editingExcludedData ? (
                        <form onSubmit={handleSaveEditExcluded} className="space-y-3">
                          <div className="text-xs font-bold text-rose-400">Editar Exclusión de Servicio</div>
                          <input
                            type="text"
                            required
                            value={editingExcludedData.title}
                            onChange={(e) => setEditingExcludedData({ ...editingExcludedData, title: e.target.value })}
                            placeholder="Título de la exclusión"
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <textarea
                            rows={2}
                            value={editingExcludedData.description}
                            onChange={(e) => setEditingExcludedData({ ...editingExcludedData, description: e.target.value })}
                            placeholder="Descripción de la exclusión..."
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            value={editingExcludedData.separateQuoteNotice}
                            onChange={(e) => setEditingExcludedData({ ...editingExcludedData, separateQuoteNotice: e.target.value })}
                            placeholder="Aviso de cotización formal previa..."
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-amber-300 text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingExcludedId(null);
                                setEditingExcludedData(null);
                              }}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="font-semibold text-rose-400 text-sm">{exc.title}</div>
                            <div className="text-xs text-slate-300">{exc.description}</div>
                            <div className="text-[11px] text-amber-400 font-medium">{exc.separateQuoteNotice}</div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingExcludedId(exc.id);
                                setEditingExcludedData({
                                  title: exc.title,
                                  description: exc.description,
                                  separateQuoteNotice: exc.separateQuoteNotice,
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar exclusión"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExcludedService(exc.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Eliminar exclusión"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.excludedServices.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#133E50] rounded-xl">
                      No hay servicios excluidos configurados. Haga clic en &quot;Añadir Exclusión&quot; o &quot;Restaurar&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: ACTIVIDADES Y TIEMPOS */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Paso 7: Actividades y Tiempos
                    </h3>
                    <p className="text-xs text-slate-400">
                      Diferenciación de régimen de consumo de horas y categorización
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetActivities}
                      className="px-2.5 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      title="Restaurar catálogo de actividades"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddActivity(!showAddActivity)}
                      className="px-3 py-1.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir Actividad
                    </button>
                  </div>
                </div>

                {showAddActivity && (
                  <form onSubmit={handleAddActivity} className="p-4 rounded-xl bg-[#06131A] border border-cyan-500/30 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">Nueva Actividad Técnica</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Nombre de la actividad (ej: Auditoría de respaldos)"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        className="px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Categoría (ej: Monitoreo, Soporte, Mantenimiento)"
                        value={newActivity.category}
                        onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                        className="px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Descripción técnica del trabajo realizado..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Mínimo Minutos</label>
                        <input
                          type="number"
                          min={0}
                          value={newActivity.minMinutes}
                          onChange={(e) => setNewActivity({ ...newActivity, minMinutes: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Máximo Minutos</label>
                        <input
                          type="number"
                          min={0}
                          value={newActivity.maxMinutes}
                          onChange={(e) => setNewActivity({ ...newActivity, maxMinutes: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 sm:pt-4">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newActivity.consumesHours}
                            onChange={(e) => setNewActivity({ ...newActivity, consumesHours: e.target.checked })}
                            className="rounded bg-[#091D27] border-[#133E50] text-sky-500 focus:ring-0"
                          />
                          <span>¿Consume horas de bolsa?</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddActivity(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg"
                      >
                        Guardar Actividad
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {formData.activities.map((act, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#091D27] border border-[#133E50] space-y-3">
                      {editingActivityIndex === idx && editingActivityData ? (
                        <form onSubmit={handleSaveEditActivity} className="space-y-3">
                          <div className="text-xs font-bold text-cyan-400">Editar Actividad Técnica</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              value={editingActivityData.name}
                              onChange={(e) => setEditingActivityData({ ...editingActivityData, name: e.target.value })}
                              placeholder="Nombre de la actividad"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                            <input
                              type="text"
                              value={editingActivityData.category}
                              onChange={(e) => setEditingActivityData({ ...editingActivityData, category: e.target.value })}
                              placeholder="Categoría"
                              className="px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={editingActivityData.description || ""}
                            onChange={(e) => setEditingActivityData({ ...editingActivityData, description: e.target.value })}
                            placeholder="Descripción técnica..."
                            className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Mínimo Minutos</label>
                              <input
                                type="number"
                                min={0}
                                value={editingActivityData.minMinutes}
                                onChange={(e) => setEditingActivityData({ ...editingActivityData, minMinutes: Number(e.target.value) })}
                                className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Máximo Minutos</label>
                              <input
                                type="number"
                                min={0}
                                value={editingActivityData.maxMinutes}
                                onChange={(e) => setEditingActivityData({ ...editingActivityData, maxMinutes: Number(e.target.value) })}
                                className="w-full px-3 py-1.5 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div className="flex items-center gap-2 sm:pt-4">
                              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingActivityData.consumesHours}
                                  onChange={(e) => setEditingActivityData({ ...editingActivityData, consumesHours: e.target.checked })}
                                  className="rounded bg-[#06131A] border-[#133E50] text-sky-500 focus:ring-0"
                                />
                                <span>¿Consume horas?</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivityIndex(null);
                                setEditingActivityData(null);
                              }}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="font-semibold text-white text-sm flex items-center gap-2">
                              {act.name}
                              {act.category && (
                                <span className="text-[10px] text-slate-400 bg-[#06131A] px-2 py-0.5 rounded border border-[#133E50]">
                                  {act.category}
                                </span>
                              )}
                            </div>
                            {act.description && (
                              <div className="text-xs text-slate-300">{act.description}</div>
                            )}
                            <div className="text-xs text-slate-400 font-mono">
                              {act.minMinutes > 0 ? `Duración est.: ${act.minMinutes} a ${act.maxMinutes} min` : "Automatizado / Continuo"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...formData.activities];
                                updated[idx].consumesHours = !updated[idx].consumesHours;
                                updateFormData({ activities: updated });
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                                act.consumesHours
                                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              }`}
                            >
                              {act.consumesHours ? "Consume horas" : "No consume horas"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingActivityIndex(idx);
                                setEditingActivityData({ ...act });
                              }}
                              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar actividad"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveActivity(idx)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Eliminar actividad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.activities.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#133E50] rounded-xl">
                      No hay actividades configuradas. Haga clic en &quot;Añadir Actividad&quot; o &quot;Restaurar&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 8: CONDICIONES */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">
                      Paso 8: Términos y Condiciones
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cláusulas de vigencia, soporte y cobros
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetTerms}
                      className="px-2.5 py-1.5 bg-[#091D27] hover:bg-[#133E50] border border-[#133E50] text-slate-400 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      title="Restaurar términos por defecto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restaurar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTerm(!showAddTerm)}
                      className="px-3 py-1.5 bg-[#133E50] hover:bg-[#1F7A8C] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Añadir Cláusula
                    </button>
                  </div>
                </div>

                {showAddTerm && (
                  <form onSubmit={handleAddTerm} className="p-4 rounded-xl bg-[#06131A] border border-cyan-500/30 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">Nueva Cláusula o Condición</div>
                    <textarea
                      rows={2}
                      required
                      placeholder="Redacte la cláusula o condición de servicio..."
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      className="w-full px-3 py-2 bg-[#091D27] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTerm(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg"
                      >
                        Guardar Cláusula
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {formData.termsAndConditions.map((term, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#091D27] border border-[#133E50] text-xs text-slate-300 space-y-2">
                      {editingTermIndex === idx ? (
                        <form onSubmit={handleSaveEditTerm} className="space-y-2">
                          <div className="text-xs font-bold text-cyan-400">Editar Cláusula #{idx + 1}</div>
                          <textarea
                            rows={3}
                            required
                            value={editingTermText}
                            onChange={(e) => setEditingTermText(e.target.value)}
                            className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTermIndex(null);
                                setEditingTermText("");
                              }}
                              className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg"
                            >
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex-1 leading-relaxed">{idx + 1}. {term}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTermIndex(idx);
                                setEditingTermText(term);
                              }}
                              className="p-1 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Editar cláusula"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTerm(idx)}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Eliminar cláusula"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.termsAndConditions.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#133E50] rounded-xl">
                      No hay términos o condiciones configurados. Haga clic en &quot;Añadir Cláusula&quot; o &quot;Restaurar&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 9: DISEÑO */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 9: Identidad Visual
                  </h3>
                  <p className="text-xs text-slate-400">
                    Coherencia con la marca oficial de Net &amp; Soft Solutions
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#091D27] border border-[#133E50] space-y-3 text-xs text-slate-300">
                  <div><strong>Paleta oficial:</strong> Azul Oscuro (#022B3A), Turquesa (#1F7A8C), Acento Cian (#0EA5E9)</div>
                  <div><strong>Tipografía:</strong> Inter (cuerpo) y Montserrat (encabezados)</div>
                  <div><strong>Logotipo:</strong> Rompecabezas / Llave corporativa oficial SVG</div>
                </div>
              </div>
            )}

            {/* STEP 10: CTA Y FORMULARIO */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 10: Call to Action y Formulario Público
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configuración de botones de respuesta del cliente
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#091D27] border border-[#133E50] space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Honeypot real (company_website) y token firmado HMAC activos
                  </div>
                  <div className="text-slate-300">
                    Aviso legal: &ldquo;Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.&rdquo;
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: VISTA PREVIA */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 11: Vista Previa en Tiempo Real
                  </h3>
                  <p className="text-xs text-slate-400">
                    Revise la propuesta en el panel derecho con los selectores de dispositivo
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                  La vista derecha es exactamente el mismo componente que se desplegará en la URL pública.
                </div>
              </div>
            )}

            {/* STEP 12: PUBLICACIÓN */}
            {currentStep === 12 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Paso 12: Publicar Propuesta
                  </h3>
                  <p className="text-xs text-slate-400">
                    Genere una versión inmutable y active la URL individual
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#091D27] border border-[#133E50] space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cliente:</span>
                    <strong className="text-white">{selectedClient?.tradeName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Inversión mensual:</span>
                    <strong className="text-cyan-400">{pricingCalculations.formatted.monthlyPrice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horas incluidas:</span>
                    <strong className="text-white">{pricingCalculations.formatted.includedHours}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Precio por hora:</span>
                    <strong className="text-emerald-400">{pricingCalculations.formatted.pricePerHour}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nota de la Versión / Changelog
                  </label>
                  <input
                    type="text"
                    value={changelog}
                    onChange={(e) => setChangelog(e.target.value)}
                    placeholder="Ej: Versión inicial para revisión de gerencia"
                    className="w-full px-3.5 py-2.5 bg-[#091D27] border border-[#133E50] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={publishing || !formData.clientId}
                  onClick={async () => {
                    if (!formData.id) {
                      const saved = await saveProposalNow(formData, false);
                      if (!saved) return;
                    }
                    setIsPublishModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#1F7A8C] to-cyan-500 hover:from-[#196270] hover:to-cyan-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publicando versión inmutable...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publicar Propuesta Oficialmente
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Wizard Bottom Navigation */}
          <div className="p-4 border-t border-[#133E50] bg-[#040D12] flex items-center justify-between shrink-0">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as WizardStepId) : prev))}
              className="px-4 py-2 bg-[#091D27] hover:bg-[#133E50] text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              type="button"
              disabled={currentStep === 12}
              onClick={() => setCurrentStep((prev) => (prev < 12 ? ((prev + 1) as WizardStepId) : prev))}
              className="px-5 py-2 bg-[#1F7A8C] hover:bg-[#196270] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-30"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel: Live Split-View Responsive Preview */}
        <div
          className={`w-full lg:w-[52%] flex flex-col bg-[#030A0E] overflow-hidden ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Device Switcher Toolbar */}
          <div className="bg-[#06131A] border-b border-[#133E50] p-2.5 flex items-center justify-between px-6 shrink-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Vista Previa en Vivo
            </span>

            <div className="flex items-center gap-1 bg-[#091D27] p-1 rounded-xl border border-[#133E50]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                title="Vista Escritorio"
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === "desktop" ? "bg-[#1F7A8C] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                title="Vista Tablet"
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === "tablet" ? "bg-[#1F7A8C] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                title="Vista Móvil"
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  previewDevice === "mobile" ? "bg-[#1F7A8C] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Viewport Frame */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-[#01080D]">
            <div
              className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-[#133E50] ${
                previewDevice === "desktop"
                  ? "w-full max-w-5xl"
                  : previewDevice === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              <ProposalDocument
                data={{
                  ...formData,
                  client: selectedClient || undefined,
                }}
                isStaticPreview={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Tool Modal */}
      {isCustomToolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#091D27] border border-[#133E50] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Añadir Herramienta Personalizada
            </h3>
            <form onSubmit={handleCreateCustomTool} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nombre de la Herramienta *</label>
                <input
                  type="text"
                  required
                  value={newCustomTool.name}
                  onChange={(e) => setNewCustomTool({ ...newCustomTool, name: e.target.value })}
                  placeholder="Ej: Servidor NAS Synology"
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Categoría</label>
                <input
                  type="text"
                  value={newCustomTool.category}
                  onChange={(e) => setNewCustomTool({ ...newCustomTool, category: e.target.value })}
                  placeholder="Ej: Almacenamiento, Conectividad"
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descripción del Alcance</label>
                <textarea
                  rows={2}
                  required
                  value={newCustomTool.description}
                  onChange={(e) => setNewCustomTool({ ...newCustomTool, description: e.target.value })}
                  placeholder="Detalle de cobertura técnica y supervisión..."
                  className="w-full px-3 py-2 bg-[#06131A] border border-[#133E50] rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomToolModalOpen(false)}
                  className="px-3 py-1.5 bg-[#06131A] text-slate-400 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1F7A8C] hover:bg-[#196270] text-white font-semibold rounded-lg"
                >
                  Guardar Herramienta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Publication Modal */}
      <ConfirmModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublish}
        title="¿Publicar Propuesta Oficialmente?"
        description={`Se generará una versión inmutable con enlace público individual para ${selectedClient?.tradeName || "el cliente"}. La propuesta quedará lista para revisión comercial.`}
        confirmText="Publicar y Generar Enlace"
        cancelText="Seguir Editando"
        variant="primary"
        loading={publishing}
      />
    </div>
  );
}
