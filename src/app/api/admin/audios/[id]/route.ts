import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { AudioUpdateSchema } from "@/lib/validation-schemas";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(req, AudioUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const data: Record<string, unknown> = {};
  if (body.titre !== undefined) data.titre = body.titre;
  if (body.speaker !== undefined) data.speaker = body.speaker || null;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.filePath !== undefined) data.filePath = body.filePath;
  if (body.coverImage !== undefined) data.coverImage = body.coverImage || null;
  if (body.duration !== undefined) data.duration = body.duration || null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide fourni" }, { status: 400 });
  }

  const audio = await prisma.audio.update({ where: { id }, data });
  return NextResponse.json(audio);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.audio.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

