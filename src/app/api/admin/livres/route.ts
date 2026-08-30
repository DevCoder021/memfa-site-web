import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { LivreCreateSchema } from "@/lib/validation-schemas";

export async function GET() {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const livres = await prisma.livre.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(livres, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, LivreCreateSchema);
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  const livre = await prisma.livre.create({ data });
  return NextResponse.json(livre, { status: 201 });
}

