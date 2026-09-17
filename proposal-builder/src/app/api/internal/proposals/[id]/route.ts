import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ProposalService } from "@/services/proposal.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const proposal = await ProposalService.getProposalById(id);
  if (!proposal) {
    return NextResponse.json({ error: "Propuesta no encontrada" }, {
      status: 404,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
    });
  }

  return NextResponse.json({ success: true, proposal }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const action = request.nextUrl.searchParams.get("action");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  if (action === "duplicate") {
    const duplicated = await ProposalService.duplicateProposal(id, auth.user.id, ip);
    return NextResponse.json({ success: true, proposal: duplicated });
  }

  return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
}
