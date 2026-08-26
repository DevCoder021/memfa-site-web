import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const live = await prisma.live.findFirst({ where: { isActive: true } });
  return NextResponse.json(live ?? null);
}