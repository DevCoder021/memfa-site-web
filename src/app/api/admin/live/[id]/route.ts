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
  const { titre, videoUrl, scheduledFor, isActive } = body;

  if (isActive) {
    await prisma.live.updateMany({
      where: { isActive: true, id: { not: id } },
      data: { isActive: false },
    });
  }

  const live = await prisma.live.update({
    where: { id },
    data: {
      titre,
      videoUrl,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isActive: !!isActive,
    },
  });

  return NextResponse.json(live);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.live.delete({ where: { id } });
  return NextResponse.json({ success: true });
}