import { db } from "@/lib/db";
import { verifyPassword, hashAnonymousIp } from "@/lib/security";
import { AuditService } from "./audit.service";
import crypto from "crypto";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_MAX_AGE_HOURS = Number(process.env.SESSION_MAX_AGE_HOURS || 8);

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "SALES" | "VIEWER";
  };
  sessionToken?: string;
  error?: "invalid_credentials" | "account_locked" | "inactive_account";
  lockedUntil?: Date | null;
}

export class AuthService {
  /**
   * Autenticación segura con Argon2id y bloqueo temporal por intentos fallidos
   */
  static async login(
    email: string,
    passwordPlain: string,
    ip: string,
    userAgent?: string
  ): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const ipHash = hashAnonymousIp(ip);

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Registrar intento fallido contra usuario inexistente
      await AuditService.recordAudit({
        action: "login_failed",
        entityType: "User",
        anonymousIpHash: ipHash,
        userAgent,
        metadata: { attemptedEmail: normalizedEmail, reason: "user_not_found" },
      });
      return { success: false, error: "invalid_credentials" };
    }

    if (!user.isActive) {
      return { success: false, error: "inactive_account" };
    }

    const now = new Date();

    // Comprobar si la cuenta está bloqueada temporalmente
    if (user.lockedUntil && user.lockedUntil > now) {
      await AuditService.recordAudit({
        action: "login_blocked_lockout",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        anonymousIpHash: ipHash,
        userAgent,
        metadata: { lockedUntil: user.lockedUntil.toISOString() },
      });
      return {
        success: false,
        error: "account_locked",
        lockedUntil: user.lockedUntil,
      };
    }

    // Verificar contraseña con Argon2id
    const isPasswordValid = await verifyPassword(user.passwordHash, passwordPlain);

    if (!isPasswordValid) {
      const newFailedAttempts = user.failedLoginAttempts + 1;
      const willLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;
      const lockedUntilDate = willLock
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        : null;

      await db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newFailedAttempts,
          lockedUntil: lockedUntilDate,
        },
      });

      await AuditService.recordAudit({
        action: willLock ? "account_locked_failed_attempts" : "login_failed",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        anonymousIpHash: ipHash,
        userAgent,
        metadata: {
          failedAttempts: newFailedAttempts,
          lockedUntil: lockedUntilDate?.toISOString(),
        },
      });

      if (willLock) {
        return {
          success: false,
          error: "account_locked",
          lockedUntil: lockedUntilDate,
        };
      }

      return { success: false, error: "invalid_credentials" };
    }

    // Contraseña correcta: resetear contadores y crear sesión
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + SESSION_MAX_AGE_HOURS * 3600 * 1000);

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLoginAt: now,
          lastLoginIp: ipHash,
        },
      }),
      db.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expiresAt: sessionExpiresAt,
          ipHash,
          userAgent: userAgent?.slice(0, 500),
        },
      }),
    ]);

    await AuditService.recordAudit({
      action: "login_success",
      entityType: "User",
      entityId: user.id,
      userId: user.id,
      anonymousIpHash: ipHash,
      userAgent,
      metadata: { role: user.role },
    });

    return {
      success: true,
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Obtiene la sesión activa y valida su vigencia
   */
  static async validateSession(sessionToken?: string) {
    if (!sessionToken) return null;

    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }
    if (!session.user.isActive) return null;

    return {
      session,
      user: session.user,
    };
  }

  /**
   * Cierra la sesión activa revocando el token
   */
  static async logout(sessionToken: string, ip: string) {
    const session = await db.session.findUnique({
      where: { sessionToken },
    });
    if (session) {
      await db.session.delete({ where: { id: session.id } }).catch(() => {});
      await AuditService.recordAudit({
        action: "logout",
        entityType: "User",
        userId: session.userId,
        anonymousIpHash: hashAnonymousIp(ip),
      });
    }
  }

  /**
   * Comprueba permisos de rol
   */
  static hasPermission(
    userRole: "ADMIN" | "SALES" | "VIEWER",
    requiredRole: "ADMIN" | "SALES" | "VIEWER"
  ): boolean {
    const roleHierarchy = {
      ADMIN: 3,
      SALES: 2,
      VIEWER: 1,
    };
    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
  }
}
