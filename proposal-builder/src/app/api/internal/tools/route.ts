import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ToolService } from "@/services/tool.service";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  const tools = await ToolService.listToolDefinitions(true);
  return NextResponse.json({ success: true, tools });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    if (!body.name || !body.category || !body.description) {
      return NextResponse.json(
        { error: "Nombre, categoría y descripción son obligatorios" },
        { status: 400 }
      );
    }

    const created = await ToolService.createCustomTool(body);
    return NextResponse.json({ success: true, tool: created }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar herramienta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    if (!body.id) {
      return NextResponse.json({ error: "ID de herramienta requerido" }, { status: 400 });
    }

    const updated = await ToolService.updateTool(body.id, body);
    return NextResponse.json({ success: true, tool: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al actualizar herramienta";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
