import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { ActualiteCreateSchema } from "@/lib/validation-schemas";

function slugify(titre: string) {
  return titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const actualites = await prisma.actualite.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(actualites, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, ActualiteCreateSchema);
  if (!parsed.ok) return parsed.response;
  const { titre, contenu, imageUrl, dateEvenement, isPublished } = parsed.data;

  const actualite = await prisma.actualite.create({
    data: {
      titre,
      slug: `${slugify(titre)}-${Date.now().toString(36)}`,
      contenu,
      imageUrl: imageUrl || null,
      dateEvenement: dateEvenement ? new Date(dateEvenement) : null,
      isPublished: isPublished ?? true,
    },
  });

  return NextResponse.json(actualite, { status: 201 });
}

