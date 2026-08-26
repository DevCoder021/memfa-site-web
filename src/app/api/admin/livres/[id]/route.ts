import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { titre, auteur, description, filePath, coverImage } = body;

  const livre = await prisma.livre.update({
    where: { id },
    data: { titre, auteur: auteur || null, description: description || null, filePath, coverImage: coverImage || null },
  });

  return NextResponse.json(livre);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.livre.delete({ where: { id } });
  return NextResponse.json({ success: true });
}