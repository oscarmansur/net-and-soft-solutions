import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProposalService } from "@/services/proposal.service";
import { AuditService } from "@/services/audit.service";
import { GHLService } from "@/services/ghl.service";
import {
  isHoneypotTriggered,
  verifySignedFormToken,
  hashAnonymousIp,
} from "@/lib/security";
import { checkSubmissionRateLimits } from "@/lib/rate-limit";

const submissionSchema = z.object({
  representativeName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
  companyName: z.string().trim().min(2, "La empresa debe tener al menos 2 caracteres").max(150),
  email: z.string().trim().email("Debe proporcionar un correo electrónico válido").max(150),
  phone: z.string().trim().min(6, "Teléfono inválido").max(40),
  actionType: z.enum(["ACCEPT", "REQUEST_CHANGES", "REJECT"]).default("ACCEPT"),
  acceptedTerms: z.boolean().default(true),
  comments: z.string().trim().max(2000).optional(),
  signatureData: z.string().max(50000).optional(),
  token: z.string().min(10, "Token de formulario ausente"),
  company_website: z.string().optional(), // Honeypot
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const ipHash = hashAnonymousIp(ip);
  const userAgent = request.headers.get("user-agent") || "";

  try {
    const { slug } = await params;

    // 1. Obtener propuesta y versión activa
    const proposalData = await ProposalService.getPublicProposalBySlug(slug);
    if (!proposalData || !proposalData.activeVersion) {
      return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
    }

    const proposal = proposalData.proposal;
    const version = proposalData.activeVersion;

    // Verificar si la propuesta está expirada
    if (proposal.expiresAt && proposal.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Esta propuesta ha superado su período de validez." },
        { status: 400 }
      );
    }

    // 2. Parsear el body JSON
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Formato de solicitud no válido" }, { status: 400 });
    }

    const parsed = submissionSchema.safeParse(rawBody);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Datos incompletos";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parsed.data;

    // 3. HONEYPOT CHECK OBLIGATORIO:
    // Si company_website contiene cualquier valor, el bot cayó en la trampa.
    if (isHoneypotTriggered(data.company_website)) {
      // Registrar evento de spam bloqueado en auditoría
      await AuditService.recordProposalEvent({
        proposalId: proposal.id,
        proposalVersionId: version.id,
        eventType: "blocked_spam_submission",
        anonymousIpHash: ipHash,
        userAgent,
        metadata: {
          reason: "honeypot_triggered",
          honeypotField: "company_website",
        },
      });

      await AuditService.recordAudit({
        action: "blocked_spam_submission",
        entityType: "Proposal",
        entityId: proposal.id,
        anonymousIpHash: ipHash,
        userAgent,
        metadata: { reason: "honeypot_triggered" },
      });

      // IMPORTANTE: Retornar respuesta genérica 200 simulada sin guardar en BD ni llamar a GHL
      return NextResponse.json({
        success: true,
        message: "Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.",
      });
    }

    // 4. VERIFICACIÓN DE TOKEN FIRMADO Y SPEED CHECK (>= 3s)
    const tokenResult = verifySignedFormToken(data.token, proposal.id, version.id);
    if (!tokenResult.valid) {
      // Registrar intento de bot o token manipulado
      await AuditService.recordProposalEvent({
        proposalId: proposal.id,
        proposalVersionId: version.id,
        eventType: "blocked_spam_submission",
        anonymousIpHash: ipHash,
        userAgent,
        metadata: {
          reason: tokenResult.reason,
          elapsedSeconds: tokenResult.elapsedSeconds,
        },
      });

      return NextResponse.json(
        {
          error:
            tokenResult.reason === "too_fast"
              ? "El formulario fue enviado con demasiada rapidez. Por favor tómese un momento para revisar los términos."
              : "La sesión del formulario expiró o no es válida. Por favor recargue la página.",
        },
        { status: 400 }
      );
    }

    // 5. RATE LIMITING MULTI-DIMENSIONAL
    const rateCheck = checkSubmissionRateLimits({
      ipHash,
      proposalId: proposal.id,
      email: data.email,
    });

    if (!rateCheck.allowed) {
      await AuditService.recordProposalEvent({
        proposalId: proposal.id,
        proposalVersionId: version.id,
        eventType: "blocked_rate_limit",
        anonymousIpHash: ipHash,
        userAgent,
        metadata: { blockedBy: rateCheck.blockedBy },
      });

      return NextResponse.json(
        {
          error: "Ha excedido el número de intentos permitidos. Por favor espere antes de reintentar.",
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfterSeconds || 60) },
        }
      );
    }

    // 6. REGISTRAR ACEPTACIÓN EN BASE DE DATOS
    const acceptance = await ProposalService.recordPublicSubmission({
      proposalId: proposal.id,
      proposalVersionId: version.id,
      representativeName: data.representativeName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      actionType: data.actionType,
      acceptedTerms: data.acceptedTerms,
      comments: data.comments,
      signatureData: data.signatureData,
      clientIp: ip,
      userAgent,
    });

    // 7. DESPACHAR INTEGRACIÓN CON GOHIGHLEVEL (SI ESTÁ ACTIVA)
    if (data.actionType === "ACCEPT") {
      GHLService.dispatchWebhook({
        proposalId: proposal.id,
        acceptanceId: acceptance.id,
        payload: {
          proposalCode: proposal.proposalCode,
          proposalVersion: version.versionNumber,
          clientName: data.companyName,
          contactName: data.representativeName,
          email: data.email,
          phone: data.phone,
          monthlyPrice: Number(proposal.monthlyPrice),
          includedHours: Number(proposal.includedHours),
          pricePerHour: Number(proposal.monthlyPrice) / Math.max(1, Number(proposal.includedHours)),
          extraHourPrice: Number(proposal.extraHourPrice),
          selectedTools: proposal.tools.map((t) => t.name),
          proposalStatus: "ACCEPTED",
          publicUrl: `${process.env.APP_URL || "https://cotiza.netandsoft.com.ve"}/p/${proposal.slug}`,
          acceptedAt: new Date().toISOString(),
        },
      }).catch((err) => console.error("GHL async dispatch error:", err));
    }

    let successMessage = "Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.";
    if (data.actionType === "REQUEST_CHANGES") {
      successMessage = "Hemos recibido sus comentarios y solicitud de cambios. Un asesor se comunicará a la brevedad.";
    } else if (data.actionType === "REJECT") {
      successMessage = "Su respuesta ha sido registrada. Agradecemos su tiempo al evaluar nuestra propuesta.";
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
      actionType: data.actionType,
    });
  } catch (error: unknown) {
    console.error("Error processing public submission:", error);
    const msg = error instanceof Error ? error.message : "Error al procesar la solicitud";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
