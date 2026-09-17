import { db } from "@/lib/db";

export interface CreateAuditLogParams {
  action: string;
  entityType: string;
  entityId?: string | null;
  userId?: string | null;
  sessionId?: string | null;
  anonymousIpHash: string;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface CreateProposalEventParams {
  proposalId: string;
  proposalVersionId?: string | null;
  eventType: string;
  sessionId?: string | null;
  userId?: string | null;
  contactId?: string | null;
  anonymousIpHash: string;
  userAgent?: string | null;
  landingUrl?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  metadata?: Record<string, unknown> | null;
}

export class AuditService {
  /**
   * Registra una acción administrativa en la bitácora de auditoría
   */
  static async recordAudit(params: CreateAuditLogParams) {
    try {
      // Filtrar campos sensibles del metadata
      const cleanMeta = { ...(params.metadata || {}) };
      delete cleanMeta.password;
      delete cleanMeta.token;
      delete cleanMeta.secret;
      delete cleanMeta.apiKey;

      return await db.auditLog.create({
        data: {
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          userId: params.userId,
          sessionId: params.sessionId,
          anonymousIpHash: params.anonymousIpHash,
          userAgent: params.userAgent?.slice(0, 500),
          metadata: cleanMeta as any,
        },
      });
    } catch (err) {
      console.error("Failed to record audit log:", err);
      return null;
    }
  }

  /**
   * Registra un evento analítico o de interacción en una propuesta
   */
  static async recordProposalEvent(params: CreateProposalEventParams) {
    try {
      return await db.proposalEvent.create({
        data: {
          proposalId: params.proposalId,
          proposalVersionId: params.proposalVersionId,
          eventType: params.eventType,
          sessionId: params.sessionId,
          userId: params.userId,
          contactId: params.contactId,
          anonymousIpHash: params.anonymousIpHash,
          userAgent: params.userAgent?.slice(0, 500),
          landingUrl: params.landingUrl?.slice(0, 1000),
          referrer: params.referrer?.slice(0, 1000),
          utmSource: params.utmSource,
          utmMedium: params.utmMedium,
          utmCampaign: params.utmCampaign,
          utmContent: params.utmContent,
          utmTerm: params.utmTerm,
          gclid: params.gclid,
          fbclid: params.fbclid,
          metadata: (params.metadata || {}) as any,
        },
      });
    } catch (err) {
      console.error("Failed to record proposal event:", err);
      return null;
    }
  }

  /**
   * Obtiene la línea de tiempo de eventos para una propuesta
   */
  static async getProposalEventsTimeline(proposalId: string) {
    return await db.proposalEvent.findMany({
      where: { proposalId },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  }

  /**
   * Obtiene los logs de auditoría más recientes para el panel de control
   */
  static async getRecentAuditLogs(limit = 50) {
    return await db.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
