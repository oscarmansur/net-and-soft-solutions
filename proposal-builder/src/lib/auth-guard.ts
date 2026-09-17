import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { Role } from "@prisma/client";

export interface AuthenticatedContext {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

export async function requireAuth(
  request: NextRequest,
  requiredRole: Role = "VIEWER"
): Promise<{ user: AuthenticatedContext["user"] } | NextResponse> {
  const sessionToken = request.cookies.get("ns_session")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "No autorizado. Inicie sesión para continuar." },
      { status: 401 }
    );
  }

  const sessionData = await AuthService.validateSession(sessionToken);
  if (!sessionData) {
    const res = NextResponse.json(
      { error: "Sesión expirada o inválida." },
      { status: 401 }
    );
    res.cookies.delete("ns_session");
    return res;
  }

  if (!AuthService.hasPermission(sessionData.user.role, requiredRole)) {
    return NextResponse.json(
      { error: "Acceso denegado. Permisos insuficientes para esta operación." },
      { status: 403 }
    );
  }

  return { user: sessionData.user };
}
