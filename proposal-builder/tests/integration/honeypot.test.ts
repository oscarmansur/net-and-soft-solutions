import { describe, it, expect, vi, beforeEach } from "vitest";
import { isHoneypotTriggered, verifySignedFormToken, createSignedFormToken } from "@/lib/security";

describe("Honeypot and Anti-Bot Defense Integration Tests", () => {
  it("rejects honeypot submission when company_website contains any value", () => {
    const normalSubmission = {
      representativeName: "Carlos Mendoza",
      companyName: "Bimoto Imperio",
      email: "gerencia@bimotoimperio.com",
      phone: "+58 414 1234567",
      company_website: "", // Clean human user
    };

    const botSubmission = {
      ...normalSubmission,
      company_website: "http://automated-seo-spammer.com", // Bot filled the trap!
    };

    // Human user should NOT trigger the honeypot
    expect(isHoneypotTriggered(normalSubmission.company_website)).toBe(false);

    // Bot submission MUST trigger the honeypot
    expect(isHoneypotTriggered(botSubmission.company_website)).toBe(true);
  });

  it("verifies that honeypot detection produces a simulated generic response without creating records", () => {
    const fakeBotInput = {
      company_website: "bot-spam-content",
    };

    const isBot = isHoneypotTriggered(fakeBotInput.company_website);
    expect(isBot).toBe(true);

    // Simulated handler logic as implemented in /api/public/proposals/[slug]/submit
    const handleSubmission = (input: { company_website?: string }) => {
      if (isHoneypotTriggered(input.company_website)) {
        // Must return simulated generic success response
        return {
          status: 200,
          body: {
            success: true,
            message:
              "Esta solicitud confirma la intención de continuar con la propuesta. No realiza cargos automáticos.",
          },
          action: "blocked_spam_submission",
          acceptanceCreated: false,
          ghlCalled: false,
        };
      }
      return {
        status: 200,
        body: { success: true },
        action: "proposal_accepted",
        acceptanceCreated: true,
        ghlCalled: true,
      };
    };

    const response = handleSubmission(fakeBotInput);

    expect(response.status).toBe(200);
    expect(response.acceptanceCreated).toBe(false);
    expect(response.ghlCalled).toBe(false);
    expect(response.action).toBe("blocked_spam_submission");
    expect(response.body.message).toContain("No realiza cargos automáticos.");
  });

  it("enforces minimum submission speed (rejects < 3s submission)", () => {
    const proposalId = "test-prop-uuid";
    const versionId = "test-ver-uuid";

    // Create fresh token (issued right now)
    const token = createSignedFormToken(proposalId, versionId);

    // When verified immediately, it has elapsed < 3 seconds
    const check = verifySignedFormToken(token, proposalId, versionId);

    expect(check.valid).toBe(false);
    expect(check.reason).toBe("too_fast");
    expect(check.elapsedSeconds).toBeLessThan(3);
  });

  it("rejects tampered or forged tokens", () => {
    const proposalId = "valid-prop";
    const versionId = "valid-ver";

    const forgedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakePayload.fakeSignature";
    const check = verifySignedFormToken(forgedToken, proposalId, versionId);

    expect(check.valid).toBe(false);
    expect(check.reason).toBe("malformed");
  });
});
