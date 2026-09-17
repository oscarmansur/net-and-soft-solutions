import { describe, it, expect } from "vitest";
import { ExportService, ExportDataPayload } from "@/services/export.service";

describe("Autonomous HTML and JSON Export Service", () => {
  const mockData: ExportDataPayload = {
    proposalCode: "NS-BIMOTO-2026-001",
    version: 1,
    slug: "bimoto-imperio-2026",
    title: "Propuesta de Soporte y Continuidad Tecnológica Integral",
    client: {
      legalName: "Bimoto Imperio C.A.",
      tradeName: "Bimoto Imperio",
      taxId: "J-41234567-8",
      contactName: "Carlos Mendoza",
      contactPosition: "Gerente General",
      email: "gerencia@bimotoimperio.com",
      phone: "+58 414 1234567",
      address: "Chacao, Caracas",
    },
    pricing: {
      monthlyPrice: 120,
      includedHours: 20,
      pricePerHour: 6,
      extraHourPrice: 10,
      alertPercentage: 80,
      alertHours: 16,
      currency: "USD",
      billingFrequency: "Mensual",
      paymentTerms: "Prepago los primeros 5 días",
      validityDays: 15,
    },
    tools: [
      {
        name: "TacticalRMM",
        category: "Soporte remoto",
        description: "Monitoreo de equipos",
        supportLevel: "Avanzado",
        included: true,
        includedInHours: true,
      },
    ],
    activities: [
      {
        name: "Soporte rápido remoto",
        category: "Atención inmediata",
        description: "Revisión rápida",
        minMinutes: 15,
        maxMinutes: 30,
        consumesHours: true,
        included: true,
      },
    ],
    publishedAt: new Date().toISOString(),
  };

  it("generates autonomous responsive HTML containing brand identity without leaks", () => {
    const html = ExportService.generateAutonomousHtml(mockData);

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Net &amp; Soft");
    expect(html).toContain("Bimoto Imperio");
    expect(html).toContain("USD 120");
    expect(html).toContain("USD 6");
    expect(html).toContain("TacticalRMM");

    // Verificar que NO contiene rutas administrativas ni secretos
    expect(html).not.toContain("/api/internal");
    expect(html).not.toContain("AUTH_SECRET");
    expect(html).not.toContain("GHL_API_KEY");
  });

  it("generates versioned JSON export cleanly", () => {
    const jsonStr = ExportService.generateVersionJson(mockData);
    const parsed = JSON.parse(jsonStr);

    expect(parsed.format).toBe("netandsoft_proposal_export");
    expect(parsed.proposalCode).toBe("NS-BIMOTO-2026-001");
    expect(parsed.pricing.monthlyPrice).toBe(120);
    expect(parsed.tools.length).toBe(1);
  });
});
