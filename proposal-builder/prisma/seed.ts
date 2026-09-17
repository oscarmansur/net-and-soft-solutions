import { PrismaClient, ClientStatus, ProposalStatus } from "@prisma/client";
import {
  INITIAL_TOOLS,
  INITIAL_ACTIVITIES,
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "../src/lib/catalog-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting catalog & demo seed for Net & Soft Proposal Builder...");

  // 1. Catálogo de Herramientas Iniciales
  console.log("📦 Seeding initial tool definitions...");
  for (const tool of INITIAL_TOOLS) {
    const existing = await prisma.toolDefinition.findFirst({
      where: { name: tool.name },
    });
    if (!existing) {
      await prisma.toolDefinition.create({
        data: {
          name: tool.name,
          category: tool.category,
          description: tool.description,
          supportLevel: tool.supportLevel,
          defaultIncluded: tool.included,
          defaultIncludedInHours: tool.includedInHours,
          requiresApproval: tool.requiresApproval,
          separateQuote: tool.separateQuote,
          licenseIncluded: tool.licenseIncluded,
          notes: tool.notes,
          displayOrder: tool.displayOrder,
          isCustom: false,
          isActive: true,
        },
      });
    }
  }

  // 4. Catálogo de Actividades Iniciales
  console.log("⏱️ Seeding initial activity definitions...");
  for (const act of INITIAL_ACTIVITIES) {
    const existing = await prisma.activityDefinition.findFirst({
      where: { name: act.name },
    });
    if (!existing) {
      await prisma.activityDefinition.create({
        data: {
          name: act.name,
          category: act.category,
          description: act.description,
          minMinutes: act.minMinutes,
          maxMinutes: act.maxMinutes,
          consumesHours: act.consumesHours,
          defaultIncluded: act.included,
          requiresApproval: act.requiresApproval,
          separateQuote: act.separateQuote,
          displayOrder: act.displayOrder,
          isActive: true,
        },
      });
    }
  }

  // 5. Cliente de demostración: Bimoto Imperio C.A.
  console.log("🏢 Seeding demo client: Bimoto Imperio...");
  const bimoto = await prisma.client.upsert({
    where: { taxId: "J-41234567-8" },
    update: {
      legalName: "Bimoto Imperio C.A.",
      tradeName: "Bimoto Imperio",
      contactName: "Carlos Mendoza",
      contactPosition: "Gerente General",
      email: "gerencia@bimotoimperio.com",
      phone: "+58 414 1234567",
      secondaryPhone: "+58 212 9876543",
      country: "Venezuela",
      state: "Miranda",
      city: "Caracas",
      address: "Av. Francisco de Miranda, Edif. Centro Seguros, Piso 4, Ofic. 4B, Chacao",
      industry: "Venta y Distribución de Repuestos Automotrices",
      numberOfUsers: 12,
      numberOfComputers: 15,
      notes: "Empresa de repuestos con sucursal principal y punto de venta. Operan con Saint Enterprise Administrativo y Contable.",
      status: ClientStatus.ACTIVE,
    },
    create: {
      legalName: "Bimoto Imperio C.A.",
      tradeName: "Bimoto Imperio",
      taxId: "J-41234567-8",
      contactName: "Carlos Mendoza",
      contactPosition: "Gerente General",
      email: "gerencia@bimotoimperio.com",
      phone: "+58 414 1234567",
      secondaryPhone: "+58 212 9876543",
      country: "Venezuela",
      state: "Miranda",
      city: "Caracas",
      address: "Av. Francisco de Miranda, Edif. Centro Seguros, Piso 4, Ofic. 4B, Chacao",
      industry: "Venta y Distribución de Repuestos Automotrices",
      numberOfUsers: 12,
      numberOfComputers: 15,
      notes: "Empresa de repuestos con sucursal principal y punto de venta. Operan con Saint Enterprise Administrativo y Contable.",
      status: ClientStatus.ACTIVE,
    },
  });
  console.log(`✅ Demo client ready: ${bimoto.tradeName} (ID: ${bimoto.id})`);

  // 6. Propuesta de demostración publicada para Bimoto Imperio
  console.log("📄 Seeding demo proposal: NS-BIMOTO-2026-001...");
  const proposalCode = "NS-BIMOTO-2026-001";
  const slug = "bimoto-imperio-2026";

  const existingProposal = await prisma.proposal.findUnique({
    where: { proposalCode },
  });

  const toolDefs = await prisma.toolDefinition.findMany({ where: { isActive: true } });
  const actDefs = await prisma.activityDefinition.findMany({ where: { isActive: true } });

  const demoSnapshot = {
    proposalCode,
    slug,
    title: "Propuesta de Soporte y Continuidad Tecnológica Integral",
    client: {
      legalName: bimoto.legalName,
      tradeName: bimoto.tradeName,
      taxId: bimoto.taxId,
      contactName: bimoto.contactName,
      contactPosition: bimoto.contactPosition,
      email: bimoto.email,
      phone: bimoto.phone,
      address: bimoto.address,
      numberOfUsers: bimoto.numberOfUsers,
      numberOfComputers: bimoto.numberOfComputers,
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
      paymentTerms: "Prepago dentro de los primeros 5 días del mes",
      validityDays: 15,
    },
    tools: INITIAL_TOOLS,
    activities: INITIAL_ACTIVITIES,
    includedServices: INITIAL_INCLUDED_SERVICES,
    excludedServices: INITIAL_EXCLUDED_SERVICES,
    termsAndConditions: INITIAL_TERMS,
    publishedAt: new Date().toISOString(),
  };

  if (!existingProposal) {
    const proposal = await prisma.proposal.create({
      data: {
        proposalCode,
        slug,
        title: "Propuesta de Soporte y Continuidad Tecnológica Integral",
        clientId: bimoto.id,
        status: ProposalStatus.PUBLISHED,
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
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdById: admin.id,
        tools: {
          create: toolDefs.map((t) => ({
            toolDefinitionId: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            supportLevel: t.supportLevel,
            included: t.defaultIncluded,
            includedInHours: t.defaultIncludedInHours,
            requiresApproval: t.requiresApproval,
            separateQuote: t.separateQuote,
            licenseIncluded: t.licenseIncluded,
            notes: t.notes,
            displayOrder: t.displayOrder,
          })),
        },
        activities: {
          create: actDefs.map((a) => ({
            activityDefinitionId: a.id,
            name: a.name,
            category: a.category,
            description: a.description,
            minMinutes: a.minMinutes,
            maxMinutes: a.maxMinutes,
            consumesHours: a.consumesHours,
            included: a.defaultIncluded,
            requiresApproval: a.requiresApproval,
            separateQuote: a.separateQuote,
            displayOrder: a.displayOrder,
          })),
        },
        versions: {
          create: {
            versionNumber: 1,
            snapshotData: demoSnapshot as any,
            changelog: "Versión inicial publicada para Bimoto Imperio C.A.",
            publishedAt: new Date(),
            createdById: admin.id,
          },
        },
        events: {
          create: {
            eventType: "proposal_published",
            anonymousIpHash: "system_seed",
            userAgent: "Prisma Seed Script",
            metadata: { version: 1, publishedBy: admin.email },
          },
        },
      },
    });
    console.log(`✅ Demo proposal created: ${proposal.proposalCode} (/p/${proposal.slug})`);
  } else {
    console.log(`ℹ️ Demo proposal already exists: ${existingProposal.proposalCode}`);
  }

  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
