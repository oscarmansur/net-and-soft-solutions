import { db } from "@/lib/db";
import { ProposalFormData, ProposalStatus } from "@/types/proposal";
import { calculatePricing } from "@/lib/calculations";
import {
  INITIAL_INCLUDED_SERVICES,
  INITIAL_EXCLUDED_SERVICES,
  INITIAL_TERMS,
} from "@/lib/catalog-data";
import { AuditService } from "./audit.service";
import { hashAnonymousIp } from "@/lib/security";
import { AcceptanceAction } from "@prisma/client";

export class ProposalService {
  /**
   * Genera un código formal de propuesta tipo: NS-BIMOTO-2026-001
   */
  static async generateCode(tradeName: string): Promise<string> {
    const cleanName = tradeName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 8) || "PROP";

    const year = new Date().getFullYear();
    const prefix = `NS-${cleanName}-${year}`;

    const count = await db.proposal.count({
      where: {
        proposalCode: { startsWith: prefix },
      },
    });

    const sequence = String(count + 1).padStart(3, "0");
    return `${prefix}-${sequence}`;
  }

  /**
   * Genera un slug único amigable para la URL pública
   */
  static async generateSlug(titleOrTradeName: string): Promise<string> {
    const baseSlug = titleOrTradeName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "propuesta";

    const year = new Date().getFullYear();
    let slug = `${baseSlug}-${year}`;

    let counter = 1;
    while (await db.proposal.findUnique({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${year}-${counter}`;
    }

    return slug;
  }

  /**
   * Lista propuestas con filtros y búsqueda
   */
  static async listProposals(params?: {
    search?: string;
    status?: ProposalStatus;
    clientId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(100, Math.max(1, params?.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      archivedAt: null,
    };

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.clientId) {
      where.clientId = params.clientId;
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { proposalCode: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { client: { tradeName: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [total, items] = await Promise.all([
      db.proposal.count({ where }),
      db.proposal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          client: {
            select: {
              id: true,
              tradeName: true,
              legalName: true,
              email: true,
              phone: true,
            },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene una propuesta completa por ID para edición en el Wizard
   */
  static async getProposalById(id: string) {
    return await db.proposal.findUnique({
      where: { id },
      include: {
        client: true,
        tools: { orderBy: { displayOrder: "asc" } },
        activities: { orderBy: { displayOrder: "asc" } },
        versions: {
          orderBy: { versionNumber: "desc" },
          select: {
            id: true,
            versionNumber: true,
            changelog: true,
            publishedAt: true,
            snapshotData: true,
            createdBy: { select: { name: true } },
          },
        },
      },
    });
  }

  /**
   * Obtiene la propuesta pública por Slug (con opción de consultar versión histórica)
   */
  static async getPublicProposalBySlug(slug: string, versionNumber?: number) {
    const proposal = await db.proposal.findUnique({
      where: { slug },
      include: {
        client: true,
        tools: { orderBy: { displayOrder: "asc" } },
        activities: { orderBy: { displayOrder: "asc" } },
        versions: {
          orderBy: { versionNumber: "desc" },
        },
      },
    });

    if (!proposal) return null;

    // Si se especificó una versión o la propuesta tiene versiones congeladas
    let activeSnapshot = null;
    let targetVersion = proposal.versions[0];

    if (versionNumber) {
      targetVersion = proposal.versions.find((v) => v.versionNumber === versionNumber) || targetVersion;
    }

    if (targetVersion?.snapshotData) {
      activeSnapshot = targetVersion.snapshotData;
    }

    return {
      proposal,
      activeVersion: targetVersion,
      snapshot: activeSnapshot,
    };
  }

  /**
   * Guarda o actualiza un borrador de propuesta (Auto-save)
   */
  static async saveDraft(
    data: Partial<ProposalFormData>,
    userId: string,
    ip = "127.0.0.1"
  ) {
    if (!data.clientId) {
      throw new Error("Debe seleccionar un cliente antes de guardar el borrador.");
    }

    const client = await db.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new Error("El cliente seleccionado no existe.");

    const isUpdate = Boolean(data.id);
    if (isUpdate && data.id) {
      const existing = await db.proposal.findUnique({ where: { id: data.id } });
      if (!existing) throw new Error("La propuesta a actualizar no existe.");

      // Preservar código y slug existentes para no romper enlaces públicos ya emitidos
      const code = data.proposalCode?.trim() || existing.proposalCode;
      const slug = data.slug?.trim() || existing.slug;

      // Actualización de propuesta existente
      const existingScope = (existing.scopeData as any) || {};
      const scopeData = {
        includedServices: Array.isArray(data.includedServices)
          ? data.includedServices
          : (Array.isArray(existingScope.includedServices) ? existingScope.includedServices : INITIAL_INCLUDED_SERVICES),
        excludedServices: Array.isArray(data.excludedServices)
          ? data.excludedServices
          : (Array.isArray(existingScope.excludedServices) ? existingScope.excludedServices : INITIAL_EXCLUDED_SERVICES),
        termsAndConditions: Array.isArray(data.termsAndConditions)
          ? data.termsAndConditions
          : (Array.isArray(existingScope.termsAndConditions) ? existingScope.termsAndConditions : INITIAL_TERMS),
        design: data.design || existingScope.design || {},
        ctaSettings: data.ctaSettings || existingScope.ctaSettings || {},
      };

      const updated = await db.$transaction(async (tx) => {
        const prop = await tx.proposal.update({
          where: { id: data.id },
          data: {
            title: data.title || `Propuesta para ${client.tradeName}`,
            clientId: data.clientId,
            proposalCode: code,
            slug: slug,
            monthlyPrice: Number(data.monthlyPrice) || 0,
            includedHours: Number(data.includedHours) || 0,
            extraHourPrice: Number(data.extraHourPrice) || 0,
            alertPercentage: Number(data.alertPercentage) || 80,
            rolloverEnabled: Boolean(data.rolloverEnabled),
            currency: data.currency || "USD",
            billingFrequency: data.billingFrequency || "Mensual",
            paymentTerms: data.paymentTerms || "Prepago los primeros 5 días",
            validityDays: Number(data.validityDays) || 15,
            scopeData: scopeData as any,
            updatedById: userId,
          },
        });

        // Actualizar herramientas si se proporcionaron
        if (Array.isArray(data.tools)) {
          await tx.proposalTool.deleteMany({ where: { proposalId: prop.id } });
          if (data.tools.length > 0) {
            await tx.proposalTool.createMany({
              data: data.tools.map((t, idx) => ({
                proposalId: prop.id,
                toolDefinitionId: t.toolDefinitionId || null,
                name: t.name,
                category: t.category,
                description: t.description,
                supportLevel: t.supportLevel || "Estándar",
                included: t.included ?? true,
                includedInHours: t.includedInHours ?? true,
                requiresApproval: t.requiresApproval ?? false,
                separateQuote: t.separateQuote ?? false,
                licenseIncluded: t.licenseIncluded ?? false,
                notes: t.notes || null,
                displayOrder: t.displayOrder ?? idx + 1,
              })),
            });
          }
        }

        // Actualizar actividades si se proporcionaron
        if (Array.isArray(data.activities)) {
          await tx.proposalActivity.deleteMany({ where: { proposalId: prop.id } });
          if (data.activities.length > 0) {
            await tx.proposalActivity.createMany({
              data: data.activities.map((a, idx) => ({
                proposalId: prop.id,
                activityDefinitionId: a.activityDefinitionId || null,
                name: a.name,
                category: a.category,
                description: a.description,
                minMinutes: a.minMinutes,
                maxMinutes: a.maxMinutes,
                consumesHours: a.consumesHours ?? true,
                included: a.included ?? true,
                requiresApproval: a.requiresApproval ?? false,
                separateQuote: a.separateQuote ?? false,
                displayOrder: a.displayOrder ?? idx + 1,
              })),
            });
          }
        }

        return await tx.proposal.findUnique({
          where: { id: prop.id },
          include: {
            client: true,
            tools: { orderBy: { displayOrder: "asc" } },
            activities: { orderBy: { displayOrder: "asc" } },
            versions: { orderBy: { versionNumber: "desc" } },
          },
        });
      });

      return updated;
    } else {
      // Creación de nueva propuesta
      let code = data.proposalCode?.trim();
      let slug = data.slug?.trim();
      if (!code) code = await this.generateCode(client.tradeName);
      if (!slug) slug = await this.generateSlug(data.title || client.tradeName);

      const created = await db.proposal.create({
        data: {
          proposalCode: code,
          slug: slug,
          title: data.title || `Propuesta para ${client.tradeName}`,
          clientId: data.clientId,
          status: "DRAFT",
          currentVersion: 1,
          monthlyPrice: Number(data.monthlyPrice) || 0,
          includedHours: Number(data.includedHours) || 0,
          extraHourPrice: Number(data.extraHourPrice) || 0,
          alertPercentage: Number(data.alertPercentage) || 80,
          usedHours: 0,
          rolloverEnabled: Boolean(data.rolloverEnabled),
          currency: data.currency || "USD",
          billingFrequency: data.billingFrequency || "Mensual",
          paymentTerms: data.paymentTerms || "Prepago los primeros 5 días",
          validityDays: Number(data.validityDays) || 15,
          scopeData: {
            includedServices: Array.isArray(data.includedServices) ? data.includedServices : INITIAL_INCLUDED_SERVICES,
            excludedServices: Array.isArray(data.excludedServices) ? data.excludedServices : INITIAL_EXCLUDED_SERVICES,
            termsAndConditions: Array.isArray(data.termsAndConditions) ? data.termsAndConditions : INITIAL_TERMS,
            design: data.design || {},
            ctaSettings: data.ctaSettings || {},
          } as any,
          createdById: userId,
          tools: data.tools?.length
            ? {
                create: data.tools.map((t, idx) => ({
                  name: t.name,
                  category: t.category,
                  description: t.description,
                  supportLevel: t.supportLevel || "Estándar",
                  included: t.included ?? true,
                  includedInHours: t.includedInHours ?? true,
                  requiresApproval: t.requiresApproval ?? false,
                  separateQuote: t.separateQuote ?? false,
                  licenseIncluded: t.licenseIncluded ?? false,
                  notes: t.notes || null,
                  displayOrder: t.displayOrder ?? idx + 1,
                })),
              }
            : undefined,
          activities: data.activities?.length
            ? {
                create: data.activities.map((a, idx) => ({
                  name: a.name,
                  category: a.category,
                  description: a.description,
                  minMinutes: a.minMinutes,
                  maxMinutes: a.maxMinutes,
                  consumesHours: a.consumesHours ?? true,
                  included: a.included ?? true,
                  requiresApproval: a.requiresApproval ?? false,
                  separateQuote: a.separateQuote ?? false,
                  displayOrder: a.displayOrder ?? idx + 1,
                })),
              }
            : undefined,
        },
        include: {
          client: true,
          tools: { orderBy: { displayOrder: "asc" } },
          activities: { orderBy: { displayOrder: "asc" } },
          versions: { orderBy: { versionNumber: "desc" } },
        },
      });

      await AuditService.recordAudit({
        action: "proposal_created",
        entityType: "Proposal",
        entityId: created.id,
        userId,
        anonymousIpHash: hashAnonymousIp(ip),
        metadata: { proposalCode: created.proposalCode, slug: created.slug },
      });

      return created;
    }
  }

  /**
   * Publica la propuesta generando una versión inmutable con snapshot JSON
   */
  static async publishProposal(
    proposalId: string,
    userId: string,
    changelog?: string,
    ip = "127.0.0.1",
    proposalData?: Partial<ProposalFormData>
  ) {
    // Si se enviaron datos actualizados con la solicitud de publicación, guardarlos primero
    if (proposalData && proposalData.clientId) {
      await this.saveDraft({ ...proposalData, id: proposalId }, userId, ip);
    }

    const proposal = await db.proposal.findUnique({
      where: { id: proposalId },
      include: {
        client: true,
        tools: { orderBy: { displayOrder: "asc" } },
        activities: { orderBy: { displayOrder: "asc" } },
        versions: { orderBy: { versionNumber: "desc" }, take: 1 },
      },
    });

    if (!proposal) throw new Error("Propuesta no encontrada");

    const pricing = calculatePricing({
      monthlyPrice: Number(proposal.monthlyPrice),
      includedHours: Number(proposal.includedHours),
      extraHourPrice: Number(proposal.extraHourPrice),
      alertPercentage: proposal.alertPercentage,
      currency: proposal.currency,
    });

    const nextVersionNumber = proposal.versions.length > 0 ? proposal.versions[0].versionNumber + 1 : 1;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + proposal.validityDays * 24 * 60 * 60 * 1000);

    const scope = (proposal as any).scopeData || {};
    const includedServices = Array.isArray(proposalData?.includedServices)
      ? proposalData.includedServices
      : (Array.isArray(scope.includedServices) ? scope.includedServices : INITIAL_INCLUDED_SERVICES);
    const excludedServices = Array.isArray(proposalData?.excludedServices)
      ? proposalData.excludedServices
      : (Array.isArray(scope.excludedServices) ? scope.excludedServices : INITIAL_EXCLUDED_SERVICES);
    const termsAndConditions = Array.isArray(proposalData?.termsAndConditions)
      ? proposalData.termsAndConditions
      : (Array.isArray(scope.termsAndConditions) ? scope.termsAndConditions : INITIAL_TERMS);

    // Snapshot inmutable congelado
    const snapshotData = {
      version: nextVersionNumber,
      proposalCode: proposal.proposalCode,
      slug: proposal.slug,
      title: proposal.title,
      client: {
        legalName: proposal.client.legalName,
        tradeName: proposal.client.tradeName,
        taxId: proposal.client.taxId,
        contactName: proposal.client.contactName,
        contactPosition: proposal.client.contactPosition,
        email: proposal.client.email,
        phone: proposal.client.phone,
        address: proposal.client.address,
        numberOfUsers: proposal.client.numberOfUsers,
        numberOfComputers: proposal.client.numberOfComputers,
      },
      pricing: {
        monthlyPrice: pricing.monthlyPrice,
        includedHours: pricing.includedHours,
        pricePerHour: pricing.pricePerHour,
        extraHourPrice: pricing.extraHourPrice,
        alertPercentage: pricing.alertPercentage,
        alertHours: pricing.alertHours,
        currency: pricing.currency,
        billingFrequency: proposal.billingFrequency,
        paymentTerms: proposal.paymentTerms,
        validityDays: proposal.validityDays,
        formatted: pricing.formatted,
      },
      monthlyPrice: Number(proposal.monthlyPrice),
      includedHours: Number(proposal.includedHours),
      extraHourPrice: Number(proposal.extraHourPrice),
      alertPercentage: proposal.alertPercentage,
      currency: proposal.currency,
      billingFrequency: proposal.billingFrequency,
      paymentTerms: proposal.paymentTerms,
      validityDays: proposal.validityDays,
      tools: proposal.tools,
      activities: proposal.activities,
      includedServices,
      excludedServices,
      termsAndConditions,
      publishedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const [published] = await db.$transaction([
      db.proposal.update({
        where: { id: proposal.id },
        data: {
          status: "PUBLISHED",
          currentVersion: nextVersionNumber,
          publishedAt: now,
          expiresAt: expiresAt,
          scopeData: {
            ...scope,
            includedServices,
            excludedServices,
            termsAndConditions,
          } as any,
          updatedById: userId,
        },
      }),
      db.proposalVersion.create({
        data: {
          proposalId: proposal.id,
          versionNumber: nextVersionNumber,
          snapshotData: snapshotData as any,
          changelog: changelog || `Publicación oficial versión ${nextVersionNumber}`,
          publishedAt: now,
          createdById: userId,
        },
      }),
      db.proposalEvent.create({
        data: {
          proposalId: proposal.id,
          eventType: "proposal_published",
          anonymousIpHash: hashAnonymousIp(ip),
          metadata: { version: nextVersionNumber, changelog } as any,
        },
      }),
    ]);

    await AuditService.recordAudit({
      action: "proposal_published",
      entityType: "Proposal",
      entityId: proposal.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
      metadata: { version: nextVersionNumber, slug: proposal.slug },
    });

    return {
      proposal: published,
      version: nextVersionNumber,
      publicUrl: `/p/${proposal.slug}`,
    };
  }

  /**
   * Duplica una propuesta existente para acelerar nuevas cotizaciones
   */
  static async duplicateProposal(proposalId: string, userId: string, ip = "127.0.0.1") {
    const original = await db.proposal.findUnique({
      where: { id: proposalId },
      include: {
        client: true,
        tools: true,
        activities: true,
      },
    });

    if (!original) throw new Error("Propuesta original no encontrada");

    const newCode = await this.generateCode(original.client.tradeName);
    const newSlug = await this.generateSlug(`${original.client.tradeName}-duplicada`);

    const cloned = await db.proposal.create({
      data: {
        proposalCode: newCode,
        slug: newSlug,
        title: `${original.title} (Copia)`,
        clientId: original.clientId,
        status: "DRAFT",
        currentVersion: 1,
        monthlyPrice: original.monthlyPrice,
        includedHours: original.includedHours,
        extraHourPrice: original.extraHourPrice,
        alertPercentage: original.alertPercentage,
        usedHours: 0,
        rolloverEnabled: original.rolloverEnabled,
        currency: original.currency,
        billingFrequency: original.billingFrequency,
        paymentTerms: original.paymentTerms,
        validityDays: original.validityDays,
        createdById: userId,
        tools: {
          create: original.tools.map((t) => ({
            name: t.name,
            category: t.category,
            description: t.description,
            supportLevel: t.supportLevel,
            included: t.included,
            includedInHours: t.includedInHours,
            requiresApproval: t.requiresApproval,
            separateQuote: t.separateQuote,
            licenseIncluded: t.licenseIncluded,
            notes: t.notes,
            displayOrder: t.displayOrder,
          })),
        },
        activities: {
          create: original.activities.map((a) => ({
            name: a.name,
            category: a.category,
            description: a.description,
            minMinutes: a.minMinutes,
            maxMinutes: a.maxMinutes,
            consumesHours: a.consumesHours,
            included: a.included,
            requiresApproval: a.requiresApproval,
            separateQuote: a.separateQuote,
            displayOrder: a.displayOrder,
          })),
        },
      },
    });

    await AuditService.recordAudit({
      action: "proposal_duplicated",
      entityType: "Proposal",
      entityId: cloned.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
      metadata: { originalId: original.id, newCode: cloned.proposalCode },
    });

    return cloned;
  }

  /**
   * Registra una respuesta pública del cliente (Aceptación, Solicitud de cambios o Rechazo)
   */
  static async recordPublicSubmission(input: {
    proposalId: string;
    proposalVersionId: string;
    representativeName: string;
    companyName: string;
    email: string;
    phone: string;
    actionType: AcceptanceAction;
    acceptedTerms: boolean;
    comments?: string;
    signatureData?: string;
    clientIp: string;
    userAgent?: string;
  }) {
    const ipHash = hashAnonymousIp(input.clientIp);

    const proposal = await db.proposal.findUnique({
      where: { id: input.proposalId },
    });

    if (!proposal) throw new Error("Propuesta no encontrada");
    if (proposal.status !== "PUBLISHED") {
      throw new Error("Esta propuesta ya no se encuentra en estado disponible para aceptación.");
    }
    if (proposal.expiresAt && proposal.expiresAt < new Date()) {
      throw new Error("Esta propuesta ha vencido su período de validez.");
    }

    const acceptance = await db.acceptance.create({
      data: {
        proposalId: input.proposalId,
        proposalVersionId: input.proposalVersionId,
        representativeName: input.representativeName.trim(),
        companyName: input.companyName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        actionType: input.actionType,
        acceptedTerms: input.acceptedTerms,
        comments: input.comments?.trim() || null,
        signatureData: input.signatureData || null,
        clientIpHash: ipHash,
        userAgent: input.userAgent?.slice(0, 500) || null,
      },
    });

    // Actualizar estado de la propuesta según la acción
    let nextStatus: ProposalStatus = "PUBLISHED";
    let eventName = "proposal_submitted";

    if (input.actionType === "ACCEPT") {
      nextStatus = "ACCEPTED";
      eventName = "proposal_accepted";
      await db.proposal.update({
        where: { id: proposal.id },
        data: { status: nextStatus, acceptedAt: new Date() },
      });
    } else if (input.actionType === "REJECT") {
      nextStatus = "REJECTED";
      eventName = "proposal_rejected";
      await db.proposal.update({
        where: { id: proposal.id },
        data: { status: nextStatus, rejectedAt: new Date() },
      });
    }

    // Registrar evento analítico
    await AuditService.recordProposalEvent({
      proposalId: proposal.id,
      proposalVersionId: input.proposalVersionId,
      eventType: eventName,
      anonymousIpHash: ipHash,
      userAgent: input.userAgent,
      metadata: {
        actionType: input.actionType,
        email: input.email,
        acceptanceId: acceptance.id,
      },
    });

    return acceptance;
  }
}
