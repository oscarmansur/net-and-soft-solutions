import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { ClientService } from "@/services/client.service";
import { z } from "zod";

const createClientSchema = z.object({
  legalName: z.string().trim().min(2, "Razón social requerida"),
  tradeName: z.string().trim().min(2, "Nombre comercial requerido"),
  taxId: z.string().trim().min(4, "Identificación fiscal (RIF/NIF) requerida"),
  contactName: z.string().trim().min(2, "Nombre de contacto requerido"),
  contactPosition: z.string().trim().optional(),
  email: z.string().trim().email("Correo electrónico inválido"),
  phone: z.string().trim().min(6, "Teléfono requerido"),
  secondaryPhone: z.string().trim().optional(),
  country: z.string().trim().default("Venezuela"),
  state: z.string().trim().optional(),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),
  website: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  numberOfUsers: z.coerce.number().optional(),
  numberOfComputers: z.coerce.number().optional(),
  notes: z.string().trim().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "VIEWER");
  if (auth instanceof NextResponse) return auth;

  const search = request.nextUrl.searchParams.get("search") || undefined;
  const page = Number(request.nextUrl.searchParams.get("page") || 1);
  const limit = Number(request.nextUrl.searchParams.get("limit") || 20);

  const result = await ClientService.listClients({ search, page, limit });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "SALES");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null);
    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const client = await ClientService.createClient(parsed.data, auth.user.id, ip);

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al registrar cliente";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
