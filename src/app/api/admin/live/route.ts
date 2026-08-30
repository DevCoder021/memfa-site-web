import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { LiveCreateSchema } from "@/lib/validation-schemas";

export async function GET() {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const lives = await prisma.live.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(lives, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, LiveCreateSchema);
  if (!parsed.ok) return parsed.response;
  const { titre, videoUrl, scheduledFor, isActive } = parsed.data;

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

