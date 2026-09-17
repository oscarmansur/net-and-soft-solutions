export type UserRole = "ADMIN" | "SALES" | "VIEWER";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface PublicSubmissionInput {
  proposalId: string;
  proposalVersionId: string;
  representativeName: string;
  companyName: string;
  email: string;
  phone: string;
  actionType: "ACCEPT" | "REQUEST_CHANGES" | "REJECT";
  acceptedTerms: boolean;
  comments?: string;
  signatureData?: string;
  token: string;
  // Honeypot field
  company_website?: string;
  // Turnstile token opcional
  turnstileToken?: string;
}
