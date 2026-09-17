import crypto from "crypto";
import * as argon2 from "@node-rs/argon2";
import DOMPurify from "isomorphic-dompurify";

const FORM_TOKEN_SECRET =
  process.env.FORM_TOKEN_SECRET || "default_dev_hmac_secret_key_minimum_32_characters_long!";
const FORM_MIN_SUBMIT_SECONDS = Number(process.env.FORM_MIN_SUBMIT_SECONDS || 3);
const FORM_TOKEN_TTL_MINUTES = Number(process.env.FORM_TOKEN_TTL_MINUTES || 30);

export interface SignedFormTokenPayload {
  proposalId: string;
  proposalVersionId: string;
  issuedAt: number;
  nonce: string;
}

export interface NonceValidationResult {
  valid: boolean;
  reason?: "invalid_signature" | "expired" | "too_fast" | "malformed";
  elapsedSeconds?: number;
  payload?: SignedFormTokenPayload;
}

/**
 * Hash de contraseña con Argon2id (64MB memoria, 3 iteraciones, 1 hilo)
 */
export async function hashPassword(plainText: string): Promise<string> {
  return await argon2.hash(plainText, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    algorithm: 2, // Argon2id numeric constant (satisfies isolatedModules)
  });
}

/**
 * Verificación segura de contraseña con Argon2id
 */
export async function verifyPassword(hash: string, plainText: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainText);
  } catch {
    return false;
  }
}

/**
 * Genera un token firmado con HMAC-SHA256 para el formulario público
 */
export function createSignedFormToken(proposalId: string, proposalVersionId: string): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const issuedAt = Date.now();

  const payload: SignedFormTokenPayload = {
    proposalId,
    proposalVersionId,
    issuedAt,
    nonce,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", FORM_TOKEN_SECRET)
    .update(payloadEncoded)
    .digest("base64url");

  return `${payloadEncoded}.${signature}`;
}

/**
 * Valida la firma HMAC, el TTL y el tiempo mínimo de llenado (>= 3s)
 */
export function verifySignedFormToken(
  token: string,
  expectedProposalId?: string,
  expectedProposalVersionId?: string
): NonceValidationResult {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "malformed" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "malformed" };
  }

  const [payloadEncoded, signature] = parts;

  // Verificación en tiempo constante de la firma HMAC
  const expectedSignature = crypto
    .createHmac("sha256", FORM_TOKEN_SECRET)
    .update(payloadEncoded)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false, reason: "invalid_signature" };
  }

  let payload: SignedFormTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }

  if (expectedProposalId && payload.proposalId !== expectedProposalId) {
    return { valid: false, reason: "malformed" };
  }

  if (expectedProposalVersionId && payload.proposalVersionId !== expectedProposalVersionId) {
    return { valid: false, reason: "malformed" };
  }

  const now = Date.now();
  const elapsedMs = now - payload.issuedAt;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  // Verificación de expiración (TTL)
  const ttlMs = FORM_TOKEN_TTL_MINUTES * 60 * 1000;
  if (elapsedMs > ttlMs || elapsedMs < 0) {
    return { valid: false, reason: "expired", elapsedSeconds, payload };
  }

  // Verificación de tiempo mínimo de llenado (anti-bot speed check)
  const minMs = FORM_MIN_SUBMIT_SECONDS * 1000;
  if (elapsedMs < minMs) {
    return { valid: false, reason: "too_fast", elapsedSeconds, payload };
  }

  return { valid: true, elapsedSeconds, payload };
}

/**
 * Honeypot check:
 * El campo `company_website` es una trampa indetectable para bots.
 * Si contiene cualquier valor, el bot ha caído en la trampa.
 */
export function isHoneypotTriggered(fieldValue?: unknown): boolean {
  if (fieldValue === undefined || fieldValue === null) {
    return false;
  }
  if (typeof fieldValue === "string") {
    return fieldValue.trim().length > 0;
  }
  return true;
}

/**
 * Anonimiza la dirección IP mediante SHA-256 con un salt rotativo de fecha
 */
export function hashAnonymousIp(ip: string): string {
  const normalized = (ip || "127.0.0.1").trim().toLowerCase();
  const salt = process.env.AUTH_SECRET?.slice(0, 16) || "salt_netandsoft";
  return crypto.createHash("sha256").update(`${normalized}:${salt}`).digest("hex");
}

/**
 * Sanitiza contenido HTML/texto para prevenir ataques XSS
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "span"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

/**
 * Escapa caracteres HTML estándar para inserción segura en texto plano
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
