import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { ActualiteUpdateSchema } from "@/lib/validation-schemas";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(req, ActualiteUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const data: Record<string, unknown> = {};
  if (body.titre !== undefined) data.titre = body.titre;
  if (body.contenu !== undefined) data.contenu = body.contenu;
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
  if (body.dateEvenement !== undefined)
    data.dateEvenement = body.dateEvenement ? new Date(body.dateEvenement as string | Date) : null;
  if (body.isPublished !== undefined) data.isPublished = body.isPublished;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide fourni" }, { status: 400 });
  }

  const actualite = await prisma.actualite.update({
    where: { id },
    data,
  });

  return NextResponse.json(actualite);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.actualite.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

