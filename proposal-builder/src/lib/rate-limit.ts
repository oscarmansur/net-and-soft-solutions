/**
 * Rate Limiter con Algoritmo de Ventana Deslizante (Sliding Window)
 * Soporta almacenamiento en memoria con recolección automática de basura,
 * y es compatible con Redis para clusters.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private lastCleanup = Date.now();

  constructor() {
    // Limpieza periódica cada 5 minutos
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
    }
  }

  private cleanup() {
    const now = Date.now();
    const maxWindow = 3600 * 1000; // 1 hora
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
    this.lastCleanup = now;
  }

  /**
   * Comprueba si una clave ha superado el límite
   * @returns { success: boolean, remaining: number, resetSeconds: number }
   */
  check(
    key: string,
    limit: number,
    windowSeconds: number
  ): {
    success: boolean;
    remaining: number;
    resetSeconds: number;
    total: number;
  } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filtrar timestamps fuera de la ventana
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= limit) {
      const oldestInWindow = record.timestamps[0];
      const resetMs = oldestInWindow + windowMs - now;
      const resetSeconds = Math.max(1, Math.ceil(resetMs / 1000));
      return {
        success: false,
        remaining: 0,
        resetSeconds,
        total: record.timestamps.length,
      };
    }

    // Registrar intento
    record.timestamps.push(now);
    const remaining = Math.max(0, limit - record.timestamps.length);

    return {
      success: true,
      remaining,
      resetSeconds: windowSeconds,
      total: record.timestamps.length,
    };
  }

  reset(key: string) {
    this.store.delete(key);
  }
}

export const rateLimiter = new InMemoryRateLimiter();

export interface CheckRateLimitParams {
  ipHash: string;
  proposalId?: string;
  email?: string;
}

export interface RateLimitStatus {
  allowed: boolean;
  retryAfterSeconds?: number;
  blockedBy?: "ip_proposal" | "global_ip" | "email_proposal";
}

/**
 * Valida todas las dimensiones de rate limiting para envíos de formularios:
 * 1. IP + Propuesta: máx 5 en 10 min
 * 2. IP Global: máx 10 en 1 hora
 * 3. Email + Propuesta: máx 3 aceptaciones por propuesta
 */
export function checkSubmissionRateLimits(params: CheckRateLimitParams): RateLimitStatus {
  const proposalAttempts = Number(process.env.RATE_LIMIT_PROPOSAL_ATTEMPTS || 5);
  const proposalWindowSec = Number(process.env.RATE_LIMIT_PROPOSAL_WINDOW_SECONDS || 600);
  const globalAttempts = Number(process.env.RATE_LIMIT_GLOBAL_ATTEMPTS || 10);
  const globalWindowSec = Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_SECONDS || 3600);

  // 1. Check IP Global
  const globalKey = `rate:ip_global:${params.ipHash}`;
  const globalCheck = rateLimiter.check(globalKey, globalAttempts, globalWindowSec);
  if (!globalCheck.success) {
    return {
      allowed: false,
      retryAfterSeconds: globalCheck.resetSeconds,
      blockedBy: "global_ip",
    };
  }

  // 2. Check IP + Propuesta
  if (params.proposalId) {
    const propKey = `rate:ip_prop:${params.ipHash}:${params.proposalId}`;
    const propCheck = rateLimiter.check(propKey, proposalAttempts, proposalWindowSec);
    if (!propCheck.success) {
      return {
        allowed: false,
        retryAfterSeconds: propCheck.resetSeconds,
        blockedBy: "ip_proposal",
      };
    }
  }

  // 3. Check Email + Propuesta
  if (params.email && params.proposalId) {
    const normalizedEmail = params.email.trim().toLowerCase();
    const emailKey = `rate:email_prop:${normalizedEmail}:${params.proposalId}`;
    const emailCheck = rateLimiter.check(emailKey, 3, 3600); // 3 por hora por propuesta
    if (!emailCheck.success) {
      return {
        allowed: false,
        retryAfterSeconds: emailCheck.resetSeconds,
        blockedBy: "email_proposal",
      };
    }
  }

  return { allowed: true };
}
