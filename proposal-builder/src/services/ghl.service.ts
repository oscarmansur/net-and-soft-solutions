import { db } from "@/lib/db";
import crypto from "crypto";

export interface GHLPayload {
  proposalCode: string;
  proposalVersion: number;
  clientName: string;
  contactName: string;
  email: string;
  phone: string;
  monthlyPrice: number;
  includedHours: number;
  pricePerHour: number;
  extraHourPrice: number;
  selectedTools: string[];
  proposalStatus: string;
  publicUrl: string;
  utmParameters?: Record<string, string | undefined>;
  acceptedAt: string;
}

export class GHLService {
  /**
   * Despacha el webhook hacia GoHighLevel de manera segura y controlada
   */
  static async dispatchWebhook(params: {
    proposalId: string;
    acceptanceId: string;
    payload: GHLPayload;
  }) {
    const isEnabled = process.env.GHL_ENABLED === "true";
    const webhookUrl = process.env.GHL_WEBHOOK_URL;
    const webhookSecret = process.env.GHL_WEBHOOK_SECRET;

    // Clave de idempotencia única para prevenir duplicados en GHL
    const idempotencyKey = crypto
      .createHash("sha256")
      .update(
        `${params.payload.proposalCode}-v${params.payload.proposalVersion}-${params.payload.email}-${params.payload.acceptedAt}`
      )
      .digest("hex");

    // Verificar si ya fue entregado previamente
    const existingDelivery = await db.integrationDelivery.findUnique({
      where: { idempotencyKey },
    });

    if (existingDelivery && existingDelivery.status === "DELIVERED") {
      console.log(`[GHL] Webhook already delivered for key: ${idempotencyKey}`);
      return { success: true, status: "ALREADY_DELIVERED" };
    }

    // Registrar o actualizar intento en base de datos
    const delivery = await db.integrationDelivery.upsert({
      where: { idempotencyKey },
      update: {
        attempts: { increment: 1 },
      },
      create: {
        proposalId: params.proposalId,
        acceptanceId: params.acceptanceId,
        provider: "GOHIGHLEVEL",
        status: "PENDING",
        idempotencyKey,
        payload: params.payload as any,
        attempts: 1,
      },
    });

    if (!isEnabled || !webhookUrl) {
      console.log("[GHL] Integration is disabled or webhook URL is missing. Delivery recorded as PENDING.");
      return { success: true, status: "DISABLED" };
    }

    try {
      const payloadString = JSON.stringify(params.payload);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "NetAndSoft-ProposalBuilder/1.0",
      };

      if (process.env.GHL_API_KEY) {
        headers["Authorization"] = `Bearer ${process.env.GHL_API_KEY}`;
      }

      if (webhookSecret) {
        const hmacSignature = crypto
          .createHmac("sha256", webhookSecret)
          .update(payloadString)
          .digest("hex");
        headers["X-GHL-Signature"] = hmacSignature;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseBody = await response.text().catch(() => "");
      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        parsedBody = { raw: responseBody };
      }

      if (response.ok) {
        await db.integrationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: "DELIVERED",
            deliveredAt: new Date(),
            response: parsedBody as any,
            lastError: null,
          },
        });
        return { success: true, status: "DELIVERED" };
      } else {
        await db.integrationDelivery.update({
          where: { id: delivery.id },
          data: {
            status: "FAILED",
            lastError: `HTTP ${response.status}: ${responseBody.slice(0, 500)}`,
            response: parsedBody as any,
            nextRetryAt: new Date(Date.now() + 5 * 60 * 1000), // Reintento en 5 min
          },
        });
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      await db.integrationDelivery.update({
        where: { id: delivery.id },
        data: {
          status: "FAILED",
          lastError: errorMessage.slice(0, 500),
          nextRetryAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      return { success: false, error: errorMessage };
    }
  }
}
