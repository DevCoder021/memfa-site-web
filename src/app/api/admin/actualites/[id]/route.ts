import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/actualites/:id — modifier
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { titre, contenu, imageUrl, dateEvenement, isPublished } = body;

  const actualite = await prisma.actualite.update({
    where: { id },
    data: {
      titre,
      contenu,
      imageUrl: imageUrl || null,
      dateEvenement: dateEvenement ? new Date(dateEvenement) : null,
      isPublished,
    },
  });

  return NextResponse.json(actualite);
}

// DELETE /api/admin/actualites/:id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.actualite.delete({ where: { id } });
  return NextResponse.json({ success: true });
}