import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ProposalService } from "@/services/proposal.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const published = await ProposalService.publishProposal(
      id,
      auth.user.id,
      body.changelog,
      ip,
      body.proposalData
    );

    return NextResponse.json({
      success: true,
      message: "Propuesta publicada exitosamente con versión inmutable.",
      ...published,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al publicar propuesta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
