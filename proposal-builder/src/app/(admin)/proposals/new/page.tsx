"use client";

import React, { use } from "react";
import { ProposalWizard } from "@/components/wizard/ProposalWizard";
import { useSearchParams } from "next/navigation";

export default function NewProposalPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId") || undefined;

  return <ProposalWizard preselectedClientId={clientId} />;
}
