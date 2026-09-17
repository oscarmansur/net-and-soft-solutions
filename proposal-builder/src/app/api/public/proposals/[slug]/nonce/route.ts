import { NextRequest, NextResponse } from "next/server";
import { ProposalService } from "@/services/proposal.service";
import { createSignedFormToken, hashAnonymousIp } from "@/lib/security";
import { rateLimiter } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const ipHash = hashAnonymousIp(ip);

    // Rate limit para solicitud de tokens: máx 30 por minuto por IP
    const rl = rateLimiter.check(`rate:token:${ipHash}`, 30, 60);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: rl.resetSeconds },
        { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
      );
    }

    const proposalData = await ProposalService.getPublicProposalBySlug(slug);
    if (!proposalData || !proposalData.activeVersion) {
      return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
    }

    const token = createSignedFormToken(
      proposalData.proposal.id,
      proposalData.activeVersion.id
    );

    return NextResponse.json({
      success: true,
      token,
      issuedAt: Date.now(),
      minSubmitSeconds: Number(process.env.FORM_MIN_SUBMIT_SECONDS || 3),
    });
  } catch (error) {
    console.error("Error generating form nonce:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
