import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const audios = await prisma.audio.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(audios);
}