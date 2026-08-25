import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const audios = await prisma.audio.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(audios);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { titre, speaker, description, filePath, duration } = body;

  if (!titre || !filePath) {
    return NextResponse.json({ error: "Titre et fichier audio requis" }, { status: 400 });
  }

  const audio = await prisma.audio.create({
    data: { titre, speaker: speaker || null, description: description || null, filePath, duration: duration || null },
  });

  return NextResponse.json(audio, { status: 201 });
}