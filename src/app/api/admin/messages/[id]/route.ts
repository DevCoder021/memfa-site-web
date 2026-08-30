import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { MessageUpdateSchema } from "@/lib/validation-schemas";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const parsed = await parseBody(req, MessageUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const { isRead, reponse } = parsed.data;

  const data: Record<string, unknown> = {};
  if (typeof isRead === "boolean") data.isRead = isRead;
  if (typeof reponse === "string" && reponse.trim()) {
    data.reponse = reponse;
    data.reponduLe = new Date();
    data.reponduPar = auth.session.user?.name ?? "admin";
    data.isRead = true;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide fourni" }, { status: 400 });
  }

  const message = await prisma.message.update({ where: { id }, data });
  return NextResponse.json(message);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

