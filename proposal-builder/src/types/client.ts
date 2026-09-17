export type ClientStatus = "LEAD" | "ACTIVE" | "INACTIVE";

export interface ClientData {
  id: string;
  legalName: string;
  tradeName: string;
  taxId: string;
  contactName: string;
  contactPosition?: string | null;
  email: string;
  phone: string;
  secondaryPhone?: string | null;
  country: string;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  website?: string | null;
  instagram?: string | null;
  industry?: string | null;
  numberOfUsers?: number | null;
  numberOfComputers?: number | null;
  notes?: string | null;
  status: ClientStatus;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  proposalsCount?: number;
}

export interface CreateClientInput {
  legalName: string;
  tradeName: string;
  taxId: string;
  contactName: string;
  contactPosition?: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  website?: string;
  instagram?: string;
  industry?: string;
  numberOfUsers?: number;
  numberOfComputers?: number;
  notes?: string;
  status?: ClientStatus;
}
