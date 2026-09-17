import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ClientService } from "@/services/client.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const client = await ClientService.getClientById(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ success: true, client });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const updated = await ClientService.updateClient(id, body, auth.user.id, ip);
    return NextResponse.json({ success: true, client: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar cliente";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  await ClientService.archiveClient(id, auth.user.id, ip);
  return NextResponse.json({ success: true, message: "Cliente archivado correctamente" });
}
