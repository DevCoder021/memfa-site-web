import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { LiveUpdateSchema } from "@/lib/validation-schemas";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(req, LiveUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const isActiveVal = body.isActive;
  if (isActiveVal) {
    await prisma.live.updateMany({
      where: { isActive: true, id: { not: id } },
      data: { isActive: false },
    });
  }

  const data: Record<string, unknown> = {};
  if (body.titre !== undefined) data.titre = body.titre;
  if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
  if (body.scheduledFor !== undefined)
    data.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor as string | Date) : null;
  if (isActiveVal !== undefined) data.isActive = !!isActiveVal;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide fourni" }, { status: 400 });
  }

  const live = await prisma.live.update({ where: { id }, data });
  return NextResponse.json(live);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.live.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

