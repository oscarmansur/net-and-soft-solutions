import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("ns_session")?.value;

  // Rutas administrativas protegidas
  const protectedPrefixes = [
    "/dashboard",
    "/clients",
    "/proposals",
    "/tools",
    "/audit",
    "/settings",
  ];

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Redirigir a login si intenta ingresar a una ruta protegida sin token de sesión
  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir a dashboard si ya tiene sesión y visita la página de login
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/proposals/:path*",
    "/tools/:path*",
    "/audit/:path*",
    "/settings/:path*",
    "/login",
  ],
};
