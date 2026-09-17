import { escapeHtml } from "@/lib/security";
import { formatCleanNumber, formatMinutesFriendly } from "@/lib/calculations";
import {
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "@/lib/catalog-data";

export interface ExportDataPayload {
  proposalCode: string;
  version: number;
  slug: string;
  title: string;
  client: {
    legalName: string;
    tradeName: string;
    taxId: string;
    contactName: string;
    contactPosition?: string;
    email: string;
    phone: string;
    address?: string;
    numberOfUsers?: number;
    numberOfComputers?: number;
  };
  pricing: {
    monthlyPrice: number;
    includedHours: number;
    pricePerHour: number;
    extraHourPrice: number;
    alertPercentage: number;
    alertHours: number;
    currency: string;
    billingFrequency: string;
    paymentTerms: string;
    validityDays: number;
    rolloverEnabled?: boolean;
  };
  tools: Array<{
    name: string;
    category: string;
    description: string;
    supportLevel: string;
    included: boolean;
    includedInHours: boolean;
    notes?: string;
  }>;
  activities: Array<{
    name: string;
    category: string;
    description: string;
    minMinutes: number;
    maxMinutes: number;
    consumesHours: boolean;
    included: boolean;
  }>;
  includedServices?: Array<{ id: string; title: string; description: string }>;
  excludedServices?: Array<{ id: string; title: string; description: string; separateQuoteNotice?: string }>;
  termsAndConditions?: string[];
  publishedAt: string;
  expiresAt?: string;
}

export class ExportService {
  /**
   * Genera un archivo HTML 100% autónomo y autocontenido con estilos inline,
   * vectores SVG corporativos embebidos y sanitización estricta.
   * El diseño y estructura están 100% alineados con ProposalDocument.tsx.
   */
  static generateAutonomousHtml(data: ExportDataPayload): string {
    const currency = data.pricing.currency || "USD";
    const formattedPrice = formatCleanNumber(data.pricing.monthlyPrice, true, currency);
    const formattedHours = `${formatCleanNumber(data.pricing.includedHours)} horas`;
    const formattedPerHour = formatCleanNumber(data.pricing.pricePerHour, true, currency);
    const formattedExtra = formatCleanNumber(data.pricing.extraHourPrice, true, currency);
    const formattedAlertHours = `${formatCleanNumber(data.pricing.alertHours)} horas`;

    const includedTools = data.tools.filter((t) => t.included);
    const excludedTools = data.tools.filter((t) => !t.included);
    const displayTools = includedTools.length > 0 ? includedTools : data.tools;

    // Generar cards de herramientas (idéntico a ProposalDocument.tsx)
    const toolsCards = displayTools
      .map(
        (t) => `
        <div class="tool-card">
          <div class="tool-header">
            <div>
              <div class="tool-name">${escapeHtml(t.name)}</div>
              <span class="tool-category">${escapeHtml(t.category)}</span>
            </div>
            <span class="badge ${t.included ? "badge-emerald" : "badge-amber"}">
              ${t.included ? "Plataforma incluida" : "Requiere cotización"}
            </span>
          </div>
          <p class="tool-desc">${escapeHtml(t.description)}</p>
          ${
            t.notes
              ? `<div class="tool-notes">Nota: ${escapeHtml(t.notes)}</div>`
              : ""
          }
        </div>`
      )
      .join("");

    const excludedToolsBar =
      includedTools.length > 0 && excludedTools.length > 0
        ? `
        <div class="excluded-tools-box">
          <div class="excluded-tools-title">
            <span class="dot-amber"></span>
            Otras plataformas no contempladas en este plan (requieren cotización o licenciamiento independiente):
          </div>
          <div class="excluded-tools-tags">
            ${excludedTools
              .map(
                (t) => `<span class="tag-pill">${escapeHtml(t.name)}</span>`
              )
              .join("")}
          </div>
        </div>`
        : "";

    // Generar tabla de actividades (idéntico a ProposalDocument.tsx)
    const activitiesRows = data.activities
      .map((a) => {
        const durationStr =
          a.minMinutes > 0
            ? formatMinutesFriendly(a.minMinutes, a.maxMinutes)
            : "Proceso Desatendido";
        return `
        <tr>
          <td>
            <div class="activity-name">${escapeHtml(a.name)}</div>
            <div class="activity-desc">${escapeHtml(a.description)}</div>
          </td>
          <td class="activity-cat">${escapeHtml(a.category)}</td>
          <td class="activity-duration">${escapeHtml(durationStr)}</td>
          <td class="activity-regime">
            <span class="badge ${a.consumesHours ? "badge-sky" : "badge-emerald"}">
              ${a.consumesHours ? "Consume horas" : "No consume horas"}
            </span>
          </td>
        </tr>`;
      })
      .join("");

    const includedList = (
      Array.isArray(data.includedServices)
        ? data.includedServices
        : INITIAL_INCLUDED_SERVICES
    )
      .map(
        (s) => `
        <li class="scope-item">
          <svg class="icon-check" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div>
            <strong class="scope-title">${escapeHtml(s.title)}</strong>
            <span class="scope-desc">${escapeHtml(s.description)}</span>
          </div>
        </li>`
      )
      .join("");

    const excludedList = (
      Array.isArray(data.excludedServices)
        ? data.excludedServices
        : INITIAL_EXCLUDED_SERVICES
    )
      .map(
        (s) => `
        <li class="scope-item">
          <svg class="icon-x" viewBox="0 0 24 24" fill="none" stroke="#FB7185" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <div>
            <strong class="scope-title">${escapeHtml(s.title)}</strong>
            <span class="scope-desc">${escapeHtml(s.description)}</span>
            ${
              s.separateQuoteNotice
                ? `<span class="scope-notice">${escapeHtml(s.separateQuoteNotice)}</span>`
                : ""
            }
          </div>
        </li>`
      )
      .join("");

    const termsList = (
      Array.isArray(data.termsAndConditions)
        ? data.termsAndConditions
        : INITIAL_TERMS
    )
      .map((t) => `<li class="term-item"><span>${escapeHtml(t)}</span></li>`)
      .join("");

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.proposalCode)} - ${escapeHtml(data.client.tradeName)} | Net &amp; Soft Solutions</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      background-color: #030A0E;
      color: #F1F5F9;
      -webkit-font-smoothing: antialiased;
    }
    body {
      background-color: #030A0E;
      color: #F1F5F9;
      margin: 0;
      padding: 0;
    }

    /* Cover Header */
    .cover-header {
      background: linear-gradient(to bottom, #061D28, #030A0E);
      border-bottom: 1px solid #133E50;
      padding: 2rem 1.5rem;
    }
    .cover-header-inner {
      max-width: 1024px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .cover-header-inner {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    .cover-header-right {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    @media (min-width: 640px) {
      .cover-header-right {
        text-align: right;
        align-items: flex-end;
      }
    }

    .pill-banner {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.2);
      color: #67E8F9;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.75rem;
    }

    /* Main Container */
    .main-container {
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    /* Cards */
    .banner-card {
      background: rgba(9, 29, 39, 0.9);
      border: 1px solid #133E50;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .banner-card::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 20rem;
      height: 20rem;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .banner-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #38BDF8;
      margin-bottom: 0.5rem;
    }
    .banner-title {
      font-size: 2rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      margin-bottom: 0.75rem;
    }
    .banner-subtitle {
      font-size: 1rem;
      color: #CBD5E1;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 48rem;
    }
    .client-meta-grid {
      border-top: 1px solid rgba(19, 62, 80, 0.6);
      padding-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      font-size: 0.8rem;
    }
    .meta-item-label {
      color: #64748B;
      font-size: 0.75rem;
      display: block;
      margin-bottom: 0.15rem;
    }
    .meta-item-val {
      color: #FFFFFF;
      font-weight: 600;
    }
    .meta-item-mono {
      color: #67E8F9;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
    }

    /* Section Headers */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }
    .section-subtitle {
      font-size: 0.75rem;
      color: #94A3B8;
      margin-top: 0.25rem;
    }

    /* Pricing Grid */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1rem;
    }
    .pricing-card {
      background: #091D27;
      border: 1px solid #133E50;
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .pricing-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .pricing-card-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94A3B8;
    }
    .pricing-card-value {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0.5rem 0 0.25rem 0;
      letter-spacing: -0.02em;
    }
    .pricing-card-sub {
      font-size: 0.75rem;
      color: #94A3B8;
      border-top: 1px solid rgba(19, 62, 80, 0.4);
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }
    .val-cyan { color: #38BDF8; }
    .val-white { color: #FFFFFF; }
    .val-emerald { color: #10B981; }
    .val-amber { color: #F59E0B; }

    .pricing-bar {
      background: #06131A;
      border: 1px solid rgba(19, 62, 80, 0.8);
      border-radius: 0.75rem;
      padding: 0.875rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #CBD5E1;
      margin-top: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .pricing-bar-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-emerald {
      background: rgba(16, 185, 129, 0.1);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .badge-amber {
      background: rgba(245, 158, 11, 0.1);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    .badge-sky {
      background: rgba(14, 165, 233, 0.1);
      color: #38BDF8;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }

    /* Tools Grid */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }
    .tool-card {
      background: #091D27;
      border: 1px solid #133E50;
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }
    .tool-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .tool-name {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
    }
    .tool-category {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38BDF8;
      display: block;
      margin-top: 0.15rem;
    }
    .tool-desc {
      font-size: 0.8rem;
      color: #CBD5E1;
      line-height: 1.5;
    }
    .tool-notes {
      font-size: 0.75rem;
      color: #94A3B8;
      font-style: italic;
      background: #06131A;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(19, 62, 80, 0.5);
    }

    .excluded-tools-box {
      background: #06131A;
      border: 1px solid rgba(19, 62, 80, 0.6);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-top: 1rem;
    }
    .excluded-tools-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94A3B8;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .dot-amber {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 9999px;
      background: #F59E0B;
      display: inline-block;
    }
    .excluded-tools-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .tag-pill {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      background: #091D27;
      border: 1px solid #133E50;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      color: #94A3B8;
    }

    /* Activities Table */
    .table-card {
      background: #091D27;
      border: 1px solid #133E50;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.8rem;
    }
    th {
      background: #06131A;
      color: #94A3B8;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #133E50;
    }
    td {
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid rgba(19, 62, 80, 0.4);
      color: #CBD5E1;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .activity-name {
      font-weight: 600;
      color: #FFFFFF;
    }
    .activity-desc {
      font-size: 0.7rem;
      color: #94A3B8;
      margin-top: 0.15rem;
    }
    .activity-cat {
      color: #67E8F9;
    }
    .activity-duration {
      color: #CBD5E1;
      font-weight: 500;
    }
    .activity-regime {
      text-align: right;
    }

    /* Scope Matrix */
    .scope-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .scope-card-inc {
      background: #091D27;
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .scope-card-exc {
      background: #091D27;
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .scope-card-header {
      font-size: 1rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .scope-card-inc .scope-card-header { color: #34D399; }
    .scope-card-exc .scope-card-header { color: #FB7185; }
    .scope-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .scope-item {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      font-size: 0.8rem;
    }
    .icon-check, .icon-x {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      margin-top: 0.15rem;
    }
    .scope-title {
      color: #FFFFFF;
      display: block;
      font-size: 0.85rem;
    }
    .scope-desc {
      color: #94A3B8;
      font-size: 0.75rem;
      line-height: 1.4;
      display: block;
    }
    .scope-notice {
      color: #FBBF24;
      font-size: 0.7rem;
      font-weight: 600;
      display: block;
      margin-top: 0.2rem;
    }

    /* Terms */
    .terms-card {
      background: #091D27;
      border: 1px solid #133E50;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
    .terms-title {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .terms-list {
      padding-left: 1.25rem;
      font-size: 0.8rem;
      color: #CBD5E1;
      line-height: 1.6;
    }
    .term-item {
      margin-bottom: 0.5rem;
    }

    /* Notice Card */
    .notice-card {
      background: rgba(14, 165, 233, 0.05);
      border: 1px solid rgba(14, 165, 233, 0.2);
      border-radius: 0.75rem;
      padding: 1rem;
      font-size: 0.8rem;
      color: #BFDBF7;
    }

    /* Footer */
    .doc-footer {
      border-top: 1px solid #133E50;
      padding: 2.5rem 1.5rem;
      text-align: center;
      font-size: 0.75rem;
      color: #64748B;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    /* Print Optimization */
    @media print {
      html, body {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
      }
      .cover-header {
        background: #FFFFFF !important;
        border-bottom: 2px solid #CBD5E1 !important;
        padding: 1.5rem 0 !important;
      }
      .banner-card, .pricing-card, .tool-card, .table-card, .scope-card-inc, .scope-card-exc, .terms-card {
        background-color: #FFFFFF !important;
        border: 1px solid #CBD5E1 !important;
        box-shadow: none !important;
        color: #0F172A !important;
        break-inside: avoid;
      }
      .banner-title, .section-title, .pricing-card-value, .tool-name, .activity-name, .scope-title, .terms-title {
        color: #0F172A !important;
      }
      .banner-subtitle, .tool-desc, .scope-desc, .terms-list {
        color: #334155 !important;
      }
      .pricing-bar, .excluded-tools-box, .tool-notes {
        background-color: #F8FAFC !important;
        border-color: #E2E8F0 !important;
        color: #334155 !important;
      }
      th {
        background-color: #F1F5F9 !important;
        color: #0F172A !important;
        border-bottom: 1px solid #CBD5E1 !important;
      }
      td {
        border-bottom: 1px solid #E2E8F0 !important;
        color: #1E293B !important;
      }
      .badge-emerald { background: #ECFDF5 !important; color: #047857 !important; border-color: #A7F3D0 !important; }
      .badge-amber { background: #FFFBEB !important; color: #B45309 !important; border-color: #FDE68A !important; }
      .badge-sky { background: #F0F9FF !important; color: #0369A1 !important; border-color: #BAE6FD !important; }
      .tag-pill { background: #F1F5F9 !important; color: #334155 !important; border-color: #CBD5E1 !important; }
      .notice-card { background: #F8FAFC !important; border-color: #CBD5E1 !important; color: #334155 !important; }
      .doc-footer { border-color: #CBD5E1 !important; color: #64748B !important; }
    }
  </style>
</head>
<body>
  <!-- Cover Header -->
  <header class="cover-header">
    <div class="cover-header-inner">
      <div>
        <!-- Embebbed Corporate Logo SVG -->
        <svg width="210" height="46" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(6, 6) scale(0.068)">
            <path fill="#1F7A8C" d="M237.714,70.29c0-7.543,0-62.709,0-70.289H54.857C24.609,0.001,0,24.609,0,54.858v182.857c8.319,0,84.971,0,94.903,0
              c12.46,0,21.328,12.255,17.329,24.124c-0.984,2.921-11.208,16.844-1.413,33.807c11.752,20.352,40.903,20.345,52.649,0
              c5.486-9.501,5.617-20.908,0.078-30.502c-7.034-12.186,1.792-27.429,15.837-27.429h58.331v-33.718
              c-0.844,0.078-1.69,0.139-2.534,0.184c-36.257,1.925-70.608-26.622-70.608-67.038C164.571,95.879,200.429,66.865,237.714,70.29z"/>
            <path fill="#1F7A8C" d="M457.143,0.001H274.286c0,8.319,0,84.971,0,94.903c0,14.069-15.265,22.86-27.427,15.837
              c-19.917-11.494-45.716,2.547-45.716,26.403c0,23.884,25.817,37.888,45.716,26.403c12.187-7.034,27.427,1.792,27.427,15.837
              v58.331h33.718c-1.248-13.605,1.764-27.36,8.859-39.648c25.826-44.727,90.231-44.611,115.99,0
              c7.033,12.178,10.114,25.969,8.86,39.647c7.543,0,62.709,0,70.289,0V54.858C512,24.609,487.391,0.001,457.143,0.001z"/>
            <path fill="#1F7A8C" d="M417.097,274.286c-14.069,0-22.857-15.264-15.837-27.427c5.605-9.71,5.342-21.116-0.078-30.503
              c-11.62-20.124-40.836-20.458-52.648,0c-5.389,9.333-5.703,20.76-0.079,30.503c7.055,12.222-1.833,27.427-15.838,27.427h-58.331
              v33.704c13.507-1.24,27.274,1.714,39.647,8.859c44.734,25.829,44.62,90.228,0,115.991c-12.373,7.144-26.142,10.1-39.647,8.859
              c0,7.545,0,62.729,0,70.3h182.857c30.248,0,54.857-24.609,54.857-54.857V274.286C503.681,274.286,427.029,274.286,417.097,274.286
              z"/>
            <path fill="#38BDF8" d="M295.645,348.52c-17.232-9.951-30.41,0.552-34.951,1.758c-11.621,3.087-22.979-5.704-22.979-17.674v-58.318h-33.718
              c1.24,13.506-1.714,27.274-8.859,39.647c-25.805,44.694-90.201,44.668-115.991,0c-7.145-12.373-10.099-26.141-8.859-39.647
              c-7.543,0-62.708,0-70.288,0v182.857c0,30.248,24.609,54.857,54.857,54.857h182.857c0-8.264,0-85.003,0-94.915
              c0-14.069,15.265-22.86,27.427-15.837c9.669,5.582,21.075,5.365,30.503-0.079C316.122,389.346,315.782,360.148,295.645,348.52z"/>
          </g>
          <text x="52" y="22" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" letter-spacing="-0.02em">Net &amp; Soft</text>
          <text x="52" y="38" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" letter-spacing="0.12em">SOLUTIONS</text>
        </svg>
        <div>
          <div class="pill-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67E8F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
            Propuesta Comercial de Soporte IT
          </div>
        </div>
      </div>

      <div class="cover-header-right">
        <div style="font-size: 0.75rem; color: #94A3B8; font-family: ui-monospace, monospace;">
          CÓDIGO: <span style="color: #FFFFFF; font-weight: 700;">${escapeHtml(data.proposalCode)}</span>
        </div>
        <div style="font-size: 0.75rem; color: #94A3B8;">
          Versión: <span style="color: #38BDF8; font-weight: 600; font-family: ui-monospace, monospace;">v${data.version}</span>
        </div>
        <div style="font-size: 0.75rem; color: #94A3B8; display: flex; align-items: center; gap: 0.375rem; margin-top: 0.25rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
          <span>Validez: ${data.pricing.validityDays} días calendario</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="main-container">
    <!-- Client Info Banner -->
    <section class="banner-card">
      <div class="banner-label">Preparada exclusivamente para</div>
      <h1 class="banner-title">${escapeHtml(data.client.tradeName)}</h1>
      <p class="banner-subtitle">${escapeHtml(data.title)}</p>

      <div class="client-meta-grid">
        <div>
          <span class="meta-item-label">Razón Social:</span>
          <span class="meta-item-val">${escapeHtml(data.client.legalName)}</span>
        </div>
        <div>
          <span class="meta-item-label">Identificación Fiscal:</span>
          <span class="meta-item-mono">${escapeHtml(data.client.taxId)}</span>
        </div>
        <div>
          <span class="meta-item-label">Contacto Responsable:</span>
          <span class="meta-item-val">${escapeHtml(data.client.contactName)}${data.client.contactPosition ? ` (${escapeHtml(data.client.contactPosition)})` : ""}</span>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section>
      <div class="section-header">
        <div>
          <h2 class="section-title">Condiciones Económicas y Régimen de Horas</h2>
          <p class="section-subtitle">Valores transparentes sin costes ocultos ni conceptos ambiguos</p>
        </div>
        <span class="badge" style="background: #06131A; color: #38BDF8; border: 1px solid #133E50;">
          Moneda: ${escapeHtml(currency)}
        </span>
      </div>

      <div class="pricing-grid">
        <div class="pricing-card">
          <div class="pricing-card-label">Inversión Mensual</div>
          <div class="pricing-card-value val-cyan">${formattedPrice}</div>
          <div class="pricing-card-sub">Facturación ${escapeHtml(data.pricing.billingFrequency || "Mensual")} • Tarifa fija de abono</div>
        </div>

        <div class="pricing-card">
          <div class="pricing-card-header">
            <div class="pricing-card-label">Horas Incluidas</div>
            <span class="badge badge-emerald" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">Tasa: ~${formattedPerHour}/h</span>
          </div>
          <div class="pricing-card-value val-white">${formattedHours}</div>
          <div class="pricing-card-sub">
            Alerta al ${data.pricing.alertPercentage}% (${formattedAlertHours})<br>
            <span style="color: #64748B; font-size: 0.7rem;">Cálculo ref.: ${formattedPrice} / ${formattedHours} = ${formattedPerHour}/h</span>
          </div>
        </div>

        <div class="pricing-card">
          <div class="pricing-card-label">Hora Adicional Excedente</div>
          <div class="pricing-card-value val-amber">${formattedExtra}</div>
          <div class="pricing-card-sub">Solo facturable bajo previa aprobación escrita</div>
        </div>
      </div>

      <div class="pricing-bar">
        <div class="pricing-bar-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Términos de pago: <strong>${escapeHtml(data.pricing.paymentTerms || "Prepago los primeros 5 días")}</strong></span>
        </div>
        <div>
          ${data.pricing.rolloverEnabled ? "✅ Horas con acumulación (Rollover)" : "❌ Horas no acumulables mes vencido"}
        </div>
      </div>
    </section>

    <!-- Tools Catalog -->
    <section>
      <div class="section-header">
        <div>
          <h2 class="section-title">Catálogo de Herramientas y Cobertura</h2>
          <p class="section-subtitle">Plataformas supervisadas y administradas dentro del soporte tecnológico</p>
        </div>
      </div>

      <div class="tools-grid">
        ${toolsCards}
      </div>

      ${excludedToolsBar}
    </section>

    <!-- Activities Table -->
    <section>
      <div class="section-header">
        <div>
          <h2 class="section-title">Tiempos Estimados y Régimen de Consumo</h2>
          <p class="section-subtitle">Diferenciación clara de intervenciones que consumen horas versus procesos automáticos</p>
        </div>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Actividad / Tarea</th>
              <th>Tipo</th>
              <th>Tiempo Típico</th>
              <th style="text-align: right;">Régimen</th>
            </tr>
          </thead>
          <tbody>
            ${activitiesRows}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Scope Matrix: Included vs Excluded -->
    <section class="scope-grid">
      <!-- Included Services -->
      <div class="scope-card-inc">
        <div class="scope-card-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Servicios Incluidos en la Propuesta
        </div>
        <ul class="scope-list">
          ${includedList}
        </ul>
      </div>

      <!-- Excluded Services -->
      <div class="scope-card-exc">
        <div class="scope-card-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FB7185" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Servicios No Incluidos (Requieren Cotización)
        </div>
        <ul class="scope-list">
          ${excludedList}
        </ul>
      </div>
    </section>

    <!-- Terms & Conditions -->
    <section class="terms-card">
      <div class="terms-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
        Condiciones del Servicio y Garantías
      </div>
      <ol class="terms-list">
        ${termsList}
      </ol>
    </section>

    <!-- Notice -->
    <div class="notice-card">
      <p><strong>Nota de validez:</strong> Este documento es una exportación estática oficial de la propuesta comercial emitida por <strong>Net &amp; Soft Solutions</strong>. Confirma las condiciones pactadas y no realiza cobros automáticos.</p>
    </div>
  </main>

  <!-- Footer -->
  <footer class="doc-footer">
    <svg width="140" height="32" viewBox="0 0 220 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.75;">
      <g transform="translate(6, 6) scale(0.068)">
        <path fill="#1F7A8C" d="M237.714,70.29c0-7.543,0-62.709,0-70.289H54.857C24.609,0.001,0,24.609,0,54.858v182.857c8.319,0,84.971,0,94.903,0
          c12.46,0,21.328,12.255,17.329,24.124c-0.984,2.921-11.208,16.844-1.413,33.807c11.752,20.352,40.903,20.345,52.649,0
          c5.486-9.501,5.617-20.908,0.078-30.502c-7.034-12.186,1.792-27.429,15.837-27.429h58.331v-33.718
          c-0.844,0.078-1.69,0.139-2.534,0.184c-36.257,1.925-70.608-26.622-70.608-67.038C164.571,95.879,200.429,66.865,237.714,70.29z"/>
        <path fill="#1F7A8C" d="M457.143,0.001H274.286c0,8.319,0,84.971,0,94.903c0,14.069-15.265,22.86-27.427,15.837
          c-19.917-11.494-45.716,2.547-45.716,26.403c0,23.884,25.817,37.888,45.716,26.403c12.187-7.034,27.427,1.792,27.427,15.837
          v58.331h33.718c-1.248-13.605,1.764-27.36,8.859-39.648c25.826-44.727,90.231-44.611,115.99,0
          c7.033,12.178,10.114,25.969,8.86,39.647c7.543,0,62.709,0,70.289,0V54.858C512,24.609,487.391,0.001,457.143,0.001z"/>
        <path fill="#1F7A8C" d="M417.097,274.286c-14.069,0-22.857-15.264-15.837-27.427c5.605-9.71,5.342-21.116-0.078-30.503
          c-11.62-20.124-40.836-20.458-52.648,0c-5.389,9.333-5.703,20.76-0.079,30.503c7.055,12.222-1.833,27.427-15.838,27.427h-58.331
          v33.704c13.507-1.24,27.274,1.714,39.647,8.859c44.734,25.829,44.62,90.228,0,115.991c-12.373,7.144-26.142,10.1-39.647,8.859
          c0,7.545,0,62.729,0,70.3h182.857c30.248,0,54.857-24.609,54.857-54.857V274.286C503.681,274.286,427.029,274.286,417.097,274.286
          z"/>
        <path fill="#38BDF8" d="M295.645,348.52c-17.232-9.951-30.41,0.552-34.951,1.758c-11.621,3.087-22.979-5.704-22.979-17.674v-58.318h-33.718
          c1.24,13.506-1.714,27.274-8.859,39.647c-25.805,44.694-90.201,44.668-115.991,0c-7.145-12.373-10.099-26.141-8.859-39.647
          c-7.543,0-62.708,0-70.288,0v182.857c0,30.248,24.609,54.857,54.857,54.857h182.857c0-8.264,0-85.003,0-94.915
          c0-14.069,15.265-22.86,27.427-15.837c9.669,5.582,21.075,5.365,30.503-0.079C316.122,389.346,315.782,360.148,295.645,348.52z"/>
      </g>
      <text x="52" y="22" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" letter-spacing="-0.02em">Net &amp; Soft</text>
      <text x="52" y="38" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="600" fill="#38BDF8" letter-spacing="0.12em">SOLUTIONS</text>
    </svg>
    <p>© ${new Date().getFullYear()} Net &amp; Soft Solutions C.A. Todos los derechos reservados.</p>
    <p>https://netandsoft.com.ve/</p>
  </footer>
</body>
</html>`;
  }

  /**
   * Genera la exportación en JSON versionado
   */
  static generateVersionJson(data: ExportDataPayload): string {
    return JSON.stringify(
      {
        format: "netandsoft_proposal_export",
        schemaVersion: "1.0",
        exportedAt: new Date().toISOString(),
        ...data,
      },
      null,
      2
    );
  }
}
