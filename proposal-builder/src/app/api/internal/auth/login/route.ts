import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().trim().email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || undefined;

    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos incompletos" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const result = await AuthService.login(email, password, ip, userAgent);

    if (!result.success) {
      if (result.error === "account_locked") {
        const lockoutMin = result.lockedUntil
          ? Math.max(1, Math.ceil((result.lockedUntil.getTime() - Date.now()) / 60000))
          : 15;
        return NextResponse.json(
          {
            error: `Cuenta temporalmente bloqueada por reiterados intentos fallidos. Intente de nuevo en ${lockoutMin} minutos.`,
            lockedUntil: result.lockedUntil,
          },
          { status: 423 }
        );
      }
      return NextResponse.json(
        { error: "Correo electrónico o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
    const isLocalhost = request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1";
    const shouldSecure = isHttps || (process.env.NODE_ENV === "production" && !isLocalhost);
    const maxAgeSeconds = Number(process.env.SESSION_MAX_AGE_HOURS || 8) * 3600;

    response.cookies.set("ns_session", result.sessionToken!, {
      httpOnly: true,
      secure: shouldSecure,
      sameSite: "lax",
      maxAge: maxAgeSeconds,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
