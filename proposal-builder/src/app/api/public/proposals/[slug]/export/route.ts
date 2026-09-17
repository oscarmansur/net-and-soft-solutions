import { NextRequest, NextResponse } from "next/server";
import { ProposalService } from "@/services/proposal.service";
import { ExportService, ExportDataPayload } from "@/services/export.service";
import { AuditService } from "@/services/audit.service";
import { hashAnonymousIp } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const format = request.nextUrl.searchParams.get("format") || "html";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const data = await ProposalService.getPublicProposalBySlug(slug);
    if (!data || !data.activeVersion) {
      return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
    }

    const snap = (data.snapshot as any) || {};
    const prop = data.proposal;
    const scopeData = (prop as any).scopeData || {};

    const payload: ExportDataPayload = {
      proposalCode: snap.proposalCode || prop.proposalCode,
      version: snap.version || data.activeVersion.versionNumber,
      slug: snap.slug || prop.slug,
      title: snap.title || prop.title,
      client: snap.client || {
        legalName: prop.client.legalName,
        tradeName: prop.client.tradeName,
        taxId: prop.client.taxId,
        contactName: prop.client.contactName,
        contactPosition: prop.client.contactPosition || undefined,
        email: prop.client.email,
        phone: prop.client.phone,
        address: prop.client.address || undefined,
        numberOfUsers: prop.client.numberOfUsers || undefined,
        numberOfComputers: prop.client.numberOfComputers || undefined,
      },
      pricing: snap.pricing || {
        monthlyPrice: Number(prop.monthlyPrice),
        includedHours: Number(prop.includedHours),
        pricePerHour: Number(prop.monthlyPrice) / Math.max(1, Number(prop.includedHours)),
        extraHourPrice: Number(prop.extraHourPrice),
        alertPercentage: prop.alertPercentage,
        alertHours: (Number(prop.includedHours) * prop.alertPercentage) / 100,
        currency: prop.currency,
        billingFrequency: prop.billingFrequency,
        paymentTerms: prop.paymentTerms,
        validityDays: prop.validityDays,
        rolloverEnabled: Boolean(prop.rolloverEnabled ?? snap.rolloverEnabled ?? snap.pricing?.rolloverEnabled),
      },
      tools: snap.tools?.length
        ? snap.tools
        : prop.tools.map((t) => ({
            name: t.name,
            category: t.category,
            description: t.description,
            supportLevel: t.supportLevel,
            included: t.included,
            includedInHours: t.includedInHours,
            notes: t.notes || undefined,
          })),
      activities: snap.activities?.length
        ? snap.activities
        : prop.activities.map((a) => ({
            name: a.name,
            category: a.category,
            description: a.description,
            minMinutes: a.minMinutes,
            maxMinutes: a.maxMinutes,
            consumesHours: a.consumesHours,
            included: a.included,
          })),
      includedServices: Array.isArray(scopeData.includedServices)
        ? scopeData.includedServices
        : (Array.isArray(snap.includedServices) ? snap.includedServices : undefined),
      excludedServices: Array.isArray(scopeData.excludedServices)
        ? scopeData.excludedServices
        : (Array.isArray(snap.excludedServices) ? snap.excludedServices : undefined),
      termsAndConditions: Array.isArray(scopeData.termsAndConditions)
        ? scopeData.termsAndConditions
        : (Array.isArray(snap.termsAndConditions) ? snap.termsAndConditions : undefined),
      publishedAt: data.activeVersion.publishedAt.toISOString(),
    };

    const fileNameBase = `${data.proposal.proposalCode}-v${data.activeVersion.versionNumber}`;

    if (format === "json") {
      const jsonContent = ExportService.generateVersionJson(payload);
      await AuditService.recordProposalEvent({
        proposalId: data.proposal.id,
        proposalVersionId: data.activeVersion.id,
        eventType: "proposal_html_exported",
        anonymousIpHash: hashAnonymousIp(ip),
        metadata: { format: "json" },
      });

      return new NextResponse(jsonContent, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileNameBase}.json"`,
        },
      });
    }

    // Default format: autonomous HTML
    const htmlContent = ExportService.generateAutonomousHtml(payload);
    await AuditService.recordProposalEvent({
      proposalId: data.proposal.id,
      proposalVersionId: data.activeVersion.id,
      eventType: "proposal_html_exported",
      anonymousIpHash: hashAnonymousIp(ip),
      metadata: { format: "html" },
    });

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileNameBase}.html"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Error al exportar" }, { status: 500 });
  }
}
