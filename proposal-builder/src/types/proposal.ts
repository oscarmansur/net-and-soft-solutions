export type ProposalStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "ARCHIVED";

export interface ToolItem {
  id?: string;
  toolDefinitionId?: string;
  name: string;
  category: string;
  description: string;
  supportLevel: string;
  included: boolean;
  includedInHours: boolean;
  requiresApproval: boolean;
  separateQuote: boolean;
  licenseIncluded: boolean;
  notes?: string;
  displayOrder: number;
}

export interface ActivityItem {
  id?: string;
  activityDefinitionId?: string;
  name: string;
  category: string;
  description: string;
  minMinutes: number;
  maxMinutes: number;
  consumesHours: boolean;
  included: boolean;
  requiresApproval: boolean;
  separateQuote: boolean;
  displayOrder: number;
}

export interface IncludedServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
}

export interface ExcludedServiceItem {
  id: string;
  title: string;
  description: string;
  separateQuoteNotice: string;
}

export interface ProposalDesignConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  showCoverPage?: boolean;
  showTimeline?: boolean;
  showCalculationsCard?: boolean;
  termsTitle?: string;
}

export interface ProposalFormData {
  id?: string;
  proposalCode: string;
  slug: string;
  title: string;
  clientId: string;
  status: ProposalStatus;
  currentVersion: number;

  // Condiciones económicas
  monthlyPrice: number;
  includedHours: number;
  extraHourPrice: number;
  alertPercentage: number;
  usedHours: number;
  rolloverEnabled: boolean;
  currency: string;
  billingFrequency: string;
  paymentTerms: string;
  validityDays: number;

  // Fechas
  publishedAt?: string | null;
  expiresAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;

  // Listas de configuración
  tools: ToolItem[];
  activities: ActivityItem[];
  includedServices: IncludedServiceItem[];
  excludedServices: ExcludedServiceItem[];
  termsAndConditions: string[];
  design: ProposalDesignConfig;

  // Call to action & formulario
  ctaSettings: {
    enableAcceptance: boolean;
    enableRequestChanges: boolean;
    enableReject: boolean;
    requireSignature: boolean;
    disclaimerText: string;
  };
}

export type WizardStepId =
  | 1 // Cliente
  | 2 // Información de la propuesta
  | 3 // Precio y horas
  | 4 // Herramientas
  | 5 // Servicios incluidos
  | 6 // Servicios no incluidos
  | 7 // Actividades y tiempos
  | 8 // Condiciones
  | 9 // Diseño
  | 10 // CTA y formulario
  | 11 // Vista previa
  | 12; // Publicación
