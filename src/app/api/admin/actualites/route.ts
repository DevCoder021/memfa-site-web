import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(titre: string) {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/admin/actualites — toutes les actualités (publiées ou non), pour le back-office
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const actualites = await prisma.actualite.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(actualites);
}

// POST /api/admin/actualites — créer une actualité
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { titre, contenu, imageUrl, dateEvenement } = body;

  if (!titre || !contenu) {
    return NextResponse.json({ error: "Titre et contenu requis" }, { status: 400 });
  }

  const actualite = await prisma.actualite.create({
    data: {
      titre,
      slug: `${slugify(titre)}-${Date.now().toString(36)}`,
      contenu,
      imageUrl: imageUrl || null,
      dateEvenement: dateEvenement ? new Date(dateEvenement) : null,
      isPublished: true,
    },
  });

  return NextResponse.json(actualite, { status: 201 });
}