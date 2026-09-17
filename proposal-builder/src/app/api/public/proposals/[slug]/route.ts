import { NextRequest, NextResponse } from "next/server";
import { ProposalService } from "@/services/proposal.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const versionParam = request.nextUrl.searchParams.get("version");
    const versionNumber = versionParam ? Number(versionParam) : undefined;

    const data = await ProposalService.getPublicProposalBySlug(slug, versionNumber);

    if (!data) {
      return NextResponse.json(
        { error: "Propuesta no encontrada" },
        {
          status: 404,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isHistorical: Boolean(versionNumber),
      proposal: {
        id: data.proposal.id,
        proposalCode: data.proposal.proposalCode,
        slug: data.proposal.slug,
        title: data.proposal.title,
        status: data.proposal.status,
        currentVersion: data.proposal.currentVersion,
        monthlyPrice: Number(data.proposal.monthlyPrice),
        includedHours: Number(data.proposal.includedHours),
        extraHourPrice: Number(data.proposal.extraHourPrice),
        alertPercentage: data.proposal.alertPercentage,
        usedHours: Number(data.proposal.usedHours),
        rolloverEnabled: data.proposal.rolloverEnabled,
        currency: data.proposal.currency,
        billingFrequency: data.proposal.billingFrequency,
        paymentTerms: data.proposal.paymentTerms,
        validityDays: data.proposal.validityDays,
        publishedAt: data.proposal.publishedAt,
        expiresAt: data.proposal.expiresAt,
        scopeData: (data.proposal as any).scopeData,
        client: {
          tradeName: data.proposal.client.tradeName,
          legalName: data.proposal.client.legalName,
          taxId: data.proposal.client.taxId,
          contactName: data.proposal.client.contactName,
          contactPosition: data.proposal.client.contactPosition,
          email: data.proposal.client.email,
          phone: data.proposal.client.phone,
          address: data.proposal.client.address,
          numberOfUsers: data.proposal.client.numberOfUsers,
          numberOfComputers: data.proposal.client.numberOfComputers,
        },
        tools: data.proposal.tools.map((t) => ({
          name: t.name,
          category: t.category,
          description: t.description,
          supportLevel: t.supportLevel,
          included: t.included,
          includedInHours: t.includedInHours,
          requiresApproval: t.requiresApproval,
          separateQuote: t.separateQuote,
          licenseIncluded: t.licenseIncluded,
          notes: t.notes,
          displayOrder: t.displayOrder,
        })),
        activities: data.proposal.activities.map((a) => ({
          name: a.name,
          category: a.category,
          description: a.description,
          minMinutes: a.minMinutes,
          maxMinutes: a.maxMinutes,
          consumesHours: a.consumesHours,
          included: a.included,
          requiresApproval: a.requiresApproval,
          separateQuote: a.separateQuote,
          displayOrder: a.displayOrder,
        })),
      },
      activeVersion: data.activeVersion
        ? {
            id: data.activeVersion.id,
            versionNumber: data.activeVersion.versionNumber,
            publishedAt: data.activeVersion.publishedAt,
          }
        : null,
      snapshot: data.snapshot,
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Public proposal error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
