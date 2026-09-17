import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ProposalService } from "@/services/proposal.service";
import { ProposalStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  const search = request.nextUrl.searchParams.get("search") || undefined;
  const status = (request.nextUrl.searchParams.get("status") as ProposalStatus) || undefined;
  const clientId = request.nextUrl.searchParams.get("clientId") || undefined;
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const limit = Number(request.nextUrl.searchParams.get("limit") || 20);

  const result = await ProposalService.listProposals({ search, status, clientId, page, limit });
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const saved = await ProposalService.saveDraft(body, auth.user.id, ip);
    return NextResponse.json({ success: true, proposal: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al guardar propuesta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
