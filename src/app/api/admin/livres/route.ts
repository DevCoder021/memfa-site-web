import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const livres = await prisma.livre.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(livres);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { titre, auteur, description, filePath, coverImage } = body;

  if (!titre || !filePath) {
    return NextResponse.json({ error: "Titre et fichier PDF requis" }, { status: 400 });
  }

  const livre = await prisma.livre.create({
    data: { titre, auteur: auteur || null, description: description || null, filePath, coverImage: coverImage || null },
  });

  return NextResponse.json(livre, { status: 201 });
}