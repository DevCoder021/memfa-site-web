import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const livres = await prisma.livre.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(livres);
}