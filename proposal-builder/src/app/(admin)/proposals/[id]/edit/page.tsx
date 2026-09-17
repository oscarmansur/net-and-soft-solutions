"use client";

import React, { useEffect, useState, use } from "react";
import { ProposalWizard } from "@/components/wizard/ProposalWizard";

export default function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [proposal, setProposal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/internal/proposals/${id}?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success) {
          setProposal(data.proposal);
        }
      } catch (err) {
        console.error("Error loading proposal for edit:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span>Cargando propuesta para edición...</span>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Propuesta no encontrada.</p>
      </div>
    );
  }

  return (
    <ProposalWizard
      key={`${proposal.id}-${proposal.updatedAt || ""}`}
      initialProposal={proposal}
    />
  );
}
