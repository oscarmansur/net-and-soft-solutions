import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("ns_session")?.value;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  if (token) {
    await AuthService.logout(token, ip);
  }

  const response = NextResponse.json({ success: true, message: "Sesión cerrada correctamente" });
  response.cookies.delete("ns_session");
  return response;
}
