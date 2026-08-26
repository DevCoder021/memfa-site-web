import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT — marquer comme lu et/ou enregistrer une réponse
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { isRead, reponse } = body;

  const data: Record<string, unknown> = {};
  if (typeof isRead === "boolean") data.isRead = isRead;
  if (typeof reponse === "string" && reponse.trim()) {
    data.reponse = reponse;
    data.reponduLe = new Date();
    data.reponduPar = session.user?.name ?? "admin";
    data.isRead = true;
  }

  const message = await prisma.message.update({ where: { id }, data });
  return NextResponse.json(message);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.message.delete({ where: { id } });
  return NextResponse.json({ success: true });
}