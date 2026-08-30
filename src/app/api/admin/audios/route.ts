import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseBody } from "@/lib/api-validation";
import { AudioCreateSchema } from "@/lib/validation-schemas";

export async function GET() {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const audios = await prisma.audio.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(audios, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const auth = await requireApiAdmin();
  if (!auth.ok) return auth.response;

  const parsed = await parseBody(req, AudioCreateSchema);
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  const audio = await prisma.audio.create({ data });
  return NextResponse.json(audio, { status: 201 });
}

