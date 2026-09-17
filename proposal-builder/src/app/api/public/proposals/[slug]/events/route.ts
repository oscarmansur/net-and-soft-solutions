import { NextRequest, NextResponse } from "next/server";
import { ProposalService } from "@/services/proposal.service";
import { AuditService } from "@/services/audit.service";
import { hashAnonymousIp } from "@/lib/security";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const ipHash = hashAnonymousIp(ip);
    const userAgent = request.headers.get("user-agent") || "";

    const proposalData = await ProposalService.getPublicProposalBySlug(slug);
    if (!proposalData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const eventType = body.eventType || "proposal_viewed";

    const allowedEvents = [
      "proposal_viewed",
      "proposal_cta_clicked",
      "proposal_form_started",
      "proposal_pdf_downloaded",
      "proposal_html_exported",
    ];

    if (!allowedEvents.includes(eventType)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await AuditService.recordProposalEvent({
      proposalId: proposalData.proposal.id,
      proposalVersionId: proposalData.activeVersion?.id,
      eventType,
      anonymousIpHash: ipHash,
      userAgent,
      landingUrl: body.landingUrl,
      referrer: request.headers.get("referer"),
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
      metadata: body.metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging event:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
