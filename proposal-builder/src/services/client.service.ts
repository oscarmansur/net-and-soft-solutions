import { db } from "@/lib/db";
import { CreateClientInput } from "@/types/client";
import { ClientStatus } from "@prisma/client";
import { AuditService } from "./audit.service";
import { hashAnonymousIp } from "@/lib/security";

export class ClientService {
  /**
   * Lista clientes con búsqueda, paginación y filtros
   */
  static async listClients(params?: {
    search?: string;
    status?: ClientStatus;
    includeArchived?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params?.page || 1);
    const limit = Math.min(100, Math.max(1, params?.limit || 20));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (!params?.includeArchived) {
      where.archivedAt = null;
    }

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { tradeName: { contains: q, mode: "insensitive" } },
        { legalName: { contains: q, mode: "insensitive" } },
        { taxId: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { contactName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      db.client.count({ where }),
      db.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: { proposals: true },
          },
        },
      }),
    ]);

    return {
      items: items.map((c) => ({
        ...c,
        proposalsCount: c._count.proposals,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Obtiene un cliente por ID junto a sus propuestas relacionadas
   */
  static async getClientById(id: string) {
    return await db.client.findUnique({
      where: { id },
      include: {
        proposals: {
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            proposalCode: true,
            slug: true,
            title: true,
            status: true,
            currentVersion: true,
            monthlyPrice: true,
            includedHours: true,
            publishedAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  /**
   * Valida si ya existe un cliente con el mismo RIF, email o teléfono
   */
  static async checkDuplicates(taxId: string, email: string, phone: string, excludeId?: string) {
    const existing = await db.client.findFirst({
      where: {
        archivedAt: null,
        id: excludeId ? { not: excludeId } : undefined,
        OR: [
          { taxId: taxId.trim() },
          { email: email.trim().toLowerCase() },
          { phone: phone.trim() },
        ],
      },
    });

    if (!existing) return null;

    if (existing.taxId.toLowerCase() === taxId.trim().toLowerCase()) {
      return { field: "taxId", message: "Ya existe un cliente con esta identificación fiscal (RIF/NIF)." };
    }
    if (existing.email.toLowerCase() === email.trim().toLowerCase()) {
      return { field: "email", message: "Ya existe un cliente registrado con este correo electrónico." };
    }
    if (existing.phone === phone.trim()) {
      return { field: "phone", message: "Ya existe un cliente registrado con este número telefónico." };
    }
    return null;
  }

  /**
   * Crea un nuevo cliente evitando duplicados
   */
  static async createClient(
    input: CreateClientInput,
    userId?: string,
    ip = "127.0.0.1"
  ) {
    const duplicate = await this.checkDuplicates(input.taxId, input.email, input.phone);
    if (duplicate) {
      throw new Error(duplicate.message);
    }

    const client = await db.client.create({
      data: {
        legalName: input.legalName.trim(),
        tradeName: input.tradeName.trim(),
        taxId: input.taxId.trim(),
        contactName: input.contactName.trim(),
        contactPosition: input.contactPosition?.trim() || null,
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        secondaryPhone: input.secondaryPhone?.trim() || null,
        country: input.country?.trim() || "Venezuela",
        state: input.state?.trim() || null,
        city: input.city?.trim() || null,
        address: input.address?.trim() || null,
        website: input.website?.trim() || null,
        instagram: input.instagram?.trim() || null,
        industry: input.industry?.trim() || null,
        numberOfUsers: input.numberOfUsers ? Number(input.numberOfUsers) : null,
        numberOfComputers: input.numberOfComputers ? Number(input.numberOfComputers) : null,
        notes: input.notes?.trim() || null,
        status: input.status || ClientStatus.ACTIVE,
      },
    });

    await AuditService.recordAudit({
      action: "client_created",
      entityType: "Client",
      entityId: client.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
      metadata: { tradeName: client.tradeName, taxId: client.taxId },
    });

    return client;
  }

  /**
   * Actualiza datos de un cliente
   */
  static async updateClient(
    id: string,
    input: Partial<CreateClientInput>,
    userId?: string,
    ip = "127.0.0.1"
  ) {
    if (input.taxId || input.email || input.phone) {
      const current = await db.client.findUnique({ where: { id } });
      if (!current) throw new Error("Cliente no encontrado");

      const taxToCheck = input.taxId || current.taxId;
      const emailToCheck = input.email || current.email;
      const phoneToCheck = input.phone || current.phone;

      const duplicate = await this.checkDuplicates(taxToCheck, emailToCheck, phoneToCheck, id);
      if (duplicate) {
        throw new Error(duplicate.message);
      }
    }

    const client = await db.client.update({
      where: { id },
      data: {
        ...(input.legalName && { legalName: input.legalName.trim() }),
        ...(input.tradeName && { tradeName: input.tradeName.trim() }),
        ...(input.taxId && { taxId: input.taxId.trim() }),
        ...(input.contactName && { contactName: input.contactName.trim() }),
        ...(input.contactPosition !== undefined && { contactPosition: input.contactPosition?.trim() || null }),
        ...(input.email && { email: input.email.trim().toLowerCase() }),
        ...(input.phone && { phone: input.phone.trim() }),
        ...(input.secondaryPhone !== undefined && { secondaryPhone: input.secondaryPhone?.trim() || null }),
        ...(input.country && { country: input.country.trim() }),
        ...(input.state !== undefined && { state: input.state?.trim() || null }),
        ...(input.city !== undefined && { city: input.city?.trim() || null }),
        ...(input.address !== undefined && { address: input.address?.trim() || null }),
        ...(input.website !== undefined && { website: input.website?.trim() || null }),
        ...(input.instagram !== undefined && { instagram: input.instagram?.trim() || null }),
        ...(input.industry !== undefined && { industry: input.industry?.trim() || null }),
        ...(input.numberOfUsers !== undefined && { numberOfUsers: input.numberOfUsers ? Number(input.numberOfUsers) : null }),
        ...(input.numberOfComputers !== undefined && { numberOfComputers: input.numberOfComputers ? Number(input.numberOfComputers) : null }),
        ...(input.notes !== undefined && { notes: input.notes?.trim() || null }),
        ...(input.status && { status: input.status }),
      },
    });

    await AuditService.recordAudit({
      action: "client_updated",
      entityType: "Client",
      entityId: client.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
      metadata: { tradeName: client.tradeName },
    });

    return client;
  }

  /**
   * Archiva un cliente (borrado lógico)
   */
  static async archiveClient(id: string, userId?: string, ip = "127.0.0.1") {
    const client = await db.client.update({
      where: { id },
      data: { archivedAt: new Date() },
    });

    await AuditService.recordAudit({
      action: "client_archived",
      entityType: "Client",
      entityId: client.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
    });

    return client;
  }

  /**
   * Restaura un cliente archivado
   */
  static async restoreClient(id: string, userId?: string, ip = "127.0.0.1") {
    const client = await db.client.update({
      where: { id },
      data: { archivedAt: null },
    });

    await AuditService.recordAudit({
      action: "client_restored",
      entityType: "Client",
      entityId: client.id,
      userId,
      anonymousIpHash: hashAnonymousIp(ip),
    });

    return client;
  }
}
