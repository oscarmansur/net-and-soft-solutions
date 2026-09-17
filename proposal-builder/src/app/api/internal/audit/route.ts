import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { AuditService } from "@/services/audit.service";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN");
  if (auth instanceof NextResponse) return auth;

  const proposalId = request.nextUrl.searchParams.get("proposalId");

  if (proposalId) {
    const timeline = await AuditService.getProposalEventsTimeline(proposalId);
    return NextResponse.json({ success: true, timeline });
  }

  const logs = await AuditService.getRecentAuditLogs(100);
  return NextResponse.json({ success: true, logs });
}
