import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createSignedFormToken,
  verifySignedFormToken,
  isHoneypotTriggered,
  hashAnonymousIp,
  escapeHtml,
  sanitizeHtml,
} from "@/lib/security";

describe("Security and Cryptography Engine", () => {
  it("hashes password with Argon2id and verifies correctly", async () => {
    const password = "SuperSecretNetSoft2026!";
    const hash = await hashPassword(password);

    expect(hash).toContain("$argon2id$");

    const valid = await verifyPassword(hash, password);
    expect(valid).toBe(true);

    const invalid = await verifyPassword(hash, "WrongPassword!");
    expect(invalid).toBe(false);
  });

  it("creates and verifies signed form tokens with HMAC-SHA256", () => {
    const proposalId = "prop-123";
    const versionId = "ver-456";

    const token = createSignedFormToken(proposalId, versionId);
    expect(token).toContain(".");

    // Inmediatamente validado debería dar too_fast porque no han pasado 3 segundos
    const result = verifySignedFormToken(token, proposalId, versionId);
    expect(result.reason).toBe("too_fast");
    expect(result.valid).toBe(false);
  });

  it("detects tampered form token signatures", () => {
    const proposalId = "prop-123";
    const versionId = "ver-456";

    const token = createSignedFormToken(proposalId, versionId);
    const [payloadEncoded, sig] = token.split(".");

    // Alterar firma
    const tamperedSig = sig.slice(0, -4) + "XXXX";
    const tamperedToken = `${payloadEncoded}.${tamperedSig}`;

    const result = verifySignedFormToken(tamperedToken, proposalId, versionId);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("invalid_signature");
  });

  it("detects honeypot triggers accurately", () => {
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered("   ")).toBe(false);

    // Bot llenando el campo
    expect(isHoneypotTriggered("http://spam-bot.com")).toBe(true);
    expect(isHoneypotTriggered("seo services")).toBe(true);
  });

  it("hashes and anonymizes IPs consistently with salt", () => {
    const ip1 = "190.202.45.12";
    const ip2 = "190.202.45.13";

    const hash1a = hashAnonymousIp(ip1);
    const hash1b = hashAnonymousIp(ip1);
    const hash2 = hashAnonymousIp(ip2);

    expect(hash1a).toBe(hash1b);
    expect(hash1a).not.toBe(hash2);
    expect(hash1a.length).toBe(64); // SHA-256 hex length
  });

  it("escapes malicious HTML characters and prevents XSS", () => {
    const malicious = '<script>alert("XSS")</script>&foo="bar"\'baz\'';
    const escaped = escapeHtml(malicious);

    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
    expect(escaped).toContain("&amp;");
    expect(escaped).toContain("&quot;bar&quot;");

    const sanitized = sanitizeHtml('<p>Hola <b>Mundo</b><script>alert(1)</script></p>');
    expect(sanitized).toBe("<p>Hola <b>Mundo</b></p>");
  });
});
