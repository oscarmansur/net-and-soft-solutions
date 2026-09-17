import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}
