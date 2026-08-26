import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const lives = await prisma.live.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(lives);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { titre, videoUrl, scheduledFor, isActive } = body;

  if (!titre || !videoUrl) {
    return NextResponse.json({ error: "Titre et URL requis" }, { status: 400 });
  }

  // Un seul live actif à la fois : on désactive les autres avant de créer celui-ci
  if (isActive) {
    await prisma.live.updateMany({ where: { isActive: true }, data: { isActive: false } });
  }

  const live = await prisma.live.create({
    data: {
      titre,
      videoUrl,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isActive: !!isActive,
    },
  });

  return NextResponse.json(live, { status: 201 });
}
